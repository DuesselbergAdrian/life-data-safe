# 🏗️ Technical Architecture

## System Overview

Health Vault is built on a modern, scalable architecture leveraging serverless functions, real-time databases, and AI orchestration.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  React SPA + TypeScript + Tailwind CSS + shadcn/ui              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTPS/WSS
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                    API Gateway Layer                             │
│              Lovable Cloud (Supabase)                            │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐            │
│  │   PostgREST  │  │  Edge Funcs  │  │  Realtime   │            │
│  │     API      │  │   (Deno)     │  │  WebSocket  │            │
│  └─────────────┘  └──────────────┘  └─────────────┘            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌─────────┐ ┌──────────────┐
│  PostgreSQL  │ │ Storage │ │  Auth        │
│  Database    │ │ Buckets │ │  (GoTrue)    │
└──────────────┘ └─────────┘ └──────────────┘
        │
        │ External APIs
        │
┌───────▼──────────────────────────────────────────────────────────┐
│                    External AI Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐        │
│  │  Dust Agent  │  │  OpenAI GPT  │  │  Meta Glasses   │        │
│  │  Processing  │  │  API         │  │  Video API      │        │
│  └──────────────┘  └──────────────┘  └─────────────────┘        │
└───────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App
├── Landing (Marketing)
├── Auth (Login/Signup)
├── Onboarding
│   ├── ProfileStep
│   ├── DeviceStep
│   ├── ConsentStep
│   └── VideoStep
└── Dashboard
    ├── OverviewTab
    │   ├── SummaryCard
    │   ├── BenchmarkedMetricCard
    │   ├── DayTimeline
    │   ├── AIInsights
    │   ├── TipsList
    │   └── AgentHandoff
    ├── TrendsTab (Health Metrics Charts)
    ├── SocialTab
    │   ├── Leaderboards
    │   ├── Communities
    │   ├── CollectiveImpact
    │   └── PrivateCircle
    ├── SyncTab (Device Management)
    └── DataVaultTab
        ├── MyDataTimeline
        ├── ActivityDataTable
        ├── DevicesTab
        ├── ConsentsManager
        ├── RewardsImpact
        └── ExportDelete
```

### State Management

**TanStack Query (React Query)**
- Server state synchronization
- Automatic caching and refetching
- Optimistic updates
- Real-time subscriptions

**Local State**
- React hooks (useState, useReducer)
- Component-level state
- Form state (React Hook Form)

### Routing

**React Router v6**
- Client-side routing
- Protected routes with auth checks
- Lazy loading for code splitting

---

## Backend Architecture

### Database Design

**PostgreSQL with Row Level Security (RLS)**

#### Key Tables

**`profiles`**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

**`health_metrics`**
```sql
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  metric_type TEXT NOT NULL, -- 'steps', 'heart_rate', 'sleep', etc.
  value NUMERIC NOT NULL,
  unit TEXT,
  recorded_at TIMESTAMPTZ NOT NULL,
  source TEXT, -- 'apple_watch', 'fitbit', 'manual', etc.
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_metrics_user_type_time 
  ON health_metrics(user_id, metric_type, recorded_at DESC);
```

**`devices`**
```sql
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  device_type TEXT NOT NULL,
  device_name TEXT,
  last_sync TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'pending',
  oauth_token_encrypted TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`consents`**
```sql
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  consent_type TEXT NOT NULL, -- 'research', 'third_party', 'marketing'
  granted BOOLEAN DEFAULT FALSE,
  granted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  details JSONB
);
```

### Edge Functions

**Deno Runtime (TypeScript)**

#### `analyze-health-data`
```typescript
// Processes raw health data via Dust AI agent
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { metrics, timeframe } = await req.json();
  
  // Call Dust AI agent
  const dustResponse = await fetch('https://dust.tt/api/v1/run', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('DUST_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      agent_id: 'health-insights-v2',
      input: { metrics, timeframe }
    })
  });
  
  const insights = await dustResponse.json();
  
  return new Response(JSON.stringify(insights), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

#### `chat-with-ai`
```typescript
// OpenAI conversational interface
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { messages } = await req.json();
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a health coach...' },
        ...messages
      ],
      stream: true
    })
  });
  
  // Stream response back to client
  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
});
```

#### `process-meta-glasses-video`
```typescript
// Analyzes Meta smart glasses video footage
serve(async (req) => {
  const formData = await req.formData();
  const videoFile = formData.get('video');
  
  // Upload to storage
  const { data: upload } = await supabase.storage
    .from('videos')
    .upload(`${userId}/${timestamp}.mp4`, videoFile);
  
  // Send to Dust agent for analysis
  const analysis = await fetch('https://dust.tt/api/v1/run', {
    method: 'POST',
    body: JSON.stringify({
      agent_id: 'video-context-analyzer',
      input: { video_url: upload.path }
    })
  });
  
  return new Response(JSON.stringify(analysis));
});
```

---

## AI Integration Architecture

### Dust AI Agent Pipeline

**Agent Configuration:**
```yaml
agent_id: health-insights-v2
description: Analyzes multi-modal health data
inputs:
  - wearable_metrics: Array<HealthMetric>
  - video_context: VideoAnalysis (optional)
  - user_profile: UserProfile
  - historical_data: TimeSeriesData
