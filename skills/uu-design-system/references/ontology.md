# UU DS — bản đồ hệ thống (ontology, tóm tắt)

Bản đầy đủ: `ontology.json` (848 node · 2050 quan hệ). Sinh tự động — 2026-11-11.

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

- **must** — Chỉ dùng token semantic (background-*, object-*, border-*); không hardcode hex, không tạo primitive màu có sẵn alpha. (§0)
- **dont** — Đừng lấy token nền tô chữ hay ngược lại — mỗi token có phạm vi riêng (nền, chữ, viền, gap, radius). (§1)
- **must** — Component không biết mình ở brand nào; đổi brand bằng data-theme trên khung chứa, không sửa component. (§2.5)
- **dont** — Đừng lấy accent cho thứ bấm được: interactive cho nút, link, tab, field focus, mục đang chọn; accent cho nhấn nội dung. (§2.5)
- **must** — background-{status} chỉ đi với object-on-{status}; object-{status} dùng cho chữ/icon trên nền sáng. (§2.2)
- **dont** — Đừng dùng negative cho badge “có mới”, đừng dùng attention cho thông báo lỗi; attention = có mới chưa xem, warning = rủi ro, negative = hỏng/sai. (§2.2)
- **dont** — Đừng dùng object-warning (1.92 trên trắng) hay object-attention cho chữ đứng một mình — chỉ cho chấm / icon kèm chữ object-primary. (§2.3)
- **must** — Đừng để màu là tín hiệu duy nhất ở chỗ quan trọng — kèm chữ hoặc icon. (§2.3)
- **must** — Hover/Pressed chỉ qua state layer ::after phủ toàn bộ, fill = currentColor (màu object của variant); không đổi nền, chữ, font-weight. (§6.0)
- **must** — Bậc opacity state layer: content sáng trên nền tối → 20/40; content tối trên nền sáng → 5/10. Disabled và Loading không có state layer. (§6.0)
- **do** — Mode chữ Active (đậm thêm một bậc) chỉ cho ToggleButton Active=True và Segment item đang chọn; không liên quan :hover/:active hay State=Pressed. (§3)
- **dont** — Đừng hardcode width cho component hug (button, toggle, chip); line-height là giá trị tuyệt đối, không bội số. (§3)
- **must** — Component đọc biến density (--control-height-*, --field-height, --text-<style>-*); không gõ cứng 24/32/40/48/56px, không đọc thẳng --font-size-*. Không dùng Compact cho màn chạm. (§4.1)
- **must** — Chỉ dùng UU icon; không thay Lucide/Phosphor/Font Awesome, không crop viewBox. Trạng thái bật dùng biến thể fill, tắt dùng outline. (§6.11)
- **do** — Chỉ build component có trong mục 5; thứ không có là chưa chốt — hỏi lại, đừng suy đoán. (§0)

## Quy tắc và phần chưa chốt theo component

### TextButtonAccent

Prop: `Type` (Solid · Outline · Ghost), `Size` (Large · Base · Small), `State` (Default · Hover · Pressed · Disabled · Loading), `Inverted` (False · True)

- **do** — Dùng cho hành động chính của màn. (§6.1)
- **do** — Một nút Solid (Accent hoặc Danger) mỗi màn. (§6.1)
- **dont** — Hành động lặp theo dòng hoặc theo thẻ không bao giờ Solid — dùng Ghost Small hoặc gom vào menu “⋯”. (§6.1)
- **do** — Inverted=True khi đặt trên nền tối. (§6.1)
- **must** — min-width = min-height = chiều cao size (56/48/32) — nút chữ ngắn không hẹp hơn hình tròn. (§6.1)
- **must** — Viền Outline không cộng vào chiều cao: dựng bằng box-shadow inset 2px, không dùng border. (§6.1)
- **must** — Loading: spinner .loading đứng trước label, label vẫn hiện, không có state layer. (§6.1)
- **dont** — Pressed giữ nguyên weight 600 — không dùng mode chữ Active. (§3)

### TextButtonNeutral

Prop: `Type` (Solid · Outline · Ghost), `Size` (Large · Base · Small), `State` (Default · Hover · Pressed · Disabled · Loading), `Inverted` (False · True)

- **do** — Dùng cho hành động phụ, trung tính. (§6.1)
- **do** — Việc làm lại được (đăng xuất, bỏ qua) vẫn là Neutral, dù trông “nguy hiểm”. (§6.1)
- **do** — Inverted=True khi đặt trên nền tối. (§6.1)
- **must** — Viền Outline không cộng vào chiều cao: dựng bằng box-shadow inset 2px. (§6.1)
- **must** — Disabled: Solid nền background-disabled, Outline viền border-muted, chữ object-disabled, không state layer. (§6.1)
- **do** — Ghost Small là dạng nút Action trong suffix của TextInput và nút Huỷ của SearchInput. (§6.3)
- **do** — `Type=Tonal` cho hành động lặp trên thẻ nền `background-surface`. Không đặt trên `background-subtle`. (§6.1)

### TextButtonDanger

Prop: `Type` (Solid · Outline · Ghost), `Size` (Large · Base · Small), `State` (Default · Hover · Pressed · Disabled · Loading), `Inverted` (False)

