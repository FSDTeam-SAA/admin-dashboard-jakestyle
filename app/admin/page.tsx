'use client';

import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Home, Briefcase } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const fallbackJobPostData = [
  { day: 'Mon', posts: 100 },
  { day: 'Tue', posts: 75 },
  { day: 'Wed', posts: 78 },
  { day: 'Thu', posts: 25 },
  { day: 'Fri', posts: 32 },
  { day: 'Sat', posts: 55 },
  { day: 'Sun', posts: 40 },
];

const fallbackUserGrowthData = [
  { day: 'Day 1', tradies: 350, homeowners: 700 },
  { day: 'Day 2', tradies: 360, homeowners: 750 },
  { day: 'Day 3', tradies: 370, homeowners: 800 },
  { day: 'Day 4', tradies: 375, homeowners: 820 },
  { day: 'Day 5', tradies: 380, homeowners: 850 },
];

const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data.data;
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: overview, isLoading: overviewLoading } = useSWR(
    '/api/v1/admin/overview',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const stats = overview?.stats || { tradespeople: 0, homeowners: 0, jobs: 0 };

  const jobPostData = useMemo(() => {
    if (!overview?.jobsByDay) return fallbackJobPostData;
    return overview.jobsByDay.map((d: any) => ({ day: d.label, posts: d.count }));
  }, [overview]);

  const userGrowthData = useMemo(() => {
    if (!overview?.userGrowth) return fallbackUserGrowthData;
    return overview.userGrowth.map((d: any) => ({
      day: d.label,
      tradies: d.tradies,
      homeowners: d.homeowners,
    }));
  }, [overview]);

const StatCard = ({
  title,
  value,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: number | string;
  icon: any;
  isLoading?: boolean;
}) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-3xl font-bold mt-2">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          )}
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </CardContent>
  </Card>
);

  if (!mounted) return null;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Overview</h1>
        <select className="px-4 py-2 border rounded-lg bg-white text-sm">
          <option>This month</option>
          <option>Last month</option>
          <option>Last 3 months</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Tradespeople"
          value={stats.tradespeople ?? 0}
          icon={Users}
          isLoading={overviewLoading}
        />
        <StatCard
          title="Homeowners"
          value={stats.homeowners ?? 0}
          icon={Home}
          isLoading={overviewLoading}
        />
        <StatCard
          title="Job Posted"
          value={stats.jobs ?? 0}
          icon={Briefcase}
          isLoading={overviewLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Posted Bar Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Job Posted</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobPostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="posts" fill="#1F2937" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Line Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Last 15 days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tradies" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="homeowners" stroke="#6366F1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
