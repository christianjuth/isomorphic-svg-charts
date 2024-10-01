// /**
//  * @typedef {Object} ChartProps
//  * @property {import('isomorphic-svg-charts').CartesianChart} chart
//  * @property {string | undefined} className 
//  *
//  * @param {ChartProps} props
//  *
//  * @returns {JSX.Element}
//  *
//  */
// export function Chart({
//   chart,
//   className,
// }) {
//   return (
//     <div
//       className={className}
//       dangerouslySetInnerHTML={{
//         __html: chart.toString(),
//       }}
//     />
//   );
// }

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
