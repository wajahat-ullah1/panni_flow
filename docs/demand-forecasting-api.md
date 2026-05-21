# Demand Forecasting Module — API Reference

Base URL: `/demand-forecasting`  
All endpoints require `Authorization: Bearer <token>`.  
Roles: `admin` only.  
Tenant is resolved from the auth token.

---

## Dashboard Endpoint

---

### 1. Forecasting Dashboard
**`GET /demand-forecasting/dashboard`**

Returns demand forecasting data including weekly forecast, monthly trend, zone performance, AI-driven insights, and model metrics.

#### Query Params
| Param | Type | Description |
|---|---|---|
| `timeRange` | enum | `last_3_months`, `last_6_months`, `last_year`. Defaults to `last_6_months` |

#### Response `200`
```ts
{
  summaryMetrics: {
    nextWeekVolume: {
      value: number            // sum of predicted volumes for next 7 days
      unit: "liters"
      changePercent: number    // % change vs same period last week
    }
    peakDay: {
      day: string              // full day name, e.g. "Saturday"
      orders: number           // predicted order volume
    }
    lowDay: {
      day: string              // full day name, e.g. "Wednesday"
      orders: number           // predicted order volume
    }
    avgConfidence: {
      value: number            // average model confidence (0-100)
      changePercent: number    // change vs previous period
    }
  }
  weeklyForecast: [
    {
      day: string              // "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
      actual: number | null    // actual volume (null for future days)
      predicted: number        // predicted volume (weighted avg of same weekday, past 8 weeks)
    }
  ]
  monthlyTrend: [
    {
      month: string            // "Jan", "Feb", ... "Dec"
      value: number            // total order volume (in liters) for that month
    }
  ]
  zonePerformance: [
    {
      zone: string             // delivery zone name
      demand: number           // score 0-100 relative to highest zone
    }
  ]
  insights: [
    {
      type: "alert" | "optimization" | "trend"
      priority: "HIGH" | "MEDIUM" | "LOW"
      title: string
      description: string
      accuracy: number         // confidence percentage (0-100)
    }
  ]
  modelMetrics: {
    forecastAccuracy: {
      value: number            // accuracy percentage
      change: number           // change vs previous period
    }
    modelConfidence: {
      value: number            // confidence percentage
      reliability: string      // "high" | "medium" | "low"
    }
    dataPointsAnalyzed: {
      value: number            // total data points used
      lastUpdated: string      // ISO 8601 timestamp
    }
  }
}
```

#### Example Response
```json
{
  "summaryMetrics": {
    "nextWeekVolume": {
      "value": 6410,
      "unit": "liters",
      "changePercent": 12.3
    },
    "peakDay": {
      "day": "Saturday",
      "orders": 1050
    },
    "lowDay": {
      "day": "Wednesday",
      "orders": 780
    },
    "avgConfidence": {
      "value": 91.7,
      "changePercent": 2.1
    }
  },
  "weeklyForecast": [
    { "day": "Mon", "actual": 850, "predicted": 820 },
    { "day": "Tue", "actual": 900, "predicted": 920 },
    { "day": "Wed", "actual": null, "predicted": 780 },
    { "day": "Thu", "actual": null, "predicted": 890 },
    { "day": "Fri", "actual": null, "predicted": 950 },
    { "day": "Sat", "actual": null, "predicted": 1050 },
    { "day": "Sun", "actual": null, "predicted": 920 }
  ],
  "monthlyTrend": [
    { "month": "Jan", "value": 18000 },
    { "month": "Feb", "value": 20000 },
    { "month": "Mar", "value": 19000 },
    { "month": "Apr", "value": 25000 },
    { "month": "May", "value": 22000 },
    { "month": "Jun", "value": 27000 }
  ],
  "zonePerformance": [
    { "zone": "Zone A", "demand": 95 },
    { "zone": "Zone B", "demand": 75 },
    { "zone": "Zone C", "demand": 85 },
    { "zone": "Zone D", "demand": 60 },
    { "zone": "Zone E", "demand": 70 }
  ],
  "insights": [
    {
      "type": "alert",
      "priority": "HIGH",
      "title": "High Demand Alert",
      "description": "Saturday expected to have 18% higher demand than usual. Recommend allocating 3 additional tankers.",
      "accuracy": 95
    },
    {
      "type": "optimization",
      "priority": "MEDIUM",
      "title": "Route Optimization",
      "description": "Zone C shows clustering patterns. Consolidating deliveries could reduce costs by 12%.",
      "accuracy": 87
    },
    {
      "type": "trend",
      "priority": "LOW",
      "title": "Growth Trend Detected",
      "description": "Month-over-month demand increasing by 15%. Consider fleet expansion for Q3.",
      "accuracy": 92
    }
  ],
  "modelMetrics": {
    "forecastAccuracy": {
      "value": 94.2,
      "change": 3.1
    },
    "modelConfidence": {
      "value": 91.7,
      "reliability": "high"
    },
    "dataPointsAnalyzed": {
      "value": 128000,
      "lastUpdated": "2026-05-22T10:30:00Z"
    }
  }
}
```

---

## Business Logic

### Weekly Forecast
- Returns 7 days starting from current Monday
- Past days: includes both `actual` (from delivered/out-for-delivery orders) and `predicted`
- Future days: `actual = null`, `predicted` = weighted moving average of same weekday from past 8 weeks

### Monthly Trend
- Aggregates total order volume (item quantities) per month
- Filtered by selected `timeRange`
- Excludes cancelled orders

### Zone Performance
- Groups orders by delivery zone (`deliveryAddress.label` or `deliveryAddress.city`)
- Score formula: `(zone_orders / max_zone_orders) * 100`

### Insights (Rule-based)
| Condition | Type | Priority |
|---|---|---|
| Any day prediction > 115% of weekly average | `alert` | `HIGH` |
| Multiple zones with similar demand (60-90 score) | `optimization` | `MEDIUM` |
| Month-over-month growth > 10% | `trend` | `LOW` |

### Model Metrics
- MVP returns semi-static values
- `forecastAccuracy`: Tracks prediction vs actual comparison (static for MVP)
- `modelConfidence`: Overall model reliability score
- `dataPointsAnalyzed`: Count of historical data points used

---

## Error Responses

| Status | Description |
|---|---|
| `401` | Missing or invalid JWT token |
| `403` | User does not have `admin` role |
| `400` | Invalid `timeRange` enum value |
