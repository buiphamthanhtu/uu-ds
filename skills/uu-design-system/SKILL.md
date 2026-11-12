---
name: uu-design-system
description: Build UI with UU Design system (UU DS). Use when the user asks to build, prototype, mock up, or code a screen, page, component, or flow with UU DS, or mentions "UU DS", "ÚÙ Design system", "UU Design system", "UU Design System", "UU icon", or asks whether something matches UU DS. Supplies the exact tokens, state-layer interaction model, and component specs, and prevents inventing components that do not exist. Only for products built on UU DS; projects with their own design system should use that system instead.
---

# UU DS — build UI đúng chuẩn

**UU Design system** (UU DS). Skill này chứa spec đầy đủ và token sẵn sàng dùng.

## Bắt đầu

1. Đọc `references/design-system.md` — spec đầy đủ. Đọc hết mục 0 đến 6 trước khi viết dòng code đầu tiên.
2. Import `references/tokens.css` vào project. Mọi giá trị lấy từ đây.
3. Nếu dự án dùng Tailwind, merge thêm `references/tailwind.js`. Nếu không, bỏ qua.
4. `references/tokens.json` chỉ cần khi phải sinh token sang nền tảng khác (iOS, Android, Style Dictionary).
5. Cần icon thì đọc `references/icons.md`: bộ **UU icon**, tra tên ở `references/uu-icon-index.json`, SVG lấy bằng `python3 scripts/icon.py <name> [fill]` (bundle `assets/icons/<category>.json`). 22 icon công khai (`public: true`: icon component dùng cố định + `texture`) chỉ để component chạy và làm ví dụ, không phải bộ icon của sản phẩm. Sản phẩm cần icon thì gắn **một bộ** qua DNA (spec 4.3): miễn phí như Lucide, hoặc mua Nucleo. Không tự vẽ icon, không nhặt icon lẻ từ bộ khác. Icon minh hoạ trong ví dụ dùng `texture`.
6. Cần biết một component **nối với** gì — dùng token nào, dựng từ component nào, dễ nhầm với cái nào, chọn khi nào — đọc bản đồ hệ thống (ontology): `references/ontology.md` (tóm tắt) hoặc tra `references/ontology.json` (`nodes` + `edges`). Không có trong ontology = chưa chốt → hỏi.
7. Dựng cả màn hay cả luồng thì lấy khung theo thứ tự: màn mẫu của sản phẩm (mục 8 của `DNA.md`, xem *Dựng theo màn mẫu*) → khung gần nhất trong `references/recipes.md` → tự chọn component theo ontology và nói rõ khung là tự dựng. Chép khung rồi mới thay nội dung.

## UU DS và DNA của sản phẩm

UU DS là bộ xương. Style riêng của từng sản phẩm nằm ở một file **DNA**, không nằm trong component.

Tìm `DNA.md` trước khi dựng: đường dẫn người dùng đưa, rồi gốc project, rồi `docs/DNA.md`. Không thấy thì hỏi một lần trước màn đầu tiên: có DNA hoặc màn mẫu không (link Figma, code / prototype, ảnh chụp hoặc website).

- **Có DNA:** đọc `references/product-dna.md` và áp theo file đó. DNA thay mặc định, không thay phần khoá.
- **Có màn mẫu:** trích thành `DNA.md` theo mục *Trích DNA* rồi áp. Màn mới dựng theo mục *Dựng theo màn mẫu* (Figma, canvas hay code đều vậy).
- **Không có, hoặc không hỏi được:** build Basic bằng brand Default, không tự chế style. Báo một dòng khi bàn giao.
- **Người dùng nhờ trích DNA:** làm theo mục *Trích DNA* trong `references/product-dna.md`, dùng khuôn `assets/dna-template.md`.

## Năm ràng buộc không được vi phạm

**1. Không hardcode màu.** Luôn dùng token semantic: `var(--background-interactive)`, `var(--object-primary)`. Không viết hex, không viết `#4F46E5`. Token semantic trỏ về primitive, primitive mới là hex. Hardcode = sai spec.

Không primitive nào mang sẵn alpha. Cần màu mờ thì compose từ primitive đặc — `color-mix(in srgb, var(--color-black) 10%, transparent)` — đúng như `overlay` và `background-transparent` đang làm. Đừng thêm primitive kiểu `black-10`.

