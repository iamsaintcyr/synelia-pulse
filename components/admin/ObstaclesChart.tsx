'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { OBSTACLE_LABELS } from '@/lib/validations/feedback'

interface Props {
  data: Record<string, number>
}

export function ObstaclesChart({ data }: Props) {
  const chartData = Object.entries(data)
    .map(([key, count]) => ({ key, label: OBSTACLE_LABELS[key] ?? key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, chartData.length * 36)}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
      >
        <XAxis type="number" tick={{ fontFamily: 'Calibri', fontSize: 12, fill: '#6E6985' }} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={200}
          tick={{ fontFamily: 'Calibri', fontSize: 12, fill: '#4A4660' }}
        />
        <Tooltip contentStyle={{ fontFamily: 'Calibri', fontSize: 13, borderColor: '#E2DFEC' }} />
        <Bar dataKey="count" fill="#6759A2" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
