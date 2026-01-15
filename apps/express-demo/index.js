import express from 'express';
import { CartesianChart } from 'isomorphic-svg-charts'

const app = express();

app.use((req, res, next) => {
  const { darkMode } = req.query;

  if (darkMode && darkMode !== 'false') {
    req.darkMode = true;
  }

  next();
})

const data = [
  {
    month: '2015.01',
    a: 4000,
    b: 0,
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


app.get('/area-chart.svg', (req, res) => {
  const darkMode = req.darkMode;

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

  const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`;

  const chart = new CartesianChart({
    data,
    stackOffset: 'expand',
    aspectRatio: 2,
    padding: 7,
    ...(darkMode && {
      backgroundColor: 'black',
      textColor: 'white',
    }),
  })
    .xAxis({
      height: 5,
      dataKey: "month",
    })
    .yAxis({
      width: 10,
      tickFormatter: toPercent,
    })
    .cartesianGrid()
    .area({
      dataKey: "c",
      stroke: "#ffc658",
      fill: "#ffc658",
      stackId: '1',
    })
    .area({
      dataKey: "b",
      stroke: "#82ca9d",
      fill: "#82ca9d",
      stackId: '1',
    })
    .area({
      dataKey: "a",
      stroke: "#8884d8",
      fill: "#8884d8",
      stackId: '1',
    })

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(chart.toString());
});

app.get('/line-chart.svg', (req, res) => {
  const darkMode = req.darkMode;

  const chart = new CartesianChart({
    data,
    aspectRatio: 2,
    padding: 7,
    ...(darkMode && {
      backgroundColor: 'black',
      textColor: 'white',
    }),
  })
    .xAxis({
      height: 5,
      dataKey: "month",
    })
    .yAxis({
      width: 10,
    })
    .cartesianGrid()
    .line({
      dataKey: "a",
      stroke: "#16ef81",
      style: "dashed",
    })
    .line({
      dataKey: "b",
      stroke: "#7c80f6",
    })
    .line({
      dataKey: "c",
      stroke: "#f79442",
    });

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(chart.toString());
});

app.get('/bar-chart.svg', (req, res) => {
  const darkMode = req.darkMode;

  const chart = new CartesianChart({
    data,
    aspectRatio: 2,
    padding: 7,
    ...(darkMode && {
      backgroundColor: 'black',
      textColor: 'white',
    }),
  })
    .xAxis({
      height: 5,
      dataKey: "month",
    })
    .yAxis({
      width: 10,
    })
    .cartesianGrid()
    .bar({
      dataKey: "a",
      fill: "#16ef81",
    })
    .bar({
      dataKey: "b",
      fill: "#7c80f6",
    })
    .bar({
      dataKey: "c",
      fill: "#f79442",
    });

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(chart.toString());
});

app.get('/composed-chart.svg', (req, res) => {
  const darkMode = req.darkMode;

  const data = [
    {
      name: 'Page A',
      uv: 590,
      pv: 800,
      amt: 1400,
    },
    {
      name: 'Page B',
      uv: 868,
      pv: 967,
      amt: 1506,
    },
    {
      name: 'Page C',
      uv: 1397,
      pv: 1098,
      amt: 989,
    },
    {
      name: 'Page D',
      uv: 1480,
      pv: 1200,
      amt: 1228,
    },
    {
      name: 'Page E',
      uv: 1520,
      pv: 1108,
      amt: 1100,
    },
    {
      name: 'Page F',
      uv: 1400,
      pv: 680,
      amt: 1700,
    },
  ];

  const chart = new CartesianChart({
    data,
    aspectRatio: 2,
    padding: 7,
    ...(darkMode && {
      backgroundColor: 'black',
      textColor: 'white',
    }),
  })
    .xAxis({
      height: 5,
      dataKey: "name",
    })
    .yAxis({
      width: 10,
    })
    .cartesianGrid()
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

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(chart.toString());
});

app.listen(3002, () => {
  console.log('Server is running on http://localhost:3002');
});