**Và dùng đúng TẦNG, không chỉ đúng màu.** `var(--color-red-400)` với
`var(--background-accent-emphasized)` cùng ra `#F87171`, nên nhìn không phân biệt được
và mọi phép kiểm "cấm hex" đều cho qua. Nhưng primitive là một **bậc trên thang màu**,
semantic là một **vai trò**. Viết primitive vào component là cắt đứt sợi dây giữa hai
tầng: đổi brand mode không theo, và bản đặc tả cho dev nhả ra `--color-red-400` thì
người dựng đi tra vai trò đó trong design system sẽ tra không ra.

Luật: `--color-*` chỉ được xuất hiện trong **định nghĩa token semantic**, không xuất
hiện trong component. Chỗ nào cần một màu mà không có token semantic đúng vai trò thì
**thêm token vào UU DS trước**, đừng với xuống tầng primitive cho nhanh.

**2. Brand mode.** UU DS có **hai** brand mode: **Default** (`:root` — interactive indigo, accent blue, nền slate) và **UU** (`data-theme="uu"` — nền nút orange-500 với chữ **đen**, chữ/link orange-700, accent vàng amber, nền neutral; theo nhận diện Ú Ù). Màu thương hiệu gói trong 22 token; chữ trên nút luôn là `object-on-interactive`, đừng gõ trắng. Màu thương hiệu nằm gọn trong 22 token (spec 2.5); thêm brand là thêm một khối `[data-theme="<tên>"]` ghi đè đúng nhóm đó. Component **không được** biết mình đang ở brand nào — nếu phải viết `if (brand === …)` thì đang làm sai.

**Màu thương hiệu UU** (đã chốt, theo file Figma UU DLS): `interactive` = ramp `indigo` (`indigo-600` `#4F46E5`, 6.29:1 trên trắng), `accent` = ramp `blue` (`blue-600`, 5.17), nền và viền trung tính = ramp `slate`. Khi chốt màu UU chỉ đổi nhóm token thương hiệu rồi đo lại contrast ở spec 2.3.

Cẩn thận chỗ này: `accent` (Default: blue · UU: amber) và `interactive` (Default: indigo · UU: orange) là **hai vai khác nhau** — `interactive` cho thứ bấm được (nút, link, field focus, tab, item đang chọn), `accent` cho chỗ nhấn nội dung (con trỏ nhập). Đừng lấy token `accent` cho thứ bấm được chỉ vì màu trông hợp, và ngược lại. Họ status: `positive` · `negative` · `warning` · `attention` (không đổi theo brand); tên variant Figma vẫn `Success`/`Error` và prop code giữ theo variant. `object-warning` là `yellow-500` (1.92 trên trắng) — chỉ dùng cho chấm/icon kèm chữ.

**3. Hover và Pressed đi qua state layer, không đổi màu.** Đây là cơ chế trung tâm. Phủ một lớp `::after` full-bleed tô bằng **màu object của variant** (`background: currentColor`), `border-radius: inherit`, đổi `opacity`:

- Độ đậm theo **loại nền**, không theo màu chữ: nền đặc màu (`Solid` Accent / Neutral) → hover `--opacity-20`, pressed `--opacity-40`
- Nền sáng / trong suốt (`Outline`, `Ghost`, `Solid` `Inverted`) → hover `--opacity-5`, pressed `--opacity-10`
- `Outline` / `Ghost` `Inverted` trên nền tối → 20/40
- Ngoại lệ `Radio` (§6.0, §6.3d): đã chọn 20/40 dù nền vòng sáng; chưa chọn hover `object-secondary` 5%, pressed `object-primary` 10%
- `Disabled` và `Loading` không có state layer
- State layer là **toàn bộ** hiệu ứng. Không đổi nền, không đổi màu chữ, không đổi font-weight

Fill là **màu object của variant** (token `object-*` của chữ / icon) — CSS viết `currentColor`, từ khoá chuẩn lấy giá trị `color` của phần tử; map chính xác vì fill của state layer luôn trùng màu object. Một rule chạy đúng cả 144 variant — đã audit. Class `.uu-interactive`, `.uu-on-dark`, `.uu-on-light` có sẵn trong `tokens.css`.

