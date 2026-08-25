(function () {
  "use strict";

  const evaluationServiceUrl = "https://116.62.42.171";
  window.MobilePABenchConfig = { evaluationServiceUrl };

  document.querySelectorAll("[data-evaluation-path]").forEach((link) => {
    const path = link.getAttribute("data-evaluation-path") || "/";
    link.href = evaluationServiceUrl.replace(/\/$/, "") + path;
  });
}());
