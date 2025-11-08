# 🏥 Health Vault

> *Your Personal Health Data Hub - Powered by AI*

A comprehensive health data aggregation and insights platform that transforms wearable data, video observations, and manual uploads into actionable health intelligence.

![Health Vault Dashboard](https://img.shields.io/badge/Status-Active-success)
![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-purple)
![OpenAI Powered](https://img.shields.io/badge/AI-OpenAI-00A67E)
![Dust Agent](https://img.shields.io/badge/Agent-Dust-blue)

---

## 🌟 Overview

Health Vault is an intelligent health management platform that unifies data from multiple sources—wearables, smart glasses, manual uploads—and uses AI to deliver personalized health insights, recommendations, and community-driven wellness experiences.

### Key Features

- 📊 **Unified Health Dashboard** - Aggregate data from multiple wearables and devices
- 🤖 **AI-Powered Insights** - Real-time health recommendations via Dust AI agents and OpenAI
- 👓 **Meta Glasses Integration** - Analyze video footage for contextual health insights
- 🏆 **Social Impact** - Compete on leaderboards, join communities, track collective impact
- 🔐 **Data Sovereignty** - Full control over your health data with granular consent management
- 📈 **Trend Analysis** - Visualize health metrics over time with beautiful charts
- 💾 **Custom Uploads** - Manually add health records, lab results, and notes

---

## 🛠️ Technology Stack

### Partner Technologies

- **[Lovable](https://lovable.dev)** - Full-stack development platform with integrated backend (Supabase)
- **[OpenAI](https://openai.com)** - GPT models for conversational AI and code assistance
- **[Dust](https://dust.tt)** - AI agent orchestration for processing health data and generating insights

### Core Technologies

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui components |
| **Backend** | Lovable Cloud (Supabase) |
| **Database** | PostgreSQL with Row Level Security |
| **Authentication** | Supabase Auth |
| **Storage** | Supabase Storage for files |
| **Edge Functions** | Deno runtime serverless functions |
| **AI/ML** | OpenAI GPT-5, Dust AI Agents |
| **Data Viz** | Recharts |
| **State Management** | TanStack Query (React Query) |
| **Forms** | React Hook Form + Zod validation |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd health-vault

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### For Hackathon Judges

```bash
# Quick setup for evaluation
git clone <YOUR_GIT_URL> && cd health-vault && npm i && npm run dev
```

---

## 📁 Project Structure

```
health-vault/
├── src/
│   ├── components/
│   │   ├── dashboard/          # Main dashboard components
│   │   │   ├── overview/       # Health overview widgets
│   │   │   ├── social/         # Community & leaderboards
│   │   │   └── vault/          # Data management
│   │   ├── onboarding/         # User onboarding flow
│   │   └── ui/                 # Reusable UI components (shadcn)
│   ├── pages/
│   │   ├── Dashboard.tsx       # Main dashboard layout
│   │   ├── Landing.tsx         # Marketing landing page
│   │   └── Onboarding.tsx      # User setup wizard
│   ├── integrations/
│   │   └── supabase/           # Database client & types
│   ├── lib/
│   │   ├── benchmarks.ts       # Health metrics benchmarking
│   │   └── utils.ts            # Utility functions
│   └── hooks/                  # Custom React hooks
├── supabase/
│   ├── functions/              # Edge functions (Dust API, AI processing)
│   └── config.toml             # Supabase configuration
└── docs/                       # Additional documentation
```

---

## 🎯 Core Features

### 1. Health Data Aggregation
- Connect multiple wearables (Apple Watch, Fitbit, Oura Ring, etc.)
- Sync automatically via OAuth integrations
- Manual CSV/JSON upload support
- Meta Ray-Ban smart glasses video analysis

### 2. AI-Powered Insights

**Dust AI Agent Pipeline:**
```
Wearable Data → Dust Agent → Analysis → Insights
Video Data → Dust Agent → Context Extraction → Recommendations
Manual Uploads → Dust Agent → Health Assessment → Action Items
```

**OpenAI Integration:**
- Conversational health coaching
- Natural language health queries
- Personalized recommendation generation
- Code assistance for data transformations

### 3. Social & Gamification
- Community challenges and leaderboards
- Private circles for family/friends
- Collective impact tracking
- Achievement badges and milestones

### 4. Data Privacy & Control
- Granular consent management
- Data export (JSON, CSV)
- Account deletion with full data purge
- Zero-knowledge architecture options

---

## 🔌 API Integrations

### Dust AI Agent API

The Dust API processes raw health data and returns structured insights:

```typescript
// Edge function: supabase/functions/analyze-health-data
const response = await fetch('https://dust.tt/api/v1/run', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DUST_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    agent_id: 'health-insights-agent',
    input: {
      wearable_data: healthMetrics,
      video_context: metaGlassesData,
      user_profile: userContext
    }
  })
});

const insights = await response.json();
// Returns: { recommendations, risk_factors, trends, action_items }
```

### Meta Glasses Video Analysis

See [META_GLASSES_API_SPEC.md](./META_GLASSES_API_SPEC.md) for detailed API documentation.

**Key Capabilities:**
- Activity detection (walking, exercising, social interaction)
- Environmental context (lighting, noise, screen time)
- Health indicators (stress levels, posture, physical activity)
- Automated health recommendations

### OpenAI Integration

Used for:
- Natural language health queries
- Personalized coaching conversations
- Data interpretation assistance
- Custom report generation

---

## 🗄️ Database Schema

### Core Tables

- `profiles` - User profiles and preferences
- `health_metrics` - Time-series health data
- `devices` - Connected wearables and their sync status
- `consents` - Data sharing permissions
- `communities` - Social groups and challenges
- `activities` - User activity log

All tables protected with Row Level Security (RLS) policies.

---

## 🔐 Security & Privacy

- **Authentication**: Email/password + OAuth (Google, Apple)
- **Authorization**: Row Level Security on all tables
- **Data Encryption**: At rest and in transit (TLS 1.3)
- **Compliance**: HIPAA-ready architecture, GDPR compliant
- **Audit Logs**: All data access tracked

---

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables

Automatically configured via Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### Adding New Features

1. Create components in `src/components/`
2. Add database tables via Lovable Cloud dashboard
3. Implement edge functions in `supabase/functions/`
4. Update types in `src/integrations/supabase/types.ts` (auto-generated)

---

## 🎨 Design System

Built with a comprehensive design system using semantic tokens:

- **Colors**: HSL-based theme variables in `src/index.css`
- **Components**: shadcn/ui with custom variants
- **Typography**: System font stack with custom scales
- **Spacing**: Consistent 8px grid system
- **Animations**: Tailwind animate utilities

---

## 📊 Performance

- **First Load**: < 2s on 3G
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: < 500KB gzipped

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

Built with ❤️ for [Hackathon Name] by [Team Name]

---

## 🙏 Acknowledgments

- **Lovable** - For the incredible full-stack development platform
- **OpenAI** - For powering our AI features and coding assistance
- **Dust** - For advanced AI agent orchestration
- **Supabase** - For the robust backend infrastructure
- **shadcn/ui** - For beautiful, accessible component primitives

---

## 📚 Additional Documentation

- [Technical Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Meta Glasses Integration](./META_GLASSES_API_SPEC.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

---

## 🔗 Links

- **Live Demo**: [your-demo-url.lovable.app](https://your-demo-url.lovable.app)
- **Video Demo**: [YouTube/Loom Link]
- **Presentation**: [Slides Link]

---

<div align="center">
  <strong>Made with Lovable, OpenAI, and Dust</strong>
  <br>
  <sub>Transforming health data into actionable insights</sub>
</div>