Đừng nhầm với typography mode `Active`: mode đó làm chữ đậm thêm 1 bậc và **chỉ** dùng cho trạng thái đang được chọn của hai component — Toggle button `Active=True` và Segment item `Active=True` — không liên quan gì tới hover hay pressed của button.

Font body là font hệ thống, nên bề rộng chữ khác nhau giữa iOS và các bộ font Android. Đừng hardcode width cho component hug width. Line-height là giá trị tuyệt đối, không phải bội số: app dùng logical px, web dùng **rem** như mọi token kích thước (spec §4 *Đơn vị theo nền tảng*). Web: đừng viết px hay rem rời trong component — luôn `var(--token)`.

Viền có **hai thang**: thang xám (`border-muted` / `border` / `border-emphasized`) không đổi theo brand, dùng cho control; thang thương hiệu (Default `border-subtle` = blue-200, `border-medium` = blue-300; UU = amber-200 / 300) đổi theo brand, dùng cho khối có nền tint. Đừng lấy thang thương hiệu viền ô nhập.

**Density** (spec §4.1): `Touch` mặc định (app) · `Compact` desktop — web bật bằng `data-density="compact"`, Flutter `uuThemeData(density: UuDensity.compact)`, React Native `<UuProvider density="compact">`. Component đọc biến density (`--control-height-*`, `--field-height`, `--selection-size`, `--text-<style>-font-size`…), không gõ cứng 24/32/40/48/56px, không đọc thẳng `--font-size-*`. Đừng dùng Compact cho màn chạm.

**4. Chỉ dùng thang có sẵn.** Spacing lấy từ `gap-*` (bước 4px). Radius từ `radius-*`. Font size từ 11 bậc đã định. Không chế giá trị mới, không dùng số lẻ. Ngoại lệ duy nhất: giá trị khai trong khối theme của DNA; component và màn vẫn đọc qua `var(--token)`.

**6. Icon gọi qua một component, từ một bộ** (`references/icons.md`): `Icon(name, variant, size)`, SVG `currentColor`, màu từ token `object-*` của phần tử chứa. 22 UU icon công khai chỉ để component chạy và làm ví dụ. Sản phẩm cần icon thì gắn một bộ qua DNA (miễn phí như Lucide, hoặc mua Nucleo), đăng ký qua `IconProvider` / `UuProvider icons` (spec 4.3), dùng cả bộ, không trộn icon lẻ của hai bộ trên cùng màn. DNA chưa khai bộ mà cần icon ngoài 22 cái → hỏi người dùng chọn bộ nào, trong lúc chờ dùng `texture`. Tên icon không mang màu hay trạng thái (`-white`, `-active` là sai); trạng thái bật dùng variant `fill` (bộ không có kiểu fill thì dùng lại outline).

**5. Chỉ build component có trong mục 5 của spec.** Tên CamelCase: `TextButtonAccent` / `TextButtonNeutral` / `TextButtonDanger` (phá huỷ), `IconButtonAccent` / `IconButtonNeutral`, `ToggleButton`, `SegmentedControl`, `TextInput`, `TextArea`, `SearchInput`, `OTPInput` (có `Masked`), `DateInput`, `Dropdown`, `Checkbox` + `CheckboxInput`, `Radio` + `RadioInput`, `Switch`, `Chip`, `NavigationBar`, `BottomBar`, `Pagination`, `Tab`, `Menu`, `Toast`, `Badge`, `StatusIndicator`, `NotificationBadge`, `ListItem` + `ListGroup`, `ButtonGroup`, Bottom sheet (`CardSheet` + template `Sheet`), Dialog (`.base/dialog` + template `Dialog`), hai template màn `ResultScreen` · `ErrorScreen`; desktop/dashboard: `TableHeaderCell` · `TableCell`, `TablePagination`, `KPICard`, `Breadcrumb`, `SideNav`, `SideSheet`, `Popover`, `Tooltip`. Ngoài danh sách này là chưa chốt.

## Trước khi giao

