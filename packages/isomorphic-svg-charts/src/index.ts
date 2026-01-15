import { toCatmullRom } from './catmull-rom'

type Component<T extends string, Key extends string | symbol | number> = {
  dataKey: Key;
  stroke?: string;
  fill?: string;
  borderRadius?: number;
  type: T;
  style?: 'solid' | 'dashed';
  stackId?: string;
};

type Bar<K extends string> = Component<"bar", K>;
type Line<K extends string> = Component<"line", K>;
type Area<K extends string> = Component<"area", K>;

function roundByDigitsWithZeroInSegments({
  min,
  max,
  segments = 10,
  roundingFactor = 10, // Configurable rounding factor, default to 10
}: {
  min: number;
  max: number;
  segments?: number;
  roundingFactor?: number;
}): { roundedMin: number, roundedMax: number, segmentStep: number } {
  // Ensure min <= 0 and max >= 0 to include zero
  if (min > 0) min = 0;
  if (max < 0) max = 0;

  // Ensure roundingFactor is at least 10 to match resolution requirements
  const effectiveRoundingFactor = Math.max(roundingFactor, 10);

  // Round min and max using the configurable rounding factor
  const roundedMin = Math.floor(min / effectiveRoundingFactor) * effectiveRoundingFactor;
  let roundedMax = Math.ceil(max / effectiveRoundingFactor) * effectiveRoundingFactor;

  // Recalculate the range
  const range = roundedMax - roundedMin;

  // Calculate the step size to divide the range into equal segments
  const segmentStep = Math.ceil(range / (segments - 1));

  // Re-adjust roundedMin and roundedMax to ensure they align with the segment step
  const adjustedMin = Math.floor(roundedMin / segmentStep) * segmentStep;
  let adjustedMax = Math.ceil(roundedMax / segmentStep) * segmentStep;

  // Prevent adjustedMax from overshooting the original max value
  if (adjustedMax > max) {
    adjustedMax = max;
  }

  return { roundedMin: adjustedMin, roundedMax: adjustedMax, segmentStep };
}

function normalize(min: number, max: number, value: number) {
  if (min === max) return 0; // Avoid division by zero
  return (value - min) / (max - min);
}

function remap(min: number, max: number, value: number) {
  return min + (max - min) * value;
}

// function tooltip({ text, x, y }: { text: string; x: number; y: number }) {
//   const numChars = text.length;
//   const height = 8;
//   const width = numChars * 3;
//   return `
//     <g class="tooltip">
//       <rect
//         x="${x - width}"
//         y="${y}"
//         width="${width}"
//         height="${height}"
//         fill="white"
//         stroke="gray"
//         stroke-width="1"
//         vector-effect="non-scaling-stroke"
//       />
//       <text
//         x="${x - width / 2}"
//         y="${y + height / 2}"
//         font-size="0.25em"
//         text-anchor="middle"
//         dominant-baseline="middle"
//       >
//         ${text}
//       </text>
//     </g>
//   `;
// }

class XAxis {
  private height = 20;
  private numTicks = 5;
  private stroke = "#666";
  private labels: string[] = [];
  private centerLabels = false;

  constructor(config: {
    height: number;
    numTicks?: number;
    stroke?: string;
    labels?: string[];
    centerLabels?: boolean;
  }) {
    this.height = config.height;
    this.numTicks = config.numTicks ?? this.numTicks;
    this.stroke = config.stroke ?? this.stroke;
    this.labels = config.labels ?? this.labels;
    this.centerLabels = config.centerLabels ?? this.centerLabels;
  }

  setCenterLabels(centerLabels: boolean) {
    this.centerLabels = centerLabels;
  }

  getHeight() {
    return this.height;
  }

