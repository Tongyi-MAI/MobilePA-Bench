(function () {
  "use strict";

  window.MobilePAReplayScenarios = [
    {
      id: "tool",
      tab: "Exact Tool Call",
      policy: "tool_acc",
      policyLabel: "Exact tool + arguments",
      title: "Exact Tool Grounding",
      summary: "Match the selected tool and every required grounded argument.",
      capabilities: [
        { id: "basic", label: "Tool Use" }
      ],
      totalSteps: 6,
      statuses: [
        "Reading the user request",
        "Grounding the requested action",
        "Calling the selected mobile tool",
        "Receiving environment feedback",
        "Checking tool and argument evidence",
        "Exact tool plan verified"
      ],
      dialogue: [
        {
          at: 0,
          role: "user",
          label: "User",
          text: "Set an alarm for 7:30 tomorrow called Morning run."
        },
        {
          at: 3,
          role: "agent",
          label: "Planner",
          text: "Done. The Morning run alarm is set for 7:30 tomorrow."
        }
      ],
      execution: [
        {
          at: 1,
          type: "plan",
          icon: "fa-route",
          title: "Intent grounded",
          detail: "Create one alarm with an explicit time and title."
        },
        {
          at: 2,
          type: "tool",
          icon: "fa-screwdriver-wrench",
          title: "manage_alarm",
          detail: "Structured mobile API call",
          code: "action: create\ntime: 07:30\ntitle: Morning run"
        },
        {
          at: 3,
          type: "environment",
          icon: "fa-mobile-screen-button",
          title: "Environment response",
          detail: "Alarm created and enabled for tomorrow at 07:30."
        }
      ],
      checks: [
        { at: 4, label: "Tool name", value: "manage_alarm" },
        { at: 4, label: "Argument fields", value: "action / time / title" },
        { at: 5, label: "Grounded values", value: "create / 07:30 / Morning run" }
      ],
      verdictAt: 5,
      verdict: "Exact tool plan matched"
    },
    {
      id: "state",
      tab: "Stateful Completion",
      policy: "task_db_acc",
      policyLabel: "Final environment state",
      title: "Personalized Stateful Task",
      summary: "Verify that the executed plan produces the intended persistent state.",
      capabilities: [
        { id: "basic", label: "Tool Use" },
        { id: "memory", label: "Memory Usage" },
        { id: "skills", label: "Skill Usage" }
      ],
      totalSteps: 7,
      statuses: [
        "Reading the implicit preference request",
        "Retrieving relevant user memory",
        "Loading a reusable travel skill",
        "Executing the grounded schedule action",
        "Observing the persistent state change",
        "Comparing current and target state",
        "Target environment state verified"
      ],
      dialogue: [
        {
          at: 0,
          role: "user",
          label: "User",
          text: "Plan my usual Saturday trip to Hangzhou and add it to my calendar."
        },
        {
          at: 4,
          role: "agent",
          label: "Planner",
          text: "Your usual evening Hangzhou trip is now on Saturday's calendar."
        }
      ],
      execution: [
        {
          at: 1,
          type: "memory",
          icon: "fa-brain",
          title: "search_user_memory",
          detail: "Preference hit: depart after 18:00 and use a quiet coach.",
          code: "query: usual Hangzhou trip\nmemoryCategory: routines_habits"
        },
        {
          at: 2,
          type: "skill",
          icon: "fa-layer-group",
          title: "travel-weather-navigation",
          detail: "Reusable workflow selected for route and timing constraints."
        },
        {
          at: 3,
          type: "tool",
          icon: "fa-calendar-plus",
          title: "manage_schedule",
          detail: "Add the resolved itinerary to the calendar.",
          code: "action: create\nevent: Hangzhou trip\ndatetime: Saturday 18:32"
        },
        {
          at: 4,
          type: "environment",
          icon: "fa-database",
          title: "Database delta",
          detail: "schedules +1 / Hangzhou trip / Saturday 18:32"
        }
      ],
      checks: [
        { at: 5, label: "Expected delta", value: "schedule record +1" },
        { at: 5, label: "Critical fields", value: "event / datetime" },
        { at: 6, label: "Final state", value: "current DB = target DB" }
      ],
      verdictAt: 6,
      verdict: "Target state reached"
    },
    {
      id: "handoff",
      tab: "Interactive Handoff",
      policy: "task_api_acc",
      policyLabel: "Behavioral judge",
      title: "Open-ended Sub-agent Handoff",
      summary: "Judge whether delegation, returned information, and follow-up behavior complete the task.",
      capabilities: [
        { id: "basic", label: "Tool Use" },
        { id: "subagent", label: "Sub-agent Collaboration" }
      ],
      totalSteps: 7,
      statuses: [
        "Reading the open-ended request",
        "Selecting a specialized sub-agent",
        "Delegating the restaurant search",
        "Receiving candidate places",
        "Returning control to the user",
        "Judging task-specific behavior",
        "Interactive behavior verified"
      ],
      dialogue: [
        {
          at: 0,
          role: "user",
          label: "User",
          text: "What are some good restaurants near Hangzhou East Railway Station?"
        },
        {
          at: 4,
          role: "agent",
          label: "Planner",
          text: "I found Green Tea, Grandma's Home, and Xin Bai Lu nearby. Any of these?"
        }
      ],
      execution: [
        {
          at: 1,
          type: "plan",
          icon: "fa-code-branch",
          title: "Handoff selected",
          detail: "The request needs open-domain place search and user choice."
        },
        {
          at: 2,
          type: "subagent",
          icon: "fa-sitemap",
          title: "qa_task",
          detail: "Delegate the constrained restaurant search.",
          code: "query: Find three well-rated restaurants\nnear Hangzhou East Railway Station"
        },
        {
          at: 3,
          type: "environment",
          icon: "fa-location-dot",
          title: "Sub-agent response",
          detail: "Three nearby candidates returned with cuisine and distance."
        }
      ],
      checks: [
        { at: 5, label: "Valid handoff", value: "appropriate specialist selected" },
        { at: 5, label: "Useful response", value: "relevant candidate restaurants" },
        { at: 6, label: "Ask behavior", value: "reasonable confirmation request" }
      ],
      verdictAt: 6,
      verdict: "Behavior judged reasonable"
    }
  ];
}());
