// ignore_for_file: deprecated_member_use
import 'package:flutter/material.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';
import 'package:widgetbook/widgetbook.dart';

/// DNA mẫu để xem widget khi sản phẩm bật Product DNA (spec 4.3).
enum UuDnaSample {
  /// Không DNA: đúng UU DS gốc.
  none('Không DNA'),

  /// Viền ngoài 2px màu `object-primary` + bóng cứng lệch 2px (`elevation-none`).
  outer('Viền ngoài + bóng cứng');

  const UuDnaSample(this.label);
  final String label;
}

/// Cấu hình đang chọn trong addon UU DS.
class UuThemeSetting {
  const UuThemeSetting(this.brand, this.density, this.layout, this.dna);
  final UuBrand brand;
  final UuDensity density;
  final UuLayout layout;
  final UuDnaSample dna;
}

/// Addon chọn brand, density, layout và DNA độc lập nhau; dựng theme bằng `uuThemeData`.
class UuThemeAddon extends WidgetbookAddon<UuThemeSetting> {
  UuThemeAddon() : super(name: 'UU DS');

  static String _brand(UuBrand b) => b == UuBrand.uu ? 'UU' : 'Default';

  @override
  List<Field> get fields => [
        ObjectDropdownField<UuBrand>(name: 'brand', values: UuBrand.values, initialValue: UuBrand.defaultBrand, labelBuilder: _brand),
        ObjectDropdownField<UuDensity>(name: 'density', values: UuDensity.values, initialValue: UuDensity.touch, labelBuilder: (d) => d.name),
        ObjectDropdownField<UuLayout>(name: 'layout', values: UuLayout.values, initialValue: UuLayout.expanded, labelBuilder: (l) => l.name),
        ObjectDropdownField<UuDnaSample>(name: 'dna', values: UuDnaSample.values, initialValue: UuDnaSample.none, labelBuilder: (d) => d.label),
      ];

  @override
  UuThemeSetting valueFromQueryGroup(Map<String, String> group) => UuThemeSetting(
        valueOf<UuBrand>('brand', group)!,
        valueOf<UuDensity>('density', group)!,
        valueOf<UuLayout>('layout', group)!,
        valueOf<UuDnaSample>('dna', group)!,
      );

  @override
  Widget buildUseCase(BuildContext context, Widget child, UuThemeSetting setting) {
    final base = uuThemeData(brand: setting.brand, density: setting.density, layout: setting.layout);
    final ThemeData data;
    if (setting.dna == UuDnaSample.outer) {
      // Màu viền lấy object-primary của brand đang chọn (để null = mặc định), bóng dùng cùng màu.
      final ink = base.extension<UuTheme>()!.colors.objectPrimary;
      data = uuThemeData(
        brand: setting.brand,
        density: setting.density,
        layout: setting.layout,
        borderOuterWidth: 2,
        elevationNone: [BoxShadow(color: ink, offset: const Offset(2, 2), spreadRadius: 2)],
      );
    } else {
      data = base;
    }
    // Chừa lề để vòng viền ngoài DNA (vẽ ngoài hộp) không bị mép canvas cắt.
    return Theme(data: data, child: Padding(padding: const EdgeInsets.all(UuGap.g4), child: child));
  }
}
