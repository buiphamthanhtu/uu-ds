# ÚÙ Design System — hướng dẫn cho AI coding agent

Project này dùng gói `uu-ds` (ÚÙ Design System). Trước khi dựng UI, đọc trong `node_modules/uu-ds/`:

1. `docs/design-system.md` — spec đầy đủ. Đọc mục 0–3 và 6.0 trước dòng code đầu tiên. Chỉ dùng component có ở mục 5.
2. `docs/tokens.css` — mọi giá trị lấy từ token semantic (`var(--background-interactive)`). Không hex, không `--color-*`.
3. `docs/icons.md` + `docs/uu-icon-index.json` — UU icon trong gói; bộ riêng của sản phẩm đăng ký qua `IconProvider`.
4. `docs/product-dna.md` + `docs/dna-template.md` — style riêng của sản phẩm (`DNA.md` ở gốc project, nếu có).
5. `docs/ontology.json` — quan hệ token ↔ component ↔ mode. Không có ở đây = chưa chốt → hỏi, đừng tự chế.

Hover / Pressed đi qua state layer có sẵn — không đổi nền, chữ, font-weight. Tài liệu đầy đủ: https://uucreative.co/uu-ds/