- **do** — Chỉ cho hành động phá huỷ, không hoàn tác được (xoá tài khoản, huỷ đơn, gỡ thiết bị). (§6.1)
- **dont** — Đừng dùng Danger chỉ vì nút “trông nguy hiểm” — việc làm lại được là Neutral. (§6.1)
- **dont** — Không có Inverted=True — nút phá huỷ luôn trên nền sáng; màn tối thì mở Dialog xác nhận. (§6.1)
- **do** — Hành động phá huỷ theo dòng nằm trong menu “⋯” và xác nhận bằng Dialog có TextButtonDanger Solid. (§6.1)
- **do** — Một nút Solid (Accent hoặc Danger) mỗi màn. (§6.1)
- **must** — Hình học, density, state layer, Loading, Disabled y hệt TextButtonAccent; chỉ đổi họ màu sang negative. (§6.1)

### IconButtonAccent

Prop: `Type` (Solid · Outline · Ghost), `Size` (Large · Base · Small), `State` (Default · Hover · Pressed · Disabled · Loading), `Inverted` (False · True)

- **must** — Prop và màu khớp TextButtonAccent (Type/Inverted/Size/State); icon dùng token object-* như chữ của Text button. (§6.2)
- **must** — Hộp vuông tròn: 56/48/32, icon 24/24/16, padding 0. (§6.2)
- **must** — Inverted=True: Solid (nền surface) dùng state layer 5/10; Outline và Ghost dùng 20/40. (§6.2)
- **must** — Nút chỉ có icon cần tên: có label, hoặc Tooltip relation='label' (aria-labelledby). (§6.30)
- **do** — Sub action của NavigationBar là IconButtonAccent Solid Inverted=True Base. (§6.5)

### IconButtonNeutral

Prop: `Type` (Solid · Outline · Ghost), `Size` (Large · Base · Small), `State` (Default · Hover · Pressed · Disabled · Loading), `Inverted` (False · True)

- **must** — Prop và màu khớp TextButtonNeutral; Solid Inverted=False dùng background-inverted. (§6.2)
- **must** — Inverted=True: Solid (nền surface) dùng state layer 5/10; Outline và Ghost dùng 20/40. (§6.2)
- **must** — Nút chỉ có icon cần tên: có label, hoặc Tooltip relation='label' (aria-labelledby). (§6.30)
- **do** — Ghost Small mở Menu “⋯” cho hành động theo dòng / theo thẻ. (§6.1)
- **do** — Nút đóng (xmark) của Toast, SideSheet, Popover là IconButtonNeutral Ghost; của CardSheet/CardDialog là Outline Small. (§6.6)
- **do** — Nút đóng đè lên ảnh banner của CardDialog dùng Solid để đọc được trên mọi ảnh. (§6.10)
- **dont** — Không có IconButton kiểu Danger — xoá theo dòng nằm trong menu “⋯”, xác nhận bằng Dialog có TextButtonDanger Solid. (§6.2)

### ToggleButton

Prop: `Size` (Large · Base · Small), `State` (Default · Hover · Pressed · Disabled), `Active` (False · True), `Label` (False · True)

- **do** — Dùng cho nút giữ trạng thái bật/tắt; Active là prop độc lập với State. (§6.7)
- **must** — Hai prop chữ riêng (Label / Active label) để đổi copy theo trạng thái — đừng dùng chung một chuỗi. (§6.7)
- **must** — Icon đổi hẳn biến thể outline ↔ fill khi bật, không chỉ đổi màu. (§6.7)
- **must** — Chữ đậm thêm một bậc khi bật qua typography mode Active, không override weight trên node. (§6.7)
- **dont** — Đừng hardcode width — bề rộng chênh 1px giữa hai trạng thái. (§6.7)
- **dont** — Không border, không shadow ở mọi variant — dùng nổi trên ảnh hoặc nền màu. (§6.7)
- **dont** — Không có state Loading; Disabled không có state layer. (§6.7)

### ButtonGroup

Prop: `Layout` (Horizontal · Vertical), `Tone` (Default · Danger)

- **must** — Horizontal: nút phụ (Outline) bên trái, nút chính (Solid) bên phải, hai nút chia đều. (§6.9)
- **must** — Vertical: nút chính (Solid) trên, nút phụ (Outline) dưới. (§6.9)
- **must** — Nút dùng TextButtonAccent size Large (56), gap 12. (§6.9)
- **must** — Khi code hai nút chia đôi dùng flex: 1 1 0, không dùng flex: 1 1 auto. (§6.8)
- **do** — Là nhóm nút dùng chung của CardSheet và CardDialog — không tự dựng frame nút riêng. (§6.8)
- **must** — Tone=Danger (dialog / sheet xác nhận xoá): nút chính là TextButtonDanger Solid Large, nút phụ giữ nguyên; không tự xếp hai nút. (§6.9)

### TextInput

Prop: `Value` (Empty · Filled), `State` (Default · Hover · Focus · Typing · [No state]), `Error` (False · True), `Disabled` (False · True)

- **must** — Error=True đổi ba thứ: viền border-negative, Label object-negative, hiện dòng Error message caption dưới Field. (§6.3)
- **dont** — Dòng lỗi là chữ, không có icon (tín hiệu thứ tư không thêm thông tin). (§6.3)
- **must** — Dòng lỗi chiếm chỗ thật (root 76 → 100) — bố cục phải nhường chỗ, đừng để đè lên khối khác. (§6.3)
- **dont** — Error không kết hợp với Disabled. (§6.3)
- **must** — Filled + Disabled giữ chữ object-primary để còn đọc được; chỉ placeholder xuống object-disabled. (§6.3)
- **must** — Focus/Typing: viền border-emphasized + con trỏ 1,5×24 object-accent. (§6.3)
- **do** — Báo lỗi tại ô bằng viền đỏ + dòng lỗi, không dùng Toast. (§6.3b)

### TextArea

Prop: `Value` (Empty · Filled), `State` (Default · Hover · Focus · Typing · [No state]), `Error` (False · True), `Disabled` (False · True)