outputs:
  - recommendations: Array<Recommendation>
  - risk_factors: Array<RiskFactor>
  - trends: TrendAnalysis
  - action_items: Array<ActionItem>
```

**Data Flow:**
1. Raw data collected from wearables/manual input
2. Preprocessed and normalized in edge function
3. Sent to Dust agent with user context
4. Agent orchestrates multiple AI models (OpenAI, specialized health models)
5. Structured insights returned
6. Stored in database + displayed in UI

### OpenAI Integration

**Use Cases:**
1. **Conversational Health Coaching**
   - Model: GPT-4
   - Context: User health history + current metrics
   - Output: Natural language advice and answers

2. **Smart Recommendations**
   - Model: GPT-4
   - Input: Health trends + benchmarks
   - Output: Personalized action items

3. **Data Interpretation**
   - Model: GPT-4
   - Input: Complex health reports
   - Output: Plain language summaries

---

## Security Architecture

### Authentication Flow

```
User → Supabase Auth → JWT Token → RLS Policies → Data Access
```

**Auth Methods:**
- Email/Password (with email verification)
- Google OAuth
- Apple Sign In (future)
- Magic Link (future)

### Authorization (RLS Policies)

Every table has policies like:
```sql
-- Users can only see their own data
CREATE POLICY "user_select_own" ON health_metrics
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own data
CREATE POLICY "user_insert_own" ON health_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Data Encryption

- **At Rest**: PostgreSQL transparent data encryption
- **In Transit**: TLS 1.3 for all connections
- **Secrets**: Environment variables in secure vault
- **OAuth Tokens**: Encrypted before storage

---

## Performance Optimizations

### Frontend

- **Code Splitting**: Dynamic imports for routes
- **Image Optimization**: Lazy loading, WebP format
- **Bundle Analysis**: Vite rollup optimization
- **Caching**: Service worker + TanStack Query cache

### Backend

- **Database Indexes**: Composite indexes on frequent queries
- **Connection Pooling**: PgBouncer for efficient connections
- **Edge Caching**: CDN for static assets
- **Query Optimization**: Explain analyze on complex queries

### Real-time Updates

```typescript
// Supabase Realtime for live data sync
const subscription = supabase
  .channel('health_metrics')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'health_metrics' },
    (payload) => {
      // Update UI optimistically
      queryClient.setQueryData(['health_metrics'], old => [...old, payload.new]);
    }
  )
  .subscribe();
```

---

## Scalability Considerations

### Current Architecture
- **Users**: Supports 10K+ concurrent users
- **Data**: Handles millions of health metric records
- **Throughput**: 1000+ requests/second

### Future Scaling
- **Database**: Read replicas for analytics queries
- **Functions**: Auto-scaling edge functions
- **Storage**: CDN distribution for media files
- **AI**: Rate limiting + caching for AI responses

---

## Monitoring & Observability

### Metrics Tracked
- **Performance**: Response times, error rates
- **Usage**: Active users, feature adoption
- **Health**: Database performance, function invocations
- **Business**: User retention, data sync success rates

### Tools
- Supabase Dashboard (logs, metrics)
- Edge function logs (Deno)
- Client-side error tracking (future: Sentry)

---

## Deployment Architecture

### Environments

**Development**
- Local: `npm run dev`
- Hot reload, dev tools enabled

**Staging**
- Auto-deploy from `main` branch
- Full feature parity with production
- Used for QA testing

**Production**
- Manual deploy trigger
- CDN-cached static assets
- Database backups every 6 hours

### CI/CD Pipeline

```yaml
# Automatic via Lovable
Push to main → Build → Test → Deploy to Staging
Manual trigger → Deploy to Production
```

---

## Technology Decisions

### Why Lovable Cloud (Supabase)?
- **Speed**: Zero-config backend setup
- **Security**: Built-in RLS and auth
- **Scalability**: Proven at scale
- **DX**: Excellent developer experience

### Why Dust for AI?
- **Orchestration**: Manages complex AI workflows
- **Flexibility**: Supports multiple AI providers
- **Context**: Better context management than raw LLM APIs
- **Reliability**: Production-grade error handling

### Why OpenAI?
- **Quality**: Best-in-class language models
- **Versatility**: Wide range of use cases
- **Ecosystem**: Rich tooling and libraries
- **Support**: Comprehensive documentation

### Why React + TypeScript?
- **Type Safety**: Catch errors at compile time
- **Developer Experience**: Excellent tooling
- **Community**: Massive ecosystem
- **Performance**: Fast with modern optimizations

---

## Future Architecture Enhancements

1. **Microservices**: Split large edge functions
2. **Event Streaming**: Kafka/Redis for real-time analytics
3. **ML Models**: Custom health prediction models
4. **GraphQL**: Unified API layer
5. **Mobile Apps**: React Native for iOS/Android
6. **Offline Support**: PWA with local-first sync

---

<div align="center">
  <strong>Built for scale, designed for developers</strong>
</div>
