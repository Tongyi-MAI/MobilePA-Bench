// Render representative task interactions across the four capability dimensions.
(function () {
  "use strict";

  const data = window.TASK_EXAMPLES_DATA;
  if (!data) return;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function interactionMarkup(entry, index, isFinal) {
    const role = entry.role === "environment" ? "Environment" :
      entry.role === "user" ? "User" : "Model";

    return [
      '<div class="interaction-row interaction-', escapeHtml(entry.role),
        isFinal ? ' interaction-final' : '', '">',
        '<span class="interaction-step" aria-hidden="true">',
          String(index + 1).padStart(2, "0"),
        '</span>',
        '<span class="interaction-role">', role, '</span>',
        '<div class="interaction-content">',
          '<strong>', escapeHtml(entry.label), '</strong>',
          '<p>', escapeHtml(entry.detail), '</p>',
        '</div>',
      '</div>'
    ].join("");
  }

  function caseMarkup(item) {
    const trace = [
      { role: "user", label: "Request", detail: item.query },
      ...item.interactions
    ];

    return [
      '<article class="task-example">',
        '<header class="task-example-head">',
          '<div class="task-example-identity">',
            '<span class="task-example-id">', escapeHtml(item.id), '</span>',
            '<h4>', escapeHtml(item.title), '</h4>',
          '</div>',
          '<div class="task-example-meta" aria-label="Evaluation policy and subtype">',
            '<span>', escapeHtml(item.checker), '</span>',
            '<span>', escapeHtml(item.subtype), '</span>',
          '</div>',
        '</header>',
        '<div class="task-interaction">',
          '<span class="case-label">Interaction trace</span>',
          '<div class="interaction-thread">',
            trace.map((entry, index) => interactionMarkup(entry, index, false)).join(""),
            interactionMarkup(
              { role: "model", label: "Final response", detail: item.finalResponse },
              trace.length,
              true
            ),
          '</div>',
        '</div>',
      '</article>'
    ].join("");
  }

  function renderDimension(key, focusPanel) {
    const dimension = data.dimensions[key];
    const panel = document.getElementById("case-panel");
    const tabs = Array.from(document.querySelectorAll(".case-tab"));
    if (!dimension || !panel) return;

    tabs.forEach((tab) => {
      const active = tab.dataset.dimension === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.setAttribute("tabindex", active ? "0" : "-1");
    });

    const activeTab = tabs.find((tab) => tab.dataset.dimension === key);
    panel.setAttribute("aria-labelledby", activeTab ? activeTab.id : "");
    panel.innerHTML = [
      '<div class="case-dimension-head">',
        '<h3>', escapeHtml(dimension.title), '</h3>',
        '<p>', escapeHtml(dimension.summary), '</p>',
      '</div>',
      '<div class="task-example-list">',
        dimension.cases.map(caseMarkup).join(""),
      '</div>',
      '<p class="case-source-note">',
        'Each example shows the user request, model actions, environment responses, and final model response. ',
        'The tags identify the scenario evaluation policy and subtype.',
      '</p>'
    ].join("");

    if (focusPanel) panel.focus({ preventScroll: true });
  }

  function tabFromHash(tabs) {
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    return tabs.find((tab) => tab.dataset.anchor === targetId);
  }

  function updateHash(tab) {
    const nextHash = "#" + tab.dataset.anchor;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
  }

  function scrollToCases() {
    const section = document.getElementById("cases");
    const navigation = document.querySelector("nav");
    if (!section) return;

    window.requestAnimationFrame(() => {
      const navigationHeight = navigation ? navigation.getBoundingClientRect().height : 0;
      const top = section.getBoundingClientRect().top + window.scrollY - navigationHeight - 12;
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const tabs = Array.from(document.querySelectorAll(".case-tab"));
    if (!tabs.length) return;

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        updateHash(tab);
        renderDimension(tab.dataset.dimension, false);
        scrollToCases();
      });
      tab.addEventListener("keydown", (event) => {
        let targetIndex = null;
        if (event.key === "ArrowRight") targetIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") targetIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") targetIndex = 0;
        if (event.key === "End") targetIndex = tabs.length - 1;
        if (targetIndex === null) return;

        event.preventDefault();
        tabs[targetIndex].focus();
        updateHash(tabs[targetIndex]);
        renderDimension(tabs[targetIndex].dataset.dimension, false);
        scrollToCases();
      });
    });

    window.addEventListener("hashchange", () => {
      const targetTab = tabFromHash(tabs);
      if (targetTab) {
        renderDimension(targetTab.dataset.dimension, false);
        scrollToCases();
      }
    });

    const initialTab = tabFromHash(tabs);
    if (initialTab) {
      renderDimension(initialTab.dataset.dimension, false);
      scrollToCases();
    } else {
      renderDimension("basic", false);
    }
  });
})();