Nhìn kết quả như một designer khó tính nhất: người chụp đúng một chỗ sai rồi gửi lại hỏi "cái gì đây?". Nếu hình dung ra được tấm ảnh đó thì đó là việc cần sửa tiếp. Sửa chỗ lớn nhất trước: bố cục, rồi thứ bậc, rồi tương tác, rồi chi tiết.

Những lỗi hay quay lại, kiểm từng dòng:

- **Prop hoặc variant không có thật.** `ButtonGroup` chỉ có `Tone=Default` · `Danger`, không có `Accent`. Figma bỏ qua giá trị sai mà không báo lỗi, và bỏ luôn các prop đi cùng trong lệnh đó. Tra đúng tên ở spec mục 6.
- **Còn chữ mặc định.** "Action", "Content", "Header", "Data" còn trên màn là chưa xong.
- **Slot trống.** `CardDialog` và `CardSheet` không có nội dung là chưa xong.
- **Hai nút `Solid` trên một màn.** Một nút chính, còn lại nhẹ hơn (§6.1).
- **Tự xếp hai nút.** Cặp nút dùng `ButtonGroup`, không ghép tay (§6.9).
- **Nhãn dài bị cắt trong `ButtonGroup` ngang.** Chuyển `Layout=Vertical`.
- **`Danger` cho việc hoàn tác được.** Đăng xuất là `Neutral` (§6.1).
- **Lỗi nhập liệu trong `Toast`.** Lỗi nằm dưới ô gây ra lỗi, vì Toast tự tắt còn lỗi thì chưa hết (§6.3f).
- **Nút ghi "OK", lỗi ghi "Không hợp lệ".** Nút nói việc sẽ xảy ra. Lỗi nói cách sửa.
- **Back và Close cùng hiện trên sheet.** Hai nút này loại trừ nhau (§6.8).
- **`accent` cho thứ bấm được.** Thứ bấm được dùng `interactive` (ràng buộc 2).
- **Hover đổi màu nền.** Hiệu ứng chỉ đi qua state layer (ràng buộc 3).
- **`--color-*` trong component.** Màu đúng nhưng sai tầng (ràng buộc 1).
- **Gõ cứng 32, 48, 56.** Component đọc biến density (ràng buộc 3, §4.1).
- **DNA nằm trong component.** Style sản phẩm khai ở khối theme, không `if (brand)`, không sửa CSS component.
- **Phóng icon cho đầy hộp.** Nét thật chỉ khoảng 60–65% hộp (§6.11).

Code web, project đã cài gói `uu-ds`: chạy `npx uu-ds-check src` và sửa đến khi critical = 0. Bộ chấm bắt phần máy kiểm được (hex, `--color-*`, token bịa, hover đổi màu, px ngoài thang, component/icon bịa); các dòng còn lại vẫn phải tự nhìn.

Không tự kiểm được dòng nào thì nói rõ dòng đó khi bàn giao.

## Số liệu tra nhanh

