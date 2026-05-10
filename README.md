# KINETIC Performance OS

*Formerly known as the Discipline Engine.*

**KINETIC Performance OS** is a robust, data-driven productivity and fitness platform designed for high-performance individuals. Evolving beyond a standard fitness tracker, this system integrates an intelligent AI feedback loop, game-like progression mechanics, and a frictionless, high-fidelity user interface.

## 🚀 Features

### Core Systems
- **XP-to-Level Progression Engine**: Gamified productivity with automated level rollover logic tied to task completion and habit tracking.
- **AI Feedback Loop**: Intelligent daily snapshots providing real-time task feedback, end-of-day performance evaluations, and actionable weekly trend insights to ensure consistency.

### Nutrition & Diet
- **Intelligent Nutrition Engine**: Frictionless meal logging featuring "Repeat Last Meal" and "Frequent Foods" logic.
- **Global Protocols**: Expanded nutrition database containing Indian performance protocols alongside standard macros.
- **AI Diet Parser**: Automated natural language diet parsing and logging.

### Training & Workouts
- **High-Fidelity Training Terminal**: A fully immersive, gym-themed industrial environment utilizing cinematic textures and a premium dark glassmorphic design.
- **Friction-Free Tracking**: Smart autofill and automatic Personal Record (PR) highlighting to optimize UX for high-frequency tasks.

### Analytics & AI Agents
- **Managed AI Agents**: Integration with specialized Anthropic Managed Agents (API Designer, Data Analyst) for generating insights and automating workflows.
- **Telemetry & Event Tracking**: Event-based telemetry wired to support Amplitude analytics for deep insights into behavioral trends.

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion
- **Backend**: Next.js API Routes, NextAuth for secure authentication
- **Database**: Prisma ORM
- **Architecture**: A modular, agent-driven design focusing on high-performance APIs and data integrity.

## 🏁 Getting Started

### Prerequisites
- Node.js (v20+)
- Postgres (or your configured Prisma database provider)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   Ensure your `.env` is configured with your database URL, then run migrations and seed the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧠 Design Philosophy

The transition from the "Discipline Engine" to the **KINETIC Performance OS** emphasizes visual excellence and operational speed. The UI has undergone a complete overhaul to eliminate generic components, utilizing modern typography, dark modes, and subtle micro-animations to create an interface that feels responsive, alive, and professional-grade.
