# KINETIC Design System

## 1. Visual Identity
- **Philosophy**: Industrial Brutalism / Mission Control Authority.
- **Colors**:
  - Primary: `#000000` (Pure Black background)
  - Accent: `#D0FF00` (Neon Green / Brand)
  - Secondary: `#111111` (Deep Gray surface)
  - Text: `#FFFFFF` (High contrast)
  - Dimmed: `rgba(255, 255, 255, 0.3)` (Labels/Metadata)

## 2. Layout & Spacing
- **Grid**: Strict 12-column Tactical Grid.
- **Spacing**: 8/16/24/40/64/120px.
- **Border Radius**: `0px` (Absolute 90-degree corners).
- **Dividers**: 1px vertical/horizontal lines in `#FFFFFF/5%`.

## 3. Typography
- **Headers**: 
  - H1: `120px` (Daily Output Style), black font-weight, tracking-tighter.
  - H2: `48px` (Sector Titles), black font-weight, tracking-tighter, italic.
- **Labels**: `11px` font-black, uppercase, tracking-[0.2em], italic.
- **Numbers**: Large italic tracking-tighter (Mission Control Telemetry).

## 4. UI Components
- **Progress Bars**: 80px high, Neon Green, status text inside (e.g., "PROTOCOL_MAINTAINED").
- **Buttons**: Outlined or solid Neon Green, zero radius, uppercase text.
- **Sidebar**: Fixed 64px width, icons + text, dark mode active states.

## 5. Design System Notes for Stitch Generation (REQUIRED)
- Use ONLY `#000000`, `#D0FF00`, and `#FFFFFF`.
- Use `0px` border-radius for EVERYTHING.
- Headers should be HUGE and bold (tracking-tighter).
- Use `italic` for all performance telemetry and labels.
- Progress bars must be thick (at least 80px) with text labels INSIDE the bar.
- Maintain a highly technical, industrial aesthetic (Mission Control).
