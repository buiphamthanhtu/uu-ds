import 'package:flutter_test/flutter_test.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';

void main() {
  test('Brand UU chỉ đổi 20 token thương hiệu, giữ status và object-primary', () {
    const d = UuSemanticColors.defaultBrand;
    const u = UuSemanticColors.uu;
    expect(u.backgroundInteractive, UuPrimitiveColors.orange500);
    expect(u.objectOnInteractive, UuPrimitiveColors.black);
    expect(d.objectOnInteractive, UuPrimitiveColors.white);
    expect(u.objectAccent, UuPrimitiveColors.amber700);
    expect(u.objectPrimary, d.objectPrimary);
    expect(u.backgroundNegative, d.backgroundNegative);
    expect(u.backgroundAttention, d.backgroundAttention);
    expect(UuTheme.brand(UuBrand.uu).colors.borderInteractive, UuPrimitiveColors.orange600);
  });
}
