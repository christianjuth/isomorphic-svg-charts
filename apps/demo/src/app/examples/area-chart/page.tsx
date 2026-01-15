import { CartesianChart } from 'isomorphic-svg-charts'

export function Chart<K extends string, D extends Record<K, string | number>>({
  chart,
  className,
}: {
  chart: CartesianChart<K, D>;
  className?: string;
}) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: chart.toString(),
      }}
    />
  );
}

const data = [
  {
    month: '2015.01',
    a: 4000,
    b: 2400,
    c: 2400,
  },
  {
    month: '2015.02',
    a: 3000,
    b: 1398,
    c: 2210,
  },
  {
    month: '2015.03',
    a: 2000,
    b: 9800,
    c: 2290,
  },
  {
    month: '2015.04',
    a: 2780,
    b: 3908,
    c: 2000,
  },
  {
    month: '2015.05',
    a: 1890,
    b: 4800,
    c: 2181,
  },
  {
    month: '2015.06',
    a: 2390,
    b: 3800,
    c: 2500,
  },
  {
    month: '2015.07',
    a: 3490,
    b: 4300,
    c: 2100,
  },
];

const chart = new CartesianChart({
  data,
  aspectRatio: 2,
  padding: 7,
})
  .xAxis({
    height: 5,
    dataKey: "month",
  })
  .yAxis({
    width: 10,
  })
  .cartesianGrid()
  .area({
    dataKey: "a",
    stroke: "hsl(var(--chart-3))",
    fill: "hsla(var(--chart-3) / 0.1)",
  })
  .area({
    dataKey: "b",
    stroke: "hsl(var(--primary))",
    fill: "hsla(var(--primary) / 0.1)",
  })
  .area({
    dataKey: "c",
    stroke: "hsl(var(--chart-2))",
    fill: "hsla(var(--chart-2) / 0.1)",
  });

export default function Page() {
  return (
    <Chart
      chart={chart}
    />
  )
}