- **do** — Component riêng cho nhập nhiều dòng — thay mọi TextInput kéo cao. (§6.3e)
- **must** — Field cao 112 (đúng ba dòng + bộ đếm) — đừng tự đổi 88 hay 120; Compact chỉ đổi radius và padding ngang. (§6.3e)
- **must** — Chữ bám mép trên, padding 12 bốn phía; bộ đếm (n/100) caption object-secondary ở góc phải dưới. (§6.3e)
- **must** — Viền, nền, chữ, Error theo đúng bảng TextInput; dòng lỗi không icon. (§6.3e)
- **must** — Disabled: chữ đã gõ giữ object-primary; nhãn, bộ đếm và placeholder xuống object-disabled. (§6.3e)

### OTPInput

Prop: `Value` (Empty · Filled), `State` (Default · Focus · Typing · [No state]), `Error` (False · True), `Disabled` (False · True), `Masked` (False · True)

- **do** — Thay mọi ô mã xác thực dựng tay bằng component này; Masked=True cho mã PIN. (§6.3b)
- **must** — Ô rỗng mang dấu “-” object-secondary, không phải ô trắng trơn hay placeholder chữ số. (§6.3b)
- **must** — Con trỏ 2px object-accent là tín hiệu duy nhất cho ô đang nhận chữ. (§6.3b)
- **must** — Lỗi: cả sáu ô cùng viền border-negative, không tô riêng ô nào; nền và chữ giữ nguyên. (§6.3b)
- **must** — Chữ đã gõ ở lại khi lỗi — đừng xoá về rỗng. (§6.3b)
- **must** — Dòng lỗi căn giữa dưới cụm ô, cách 4, caption object-negative. (§6.3b)
- **dont** — Không báo sai mã bằng Toast. (§6.3b)
- **do** — Ô co bằng flex: 1 0 0, min-width 36, max-width 48 để không tràn trên máy hẹp. (§6.3b)

### SearchInput

Prop: `Value` (Empty · Filled), `State` (Default · Hover · Focus · Typing · [No state] · Loading), `Disabled` (False · True)

- **dont** — Không có Error — không kết quả là chuyện của màn kết quả, không phải của ô. (§6.3g)
- **must** — Icon magnifier 24 cố định bên trái; nút xoá circle-xmark 16 chỉ hiện khi Filled, vùng chạm 32×32. (§6.3g)
- **must** — Disabled đã có chữ giữ object-primary; icon magnifier xuống object-disabled. (§6.3g)
- **must** — Loading: .loading 16 thay chỗ nút xoá, viền như Typing. (§6.3g)
- **do** — Cancel=true (nút Huỷ TextButtonNeutral Ghost Small) chỉ dùng ở màn tìm kiếm riêng trên mobile; bấm Huỷ xoá chữ, bỏ focus, đóng panel. (§6.3g)
- **do** — Panel gợi ý / lịch sử là Menu Platform=Panel neo dưới ô cách 4; rỗng + focus → lịch sử, đang gõ → gợi ý, không có gì → không mở panel. (§6.3g)
- **do** — Hàng “Tìm gần đây” có IconButtonNeutral Ghost Small xmark cuối hàng để xoá từng mục; panel vẫn mở, focus về ô. (§6.3g)
- **dont** — Không có cỡ nhỏ riêng — density Compact đã thu ô. (§6.3g)

### DateInput

Prop: `Value` (Empty · Filled), `State` (Default · Hover · [No state]), `Error` (False · True), `Disabled` (False · True)

- **dont** — Đừng tự ghép TextInput với icon lịch — dùng DateInput. (§6.3c)
- **must** — Ô không nhận gõ tay: chạm mở lịch của hệ điều hành, không con trỏ, không bàn phím. (§6.3c)
- **must** — Giá trị hiển thị DD/MM/YYYY, style body 400. (§6.3c)
- **dont** — Icon calendar-days 24 luôn object-secondary — đừng tô object-interactive, đừng bọc thành Icon button; không thay bằng icon calendar. (§6.3c)
- **must** — Error: viền border-negative, Label object-negative, dòng lỗi chữ không icon. (§6.3c)

### Dropdown

Prop: `Value` (Empty · Filled), `State` (Default · Hover · [No state]), `Error` (False · True), `Disabled` (False · True)

- **must** — Giá trị đã chọn dùng label 600; gợi ý rỗng “Bấm để chọn” body 400 object-secondary. (§6.4)
- **must** — Icon chevron-down 16 object-secondary ở mọi state. (§6.4)
- **dont** — Không có Focus/Typing — ô không nhận gõ. (§6.4)
- **do** — Danh sách option bung ra dùng Menu (§6.21). (§6.4)
- **must** — Error: viền border-negative, Label object-negative, dòng lỗi chữ không icon. (§6.3)

### Menu

Prop: `Platform` (Panel · Sheet)

