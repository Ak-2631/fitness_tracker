import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './Providers';
import { AppLayout } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Discipline Engine | Gamified Productivity & Diet',
  description: 'A premium, structured discipline system to plan your day, execute tasks, and track your diet with honest AI feedback.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}
