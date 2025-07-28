'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Users, GraduationCap, Building2, Calendar, TrendingUp, Activity } from 'lucide-react';

// Mock data for analytics - as specified by author for admin dashboards
const collegesGrowthData = [
  { month: 'Jan', colleges: 12, activeClubs: 45, totalMembers: 1200 },
  { month: 'Feb', colleges: 15, activeClubs: 52, totalMembers: 1450 },
  { month: 'Mar', colleges: 18, activeClubs: 61, totalMembers: 1680 },
  { month: 'Apr', colleges: 22, activeClubs: 75, totalMembers: 2100 },
  { month: 'May', colleges: 25, activeClubs: 82, totalMembers: 2350 },
  { month: 'Jun', colleges: 28, activeClubs: 95, totalMembers: 2800 },
];

const collegeDistributionData = [
  { name: 'Engineering', value: 45, color: '#8884d8' },
  { name: 'Arts & Science', value: 30, color: '#82ca9d' },
  { name: 'Medical', value: 15, color: '#ffc658' },
  { name: 'Management', value: 10, color: '#ff7300' },
];

const clubCategoriesData = [
  { category: 'Technical', clubs: 35, events: 120 },
  { category: 'Cultural', clubs: 28, events: 95 },
  { category: 'Sports', clubs: 22, events: 80 },
  { category: 'Literary', clubs: 18, events: 65 },
  { category: 'Social Service', clubs: 15, events: 45 },
];

const eventTrendsData = [
  { month: 'Jan', events: 45, attendance: 2400 },
  { month: 'Feb', events: 52, attendance: 2800 },
  { month: 'Mar', events: 61, attendance: 3200 },
  { month: 'Apr', events: 75, attendance: 3900 },
  { month: 'May', events: 68, attendance: 3600 },
  { month: 'Jun', events: 82, attendance: 4200 },
];

const chartConfig = {
  colleges: {
    label: 'Colleges',
    color: '#8884d8',
  },
  activeClubs: {
    label: 'Active Clubs',
    color: '#82ca9d',
  },
  totalMembers: {
    label: 'Total Members',
    color: '#ffc658',
  },
  events: {
    label: 'Events',
    color: '#ff7300',
  },
  attendance: {
    label: 'Attendance',
    color: '#00ff88',
  },
};

export function SuperAdminAnalytics() {
  return (
    <div className="grid gap-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clubs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,800</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+19.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+20.6%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Growth Trends Overview
          </CardTitle>
          <CardDescription>
            Monthly growth across colleges, clubs, and members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <AreaChart data={collegesGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="totalMembers"
                stackId="1"
                stroke="var(--color-totalMembers)"
                fill="var(--color-totalMembers)"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="activeClubs"
                stackId="2"
                stroke="var(--color-activeClubs)"
                fill="var(--color-activeClubs)"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="colleges"
                stackId="3"
                stroke="var(--color-colleges)"
                fill="var(--color-colleges)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* College Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>College Distribution by Type</CardTitle>
            <CardDescription>
              Breakdown of colleges by academic focus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={collegeDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {collegeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Club Categories Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Club Categories Analysis</CardTitle>
            <CardDescription>
              Number of clubs and events by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={clubCategoriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="clubs" fill="var(--color-activeClubs)" />
                <Bar dataKey="events" fill="var(--color-events)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Event Trends Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Event Trends & Attendance
          </CardTitle>
          <CardDescription>
            Monthly events organized and total attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px]">
            <LineChart data={eventTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="events"
                stroke="var(--color-events)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-events)', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="var(--color-attendance)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-attendance)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
