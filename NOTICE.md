# Giấy phép

Mã nguồn, token và spec trong repo này phát hành theo giấy phép **MIT** (file `LICENSE`). Bộ icon bên dưới là ngoại lệ,
không thuộc MIT.

## UU icon

Icon đi kèm (`uu-ds-native/src/icons.g.ts`, `uu_ds_flutter/assets/icons/`) là bộ **UU icon** công khai, dựng từ
thư viện icon thương mại **Nucleo** (https://nucleoapp.com). Glyph thuộc bản quyền của Nucleo; tên "UU icon" chỉ là
tên gọi trong design system, không chuyển quyền sở hữu. Không tách bộ icon này ra dùng như một bộ icon tự do.

Gói chỉ kèm icon component dùng cố định và `texture` (icon giữ chỗ). Sản phẩm cần icon thì tự mua license
Nucleo hoặc dùng bộ khác, đăng ký qua Product DNA (spec 4.3). Bộ icon do sản phẩm tự đăng ký (Product DNA) thì giấy phép thuộc về sản phẩm đó.

## Bộ chấm `uu-ds-check`

`scripts/vibe-eval.mjs` trong gói web (lệnh `npx uu-ds-check`) học cách chấm tất định từ
`internal/vibe-tests/src/universal-eval.ts` của dự án **facebook/astryx** (https://github.com/facebook/astryx, giấy phép MIT),
rồi viết lại và thu hẹp về các ràng buộc của UU DS.
