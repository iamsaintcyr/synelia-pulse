'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props {
  data: Record<1 | 2 | 3 | 4 | 5, number>
}

const SCORE_LABELS: Record<number, string> = {
  1: 'Très insatisfaisante',
  2: 'Insatisfaisante',
  3: 'Moyenne',
  4: 'Satisfaisante',
  5: 'Très satisfaisante',
}

const COLORS: Record<number, string> = {
  1: '#C42B30',
  2: '#C24A2E',
  3: '#928DA6',
  4: '#0B7D7B',
  5: '#6759A2',
}

export function SatisfactionDistChart({ data }: Props) {
  const chartData = ([1, 2, 3, 4, 5] as const).map(score => ({
    score,
    label: SCORE_LABELS[score],
    count: data[score] ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <XAxis dataKey="score" tick={{ fontFamily: 'Calibri', fontSize: 14, fill: '#4A4660' }} />
        <YAxis tick={{ fontFamily: 'Calibri', fontSize: 12, fill: '#6E6985' }} allowDecimals={false} />
        <Tooltip
          formatter={(value: number) => [value, 'Réponses']}
          contentStyle={{ fontFamily: 'Calibri', fontSize: 13, borderColor: '#E2DFEC' }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {chartData.map(entry => (
            <Cell key={entry.score} fill={COLORS[entry.score]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
