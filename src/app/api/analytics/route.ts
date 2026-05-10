import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(req.url);
    const daysParam = url.searchParams.get('days');
    const numDays = daysParam ? parseInt(daysParam, 10) : 7;

    const lastNDays = [...Array(numDays)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        date: d,
        key: d.toISOString().split('T')[0]
      };
    }).reverse();

    const startDate = lastNDays[0].date;
    startDate.setHours(0, 0, 0, 0);

    const [scores, dietLogs, tasks] = await Promise.all([
      prisma.dailyScore.findMany({
        where: { userId: session.user.id, date: { gte: startDate } },
        orderBy: { date: 'asc' }
      }),
      prisma.dietLog.findMany({
        where: { userId: session.user.id, createdAt: { gte: startDate } },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.task.findMany({
        where: { userId: session.user.id, datePlannedFor: { gte: startDate } }
      })
    ]);

    // Aggregate trends
    const trends = lastNDays.map(d => {
      const dayKey = d.key;
      const dayScore = scores.find(s => s.date.toISOString().split('T')[0] === dayKey);
      const dayLogs = dietLogs.filter(l => l.createdAt.toISOString().split('T')[0] === dayKey);
      const dayTasks = tasks.filter(t => t.datePlannedFor.toISOString().split('T')[0] === dayKey);
      
      const dayCalories = dayLogs.reduce((acc, l) => acc + l.calories, 0);
      const totalTasks = dayTasks.length;
      const completedTasks = dayTasks.filter(t => t.isCompleted).length;

      const dateObj = d.date;
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const label = `${dateObj.getDate()} ${months[dateObj.getMonth()]}`;

      return {
        date: dayKey,
        label,
        calories: dayCalories,
        taskIntegrity: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        score: dayScore?.productivityScore || 0
      };
    });

    return NextResponse.json({ trends });
  } catch (error) {
    console.error('ANALYTICS_FAILURE:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
