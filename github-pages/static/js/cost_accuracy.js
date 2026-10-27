// Render the responsive performance-vs-cost scatter plot with an axis break.
(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const WIDTH = 1000;
  const HEIGHT = 520;
  const MARGIN = { top: 50, right: 36, bottom: 82, left: 84 };
  const Y_MIN = 59;
  const Y_MAX = 80;
  const X_LEFT_MAX = 22;
  const X_RIGHT_MIN = 60;
  const X_RIGHT_MAX = 70;
  const X_GAP = 32;

  function svgElement(tag, attributes, text) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes || {}).forEach(([key, value]) => node.setAttribute(key, value));
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function appendLine(parent, x1, y1, x2, y2, className) {
    parent.appendChild(svgElement("line", { x1, y1, x2, y2, class: className }));
  }

  document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("cost-accuracy-chart");
    if (!root || typeof COST_ACCURACY_DATA === "undefined") return;

    const leaderboard = typeof LEADERBOARD_DATA === "undefined" ? [] : LEADERBOARD_DATA;
    const leaderboardByModel = new Map(leaderboard.map((entry) => [entry.model, entry]));
    const data = COST_ACCURACY_DATA.map((entry) => {
      const source = entry.leaderboardModel ? leaderboardByModel.get(entry.leaderboardModel) : null;
      return Object.assign({}, entry, { overall: entry.overall ?? source?.overall });
    }).filter((entry) => Number.isFinite(entry.overall) && Number.isFinite(entry.cost));

    const plotLeft = MARGIN.left;
    const plotRight = WIDTH - MARGIN.right;
    const plotTop = MARGIN.top;
    const plotBottom = HEIGHT - MARGIN.bottom;
    const xScalePerDollar = (plotRight - plotLeft - X_GAP) /
      (X_LEFT_MAX + X_RIGHT_MAX - X_RIGHT_MIN);
    const leftSegmentEnd = plotLeft + X_LEFT_MAX * xScalePerDollar;
    const rightSegmentStart = leftSegmentEnd + X_GAP;

    function xPosition(cost) {
      if (cost <= X_LEFT_MAX) return plotLeft + cost * xScalePerDollar;
      return rightSegmentStart + (cost - X_RIGHT_MIN) * xScalePerDollar;
    }

    function yPosition(overall) {
      return plotBottom - ((overall - Y_MIN) / (Y_MAX - Y_MIN)) * (plotBottom - plotTop);
    }

    const svg = svgElement("svg", {
      viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
      role: "img",
      "aria-labelledby": "cost-chart-title cost-chart-description",
    });
    svg.appendChild(svgElement("title", { id: "cost-chart-title" }, "MobilePA-Bench overall accuracy versus output cost"));
    svg.appendChild(svgElement(
      "desc",
      { id: "cost-chart-description" },
      "Scatter plot comparing overall accuracy with estimated output cost per one thousand tasks. Higher and farther left is better. The cost axis omits values from 22 to 60 dollars."
    ));

    const grid = svgElement("g", { class: "cost-chart-grid", "aria-hidden": "true" });
    [60, 65, 70, 75, 80].forEach((tick) => {
      const y = yPosition(tick);
      appendLine(grid, plotLeft, y, leftSegmentEnd, y, "cost-grid-line");
      appendLine(grid, rightSegmentStart, y, plotRight, y, "cost-grid-line");
      grid.appendChild(svgElement("text", {
        x: plotLeft - 14,
        y: y + 4,
        class: "cost-tick-label",
        "text-anchor": "end",
      }, String(tick)));
    });

    [0, 5, 10, 15, 20].forEach((tick) => {
      const x = xPosition(tick);
      appendLine(grid, x, plotTop, x, plotBottom, "cost-grid-line");
      grid.appendChild(svgElement("text", {
        x,
        y: plotBottom + 26,
        class: "cost-tick-label",
        "text-anchor": "middle",
      }, String(tick)));
    });
    [60, 65, 70].forEach((tick) => {
      const x = xPosition(tick);
      appendLine(grid, x, plotTop, x, plotBottom, "cost-grid-line");
      grid.appendChild(svgElement("text", {
        x,
        y: plotBottom + 26,
        class: "cost-tick-label",
        "text-anchor": "middle",
      }, String(tick)));
    });
    svg.appendChild(grid);

    const axes = svgElement("g", { class: "cost-chart-axes", "aria-hidden": "true" });
    appendLine(axes, plotLeft, plotBottom, leftSegmentEnd, plotBottom, "cost-axis-line");
    appendLine(axes, rightSegmentStart, plotBottom, plotRight, plotBottom, "cost-axis-line");
    appendLine(axes, plotLeft, plotTop, plotLeft, plotBottom, "cost-axis-line");

    const breakCenter = (leftSegmentEnd + rightSegmentStart) / 2;
    appendLine(axes, breakCenter - 9, plotBottom + 5, breakCenter - 2, plotBottom - 5, "cost-axis-break");
    appendLine(axes, breakCenter + 2, plotBottom + 5, breakCenter + 9, plotBottom - 5, "cost-axis-break");

    axes.appendChild(svgElement("text", {
      x: (plotLeft + plotRight) / 2,
      y: HEIGHT - 22,
      class: "cost-axis-title cost-axis-title-x",
      "text-anchor": "middle",
    }, "Output cost (USD / 1K tasks)"));
    axes.appendChild(svgElement("text", {
      x: 23,
      y: (plotTop + plotBottom) / 2,
      class: "cost-axis-title cost-axis-title-y",
      "text-anchor": "middle",
      transform: `rotate(-90 23 ${(plotTop + plotBottom) / 2})`,
    }, "Overall accuracy (%)"));
    axes.appendChild(svgElement("text", {
      x: plotLeft + 10,
      y: plotTop + 21,
      class: "cost-better-label",
    }, "↖ Better"));
    svg.appendChild(axes);

    const points = svgElement("g", { class: "cost-chart-points" });
    const pointNodes = [];
    data.forEach((entry) => {
      const x = xPosition(entry.cost);
      const y = yPosition(entry.overall);
      const group = svgElement("g", {
        class: `cost-point${entry.featured ? " is-featured" : ""}`,
        tabindex: "0",
        role: "button",
        "aria-label": `${entry.model}, overall ${entry.overall.toFixed(2)} percent, ${entry.costApprox ? "approximately " : ""}${entry.cost.toFixed(2)} dollars per 1,000 tasks${entry.provisional ? ", provisional cost estimate" : ""}`,
      });

      if (entry.featured) {
        group.appendChild(svgElement("circle", {
          cx: x,
          cy: y,
          r: 13,
          class: "cost-point-halo",
        }));
      }
      group.appendChild(svgElement("circle", {
        cx: x,
        cy: y,
        r: entry.featured ? 8 : 7,
        class: "cost-point-dot",
        fill: entry.color,
      }));
      group.appendChild(svgElement("text", {
        x: x + entry.labelDx,
        y: y + entry.labelDy,
        class: `cost-point-label${entry.featured ? " is-featured" : ""}`,
        "text-anchor": entry.labelAnchor,
      }, entry.label));
      points.appendChild(group);
      pointNodes.push({ group, entry, x, y });
    });
    svg.appendChild(points);

    const tooltipWidth = 278;
    const tooltipHeight = 78;
    const tooltip = svgElement("g", {
      class: "cost-chart-tooltip",
      "aria-hidden": "true",
      visibility: "hidden",
    });
    tooltip.appendChild(svgElement("rect", {
      width: tooltipWidth,
      height: tooltipHeight,
      rx: 8,
      ry: 8,
    }));
    const tooltipModel = svgElement("text", { x: 13, y: 22, class: "cost-tooltip-model" });
    const tooltipAccuracy = svgElement("text", { x: 13, y: 43, class: "cost-tooltip-value" });
    const tooltipCost = svgElement("text", { x: 13, y: 63, class: "cost-tooltip-value" });
    tooltip.appendChild(tooltipModel);
    tooltip.appendChild(tooltipAccuracy);
    tooltip.appendChild(tooltipCost);
    svg.appendChild(tooltip);

    let activeGroup = null;
    function showTooltip(point) {
      if (activeGroup) activeGroup.classList.remove("is-active");
      activeGroup = point.group;
      activeGroup.classList.add("is-active");
      tooltipModel.textContent = point.entry.model;
      tooltipAccuracy.textContent = `Overall: ${point.entry.overall.toFixed(2)}%`;
      tooltipCost.textContent = `Cost: ${point.entry.costApprox ? "≈" : ""}$${point.entry.cost.toFixed(2)} / 1K tasks${point.entry.provisional ? " (provisional)" : ""}`;

      const x = point.x > WIDTH - MARGIN.right - tooltipWidth - 20
        ? point.x - tooltipWidth - 15
        : point.x + 15;
      const y = point.y - tooltipHeight - 13 < 8
        ? point.y + 14
        : point.y - tooltipHeight - 13;
      tooltip.setAttribute("transform", `translate(${x} ${y})`);
      tooltip.setAttribute("visibility", "visible");
      tooltip.setAttribute("aria-hidden", "false");
    }

    function hideTooltip() {
      if (activeGroup) activeGroup.classList.remove("is-active");
      activeGroup = null;
      tooltip.setAttribute("visibility", "hidden");
      tooltip.setAttribute("aria-hidden", "true");
    }

    pointNodes.forEach((point) => {
      point.group.addEventListener("pointerenter", () => showTooltip(point));
      point.group.addEventListener("pointerleave", hideTooltip);
      point.group.addEventListener("focus", () => showTooltip(point));
      point.group.addEventListener("blur", hideTooltip);
      point.group.addEventListener("click", (event) => {
        event.stopPropagation();
        if (activeGroup === point.group) hideTooltip();
        else showTooltip(point);
      });
      point.group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showTooltip(point);
        }
        if (event.key === "Escape") hideTooltip();
      });
    });
    svg.addEventListener("click", hideTooltip);

    root.replaceChildren(svg);
  });
})();