- **do** — Là panel option của Dropdown, Chip Dropdown và gợi ý SearchInput; Platform=Panel cho desktop, Sheet cho mobile. (§6.21)
- **must** — Hàng đã chọn (Single): nền tint background-accent-subtle, chữ object-interactive, state layer background-interactive 5/10. (§6.21)
- **must** — Type=Multiple: Checkbox đầu hàng, không tint nền, chữ object-primary; không đóng khi chọn, bật Footer “Bỏ chọn” + “Áp dụng”. (§6.21)
- **do** — Bật Search (SearchInput không nhãn, dính trên) khi > 8 option; không còn option → “Không tìm thấy “{từ khoá}””. (§6.21)
- **do** — .MenuSection: title-xs object-secondary IN HOA; .MenuDivider 1px border-muted, nhóm đầu không cần vạch phía trên. (§6.21)
- **must** — Panel neo dưới phần tử cách 4; thiếu chỗ thì lật lên; cao tối đa 320 rồi cuộn trong panel (tìm nhanh dính trên, footer dính dưới). (§6.21)
- **must** — Prefix icon chỉ có ở Type=Single. (§6.21)
- **do** — Đóng khi chọn xong (Single), bấm ra ngoài, Esc; Multiple chỉ áp dụng khi bấm “Áp dụng”. (§6.21)
- **do** — Option cần giải thích thêm → Description caption object-secondary dưới tên, tối đa 2 dòng; icon / checkbox căn trên. (§6.21)
- **must** — “Chọn tất cả” (Multiple, từ 4 option): hàng đầu + MenuDivider; Checked khi chọn hết, Indeterminate khi một phần; đang tìm nhanh chỉ tác động option đang hiện. (§6.21)

### Checkbox

Prop: `Value` (Unchecked · Checked · Indeterminate), `State` (Default · Hover · Pressed · [No state] · Error), `Disabled` (False · True)

- **must** — Checked là mảng màu đặc background-interactive + icon check fill 20 object-on-interactive. (§6.3f)
- **must** — Indeterminate là vạch 16×2 bo tròn — không phải dấu trừ của font hay icon minus; bấm vào chuyển sang Checked. (§6.3f)
- **do** — Indeterminate dùng cho ô “chọn tất cả” khi danh sách mới tick một phần. (§6.3f)
- **do** — Error khi ô bắt buộc chưa tick mà người dùng đã bấm tiếp tục (vd. đồng ý Điều khoản). (§6.3f)
- **dont** — Không báo lỗi checkbox bằng Toast — báo tại ô kèm dòng chữ object-negative dưới hàng. (§6.3f)
- **must** — Viền 2px dựng inside (box-shadow inset), state layer phủ tràn viền. (§6.1)

### CheckboxInput

- **must** — Vùng chạm là cả hàng, không riêng ô tick. (§6.3f)
- **must** — Ô tick + chữ gap 12, canh mép trên (items-start), text wrapper đệm trên 4. (§6.3f)
- **do** — Chữ là property Label (TEXT), override trên instance. (§6.3f)

### Radio

Prop: `Checked` (False · True), `State` (Default · Hover · Pressed · [No state] · Error), `Disabled` (False · True)

- **do** — Chọn một trong nhiều trong form. (§6.3d)
- **must** — Vòng tròn 32, đã chọn vẫn nền trắng + viền border-interactive + chấm 20 object-interactive. (§6.3d)
- **do** — Error khi nhóm radio bắt buộc chưa chọn hoặc lựa chọn không hợp lệ. (§6.3d)
- **must** — Disabled không có hover/pressed. (§6.3d)

### RadioInput

- **must** — Vùng chạm là cả hàng, không riêng vòng tròn 32. (§6.3d)
- **must** — Canh mép trên (items-start), gap 12, cụm chữ đệm trên 4 — không canh giữa. (§6.3d)
- **must** — Danh sách: vạch nét đứt 6/6 border-muted giữa hai hàng, hàng cuối không kẻ; dựng bằng gradient lặp, không dùng border dashed. (§6.3d)

### Switch

Prop: `Selected` (False · True), `State` (Default · Hover · Focus · Pressed · [No state]), `Disabled` (False · True)

- **do** — Bật/tắt một thiết lập có hiệu lực ngay — khác Checkbox (chọn rồi bấm xác nhận). (§6.17)
- **must** — Núm đổi cả vị trí lẫn kích thước (16 → 28 có check fill) — đừng chỉ trượt một núm cùng cỡ. (§6.17)
- **must** — Nửa tắt state layer 5/10, nửa bật 20/40; dựng bằng currentColor. (§6.17)
- **do** — Cần nhãn thì màn tự dựng hàng và ghi rõ là phần tự chế. (§6.17)
- **dont** — Không có cỡ nhỏ riêng (dùng Compact) và không có chữ On/Off trong rãnh. (§6.17)
- **chưa có** — nhãn đi kèm (hàng switch + nhãn). Cần nhãn thì màn tự dựng hàng và nói rõ đó là phần tự chế

### Chip

Prop: `Type` (Select · Dropdown · Input), `Selected` (False · True), `State` (Default · Hover · Pressed · Disabled)

- **do** — Nhãn bấm được giữ trạng thái chọn; dùng để lọc (thẻ y hệt chỉ ít đi). (§6.18)
- **must** — Hình học chép TextButtonNeutral Small; chữ style label. (§6.18)
- **must** — Đã chọn: nền background-interactive-muted, viền border-interactive, chữ object-interactive. (§6.18)
- **dont** — Đừng dùng background-emphasized làm nền chip đã chọn — trùng background-disabled. (§6.18)
- **must** — Type=Select đã chọn có icon check fill 16 trước chữ — không chỉ dựa vào màu. (§6.18)
- **must** — Type=Dropdown có chevron-down 16 cùng màu chữ, không icon check; khi mở chip Selected=True và chevron-up. (§6.18)
- **do** — Panel bung ra là Menu: lọc một giá trị → Single, chọn xong đóng; lọc nhiều → Multiple + footer, nhãn “{Tên} · n”. (§6.18)
- **must** — Prefix icon 16 cùng màu chữ, gap 8; Type=Select đã chọn thì check thay chỗ icon — chip chỉ có một icon đầu. (§6.18)
- **must** — Type=Input: màu như chưa chọn, xmark 16 trong ô tròn 24 cuối chip là nút gỡ duy nhất (aria-label “Gỡ {nhãn}”); thân chip không bấm được. (§6.18)
- **do** — Type=Input cho giá trị đã nhập / bộ lọc đang áp dụng; gỡ xong focus sang chip kế tiếp. (§6.18)
- **dont** — Không có cỡ khác 32 — Compact dùng 24. (§6.18)

