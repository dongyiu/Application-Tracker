// src/presentation/views/Analytics/AnalyticsDashboard.tsx

import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { TrendingUp, Timer, Target, ChevronDown } from 'lucide-react';
import { AnalyticsViewModel } from '@/presentation/viewModels/AnalyticsViewModel';
import StageAnalysisDashboard from './StageAnalysisDashboard';

// Custom Card Components
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={`bg-slate-800 rounded-xl p-4 ${className}`}>{children}</div>
);

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-xl font-semibold text-white">{children}</h3>
);

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full">{children}</div>
);

// Reusable ChartContainer Component with Fixed Height and Mobile Overflow
interface ChartContainerProps {
  children: React.ReactNode;
  minWidth?: number; // Optional minimum width in pixels
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  children, 
}) => (
  <div className="w-full overflow-x-auto">
    <div 
      className="h-96 min-w-[500px]" // Fixed height and minimum width
    >
      {children}
    </div>
  </div>
);

interface AnalyticsDashboardProps {
  viewModel: AnalyticsViewModel;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = observer(({ viewModel }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as any;
    viewModel.setSelectedDateRangeOption(value);
  };

  const handleCustomFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    viewModel.setCustomFromDate(date);
  };

  const handleCustomToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    viewModel.setCustomToDate(date);
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          <a href='/'>Job Application Tracker</a>
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={viewModel.selectedDateRangeOption}
              onChange={handleDateRangeChange}
              className="appearance-none w-full px-4 py-2 pr-10 bg-gray-800 rounded-lg text-gray-200 cursor-pointer hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1d">Last 1 Day</option>
              <option value="7d">Last 7 Days</option>
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="all">All Time</option>
              <option value="custom">Custom</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {viewModel.canUseCustomRange && (
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">From</label>
            <input
              type="date"
              value={viewModel.customFromDate.toISOString().split('T')[0]}
              onChange={handleCustomFromDateChange}
              className="px-4 py-2 bg-gray-700 rounded-lg text-gray-200 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">To</label>
            <input
              type="date"
              value={viewModel.customToDate.toISOString().split('T')[0]}
              onChange={handleCustomToDateChange}
              className="px-4 py-2 bg-gray-700 rounded-lg text-gray-200 w-full"
            />
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Response Rate Card */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Response Rate</h3>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.round(viewModel.responseRates[0]?.value || 0)}%
          </div>
          <p className="text-xs text-gray-400 mt-1">
            of applications received responses
          </p>
        </Card>

        {/* Interview Rate Card */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Interview Rate</h3>
            <Target className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.round(viewModel.responseRates[1]?.value || 0)}%
          </div>
          <p className="text-xs text-gray-400 mt-1">
            of applications reached interviews
          </p>
        </Card>

        {/* Avg. Time to Offer Card */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Avg. Time to Offer</h3>
            <Timer className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {viewModel.timeToOffer} days
          </div>
          <p className="text-xs text-gray-400 mt-1">
            from application to offer
          </p>
        </Card>
      </div>

      {/* Existing Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Application Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer minWidth={600}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewModel.timeMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#0088FE"
                    strokeWidth={2}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="interviews"
                    stroke="#00C49F"
                    strokeWidth={2}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="offers"
                    stroke="#FFBB28"
                    strokeWidth={2}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Stage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Applications by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer minWidth={600}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={viewModel.stageMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Bar dataKey="value" fill="#0088FE">
                    {viewModel.stageMetrics.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Application Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer minWidth={600}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={viewModel.typeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {viewModel.typeDistribution.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Response Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Success Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer minWidth={600}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={viewModel.responseRates}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Bar dataKey="value" fill="#0088FE">
                    {viewModel.responseRates.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Visualizations */}
      <StageAnalysisDashboard />
    </div>
  );
});

export default AnalyticsDashboard;