# Wellnest — Prompt Engineering Log (`prompt-log.md`)

## Task #1: Sector Selection & Project Concept
- **Sector:** Health & Wellness Innovation
- **Local Challenge:** Lack of an interactive, offline-capable tool for local residents in Marinduque to track daily health/hydration habits and easily search for nearby Barangay Health Centers.
- **Target Users:** Community residents, families, and local health workers.
- **Proposed Project:** **Wellnest** — Local Health, Hydration & Wellness Tracker.
- **Key Features:**
  1. Daily Wellness Routine Checklist with auto-saving progress bar via `localStorage`.
  2. Searchable Barangay Health Center Directory.
  3. Local Health Emergency Hotline Cards.

---

## Task #2: Zero-Shot Prompting
**Objective:** Observe what Copilot generates from a basic prompt without context or examples.

**Exact Prompt:**
> "Create a simple single-page website for a local community health and wellness guide named "Wellnest". Include daily health tips and basic CSS styling."

**Actual Copilot Output:**
Generates a basic HTML document with static health tips in an unordered list and inline CSS styling. It lacks dynamic JavaScript features, interactive checkboxes, and local Marinduque context.

**What Worked:**
- Quickly set up a generic header, health tip list, and basic container layout.

**What Needs Improvement:**
- Lacks semantic HTML5 elements (`<main>`, `<section>`).
- No dynamic interactivity or state persistence (checking/unchecking items resets on page reload).
- Missing responsive CSS media queries for mobile devices.

**Next Action / Verification:**
- Refine the instruction using structured Prompt Anatomy (Role, Task, Context, Constraints, Expected Output, Acceptance Criteria).

---

## Task #3: Improve: Anatomy of a Prompt
**Objective:** Use structured prompt components to produce a functional frontend prototype.

**Exact Prompt:**
> **Role:** Act as a Senior Frontend Web Developer specializing in accessible, responsive web interfaces.
> **Task:** Create a responsive single-page health and wellness web application named "Wellnest".
> **Context:** Designed for community residents in Marinduque, Philippines to track daily wellness and access local health resources.
> **Constraints:** Use semantic HTML5, clean CSS flexbox/grid, and vanilla JavaScript only. Do not use external libraries, frameworks, or live medical APIs.
> **Expected Output:** Clean, modular HTML, CSS, and JS code.
> **Acceptance Criteria:** Include an interactive daily wellness checklist that updates a visual progress bar and saves state to localStorage, and a searchable Barangay Health Center directory. Ensure keyboard accessibility and mobile responsiveness.

**Actual Copilot Output:**
Generates a complete single-page application structure split across semantic HTML5 markup, responsive CSS, and DOM-manipulating JavaScript with `localStorage` state retention.

**What Worked:**
- Generated clean `<header>`, `<main>`, and `<section>` semantic tags.
- Successfully implemented an interactive checklist connected to a visual progress bar.

**What Needs Improvement:**
- Visual focus outlines for keyboard-only navigation need explicit high-contrast styling.

**Next Action / Verification:**
- Perform Few-Shot prompting for consistent health center datasets and Role Assignment for accessibility auditing.

---

## Task #4: Few-Shot and Role Assignment

### Experiment A: Few-Shot Prompting
**Objective:** Standardize the data format for local health centers using example patterns.

**Exact Prompt:**
> Generate local barangay health center entries in JavaScript format using the following structural examples:
> Example 1: { name: "Boac Rural Health Unit", location: "Boac", contact: "(042) 332-1001", services: "General Checkup, Immunization" }
> Example 2: { name: "Mogpog Medicare Community Hospital", location: "Mogpog", contact: "(042) 332-2002", services: "Emergency, Outpatient" }
> Generate 3 more realistic entries following this exact JSON array structure for Gasan, Sta. Cruz, and Torrijos health centers.

**Actual Copilot Output:**
Produces an array of formatted JavaScript objects adhering strictly to the demonstrated structure without syntax errors.

**Observation:**
Few-shot prompting eliminated formatting errors and ensured seamless integration with our JavaScript rendering function.

---

### Experiment B: Role Assignment
**Objective:** Conduct an accessibility audit from a specialist perspective.

**Exact Prompt:**
> Act as a Web Accessibility Specialist and WCAG 2.2 Level AA Reviewer. Examine the current HTML and CSS for our Wellnest wellness checklist and search inputs. Identify potential accessibility issues regarding screen reader navigation, visual focus indicators, and form labels. Provide specific code recommendations.

**Actual Copilot Output:**
- Recommended linking input labels explicitly using `for` and `id` attributes.
- Suggested adding `:focus-visible` CSS rules for clear focus outlines during keyboard navigation.
- Recommended adding `aria-live="polite"` to dynamic progress percentage updates.

**Observation:**
Role assignment identified key WCAG compliance requirements that standard functional prompts missed.

---

## Task #5: Analyze Structured Reasoning and Refinement
**Objective:** Identify implementation weaknesses and apply targeted fixes.

**Exact Prompt:**
> Review the JavaScript implementation for saving the wellness checklist state in localStorage. Identify potential edge cases where writing to localStorage might fail (such as restricted private browsing modes or storage exceptions). Propose the minimal code fix using error handling, and explain how to verify and test the correction.

**Actual Copilot Output:**
- **Identified Issue:** Direct calls to `localStorage.setItem()` throw unhandled exceptions in restricted browser modes or when storage quotas are exceeded.
- **Recommended Fix:** Enclose `localStorage` operations within `try...catch` blocks.

**Selected Correction Applied:**
```javascript
function updateChecklistState(id, isChecked) {
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem("wellnest_checklist")) || {};
    state[id] = isChecked;
    localStorage.setItem("wellnest_checklist", JSON.stringify(state));
  } catch (e) {
    console.warn("Local storage write restricted:", e);
  }
  calculateProgress();
}