### SegmentedControl

- **do** — Chọn một-trong-nhiều kiểu tab pill khi cùng nội dung chỉ đổi cách xem. (§6.20)
- **must** — Item đang chọn đậm lên bằng mode Active (.uu-is-active), không override weight. (§6.13)
- **must** — State layer item dùng fill object-primary bậc 5/10 ở cả hai giá trị Active. (§6.13)
- **dont** — Item HUG — đừng chia đều bề ngang trừ khi màn yêu cầu, đừng hardcode 204. (§6.13)
- **must** — Vỏ nền background-emphasized, item đang chọn nền background-surface + elevation-low. (§6.13)

### NavigationBar

- **must** — Không có nền riêng — trong suốt, nằm trên nền màn. (§6.5)
- **must** — Back là IconButtonNeutral Solid Inverted=True Base với chevron-left. (§6.5)
- **do** — Tắt .Mini App Control bằng prop Mini app khi màn không chạy trong mini app. (§6.5)
- **dont** — Thanh kính mờ là lựa chọn của sản phẩm, component không tự bật. (§2.4)
- **do** — Trên desktop dùng Breadcrumb; không dùng Breadcrumb thay NavigationBar trên app. (§6.25)

### BottomBar

Prop: `Active` (1 · 2 · 3 · 4 · 5), `Compact` (False · True)

- **do** — Điều hướng giữa các màn chính ngang hàng; bấm mục là chuyển màn, không lọc nội dung. (§6.22)
- **must** — Có 2 đến 5 mục. (§6.22)
- **must** — Mục đang chọn thuộc họ interactive (không accent), icon outline → fill. (§6.22)
- **must** — Badge là NotificationBadge Count neo góc trên phải icon; chỉ ở mục không Active. (§6.22)
- **do** — Nút hành động riêng (FooterItemSpecial) cho một hành động chính, không phải đích điều hướng; mặc định Emphasized, Subtle khi màn đã có nút Solid. (§6.22)
- **must** — Có nút hành động thì Compact=True tối đa 4 mục. (§6.22)
- **dont** — Thanh kính mờ không phải thuộc tính của BottomBar — component không tự bật. (§2.4)
- **chưa có** — `Hover` / `Pressed` / `Disabled` của mục; vị trí thanh trên màn (cách đáy, lề ngang, safe area); bóng hay viền cho vỏ khi nền màn cũng là `background-surface`; nhãn dài quá bề rộng mục; quá 5 mục

### TablePagination

- **do** — Thanh dưới bảng có số trang bấm được — khác Pagination (gạch chỉ báo carousel). (§6.24)
- **must** — Trang đang chọn: viền 2px border-interactive + aria-current="page". (§6.24)
- **must** — Nút lùi ở trang đầu / tiến ở trang cuối là Disabled. (§6.24)
- **must** — ≤ 7 trang hiện đủ; quá 7 giữ trang đầu, cuối, trang đang chọn ± 1, khoảng trống thành một ô “…”. (§6.24)
- **dont** — Không bao giờ “…” thay cho đúng một số trang. (§6.24)
- **must** — Ô Ellipsis không bấm được, không state layer, aria-hidden. (§6.24)
- **dont** — Không có ô nhập số trang để nhảy — rút gọn “…” là đủ. (§6.24)
- **chưa có** — phân trang không biết tổng số dòng

### Breadcrumb

- **do** — Đường dẫn vị trí trong cây trang trên desktop. (§6.25)
- **must** — Mục cuối luôn là trang hiện tại: object-primary, không phải link, aria-current="page", không Hover. (§6.25)
- **must** — Ngăn cách “/” object-disabled, aria-hidden. (§6.25)
- **dont** — Không dùng Breadcrumb thay NavigationBar trên app. (§6.25)
- **must** — Quá 4 mục: giữ mục đầu và 2 mục cuối, các mục giữa gom vào một mục Type=Overflow “…” mở Menu. (§6.25)
- **dont** — Không có icon trước mục đầu. (§6.25)

### SideNav

Prop: `Collapsed` (False · True)

- **do** — Thanh điều hướng dọc của web app / portal — tương đương BottomBar trên app. (§6.27)
- **must** — Một mục Active mỗi lúc: nền background-interactive-muted, icon fill object-interactive, aria-current="page". (§6.27)
- **must** — Collapsed: rộng 73, ẩn nhãn / chevron / tiêu đề nhóm / mục cấp 2; nhãn chuyển thành Tooltip. (§6.27)
- **do** — Ẩn/hiện nhãn qua collection layout (data-layout="collapsed" hoặc prop collapsed), không tạo collection mới. (§4.2)
- **must** — Mục Level=2 không icon, thụt 24 để nhãn thẳng hàng nhãn cấp 1. (§6.27)
- **must** — Chevron-down xoay 180° khi nhóm mở (không đổi icon); mục có aria-expanded. (§6.27)
- **do** — Badge trên mục: NotificationBadge Count cuối mục; khi thu gọn thành Dot ở góc trên phải icon. (§6.27)
- **do** — Nút thu / mở: IconButtonNeutral Ghost Small sidebar-left đầu thanh, aria-expanded, nhãn “Thu gọn / Mở rộng thanh điều hướng”. (§6.27)
- **dont** — Không có mục cấp 3 — quá 2 cấp thì tách trang. (§6.27)
- **chưa có** — khu tài khoản cuối thanh

