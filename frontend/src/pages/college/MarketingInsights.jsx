import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function MarketingInsights() {
  const [timeRange, setTimeRange] = useState('week')

  // Mock data for student engagement
  const studentEngagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Students',
        data: [65, 72, 78, 85, 82, 75, 70],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };

  // Mock data for service usage
  const serviceUsageData = {
    labels: ['Cab Service', 'Shuttle Service', 'Bike Rentals'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
      },
    ],
  };

  // Mock data for campaign performance
  const campaignData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Email Campaign',
        data: [30, 45, 55, 65],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
      {
        label: 'Social Media',
        data: [25, 35, 45, 50],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'In-App Promotions',
        data: [20, 30, 40, 45],
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
      },
    ],
  };

  // Marketing metrics
  const marketingMetrics = [
    { label: 'Total Students Reached', value: '2,345', change: '+12%' },
    { label: 'Conversion Rate', value: '24.8%', change: '+3.2%' },
    { label: 'Active Campaigns', value: '5', change: '0%' },
    { label: 'Avg. Engagement Rate', value: '68%', change: '+5.4%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing Insights</h2>
          <p className="text-muted-foreground">
            Analyze your marketing performance and student engagement
          </p>
        </div>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {marketingMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className={`text-sm ${
                    metric.change.startsWith('+') ? 'text-green-600' : 
                    metric.change.startsWith('-') ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <Line 
              data={studentEngagementData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie 
              data={serviceUsageData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar 
            data={campaignData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
} 