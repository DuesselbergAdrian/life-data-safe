# 📡 API Reference

Complete API documentation for Health Vault integrations.

---

## Base URLs

- **Frontend**: `https://your-app.lovable.app`
- **Edge Functions**: `https://yoqsviiqmkdeurzipdmq.supabase.co/functions/v1`
- **Database API**: `https://yoqsviiqmkdeurzipdmq.supabase.co/rest/v1`

---

## Authentication

All API requests require authentication via JWT tokens.

### Headers

```http
Authorization: Bearer YOUR_JWT_TOKEN
apikey: YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
```

### Get Auth Token (Client-Side)

```typescript
import { supabase } from '@/integrations/supabase/client';

const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

---

## Edge Functions API

### 1. Analyze Health Data

Process health metrics via Dust AI agent.

**Endpoint**: `POST /functions/v1/analyze-health-data`

**Request Body:**
```json
{
  "metrics": [
    {
      "type": "steps",
      "value": 8500,
      "timestamp": "2024-01-15T10:00:00Z"
    },
    {
      "type": "heart_rate",
      "value": 72,
      "timestamp": "2024-01-15T10:00:00Z"
    }
  ],
  "timeframe": "7d",
  "user_context": {
    "age": 32,
    "goals": ["weight_loss", "better_sleep"]
  }
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "action": "Increase daily steps to 10,000",
      "why": "You're below your target by 15%",
      "priority": "medium",
      "impact": "+10% calorie burn"
    }
  ],
  "risk_factors": [
    {
      "factor": "Inconsistent sleep schedule",
      "severity": "low",
      "trend": "improving"
    }
  ],
  "trends": {
    "steps": {
      "direction": "up",
      "change_percent": 8.5,
      "prediction_7d": 9200
    }
  },
  "action_items": [
    {
      "title": "Evening walk routine",
      "description": "Add a 15-min walk after dinner",
      "category": "activity"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid auth
- `500 Internal Server Error` - Processing failed

---

### 2. Chat with AI Health Coach

Conversational interface powered by OpenAI.

**Endpoint**: `POST /functions/v1/chat-with-ai`

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Why am I feeling tired lately?"
    }
  ],
  "context": {
    "recent_metrics": {
      "sleep_hours": 6.2,
      "stress_level": "high",
      "activity_level": "low"
    }
  }
}
```

**Response (Streaming):**
```
data: {"delta": "Based on your recent sleep data"}
data: {"delta": ", you've been averaging only 6.2 hours"}
data: {"delta": " per night..."}
data: [DONE]
```

**Client-Side Usage:**
```typescript
const response = await fetch(`${SUPABASE_URL}/functions/v1/chat-with-ai`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ messages })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.delta) {
        // Append to UI
      }
    }
  }
}
```

---

### 3. Process Meta Glasses Video

Analyze video footage for health context.

**Endpoint**: `POST /functions/v1/process-meta-glasses-video`

**Request (multipart/form-data):**
```http
POST /functions/v1/process-meta-glasses-video
Content-Type: multipart/form-data

video: [binary video file]
analysis_type: "full" | "activity_only" | "environment_only"
```

**Response:**
```json
{
  "video_id": "uuid-here",
  "duration_seconds": 120,
  "analysis": {
    "activities": [
      {
        "type": "walking",
        "duration_seconds": 45,
        "intensity": "moderate",
        "timestamp_start": 0
      },
      {
        "type": "social_interaction",
        "duration_seconds": 60,
        "participants_count": 3,
        "timestamp_start": 45
      }
    ],
    "environment": {
      "lighting": "bright_daylight",
      "noise_level": "moderate",
      "indoor_outdoor": "outdoor",
      "screen_time_detected": false
    },
    "health_indicators": {
      "stress_level": "low",
      "mood_estimate": "positive",
      "physical_activity_minutes": 15,
      "social_engagement_score": 8
    },
    "recommendations": [
      {
        "action": "Great job staying active outdoors!",
        "why": "Natural light exposure improves mood and sleep quality"
      }
    ]
  },
  "metadata": {
    "processed_at": "2024-01-15T11:30:00Z",
    "model_version": "v2.1",
    "confidence_score": 0.89
  }
}
```

**File Requirements:**
- **Format**: MP4, MOV, AVI
- **Max Size**: 100MB
- **Max Duration**: 5 minutes
- **Resolution**: 720p or higher recommended

---

## Database API (PostgREST)

### Health Metrics

**List Metrics**
```http
GET /rest/v1/health_metrics?user_id=eq.{user_id}&order=recorded_at.desc&limit=100
```

**Create Metric**
```http
POST /rest/v1/health_metrics
Content-Type: application/json

