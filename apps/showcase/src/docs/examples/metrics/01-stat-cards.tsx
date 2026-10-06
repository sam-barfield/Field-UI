// title: KPI tiles
// description: invertTrendColors makes "down" green - for latency, cost or errors.
import { StatCard, Sparkline, Grid } from '@sam.barfield/field-react';
import { DollarSign, Gauge, Server } from 'lucide-react';

export default function StatCards() {
  return (
    <Grid minChildWidth={200} gap={12} className="example-wide">
      <StatCard
        label="Monthly spend"
        value="$8,420"
        icon={<DollarSign size={16} />}
        delta={{ value: '3.8%', trend: 'up' }}
        invertTrendColors
        chart={<Sparkline data={[5, 6, 6, 7, 8, 8.4]} color="warning" />}
      />
      <StatCard
        label="p99 latency"
        value="182 ms"
        icon={<Gauge size={16} />}
        delta={{ value: '12%', trend: 'down' }}
        invertTrendColors
        subtitle="vs. last week"
      />
      <StatCard label="Instances" value="24" icon={<Server size={16} />} isLoading />
    </Grid>
  );
}