| Thứ | Giá trị |
|---|---|
| Button height | Large 56 · Base 48 · Small 32 — bo `rounded-4xl`, mặc định tròn hoàn toàn ở mọi cỡ; DNA đổi được token này |
| Toggle button | cùng size với button; `Active=True` đổi icon sang biến thể `fill` và chữ sang bold 700; không border, không shadow |
| Icon button | 56/48/32 vuông; icon 24 (L, Base) và 16 (Small); stroke outline 2px |
| Field (input, dropdown, date) | cao 48 · radius 16 · border 1px · padding ngang 12 · gap 8 |
| Ô "chọn" (Dropdown, DateInput) | gợi ý rỗng `body` 400 `object-secondary` · giá trị đã chọn: Dropdown **`label` 600**, DateInput **`body` 400** · icon phải `object-secondary` · đủ Hover/Error/Disabled |
| DateInput · Dropdown | `Value` Empty/Filled × `State` Default/Hover × Error × Disabled (8 variant mỗi bộ) · placeholder `Bấm để chọn` · DateInput hiển thị `DD/MM/YYYY` · icon `calendar-days` 24 / `chevron-down` 16 |
| SearchInput | dùng chung khung Text input (48 · radius 16 · viền 1px) · icon `magnifier` 24 `object-secondary` cố định bên trái · nút xoá `circle-xmark` 16 bên phải khi có chữ · **không có Error** · 7 variant |
| TextArea | Field VERTICAL cao 112 · padding 12 · bộ đếm `(n/100)` style `caption` góc phải dưới · state như Text input |
| OTPInput | 6 ô 48 · gap 8 · ô rỗng `-` · con trỏ 2×24 `object-accent` · `Masked=True` đổi chữ số thành chấm 8 · lỗi đỏ cả 6 ô + dòng lỗi căn giữa · Disabled nền `background-disabled` (14 variant) |
| Radio | 32 tròn · viền **2px** · chọn: nền trắng, viền `border-interactive`, chấm 20 `object-interactive` · state layer 5/10 khi chưa chọn, **20/40** khi đã chọn (ngoại lệ §6.0) · **Error**: viền `border-negative`, chấm `object-negative` · 10 variant |
| Checkbox | 32 vuông radius 12 · Default viền 2px `border-muted` · Checked nền `background-interactive` + `check` fill 20 · **Indeterminate** = vạch 16×2 bo tròn `object-on-interactive` · **Error** = viền `border-negative` / nền `background-negative` · **15 variant**: ô trống Hover viền `border-emphasized` + lớp 5% / Pressed 10%; ô đã chọn lớp `object-on-interactive` **20 / 40**; Disabled nền `background-disabled` |
| Chip | cao 32 · padding 4/12 · gap 8 · radius circle · viền 2px · chữ `label` 16/24 (y hệt TextButton Small) · chưa chọn: viền `border` chữ `object-primary` · đã chọn: nền `background-interactive-muted` viền `border-interactive`, chữ + icon **`object-interactive`**, `Type=Select` thêm `check` 16 fill trước chữ · `Type=Dropdown` thêm chevron 16 · 16 variant |
| Switch | rãnh 56×32 radius 16 viền 2px · núm tắt tròn **16** cách trái 8 `object-secondary` · núm bật tròn **28** nền trắng + `check` 16 `object-interactive`, cách phải 2 · rãnh bật `background-interactive` · state layer 5/10 khi tắt, 20/40 khi bật · 10 variant (có `Focus`) |
| SegmentedControl | vỏ `background-emphasized` radius 16 padding 4 gap 2 · item (`Active` × `State`, 8 variant): chọn = nền trắng radius 12 `elevation-low` chữ 700 (mode `Active`), thường = chữ `object-secondary` 600; hover/pressed lớp `object-primary` 5/10; disabled chữ `object-disabled`, item chọn nền `background-disabled` |
| Tab | hug × **48** · padding 12 bốn phía · chữ `title-base` 600 · Default `object-secondary`, Active `object-interactive` + gạch **32 × 4** `border-interactive` (cùng họ `interactive`, cùng đổi theo brand) canh giữa mép đáy (rộng CỐ ĐỊNH, không giãn theo chữ) · 2 variant |
| BottomBar | vỏ pill `background-surface` padding 4 gap 4 · mục min 64×40 padding 6/12 gap 4 · `Compact=False` vỏ FILL, mục FILL, nhãn `title-xs` 11/16 600, cao 64 · `Compact=True` hug, không nhãn, cao 48 · chọn: nền `background-interactive-muted`, icon `fill` + chữ `object-interactive`; thường: icon `outline` + chữ `object-secondary` · 2–5 mục · badge `NotificationBadge` neo góc icon, chỉ mục không chọn · 10 variant |
| Table | `TableHeaderCell` cao `table/header-height` 48 · `title-sm`, viền dưới `border-muted` · `TableCell` cao `table/row-height` 56 · padding ngang `table/cell-padding-x` 16 · Selected nền `background-interactive-muted` · hành động theo dòng `Ghost` Small, không bao giờ `Solid` |
| SideNav | rộng `sidenav/width` 288 · mục cao `control/height-base`, radius 8, Active nền `background-interactive-muted` · collection `sidenav` Expanded/Collapsed (73, ẩn nhãn) |
| Tooltip · Popover · SideSheet | Tooltip nền `background-inverted` chữ caption `object-primary-inverted`, max 240 · Popover 320, `card/padding`, `elevation-medium` · SideSheet 384, Standard (viền trái) / Modal (`elevation-high`) |
| Menu | Panel: V gap 4 · padding 12 · radius 24 · `elevation-low` · nền `background-surface`. Sheet: dùng lại `BottomSheet`. Hàng option cao **40** · padding 8 · gap 12 · radius 12 · chữ `body`; đã chọn = nền `background-accent-subtle` + chữ `object-interactive` + check 16 |
| Toast | cao 64 · radius 12 · `elevation-medium` |
| Badge | viên thuốc cao 24 · padding 4 trái / 8 phải · icon 16 `fill` luôn hiện trước chữ (Neutral `circle-info`, Success `circle-check`, Warning `circle-warning`, Error `triangle-warning`), gap 4 · chữ `title-sm` 600 · 4 tone: Neutral `background-inverted`, Success/Warning/Error `background-{status}` + `object-on-{status}` · không state |
| StatusIndicator | chấm 8 nhấp nháy (opacity 1 → 0.3, 1.6s, đứng yên khi giảm chuyển động) + chữ `title-sm`, gap 6 · `Container=None` (cao 20, chấm `object-{tone}`, chữ `object-primary`) hoặc `Filled` (cao 24, padding 2/8, viên thuốc `background-{tone}`, chấm và chữ `object-on-{tone}`) · Neutral dùng `object-secondary` / `background-inverted` + `object-on-dark` |
| NotificationBadge | `Count`: cao 16, min-width 16, padding ngang 4, chữ 11/16 600 `object-on-attention` trên `background-attention` · `Dot`: 8×8 · họ status `attention` = "có mới, chưa xem" (không phải `negative`/`warning`), chưa có ngưỡng 99+ |
| Bottom sheet | sát đáy · có tiêu đề · radius 24 cả 4 góc, thụt 12px mỗi bên · scrim `overlay` + blur 16 · sheet **con** bật `Back`: nút quay lại bên trái **thay** nút đóng, không bao giờ hiện cả hai |
| Dialog | căn giữa dọc · **không có tiêu đề**, nội dung vào Slot · cùng radius và scrim như Bottom sheet |
| ButtonGroup | ngang: phụ trái, chính phải · dọc: chính trên, phụ dưới · cả hai `flex: 1` chia đều |
| Icon | **hộp** 24 (Icon button L/Base, suffix, DateInput) hoặc 16 (Small, chevron Dropdown); 18 chỉ cho `.loading`. UU icon vẽ trên lưới 18 có lề nên **nét thật ≈ 60–65% hộp** (`xmark` 15px trong hộp 24) — đúng thiết kế, đừng phóng cho "vừa hộp", đừng thay bằng Lucide/FA. Xem `references/icons.md` |
| Font body | **font hệ thống của thiết bị** — bản thiết kế ghi `SF Pro` chỉ để render được, đừng nhúng nó. DNA của sản phẩm đổi được họ font (`font-family-body`, spec 4.3), cỡ và độ đậm giữ thang |
| Font display | Bungee (chỉ có Regular, `font-synthesis: none`), **chỉ** cho 4 style `display-*` |
| Frame width | 390 · 402 · 412 · 430 (mobile) · 1440 (desktop) |

