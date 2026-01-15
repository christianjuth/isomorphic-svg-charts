import { Chart } from '@/components/chart'
import { CartesianChart } from 'isomorphic-svg-charts'

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const chart = new CartesianChart({
  data,
  aspectRatio: 2,
  padding: 5,
})
  .cartesianGrid()
  .xAxis({
    height: 5,
    dataKey: "name",
  })
  .yAxis({
    width: 10,
  })
  .line({
    dataKey: "pv",
    stroke: "#8884d8",
    style: "dashed",
  })
  .line({
    dataKey: "uv",
    stroke: "#82ca9d",
    style: "dashed",
  });


export default function SimpleLineChart() {
  return (
    <Chart chart={chart} />
  )
}