### Tab

Prop: `State` (Default · Active · Hover · Pressed · Disabled)

- **do** — Chuyển giữa các vùng nội dung khác nhau (bố cục bên dưới đổi), không để lọc danh sách. (§6.20)
- **must** — Tab Active: chữ object-interactive + gạch 32×4 border-interactive cố định 32, không giãn theo nhãn. (§6.20)
- **dont** — Đừng lấy object-accent cho chữ tab — tab thuộc họ interactive. (§6.20)
- **must** — Hover/Pressed chỉ có ở tab không Active; Disabled không có state layer. (§6.20)
- **dont** — Không vỏ, không nền, không viền riêng trên Tab. (§6.20)
- **do** — Icon 16 trước chữ (gap 8) cùng màu chữ, Active dùng fill; NotificationBadge Dot sau chữ (gap 4) báo có mới. (§6.20)
- **must** — Badge chỉ là thông tin phụ — nhãn tab vẫn tự đủ nghĩa; web thêm chữ ẩn “có mới”. (§6.20)

### TabBar

Prop: `Layout` (Fixed · Scrollable)

- **do** — Fixed cho 2–4 tab nhãn ngắn (chia đều); Scrollable cho ≥ 5 tab hoặc nhãn dài. (§6.20)
- **must** — Viền dưới 1px border-muted chạy suốt, gạch Active đè lên viền. (§6.20)
- **must** — Web: role="tablist", mũi tên trái/phải chuyển tab. (§6.20)
- **must** — Scrollable: tab Active tự cuộn vào tầm nhìn. (§6.20)
- **dont** — Không có TabBar trên nền tối. (§6.20)

### Pagination

Prop: `Position` (Begin · Middle · End)

- **do** — Hàng gạch chỉ vị trí trong băng chuyền — không phải chấm tròn. (§6.10b)
- **must** — Chỉ ba vị trí Begin/Middle/End với đúng năm gạch, kể cả khi có hơn 5 trang. (§6.10b)
- **must** — Bề rộng là tín hiệu chính (24 vs 16), màu chỉ phụ. (§6.10b)
- **dont** — Gạch không active dùng overlay, không dùng màu nền thương hiệu; 🔒Base/Slick không dùng riêng. (§6.10b)

### Toast

Prop: `Type` (Neutral · Negative · Positive · Warning)

- **do** — Báo kết quả việc người dùng vừa làm, ở đáy, có Type. (§6.31)
- **must** — Độ sáng nền quyết định cả ba phần tử: Warning (nền sáng) → content, nút Action, nút đóng đều Inverted=False; ba type kia Inverted=True. (§6.6)
- **must** — Content dùng object-on-{status}; style body 400, không phải label. (§6.6)
- **dont** — Không dùng Toast cho lỗi chặn luồng hay lỗi nhập (sai mã OTP, checkbox bắt buộc) — Toast tự tắt. (§6.3f)
- **do** — Lỗi sửa được ngay → Dialog / Toast, không phải màn lỗi. (§6.19)

### Badge

Prop: `Tone` (Neutral · Success · Warning · Error)

- **do** — Nhãn trạng thái dạng viên thuốc, không bấm được. (§6.14)
- **must** — background-{status} chỉ đi với object-on-{status}. (§6.14)
- **must** — Icon 16 fill luôn hiện trước chữ, theo tone: Neutral circle-info · Success circle-check · Warning circle-warning · Error triangle-warning. (§6.14)
- **dont** — Không có state (hover/pressed/disabled) — không phải control. (§6.14)
- **dont** — Không có size khác 24, không có Highlight, không tắt được icon. (§6.14)

### StatusIndicator

Prop: `Tone` (Neutral · Success · Warning · Error · Highlight), `Container` (None · Filled)

- **must** — Container=None: chấm object-{tone}, chữ luôn object-primary (warning chỉ là chấm). (§6.15)
- **must** — Chấm nhấp nháy (opacity 1 → 0.3, 1.6s); đứng yên khi người dùng bật giảm chuyển động. (§6.15)
- **do** — Highlight cho “mục này đáng chú ý” (Mới, Nổi bật, Đề xuất), dùng họ accent. (§6.15)
- **dont** — Đừng dùng Highlight để báo lỗi (Error) hay “có mới chưa xem” (NotificationBadge). (§6.15)
- **dont** — Không có state — không phải control. (§6.15)

### CardPushNotification

- **do** — Báo chuyện từ bên ngoài (đơn đổi trạng thái, quà, tin nhắn), trượt từ đỉnh; khác Toast báo kết quả thao tác. (§6.31)
- **dont** — Không có type, không có nút: bấm cả thẻ để mở, vuốt lên để đóng. (§6.31)
- **must** — Tự ẩn sau 5 giây, dừng đếm khi đang chạm / hover. (§6.31)
- **must** — Một thẻ mỗi lúc — thẻ mới thay thẻ cũ. (§6.31)
- **must** — Web: role="status", aria-live="polite". (§6.31)
- **do** — Title và Content tối đa 2 dòng; ảnh nguồn 48 ẩn được. (§6.31)
- **must** — Desktop: góc trên phải, cách mép trên và phải 16, rộng 360 (size-90); dừng đếm khi hover. (§6.31)
- **dont** — Không có nút đóng, thời gian nhận hay xếp chồng thẻ. (§6.31)

### NotificationBadge

Prop: `Content` (Count · Dot)

