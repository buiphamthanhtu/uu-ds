# Product DNA

UU DS là bộ xương: component, cấu trúc, tương tác, khả năng tiếp cận. **DNA** là phần da thịt của một sản phẩm: màu, bo góc, đổ bóng, nền, lề, nhịp bố cục.

| Chế độ | Khi nào | Kết quả |
|---|---|---|
| **Có DNA** | Tìm thấy file DNA | UI đúng UU DS và mang chất riêng của sản phẩm |
| **Basic** | Không có file DNA | UI đúng UU DS, dùng brand Default và mặc định của hệ thống |

## Tìm file

Theo thứ tự:

1. Đường dẫn người dùng đưa.
2. `DNA.md` ở gốc project.
3. `docs/DNA.md`.

Không thấy thì hỏi một lần trong phiên, trước màn đầu tiên: có DNA hoặc style anchor không. Style anchor là thứ để bám phong cách: ảnh chụp hoặc website.

- Người dùng đưa style anchor: trích thành `DNA.md` theo mục *Trích DNA* rồi áp.
- Người dùng nói không có, hoặc đang chạy tự động không hỏi được: build Basic và báo một dòng khi bàn giao.

Đừng tự chế chất riêng.

## Thứ tự ưu tiên

**Phần khoá của UU DS → DNA → mặc định của UU DS.** DNA chỉ thay mặc định, không thay phần khoá. Hai bên đụng nhau thì giữ phần khoá và báo cho người dùng.

| Khoá, DNA không đổi | DNA được đổi |
|---|---|
| Danh sách component, tên, prop, cấu trúc | 23 token thương hiệu |
| State layer | `radius-sm` · `radius-base` · `radius-lg` · `radius-xl` |
| Chiều cao control, density | `rounded-2xl` · `rounded-3xl` · `rounded-4xl` (nút, chip) |
| Radio, Switch, chấm tròn, vỏ `BottomBar` (`rounded-circle`) | `elevation-low` · `elevation-medium` · `elevation-high` · `elevation-none` (bóng của control, mặc định không có) |
| Token status, `object-primary`, thang xám | `font-family-display` · `font-family-body` (chỉ họ font) |
| Cỡ chữ, line-height, font-weight của text style | `border-outer-width` · `border-outer` (viền ngoài của control và thẻ, mặc định không có) |
| Thứ tự nút trong `ButtonGroup` | Biến `--dna-*` cho nền và bố cục |
| Hộp icon 24 / 16 / 18, luật bật = `fill` | Bộ icon (gói chỉ kèm icon cho component; sản phẩm đăng ký bộ riêng, spec 4.3) |
| | Kiểu ảnh, minh hoạ, giọng văn |
| Vai trò của token: `interactive` cho thứ bấm được, `accent` cho chỗ nhấn | Lề, khoảng cách giữa các khối, bề rộng nội dung |
| Contrast theo spec 2.3 | |

## Áp vào web

Đổi trong một khối theme, đặt trên `<html>`. Component không đổi dòng nào.

```css
[data-theme="ten-san-pham"] {
  /* 23 token thương hiệu */
  --background-interactive: var(--color-…);

  /* Hình khối */
  --radius-lg: 0.5rem;
  --rounded-4xl: var(--radius-sm); /* nút và chip */
  --elevation-medium: 0 12px 32px rgba(0, 0, 0, 0.08);

  /* Chữ và control */
  --font-family-body: "Inter", system-ui, sans-serif;  /* app tự nạp font */
  --border-outer-width: 2px;                               /* viền ngoài control + thẻ, mặc định 0 */
  --elevation-none: 2px 2px 0 2px var(--object-primary);   /* bóng cứng của control; spread = độ dày viền, không thì bị viền che */

  /* Nền và bố cục */
  --dna-page-background: linear-gradient(180deg, var(--background-muted), var(--background-surface));
  --dna-page-margin: var(--gap-8);
  --dna-section-gap: var(--gap-12);
}
```

**Nhiều chế độ màu** (spec 4.3): phần dùng chung khai một lần, mỗi chế độ chỉ khai lại token thương hiệu.