{
  "metric_type": "steps",
  "value": 8500,
  "unit": "steps",
  "recorded_at": "2024-01-15T10:00:00Z",
  "source": "apple_watch",
  "metadata": {
    "device_model": "Apple Watch Series 9",
    "sync_quality": "high"
  }
}
```

**Filter by Date Range**
```http
GET /rest/v1/health_metrics?recorded_at=gte.2024-01-01&recorded_at=lte.2024-01-31
```

---

### Devices

**List Connected Devices**
```http
GET /rest/v1/devices?user_id=eq.{user_id}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "device_type": "apple_watch",
    "device_name": "John's Apple Watch",
    "last_sync": "2024-01-15T10:00:00Z",
    "sync_status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**Update Device**
```http
PATCH /rest/v1/devices?id=eq.{device_id}
Content-Type: application/json

{
  "last_sync": "2024-01-15T12:00:00Z",
  "sync_status": "active"
}
```

---

### Consents

**Get User Consents**
```http
GET /rest/v1/consents?user_id=eq.{user_id}
```

**Grant Consent**
```http
POST /rest/v1/consents
Content-Type: application/json

{
  "consent_type": "research_participation",
  "granted": true,
  "granted_at": "2024-01-15T10:00:00Z",
  "details": {
    "study_name": "Sleep Quality Research",
    "data_shared": ["sleep", "heart_rate"],
    "duration_months": 12
  }
}
```

---

## External APIs

### Dust AI Agent API

**Base URL**: `https://dust.tt/api/v1`

**Run Agent**
```http
POST /run
Authorization: Bearer DUST_API_KEY
Content-Type: application/json

{
  "agent_id": "health-insights-v2",
  "input": {
    "metrics": [...],
    "context": {...}
  },
  "stream": false
}
```

**Response:**
```json
{
  "run_id": "run_abc123",
  "status": "success",
  "output": {
    "recommendations": [...],
    "insights": [...]
  },
  "usage": {
    "tokens": 1250,
    "cost_usd": 0.015
  }
}
```

---

### OpenAI API

**Base URL**: `https://api.openai.com/v1`

**Chat Completions**
```http
POST /chat/completions
Authorization: Bearer OPENAI_API_KEY
Content-Type: application/json

{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are a health coach..."
    },
    {
      "role": "user",
      "content": "How can I improve my sleep?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

---

## Webhooks

### Device Sync Webhook

Receive notifications when devices sync.

**Endpoint**: You provide your endpoint URL in settings

**Payload:**
```json
{
  "event": "device.synced",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": {
    "user_id": "uuid",
    "device_id": "uuid",
    "device_type": "apple_watch",
    "metrics_count": 150,
    "sync_status": "success"
  }
}
```

**Verification:**
```http
X-Webhook-Signature: sha256=...
```

Verify with:
```typescript
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(JSON.stringify(payload))
  .digest('hex');
```

---

## Rate Limits

### Edge Functions
- **Anonymous**: 60 requests/minute
- **Authenticated**: 300 requests/minute
- **Premium**: 1000 requests/minute

### Database API
- **Read**: 1000 requests/minute
- **Write**: 100 requests/minute

### External APIs
- **Dust**: Per workspace limits (check Dust dashboard)
- **OpenAI**: Per API key limits (check OpenAI dashboard)

---

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "invalid_input",
    "message": "Metric type must be one of: steps, heart_rate, sleep, ...",
    "details": {
      "field": "metric_type",
      "value": "invalid_type"
    }
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `invalid_input` | Request validation failed |
| `unauthorized` | Missing or invalid auth token |
| `forbidden` | Insufficient permissions |
| `not_found` | Resource doesn't exist |
| `rate_limited` | Too many requests |
| `server_error` | Internal server error |

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import { supabase } from '@/integrations/supabase/client';

// Create health metric
const { data, error } = await supabase
  .from('health_metrics')
  .insert({
    metric_type: 'steps',
    value: 8500,
    recorded_at: new Date().toISOString(),
    source: 'manual'
  });

// Call edge function
const { data: insights } = await supabase.functions.invoke('analyze-health-data', {
  body: { metrics: [...], timeframe: '7d' }
});

// Subscribe to real-time updates
const channel = supabase
  .channel('health_updates')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'health_metrics' },
    (payload) => console.log('New metric:', payload.new)
  )
  .subscribe();
```

---

## Postman Collection

Import our Postman collection for easy API testing:

```json
{
  "info": {
    "name": "Health Vault API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Analyze Health Data",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/functions/v1/analyze-health-data",
        "header": [
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"metrics\": [...]\n}"
        }
      }
    }
  ]
}
```

---

## GraphQL (Future)

GraphQL API coming soon for more flexible queries:

```graphql
query GetHealthMetrics($userId: UUID!, $startDate: DateTime!) {
  healthMetrics(
    where: { userId: { _eq: $userId }, recordedAt: { _gte: $startDate } }
    orderBy: { recordedAt: DESC }
    limit: 100
  ) {
    id
    metricType
    value
    unit
    recordedAt
    source
  }
}
```

---

<div align="center">
  <strong>Complete API documentation for seamless integration</strong>
</div>
