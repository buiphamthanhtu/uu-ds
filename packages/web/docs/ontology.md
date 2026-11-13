# UU DS — bản đồ hệ thống (ontology, tóm tắt)

Bản đầy đủ: `ontology.json` (848 node · 2049 quan hệ). Sinh tự động — 2026-11-13.

## Quan hệ

- `isA` — thuộc loại khái niệm
- `aliasOf` — token trỏ vào token khác (ghi chú: brand / density)
- `variesBy` — giá trị đổi theo trục mode
- `hasMode` — trục có mode
- `belongsToFamily` — token thuộc họ vai trò màu
- `usesToken` — component đọc token (từ CSS thật của thư mục component)
- `uses` — component dùng cơ chế / khái niệm
- `composedOf` — component dựng từ component khác (từ import thật)
- `chosenWhen` — component là đáp án của cây quyết định (ghi chú: đường câu hỏi)
- `confusedWith` — hai component dễ nhầm (ghi chú: cách phân biệt)
- `distinctFrom` — hai họ vai trò không dùng thay nhau
- `fillIs` — state layer tô bằng
- `hasProps` — component có prop variant (xem thuộc tính props của node: tên prop → giá trị hợp lệ)
- `hasRule` — component / toàn hệ thống có quy tắc (node Rule: kind must / do / dont, text, source)
- `hasNotYet` — component có phần chưa chốt (thuộc tính notYet của node) — gặp thì hỏi

## Component

| Component | Variant | Spec | Dựng từ | Token đọc | Web · Flutter · Figma |
|---|---|---|---|---|---|
| `TextButtonAccent` | 90 | §6.1 | — | gap-2, rounded-4xl, text-label-font-weight, text-label-font-size, text-label-line-height, control-height-large, control-padding-y-large, control-padding-x-large +31 | TextButtonAccent · UuTextButton · Figma ✓ |
| `TextButtonNeutral` | 105 | §6.1 | — | gap-2, rounded-4xl, text-label-font-weight, text-label-font-size, text-label-line-height, control-height-large, control-padding-y-large, control-padding-x-large +31 | TextButtonNeutral · UuTextButton · Figma ✓ |
| `TextButtonDanger` | 45 | §6.1 | — | gap-2, rounded-4xl, text-label-font-weight, text-label-font-size, text-label-line-height, control-height-large, control-padding-y-large, control-padding-x-large +31 | TextButtonDanger · UuTextButtonDanger · Figma ✓ |
| `IconButtonAccent` | 90 | §6.2 | — | gap-2, rounded-4xl, text-label-font-weight, text-label-font-size, text-label-line-height, control-height-large, control-padding-y-large, control-padding-x-large +31 | IconButtonAccent · UuIconButton · Figma ✓ |
| `IconButtonNeutral` | 90 | §6.2 | — | gap-2, rounded-4xl, text-label-font-weight, text-label-font-size, text-label-line-height, control-height-large, control-padding-y-large, control-padding-x-large +31 | IconButtonNeutral · UuIconButton · Figma ✓ |
| `ToggleButton` | 48 | §6.7 | — | background-surface, object-primary, background-interactive, object-on-interactive, object-disabled, background-disabled | ToggleButton · UuToggleButton · Figma ✓ |
| `ButtonGroup` | 4 | §6.9 | TextButtonAccent, TextButtonDanger | gap-3 | ButtonGroup · UuButtonGroup · Figma ✓ |
| `TextInput` | 9 | §6.3 | TextButtonNeutral | — | TextInput · UuTextInput · Figma ✓ |
| `TextArea` | 9 | §6.3e | — | — | TextArea · UuTextArea · Figma ✓ |
| `OTPInput` | 14 | §6.3b | — | gap-1, gap-2, field-otp-min-width, field-height, field-radius, background-surface, border-muted, text-body-font-size +10 | OTPInput · UuOTPInput · Figma ✓ |
| `SearchInput` | 8 | §6.3g | TextButtonNeutral, IconButtonNeutral, Menu | object-disabled, gap-2, rounded-circle, object-secondary, border-emphasized | SearchInput · UuSearchInput · Figma ✓ |
| `DateInput` | 8 | §6.3c | — | — | DateInput · UuDateInput · Figma ✓ |
| `Dropdown` | 8 | §6.4 | — | — | Dropdown · UuDropdown · Figma ✓ |
| `Menu` | 2 (+ `.MenuItem` 16 · `.MenuSection` · `.MenuDivider`) | §6.21 | SearchInput, TextButtonAccent, TextButtonNeutral | gap-1, gap-3, rounded-2xl, background-surface, gap-2, text-body-font-size, text-body-line-height, object-secondary +15 | Menu · UuMenu · Figma ✓ |
| `Checkbox` | 15 | §6.3f | — | selection-size, selection-radius, background-surface, border-muted, object-on-interactive, object-secondary, border-emphasized, object-primary +12 | Checkbox · UuCheckbox · Figma ✓ |
| `CheckboxInput` | 1 | §6.3f | — | selection-size, selection-radius, background-surface, border-muted, object-on-interactive, object-secondary, border-emphasized, object-primary +12 | CheckboxInput · UuCheckboxInput · Figma ✓ |
| `Radio` | 10 | §6.3d | — | selection-size, rounded-circle, background-surface, border, object-secondary, border-emphasized, object-primary, border-interactive +7 | Radio · UuRadio · Figma ✓ |
| `RadioInput` | 1 | §6.3d | — | selection-size, rounded-circle, background-surface, border, object-secondary, border-emphasized, object-primary, border-interactive +7 | RadioInput · UuRadioInput · Figma ✓ |
| `Switch` | 10 | §6.17 | — | switch-width, switch-height, rounded-circle, background-surface, border, object-secondary, switch-padding, switch-handle-off +9 | Switch · UuSwitch · Figma ✓ |
| `Chip` | 20 | §6.18 | — | gap-2, control-height-small, control-padding-y-small, control-padding-x-small, rounded-4xl, object-primary, chip-border-width, border +12 | Chip · UuChip · Figma ✓ |
| `SegmentedControl` | 1 (+ `.Segment item` 8) | §6.13 | — | gap-0-5, gap-1, radius-lg, background-emphasized, gap-2, gap-3, radius-base, object-secondary +8 | SegmentedControl · UuSegmentedControl · Figma ✓ |
| `NavigationBar` | 1 | §6.5 | IconButtonAccent, IconButtonNeutral | gap-3, text-heading-base-font-size, text-heading-base-line-height, object-primary | NavigationBar · UuNavigationBar · Figma ✓ |
| `BottomBar` | 10 (+ `base/FooterItem` 2 · `base/FooterItemSpecial` 4) | §6.22 | NotificationBadge | gap-1, rounded-circle, background-surface, gap-1-5, gap-3, object-secondary, background-interactive-muted, object-interactive +7 | BottomBar · UuBottomBar · Figma ✓ |
| `TablePagination` | 1 (+ `.PageItem` 4) | §6.24 | IconButtonNeutral, Dropdown | gap-4, gap-2, object-secondary, text-caption-font-size, text-caption-line-height, gap-1, control-height-small, control-padding-x-small +6 | TablePagination · UuTablePagination · Figma ✓ |
| `Breadcrumb` | 1 (+ `.BreadcrumbItem` 5) | §6.25 | Menu | gap-1, text-body-font-size, text-body-line-height, object-disabled, radius-sm, object-secondary, object-primary, border-emphasized | Breadcrumb · UuBreadcrumb · Figma ✓ |
| `SideNav` | 2 (+ `.SideNavItem` 9 · `.SideNavSection` 1) | §6.27 | Tooltip, IconButtonNeutral, NotificationBadge | gap-1, sidenav-width, gap-3, border-muted, background-surface, control-height-base, gap-4, object-secondary +12 | SideNav · UuSideNav · Figma ✓ |
| `Tab` | 5 | §6.20 | NotificationBadge | gap-3, tab-padding, object-secondary, text-title-base-font-size, text-title-base-line-height, object-interactive, radius-sm, object-primary +9 | Tab · UuTab · Figma ✓ |
| `TabBar` | 2 | §6.20 | NotificationBadge | gap-3, tab-padding, object-secondary, text-title-base-font-size, text-title-base-line-height, object-interactive, radius-sm, object-primary +9 | TabBar · UuTabBar · Figma ✓ |
| `Pagination` | 3 | §6.10b | — | gap-1, rounded-circle, overlay, background-accent | Pagination · UuPagination · Figma ✓ |
| `Toast` | 4 | §6.6 | TextButtonNeutral, IconButtonNeutral | gap-3, gap-2, gap-4, radius-base, text-body-font-size, text-body-line-height, background-inverted, object-primary-inverted +6 | Toast · UuToast · Figma ✓ |
| `Badge` | 4 | §6.14 | — | gap-2, gap-1, rounded-circle, text-title-sm-font-size, text-title-sm-line-height, background-inverted, object-primary-inverted, background-positive +5 | Badge · UuBadge · Figma ✓ |
| `StatusIndicator` | 10 | §6.15 | — | gap-1-5, text-title-sm-font-size, text-title-sm-line-height, object-primary, rounded-circle, object-secondary, object-positive, object-warning +14 | StatusIndicator · UuStatusIndicator · Figma ✓ |
| `CardPushNotification` | 1 | §6.31 | — | gap-2, gap-4, radius-lg, background-surface, object-primary, border-emphasized, radius-sm, gap-0-5 +3 | CardPushNotification · UuCardPushNotification · Figma ✓ |
| `NotificationBadge` | 2 | §6.16 | — | background-attention, object-on-attention, rounded-circle, gap-1, text-title-xs-font-size, text-title-xs-line-height | NotificationBadge · UuNotificationBadge · Figma ✓ |
| `Tooltip` | 4 | §6.30 | — | gap-1, gap-2, radius-sm, background-inverted, object-primary-inverted, text-caption-font-size, text-caption-line-height | Tooltip · UuTooltip · Figma ✓ |
| `TableHeaderCell` | 21 | §6.23 | Checkbox, StatusIndicator, TextButtonAccent, IconButtonNeutral | table-header-height, table-cell-padding-x, border-muted, object-secondary, text-title-sm-font-size, text-title-sm-line-height, object-primary, gap-1 +9 | TableHeaderCell · UuTableHeaderCell · Figma ✓ |
| `TableCell` | 18 | §6.23 | Checkbox, StatusIndicator, TextButtonAccent, IconButtonNeutral | table-header-height, table-cell-padding-x, border-muted, object-secondary, text-title-sm-font-size, text-title-sm-line-height, object-primary, gap-1 +9 | TableCell · UuTableCell · Figma ✓ |
| `KPICard` | 5 | §6.26 | — | gap-1, card-padding, radius-lg, background-surface, border-muted, object-primary, object-secondary, text-caption-font-size +6 | KPICard · UuKPICard · Figma ✓ |
| `CardSheet` | 4 | §6.8 | IconButtonNeutral, ButtonGroup | rounded-2xl, background-surface, gap-4, text-heading-base-font-size, text-heading-base-line-height, object-primary, gap-3, gap-2 +5 | CardSheet · UuCardSheet · Figma ✓ |
| `CardDialog` | 2 | §6.10 | IconButtonNeutral, ButtonGroup | rounded-2xl, background-surface, gap-4, gap-3 | CardDialog · UuCardDialog · Figma ✓ |
| `SideSheet` | 4 | §6.28 | IconButtonNeutral, TextButtonAccent, TextButtonNeutral | background-surface, object-primary, border-muted, radius-lg, gap-3, card-padding, text-heading-sm-font-size, text-heading-sm-line-height | SideSheet · UuSideSheet · Figma ✓ |
| `Popover` | 1 | §6.29 | IconButtonNeutral, TextButtonAccent, TextButtonNeutral | gap-3, card-padding, radius-lg, background-surface, object-primary, gap-2, text-title-base-font-size, text-title-base-line-height | Popover · UuPopover · Figma ✓ |
| `EmptySection` | 1 | §6.19 | ButtonGroup, NavigationBar | gap-3, rounded-circle, background-accent-muted, object-primary, text-heading-sm-font-size, text-heading-sm-line-height, text-heading-base-font-size, text-heading-base-line-height +3 | EmptySection · UuEmptySection · Figma ✓ |
| `ErrorSection` | 1 | §6.19 | ButtonGroup, NavigationBar | gap-3, rounded-circle, background-accent-muted, object-primary, text-heading-sm-font-size, text-heading-sm-line-height, text-heading-base-font-size, text-heading-base-line-height +3 | ErrorSection · UuErrorSection · Figma ✓ |
| `ListItem` | 4 | §6.32 | IconButtonNeutral, Checkbox, Radio, Switch | gap-3, list-min-height, list-padding-x, object-primary, list-padding-y, border-muted, gap-0-5, text-body-font-size +13 | ListItem · UuListItem · Figma ✓ |
| `ListGroup` | 1 | §6.32 | IconButtonNeutral, Checkbox, Radio, Switch | gap-3, list-min-height, list-padding-x, object-primary, list-padding-y, border-muted, gap-0-5, text-body-font-size +13 | ListGroup · UuListGroup · Figma ✓ |
| `[Screen]PushNotification` | 1 | §6.31 | — | — | Figma ✓ |
| `Sheet` | 1 | §6.8 | — | — | Figma ✓ |
| `Dialog` | 1 | §6.10 | IconButtonNeutral, ButtonGroup | rounded-2xl, background-surface, gap-4, gap-3 | Dialog · Figma ✓ |
| `ResultScreen` | 1 | §6.19 | ButtonGroup, NavigationBar | gap-3, rounded-circle, background-accent-muted, object-primary, text-heading-sm-font-size, text-heading-sm-line-height, text-heading-base-font-size, text-heading-base-line-height +3 | ResultScreen · UuResultScreen · Figma ✓ |
| `ErrorScreen` | 1 | §6.19 | ButtonGroup, NavigationBar | gap-3, rounded-circle, background-accent-muted, object-primary, text-heading-sm-font-size, text-heading-sm-line-height, text-heading-base-font-size, text-heading-base-line-height +3 | ErrorScreen · UuErrorScreen · Figma ✓ |
| `EmptyScreen` | 1 | §6.19 | ButtonGroup, NavigationBar | gap-3, rounded-circle, background-accent-muted, object-primary, text-heading-sm-font-size, text-heading-sm-line-height, text-heading-base-font-size, text-heading-base-line-height +3 | EmptyScreen · UuEmptyScreen · Figma ✓ |

