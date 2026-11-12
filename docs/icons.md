# Icon — bộ UU icon

Icon là của **design system**, không phải của từng màn hay từng sản phẩm. Mọi icon trong
sản phẩm dùng UU DS lấy từ một bộ duy nhất: **UU icon**.

| Thứ | Giá trị |
|---|---|
| Bộ icon | UU icon |
| Kiểu mỗi tên | hai kiểu · **bản công khai** (`public: true`) chỉ gồm icon component dùng cố định + `texture` (icon giữ chỗ) |
| Kiểu | `outline` · `fill` — vẽ ở **18×18** |
| Cỡ dùng | 16 · 18 · 24 (`size-4` / `size-6`); Icon button: 24 cho Large/Base, 16 cho Small |
| Màu | **Không có màu riêng.** SVG dùng `currentColor`; màu lấy từ token `object-*` của phần tử chứa |
| Bảng tra | `references/uu-icon-index.json` — tên → nhóm (`category`), kiểu có sẵn, `public` |
| SVG (skill) | `assets/icons/<category>.json` — bộ đầy đủ × outline/fill, chia bundle theo nhóm; lấy bằng `scripts/icon.py` |
| File SVG (repo UU DS) | `src/icons/svg/` — **chỉ các tên công khai** |

## Luật

1. **Một component `Icon(name, variant, size)`** (hoặc sprite). Gọi theo **tên trong bộ**
   (`chevron-right`, `gift`, `list-checkbox`), kèm kiểu `outline` / `fill`. Không lưu file
   icon theo màn, không tự vẽ, không nhặt icon lẻ từ bộ khác vì "trông giống". Bộ khác chỉ vào qua DNA, cả bộ (luật 7).
2. **Tên icon không mang màu hay trạng thái.** `icon-chevron-down-white.svg`, `fire-active.svg`
   là dấu hiệu đang lưu MÀU thành icon. Đó là một icon, tô bằng `object-on-interactive` hay
   `object-disabled` tuỳ chỗ đặt.
3. **Kiểu `fill` = trạng thái bật.** Toggle button `Active=True` và mục điều hướng đang chọn
   đổi sang kiểu `fill` (cùng tên); trạng thái thường dùng `outline`.
4. **Không có trong bộ → dừng và hỏi**, đúng như token không có trong `tokens.css`. Bộ ở đây là bộ
   sản phẩm đã gắn qua DNA; chưa gắn bộ nào thì hỏi người dùng chọn bộ (luật 7), trong lúc chờ dùng `texture`.
   Tra tên trước bằng `uu-icon-index.json`; tên gần giống (`cart` vs `cart-shopping`) không
   phải là cùng icon.
5. Ảnh minh hoạ, huy hiệu, sticker nhiều màu **không phải icon** — đó là asset, đi đường asset.
6. **Package chỉ gói icon `public: true`; demo của UU DS được thêm icon minh hoạ.** Package phát hành
   (web, React Native, Flutter) chỉ chứa 22 icon `public: true`. Storybook, Widgetbook, app mẫu React Native
   và website của UU DS được dùng thêm icon minh hoạ (house, gift, bell…): đó là một bộ icon DNA riêng
   (`src/docs/demo-icons` trong repo), gắn qua `IconProvider` / `uuThemeData(icons:)` / `UuProvider icons`,
   không vào package. Package cộng bộ minh hoạ không quá 100 tên (giới hạn công khai của license Nucleo).
   Muốn thêm tên vào package hay bộ minh hoạ → hỏi chủ design system trước, đừng tự thêm. Không có trang
   tra cứu icon công khai. Icon khác trong bundle `assets/icons/` chỉ dùng nội bộ (mockup, artifact riêng,
   prototype không công bố).
7. **22 icon công khai chỉ để component chạy và làm ví dụ, không phải bộ icon của sản phẩm.** Sản phẩm cần icon
   thì gắn một bộ: miễn phí như Lucide, hoặc mua license Nucleo, hoặc bộ khác có giấy phép phù hợp. Đăng ký cả bộ
   qua DNA (spec 4.3 — web `IconProvider`, app `UuProvider icons`), ghi tên bộ ở mục Hình ảnh và icon của DNA.md.
   Bộ không có kiểu `fill` (như Lucide) thì trạng thái bật dùng lại outline, component vẫn đổi nền / màu như thường.
   Tên đăng ký ghi đè icon mặc định cùng tên, tên không đăng ký vẫn lấy bộ mặc định. Một sản phẩm một bộ,
   không trộn từng icon của hai bộ trên cùng màn. Bộ do sản phẩm tự gắn thì giấy phép thuộc về sản phẩm:
   lấy thêm UU icon ngoài bản công khai (gốc Nucleo, xem `NOTICE.md` trong repo) cần license Nucleo đứng tên
   đơn vị phát hành sản phẩm.

## Lấy SVG

SVG nằm trong bundle theo nhóm: `assets/icons/<category>.json` =
`{"category": …, "icons": {"<name>": {"outline": "<svg…>", "fill": "<svg…>"}}}`. Gom theo nhóm
vì Claude Chat giới hạn 200 file mỗi skill. Mọi SVG `viewBox="0 0 18 18"`, không `width`/`height`,
màu là `currentColor`. Ngoại lệ: `loader-2` và `loader-2-fill` giữ gradient màu cố định như bản gốc.

