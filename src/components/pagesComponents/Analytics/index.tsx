import { AnalyticsAreaChart } from '@/components/common/charts/AreaChart'
import { AnalyticsLineChart } from '@/components/common/charts/LinerChart'
import { AnalyticsPieChart } from '@/components/common/charts/PieChart'

const trafficData = [
  { month: 'Jan', desktop: 186, mobile: 120, tablet: 40 },
  { month: 'Feb', desktop: 205, mobile: 140, tablet: 50 },
  { month: 'Mar', desktop: 237, mobile: 180, tablet: 60 },
  { month: 'Apr', desktop: 273, mobile: 200, tablet: 70 },
  { month: 'May', desktop: 209, mobile: 170, tablet: 55 },
  { month: 'Jun', desktop: 214, mobile: 190, tablet: 65 },
]

const deviceData = [
  { name: 'Desktop', value: 60, color: 'hsl(var(--primary))' },
  { name: 'Mobile', value: 30, color: 'hsl(var(--secondary))' },
  { name: 'Tablet', value: 10, color: 'hsl(var(--accent))' },
]

const conversionData = [
  { day: 'Mon', conversions: 24, visitors: 400 },
  { day: 'Tue', conversions: 32, visitors: 450 },
  { day: 'Wed', conversions: 28, visitors: 380 },
  { day: 'Thu', conversions: 45, visitors: 520 },
  { day: 'Fri', conversions: 52, visitors: 600 },
  { day: 'Sat', visitors: 350, conversions: 18 },
  { day: 'Sun', visitors: 300, conversions: 15 },
]

export function AnalyticsCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
   {/*    <AnalyticsLineChart
        title="Traffic Sources"
        description="Website traffic by device type over time"
        data={trafficData}
        xAxisKey="month"
        lines={[
          { dataKey: 'desktop', stroke: 'hsl(var(--primary))' },
          { dataKey: 'mobile', stroke: 'hsl(var(--success))' },
          { dataKey: 'tablet', stroke: 'hsl(var(--warning))' },
        ]}
        className="col-span-2"
      />
      <AnalyticsPieChart
        title="Device Usage"
        description="Distribution of users by device type"
        data={deviceData}
      />

      <AnalyticsAreaChart
        title="Conversion Rate"
        description="Daily conversion rate this week"
        data={conversionData}
        xAxisKey="day"
        areaKey="conversions"
        stroke="hsl(var(--primary))"
        fill="hsl(var(--primary))"
      /> */}
    </div>
  )
}