  toString({ width, x, y }: { width: number; x: number; y: number }) {
    const height = this.getHeight();

    const numTicks = this.numTicks;
    const arr = Array.from({ length: numTicks }, (_, i) => i);

    const tickWidth = width / (numTicks - 1);
    const tickOffset = tickWidth * (this.centerLabels ? 0.5 : 0);

    const line = `
      <line 
        x1="${x}" 
        y1="${y}" 
        x2="${x + width}" 
        y2="${y}" 
        stroke="${this.stroke}" 
        stroke-width="1"
        vector-effect="non-scaling-stroke"
      />
    `;

    x = x + tickOffset;

    return `<g>
      ${line}
      ${arr
        .map(
          (i) => `
          <line
            x1="${remap(x, x + width, (1 / (numTicks - 1)) * i)}"
            y1="${y}"
            x2="${remap(x, x + width, (1 / (numTicks - 1)) * i)}"
            y2="${y + height * 0.25}"
            stroke="${this.stroke}" 
            stroke-width="1"
            vector-effect="non-scaling-stroke"
          />
      `,
        )
        .join("")}

      ${this.labels
        .map(
          (label, i) => `
            <text
              x="${remap(x, x + width, (1 / (numTicks - 1)) * i)}"
              y="${y + height * 0.75}"
              font-size="1em"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              ${label}
            </text>
          `,
        )
        .join("")}
    </g>`;
  }

  getNumTicks() {
    return this.numTicks;
  }

  setNumTicks(numTicks: number) {
    this.numTicks = numTicks;
  }
}

class YAxis {
  private width = 20;
  private numTicks = 5;
  private stroke = "#666";
  private labels: string[] = [];
  private tickFormatter: (value: number, fixed: number) => string = (value, fixed) => value.toFixed(fixed);

  constructor(config: {
    width: number;
    numTicks?: number;
    stroke?: string;
    labels?: string[];
    tickFormatter?: (value: number, total: number) => string;
  }) {
    this.width = config.width;
    this.numTicks = config.numTicks ?? this.numTicks;
    this.stroke = config.stroke ?? this.stroke;
    this.labels = config.labels ?? this.labels;
    this.tickFormatter = config.tickFormatter ?? this.tickFormatter;
  }

  getWidth() {
    return this.width;
  }

  setLabels(labels: number[]) {
    this.labels = labels.map((label) => this.tickFormatter(label, 0));
  }

  toString({
    height,
    x,
    y,
  }: {
    height: number;
    x: number;
    y: number
  }) {
    const width = this.getWidth();

    const numTicks = this.numTicks;
    const arr = Array.from({ length: numTicks }, (_, i) => i);

    const tickWidth = 1;

    const left = x + width;
    return `<g>
      <rect x="${x}" y="${y}" width="${this.width}" height="${height}" fill="none" />
      <line 
        x1="${left}" 
        y1="${y}" 
        x2="${left}" 
        y2="${y + height}" 
        stroke="${this.stroke}" 
        stroke-width="1"
        vector-effect="non-scaling-stroke"
      />
      ${arr
        .map(
          (i) => `
          <line
            x1="${left}"
            y1="${remap(y + height, y, (1 / (numTicks - 1)) * i)}"
            x2="${left - tickWidth}"
            y2="${remap(y + height, y, (1 / (numTicks - 1)) * i)}"
            stroke="${this.stroke}" 
            stroke-width="1"
            vector-effect="non-scaling-stroke"
          />
      `,
        )
        .join("")}

      ${this.labels
        .map(
          (label, i) => `
            <text
              x="${left - tickWidth - 1}"
              y="${remap(y + height, y, (1 / (numTicks - 1)) * i)}"
              font-size="1em"
              text-anchor="end"
              dominant-baseline="middle"
            >
              ${label}
            </text>
          `,
        )
        .join("")}
    </g>`;
  }

  getNumTicks() {
    return this.numTicks;
  }
}

class CartesianGrid {
  stroke = "rgba(50, 50, 50, 0.15)";

  constructor(config?: { stroke?: string }) {
    this.stroke = config?.stroke ?? this.stroke;
  }

