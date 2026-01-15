**Installation**:
```bash
npm install isomorphic-svg-charts
```

`isomorphic-svg-charts` is a lightweight, environment-agnostic SVG charting library designed to work seamlessly across any JavaScript environment — from server-side rendering in Node.js to React Server Components and client-side apps. With **zero dependencies** and no reliance on the DOM, this library allows you to generate high-quality SVG charts in environments where typical charting libraries like D3 would be too heavyweight.

This makes it perfect for headless systems, APIs, and server-side applications where you need to render charts without any browser dependencies.

---

### Documentation

See [christianjuth.github.io/isomorphic-svg-charts](https://christianjuth.github.io/isomorphic-svg-charts/).

---

### Why Use This Library?

- **Zero dependencies**: Keeps your bundle size small and performance fast.
- **Doesn't require the DOM**: Works seamlessly in server environments.
- **Render SVG charts in React Server Components**: Perfect for modern frameworks like Next.js.
- **Amazing TypeScript Developer Experience**: Full TypeScript support for safe, typed development.

---

### Render Charts In...

- **React / React Native**
- **Express.js** or any Node.js server (including SSR)
- **Headless or server-side systems** (e.g., for generating charts for PDFs, emails, or reports)
- **Any other JavaScript environment**: Whether in the browser or not, this library works everywhere.


**Usage Example**:

```javascript
import { SVGBarChart } from 'isomorphic-svg-charts';

const data = [
  { name: "A", value: 30 },
  { name: "B", value: 80 },
  { name: "C", value: 45 }
];

const chart = new SVGBarChart({ 
  data,
  aspectRatio: 2,
  padding: 5
})
  .xAxis({
    height: 5,
    dataKey: "name",
  })
  .yAxis({
    width: 10,
  })
  .cartesianGrid()
  .bar({ dataKey: "value", fill: "#16ef81" })
  .toString();

console.log(chart);  // Outputs the SVG chart string
```

**License**: MIT
