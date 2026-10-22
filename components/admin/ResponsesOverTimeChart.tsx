'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface Props {
  data: Array<{ date: string; count: number }>
}

export function ResponsesOverTimeChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2DFEC" />
        <XAxis
          dataKey="date"
          tick={{ fontFamily: 'Calibri', fontSize: 11, fill: '#6E6985' }}
          tickFormatter={v => v.slice(5)}
        />
        <YAxis tick={{ fontFamily: 'Calibri', fontSize: 12, fill: '#6E6985' }} allowDecimals={false} />
        <Tooltip
          labelFormatter={v => String(v)}
          contentStyle={{ fontFamily: 'Calibri', fontSize: 13, borderColor: '#E2DFEC' }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#0B7D7B"
          strokeWidth={2}
          dot={{ r: 3, fill: '#0B7D7B' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
