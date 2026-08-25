// Representative task traces across the four MobilePA-Bench capability dimensions.
window.TASK_EXAMPLES_DATA = {
  dimensions: {
    basic: {
      title: "Tool Use",
      summary: "Direct tool execution, stateful completion, and safe handling of conflicting intents.",
      cases: [
        {
          id: "BTU-204",
          title: "Payment sequence under real state changes",
          query: "It's really dark inside the little shop downstairs tonight and I want to buy a few bottles of mineral water. First turn on the light in the back so I can see to pick them out, and once I've chosen, just pull up my Apple Pay in Wallet so I can tap to pay the owner.",
          checker: "Strict tool + arguments",
          subtype: "Ordered execution",
          interactions: [
            { role: "model", label: "Tool call: control_flashlight", detail: "Enable the flashlight." },
            { role: "environment", label: "Tool response", detail: "The flashlight is now on." },
            { role: "model", label: "Tool call: open_app", detail: "Open Wallet." },
            { role: "environment", label: "Tool response", detail: "Wallet opened successfully." },
            { role: "model", label: "Tool call: manage_nfc", detail: "Set the payment mode to tap_to_pay." },
            { role: "environment", label: "Tool response", detail: "Apple Pay is ready for tap-to-pay." }
          ],
          finalResponse: "Done: the flashlight is on, Wallet is open, and Apple Pay is ready for tap-to-pay."
        },
        {
          id: "BTU-622",
          title: "Conflicting network goals",
          query: "My data plan is completely maxed out this month - turn off mobile data right now so absolutely no traffic goes through, and at the same time immediately bump the currently playing Netflix video's quality up to the highest Blu-ray 4K setting.",
          checker: "Behavior judge",
          subtype: "Conflict intent",
          interactions: [
            { role: "model", label: "Read-only state check", detail: "Query the active Wi-Fi connection and current mobile-data state." },
            { role: "environment", label: "State response", detail: "Mobile data is on, and no usable connected Wi-Fi network is confirmed." },
            { role: "model", label: "Intent check", detail: "Determine that disabling all data traffic conflicts with immediate 4K streaming." }
          ],
          finalResponse: "These requests conflict without a confirmed Wi-Fi connection. Should I prioritize stopping data traffic or 4K playback?"
        },
        {
          id: "BTU-863",
          title: "Complete a compound phone-setting task",
          query: "I need to review my grad school exam materials at my dorm bedside tonight at 11 PM. To avoid eye strain and stay extremely focused, please immediately switch my phone to dark mode, set the currently playing song to repeat one, and then set a 30-minute countdown timer for me.",
          checker: "Final DB state",
          subtype: "Compound state change",
          interactions: [
            { role: "model", label: "Tool call: manage_dark_mode", detail: "Enable dark mode." },
            { role: "environment", label: "Tool response", detail: "Dark mode is enabled." },
            { role: "model", label: "Tool call: set_music_play_mode", detail: "Set the current song to repeat_one." },
            { role: "environment", label: "Tool response", detail: "Playback mode is now repeat one." },
            { role: "model", label: "Tool call: manage_countdown", detail: "Start a 30-minute countdown labeled Exam review." },
            { role: "environment", label: "Tool response", detail: "The countdown is running." }
          ],
          finalResponse: "Done: dark mode, repeat-one playback, and a 30-minute exam-review countdown are active."
        }
      ]
    },
    memory: {
      title: "Memory Usage",
      summary: "Retrieving relevant preferences, composing multiple memories, and updating persistent records.",
      cases: [
        {
          id: "MEM-0043",
          title: "Replace an existing preference",
          query: "Please update my saved preference for bedtime vocabulary study: use Quizlet from now on.",
          checker: "DB state + retrieval",
          subtype: "Memory update",
          interactions: [
            { role: "model", label: "Memory search", detail: "Search for the saved bedtime vocabulary-study preference." },
            { role: "environment", label: "Memory response", detail: "Record mem_v05_0199 says the current app is Anki." },
            { role: "model", label: "Memory update", detail: "Replace that record with Quizlet rather than creating a duplicate preference." },
            { role: "environment", label: "Persistent-state response", detail: "The existing record is updated successfully." }
          ],
          finalResponse: "Updated the bedtime vocabulary app preference from Anki to Quizlet."
        },
        {
          id: "MEM-0054",
          title: "Compose a habit with a temporary exception",
          query: "We are still waiting for a supplementary figure at this group meeting. Set the phone's sound mode, call vibration feedback, and allowed contacts according to my saved on-site habit.",
          checker: "Behavior judge + retrieval",
          subtype: "Multi-memory composition",
          interactions: [
            { role: "model", label: "Memory search", detail: "Retrieve the saved on-site meeting habit and any current meeting exception." },
            { role: "environment", label: "Standing habit", detail: "Use silent mode, vibrate while silent, and allow Advisor and Teaching Assistant." },
            { role: "environment", label: "Temporary exception", detail: "Also allow Labmate while waiting for the supplementary figure." },
            { role: "model", label: "Tool calls: sound, vibration, and DND", detail: "Apply silent mode, enable vibration while silent, and compose the three-contact allowlist." },
            { role: "environment", label: "Phone-state response", detail: "All settings are applied and all three contacts remain allowed." }
          ],
          finalResponse: "Silent mode and vibrate-while-silent are on; DND allows Advisor, Teaching Assistant, and Labmate."
        },
        {
          id: "MEM-MT0421",
          title: "Resolve a terse follow-up from history and memory",
          query: "Yes, send it now the way I normally transfer meeting documents to my computer.",
          checker: "Behavior judge + retrieval",
          subtype: "Multi-turn memory",
          interactions: [
            { role: "model", label: "Memory search", detail: "Retrieve the user's normal meeting-document transfer routine." },
            { role: "environment", label: "Conversation and memory context", detail: "The prior turn identifies yesterday's meeting minutes; the saved routine uses Bluetooth to MacBook Pro." },
            { role: "model", label: "Tool call: send_file", detail: "Send Meeting_Minutes_2024_01_15.docx to MacBook Pro over Bluetooth." },
            { role: "environment", label: "Transfer response", detail: "The document is sent successfully." }
          ],
          finalResponse: "Meeting_Minutes_2024_01_15.docx was sent to MacBook Pro via Bluetooth."
        }
      ]
    },
    skills: {
      title: "Skill Usage",
      summary: "Loading reusable skills before executing a safe and complete business-tool plan.",
      cases: [
        {
          id: "SK-POWER-01",
          title: "Preserve an unspecified app exception",
          query: "Enable extreme battery saver and close all background apps except the music player.",
          checker: "Skill routing + execution",
          subtype: "Power and app management",
          interactions: [
            { role: "model", label: "Load skills", detail: "Load power-performance-battery and apps-storage-files." },
            { role: "environment", label: "Skill response", detail: "Battery and app-lifecycle tools are now available." },
            { role: "model", label: "Tool call: manage_battery", detail: "Switch the phone to super_saving mode, then inspect running apps for the music player." },
            { role: "environment", label: "Execution response", detail: "Extreme battery saver is enabled, but no unique music-player app can be identified." }
          ],
          finalResponse: "Extreme battery saver is on. Which music app should remain open before I close the others?"
        },
        {
          id: "SK-PRIVACY-10",
          title: "Coordinate a two-skill privacy workflow",
          query: "Protect a banking app with app lock and hide notification previews separately.",
          checker: "Skill routing + execution",
          subtype: "Privacy and notifications",
          interactions: [
            { role: "model", label: "Load skills", detail: "Load privacy-security-auth and focus-sound-notifications." },
            { role: "environment", label: "Skill response", detail: "App Lock and notification-visibility tools are now available." },
            { role: "model", label: "Tool call: manage_app_lock", detail: "Enable App Lock and open its settings page." },
            { role: "environment", label: "Execution response", detail: "App Lock is enabled, but the request does not identify the banking app." }
          ],
          finalResponse: "App Lock is enabled. Which banking app should have its notification previews hidden?"
        },
        {
          id: "SK-DISPLAY-08",
          title: "Route skills before ordered execution",
          query: "Lock auto-rotate before starting a screen recording.",
          checker: "Skill routing + execution",
          subtype: "Display and recording",
          interactions: [
            { role: "model", label: "Load skills", detail: "Load display-screen-comfort and camera-record-screenshot." },
            { role: "environment", label: "Skill response", detail: "Display-rotation and screen-recording tools are now available." },
            { role: "model", label: "Tool call: manage_auto_rotate", detail: "Disable auto-rotate first." },
            { role: "environment", label: "Tool response", detail: "Auto-rotate is disabled." },
            { role: "model", label: "Tool call: control_screen_recorder", detail: "Start screen recording." },
            { role: "environment", label: "Tool response", detail: "Screen recording is active." }
          ],
          finalResponse: "Auto-rotate is locked and screen recording is running."
        }
      ]
    },
    subagent: {
      title: "Sub-agent Collaboration",
      summary: "Delegation to specialized agents, recovery from tool boundaries, and transparent fallbacks.",
      cases: [
        {
          id: "SA-392",
          title: "Recover into a GUI handoff",
          query: "Find all the files I received on WhatsApp and Messenger in the past week, sort them by type - put documents in one group and images in another - and save them to a new folder called \"This Week's Files\" in the phone's file manager.",
          checker: "Behavior judge",
          subtype: "GUI sub-agent",
          interactions: [
            { role: "model", label: "Tool call: local_file_search", detail: "Search for recent WhatsApp and Messenger documents and images." },
            { role: "environment", label: "Search response", detail: "No matching files are available through the indexed file-search interface." },
            { role: "model", label: "Sub-agent handoff: control_gui_agent", detail: "Ask the GUI agent to organize the files in the Files app." },
            { role: "environment", label: "Handoff response", detail: "The app name Files is unsupported; File Manager is available." },
            { role: "model", label: "Recovered handoff", detail: "Retry with File Manager and preserve the original files while copying them into Documents and Images folders." },
            { role: "environment", label: "GUI response", detail: "The GUI session creates the folders and completes the copy operation." }
          ],
          finalResponse: "Done: This Week's Files contains Documents and Images subfolders, with the originals preserved."
        },
        {
          id: "SA-391",
          title: "Keep an automation when media is unavailable",
          query: "Play some white noise to help me fall asleep, and stop automatically after 30 minutes.",
          checker: "Behavior judge",
          subtype: "Automation sub-agent",
          interactions: [
            { role: "model", label: "Tool call: play_audio", detail: "Try to start White Noise playback." },
            { role: "model", label: "Sub-agent handoff: trigger_task", detail: "Create a one-time action that stops the current audio in 30 minutes." },
            { role: "environment", label: "Execution response", detail: "The stop automation is created, but the requested audio is not found." },
            { role: "model", label: "Fallback search", detail: "Try available music sources for an equivalent white-noise track." },
            { role: "environment", label: "Search response", detail: "No matching content is available from the installed sources." }
          ],
          finalResponse: "The 30-minute stop automation is set, but no white-noise content was found. Which installed app or alternate sound should I use?"
        },
        {
          id: "SA-650",
          title: "Delegate open-domain lookup without fabrication",
          query: "Help me calculate how many days until the second Saturday of next month, and while you're at it, check whether that day's almanac is favorable for breaking ground due south, and whether the dos and don'ts specify an auspicious hour in the afternoon?",
          checker: "Behavior judge",
          subtype: "QA sub-agent",
          interactions: [
            { role: "model", label: "Deterministic calculation", detail: "Resolve the second Saturday as September 12, 2026 and calculate the interval." },
            { role: "environment", label: "Calculation response", detail: "September 12, 2026 is 35 days away." },
            { role: "model", label: "Tool and sub-agent lookup", detail: "Query calendar_service, then ask general_qa_agent for date-specific almanac details." },
            { role: "environment", label: "Lookup response", detail: "The local almanac fields are empty and the QA knowledge base has no verified entry." },
            { role: "model", label: "Browser fallback", detail: "Open a targeted web search and keep the unavailable claims explicitly unverified." },
            { role: "environment", label: "Browser response", detail: "The targeted search is opened for the user to inspect." }
          ],
          finalResponse: "The second Saturday is September 12, 2026, 35 days away. Almanac data was unavailable, so I opened a targeted browser search."
        }
      ]
    }
  }
};
