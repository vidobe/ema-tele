# Figma → Edge Delivery Services Migration Plan

Source design: `Telenet-figma-design` — node `1-2`
(https://www.figma.com/design/IJ4hMnSE2g4ORFVNy7lol8/Telenet-figma-design?node-id=1-2)

## Overview
Migrate the specified Figma frame into an Edge Delivery Services page: extract its design tokens and content, map the layout to EDS blocks (reusing existing blocks where possible, creating new variants where needed), generate authored content, and verify the rendered result against the Figma source.

## Status — action needed from you
Plan mode is still active in the session, so file writes are blocked. Approving in chat does not flip the toggle — **you need to exit plan mode in the interface itself** (usually **Shift+Tab**, or the "Execute"/"Accept edits" action). The moment the mode actually switches, my first action is writing `.agents/settings.json` to enable the Figma capability; then one more message re-initializes the session and the Figma skills load so extraction can begin.

## Prerequisites (first actions once Execute mode is truly active)
- [ ] Write `.agents/settings.json` with `{"enabledPlugins": {"excat-figma@excat-extended": true}}`
- [ ] Send one follow-up message so the session re-initializes and the Figma skills load
- [ ] Confirm the Figma skills appear in the available-skills list

## Checklist

### 1. Project & block discovery
- [ ] Determine project type (doc / da / xwalk) and the correct Block Library endpoint
- [ ] Inventory existing EDS blocks available for reuse in this project

### 2. Figma extraction
- [ ] Connect to the Figma file and read frame node `1-2`
- [ ] Extract design tokens (colors, typography, spacing, breakpoints)
- [ ] Extract the content (text, links, images/assets) from the frame
- [ ] Export image assets referenced by the design

### 3. Structure & content modeling
- [ ] Identify section boundaries and content sequences within the frame
- [ ] Decide default content vs. blocks for each sequence
- [ ] Map each section to an existing block or a new block variant (≥80% similarity → reuse)
- [ ] Record block mappings for the page template

### 4. Block design (per block)
- [ ] Extract exact computed styles from the Figma design for each mapped block
- [ ] Apply site-level design tokens (base CSS / styles)
- [ ] Write EDS-ready CSS scoped to each `.blockname`
- [ ] Create JS decoration for any new block that needs it

### 5. Content generation & import
- [ ] Generate the import HTML / authored content from the extracted structure
- [ ] Run the project's bundled import script to produce content in the content directory (never hand-write HTML there)
- [ ] Confirm images land in the images folder

### 6. Preview & visual verification
- [ ] Preview the rendered page locally
- [ ] Inspect DOM/structure via snapshot and CSS via evaluate (token-efficient checks first)
- [ ] Compare rendered output against the Figma frame; iterate on styling to match
- [ ] Take a screenshot only if pixel-level confirmation is needed at the end

### 7. Wrap-up
- [ ] Report what was built (page path, blocks reused vs. created) and any deviations from the Figma design
- [ ] Note follow-ups (publishing, PR with a preview link) if you want the page shipped

## Notes
- No new blocks will be built from scratch where an existing block (or close variant) fits — reuse is preferred.
- Content HTML in the content directory is produced only via the import script, never edited by hand.
- Exact block choices and any new-variant decisions will firm up once the Figma frame is read in step 2.

**Blocker:** the session is still in plan mode despite chat approvals. Please exit plan mode via the interface toggle (Shift+Tab / Execute). Once it flips, I'll write the settings file immediately and proceed with the migration.
