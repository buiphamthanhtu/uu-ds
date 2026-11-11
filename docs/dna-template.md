---
product: tên sản phẩm
theme: ten-san-pham
updated: YYYY-MM-DD
sources:
  - màn, link Figma hoặc ảnh đã đo
---

# DNA — tên sản phẩm

Giá trị nào chưa đo được thì bỏ trống, UU DS sẽ dùng mặc định. Thêm `(estimated)` sau giá trị chưa chắc.

## 1. Cá tính

- Ba tính từ:
- Không phải:
- Một câu mô tả cảm giác khi dùng:

## 2. Màu

Bảng này chỉ ghi các token muốn đổi trong 23 token thương hiệu (spec 2.5).
Sản phẩm có **nhiều chế độ màu** (spec 4.3): thêm một cột giá trị cho mỗi chế độ (`Giá trị · <chế độ 1>`,
`Giá trị · <chế độ 2>`…) và ghi tên chế độ mặc định. Phần còn lại của file dùng chung cho mọi chế độ.

| Token | Giá trị | Thấy ở đâu |
|---|---|---|
| `background-interactive` | | |
| `object-on-interactive` | | |
| `object-interactive` | | |
| `border-interactive` | | |
| `background-accent` | | |
| `background-muted` | | |
| `background-subtle` | | nền nút `Tonal` |
| `object-secondary` | | chữ phụ |
| `border` | | viền trung tính |

## 3. Bo góc

| Token | Giá trị | Dùng cho |
|---|---|---|
| `radius-sm` | | |
| `radius-base` | | |
| `radius-lg` | | ô nhập, thẻ |
| `rounded-2xl` | | sheet, dialog, panel `Menu` |
| `rounded-4xl` | | nút, chip |

## 4. Đổ bóng

| Token | Giá trị | Dùng cho |
|---|---|---|
| `elevation-low` | | |
| `elevation-medium` | | |
| `elevation-high` | | |

## 5. Viền

- Viền ngoài của control và thẻ (`border-outer-width` · `border-outer`, mặc định không có):
- Bóng của control (`elevation-none`, mặc định không có; có viền thì spread = độ dày viền):
- Thường dùng viền hay dùng bóng để tách khối:
- Màu viền khối có nền tint (`border-subtle`, `border-medium`):

## 6. Nền và bề mặt

| Biến | Giá trị | Ghi chú |
|---|---|---|
| `--dna-page-background` | | màu hoặc gradient nền trang |
| `--dna-hero-background` | | khối mở đầu |
| `--dna-card-background` | | thẻ, nếu khác `background-surface` |
| `--dna-card-shadow` | | bóng của thẻ, `none` nếu thẻ phẳng |
| `--dna-floating-shadow` | | phần nổi: thanh đáy, nút back |
| `--dna-feature-background` | | khối tính năng nổi bật trên màn |

Cần biến `--dna-*` khác (viền thẻ, độ nghiêng…) thì thêm dòng vào bảng mục 6 hoặc 7: hợp lệ, miễn chỉ layout đọc.

## 7. Bố cục

| Biến | App | Desktop | Ghi chú |
|---|---|---|---|
| `--dna-page-margin` | | | lề hai bên |
| `--dna-section-gap` | | | giữa các khối lớn |
| `--dna-card-gap` | | | giữa các thẻ |
| `--dna-content-max` | | | bề rộng nội dung tối đa |
| `--dna-card-inset` | | | nút hoặc khối lồng cách mép thẻ |
| `--dna-card-head-inset` | | | khối chữ cách mép thẻ, thêm vào `--dna-card-inset` |
| `--dna-floating-inset` | | | phần nổi cách đáy và hai bên |

## 8. Mẫu màn

Cách màn được dựng. Ghi màn mẫu cho từng dòng để người sau mở ra so. Cách làm chỉ thấy ở một màn thì thêm `(1 screen)`.

| Phần | Cách làm | Màn mẫu |
|---|---|---|
| Header | kiểu `NavigationBar`, có tiêu đề lớn không, nút bên phải | |
| Mở đầu màn | khối hero, tóm tắt, ô tìm kiếm… | |
| Danh sách | thẻ hay hàng `ListItem`, có ảnh không, nhóm theo gì | |
| Form | nhãn trên ô, nhóm field, nút gửi ở đâu | |
| Nút chính | cuối nội dung, ghim đáy, hay trong header | |
| Trạng thái trống, lỗi | `EmptySection` / `EmptyScreen`, có minh hoạ không | |
| Điều hướng đáy | `BottomBar` mấy mục, kiểu vỏ, mục đang chọn trông ra sao | |
| Minh hoạ, sticker | đặt ở đâu (header, trạng thái trống…), chọn hình theo gì | |
| Thứ bậc chữ | text style cho tiêu đề màn, tiêu đề khối, chữ phụ | |

## 9. Chữ

- Font tiêu đề lớn (`font-family-display`):
- Font chữ còn lại (`font-family-body`, mặc định font hệ thống — chỉ đổi họ font):
- Cách dùng tiêu đề: to hay vừa, viết hoa hay thường:
- Giọng văn:

## 10. Hình ảnh và icon

- Kiểu ảnh:
- Kiểu minh hoạ:
- Bộ icon (gói chỉ kèm 22 icon cho component; sản phẩm cần icon thì đăng ký cả bộ, ví dụ Lucide miễn phí hoặc Nucleo trả phí):
- Icon `outline` hay `fill` ở đâu:

## 11. Dấu hiệu nhận diện

Hai đến ba chi tiết làm người ta nhận ra sản phẩm này, có ảnh hoặc màn cụ thể.

-
-

## 12. Không làm

-
-
