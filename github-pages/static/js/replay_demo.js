(function () {
  "use strict";

  var scenarios = window.MobilePAReplayScenarios || [];
  var root = document.querySelector("[data-replay-console]");

  if (!root || !scenarios.length) {
    return;
  }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stepDelay = 1120;
  var finalHold = 1900;
  var scenarioIndex = 0;
  var currentStep = 0;
  var timer = null;
  var inViewport = false;
  var userPaused = false;
  var mobilePhaseIndex = -1;

  var elements = {
    tabs: root.querySelector(".replay-tabs"),
    stage: root.querySelector(".replay-stage"),
    index: root.querySelector("[data-replay-index]"),
    title: root.querySelector("[data-replay-title]"),
    summary: root.querySelector("[data-replay-summary]"),
    capabilities: root.querySelector("[data-replay-capabilities]"),
    dialogue: root.querySelector("[data-replay-dialogue]"),
    execution: root.querySelector("[data-replay-execution]"),
    policy: root.querySelector("[data-replay-policy]"),
    checks: root.querySelector("[data-replay-checks]"),
    verdict: root.querySelector("[data-replay-verdict]"),
    verdictText: root.querySelector("[data-replay-verdict] strong"),
    progress: root.querySelector("[data-replay-progress]"),
    status: root.querySelector("[data-replay-status]"),
    restart: root.querySelector("[data-replay-restart]"),
    toggle: root.querySelector("[data-replay-toggle]"),
    next: root.querySelector("[data-replay-next]")
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function eventAttributes(at) {
    return " data-at=\"" + Number(at) + "\"";
  }

  function renderTabs() {
    elements.tabs.innerHTML = scenarios.map(function (scenario, index) {
      return [
        "<button class=\"replay-tab\" type=\"button\" role=\"tab\"",
        " aria-selected=\"", index === scenarioIndex ? "true" : "false", "\"",
        " tabindex=\"", index === scenarioIndex ? "0" : "-1", "\"",
        " data-replay-scenario=\"", escapeHtml(scenario.id), "\">",
        "<span class=\"replay-tab-number\">0", index + 1, "</span>",
        "<span><strong>", escapeHtml(scenario.tab), "</strong>",
        "<small>", escapeHtml(scenario.policy), "</small></span>",
        "</button>"
      ].join("");
    }).join("");
  }

  function renderDialogue(items) {
    return items.map(function (item) {
      var icon = item.role === "user" ? "fa-user" : "fa-wand-magic-sparkles";
      return [
        "<article class=\"replay-event replay-message replay-message-", escapeHtml(item.role), "\"",
        eventAttributes(item.at), ">",
        "<span class=\"replay-avatar\"><i class=\"fas ", icon, "\" aria-hidden=\"true\"></i></span>",
        "<div><span class=\"replay-message-label\">", escapeHtml(item.label), "</span>",
        "<p>", escapeHtml(item.text), "</p></div>",
        "</article>"
      ].join("");
    }).join("");
  }

  function renderExecution(items) {
    return items.map(function (item) {
      var code = item.code
        ? "<pre>" + escapeHtml(item.code) + "</pre>"
        : "";
      return [
        "<article class=\"replay-event replay-trace replay-trace-", escapeHtml(item.type), "\"",
        eventAttributes(item.at), ">",
        "<span class=\"replay-trace-marker\"><i class=\"fas ", escapeHtml(item.icon), "\" aria-hidden=\"true\"></i></span>",
        "<div class=\"replay-trace-copy\">",
        "<span class=\"replay-trace-type\">", escapeHtml(item.type), "</span>",
        "<strong>", escapeHtml(item.title), "</strong>",
        "<p>", escapeHtml(item.detail), "</p>",
        code,
        "</div>",
        "</article>"
      ].join("");
    }).join("");
  }

  function renderChecks(items) {
    return items.map(function (item) {
      return [
        "<article class=\"replay-event replay-check\"", eventAttributes(item.at), ">",
        "<span class=\"replay-check-icon\"><i class=\"fas fa-check\" aria-hidden=\"true\"></i></span>",
        "<div><strong>", escapeHtml(item.label), "</strong>",
        "<span>", escapeHtml(item.value), "</span></div>",
        "</article>"
      ].join("");
    }).join("");
  }

  function updateTabs() {
    root.querySelectorAll("[data-replay-scenario]").forEach(function (tab, index) {
      var active = index === scenarioIndex;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.setAttribute("tabindex", active ? "0" : "-1");
    });
  }

  function renderScenario(index) {
    var scenario = scenarios[index];

    scenarioIndex = index;
    clearTimer();
    renderTabs();
    updateTabs();

    root.setAttribute("data-scenario", scenario.id);
    root.classList.remove("is-complete");
    elements.index.textContent = String(index + 1).padStart(2, "0") + " / " + String(scenarios.length).padStart(2, "0");
    elements.title.textContent = scenario.title;
    elements.summary.textContent = scenario.summary;
    elements.capabilities.innerHTML = scenario.capabilities.map(function (capability) {
      return "<span class=\"replay-capability replay-capability-" +
        escapeHtml(capability.id) + "\">" + escapeHtml(capability.label) + "</span>";
    }).join("");
    elements.dialogue.innerHTML = renderDialogue(scenario.dialogue);
    elements.execution.innerHTML = renderExecution(scenario.execution);
    elements.policy.innerHTML = [
      "<span>Evaluation bucket</span>",
      "<strong>", escapeHtml(scenario.policy), "</strong>",
      "<small>", escapeHtml(scenario.policyLabel), "</small>"
    ].join("");
    elements.checks.innerHTML = renderChecks(scenario.checks);
    elements.verdict.setAttribute("data-at", scenario.verdictAt);
    elements.verdictText.textContent = scenario.verdict;

    mobilePhaseIndex = -1;
    currentStep = reducedMotion ? scenario.totalSteps - 1 : 0;
    applyStep();

    if (!reducedMotion) {
      scheduleNext(stepDelay);
    }
  }

  function updateMobilePhase(scenario) {
    var phaseIndex = currentStep === 0
      ? 0
      : (currentStep < scenario.totalSteps - 2 ? 1 : 2);
    var phases = ["dialogue", "execution", "evaluation"];

    root.setAttribute("data-phase", phases[phaseIndex]);

    if (window.innerWidth <= 720 && phaseIndex !== mobilePhaseIndex) {
      window.requestAnimationFrame(function () {
        elements.stage.scrollTo({
          left: elements.stage.clientWidth * phaseIndex,
          behavior: reducedMotion ? "auto" : "smooth"
        });
      });
    } else if (window.innerWidth > 720) {
      elements.stage.scrollLeft = 0;
    }

    mobilePhaseIndex = phaseIndex;
  }

  function applyStep() {
    var scenario = scenarios[scenarioIndex];
    var lastStep = scenario.totalSteps - 1;

    root.querySelectorAll("[data-at]").forEach(function (item) {
      var at = Number(item.getAttribute("data-at"));
      item.classList.toggle("is-visible", at <= currentStep);
      item.classList.toggle("is-active", at === currentStep);
    });

    elements.progress.style.width = (((currentStep + 1) / scenario.totalSteps) * 100) + "%";
    elements.status.textContent = scenario.statuses[currentStep] || scenario.statuses[lastStep];
    root.classList.toggle("is-complete", currentStep >= lastStep);
    updateMobilePhase(scenario);

    if (currentStep >= lastStep) {
      scheduleNext(finalHold);
    }
  }

  function canPlay() {
    return !reducedMotion && !userPaused && inViewport && !document.hidden;
  }

  function clearTimer() {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
  }

  function scheduleNext(delay) {
    clearTimer();

    if (!canPlay()) {
      return;
    }

    timer = window.setTimeout(function () {
      var scenario = scenarios[scenarioIndex];
      var lastStep = scenario.totalSteps - 1;

      if (currentStep < lastStep) {
        currentStep += 1;
        applyStep();
        if (currentStep < lastStep) {
          scheduleNext(stepDelay);
        }
      } else {
        renderScenario((scenarioIndex + 1) % scenarios.length);
      }
    }, delay);
  }

  function syncToggle() {
    var paused = userPaused || reducedMotion;
    var icon = elements.toggle.querySelector("i");

    elements.toggle.disabled = reducedMotion;
    elements.toggle.setAttribute("aria-label", paused ? "Play replay" : "Pause replay");
    elements.toggle.setAttribute("title", paused ? "Play replay" : "Pause replay");
    icon.className = paused ? "fas fa-play" : "fas fa-pause";
    root.classList.toggle("is-paused", paused);
  }

  function restartScenario() {
    userPaused = false;
    renderScenario(scenarioIndex);
    syncToggle();
  }

  function selectNextScenario() {
    userPaused = false;
    renderScenario((scenarioIndex + 1) % scenarios.length);
    syncToggle();
  }

  elements.tabs.addEventListener("click", function (event) {
    var tab = event.target.closest("[data-replay-scenario]");

    if (!tab) {
      return;
    }

    var nextIndex = scenarios.findIndex(function (scenario) {
      return scenario.id === tab.getAttribute("data-replay-scenario");
    });

    if (nextIndex >= 0) {
      userPaused = false;
      renderScenario(nextIndex);
      syncToggle();
    }
  });

  elements.tabs.addEventListener("keydown", function (event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    var direction = event.key === "ArrowRight" ? 1 : -1;
    var nextIndex = (scenarioIndex + direction + scenarios.length) % scenarios.length;
    renderScenario(nextIndex);
    root.querySelectorAll("[data-replay-scenario]")[nextIndex].focus();
  });

  elements.restart.addEventListener("click", restartScenario);
  elements.next.addEventListener("click", selectNextScenario);
  elements.toggle.addEventListener("click", function () {
    userPaused = !userPaused;
    syncToggle();

    if (userPaused) {
      clearTimer();
    } else {
      scheduleNext(currentStep >= scenarios[scenarioIndex].totalSteps - 1 ? finalHold : stepDelay);
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      clearTimer();
    } else {
      scheduleNext(stepDelay);
    }
  });
  window.addEventListener("resize", function () {
    mobilePhaseIndex = -1;
    updateMobilePhase(scenarios[scenarioIndex]);
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      inViewport = entries[0].isIntersecting;

      if (inViewport) {
        scheduleNext(stepDelay);
      } else {
        clearTimer();
      }
    }, { threshold: 0.28 });

    observer.observe(root);
  } else {
    inViewport = true;
  }

  if (reducedMotion) {
    root.classList.add("is-reduced-motion");
  }

  renderScenario(0);
  syncToggle();

  if (!("IntersectionObserver" in window)) {
    scheduleNext(stepDelay);
  }
}());
