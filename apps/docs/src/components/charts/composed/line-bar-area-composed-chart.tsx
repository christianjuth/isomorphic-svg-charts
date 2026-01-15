import { Chart } from '@/components/chart'
import { CartesianChart } from 'isomorphic-svg-charts'

const data = [
  {
    name: 'Page A',
    uv: 590,
    pv: 800,
    amt: 1400,
    cnt: 490,
  },
  {
    name: 'Page B',
    uv: 868,
    pv: 967,
    amt: 1506,
    cnt: 590,
  },
  {
    name: 'Page C',
    uv: 1397,
    pv: 1098,
    amt: 989,
    cnt: 350,
  },
  {
    name: 'Page D',
    uv: 1480,
    pv: 1200,
    amt: 1228,
    cnt: 480,
  },
  {
    name: 'Page E',
    uv: 1520,
    pv: 1108,
    amt: 1100,
    cnt: 460,
  },
  {
    name: 'Page F',
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
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
  .area({
    dataKey: "amt",
    fill: "#8884d8",
    stroke: "#8884d8",
  })
  .bar({
    dataKey: "pv",
    fill: "#413ea0",
  })
  .line({
    dataKey: "uv",
    stroke: "#ff7300",
  });

export default function SimpleLineChart() {
  return (
    <Chart chart={chart} />
  )
}