- **do** — Chấm/số báo có mới chưa xem, đặt lên góc icon hoặc tab. (§6.16)
- **must** — Dùng họ attention — không negative, không warning, không accent. (§6.16)
- **dont** — Nền attention là rose-600 (chữ trắng 4.70): đừng đổi sang red-600, sẽ trùng màu negative. (§2.3)
- **dont** — Đừng tự chế thêm variant; màn tự đặt vị trí neo. (§6.16)

### Tooltip

Prop: `Placement` (Bottom · Left · Right · Top)

- **do** — Nhãn ngắn giải thích phần tử khi hover hoặc focus — thường cho IconButton không chữ hay SideNav thu gọn. (§6.30)
- **dont** — Chỉ chữ thuần — không link / nút bên trong (cần thì dùng Popover). (§6.30)
- **must** — Hiện khi hover và cả focus bàn phím. (§6.30)
- **dont** — Không dùng trên màn chạm — không có hover. (§6.30)
- **must** — Mặc định aria-describedby; khi tooltip là tên của phần tử chỉ có icon → aria-labelledby (relation='label'). (§6.30)
- **must** — Hover hiện sau 500 ms, focus bàn phím hiện ngay; rời / mất focus / Esc ẩn ngay, không mờ dần. (§6.30)
- **dont** — Không có tooltip nhiều dòng có tiêu đề — dùng Popover. (§6.30)

### TableHeaderCell

Prop: `Align` (Left · Right), `Sort` (Off · Unsorted · Ascending · Descending), `State` (Default · Hover · Pressed), `Type` (Default · Checkbox)

- **must** — Cột số Align=Right: icon sắp xếp đứng trước nhãn, dồn phải. (§6.23)
- **must** — Hover/Pressed chỉ ở cột sắp được (Sort≠Off); Sort=Off không icon, không state. (§6.23)
- **must** — Nhãn object-secondary; object-primary khi Ascending / Descending. (§6.23)
- **must** — Chiều cao và padding qua biến density (table/header-height, table/cell-padding-x). (§6.23)
- **must** — Cột chọn hàng: TableHeaderCell Type=Checkbox rộng 64 — Checked khi chọn hết trang đang xem, Indeterminate khi một phần. (§6.23)
- **chưa có** — cột cố định khi cuộn ngang, hàng mở rộng, sửa trực tiếp trong ô, kéo đổi thứ tự cột, hàng rỗng / đang tải, mật độ thứ ba. Cột cố định, hàng mở rộng, sửa trong ô, kéo đổi cột để sau — chỉ làm khi có màn quản trị cần

### TableCell

Prop: `Type` (Text · Number · Secondary · Actions · Checkbox · Status), `State` (Default · Hover · Selected)

- **must** — Hover / Selected là trạng thái của cả hàng — mọi ô trong hàng cùng State. (§6.23)
- **must** — Cột số căn phải cả tiêu đề lẫn ô, tabular-nums. (§6.23)
- **dont** — Hành động theo dòng không bao giờ Solid; hai hành động trở lên → một Ghost Small, còn lại vào menu “⋯”. (§6.23)
- **dont** — Bảng không viền ngoài, không kẻ dọc — chỉ viền dưới mỗi ô. (§6.23)
- **do** — Bảng dùng cho desktop / dashboard (density Compact); Selected nền background-interactive-muted. (§6.23)
- **do** — Bảng rỗng dùng EmptySection đặt trong thân bảng. (§6.19)
- **do** — Cột trạng thái dùng TableCell Type=Status chứa StatusIndicator, không tự đặt indicator vào ô Text. (§6.23)
- **chưa có** — cột cố định khi cuộn ngang, hàng mở rộng, sửa trực tiếp trong ô, kéo đổi thứ tự cột, hàng rỗng / đang tải, mật độ thứ ba. Cột cố định, hàng mở rộng, sửa trong ô, kéo đổi cột để sau — chỉ làm khi có màn quản trị cần

### KPICard

Prop: `Trend` (Up · Down · [No trend]), `Polarity` (Normal · Inverse)

- **do** — Thẻ một con số chính trên dashboard. (§6.26)
- **must** — Polarity=Normal: Up object-positive, Down object-negative (màu theo chiều số). (§6.26)
- **do** — Chỉ số tăng là xấu (chi phí, tỉ lệ huỷ) → Polarity=Inverse: Up tô negative, Down tô positive; icon vẫn theo chiều số. (§6.26)
- **must** — Value heading-base tabular-nums; Trend=[No trend] không có Delta. (§6.26)
- **must** — Thẻ bấm được (Interactive): chevron-right 16 cuối hàng Label, state layer 5/10 phủ cả thẻ; cả thẻ là một link, không nút khác bên trong. (§6.26)
- **chưa có** — biểu đồ nhỏ (sparkline) trong thẻ — để sau

### CardSheet

Prop: `Navigation` (Close · Back), `Height` (Fit · Full)

- **must** — Back và Close loại trừ nhau: sheet gốc Navigation=Close, sheet con Navigation=Back (không có nút đóng). (§6.8)
- **do** — Code: truyền onBack là Navigation=Back; không truyền là Close. (§6.8)
- **must** — Nhóm nút là ButtonGroup (§6.9), không frame tự dựng; nút phụ và hướng xếp chỉnh trên instance ButtonGroup. (§6.8)
- **must** — Bo cả bốn góc radius 24 — sheet nổi cách mép 12. (§6.8)
- **do** — Có tiêu đề qua prop Header; CTA ẩn/hiện toàn bộ nhóm nút. (§6.10)
- **do** — Sheet kéo được: Handle 32×4 rounded-circle nền border ở đỉnh; hai nấc Height=Fit / Full. (§6.8)
- **must** — Kéo xuống ở Fit quá 1/3 → đóng; ở Full → về Fit; không có Handle thì không kéo được. (§6.8)