## Khi gặp thứ không có trong spec

File spec chỉ chứa phần **đã chốt**. Nếu cần một component, state, hoặc token không có ở đó — **dừng lại và hỏi**, đừng suy đoán rồi build tiếp. Những thứ thường bị hỏi mà hiện chưa có: khu tài khoản cuối `SideNav` · `BottomBar`: Hover/Pressed của mục, vị trí thanh, vỏ trên nền trắng, nhãn dài · Bảng: hàng rỗng / đang tải; cột cố định, hàng mở rộng, sửa trong ô (để sau) · phân trang không biết tổng số dòng · sparkline trong `KPICard`. Đã có rồi, đừng hỏi lại: Text input `Error`, `TextArea`, `Checkbox` đủ 15 variant (có `Indeterminate` và `Error`), `Switch` đủ 10 variant, `Menu` (panel option của `Dropdown`), `SegmentedControl` item đủ Hover/Pressed/Disabled, OTP `Masked` và `Disabled`, `DateInput` và `Dropdown` đủ Hover/Error/Disabled, DateInput hiển thị `DD/MM/YYYY`, Toast đủ 4 type, `Badge` / `StatusIndicator` / `NotificationBadge`, `BottomBar` (2–5 mục, có badge), **nút phá huỷ `TextButtonDanger`**, bottom sheet có nút quay lại (`CardSheet` `Navigation=Back`), **bảng** (`TableHeaderCell` sắp xếp + Hover/Pressed, `TableCell` chọn hàng và hành động theo dòng), `TablePagination` có rút gọn "…", `KPICard`, `Breadcrumb`, `SideNav` (2 cấp, thu gọn), `SideSheet`, `Popover`, `Tooltip`, density `Compact` cho desktop, **Menu chọn nhiều** (`.MenuItem` `Type=Multiple` + footer Áp dụng), ô tìm nhanh, tiêu đề nhóm và vạch ngăn trong `Menu`, panel gợi ý / lịch sử + trạng thái đang tải + nút Huỷ của `SearchInput`, panel bung ra của `Chip` `Type=Dropdown`, `Tab` đủ Hover/Pressed/Disabled và hàng tab **`TabBar`** (Fixed / Scrollable), **`CardDialog`** (có ảnh banner 16:9), `EmptyScreen` / `EmptySection` / `ErrorSection`, **`CardPushNotification`**, `StatusIndicator` `Highlight`, nút hành động riêng của `BottomBar` (`FooterItemSpecial`), brand mode **UU**, trục `layout` Expanded/Collapsed, option `Menu` có mô tả hai dòng + hàng "Chọn tất cả" + neo / lật / cao tối đa 320, tab có icon / badge, `Chip` icon trước chữ + `Type=Input` (gỡ được), `ButtonGroup` `Tone=Danger`, xoá từng mục lịch sử `SearchInput`, `TableHeaderCell` `Type=Checkbox`, `TableCell` `Type=Status`, `Breadcrumb` rút gọn "…", `KPICard` `Polarity` + thẻ bấm được, `SideNav` chevron xoay / badge / nút thu-mở, `SideSheet` `Width=Wide` 480, `Popover` tự lật, `Tooltip` trễ 500 ms, `CardPushNotification` bản desktop, `CardSheet` kéo được (`Handle`, `Height=Fit/Full`), `ResultScreen` / `ErrorScreen` có component code, icon bên trái `TextButton` (`Prefix`), DNA đổi `font-family-body` + viền ngoài + bóng control (`border-outer-width` · `border-outer`, `elevation-none`) + bộ icon riêng, **hàng danh sách `ListItem` + `ListGroup`** (§6.32; hàng switch + nhãn là `ListItem` Trailing `Switch`), Toast nổi trên `BottomBar` / bàn phím, dòng gợi ý `Helper text` (dưới label, trên ô) của `TextInput` / `TextArea`, bottom sheet giữa màn ở density `Compact` (rộng tối đa 480) + tránh bàn phím, viền ngoài của thẻ (`border-outer-*`), bật viền ngoài thì bỏ viền trong ở trạng thái thường.

Đã quyết **không làm** — trả lời là không hỗ trợ, đừng hỏi lại: `TextButtonDanger` trên nền tối, `IconButton` kiểu Danger, cỡ nhỏ riêng của `SearchInput` / `Switch` / `Chip` (dùng density `Compact`), chữ On/Off trong `Switch`, ô nhập số trang, icon trước mục đầu `Breadcrumb`, `SideNav` cấp 3, `TabBar` nền tối, nút đóng / thời gian / xếp chồng của push, tooltip có tiêu đề (dùng `Popover`), mũi tên `Popover`, `SideSheet` bên trái / kéo rộng.

Nếu người dùng bảo "cứ làm tạm đi" thì làm, nhưng nói rõ phần nào là tự chế để họ biết đường review.

## Không thuộc design system

`Device elements` (status bar, keyboard iOS/Android, home indicator, browser chrome, alert Face ID/Touch ID) và `.Mini App Control` chỉ là chrome để dựng mockup bối cảnh. `.Mini App Control` là UI của nền tảng mini app (ví dụ Zalo). Đừng token hoá, đừng coi là component sản phẩm, đừng đưa vào component library.
