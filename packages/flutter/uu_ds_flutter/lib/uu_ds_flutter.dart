/// ÚÙ Design System cho Flutter.
///
/// Đọc docs/design-system.md trước khi dùng. Luật không đổi so với bản web:
/// 1. Màu chỉ qua `UuTheme.of(context).colors` (semantic) — không dùng `UuPrimitiveColors` trong widget.
/// 2. Brand mode chọn ở `uuThemeData(brand: …)`; widget không biết brand.
/// 3. Hover/Pressed = lớp phủ màu content, opacity 5/10 (nền sáng) · 20/40 (nền tối) — `UuPressable`.
/// 4. Chỉ thang có sẵn: `UuGap`, `UuRadius`, `UuTextStyles`.
/// 5. Chỉ widget có trong spec. 6. Icon chỉ UU icon qua `UuIcon`.
library;

export 'src/tokens.g.dart';
export 'src/theme.dart';
export 'src/state_layer.dart';
export 'src/icon.dart';
export 'src/buttons.dart';
export 'src/fields.dart';
export 'src/selection.dart';
export 'src/list.dart';
export 'src/navigation.dart';
export 'src/feedback.dart';
export 'src/data.dart';
export 'src/overlay.dart';
