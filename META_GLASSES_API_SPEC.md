# Meta Glasses Video Analysis API Specification

## Endpoint
`POST /api/analyze-glasses-video`

## Request
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Body**: Video file from Meta Ray-Ban or Oakley Meta glasses

```javascript
const formData = new FormData();
formData.append('video', videoFile);

const response = await fetch('/api/analyze-glasses-video', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

## Expected Response Structure

```json
{
  "recommendations": [
    {
      "id": "rec_001",
      "type": "exercise",
      "title": "Increase daily movement",
      "description": "Based on your activity patterns, consider adding 15 minutes of walking after meals",
      "priority": "medium",
      "evidence": ["low_step_count", "extended_sitting_periods"]
    },
    {
      "id": "rec_002",
      "type": "sleep",
      "title": "Optimize sleep schedule",
      "description": "Your sleep consistency could improve. Try maintaining the same bedtime",
      "priority": "high",
      "evidence": ["irregular_sleep_times", "morning_fatigue_indicators"]
    },
    {
      "id": "rec_003",
      "type": "nutrition",
      "title": "Hydration reminder",
      "description": "Video analysis suggests low hydration levels. Aim for 8 glasses daily",
      "priority": "low",
      "evidence": ["environment_indicators", "activity_level"]
    }
  ],
  "activities": [
    {
      "id": "act_001",
      "type": "walking",
      "start_time": "2025-01-08T14:30:00Z",
      "end_time": "2025-01-08T15:15:00Z",
      "duration_minutes": 45,
      "intensity": "moderate",
      "location": "outdoor",
      "steps_estimated": 5200,
      "calories_burned": 220
    },
    {
      "id": "act_002",
      "type": "social_interaction",
      "start_time": "2025-01-08T12:00:00Z",
      "end_time": "2025-01-08T12:45:00Z",
      "duration_minutes": 45,
      "participants_count": 3,
      "interaction_quality": "positive"
    }
  ],
  "health_metrics": {
    "stress_indicators": {
      "level": "low",
      "confidence": 0.78,
      "factors": ["calm_environment", "steady_movements", "positive_interactions"]
    },
    "mood_assessment": {
      "primary_mood": "content",
      "confidence": 0.82,
      "secondary_moods": ["engaged", "focused"]
    },
    "environmental_context": {
      "lighting": "natural_bright",
      "noise_level": "moderate",
      "setting": "outdoor_urban"
    },
    "physical_indicators": {
      "posture_quality": "good",
      "movement_steadiness": "stable",
      "fatigue_level": "low"
    },
    "screen_time_estimate": {
      "duration_minutes": 12,
      "context": "navigation_and_photos"
    }
  },
  "metadata": {
    "video_duration_seconds": 180,
    "analysis_timestamp": "2025-01-08T16:00:00Z",
    "model_version": "v2.1.0",
    "confidence_score": 0.85
  }
}
```

## Field Descriptions

### Recommendations Array
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier for the recommendation |
| type | string | Category: "exercise", "sleep", "nutrition", "mental_health", "social" |
| title | string | Short, actionable title |
| description | string | Detailed explanation and suggestion |
| priority | string | "low", "medium", "high" |
| evidence | string[] | List of factors that led to this recommendation |

### Activities Array
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier for the activity |
| type | string | Activity type: "walking", "running", "social_interaction", "eating", "working", etc. |
| start_time | string (ISO 8601) | Activity start timestamp |
| end_time | string (ISO 8601) | Activity end timestamp |
| duration_minutes | number | Duration in minutes |
| intensity | string | "light", "moderate", "vigorous" (for physical activities) |
| location | string | "indoor", "outdoor", "urban", "nature", etc. |
| steps_estimated | number | (Optional) Estimated steps for movement activities |
| calories_burned | number | (Optional) Estimated calories burned |
| participants_count | number | (Optional) Number of people in social interactions |
| interaction_quality | string | (Optional) "positive", "neutral", "negative" |

### Health Metrics Object

#### stress_indicators
- **level**: "low", "moderate", "high"
- **confidence**: 0.0 - 1.0
- **factors**: Array of contributing factors

#### mood_assessment
- **primary_mood**: Main detected mood (e.g., "happy", "content", "stressed", "tired")
- **confidence**: 0.0 - 1.0
- **secondary_moods**: Array of additional mood indicators

#### environmental_context
- **lighting**: "dim", "artificial", "natural_bright", "natural_overcast"
- **noise_level**: "quiet", "moderate", "loud"
- **setting**: "indoor_home", "indoor_office", "outdoor_urban", "outdoor_nature"

#### physical_indicators
- **posture_quality**: "excellent", "good", "fair", "poor"
- **movement_steadiness**: "stable", "slightly_unsteady", "unsteady"
- **fatigue_level**: "low", "moderate", "high"

#### screen_time_estimate
- **duration_minutes**: Number of minutes with screen detected
- **context**: Brief description of screen usage

### Metadata Object
- **video_duration_seconds**: Length of analyzed video
- **analysis_timestamp**: When the analysis was completed (ISO 8601)
- **model_version**: Version of the analysis model used
- **confidence_score**: Overall confidence in the analysis (0.0 - 1.0)

## Error Responses

```json
{
  "error": "invalid_file_format",
  "message": "Please upload a valid video file (MP4 or MOV)",
  "code": 400
}
```

```json
{
  "error": "file_too_large",
  "message": "Video file exceeds maximum size of 100MB",
  "code": 413
}
```

```json
{
  "error": "processing_failed",
  "message": "Unable to analyze video. Please try again.",
  "code": 500
}
```

## Notes for Implementation

1. **Video Processing**: The API should extract frames from the video and analyze visual patterns, movement, environment, and social context
2. **Privacy**: All analysis should be done securely without storing raw video content long-term
3. **Response Time**: Expected response time is 10-30 seconds depending on video length
4. **File Size Limits**: Maximum 100MB per video file
5. **Supported Formats**: MP4, MOV (typical Meta glasses output formats)
