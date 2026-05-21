import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Activity,
  Brain,
  ChevronRight,
  Loader2
} from 'lucide-react';
import adminApi from '../../../../shared/api/adminApi';
import './DemandForecasting.css';

const TIME_RANGE_OPTIONS = [
  { label: 'Last 3 Months', value: 'last_3_months' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'Last Year', value: 'last_year' },
];

const INSIGHT_CONFIG = {
  alert: { color: 'red', icon: AlertTriangle },
  optimization: { color: 'yellow', icon: Target },
  trend: { color: 'green', icon: Activity },
};

const DemandForecasting = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('last_6_months');
  const [aiModelActive, setAiModelActive] = useState(true);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    adminApi.getDemandForecast(
      { timeRange: selectedTimeRange },
      { signal: controller.signal }
    )
      .then((result) => {
        console.log('Forecast data:', result);
        setData(result?.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
        setError(err.response?.data?.message || err.message || 'Failed to load forecast data');
        setLoading(false);
      });

    return () => controller.abort();
  }, [selectedTimeRange]);

  const handleRetry = () => {
    setSelectedTimeRange((prev) => prev);
    // Force re-fetch by toggling a dummy state
    setError(null);
    setLoading(true);
    adminApi.getDemandForecast({ timeRange: selectedTimeRange })
      .then((result) => {
        setData(result?.data);
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
        setError(err.response?.data?.message || err.message || 'Failed to load forecast data');
      })
      .finally(() => setLoading(false));
  };

  const handleTimeRangeChange = () => {
    const currentIndex = TIME_RANGE_OPTIONS.findIndex(o => o.value === selectedTimeRange);
    const nextIndex = (currentIndex + 1) % TIME_RANGE_OPTIONS.length;
    setSelectedTimeRange(TIME_RANGE_OPTIONS[nextIndex].value);
  };

  const timeRangeLabel = TIME_RANGE_OPTIONS.find(o => o.value === selectedTimeRange)?.label || 'Last 6 Months';

  // Build display data from API response
  const summaryMetrics = data ? [
    {
      title: 'Next Week Volume',
      value: `${data.summaryMetrics.nextWeekVolume.value.toLocaleString()}L`,
      change: `${data.summaryMetrics.nextWeekVolume.changePercent >= 0 ? '+' : ''}${data.summaryMetrics.nextWeekVolume.changePercent}%`,
      trend: data.summaryMetrics.nextWeekVolume.changePercent >= 0 ? 'up' : 'down',
      icon: data.summaryMetrics.nextWeekVolume.changePercent >= 0 ? TrendingUp : TrendingDown
    },
    {
      title: 'Peak Day',
      value: data.summaryMetrics.peakDay.day,
      subtitle: `${data.summaryMetrics.peakDay.orders.toLocaleString()} orders`,
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Low Day',
      value: data.summaryMetrics.lowDay.day,
      subtitle: `${data.summaryMetrics.lowDay.orders.toLocaleString()} orders`,
      trend: 'down',
      icon: TrendingDown
    },
    {
      title: 'Avg Confidence',
      value: `${data.summaryMetrics.avgConfidence.value}%`,
      change: `${data.summaryMetrics.avgConfidence.changePercent >= 0 ? '+' : ''}${data.summaryMetrics.avgConfidence.changePercent}%`,
      trend: data.summaryMetrics.avgConfidence.changePercent >= 0 ? 'up' : 'down',
      icon: data.summaryMetrics.avgConfidence.changePercent >= 0 ? TrendingUp : TrendingDown
    }
  ] : [];

  const weeklyForecastData = data?.weeklyForecast || [];
  const monthlyTrendData = data?.monthlyTrend || [];
  const zonePerformanceData = data?.zonePerformance || [];

  const aiInsights = (data?.insights || []).map(insight => ({
    ...insight,
    color: INSIGHT_CONFIG[insight.type]?.color || 'blue',
    icon: INSIGHT_CONFIG[insight.type]?.icon || Activity,
  }));

  const bottomMetrics = data ? [
    {
      title: 'Forecast Accuracy',
      value: `${data.modelMetrics.forecastAccuracy.value}%`,
      change: `+${data.modelMetrics.forecastAccuracy.change}% this month`,
      color: 'green',
      icon: Target
    },
    {
      title: 'Model Confidence',
      value: `${data.modelMetrics.modelConfidence.value}%`,
      subtitle: `${data.modelMetrics.modelConfidence.reliability.charAt(0).toUpperCase() + data.modelMetrics.modelConfidence.reliability.slice(1)} reliability`,
      color: 'blue',
      icon: Activity
    },
    {
      title: 'Data Points Analyzed',
      value: data.modelMetrics.dataPointsAnalyzed.value >= 1000
        ? `${(data.modelMetrics.dataPointsAnalyzed.value / 1000).toFixed(0)}K`
        : data.modelMetrics.dataPointsAnalyzed.value.toString(),
      subtitle: `Last updated`,
      color: 'purple',
      icon: Brain
    }
  ] : [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-day">{payload[0].payload.day}</p>
          {payload[0].value && (
            <p className="tooltip-actual">
              actual: {payload[0].value}
            </p>
          )}
          {payload[1] && payload[1].value && (
            <p className="tooltip-predicted">
              predicted: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="demand-forecasting">
      {/* Header */}
      <div className="df-header">
        <div className="df-header-content">
          <h1 className="df-title">AI Demand Forecasting</h1>
          <p className="df-subtitle">Predictive analytics powered by machine learning</p>
        </div>
        <button
          className={`ai-model-toggle ${aiModelActive ? 'active' : ''}`}
          onClick={() => setAiModelActive(!aiModelActive)}
        >
          <Brain className="icon" />
          <span>AI Model Active</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="df-loading">
          <Loader2 className="df-spinner" />
          <p>Loading forecast data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="df-error">
          <AlertTriangle className="df-error-icon" />
          <p>{error}</p>
          <button className="df-retry-btn" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {/* Data Content */}
      {data && !loading && (
        <>

      {/* Summary Metrics */}
      <div className="summary-metrics">
        {summaryMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="metric-card">
              <div className="metric-header">
                <p className="metric-label">{metric.title}</p>
                <Icon className={`metric-icon ${metric.trend}`} />
              </div>
              <p className="metric-value">{metric.value}</p>
              {metric.change && (
                <p className={`metric-change ${metric.trend}`}>
                  {metric.change}
                </p>
              )}
              {metric.subtitle && (
                <p className={`metric-subtitle ${metric.trend}`}>
                  {metric.subtitle}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Charts Section */}
      <div className="charts-grid">
        {/* 7-Day Forecast Chart */}
        <div className="chart-card chart-wide">
          <div className="chart-header">
            <div className="chart-title-section">
              <h2 className="chart-title">7-Day Demand Forecast</h2>
              <p className="chart-subtitle">Predicted vs actual orders</p>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot predicted"></div>
                <span>Predicted</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot actual"></div>
                <span>Actual</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={weeklyForecastData}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                domain={[0, 1200]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#10B981"
                strokeWidth={3}
                fill="url(#colorActual)"
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#colorPredicted)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Performance Radar Chart */}
        <div className="chart-card">
          <div className="chart-title-section">
            <h2 className="chart-title">Zone Performance</h2>
            <p className="chart-subtitle">Demand distribution analysis</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={zonePerformanceData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis
                dataKey="zone"
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#6B7280' }}
              />
              <Radar
                name="Demand"
                dataKey="demand"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title-section">
            <h2 className="chart-title">Monthly Demand Trend</h2>
            <p className="chart-subtitle">Historical and projected growth analysis</p>
          </div>
          <button className="time-range-btn" onClick={handleTimeRangeChange}>
            <svg className="calendar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {timeRangeLabel}
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              domain={[0, 28000]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#06B6D4"
              strokeWidth={3}
              dot={{ fill: '#06B6D4', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI-Generated Insights */}
      <div className="ai-insights-section">
        <div className="ai-insights-header">
          <div className="ai-icon-wrapper">
            <Brain className="ai-brain-icon" />
          </div>
          <div>
            <h2 className="ai-insights-title">AI-Generated Insights</h2>
            <p className="ai-insights-subtitle">Smart recommendations based on pattern analysis</p>
          </div>
        </div>

        <div className="insights-grid">
          {aiInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="insight-card">
                <div className="insight-header">
                  <div className={`insight-icon-wrapper ${insight.color}`}>
                    <Icon className="insight-icon" />
                  </div>
                  <span className={`priority-badge ${insight.priority.toLowerCase()}`}>
                    {insight.priority}
                  </span>
                </div>

                <h3 className="insight-title">{insight.title}</h3>
                <p className="insight-description">{insight.description}</p>

                <div className="insight-footer">
                  <div className="accuracy-badge">
                    <svg className="star-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>Accuracy: {insight.accuracy}%</span>
                  </div>
                  <button className="view-details-btn">
                    View Details
                    <ChevronRight className="chevron-icon" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Metrics */}
      <div className="bottom-metrics">
        {bottomMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bottom-metric-card">
              <div className="bottom-metric-content">
                <div className={`bottom-metric-icon ${metric.color}`}>
                  <Icon className="icon" />
                </div>
                <div className="bottom-metric-info">
                  <p className="bottom-metric-label">{metric.title}</p>
                  <p className="bottom-metric-value">{metric.value}</p>
                  {metric.change && (
                    <p className="bottom-metric-change">{metric.change}</p>
                  )}
                  {metric.subtitle && (
                    <p className="bottom-metric-subtitle">{metric.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </>
      )}
    </div>
  );
};

export default DemandForecasting;