```css
[data-theme^="ten-san-pham-"] {          /* dùng chung: font, viền ngoài, bo góc, --dna-* */
  --font-family-body: "Inter", system-ui, sans-serif;
  --border-outer-width: 2px;
}
[data-theme="ten-san-pham-xanh"] { --background-interactive: var(--color-…); --object-on-interactive: var(--color-…); }
[data-theme="ten-san-pham-do"]   { --background-interactive: var(--color-…); --object-on-interactive: var(--color-…); }
```

```tsx
// React Native: giữ phần dùng chung, chỉ thay màu theo chế độ
const dna = useMemo(() => ({ ...shared, colors: modes[mode] }), [mode]);
<UuProvider dna={dna}>…</UuProvider>
```

Phần layout của màn đọc `--dna-*` kèm giá trị dự phòng. Nhờ vậy cùng một code chạy được ở cả hai chế độ:

```css
.page {
  background: var(--dna-page-background, var(--background-muted));
  padding-inline: var(--dna-page-margin, var(--gap-4));
}
```

- **Giá trị ngoài thang** chỉ được khai trong khối theme này. Component và màn vẫn đọc `var(--token)`, không gõ số rời.
- **`--dna-*` chỉ dùng ở layout của màn**, không dùng trong component.
- **Vùng con:** đổi màu chỉ cần `data-theme` trên khung chứa. Đổi bo góc thì đặt thêm `data-density` lên cùng khung đó, vì `--field-radius` tính sẵn ở nơi khai `data-density`.
- **React Native:** `<UuProvider dna={{ colors, radius, elevation, fontFamily, borderOuter }} icons={…}>`; bóng control là `elevation.none`.
- **Flutter:** màu qua `UuTheme.copyWith(colors: …)`; font, viền ngoài (`borderOuterWidth` · `borderOuter`), bóng control (`elevationNone`), bộ icon qua `uuThemeData(...)`. Bo góc, elevation và `--dna-*` chưa có đường ghi đè, nên báo người dùng thay vì sửa widget.

## Bật viền ngoài trong Figma

Component trong Figma **không gắn sẵn** viền ngoài: panel Effects gọn, designer không thấy lớp lạ. File chỉ có biến
`border-outer` (collection `color`), `border-outer-width` (collection `effect`) và effect style `elevation-none`.
Sản phẩm có DNA viền ngoài (ví dụ viền mực + bóng cứng) thì bật theo một trong hai cách.

### Tự làm tay

1. Mở panel **Local variables**, đặt `border-outer-width` thành độ dày cần (ví dụ 2). Muốn màu khác thì đổi
   `border-outer` sang một biến màu khác.
2. Mở effect style `elevation-none` (panel phải, mục **Effect styles**), sửa bóng thành bóng cứng: X 2, Y 2, Blur 0,
   **Spread = độ dày viền**, màu như viền.
3. Với **mỗi bộ component** cần viền (danh sách ở spec 4.3: nút, chip, checkbox, radio, switch, khung ô nhập, ô OTP,
   và thẻ `CardSheet` · `CardDialog` · `KPICard`), chọn tất cả biến thể trong bộ:
   - Ô nhập: chọn lớp `Field` bên trong, không chọn cả component. OTP: chọn ô con `.base/input-*`.
   - Bấm **+** ở mục **Effect**, chọn **Drop shadow**: X 0, Y 0, Blur 0. Bấm vào ô Spread → **Apply variable** →
     `border-outer-width`. Bấm vào màu → tab **Libraries/Variables** → `border-outer`.
   - Control (không phải thẻ): thêm tiếp style `elevation-none` vào mục Effect, kéo nó **xuống dưới** bóng viền.
   - Bật **Clip content** ở khung vừa thêm bóng. Figma chỉ vẽ phần spread khi khung bật cắt tràn.
   - Nút **Ghost** không có nền nên Figma không vẽ bóng: ở các biến thể này dùng **Stroke** thay cho bóng viền,
     Position **Outside**, độ dày gắn `border-outer-width`, màu gắn `border-outer`.
