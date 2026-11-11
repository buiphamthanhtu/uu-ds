# Khung màn chuẩn

Sáu khung màn chuẩn của UU DS để chép cấu trúc. Sản phẩm đã có màn mẫu riêng (mục 8 của `DNA.md`) thì màn mẫu đó đi trước file này. Dựng màn mới thì tìm màn gần nhất ở đây, giữ nguyên bộ khung và thứ tự component, rồi thay nội dung. Đừng dựng từ đầu.

Mỗi màn có ba phần: **khung**, **học gì**, **dễ sai**. Số đo của từng component nằm ở spec mục 6; file này chỉ nói cách ghép.

| Cần dựng | Khung |
|---|---|
| Nhập thông tin trên app | [Form](#1-form-trên-app) |
| Nhập mã xác thực | [OTP](#2-nhập-mã-xác-thực) |
| Chọn một mục từ danh sách dài, kể cả chọn nhiều tầng | [Chọn từ danh sách](#3-chọn-từ-danh-sách) |
| Xác nhận việc không hoàn tác được | [Xác nhận phá huỷ](#4-xác-nhận-phá-huỷ) |
| Xong việc, lỗi, chưa có dữ liệu | [Kết quả, lỗi, rỗng](#5-kết-quả-lỗi-rỗng) |
| Dashboard, trang quản trị trên desktop | [Dashboard](#6-dashboard-desktop) |

**Chưa có khung:** màn danh sách và màn cài đặt trên app. Dựng bằng `ListGroup` + `ListItem` (§6.32) và nói rõ khung là tự dựng khi bàn giao; sản phẩm có màn mẫu cùng loại thì bám màn mẫu.

**Khoảng cách giữa các khối trong màn** chưa có trong spec, trừ khung template ở §6.19. Lấy từ thang `gap-*` và nói rõ đó là phần tự chọn khi bàn giao.

---

## 1. Form trên app

```
Khung 390 · density Touch
├─ NavigationBar         Back action=true · tên màn ngắn
├─ Body                  padding ngang 16 · cuộn được
│  ├─ TextInput          Label · một dòng tự do
│  ├─ Dropdown           Label · một đáp án từ danh sách
│  ├─ DateInput          Label · ngày trên lịch
│  └─ TextArea           Label · chữ nhiều dòng
└─ Footer                padding 16
   └─ ButtonGroup        một nút chính · Secondary button=false
```

**Học gì**
- Mỗi loại đáp án có một component riêng. Ngày dùng `DateInput`, không dùng `TextInput` gắn icon lịch.
- Nhãn còn nguyên sau khi đã điền, nên người dùng luôn biết ô đó là gì.
- Lỗi nằm ngay dưới ô gây ra lỗi. Dòng lỗi nói cách sửa.

**Dễ sai**
- Dùng placeholder thay nhãn.
- Báo lỗi nhập liệu bằng `Toast`: toast biến mất, lỗi biến theo.
- Kéo cao `TextInput` thay vì đổi sang `TextArea`.

## 2. Nhập mã xác thực

```
Khung 390 · density Touch
├─ NavigationBar         Back action=true
└─ Body                  padding ngang 16
   ├─ Tiêu đề, mô tả     nói mã gửi về đâu
   ├─ OTPInput           Masked=False · 6 ô
   └─ TextButton         Ghost · gửi lại mã
```

**Học gì**
- Mã SMS để `Masked=False`, người dùng còn đối chiếu với tin nhắn. Mã PIN mới `Masked=True`.
- Sai mã: cả 6 ô đỏ, chữ số giữ nguyên, dòng lỗi căn giữa. Lỗi chỉ hiện sau khi nhập đủ.

**Dễ sai**
- Dựng 6 `TextInput` xếp hàng.
- Xoá hết các ô khi sai mã.

## 3. Chọn từ danh sách

```
Dropdown                 Value=Empty · bấm mở sheet
└─ Menu Platform=Sheet   CardSheet · Navigation=Close · CTA=false
   ├─ Search             bật khi danh sách dài
   ├─ Danh sách option   chọn một: bấm là đóng
   ├─ Footer             chọn nhiều: Type=Multiple + Bỏ chọn, Áp dụng
   └─ Sheet con          Navigation=Back · ví dụ Tỉnh rồi tới Huyện
```

**Học gì**
- Sheet con có nút Back bên trái và không có nút đóng. Back và Close không bao giờ hiện cùng lúc.
- Back về sheet cha. Muốn đóng cả chuỗi thì về sheet gốc rồi đóng, để người dùng không mất dấu đang ở tầng nào.
- Desktop dùng `Menu` Panel neo vào ô, không dùng sheet.

**Dễ sai**
- Thêm ô tìm kiếm cho danh sách vài mục.
- Dùng `CardSheet` cho một câu hỏi có/không. Trường hợp đó là `Dialog`.

## 4. Xác nhận phá huỷ

```
Scrim                    overlay + blur · panel thụt 12 mỗi bên
└─ CardDialog            Banner=False · căn giữa dọc
   ├─ Close              góc phải
   └─ Body
      ├─ Slot            câu hỏi nằm ở đây · Dialog không có tiêu đề riêng
      └─ ButtonGroup     Tone=Danger · Secondary button=true
                         phụ "Giữ đơn" · chính "Huỷ đơn"
```

**Học gì**
- Nút nói đúng việc sẽ xảy ra. Đọc mỗi hai nút vẫn hiểu.
- `Tone=Danger` chỉ đổi nút chính sang đỏ. Thứ tự và hình học giữ nguyên.
- `Danger` chỉ dành cho việc không lấy lại được.

**Dễ sai**
- Nút ghi "OK" và "Không".
- Tô đỏ hành động an toàn như lưu nháp.
- Đặt `Slot` trống: đây là chỗ của nội dung, không phải phần trang trí.
- Mở dialog chồng lên dialog.

## 5. Kết quả, lỗi, rỗng

| Tình huống | Dùng | Nút |
|---|---|---|
| Xong việc, phải sang chỗ khác | `ResultScreen` | `ButtonGroup` dọc: chính trên, phụ dưới |
| Lỗi chặn chức năng chính, không tự sửa được | `ErrorScreen` | Đúng một nút thử lại |
| Cả màn chưa có dữ liệu | `EmptyScreen` | Một nút hành động |
| Một khối chưa có dữ liệu | `EmptySection` | Một nút, ẩn được |
| Lỗi ở một khối, phần còn lại vẫn dùng được | `ErrorSection` | Một nút thử lại |
| Sửa được ngay | `Dialog` hoặc `Toast` | Tuỳ việc |

```
Khung 390 · density Touch
├─ NavigationBar         ResultScreen, ErrorScreen: Back action=false
├─ Body                  FILL · căn giữa hai chiều · padding ngang 16
│  └─ Ảnh, tiêu đề, mô tả
└─ Footer                padding 16 · nút theo bảng trên
```

**Học gì**
- Ảnh là nội dung, cần `alt`.
- `ErrorScreen` có một nút là cố ý. Nếu người dùng còn việc khác để làm thì đó không phải lỗi toàn màn.
- Nút ở màn rỗng nói bước tiếp theo, ví dụ "Xoá bộ lọc".

**Dễ sai**
- Viết "Không có dữ liệu" rồi dừng ở đó.
- Nút ghi "OK" nhưng không dẫn đi đâu.
- Để nút Back trên `ResultScreen`.

## 6. Dashboard desktop

```
Khung 1440 · data-density="compact"
├─ SideNav               mục đang chọn duy nhất · tối đa 2 cấp
└─ Main
   ├─ Breadcrumb         chữ, mục cuối là trang hiện tại
   ├─ Hàng KPICard       mỗi thẻ một số · chi phí, tỉ lệ huỷ: Polarity=Inverse
   ├─ Bảng               TableHeaderCell + TableCell
   │  ├─ Cột số          Align=Right + Type=Number
   │  ├─ Cột trạng thái  Type=Status
   │  └─ Cột hành động   Ghost Small · còn lại vào "⋯"
   └─ TablePagination    khi quá một trang
```

**Học gì**
- Bảng không viền ngoài, không kẻ dọc. Hover và chọn là trạng thái của cả hàng.
- Chọn `Polarity` theo ý nghĩa của chỉ số. Mũi tên vẫn theo chiều số.
- Bảng rỗng dùng `EmptySection` trong thân bảng.

**Dễ sai**
- Dùng `Solid` trong hàng bảng.
- Lật mũi tên để lấy màu đỏ.
- Dùng `Compact` cho màn chạm.
- Dùng chấm `Pagination` dưới bảng. Bảng dùng `TablePagination`.