  render({
    height,
    width,
    x,
    y,
    numVerticalTicks,
    numHorizontalTicks,
  }: {
    height: number;
    width: number;
    x: number;
    y: number;
    numVerticalTicks: number;
    numHorizontalTicks: number;
  }) {
    const verticalTicks = Array.from({ length: numVerticalTicks }, (_, i) => i);
    const horizontalTicks = Array.from(
      { length: numHorizontalTicks },
      (_, i) => i,
    );

    return `
      <g>
        <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" />
        ${verticalTicks
        .map(
          (i) => `
            <line
              x1="${remap(x, x + width, (1 / (numVerticalTicks - 1)) * i)}"
              y1="${y}"
              x2="${remap(x, x + width, (1 / (numVerticalTicks - 1)) * i)}"
              y2="${y + height}"
              stroke="${this.stroke}"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
              class="grid-line"
            />
        `,
        )
        .join("")}

        ${horizontalTicks
        .map(
          (i) => `
            <line
              x1="${x}"
              y1="${remap(y + height, y, (1 / (numHorizontalTicks - 1)) * i)}"
              x2="${x + width}"
              y2="${remap(y + height, y, (1 / (numHorizontalTicks - 1)) * i)}"
              stroke="${this.stroke}"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
              class="grid-line"
            />
        `,
        )
        .join("")}
      </g>
    `;
  }
}

export class CartesianChart<
  K extends string,
  D extends Record<K, string | number>,
