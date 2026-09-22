# Plan

Build the AI Workplace Productivity Assistant as a responsive SaaS dashboard with three sidebar pages.

## User-facing changes
- Replace the blank home screen with the Smart Email Generator.
- Add sidebar navigation for:
  - Smart Email Generator
  - Meeting Notes Summarizer
  - AI Task Planner / Scheduler
- Keep inputs and editable outputs clearly separated on every page.
- Add copy buttons and loading/error states for generated content.
- Add a visible Responsible AI disclaimer across the app.
- Use a clean Notion/Linear-inspired visual style with consistent typography, spacing, and color.

## AI behavior
- Smart Email Generator creates a professional email draft from recipient, purpose/context, and tone.
- Meeting Notes Summarizer turns raw notes into key discussion points, decisions, and action items.
- Task Planner creates an editable priority/deadline-based daily or weekly schedule.
- AI failures will show clear, safe error messages without deleting the user's input.

## Technical details
- Enable Lovable Cloud so server-side AI calls can run securely.
- Add server-side generation functions using Lovable AI; the API key stays server-side.
- Add shared dashboard/page UI components and route files for each feature page.
- Update the design tokens in the global stylesheet.
- Add route-specific metadata for all content pages.
- Verify the main flows in the live preview after implementation.