## Quy tắc chung

- **must** — Only use semantic tokens (background-*, object-*, border-*); never hardcode hex, never create color primitives with built-in alpha. (§0)
- **dont** — Don't use a background token to color text or vice versa — each token has its own scope (background, text, border, gap, radius). (§1)
- **must** — A component doesn't know which brand it is in; switch brand with data-theme on the container, don't edit the component. (§2.5)
- **dont** — Don't use accent for things you can press: interactive for buttons, links, tabs, field focus, selected items; accent for content emphasis. (§2.5)
- **must** — background-{status} only pairs with object-on-{status}; object-{status} is for text/icons on light backgrounds. (§2.2)
- **dont** — Don't use negative for a "new" badge, don't use attention for error messages; attention = new and unseen, warning = risk, negative = broken/wrong. (§2.2)
- **dont** — Don't use object-warning (1.92 on white) or object-attention for standalone text — only for dots / icons next to object-primary text. (§2.3)
- **must** — Don't let color be the only signal where it matters — add text or an icon. (§2.3)
- **must** — Hover/Pressed only through a full-cover ::after state layer, fill = currentColor (the variant's object color); no background, text or font-weight change. (§6.0)
- **must** — State-layer opacity steps depend on the background type, not the text color: solid colored backgrounds (Solid Accent / Neutral) → 20/40; light or transparent backgrounds (Outline, Ghost, Solid Inverted) → 5/10; Outline / Ghost Inverted on dark backgrounds → 20/40. Radio is the exception (§6.3d). Disabled and Loading have no state layer. (§6.0)
- **do** — The Active text mode (one weight step bolder) is only for ToggleButton Active=True and the selected Segment item; it has nothing to do with :hover/:active or State=Pressed. (§3)
- **dont** — Don't hardcode width on hugging components (button, toggle, chip); line-height is an absolute value, not a multiplier. (§3)
- **must** — Components read density variables (--control-height-*, --field-height, --text-<style>-*); never hardcode 24/32/40/48/56px, never read --font-size-* directly. Don't use Compact on touch screens. (§4.1)
- **must** — Only use UU icon (or the set attached via DNA); don't swap in Lucide/Phosphor/Font Awesome singles, don't crop the viewBox. On state uses the fill variant, off state uses outline. (§6.11)
- **do** — Only build components listed in section 5; anything missing is not decided — ask, don't guess. (§0)

## Quy tắc và phần chưa chốt theo component

### TextButtonAccent

Prop: `Type` (Solid · Outline · Ghost), `Size` (Large · Base · Small), `State` (Default · Hover · Pressed · Disabled · Loading), `Inverted` (False · True)

- **do** — For the main action of the screen. (§6.1)
- **do** — One Solid button (Accent or Danger) per screen. (§6.1)
- **dont** — Actions repeated per row or per card are never Solid — use Ghost Small or group them in a "⋯" menu. (§6.1)
- **do** — Inverted=True when placed on a dark background. (§6.1)
- **must** — min-width = min-height = the size's height (56/48/32) — a short-label button is never narrower than a circle. (§6.1)
- **must** — The Outline border does not add to the height: build it with an inset 2px box-shadow, not a border. (§6.1)
- **must** — Loading: the .loading spinner sits before the label, the label stays visible, no state layer. (§6.1)
- **dont** — Pressed keeps weight 600 — don't use the Active text mode. (§3)

### TextButtonNeutral

Prop: `Type` (Solid · Outline · Ghost), `Size` (Large · Base · Small), `State` (Default · Hover · Pressed · Disabled · Loading), `Inverted` (False · True)

- **do** — For secondary, neutral actions. (§6.1)
- **do** — Reversible actions (sign out, skip) stay Neutral even if they "look dangerous". (§6.1)
- **do** — Inverted=True when placed on a dark background. (§6.1)
- **must** — The Outline border does not add to the height: build it with an inset 2px box-shadow. (§6.1)
- **must** — Disabled: Solid uses background-disabled, Outline uses border-muted, text object-disabled, no state layer. (§6.1)
- **do** — Ghost Small is the Action button inside TextInput's suffix and the Huỷ button of SearchInput. (§6.3)
- **do** — `Type=Tonal` for repeated actions on cards with `background-surface`. Don't place it on `background-subtle`. (§6.1)

### TextButtonDanger

Prop: `Type` (Solid · Outline · Ghost), `Size` (Large · Base · Small), `State` (Default · Hover · Pressed · Disabled · Loading), `Inverted` (False)

- **do** — Only for destructive, irreversible actions (delete account, cancel order, remove device). (§6.1)
- **dont** — Don't use Danger just because a button "looks dangerous" — reversible actions are Neutral. (§6.1)
- **dont** — No Inverted=True — destructive buttons always sit on light backgrounds; on dark screens open a confirmation Dialog. (§6.1)
- **do** — Per-row destructive actions live in the "⋯" menu and are confirmed by a Dialog with a Solid TextButtonDanger. (§6.1)
- **do** — One Solid button (Accent or Danger) per screen. (§6.1)
- **must** — Geometry, density, state layer, Loading and Disabled are identical to TextButtonAccent; only the color family changes to negative. (§6.1)

### IconButtonAccent

Prop: `Type` (Solid · Outline · Ghost), `Size` (Large · Base · Small), `State` (Default · Hover · Pressed · Disabled · Loading), `Inverted` (False · True)

- **must** — Props and colors match TextButtonAccent (Type/Inverted/Size/State); the icon uses object-* tokens like a Text button's label. (§6.2)
- **must** — Round square box: 56/48/32, icon 24/24/16, padding 0. (§6.2)
- **must** — Inverted=True: Solid (surface background) uses state layer 5/10; Outline and Ghost use 20/40. (§6.2)
- **must** — Icon-only buttons need a name: a label, or a Tooltip with relation='label' (aria-labelledby). (§6.30)
- **do** — NavigationBar's sub action is IconButtonAccent Solid Inverted=True Base. (§6.5)

### IconButtonNeutral

Prop: `Type` (Solid · Outline · Ghost), `Size` (Large · Base · Small), `State` (Default · Hover · Pressed · Disabled · Loading), `Inverted` (False · True)

- **must** — Props and colors match TextButtonNeutral; Solid Inverted=False uses background-inverted. (§6.2)
- **must** — Inverted=True: Solid (surface background) uses state layer 5/10; Outline and Ghost use 20/40. (§6.2)
- **must** — Icon-only buttons need a name: a label, or a Tooltip with relation='label' (aria-labelledby). (§6.30)
- **do** — Ghost Small opens the "⋯" Menu for per-row / per-card actions. (§6.1)
- **do** — The close button (xmark) of Toast, SideSheet and Popover is IconButtonNeutral Ghost; of CardSheet/CardDialog it is Outline Small. (§6.6)
- **do** — The close button over CardDialog's banner image uses Solid so it reads on any image. (§6.10)
- **dont** — There is no Danger IconButton — per-row delete lives in the "⋯" menu, confirmed by a Dialog with a Solid TextButtonDanger. (§6.2)

### ToggleButton

Prop: `Size` (Large · Base · Small), `State` (Default · Hover · Pressed · Disabled), `Active` (False · True), `Label` (False · True)

- **do** — For buttons that hold an on/off state; Active is a prop independent of State. (§6.7)
- **must** — Two separate text props (Label / Active label) to change copy by state — don't share one string. (§6.7)
- **must** — The icon switches fully between outline ↔ fill when on, not just its color. (§6.7)
- **must** — Text gets one weight step bolder when on via the Active typography mode, not a weight override on the node. (§6.7)
- **dont** — Don't hardcode width — the two states differ by 1px. (§6.7)
- **dont** — No border, no shadow in any variant — used floating over images or colored backgrounds. (§6.7)
- **dont** — No Loading state; Disabled has no state layer. (§6.7)

### ButtonGroup

Prop: `Layout` (Horizontal · Vertical), `Tone` (Default · Danger)

- **must** — Horizontal: secondary button (Outline) on the left, primary (Solid) on the right, equal widths. (§6.9)
- **must** — Vertical: primary (Solid) on top, secondary (Outline) below. (§6.9)
- **must** — Buttons are TextButtonAccent size Large (56), gap 12. (§6.9)
- **must** — In code, the two equal buttons use flex: 1 1 0, not flex: 1 1 auto. (§6.8)
- **do** — The shared button group of CardSheet and CardDialog — don't build your own button frame. (§6.8)
- **must** — Tone=Danger (delete-confirmation dialog / sheet): the primary is TextButtonDanger Solid Large, the secondary stays the same; don't arrange the two buttons yourself. (§6.9)

### TextInput

Prop: `Value` (Empty · Filled), `State` (Default · Hover · Focus · Typing · [No state]), `Error` (False · True), `Disabled` (False · True)

- **must** — Error=True changes three things: border-negative border, Label object-negative, and an Error message caption line under the Field. (§6.3)
- **dont** — The error line is text only, no icon (a fourth signal adds no information). (§6.3)
- **must** — The error line takes real space (root 76 → 100) — the layout must make room, never overlap other blocks. (§6.3)
- **dont** — Error never combines with Disabled. (§6.3)
- **must** — Filled + Disabled keeps object-primary text so it stays readable; only the placeholder drops to object-disabled. (§6.3)
- **must** — Focus/Typing: border-emphasized border + a 1.5×24 object-accent caret. (§6.3)
- **do** — Report errors at the field with a red border + error line, not a Toast. (§6.3b)

### TextArea

Prop: `Value` (Empty · Filled), `State` (Default · Hover · Focus · Typing · [No state]), `Error` (False · True), `Disabled` (False · True)

- **do** — A separate component for multi-line input — replaces any stretched TextInput. (§6.3e)
- **must** — Field height 112 (exactly three lines + counter) — don't change it to 88 or 120; Compact only changes radius and horizontal padding. (§6.3e)
- **must** — Text sticks to the top edge, padding 12 on all sides; the counter (n/100) is caption object-secondary at the bottom right. (§6.3e)
- **must** — Border, background, text and Error follow the TextInput table; the error line has no icon. (§6.3e)
- **must** — Disabled: typed text stays object-primary; label, counter and placeholder drop to object-disabled. (§6.3e)

### OTPInput

Prop: `Value` (Empty · Filled), `State` (Default · Focus · Typing · [No state]), `Error` (False · True), `Disabled` (False · True), `Masked` (False · True)

- **do** — Replace every hand-built verification-code field with this component; Masked=True for PINs. (§6.3b)
- **must** — Empty cells show a "-" in object-secondary, not a blank cell or a digit placeholder. (§6.3b)
- **must** — A 2px object-accent caret is the only signal for the cell receiving input. (§6.3b)
- **must** — Error: all six cells get the border-negative border together, no single cell highlighted; background and text unchanged. (§6.3b)
- **must** — Typed digits stay on error — don't clear them. (§6.3b)
- **must** — The error line is centered under the cells, 4 below, caption object-negative. (§6.3b)
- **dont** — Never report a wrong code with a Toast. (§6.3b)
- **do** — Cells shrink with flex: 1 0 0, min-width 36, max-width 48 so they don't overflow on narrow phones. (§6.3b)

### SearchInput

Prop: `Value` (Empty · Filled), `State` (Default · Hover · Focus · Typing · [No state] · Loading), `Disabled` (False · True)

- **dont** — No Error — "no results" belongs to the results screen, not the field. (§6.3g)
- **must** — Fixed 24 magnifier icon on the left; the 16 circle-xmark clear button only shows when Filled, 32×32 touch area. (§6.3g)
- **must** — Disabled with text keeps object-primary; the magnifier icon drops to object-disabled. (§6.3g)
- **must** — Loading: a 16 .loading replaces the clear button, border as in Typing. (§6.3g)
- **do** — Cancel=true (a Huỷ button, TextButtonNeutral Ghost Small) only on a dedicated mobile search screen; pressing Huỷ clears text, blurs and closes the panel. (§6.3g)
- **do** — The suggestion / history panel is a Menu Platform=Panel anchored 4 below the field; empty + focus → history, typing → suggestions, nothing → no panel. (§6.3g)
- **do** — "Tìm gần đây" rows end with an IconButtonNeutral Ghost Small xmark to remove each item; the panel stays open, focus returns to the field. (§6.3g)
- **dont** — No separate small size — Compact density already shrinks the field. (§6.3g)

### DateInput

Prop: `Value` (Empty · Filled), `State` (Default · Hover · [No state]), `Error` (False · True), `Disabled` (False · True)

- **dont** — Don't combine a TextInput with a calendar icon yourself — use DateInput. (§6.3c)
- **must** — The field takes no typing: tapping opens the OS date picker, no caret, no keyboard. (§6.3c)
- **must** — Value shown as DD/MM/YYYY, body 400 style. (§6.3c)
- **dont** — The 24 calendar-days icon is always object-secondary — don't color it object-interactive, don't wrap it in an Icon button; don't swap it for the calendar icon. (§6.3c)
- **must** — Error: border-negative border, Label object-negative, text-only error line. (§6.3c)

### Dropdown

Prop: `Value` (Empty · Filled), `State` (Default · Hover · [No state]), `Error` (False · True), `Disabled` (False · True)

- **must** — The selected value uses label 600; the empty hint "Bấm để chọn" is body 400 object-secondary. (§6.4)
- **must** — The 16 chevron-down icon is object-secondary in every state. (§6.4)
- **dont** — No Focus/Typing — the field takes no typing. (§6.4)
- **do** — The option list uses Menu (§6.21). (§6.4)
- **must** — Error: border-negative border, Label object-negative, text-only error line. (§6.3)

### Menu

Prop: `Platform` (Panel · Sheet)

- **do** — The option panel of Dropdown, Chip Dropdown and SearchInput suggestions; Platform=Panel on desktop, Sheet on mobile. (§6.21)
- **must** — Selected row (Single): background-accent-subtle tint, object-interactive text, state layer background-interactive 5/10. (§6.21)
- **must** — Type=Multiple: Checkbox at the start of the row, no background tint, object-primary text; doesn't close on select, turns on the "Bỏ chọn" + "Áp dụng" Footer. (§6.21)
- **do** — Turn on Search (unlabeled SearchInput, sticky on top) when > 8 options; no options left → "Không tìm thấy "{từ khoá}"". (§6.21)
- **do** — .MenuSection: title-xs object-secondary UPPERCASE; .MenuDivider 1px border-muted, the first group needs no line above. (§6.21)
- **must** — Panel anchored 4 below the element; flips up when there is no room; max height 320, then scrolls inside the panel (quick search sticky on top, footer sticky at the bottom). (§6.21)
- **must** — Prefix icons only in Type=Single. (§6.21)
- **do** — Closes on selection (Single), outside click, Esc; Multiple only applies on "Áp dụng". (§6.21)
- **do** — Options needing more explanation → a Description caption object-secondary under the name, max 2 lines; icon / checkbox top-aligned. (§6.21)
- **must** — "Chọn tất cả" (Multiple, from 4 options): first row + MenuDivider; Checked when all are selected, Indeterminate when some; while quick-searching it only affects visible options. (§6.21)

### Checkbox

Prop: `Value` (Unchecked · Checked · Indeterminate), `State` (Default · Hover · Pressed · [No state] · Error), `Disabled` (False · True)

- **must** — Checked is a solid background-interactive block + a 20 check fill icon in object-on-interactive. (§6.3f)
- **must** — Indeterminate is a rounded 16×2 bar — not a font minus or a minus icon; pressing it goes to Checked. (§6.3f)
- **do** — Indeterminate is for a "select all" box when the list is partly ticked. (§6.3f)
- **do** — Error when a required box is unticked and the user pressed continue (e.g. agreeing to the Terms). (§6.3f)
- **dont** — Never report a checkbox error with a Toast — report it at the box with an object-negative text line under the row. (§6.3f)
- **must** — The 2px border is built inside (inset box-shadow); the state layer covers the border too. (§6.1)

### CheckboxInput

- **must** — The touch area is the whole row, not just the box. (§6.3f)
- **must** — Box + text gap 12, top-aligned (items-start), text wrapper padded 4 on top. (§6.3f)
- **do** — The text is the Label property (TEXT), overridden on the instance. (§6.3f)

### Radio

Prop: `Checked` (False · True), `State` (Default · Hover · Pressed · [No state] · Error), `Disabled` (False · True)

- **do** — Pick one of many in a form. (§6.3d)
- **must** — 32 circle; when selected it stays white with a border-interactive border + a 20 object-interactive dot. (§6.3d)
- **do** — Error when a required radio group has no selection or an invalid one. (§6.3d)
- **must** — Disabled has no hover/pressed. (§6.3d)

### RadioInput

- **must** — The touch area is the whole row, not just the 32 circle. (§6.3d)
- **must** — Top-aligned (items-start), gap 12, text block padded 4 on top — not centered. (§6.3d)
- **must** — Lists: a 6/6 dashed border-muted line between rows, none after the last; built with a repeating gradient, not a dashed border. (§6.3d)

### Switch

Prop: `Selected` (False · True), `State` (Default · Hover · Focus · Pressed · [No state]), `Disabled` (False · True)

- **do** — Toggles a setting that takes effect immediately — unlike Checkbox (select, then confirm). (§6.17)
- **must** — The knob changes both position and size (16 → 28 with a check fill) — don't just slide a same-size knob. (§6.17)
- **must** — Off half uses state layer 5/10, on half 20/40; built with currentColor. (§6.17)
- **do** — A switch with a label is a row: use ListItem with a Trailing Switch (§6.32), don't build the row yourself. (§6.17)
- **dont** — No separate small size (use Compact) and no On/Off text in the track. (§6.17)

### Chip

Prop: `Type` (Select · Dropdown · Input), `Selected` (False · True), `State` (Default · Hover · Pressed · Disabled)

- **do** — A pressable label that holds a selected state; used for filtering (identical cards, just fewer). (§6.18)
- **must** — Geometry copies TextButtonNeutral Small; text uses the label style. (§6.18)
- **must** — Selected: background-interactive-muted background, border-interactive border, object-interactive text. (§6.18)
- **dont** — Don't use background-emphasized as the selected chip background — it equals background-disabled. (§6.18)
- **must** — Selected Type=Select has a 16 check fill icon before the text — never rely on color alone. (§6.18)
- **must** — Type=Dropdown has a 16 chevron-down in the text color, no check icon; when open the chip is Selected=True with chevron-up. (§6.18)
- **do** — The panel that opens is a Menu: single-value filter → Single, closes on select; multi-value filter → Multiple + footer, label "{Tên} · n". (§6.18)
- **must** — 16 prefix icon in the text color, gap 8; selected Type=Select puts the check in its place — a chip has only one leading icon. (§6.18)
- **must** — Type=Input: unselected colors, a 16 xmark in a 24 circle at the end is the only remove button (aria-label "Gỡ {nhãn}"); the chip body is not pressable. (§6.18)
- **do** — Type=Input for entered values / applied filters; after removal focus moves to the next chip. (§6.18)
- **dont** — No size other than 32 — Compact uses 24. (§6.18)

### SegmentedControl

- **do** — Pick one of many as pill tabs when the same content only changes its view. (§6.20)
- **must** — The selected item gets bolder via the Active mode (.uu-is-active), no weight override. (§6.13)
- **must** — Item state layer uses an object-primary fill at 5/10 for both Active values. (§6.13)
- **dont** — Items HUG — don't split the width equally unless the screen requires it, don't hardcode 204. (§6.13)
- **must** — Shell background-emphasized; the selected item has background-surface + elevation-low. (§6.13)

### NavigationBar

- **must** — No background of its own — transparent, sitting on the screen background. (§6.5)
- **must** — Back is IconButtonNeutral Solid Inverted=True Base with chevron-left. (§6.5)
- **do** — Turn off .Mini App Control with the Mini app prop when the screen doesn't run in a mini app. (§6.5)
- **dont** — A frosted-glass bar is a product choice; the component never turns it on itself. (§2.4)
- **do** — Use Breadcrumb on desktop; never use Breadcrumb instead of NavigationBar in an app. (§6.25)

### BottomBar

Prop: `Active` (1 · 2 · 3 · 4 · 5), `Compact` (False · True)

- **do** — Navigates between peer main screens; pressing an item changes screen, it doesn't filter content. (§6.22)
- **must** — 2 to 5 items. (§6.22)
- **must** — The selected item is in the interactive family (not accent), icon outline → fill. (§6.22)
- **must** — The badge is a NotificationBadge Count anchored to the icon's top right; only on non-Active items. (§6.22)
- **do** — The standalone action button (FooterItemSpecial) is for one main action, not a navigation destination; Emphasized by default, Subtle when the screen already has a Solid button. (§6.22)
- **must** — With an action button, Compact=True and at most 4 items. (§6.22)
- **dont** — A frosted-glass bar is not a BottomBar property — the component never turns it on itself. (§2.4)
- **chưa có** — item `Hover` / `Pressed` / `Disabled`; bar position on screen (distance from the bottom, horizontal margins, safe area); shadow or border for the shell when the screen background is also `background-surface`; labels longer than the item width; more than 5 items

### TablePagination

- **do** — The bar under a table with pressable page numbers — unlike Pagination (carousel indicator bars). (§6.24)
- **must** — Current page: 2px border-interactive border + aria-current="page". (§6.24)
- **must** — Back on the first page / forward on the last page are Disabled. (§6.24)
- **must** — ≤ 7 pages show all; more than 7 keeps the first, the last, the current ± 1, and gaps become one "…" cell. (§6.24)
- **dont** — Never use "…" in place of exactly one page number. (§6.24)
- **must** — The Ellipsis cell is not pressable, has no state layer, aria-hidden. (§6.24)
- **dont** — No page-number input to jump — the "…" shortening is enough. (§6.24)
- **chưa có** — pagination without a known total row count

### Breadcrumb

- **do** — The location path in the page tree on desktop. (§6.25)
- **must** — The last item is always the current page: object-primary, not a link, aria-current="page", no Hover. (§6.25)
- **must** — The "/" separator is object-disabled, aria-hidden. (§6.25)
- **dont** — Never use Breadcrumb instead of NavigationBar in an app. (§6.25)
- **must** — More than 4 items: keep the first and the last 2; the middle items collapse into one Type=Overflow "…" item that opens a Menu. (§6.25)
- **dont** — No icon before the first item. (§6.25)

### SideNav

Prop: `Collapsed` (False · True)

- **do** — The vertical navigation bar of a web app / portal — the equivalent of BottomBar in an app. (§6.27)
- **must** — One Active item at a time: background-interactive-muted background, object-interactive fill icon, aria-current="page". (§6.27)
- **must** — Collapsed: 73 wide, hides labels / chevrons / group titles / level-2 items; labels become Tooltips. (§6.27)
- **do** — Show/hide labels via the layout collection (data-layout="collapsed" or the collapsed prop), don't create a new collection. (§4.2)
- **must** — Level=2 items have no icon, indented 24 so their labels align with level-1 labels. (§6.27)
- **must** — Chevron-down rotates 180° when the group is open (same icon); the item has aria-expanded. (§6.27)
- **do** — Item badge: a NotificationBadge Count at the end of the item; collapsed it becomes a Dot at the icon's top right. (§6.27)
- **do** — Collapse / expand button: IconButtonNeutral Ghost Small sidebar-left at the top of the bar, aria-expanded, label "Thu gọn / Mở rộng thanh điều hướng". (§6.27)
- **dont** — No level-3 items — beyond 2 levels, split into pages. (§6.27)
- **chưa có** — an account area at the bottom of the bar

### Tab

Prop: `State` (Default · Active · Hover · Pressed · Disabled)

- **do** — Switches between different content areas (the layout below changes), not for filtering a list. (§6.20)
- **must** — Active tab: object-interactive text + a 32×4 border-interactive bar fixed at 32, not stretched to the label. (§6.20)
- **dont** — Don't use object-accent for tab text — tabs belong to the interactive family. (§6.20)
- **must** — Hover/Pressed only on non-Active tabs; Disabled has no state layer. (§6.20)
- **dont** — No shell, background or border of its own on Tab. (§6.20)
- **do** — 16 icon before the text (gap 8) in the text color, fill when Active; a NotificationBadge Dot after the text (gap 4) signals something new. (§6.20)
- **must** — The badge is only secondary info — the tab label still stands on its own; on the web add hidden text "có mới". (§6.20)

### TabBar

Prop: `Layout` (Fixed · Scrollable)

- **do** — Fixed for 2–4 short-label tabs (equal widths); Scrollable for ≥ 5 tabs or long labels. (§6.20)
- **must** — A 1px border-muted bottom border runs the full width; the Active bar sits over it. (§6.20)
- **must** — Web: role="tablist", left/right arrows switch tabs. (§6.20)
- **must** — Scrollable: the Active tab scrolls into view automatically. (§6.20)
- **dont** — No TabBar on dark backgrounds. (§6.20)

### Pagination

Prop: `Position` (Begin · Middle · End)

- **do** — A row of bars showing the position in a carousel — not round dots. (§6.10b)
- **must** — Only three positions, Begin/Middle/End, with exactly five bars, even with more than 5 pages. (§6.10b)
- **must** — Width is the main signal (24 vs 16), color only secondary. (§6.10b)
- **dont** — Inactive bars use overlay, not a brand background color; 🔒Base/Slick is never used on its own. (§6.10b)

### Toast

Prop: `Type` (Neutral · Negative · Positive · Warning)

- **do** — Reports the result of what the user just did, at the bottom, with a Type. (§6.31)
- **must** — Background lightness decides all three elements: Warning (light background) → content, Action button and close button are all Inverted=False; the other three types Inverted=True. (§6.6)
- **must** — Content uses object-on-{status}; body 400 style, not label. (§6.6)
- **dont** — Never use Toast for flow-blocking errors or input errors (wrong OTP, required checkbox) — Toast disappears by itself. (§6.3f)
- **do** — Errors fixable right away → Dialog / Toast, not an error screen. (§6.19)

### Badge

Prop: `Tone` (Neutral · Success · Warning · Error)

- **do** — A pill-shaped status label, not pressable. (§6.14)
- **must** — background-{status} only pairs with object-on-{status}. (§6.14)
- **must** — A 16 fill icon always shows before the text, by tone: Neutral circle-info · Success circle-check · Warning circle-warning · Error triangle-warning. (§6.14)
- **dont** — No states (hover/pressed/disabled) — not a control. (§6.14)
- **dont** — No size other than 24, no Highlight, the icon can't be turned off. (§6.14)

### StatusIndicator

Prop: `Tone` (Neutral · Success · Warning · Error · Highlight), `Container` (None · Filled)

- **must** — Container=None: object-{tone} dot, text always object-primary (warning is only the dot). (§6.15)
- **must** — The dot pulses (opacity 1 → 0.3, 1.6s); it stays still when the user enables reduced motion. (§6.15)
- **do** — Highlight for "this item deserves attention" (Mới, Nổi bật, Đề xuất), uses the accent family. (§6.15)
- **dont** — Don't use Highlight for errors (Error) or "new and unseen" (NotificationBadge). (§6.15)
- **dont** — No states — not a control. (§6.15)

### CardPushNotification

- **do** — Reports events from outside (order status changes, gifts, messages), slides in from the top; unlike Toast, which reports the result of an action. (§6.31)
- **dont** — No type, no buttons: press the whole card to open, swipe up to dismiss. (§6.31)
- **must** — Hides itself after 5 seconds, pauses the countdown while touched / hovered. (§6.31)
- **must** — One card at a time — a new card replaces the old one. (§6.31)
- **must** — Web: role="status", aria-live="polite". (§6.31)
- **do** — Title and Content max 2 lines; the 48 source image can be hidden. (§6.31)
- **must** — Desktop: top right corner, 16 from the top and right edges, 360 wide (size-90); pauses the countdown on hover. (§6.31)
- **dont** — No close button, received time or card stacking. (§6.31)

### NotificationBadge

Prop: `Content` (Count · Dot)

- **do** — A dot/count signaling something new and unseen, placed on the corner of an icon or tab. (§6.16)
- **must** — Uses the attention family — not negative, not warning, not accent. (§6.16)
- **dont** — The attention background is rose-600 (white text 4.70): don't change it to red-600, it would collide with negative. (§2.3)
- **dont** — Don't invent extra variants; the screen positions the anchor. (§6.16)

### Tooltip

Prop: `Placement` (Bottom · Left · Right · Top)

- **do** — A short label explaining an element on hover or focus — usually for text-less IconButtons or a collapsed SideNav. (§6.30)
- **dont** — Plain text only — no links / buttons inside (use Popover for that). (§6.30)
- **must** — Shows on hover and on keyboard focus. (§6.30)
- **dont** — Not used on touch screens — there is no hover. (§6.30)
- **must** — aria-describedby by default; when the tooltip is the name of an icon-only element → aria-labelledby (relation='label'). (§6.30)
- **must** — Hover shows after 500 ms, keyboard focus shows immediately; leaving / blur / Esc hides immediately, no fade. (§6.30)
- **dont** — No multi-line tooltips with titles — use Popover. (§6.30)

### TableHeaderCell

Prop: `Align` (Left · Right), `Sort` (Off · Unsorted · Ascending · Descending), `State` (Default · Hover · Pressed), `Type` (Default · Checkbox)

- **must** — Numeric columns Align=Right: the sort icon goes before the label, pushed right. (§6.23)
- **must** — Hover/Pressed only on sortable columns (Sort≠Off); Sort=Off has no icon, no states. (§6.23)
- **must** — Label object-secondary; object-primary when Ascending / Descending. (§6.23)
- **must** — Height and padding via density variables (table/header-height, table/cell-padding-x). (§6.23)
- **must** — Row-selection column: TableHeaderCell Type=Checkbox, 64 wide — Checked when the whole visible page is selected, Indeterminate when some. (§6.23)
- **chưa có** — sticky columns on horizontal scroll, expandable rows, inline cell editing, drag-to-reorder columns, empty / loading rows, a third density. Sticky columns, expandable rows, inline editing and column dragging are deferred — only when an admin screen needs them

### TableCell

Prop: `Type` (Text · Number · Secondary · Actions · Checkbox · Status), `State` (Default · Hover · Selected)

- **must** — Hover / Selected are states of the whole row — every cell in a row shares the State. (§6.23)
- **must** — Numeric columns right-align both header and cells, tabular-nums. (§6.23)
- **dont** — Per-row actions are never Solid; two or more actions → one Ghost Small, the rest in the "⋯" menu. (§6.23)
- **dont** — Tables have no outer border, no vertical lines — only a bottom border on each cell. (§6.23)
- **do** — Tables are for desktop / dashboards (Compact density); Selected uses background-interactive-muted. (§6.23)
- **do** — An empty table uses EmptySection inside the table body. (§6.19)
- **do** — Status columns use TableCell Type=Status containing a StatusIndicator; don't put an indicator in a Text cell yourself. (§6.23)
- **chưa có** — sticky columns on horizontal scroll, expandable rows, inline cell editing, drag-to-reorder columns, empty / loading rows, a third density. Sticky columns, expandable rows, inline editing and column dragging are deferred — only when an admin screen needs them

### KPICard

Prop: `Trend` (Up · Down · [No trend]), `Polarity` (Normal · Inverse)

- **do** — A card with one main number on a dashboard. (§6.26)
- **must** — Polarity=Normal: Up object-positive, Down object-negative (color follows the number's direction). (§6.26)
- **do** — Metrics where up is bad (costs, cancellation rate) → Polarity=Inverse: Up colored negative, Down positive; the icon still follows the direction. (§6.26)
- **must** — Value heading-base tabular-nums; Trend=[No trend] has no Delta. (§6.26)
- **must** — Pressable card (Interactive): a 16 chevron-right at the end of the Label row, state layer 5/10 over the whole card; the whole card is one link, no other buttons inside. (§6.26)
- **chưa có** — a small chart (sparkline) in the card — deferred

### CardSheet

Prop: `Navigation` (Close · Back), `Height` (Fit · Full)

- **must** — Back and Close are mutually exclusive: the root sheet is Navigation=Close, a child sheet Navigation=Back (no close button). (§6.8)
- **do** — Code: passing onBack means Navigation=Back; not passing it means Close. (§6.8)
- **must** — The button group is ButtonGroup (§6.9), not a hand-built frame; the secondary button and direction are set on the ButtonGroup instance. (§6.8)
- **must** — All four corners radius 24 — the sheet floats 12 from the edges. (§6.8)
- **do** — Title via the Header prop; CTA shows/hides the whole button group. (§6.10)
- **do** — Draggable sheet: a 32×4 rounded-circle Handle with border background at the top; two stops Height=Fit / Full. (§6.8)
- **must** — Dragging down from Fit past 1/3 → closes; from Full → back to Fit; without a Handle it can't be dragged. (§6.8)

### CardDialog

Prop: `Banner` (False · True)

- **must** — No title — all content (including the title) goes in the Slot; the header only holds a right-aligned close button. (§6.10)
- **must** — Banner=True: a single 16:9 image; it is content, so it needs alt. (§6.10)
- **must** — The close button over the image uses IconButtonNeutral Solid Small — an outlined button would disappear. (§6.10)
- **must** — The button group is ButtonGroup (§6.9). (§6.10)
- **dont** — Dialogs don't stack — no back button. (§6.10)

### SideSheet

Prop: `Type` (Standard · Modal), `Width` (Base · Wide)

- **do** — A panel sliding in from the right edge of a desktop screen to view / edit details without leaving the page. (§6.28)
- **do** — Standard sits beside the content with a left border, no scrim; Modal has elevation-high, two rounded left corners, a scrim like Sheet. (§6.28)
- **must** — Footer: TextButtonNeutral Outline Base + TextButtonAccent Solid Base, right-aligned, gap 12. (§6.28)
- **dont** — Never use SideSheet in apps — use Sheet. (§6.28)
- **do** — Width=Wide (480) for long / multi-column forms; default Base 384. (§6.28)
- **dont** — No left side sheet, no drag-to-resize. (§6.28)

### Popover

- **do** — A floating frame anchored to an element, holding interactive content (short forms, small confirmations). (§6.29)
- **must** — Opens on press; closes with the close button / Esc / outside click. (§6.29)
- **must** — Footer right-aligned, gap 8: TextButtonNeutral Ghost Small + TextButtonAccent Solid Small. (§6.29)
- **dont** — Don't use Popover for option lists (that is Menu) or hover explanations (that is Tooltip). (§6.29)
- **must** — Anchored below the element, left-aligned; flips up when there is no room, right-aligns near the right edge. (§6.29)
- **dont** — No arrow — Popover separates by elevation. (§6.29)

### EmptySection

- **do** — A block inside a screen with no data yet (empty list, empty table), including inside a table body. (§6.19)
- **must** — One button, can be hidden with Action. (§6.19)
- **must** — Title heading-sm (smaller than the screen), centered; 128 round image with background-accent-muted, needs alt. (§6.19)

### ErrorSection

- **do** — The error is only in one block; the rest of the screen still works. (§6.19)
- **must** — One retry button. (§6.19)
- **must** — Title heading-sm centered; 128 round image with background-accent-muted, needs alt. (§6.19)

### ListItem

Prop: `State` (Default · Hover · Pressed · Disabled)


### Sheet

- **must** — A screen template, not a product component — in code rebuild the scrim + wrapper, drop the home indicator. (§6.8)
- **must** — Scrim overlay (black 10%) + overlay-blur 16; don't multiply extra opacity onto the fill. (§6.8)
- **must** — Wrapper padding 0/12/12/12: the sheet is inset 12 on each side and floats 12 above the bottom. (§6.8)
- **do** — Use Sheet in apps, not SideSheet. (§6.28)

### Dialog

- **must** — A screen template — in code build it from CardDialog and add the scrim yourself. (§6.10)
- **must** — The panel is vertically centered (unlike Bottom sheet, which hugs the bottom). (§6.10)
- **must** — Scrim overlay + overlay-blur 16, panel inset 12 on each side; don't multiply extra opacity onto the fill. (§6.10)
- **do** — Confirm destructive actions with a Dialog containing a Solid TextButtonDanger. (§6.1)

### ResultScreen

- **do** — The task is done; the user has to go somewhere else. (§6.19)
- **must** — The footer is a vertical ButtonGroup — primary on top, secondary path below. (§6.19)
- **must** — NavigationBar Back action=false. (§6.19)
- **do** — Has a code component ResultScreen / UuResultScreen (Body + Footer; the screen places the NavigationBar); a square image with no background, needs alt. (§6.19)

### ErrorScreen

- **do** — An error blocking the whole core function that can't fix itself; a single-block error uses ErrorSection, errors fixable right away use Dialog / Toast. (§6.19)
- **must** — Exactly one button: retry. (§6.19)
- **must** — NavigationBar Back action=false. (§6.19)
- **must** — Illustration in a 128 circle with background-accent-muted, needs alt. (§6.19)
- **do** — Has a code component ErrorScreen / UuErrorScreen taking exactly one retry button. (§6.19)

### EmptyScreen

- **do** — The whole screen has no data yet. (§6.19)
- **must** — One action button (create, explore), can be hidden with Action. (§6.19)
- **must** — Has a back button (Back action=true) — an empty screen is still a normal screen. (§6.19)
- **must** — Illustration in a 128 circle with background-accent-muted, needs alt. (§6.19)

## Dễ nhầm

- `Switch` ≠ `Checkbox` — Switch có hiệu lực ngay khi bấm; Checkbox chỉ ghi lựa chọn, phải có nút xác nhận.
- `Tab` ≠ `Chip` — Tab đổi vùng nội dung (bố cục khác); Chip lọc thu hẹp cùng một danh sách.
- `Tab` ≠ `SegmentedControl` — SegmentedControl đổi cách xem cùng nội dung, 2–4 lựa chọn ngắn; Tab đổi sang nội dung khác.
- `Toast` ≠ `CardPushNotification` — Toast báo kết quả việc người dùng vừa làm, ở đáy, có type; Push báo chuyện từ bên ngoài, ở đỉnh, không type.
- `Pagination` ≠ `TablePagination` — Pagination là gạch chỉ vị trí băng chuyền; TablePagination có số trang bấm được dưới bảng.
- `Tooltip` ≠ `Popover` — Tooltip mở bằng hover / focus, chỉ chữ; Popover mở bằng bấm, có nút, form ngắn.
- `Popover` ≠ `Menu` — Menu là danh sách lựa chọn; Popover chứa nội dung tương tác bất kỳ.
- `CardSheet` ≠ `CardDialog` — Sheet sát đáy, có tiêu đề Header, có Back; Dialog căn giữa, không tiêu đề riêng, không xếp tầng.
- `CardSheet` ≠ `SideSheet` — CardSheet / Sheet cho app (mobile); SideSheet cho desktop, trượt từ mép phải.
- `TextButtonDanger` ≠ `TextButtonNeutral` — Danger chỉ cho hành động không hoàn tác được; đăng xuất, bỏ qua làm lại được → Neutral.
- `TextButtonAccent` ≠ `TextButtonNeutral` — Accent cho hành động chính của màn; Neutral cho hành động phụ, trung tính.
- `Badge` ≠ `StatusIndicator` — Badge là nhãn có nền đặc 24; StatusIndicator là chấm + chữ trạng thái, có Container None / Filled.
- `NotificationBadge` ≠ `StatusIndicator` — NotificationBadge (họ attention) báo có mới chưa xem; StatusIndicator Highlight (họ accent) là mục đáng chú ý.
- `ErrorScreen` ≠ `ErrorSection` — ErrorScreen khi lỗi chặn cả chức năng cốt lõi; ErrorSection khi lỗi chỉ ở một khối.
- `EmptyScreen` ≠ `EmptySection` — EmptyScreen khi cả màn chưa có dữ liệu; EmptySection cho một khối / bảng rỗng.
- `Dropdown` ≠ `Chip` — Dropdown là ô chọn trong form; Chip Type=Dropdown là bộ lọc nằm ngang, hiện giá trị đang chọn.

## Chọn khi nào (từ cây quyết định)

- **Switch** (Chọn một): Đây là tuỳ chọn bật/tắt — chỉ có hai đầu Bật & Tắt hoặc Có & Không? — Có → Bấm vào là có hiệu lực ngay? — Có hiệu lực ngay ⇒ Bật thông báo, bật vân tay, tiết kiệm pin.
- **Checkbox** (Chọn một): Đây là tuỳ chọn bật/tắt — chỉ có hai đầu Bật & Tắt hoặc Có & Không? — Có → Bấm vào là có hiệu lực ngay? — Phải bấm nút xác nhận ⇒ Đồng ý điều khoản, ghi nhớ đăng nhập — phải bấm nút mới ăn.
- **Chip** (Chọn một): Đây là tuỳ chọn bật/tắt — chỉ có hai đầu Bật & Tắt hoặc Có & Không? — Không → Chỗ trên màn có chật không? (nhiều tuỳ chọn, hoặc tuỳ chọn nằm trong một form dài) — Có → Giá trị có đủ ngắn để không xuống dòng ở khổ 390? — Có ⇒ Chip hiện giá trị đang chọn, bấm vào mới bung danh sách. Hợp với thanh lọc nằm ngang.
- **Dropdown** (Chọn một): Đây là tuỳ chọn bật/tắt — chỉ có hai đầu Bật & Tắt hoặc Có & Không? — Không → Chỗ trên màn có chật không? (nhiều tuỳ chọn, hoặc tuỳ chọn nằm trong một form dài) — Có → Giá trị có đủ ngắn để không xuống dòng ở khổ 390? — Không ⇒ Ô chọn cao 48 cùng khổ với các field khác trong form.
- **Radio** (Chọn một): Đây là tuỳ chọn bật/tắt — chỉ có hai đầu Bật & Tắt hoặc Có & Không? — Không → Chỗ trên màn có chật không? (nhiều tuỳ chọn, hoặc tuỳ chọn nằm trong một form dài) — Không → Tuỳ chọn là thông tin định danh — pháp lý, y tế, nhân thân? — Có ⇒ Giới tính, nhóm máu, quốc tịch. Danh sách dọc, đọc kỹ từng dòng.
- **Chip** (Chọn một): Đây là tuỳ chọn bật/tắt — chỉ có hai đầu Bật & Tắt hoặc Có & Không? — Không → Chỗ trên màn có chật không? (nhiều tuỳ chọn, hoặc tuỳ chọn nằm trong một form dài) — Không → Tuỳ chọn là thông tin định danh — pháp lý, y tế, nhân thân? — Không → Giá trị có đủ ngắn để không xuống dòng ở khổ 390? — Có ⇒ Kiểu dáng xe, hộp số, khoảng giá — các giá trị ngắn xếp thành lưới.
- **Radio** (Chọn một): Đây là tuỳ chọn bật/tắt — chỉ có hai đầu Bật & Tắt hoặc Có & Không? — Không → Chỗ trên màn có chật không? (nhiều tuỳ chọn, hoặc tuỳ chọn nằm trong một form dài) — Không → Tuỳ chọn là thông tin định danh — pháp lý, y tế, nhân thân? — Không → Giá trị có đủ ngắn để không xuống dòng ở khổ 390? — Không ⇒ Giá trị dài thì phải xuống dòng; chip xuống dòng là vỡ lưới.
- **Checkbox** (Chọn nhiều): Tuỳ chọn là thông tin định danh — pháp lý, y tế, nhân thân? — Có ⇒ Dị ứng thuốc, quốc tịch, giấy tờ đã có.
- **Chip** (Chọn nhiều): Tuỳ chọn là thông tin định danh — pháp lý, y tế, nhân thân? — Không → Giá trị có đủ ngắn để không xuống dòng ở khổ 390? — Có ⇒ Dịch vụ khách sạn, tiện ích, thẻ phân loại — xếp lưới, xuống dòng được.
- **Checkbox** (Chọn nhiều): Tuỳ chọn là thông tin định danh — pháp lý, y tế, nhân thân? — Không → Giá trị có đủ ngắn để không xuống dòng ở khổ 390? — Không ⇒ Giá trị dài thì mỗi dòng một mục, chữ xuống dòng vẫn thẳng hàng.
- **Tab** (Phân loại nội dung): Dải này dùng để lọc các mục trong cùng một danh sách? — Có → Các mục loại trừ nhau hoàn toàn, và bố cục thẻ đổi theo mục? — Có ⇒ Còn hiệu lực / Hết hiệu lực: hai tập rời nhau, và voucher hết hạn không còn nút Xem mã.
- **Chip** (Phân loại nội dung): Dải này dùng để lọc các mục trong cùng một danh sách? — Có → Các mục loại trừ nhau hoàn toàn, và bố cục thẻ đổi theo mục? — Không ⇒ Bên dưới vẫn là danh sách đó, cùng kiểu thẻ, chỉ ít mục đi. Voucher: Tất cả · Khả dụng · Đã dùng.
- **SegmentedControl** (Phân loại nội dung): Dải này dùng để lọc các mục trong cùng một danh sách? — Không → Bên dưới vẫn là cùng một nội dung, chỉ đổi cách xem hoặc phạm vi? — Có ⇒ Danh sách ↔ Bản đồ, Tuần ↔ Tháng ↔ Năm. 2–4 mục cố định, chia đều bề ngang.
- **Tab** (Phân loại nội dung): Dải này dùng để lọc các mục trong cùng một danh sách? — Không → Bên dưới vẫn là cùng một nội dung, chỉ đổi cách xem hoặc phạm vi? — Không ⇒ Mỗi mục là một vùng nội dung khác hẳn. Khách sạn: Mô tả · Hình ảnh · Chính sách.
- **Sang cây Phản hồi lỗi** (Phản hồi): Đây là thông điệp báo lỗi? — Có ⇒ Lỗi có cây riêng vì tiêu chí là "ai sửa được", không phải "cần bao nhiêu chú ý".
- **ResultScreen** (Phản hồi): Đây là thông điệp báo lỗi? — Không → Thông điệp có cần người dùng dừng lại để đọc? — Cần dừng lại → Sau khi đọc, người dùng phải sang một trang khác? — Có ⇒ Màn kết quả toàn trang — Đặt phòng xong, thanh toán xong — màn riêng, có chi tiết và hai lối đi tiếp.
- **Dialog** (Phản hồi): Đây là thông điệp báo lỗi? — Không → Thông điệp có cần người dùng dừng lại để đọc? — Cần dừng lại → Sau khi đọc, người dùng phải sang một trang khác? — Không → Nội dung có gọn không — một tiêu đề, một đoạn mô tả, tối đa một hình? — Có ⇒ Tạo yêu cầu thành công, đang xử lý, dự kiến có kết quả ngày…
- **Sheet** (Phản hồi): Đây là thông điệp báo lỗi? — Không → Thông điệp có cần người dùng dừng lại để đọc? — Cần dừng lại → Sau khi đọc, người dùng phải sang một trang khác? — Không → Nội dung có gọn không — một tiêu đề, một đoạn mô tả, tối đa một hình? — Không ⇒ Có bảng chi tiết, danh sách, nhiều dòng thông tin — sheet cuộn được, dialog thì không.
- **Toast** (Phản hồi): Đây là thông điệp báo lỗi? — Không → Thông điệp có cần người dùng dừng lại để đọc? — Đọc lướt là đủ ⇒ Đã thêm vào yêu thích, đã sao chép, đã lưu nháp. Tự tắt, không chặn thao tác.
- **TextInput** (Phản hồi lỗi): Lỗi có chặn người dùng đi tiếp không? — Chặn lại → Người dùng tự sửa được ngay trên màn đang đứng? — Có → Lỗi gắn được vào đúng một ô không? — Có ⇒ Dòng lỗi tại ô — Sai định dạng email, mật khẩu chưa đủ ký tự, ngày trả trước ngày nhận. Ô tick bắt buộc cũng vào đây — Checkbox có State=Error.
- **Toast** (Phản hồi lỗi): Lỗi có chặn người dùng đi tiếp không? — Chặn lại → Người dùng tự sửa được ngay trên màn đang đứng? — Có → Lỗi gắn được vào đúng một ô không? — Không ⇒ Lỗi thuộc cả biểu mẫu chứ không thuộc ô nào: đơn không đủ điều kiện giao, giỏ hàng vượt hạn mức.
- **Dialog** (Phản hồi lỗi): Lỗi có chặn người dùng đi tiếp không? — Chặn lại → Người dùng tự sửa được ngay trên màn đang đứng? — Không → Phần còn lại của ứng dụng vẫn dùng được? — Có ⇒ Số dư ví không đủ, quá số lần gửi OTP — phải rời màn này mới xử lý được.
- **ErrorScreen** (Phản hồi lỗi): Lỗi có chặn người dùng đi tiếp không? — Chặn lại → Người dùng tự sửa được ngay trên màn đang đứng? — Không → Phần còn lại của ứng dụng vẫn dùng được? — Không ⇒ Màn lỗi toàn trang — Hệ thống gián đoạn, mất kết nối máy chủ — chức năng cốt lõi không chạy được.
- **Toast** (Phản hồi lỗi): Lỗi có chặn người dùng đi tiếp không? — Vẫn đi tiếp được ⇒ Tải thêm mục thất bại, mất kết nối tạm thời, đồng bộ nền lỗi. Kèm nút Thử lại nếu thử lại được.
- **Chỉ đánh dấu các trường KHÔNG bắt buộc** (Trường bắt buộc): Quá nửa số trường là bắt buộc? — Có ⇒ Nhãn thêm hậu tố ∙ Không bắt buộc. Các trường còn lại để trơn.
- **Chỉ đánh dấu các trường BẮT BUỘC** (Trường bắt buộc): Quá nửa số trường là bắt buộc? — Không ⇒ Nhãn thêm hậu tố ∙ Bắt buộc. Các trường còn lại để trơn.
- **Xác thực theo thời gian thực** (Xác thực dữ liệu): Kiểm được ngay trên máy, không cần gọi máy chủ? — Có ⇒ Định dạng email, độ dài mật khẩu, số ký tự, khoảng ngày.
- **Xác thực khi gửi biểu mẫu** (Xác thực dữ liệu): Kiểm được ngay trên máy, không cần gọi máy chủ? — Không ⇒ Trùng tài khoản, mã giảm giá còn hiệu lực, số dư đủ hay không — phải hỏi máy chủ.
