'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import { Users, Trophy, Calendar, Target, BookOpen, Activity } from 'lucide-react';

// Mock data for college admin analytics
const clubPerformanceData = [
  { month: 'Jan', members: 45, events: 8, engagement: 78 },
  { month: 'Feb', members: 52, events: 12, engagement: 82 },
  { month: 'Mar', members: 61, events: 15, engagement: 85 },
  { month: 'Apr', members: 68, events: 18, engagement: 88 },
  { month: 'May', members: 75, events: 22, engagement: 91 },
  { month: 'Jun', members: 82, events: 25, engagement: 94 },
];

const eventCategoriesData = [
  { name: 'Workshops', value: 35, color: '#8884d8' },
  { name: 'Competitions', value: 25, color: '#82ca9d' },
  { name: 'Seminars', value: 20, color: '#ffc658' },
  { name: 'Cultural Events', value: 15, color: '#ff7300' },
  { name: 'Others', value: 5, color: '#00ff88' },
];

const memberEngagementData = [
  { club: 'Tech Club', active: 85, inactive: 15, total: 100 },
  { club: 'Drama Club', active: 78, inactive: 22, total: 100 },
  { club: 'Sports Club', active: 92, inactive: 8, total: 100 },
  { club: 'Music Club', active: 68, inactive: 32, total: 100 },
  { club: 'Literary Club', active: 75, inactive: 25, total: 100 },
];

const eventAttendanceData = [
  { event: 'Workshop 1', registered: 120, attended: 98, completion: 82 },
  { event: 'Competition A', registered: 85, attended: 78, completion: 92 },
  { event: 'Seminar X', registered: 150, attended: 135, completion: 90 },
  { event: 'Cultural Fest', registered: 200, attended: 185, completion: 93 },
  { event: 'Tech Talk', registered: 100, attended: 88, completion: 88 },
];

const chartConfig = {
  members: {
    label: 'Members',
    color: '#8884d8',
  },
  events: {
    label: 'Events',
    color: '#82ca9d',
  },
  engagement: {
    label: 'Engagement %',
    color: '#ffc658',
  },
  active: {
    label: 'Active Members',
    color: '#00ff88',
  },
  inactive: {
    label: 'Inactive Members',
    color: '#ff7300',
  },
  registered: {
    label: 'Registered',
    color: '#8884d8',
  },
  attended: {
    label: 'Attended',
    color: '#82ca9d',
  },
};

export function CollegeAdminAnalytics() {
  return (
    <div className="grid gap-6">
      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> new this semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">387</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+13.6%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Club Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Club Performance Trends
          </CardTitle>
          <CardDescription>
            Track member growth, events, and engagement over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <LineChart data={clubPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="members"
                stroke="var(--color-members)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-members)', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="var(--color-events)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-events)', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="var(--color-engagement)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-engagement)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Event Categories Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Event Categories</CardTitle>
            <CardDescription>
              Distribution of events by category this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={eventCategoriesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Member Engagement by Club */}
        <Card>
          <CardHeader>
            <CardTitle>Member Engagement by Club</CardTitle>
            <CardDescription>
              Active vs inactive members across different clubs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={memberEngagementData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="club" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="active" stackId="a" fill="var(--color-active)" />
                <Bar dataKey="inactive" stackId="a" fill="var(--color-inactive)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Event Attendance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Event Attendance Analysis
          </CardTitle>
          <CardDescription>
            Registration vs attendance rates for recent events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px]">
            <BarChart data={eventAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="event" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="registered" fill="var(--color-registered)" />
              <Bar dataKey="attended" fill="var(--color-attended)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Club</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">Sports Club</div>
            <p className="text-sm text-muted-foreground">92% engagement rate</p>
            <p className="text-sm text-muted-foreground">15 events this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Popular Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">Cultural Fest</div>
            <p className="text-sm text-muted-foreground">200 registrations</p>
            <p className="text-sm text-muted-foreground">93% attendance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Growth Highlight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">+18.2%</div>
            <p className="text-sm text-muted-foreground">Member growth</p>
            <p className="text-sm text-muted-foreground">Best performing month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