```bash
python3 scripts/icon.py magnifier            # SVG outline
python3 scripts/icon.py magnifier fill       # SVG fill
python3 scripts/icon.py --search cart        # tra tên
python3 scripts/icon.py --public             # các tên công khai
python3 scripts/icon.py --out ./icons house gift   # ghi ra <name>.svg / <name>-fill.svg
```

- **Dự án React dùng package `uu-ds`:** gọi `<Icon name variant size />`, đừng chép SVG.
- **Artifact / HTML một file (Claude Chat):** chép SVG inline, bọc trong hộp đúng cỡ
  (16 · 18 · 24), để `color` của phần tử chứa quyết định màu:

```html
<span class="uu-icon" style="display:inline-flex;width:24px;height:24px;color:var(--object-secondary)">
  <!-- kết quả của: python3 scripts/icon.py magnifier --><svg viewBox="0 0 18 18" width="100%" height="100%">…</svg>
</span>
```

## Thêm một icon vào UU icon

1. Vẽ trên lưới **18 × 18 có lề**, đúng độ dày nét của bộ. Xuất hai file:
   thêm hai chuỗi SVG đó vào `assets/icons/<category>.json` của skill (khoá `outline` / `fill`).
2. Chuẩn hoá SVG: `viewBox="0 0 18 18"`, **bỏ** `width`/`height`, mọi `fill`/`stroke` → `currentColor`.
   `clipPath` nếu có thì đặt id riêng theo tên icon để hai icon cùng trang không đè nhau.
3. Thêm một dòng vào `uu-icon-index.json` (`category`, `outline`, `fill`; `public: true` chỉ khi đã được duyệt công khai).
4. Icon công khai: chép hai file vào `src/icons/svg/` của repo, thêm dòng vào `src/icons/manifest.json`,
   chạy `npm run icons` (web) và `npm run flutter:icons` (Flutter).

Tên icon: chữ thường, gạch nối, tả **hình**, không tả chỗ dùng — `calendar-days`, không `date-picker-icon`.

## Cỡ hộp và cỡ nét — đọc trước khi than "icon sai size"

UU icon vẽ mọi icon trên lưới **18 × 18 có lề**. Khi đặt vào hộp 24, nét thật chỉ chiếm
khoảng 60–65% hộp. Số đo trên nút đóng của Toast:

| Hộp `Icon` | Nét `xmark` hiện ra | Nút chứa |
|---|---|---|
| 24 | 15,3px | Icon button Base 48 / Large 56 |
| 16 | ≈ 10px | Icon button Small 32 |

Đây là chủ đích của bản vẽ: hộp giữ vùng chạm và nhịp layout, lề giữ icon nét mảnh không
lấn chữ. **Đừng** phóng path cho vừa hộp, **đừng** thay từng icon lẻ sang Lucide / Phosphor / Font Awesome
vì "cùng 24" — mỗi bộ có tỷ lệ nét/hộp khác nhau (Lucide `x` nét 12 stroke 2, FA `xmark`
lấp gần hết hộp), nên cùng con số 24 mà nhìn lệch hẳn. Sản phẩm gắn cả bộ Lucide qua DNA thì được, nhưng
xem icon cạnh chữ và nút một lượt: Lucide nét dày và to hơn UU icon trong cùng hộp.

Ba lỗi hay gặp khi icon lệch cỡ:

1. Dùng bộ icon khác thay UU icon → tỷ lệ nét sai. Sửa: tra đúng tên trong `uu-icon-index.json`.
2. SVG còn `width="18" height="18"` → trình duyệt render 18 dù CSS hộp là 24. Sửa: bỏ hai
   thuộc tính đó, giữ `viewBox`.
3. Crop `viewBox` sát nét (một số tool "optimize" làm vậy) → nét phình ra đầy hộp. Sửa: giữ
   `viewBox="0 0 18 18"` kèm lề.

## Phạm vi công khai

Chủ design system chốt ngày 2026-09-24: bộ này là **UU icon**; chỗ công khai (repo, Storybook
deploy, package phát hành) **chỉ** chứa icon `public: true`. Bộ đầy đủ chỉ nằm
trong skill. Ngày 2026-11-09 thu bộ công khai lại, chỉ còn icon component dùng cố
định (chevron, xmark, check, circle-*, magnifier, calendar-days, clock, dots, arrow-*, sort-vertical,
sidebar-left, triangle-warning) và `texture` làm icon giữ chỗ. Bỏ trang tra cứu icon trên Storybook. Đừng chép `assets/icons/` vào repo hay đăng lên chỗ công khai như một bộ icon tự
do. Nguồn gốc glyph ghi ở `src/icons/NOTICE.md` của repo.

Ngày 2026-11-12 tách hai việc: package vẫn chỉ gói 22 icon trên; demo và website của UU DS được dùng thêm
icon minh hoạ qua bộ DNA riêng, không gói vào package. Tổng công khai (package + bộ minh hoạ) không quá 100.