4. Tắt viền trong ở trạng thái thường (biến không làm thay được): `Chip` chưa chọn, `Checkbox` chưa tick, `Radio`
   chưa chọn, `Switch` tắt, nút `Outline`, khung ô nhập, ô OTP. Giữ viền ở focus, Error, đã chọn, Disabled.
5. Khung cha nào bật Clip content mà sát control (ví dụ lớp `Row` của `SearchInput`) thì tắt, không thì viền bị cắt.

### Nhờ AI làm

Dán cho AI có Figma MCP (kèm link file Figma):

> Bật viền ngoài theo UU DS cho file này: viền {độ dày}px màu {token màu}, bóng cứng lệch {x},{y}. Làm theo mục
> "Bật viền ngoài trong Figma" trong `product-dna.md` của skill UU DS.

AI làm theo các bước sau (một trang mỗi lần gọi, chụp kiểm từng bộ):

1. Đặt giá trị `border-outer-width` (collection `effect`) và nếu cần đổi `border-outer` (collection `color`, mọi mode).
   Sửa effect style `elevation-none` thành bóng cứng với `spread` = độ dày viền.
2. Với mỗi biến thể của bộ component trong danh sách spec 4.3 (lớp `Field` cho ô nhập, ô con cho OTP): thêm
   `DROP_SHADOW` lệch 0, mờ 0, `showShadowBehindNode: false`, `spread` gắn `border-outer-width`, `color` gắn
   `border-outer` (`figma.variables.setBoundVariableForEffect`). Control thêm bóng của `elevation-none` **trước** bóng
   viền trong mảng `effects` (để nằm dưới). Bật `clipsContent`.
3. Biến thể không có fill nhìn thấy và không có stroke (nút Ghost ở trạng thái thường): thay bóng viền bằng stroke
   `OUTSIDE`, `strokeWeight` gắn `border-outer-width`, màu gắn `border-outer`.
4. Tắt viền trong ở trạng thái thường như bước 4 phần tự làm. Tắt `clipsContent` ở khung cha sát control.
5. Chụp từng bộ để kiểm: viền đủ bốn phía, không bị cắt, viền trạng thái (focus, Error) vẫn thấy.
6. Muốn gỡ: xoá các bóng và stroke gắn `border-outer*`, đặt `border-outer-width` về 0, `elevation-none` về bóng trong suốt.

## Trích DNA từ sản phẩm

Khi người dùng nhờ tạo DNA từ Figma, website hoặc ảnh chụp:

1. Lấy ít nhất 3 màn khác nhau. Một màn chưa đủ để biết đâu là quy luật. Style anchor ít hơn 3 màn vẫn dùng được, nhưng mọi giá trị ghi `(đoán)`.
2. Chép `dna-template.md` thành `DNA.md`.
3. Đo những gì lặp lại: màu nền, gradient, bóng, viền, bo góc, lề hai biên, khoảng cách giữa khối.
4. Chỉ ghi giá trị xuất hiện từ hai lần trở lên. Giá trị xuất hiện một lần là ngoại lệ, không phải DNA.
5. Quy về thang UU DS nếu lệch không quá 2px, ví dụ 15px thành `radius-lg`.
6. Ghi nguồn. Từ ảnh chụp chỉ ước lượng được, nên thêm `(đoán)`.
7. Tìm 2–3 dấu hiệu nhận diện. Đây là phần làm sản phẩm khác đi, đừng bỏ qua.

Chỉ trích từ sản phẩm người dùng sở hữu hoặc được phép dùng. Muốn học phong cách của sản phẩm khác thì lấy nhịp bố cục, không lấy logo hay nhận diện.

## Kiểm trước khi giao

- Đo lại contrast mọi cặp đã đổi: chữ từ 4.5, viền tương tác từ 3.
- `object-secondary` phải đạt 4.5 trên cả `background-surface` và `background-muted`.
- Chữ trên `background-interactive` luôn là `object-on-interactive`. Nền nút sáng thì token này phải tối.
- Chuyển về Basic bằng cách bỏ `data-theme`. Màn phải vẫn dùng được.
- Phủ tay che logo: màn còn nhận ra sản phẩm không? Nếu không, DNA chưa áp đủ.
- Liệt kê chỗ DNA bị phần khoá chặn.
