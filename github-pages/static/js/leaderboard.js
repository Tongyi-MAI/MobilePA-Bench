// Render MobilePA-Bench leaderboard with Tabulator; highlight best value per metric column.
(function () {
  const METRICS = ["overall", "basic", "memory", "skills", "subagent"];

  function computeBest(data) {
    const best = {};
    METRICS.forEach((m) => {
      best[m] = Math.max(...data.map((r) => r[m]));
    });
    return best;
  }

  function pctFormatter(best, key) {
    return function (cell) {
      const v = cell.getValue();
      if (v === null || v === undefined) return "-";
      const txt = v.toFixed(2);
      if (Math.abs(v - best[key]) < 1e-9) {
        return "<span class='best-score'>" + txt + "</span>";
      }
      return txt;
    };
  }

  function costFormatter(cell) {
    const value = cell.getValue();
    return value === null || value === undefined ? "-" : "$" + value.toFixed(2);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const data = LEADERBOARD_DATA.slice();
    const best = computeBest(data);

    new Tabulator("#leaderboard-table", {
      data: data,
      layout: "fitColumns",
      initialSort: [{ column: "overall", dir: "desc" }],
      columnDefaults: { headerHozAlign: "center", hozAlign: "center", resizable: false },
      rowFormatter: function (row) {
        // subtle zebra handled by CSS; nothing extra
      },
      columns: [
        {
          title: "#", field: "rank", width: 55, headerSort: false, hozAlign: "center",
          formatter: function (cell) { return cell.getRow().getPosition(true); },
        },
        {
          title: "Model", field: "model", minWidth: 170, hozAlign: "left", headerHozAlign: "left",
          formatter: function (cell) {
            const d = cell.getRow().getData();
            return "<span class='model-name'>" + d.model + "</span>" +
                   "<span class='model-org'>" + d.org + "</span>";
          },
        },
        { title: "Overall", field: "overall", width: 105, sorter: "number", formatter: pctFormatter(best, "overall"), cssClass: "col-overall" },
        { title: "Tool Use", field: "basic", sorter: "number", formatter: pctFormatter(best, "basic") },
        { title: "Memory", field: "memory", sorter: "number", formatter: pctFormatter(best, "memory") },
        { title: "Skills", field: "skills", sorter: "number", formatter: pctFormatter(best, "skills") },
        { title: "Sub-agent", field: "subagent", sorter: "number", formatter: pctFormatter(best, "subagent") },
        { title: "Cost/1K Tasks", field: "costPer1k", width: 130, sorter: "number", formatter: costFormatter },
      ],
    });
  });
})();