> {
  data: D[];
  height: number;
  width: number;
  padding: number;

  private _xAxis?: XAxis;
  private _yAxis?: YAxis;
  private grid?: CartesianGrid;
  private centerDataPoints = false;
  private backgroundColor?: string;
  private textColor = "currentColor";
  private stackOffset: "none" | "expand" = "none";

  maxYValue = 0;
  minYValue = 0;

  components: Component<string, K>[] = [];

  constructor({
    data,
    aspectRatio = 1,
    padding = 3,
    backgroundColor,
    textColor,
    stackOffset,
  }: {
    data: Record<K, string | number>[] & D[];
    aspectRatio?: number;
    padding?: number;
    backgroundColor?: string;
    textColor?: string;
    stackOffset?: "none" | "expand";
  }) {
    this.data = data;
    this.height = 100;
    this.width = 100 * aspectRatio;
    this.padding = padding;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor ?? this.textColor;
    this.stackOffset = stackOffset ?? this.stackOffset;

    return this;
  }

  bar(config: Omit<Bar<K>, "type">) {
    this.centerDataPoints = true;
    this.components.push({
      ...config,
      type: "bar",
    });
    return this;
  }

  area(config: Omit<Area<K>, "type">) {
    this.components.push({
      ...config,
      type: "area",
    });
    return this;
  }

  line(config: Omit<Line<K>, "type">) {
    this.components.push({
      ...config,
      type: "line",
    });
    return this;
  }

  private renderHighlights() {
    const plotArea = this.getPlotArea();
    const numSections = this.data.length - (this.centerDataPoints ? 0 : 1);
    const sectionWidth = plotArea.width / numSections;

    return Array.from({ length: numSections }, (_, i) => i)
      .map(
        (d, i) => `
        <g>
          <rect
            x="${plotArea.x + i * sectionWidth}"
            y="${plotArea.y}"
            width="${sectionWidth}"
            height="${plotArea.height}"
            fill="transparent"
            class="bar-group"
          />
        </g>
      `,
      )
      .join("");
  }

  private renderBars(bars: Component<string, K>[]) {
    const plotArea = this.getPlotArea();

    const sectionWidth = plotArea.width / this.data.length;
    let barWidth = sectionWidth / bars.length;
    const barSpacing = barWidth * 0.15;
    barWidth -= barSpacing * 1.5;

    const maxYValue = this.maxYValue;

    return Array.from({ length: this.data.length }, (_, i) => i)
      .map(
        (i) => `
        <g>
          ${bars
            .map((bar, j) => {
              const value = this.data[i]?.[bar.dataKey];
              if (typeof value !== "number") return "";

              const barHeight = remap(0, plotArea.height, value / maxYValue);

              return `
                <rect
                  x="${plotArea.x + i * sectionWidth + barWidth * j + barSpacing * (j + 1)}"
                  y="${plotArea.y + plotArea.height - barHeight}"
                  width="${barWidth}"
                  height="${barHeight}"
                  fill="${bar.fill}"
                  rx="${bar.borderRadius ?? 0}"
                  ry="${bar.borderRadius ?? 0}"
                  class="bar"
                />
              `;
            })
            .join("")}
        </g>
      `,
      )
      .join("");
  }

  private renderLines(lines: Component<string, K>[]) {
    const plotArea = this.getPlotArea();

    const sectionWidth =
      plotArea.width / (this.data.length - (this.centerDataPoints ? 0 : 1));
    const maxYValue = this.maxYValue;

    return lines
      .map((line) => {
        const points = this.data.map((d, i) => {
          const value = d[line.dataKey] as number;
          let x = i * sectionWidth;
          if (this.centerDataPoints) {
            x += sectionWidth / 2;
          }
          const normalizedValue = normalize(this.minYValue, this.maxYValue, value);
          const y = remap(plotArea.height, 0, normalizedValue);
          return { x: plotArea.x + x, y: plotArea.y + y };
        });

        const path = toCatmullRom(points, 0.5);

        return `
          <g>
            <path
              d="${path}" 
              fill="none"
              stroke="${line.stroke}"
              stroke-width="1"
              stroke-dasharray="${line.style === "dashed" ? "5, 5" : "none"}"
              vector-effect="non-scaling-stroke"
            />

            ${points
            .map(
              ({ x, y }) => `
                <circle
                  cx="${x}"
                  cy="${y}"
                  r="0.5"
                  fill="${line.stroke}"
                />
              `,
            )
            .join("")}
          </g>
        `;
      })
      .join("");
  }

  private renderAreas(areas: Component<string, K>[]) {
    const plotArea = this.getPlotArea();

    const sectionWidth =
      plotArea.width / (this.data.length - (this.centerDataPoints ? 0 : 1));

    const stacksMaxHeight = new Map<string, number>();
    const stacks = new Map<string, number>();

    return areas
      .map((area) => {
        this.data.map((d, i) => {
          let value = d[area.dataKey] as number;
          if (area.stackId) {
            value += stacksMaxHeight.get(`${area.stackId}-${i}`) ?? 0;
            stacksMaxHeight.set(`${area.stackId}-${i}`, value);
          }
        });
        return area;
      })
      .map((area) => {
        const points = this.data.map((d, i) => {
          let value = d[area.dataKey] as number;
          if (area.stackId) {
            value += stacks.get(`${area.stackId}-${i}`) ?? 0;
            stacks.set(`${area.stackId}-${i}`, value);
          }

          let x = i * sectionWidth;
          if (this.centerDataPoints) {
            x += sectionWidth / 2;
          }

          const maxYValue = this.stackOffset === "expand" ?
            (stacksMaxHeight.get(`${area.stackId}-${i}`) ?? this.maxYValue) :
            this.maxYValue;

          const normalizedValue = normalize(this.minYValue, maxYValue, value);
          const y = remap(plotArea.height, 0, normalizedValue);
          return { x: plotArea.x + x, y: plotArea.y + y };
        });

        const path = toCatmullRom(points, 0.5);

        const bottomLeft = points[0];
        bottomLeft.y = plotArea.y + plotArea.height;

        const bottomRight = points[points.length - 1];
        bottomRight.y = plotArea.y + plotArea.height;

        const areaPath = path + ` L ${bottomRight.x} ${bottomRight.y} L ${bottomLeft.x} ${bottomLeft.y} Z`;

        return `
          <g>
            <path
              d="${areaPath}"
              fill="${area.fill}"
              stroke="none"
              vector-effect="non-scaling-stroke"
            />
            <path
              d="${path}"
              stroke="${area.stroke}"
              fill="none"
              vector-effect="non-scaling-stroke"
            />
          </g>
        `;
      })
      .toReversed()
      .join("");
  }

  private renderComponents() {
    const bars = this.components.filter((c): c is Bar<K> => c.type === "bar");
    const lines = this.components.filter(
      (c): c is Line<K> => c.type === "line",
    );
    const areas = this.components.filter(
      (c): c is Area<K> => c.type === "area",
    );

    return {
      areas: this.renderAreas(areas),
      bars: this.renderBars(bars),
      lines: this.renderLines(lines),
      highlighs: this.renderHighlights(),
    }
  }

  private calculateHeightScale() {
    const stacks = new Map<string, number>();

    let maxYValue = -Infinity;
    let minYValue = Infinity;

    for (const component of this.components) {
      let i = 0
      for (const data of this.data) {
        const value = data[component.dataKey];
        if (typeof value !== "number") continue;
        let valueAsNumber = value as number;
        if (component.stackId) {
          valueAsNumber += stacks.get(`${component.stackId}-${i}`) ?? 0;
          stacks.set(`${component.stackId}-${i}`, valueAsNumber);
        }
        maxYValue = Math.max(maxYValue, valueAsNumber);
        minYValue = Math.min(minYValue, valueAsNumber);

        i++;
      }
    }
    const {
      roundedMin,
      roundedMax,
    } = roundByDigitsWithZeroInSegments({
      min: minYValue,
      max: maxYValue,
      segments: 4,
    });
    this.minYValue = roundedMin;
    this.maxYValue = roundedMax;
  }

  xAxis({
    dataKey,
    ...config
  }:
    | {
      height: number;
      numTicks?: number;
      centerLabels?: boolean;
      stroke?: string;
      dataKey?: undefined;
    }
    | {
      height: number;
      numTicks?: undefined;
      centerLabels?: boolean;
      stroke?: string;
      dataKey: K;
    }) {
    const labels = dataKey
      ? this.data.map((d) => {
        if (dataKey in d) {
          return String(d[dataKey]);
        }
        return "";
      })
      : [];
    this._xAxis = new XAxis({
      ...config,
      labels,
    });
    return this;
  }

  yAxis(config: {
    width: number;
    numTicks?: number;
    stroke?: string
    tickFormatter?: (value: number, total: number) => string;
  }) {
    this._yAxis = new YAxis(config);
    return this;
  }

  cartesianGrid() {
    this.grid = new CartesianGrid();
    return this;
  }

  private getPlotArea() {
    const xAxisHeight = this._xAxis?.getHeight() ?? 0;
    const yAxisWidth = this._yAxis?.getWidth() ?? 0;

    return {
      x: yAxisWidth + this.padding,
      y: this.padding,
      width: this.width - yAxisWidth - this.padding * 2,
      height: this.height - xAxisHeight - this.padding * 2,
    };
  }

  toString() {
    this.calculateHeightScale();

    const plotArea = this.getPlotArea();
    const numXTicks = this.data.length + (this.centerDataPoints ? 1 : 0);

    this._xAxis?.setCenterLabels(this.centerDataPoints);
    this._xAxis?.setNumTicks(numXTicks);
    const xAxisStr = this._xAxis?.toString({
      width: plotArea.width,
      x: plotArea.x,
      y: plotArea.y + plotArea.height,
    });

    if (this._yAxis) {
      const numYTicks = this._yAxis?.getNumTicks();
      const maxYValue = this.stackOffset === "expand" ? 1 : this.maxYValue;
      const minYValue = this.stackOffset === "expand" ? 0 : this.minYValue;
      const labels = Array.from({ length: numYTicks }, (_, i) =>
        remap(minYValue, maxYValue, (1 / (numYTicks - 1)) * i),
      );
      this._yAxis.setLabels(labels);
    }
    const yAxisStr = this._yAxis?.toString({
      height: plotArea.height,
      x: this.padding,
      y: plotArea.y,
    });

    const gridStr = this.grid?.render({
      height: plotArea.height,
      width: plotArea.width,
      x: plotArea.x,
      y: plotArea.y,
      numVerticalTicks: numXTicks,
      numHorizontalTicks: this._yAxis?.getNumTicks() ?? 5,
    });

    const components = this.renderComponents();

    return `
      <svg 
        style="font-size: 2.5px; font-family: sans-serif;"
        viewBox="0 0 ${this.width} ${this.height}" 
        width="100%" 
        xmlns="http://www.w3.org/2000/svg" 
        preserveAspectRatio="xMidYMid meet">
        <style>
          .grid-line {
            stroke-dasharray: 3, 3;
          }
          .tooltip {
            display: none;
          }
          g:hover .tooltip {
            display: block;
          }

          .bar-group {
            fill: transparent;
          }
          g:hover > .bar-group {
            fill: rgba(0, 0, 0, 0.03);
          }
          text {
            fill: ${this.textColor};
          }
          svg {
            background-color: ${this.backgroundColor ?? "transparent"}; 
          }
        </style>
        ${components.areas}
        ${components.bars}
        ${yAxisStr}
        ${xAxisStr}
        ${components.lines}
        ${components.highlighs}
        ${gridStr}
      </svg>
    `;
  }
}