### CardDialog

Prop: `Banner` (False · True)

- **must** — Không có tiêu đề — mọi nội dung (kể cả tiêu đề) nằm trong Slot; header chỉ chứa nút đóng căn phải. (§6.10)
- **must** — Banner=True: ảnh tỉ lệ 16:9 duy nhất, là nội dung nên cần alt. (§6.10)
- **must** — Nút đóng đè lên ảnh dùng IconButtonNeutral Solid Small — nút viền sẽ chìm. (§6.10)
- **must** — Nhóm nút là ButtonGroup (§6.9). (§6.10)
- **dont** — Dialog không xếp tầng — không có nút quay lại. (§6.10)

### SideSheet

Prop: `Type` (Standard · Modal), `Width` (Base · Wide)

- **do** — Tấm trượt từ mép phải màn desktop để xem / sửa chi tiết mà không rời trang. (§6.28)
- **do** — Standard nằm cạnh nội dung, viền trái, không scrim; Modal có elevation-high, bo hai góc trái, scrim như Sheet. (§6.28)
- **must** — Footer: TextButtonNeutral Outline Base + TextButtonAccent Solid Base, dồn phải, gap 12. (§6.28)
- **dont** — Không dùng SideSheet trên app — dùng Sheet. (§6.28)
- **do** — Width=Wide (480) cho form dài / nhiều cột; mặc định Base 384. (§6.28)
- **dont** — Không có side sheet bên trái, không kéo đổi bề rộng. (§6.28)

### Popover

- **do** — Khung nổi neo vào phần tử, chứa nội dung tương tác (form ngắn, xác nhận nhỏ). (§6.29)
- **must** — Mở bằng bấm; đóng bằng nút đóng / Esc / bấm ra ngoài. (§6.29)
- **must** — Footer dồn phải gap 8: TextButtonNeutral Ghost Small + TextButtonAccent Solid Small. (§6.29)
- **dont** — Không dùng Popover cho danh sách lựa chọn (đó là Menu) hay chữ giải thích khi hover (đó là Tooltip). (§6.29)
- **must** — Neo dưới phần tử, canh trái; thiếu chỗ thì lật lên, sát mép phải thì canh phải. (§6.29)
- **dont** — Không có mũi tên — Popover tách lớp bằng elevation. (§6.29)

### EmptySection

- **do** — Một khối trong màn chưa có dữ liệu (danh sách rỗng, bảng rỗng), kể cả trong thân bảng. (§6.19)
- **must** — Một nút, ẩn được bằng Action. (§6.19)
- **must** — Title heading-sm (nhỏ hơn màn), căn giữa; ảnh tròn 128 nền background-accent-muted, cần alt. (§6.19)

### ErrorSection

- **do** — Lỗi chỉ ở một khối, phần còn lại của màn vẫn dùng được. (§6.19)
- **must** — Một nút thử lại. (§6.19)
- **must** — Title heading-sm căn giữa; ảnh tròn 128 nền background-accent-muted, cần alt. (§6.19)

### ListItem

Prop: `State` (Default · Hover · Pressed · Disabled)


### Sheet

- **must** — Là template màn hình, không phải component sản phẩm — khi code dựng lại scrim + wrapper, bỏ home indicator. (§6.8)
- **must** — Scrim overlay (đen 10%) + overlay-blur 16; đừng nhân thêm opacity lên fill. (§6.8)
- **must** — Wrapper padding 0/12/12/12: sheet thụt 12 mỗi bên và nổi cách đáy 12. (§6.8)
- **do** — Trên app dùng Sheet, không dùng SideSheet. (§6.28)

### Dialog

- **must** — Là template màn hình — khi code dựng theo CardDialog và tự làm scrim. (§6.10)
- **must** — Panel căn giữa theo chiều dọc (khác Bottom sheet sát đáy). (§6.10)
- **must** — Scrim overlay + overlay-blur 16, panel thụt 12 mỗi bên; đừng nhân thêm opacity lên fill. (§6.10)
- **do** — Xác nhận hành động phá huỷ bằng Dialog có TextButtonDanger Solid. (§6.1)

### ResultScreen

- **do** — Việc đã xong, người dùng phải sang chỗ khác. (§6.19)
- **must** — Footer là ButtonGroup dọc — nút chính trên, lối đi phụ dưới. (§6.19)
- **must** — NavigationBar Back action=false. (§6.19)
- **do** — Có component code ResultScreen / UuResultScreen (Body + Footer; NavigationBar do màn đặt); ảnh ô vuông không nền, cần alt. (§6.19)

### ErrorScreen

- **do** — Lỗi chặn cả chức năng cốt lõi, không tự khắc phục được; lỗi một khối dùng ErrorSection, lỗi sửa được ngay dùng Dialog / Toast. (§6.19)
- **must** — Đúng một nút: thử lại. (§6.19)
- **must** — NavigationBar Back action=false. (§6.19)
- **must** — Ảnh minh hoạ ô tròn 128 nền background-accent-muted, cần alt. (§6.19)
- **do** — Có component code ErrorScreen / UuErrorScreen nhận đúng một nút thử lại. (§6.19)

### EmptyScreen

- **do** — Cả màn chưa có dữ liệu. (§6.19)
- **must** — Một nút hành động (tạo mới, khám phá), ẩn được bằng Action. (§6.19)
- **must** — Có nút back (Back action=true) — màn rỗng vẫn là màn bình thường. (§6.19)
- **must** — Ảnh minh hoạ ô tròn 128 nền background-accent-muted, cần alt. (§6.19)

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
