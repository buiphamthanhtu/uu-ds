import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:uu_ds_flutter/uu_ds_flutter.dart';
import 'package:widgetbook/widgetbook.dart';

import 'theme_addon.dart';

void main() => runApp(const UuWidgetbook());

class UuWidgetbook extends StatelessWidget {
  const UuWidgetbook({super.key});

  @override
  Widget build(BuildContext context) {
    return Widgetbook.material(
      addons: [
        UuThemeAddon(),
        ViewportAddon([Viewports.none, IosViewports.iPhone13, AndroidViewports.samsungGalaxyS20]),
      ],
      directories: [
        WidgetbookFolder(name: 'Hành động', children: [
          WidgetbookComponent(name: 'TextButton', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => UuTextButton(
              label: ctx.knobs.string(label: 'label', initialValue: 'Action'),
              tone: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'tone', options: UuButtonTone.values),
              // Tonal chỉ có ở Neutral, không Inverted (§6.1): tổ hợp khác rơi về Solid.
              type: _validType(ctx.knobs.object.dropdown(labelBuilder: _n, label: 'type', options: UuButtonType.values), ctx),
              size: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'size', options: UuButtonSize.values),
              state: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'state', options: UuButtonState.values),
              inverted: ctx.knobs.boolean(label: 'inverted'),
              onPressed: () {},
            )),
            WidgetbookUseCase(name: 'Ma trận', builder: (ctx) => const _ButtonMatrix()),
          ]),
          WidgetbookComponent(name: 'TextButtonDanger', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => UuTextButtonDanger(
              label: ctx.knobs.string(label: 'label', initialValue: 'Xoá tài khoản'),
              type: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'type', options: UuButtonType.values),
              size: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'size', options: UuButtonSize.values),
              state: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'state', options: UuButtonState.values),
              onPressed: () {},
            )),
          ]),
          WidgetbookComponent(name: 'IconButton', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => UuIconButton(
              icon: ctx.knobs.string(label: 'icon', initialValue: 'xmark'), label: 'Đóng',
              tone: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'tone', options: UuButtonTone.values),
              type: _validType(ctx.knobs.object.dropdown(labelBuilder: _n, label: 'type', options: UuButtonType.values, initialOption: UuButtonType.ghost), ctx),
              size: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'size', options: UuButtonSize.values),
              inverted: ctx.knobs.boolean(label: 'inverted'), onPressed: () {},
            )),
          ]),
          WidgetbookComponent(name: 'ToggleButton', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => _Stateful<bool>(false, (v, set) => UuToggleButton(active: v, onToggle: set, icon: 'texture', label: 'Theo dõi', activeLabel: 'Đang theo dõi'))),
          ]),
          WidgetbookComponent(name: 'ButtonGroup', useCases: [
            WidgetbookUseCase(name: 'Horizontal', builder: (_) => const SizedBox(width: 352, child: UuButtonGroup(primary: UuGroupAction('Xác nhận'), secondary: UuGroupAction('Huỷ')))),
            WidgetbookUseCase(name: 'Vertical', builder: (_) => const SizedBox(width: 352, child: UuButtonGroup(layout: UuButtonGroupLayout.vertical, primary: UuGroupAction('Xác nhận'), secondary: UuGroupAction('Huỷ')))),
          ]),
        ]),
        WidgetbookFolder(name: 'Lựa chọn', children: [
          WidgetbookComponent(name: 'Checkbox', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => _Stateful<bool>(false, (v, set) => UuCheckboxInput(checked: v, onChanged: set, label: 'Tôi đồng ý với Điều khoản sử dụng'))),
            WidgetbookUseCase(name: 'Indeterminate', builder: (ctx) => const Row(mainAxisSize: MainAxisSize.min, children: [
              UuCheckbox(checked: false, semanticLabel: 'Unchecked'), SizedBox(width: UuGap.g4),
              UuCheckbox(checked: true, semanticLabel: 'Checked'), SizedBox(width: UuGap.g4),
              UuCheckbox(checked: null, semanticLabel: 'Indeterminate'), SizedBox(width: UuGap.g4),
              UuCheckbox(checked: null, disabled: true, semanticLabel: 'Indeterminate disabled')])),
          ]),
          WidgetbookComponent(name: 'Radio', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => _Stateful<bool>(false, (v, set) => UuRadioInput(checked: v, onSelected: () => set(true), label: 'Giao tiêu chuẩn', error: ctx.knobs.boolean(label: 'error'), disabled: ctx.knobs.boolean(label: 'disabled')))),
            WidgetbookUseCase(name: 'Ma trận', builder: (ctx) => Column(mainAxisSize: MainAxisSize.min, children: [
              for (final checked in [false, true]) Padding(padding: const EdgeInsets.only(bottom: UuGap.g4), child: Row(mainAxisSize: MainAxisSize.min, children: [
                for (final f in [null, ...UuForcedState.values]) Padding(padding: const EdgeInsets.only(right: UuGap.g4), child: UuRadio(checked: checked, forced: f, onSelected: () {}, semanticLabel: f?.name ?? 'Default')),
                UuRadio(checked: checked, error: true, onSelected: () {}, semanticLabel: 'Error'), const SizedBox(width: UuGap.g4),
                UuRadio(checked: checked, disabled: true, semanticLabel: 'Disabled'),
              ])),
            ])),
            WidgetbookUseCase(name: 'RadioList', builder: (ctx) => SizedBox(width: 358, child: _Stateful<String>('a', (v, set) => UuRadioList<String>(value: v, onChanged: set, options: const [
              UuRadioOption('a', 'Tôi không còn nhu cầu sử dụng'), UuRadioOption('b', 'Tôi lo ngại về quyền riêng tư'), UuRadioOption('c', 'Lý do khác')])))),
          ]),
          WidgetbookComponent(name: 'Switch', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => _Stateful<bool>(false, (v, set) => UuSwitch(checked: v, onChanged: set, semanticLabel: 'Nhận thông báo'))),
            WidgetbookUseCase(name: '10 variant', builder: (ctx) => const Column(mainAxisSize: MainAxisSize.min, children: [
              Row(mainAxisSize: MainAxisSize.min, children: [
                UuSwitch(checked: false, semanticLabel: 'Tắt'), SizedBox(width: UuGap.g4),
                UuSwitch(checked: false, forced: UuForcedState.hover, semanticLabel: 'Tắt hover'), SizedBox(width: UuGap.g4),
                UuSwitch(checked: false, forced: UuForcedState.focus, semanticLabel: 'Tắt focus'), SizedBox(width: UuGap.g4),
                UuSwitch(checked: false, forced: UuForcedState.pressed, semanticLabel: 'Tắt pressed'), SizedBox(width: UuGap.g4),
                UuSwitch(checked: false, disabled: true, semanticLabel: 'Tắt disabled')]),
              SizedBox(height: UuGap.g4),
              Row(mainAxisSize: MainAxisSize.min, children: [
                UuSwitch(checked: true, semanticLabel: 'Bật'), SizedBox(width: UuGap.g4),
                UuSwitch(checked: true, forced: UuForcedState.hover, semanticLabel: 'Bật hover'), SizedBox(width: UuGap.g4),
                UuSwitch(checked: true, forced: UuForcedState.focus, semanticLabel: 'Bật focus'), SizedBox(width: UuGap.g4),
                UuSwitch(checked: true, forced: UuForcedState.pressed, semanticLabel: 'Bật pressed'), SizedBox(width: UuGap.g4),
                UuSwitch(checked: true, disabled: true, semanticLabel: 'Bật disabled')]),
            ])),
          ]),
          WidgetbookComponent(name: 'Chip', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => _Stateful<bool>(false, (v, set) => UuChip(label: 'Hồ bơi', selected: v, onSelectedChanged: set, disabled: ctx.knobs.boolean(label: 'disabled')))),
            WidgetbookUseCase(name: 'Chọn nhiều', builder: (ctx) => _Stateful<bool>(true, (v, set) => Wrap(spacing: UuGap.g2, runSpacing: UuGap.g2, children: [
              UuChip(label: 'Đưa đón sân bay', selected: v, onSelectedChanged: set),
              UuChip(label: 'Hồ bơi', selected: !v, onSelectedChanged: (x) => set(!x)),
              UuChip(label: 'Phòng gym', onSelectedChanged: (_) {}),
              const UuChip(label: 'Phục vụ 24/7', disabled: true),
            ]))),
            WidgetbookUseCase(name: 'Mở danh sách', builder: (ctx) => Wrap(spacing: UuGap.g2, children: [
              UuChip(label: 'Khoảng giá', type: UuChipType.dropdown, onSelectedChanged: (_) {}),
              UuChip(label: 'Dưới 2 triệu', type: UuChipType.dropdown, selected: true, onSelectedChanged: (_) {}),
              const UuChip(label: 'Khoảng giá', type: UuChipType.dropdown, disabled: true),
            ])),
            WidgetbookUseCase(name: 'Dropdown đang mở', builder: (ctx) => const _ChipMenuDemo()),
          ]),
          WidgetbookComponent(name: 'Menu', useCases: [
            WidgetbookUseCase(name: 'Single', builder: (ctx) => SizedBox(width: 280, child: _Stateful<String>('hn', (v, set) => UuMenu<String>(value: v, onSelect: set, search: ctx.knobs.boolean(label: 'search'), options: _cities)))),
            WidgetbookUseCase(name: 'Multiple + footer', builder: (ctx) => SizedBox(width: 280, child: _Stateful<Set<String>>(const {'hn'}, (v, set) => UuMenu<String>(
                  type: UuMenuItemType.multiple, values: v, onValuesChanged: set, footer: true, applyLabel: v.isEmpty ? 'Áp dụng' : 'Áp dụng (${v.length})', onApply: () {},
                  search: ctx.knobs.boolean(label: 'search'), options: _cities)))),
            WidgetbookUseCase(name: 'Section · Divider', builder: (ctx) => SizedBox(width: 280, child: UuMenuPanel(children: [
              const UuMenuSection(title: 'Miền Bắc'),
              UuMenuItem(label: 'Hà Nội', icon: 'texture', selected: true, onTap: () {}),
              UuMenuItem(label: 'Hải Phòng', icon: 'texture', onTap: () {}),
              const UuMenuDivider(),
              const UuMenuSection(title: 'Miền Nam'),
              UuMenuItem(label: 'TP. Hồ Chí Minh', icon: 'texture', onTap: () {}),
              const UuMenuItem(label: 'Cần Thơ', icon: 'texture', disabled: true),
            ]))),
            WidgetbookUseCase(name: 'Ma trận .MenuItem', builder: (ctx) => SizedBox(width: 280, child: UuMenuPanel(children: [
              for (final type in UuMenuItemType.values)
                for (final selected in [false, true]) ...[
                  UuMenuItem(label: '${type.name} · ${selected ? 'chọn' : 'chưa'}', type: type, selected: selected, onTap: () {}),
                  UuMenuItem(label: 'Hover', type: type, selected: selected, forced: UuForcedState.hover, onTap: () {}),
                  UuMenuItem(label: 'Pressed', type: type, selected: selected, forced: UuForcedState.pressed, onTap: () {}),
                  UuMenuItem(label: 'Disabled', type: type, selected: selected, disabled: true),
                ],
            ]))),
          ]),
          WidgetbookComponent(name: 'SegmentedControl', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => _Stateful<String>('a', (v, set) => UuSegmentedControl<String>(value: v, onChanged: set, items: const [
              UuSegmentItem(value: 'a', label: 'Page'), UuSegmentItem(value: 'b', label: 'Page'), UuSegmentItem(value: 'c', label: 'Quà', icon: 'texture')]))),
          ]),
          WidgetbookComponent(name: 'DateInput', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 358, child: _Stateful<DateTime?>(null, (v, set) => UuDateInput(label: 'Ngày sinh', value: v, onChanged: set, error: ctx.knobs.boolean(label: 'error'), errorMessage: 'Error message', disabled: ctx.knobs.boolean(label: 'disabled'))))),
          ]),
          WidgetbookComponent(name: 'Dropdown', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 358, child: UuDropdown(label: 'Tỉnh / Thành phố', value: ctx.knobs.string(label: 'value', initialValue: ''), error: ctx.knobs.boolean(label: 'error'), errorMessage: 'Error message', disabled: ctx.knobs.boolean(label: 'disabled'), onOpen: () {}))),
          ]),
        ]),
        WidgetbookFolder(name: 'Nhập liệu', children: [
          WidgetbookComponent(name: 'TextInput', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 358, child: UuTextInput(label: 'Số điện thoại', requirement: UuRequirement.required, prefixLabel: '+84', actionLabel: 'Dán', error: ctx.knobs.boolean(label: 'error'), errorMessage: 'Số điện thoại không hợp lệ', disabled: ctx.knobs.boolean(label: 'disabled')))),
          ]),
          WidgetbookComponent(name: 'TextArea', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 358, child: UuTextArea(label: 'Lý do xoá tài khoản', disabled: ctx.knobs.boolean(label: 'disabled')))),
          ]),
          WidgetbookComponent(name: 'SearchInput', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 358, child: UuSearchInput(placeholder: 'Tìm khách sạn, điểm đến', disabled: ctx.knobs.boolean(label: 'disabled')))),
            WidgetbookUseCase(name: 'Có label', builder: (ctx) => SizedBox(width: 358, child: UuSearchInput(label: 'Tìm phòng', placeholder: 'Tên phòng hoặc mã đặt phòng', controller: TextEditingController(text: 'Cozy Retreat')))),
            WidgetbookUseCase(name: 'Loading · Cancel', builder: (ctx) => SizedBox(width: 358, child: UuSearchInput(
                  controller: TextEditingController(text: 'Đà Lạt'),
                  loading: ctx.knobs.boolean(label: 'loading', initialValue: true),
                  cancel: ctx.knobs.boolean(label: 'cancel', initialValue: true),
                  onCancel: () {},
                ))),
            WidgetbookUseCase(name: 'Panel gợi ý', builder: (ctx) => SizedBox(width: 358, child: _SearchDemo(flat: ctx.knobs.boolean(label: 'flat (mobile toàn màn)')))),
          ]),
          WidgetbookComponent(name: 'OTPInput', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 328, child: _Stateful<String>('', (v, set) => UuOTPInput(value: v, onChanged: set, masked: ctx.knobs.boolean(label: 'masked'), error: ctx.knobs.boolean(label: 'error'), errorMessage: 'Mã xác thực không đúng', disabled: ctx.knobs.boolean(label: 'disabled'))))),
          ]),
        ]),
        WidgetbookFolder(name: 'Điều hướng', children: [
          WidgetbookComponent(name: 'NavigationBar', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 430, child: UuNavigationBar(title: 'Screen', onBack: () {}, subActionIcon: 'texture', subActionLabel: 'Chia sẻ'))),
          ]),
          WidgetbookComponent(name: 'BottomBar', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => Container(
                  width: 390,
                  padding: const EdgeInsets.all(UuGap.g3),
                  color: UuTheme.of(ctx).colors.backgroundSubtle,
                  child: _Stateful<String>('home', (v, set) => UuBottomBar<String>(
                        value: v,
                        onChanged: set,
                        compact: ctx.knobs.boolean(label: 'compact'),
                        action: ctx.knobs.boolean(label: 'action')
                            ? UuBottomBarAction(label: 'Quét mã', icon: 'texture', type: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'action type', options: UuFooterItemSpecialType.values, initialOption: UuFooterItemSpecialType.emphasized), onPressed: () {})
                            : null,
                        items: [
                          UuBottomBarItem(value: 'home', label: 'Trang chủ', icon: 'texture'),
                          UuBottomBarItem(value: 'gift', label: 'Ưu đãi', icon: 'texture'),
                          const UuBottomBarItem(value: 'home', label: 'Trang chủ', icon: 'texture'),
                          const UuBottomBarItem(value: 'gift', label: 'Ưu đãi', icon: 'texture'),
                          if (!ctx.knobs.boolean(label: 'action')) const UuBottomBarItem(value: 'scan', label: 'Quét mã', icon: 'texture'),
                          const UuBottomBarItem(value: 'bell', label: 'Thông báo', icon: 'texture', badge: '9', badgeLabel: '9 thông báo mới'),
                          const UuBottomBarItem(value: 'user', label: 'Tài khoản', icon: 'texture'),
                        ],
                      )),
                )),
          ]),
          WidgetbookComponent(name: 'Tab', useCases: [
            WidgetbookUseCase(name: '5 state', builder: (ctx) => Row(mainAxisSize: MainAxisSize.min, children: [
              const UuTab(label: 'Default'),
              const UuTab(label: 'Active', active: true),
              UuTab(label: 'Hover', forced: UuForcedState.hover, onTap: () {}),
              UuTab(label: 'Pressed', forced: UuForcedState.pressed, onTap: () {}),
              const UuTab(label: 'Disabled', disabled: true),
            ])),
          ]),
          WidgetbookComponent(name: 'TabBar', useCases: [
            WidgetbookUseCase(name: 'Fixed', builder: (ctx) => SizedBox(width: 390, child: _Stateful<int>(0, (v, set) => UuTabBar<int>(value: v, onChanged: set, items: const [
              UuTabItem(value: 0, label: 'Tổng quan'), UuTabItem(value: 1, label: 'Đánh giá'), UuTabItem(value: 2, label: 'Chính sách', disabled: true)])))),
            WidgetbookUseCase(name: 'Scrollable', builder: (ctx) => SizedBox(width: 390, child: _Stateful<int>(0, (v, set) => UuTabBar<int>(layout: UuTabBarLayout.scrollable, value: v, onChanged: set, items: const [
              UuTabItem(value: 0, label: 'Tất cả'), UuTabItem(value: 1, label: 'Chờ xác nhận'), UuTabItem(value: 2, label: 'Đang giao'),
              UuTabItem(value: 3, label: 'Đã giao'), UuTabItem(value: 4, label: 'Đã huỷ'), UuTabItem(value: 5, label: 'Trả hàng')])))),
          ]),
          WidgetbookComponent(name: 'Pagination', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => UuPagination(position: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'position', options: UuPaginationPosition.values))),
          ]),
          WidgetbookComponent(name: 'Breadcrumb', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (_) => UuBreadcrumb(items: [UuBreadcrumbItem('Trang chủ', onTap: () {}), UuBreadcrumbItem('Khách hàng', onTap: () {}), const UuBreadcrumbItem('Công ty A')])),
            WidgetbookUseCase(name: 'Rút gọn "…"', builder: (_) => UuBreadcrumb(items: [UuBreadcrumbItem('Trang chủ', onTap: () {}), UuBreadcrumbItem('Khách hàng', onTap: () {}), UuBreadcrumbItem('Miền Bắc', onTap: () {}), UuBreadcrumbItem('Hà Nội', onTap: () {}), const UuBreadcrumbItem('Công ty A')])),
          ]),
          WidgetbookComponent(name: 'SideNav', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(height: 480, child: _Stateful<String>('kh', (v, set) => UuSideNav(
                  // Bỏ trống → theo layout của theme (chọn theme "Collapsed" để xem).
                  collapsed: ctx.knobs.boolean(label: 'collapsed (prop)') ? true : null,
                  children: [
                    UuSideNavItem(label: 'Trang chủ', icon: 'texture', active: v == 'home', onTap: () => set('home')),
                    const UuSideNavSection(title: 'Quản lý'),
                    UuSideNavItem(label: 'Khách hàng', icon: 'texture', chevron: true, active: v == 'kh', onTap: () => set('kh')),
                    UuSideNavItem(label: 'Danh sách', level: 2, active: v == 'ds', onTap: () => set('ds')),
                  ],
                )))),
          ]),
        ]),
        WidgetbookFolder(name: 'Chứa đựng', children: [
          WidgetbookComponent(name: 'BottomSheet', useCases: [
            WidgetbookUseCase(name: 'CardSheet', builder: (ctx) => SizedBox(width: 366, child: UuCardSheet(header: 'Header', onBack: ctx.knobs.boolean(label: 'Navigation=Back') ? () {} : null, cta: const UuButtonGroup(primary: UuGroupAction('Xác nhận'), secondary: UuGroupAction('Huỷ')), child: const Text('Nội dung đặt vào Slot.')))),
            WidgetbookUseCase(name: 'Mở sheet', builder: (ctx) => Builder(builder: (c) => UuTextButton(label: 'Mở sheet', onPressed: () => showUuBottomSheet(c, header: 'Xoá tài khoản', builder: (_) => const Text('Nội dung'), cta: const UuButtonGroup(primary: UuGroupAction('Xoá tài khoản'), secondary: UuGroupAction('Huỷ')))))),
          ]),
          WidgetbookComponent(name: 'Dialog', useCases: [
            WidgetbookUseCase(name: 'CardDialog', builder: (_) => const UuCardDialog(width: 384, buttonGroup: UuButtonGroup(primary: UuGroupAction('Đã hiểu')), child: Text('Huỷ đơn hàng?'))),
            WidgetbookUseCase(name: 'CardDialog · Banner', builder: (ctx) => UuCardDialog(
                  width: 384,
                  banner: _placeholderImage, // ảnh mẫu 1×1 — màn thật truyền ảnh 16:9
                  bannerLabel: 'Ảnh quà tặng',
                  closeButton: ctx.knobs.boolean(label: 'Close button', initialValue: true),
                  buttonGroup: const UuButtonGroup(primary: UuGroupAction('Nhận quà')),
                  child: const Text('Bạn có một phần quà mới'),
                )),
            WidgetbookUseCase(name: 'Mở dialog', builder: (ctx) => Builder(builder: (c) => UuTextButton(label: 'Mở dialog', onPressed: () => showUuDialog(c, builder: (_) => const Text('Huỷ đơn hàng?'), buttonGroup: const UuButtonGroup(primary: UuGroupAction('Huỷ đơn'), secondary: UuGroupAction('Giữ lại')))))),
          ]),
          WidgetbookComponent(name: 'SideSheet', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(height: 560, child: UuSideSheet(
                  title: 'Chi tiết khách hàng',
                  type: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'type', options: UuSideSheetType.values),
                  onClose: () {},
                  primaryLabel: ctx.knobs.boolean(label: 'footer', initialValue: true) ? 'Lưu' : null,
                  secondaryLabel: 'Huỷ',
                  children: const [Text('Nội dung đặt vào Body.')],
                ))),
            WidgetbookUseCase(name: 'Mở side sheet', builder: (ctx) => Builder(builder: (c) => UuTextButton(label: 'Mở side sheet', onPressed: () => showUuSideSheet(c, title: 'Chi tiết', builder: (_) => const Text('Nội dung'), primaryLabel: 'Lưu', secondaryLabel: 'Huỷ')))),
          ]),
          WidgetbookComponent(name: 'Popover', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (_) => UuPopover(title: 'Đổi tên', onClose: () {}, primaryLabel: 'Lưu', secondaryLabel: 'Huỷ', child: const UuTextInput())),
            WidgetbookUseCase(name: 'Mở popover', builder: (ctx) => Builder(builder: (c) => UuTextButton(label: 'Mở popover', onPressed: () => showUuPopover(c, title: 'Đổi tên', builder: (_) => const UuTextInput(), primaryLabel: 'Lưu', secondaryLabel: 'Huỷ')))),
          ]),
        ]),
        WidgetbookFolder(name: 'Dữ liệu', children: [
          WidgetbookComponent(name: 'ListItem', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 390, child: UuListItem(
                  title: ctx.knobs.string(label: 'title', initialValue: 'Địa chỉ giao hàng'),
                  description: ctx.knobs.boolean(label: 'description', initialValue: true) ? '12 Lý Thường Kiệt, Hoàn Kiếm' : null,
                  leading: ctx.knobs.boolean(label: 'leading', initialValue: true) ? const UuListIconContainer('texture') : null,
                  trailing: ctx.knobs.boolean(label: 'chevron', initialValue: true) ? const UuListChevron() : null,
                  disabled: ctx.knobs.boolean(label: 'disabled'),
                  divider: ctx.knobs.boolean(label: 'divider'),
                  onTap: () {},
                ))),
            WidgetbookUseCase(name: 'Trailing', builder: (ctx) => SizedBox(width: 390, child: Column(mainAxisSize: MainAxisSize.min, children: [
              UuListItem(title: 'Ngôn ngữ', trailing: const Row(mainAxisSize: MainAxisSize.min, children: [UuListValue('Tiếng Việt'), UuListChevron()]), onTap: () {}, divider: true),
              _Stateful<bool>(true, (v, set) => UuListItem(title: 'Nhận thông báo', selection: UuListSelection.switcher(checked: v, onChanged: set), divider: true)),
              _Stateful<bool?>(false, (v, set) => UuListItem(title: 'Ghi nhớ đăng nhập', selection: UuListSelection.checkbox(checked: v, onChanged: set), divider: true)),
              _Stateful<bool?>(true, (v, set) => UuListItem(title: 'Giao tiêu chuẩn', description: '3–5 ngày, miễn phí', selection: UuListSelection.radio(checked: v ?? false, onChanged: set), divider: true)),
              UuListItem(title: 'Ví điện tử', leading: const UuListIconContainer('texture'), action: UuListAction(icon: 'xmark', label: 'Gỡ ví', onPressed: () {})),
            ]))),
            WidgetbookUseCase(name: 'State', builder: (ctx) => SizedBox(width: 390, child: Column(mainAxisSize: MainAxisSize.min, children: [
              UuListItem(title: 'Default', onTap: () {}, trailing: const UuListChevron()),
              UuListItem(title: 'Hover', forced: UuForcedState.hover, onTap: () {}, trailing: const UuListChevron()),
              UuListItem(title: 'Pressed', forced: UuForcedState.pressed, onTap: () {}, trailing: const UuListChevron()),
              UuListItem(title: 'Focus', forced: UuForcedState.focus, onTap: () {}, trailing: const UuListChevron()),
              const UuListItem(title: 'Disabled', disabled: true, trailing: UuListChevron()),
            ]))),
          ]),
          WidgetbookComponent(name: 'ListGroup', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => Container(width: 390, padding: const EdgeInsets.all(UuGap.g4), color: UuTheme.of(ctx).colors.backgroundSubtle, child: UuListGroup(
                  title: ctx.knobs.boolean(label: 'title', initialValue: true) ? 'Tài khoản' : null,
                  children: [
                    UuListItem(title: 'Thông tin cá nhân', leading: const UuListIconContainer('texture'), trailing: const UuListChevron(), onTap: () {}),
                    UuListItem(title: 'Địa chỉ', leading: const UuListIconContainer('texture'), trailing: const UuListChevron(), onTap: () {}),
                    UuListItem(title: 'Ngôn ngữ', leading: const UuListIconContainer('texture'), trailing: const Row(mainAxisSize: MainAxisSize.min, children: [UuListValue('Tiếng Việt'), UuListChevron()]), onTap: () {}),
                  ],
                ))),
          ]),
          WidgetbookComponent(name: 'Table', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (_) => SizedBox(width: 720, child: UuTable(
                  columns: const [
                    UuTableColumn(width: UuTableCell.checkboxWidth),
                    UuTableColumn(label: 'Khách hàng', flex: 2, sort: UuTableSort.ascending),
                    UuTableColumn(label: 'Mã', sort: UuTableSort.unsorted),
                    UuTableColumn(label: 'Doanh thu', align: UuTableAlign.right, sort: UuTableSort.unsorted),
                    UuTableColumn(label: ''),
                  ],
                  rows: [
                    for (final (i, name) in ['Công ty A', 'Công ty B', 'Công ty C'].indexed)
                      UuTableRow(selected: i == 1, cells: [
                        UuTableCell(type: UuTableCellType.checkbox, checked: i == 1, onCheckedChanged: (_) {}),
                        UuTableCell(content: name),
                        UuTableCell(content: 'KH-00${i + 1}', type: UuTableCellType.secondary),
                        UuTableCell(content: '${(i + 1) * 400}.000 ₫', type: UuTableCellType.number),
                        UuTableCell(type: UuTableCellType.actions, actionLabel: 'Xem', onAction: () {}, onMore: () {}),
                      ]),
                  ],
                ))),
          ]),
          WidgetbookComponent(name: 'TableHeaderCell', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 200, child: UuTableHeaderCell(
                  label: ctx.knobs.string(label: 'label', initialValue: 'Doanh thu'),
                  sort: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'sort', options: UuTableSort.values, initialOption: UuTableSort.unsorted),
                  align: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'align', options: UuTableAlign.values),
                  onSort: () {},
                ))),
            WidgetbookUseCase(name: 'Type=Checkbox', builder: (ctx) => _Stateful<bool?>(false, (v, set) => SizedBox(width: UuTableCell.checkboxWidth, child: UuTableHeaderCell(type: UuTableHeaderCellType.checkbox, checked: v, onCheckedChanged: set)))),
          ]),
          WidgetbookComponent(name: 'TablePagination', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 720, child: _Stateful<int>(1, (v, set) => UuTablePagination(page: v, pageCount: 5, totalRows: 120, onPageChanged: set, rowsPerPage: ctx.knobs.boolean(label: 'Rows per page', initialValue: true))))),
          ]),
          WidgetbookComponent(name: 'KPICard', useCases: [
            WidgetbookUseCase(name: '3 trend', builder: (_) => const SizedBox(width: 720, child: Row(children: [
              Expanded(child: UuKPICard(label: 'Doanh thu', value: '1,2 tỷ ₫', trend: UuKpiTrend.up, delta: '+12% so với tháng trước')),
              SizedBox(width: UuGap.g3),
              Expanded(child: UuKPICard(label: 'Đơn huỷ', value: '38', trend: UuKpiTrend.down, delta: '−4%')),
              SizedBox(width: UuGap.g3),
              Expanded(child: UuKPICard(label: 'Khách mới', value: '214')),
            ]))),
          ]),
        ]),
        WidgetbookFolder(name: 'Giao tiếp', children: [
          WidgetbookComponent(name: 'Tooltip', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => UuTooltip(
                  text: 'Xoá hàng',
                  placement: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'placement', options: UuTooltipPlacement.values),
                  open: ctx.knobs.boolean(label: 'open', initialValue: true),
                  child: UuIconButton(icon: 'xmark', label: 'Xoá', tone: UuButtonTone.neutral, type: UuButtonType.ghost, onPressed: () {}),
                )),
          ]),
          WidgetbookComponent(name: 'Toast', useCases: [
            WidgetbookUseCase(name: '4 type', builder: (_) => SizedBox(width: 428, child: Column(mainAxisSize: MainAxisSize.min, children: [
              for (final t in UuToastType.values) Padding(padding: const EdgeInsets.only(bottom: UuGap.g3), child: UuToast(type: t, content: 'Đã lưu thay đổi', actionLabel: 'Hoàn tác', onAction: () {}, onClose: () {})),
            ]))),
            WidgetbookUseCase(name: 'Hiện ở đáy', builder: (ctx) => Builder(builder: (c) => UuTextButton(label: 'Lưu', onPressed: () => showUuToast(c, content: 'Đã lưu thay đổi', actionLabel: 'Hoàn tác', onAction: () {})))),
            WidgetbookUseCase(name: 'Trên bottom sheet', builder: (ctx) => Builder(builder: (c) => UuTextButton(label: 'Mở sheet', onPressed: () => showUuBottomSheet(c, header: 'Chia sẻ', builder: (sc) => UuTextButton(label: 'Sao chép liên kết', type: UuButtonType.outline, onPressed: () => showUuToast(sc, content: 'Đã sao chép liên kết')))))),
          ]),
          WidgetbookComponent(name: 'Badge', useCases: [
            WidgetbookUseCase(name: '4 tone', builder: (_) => const Wrap(spacing: UuGap.g3, children: [
              UuBadge(label: 'Mới'), UuBadge(label: 'Đã giao', tone: UuTone.success), UuBadge(label: 'Sắp hết hạn', tone: UuTone.warning), UuBadge(label: 'Đã huỷ', tone: UuTone.error),
            ])),
          ]),
          WidgetbookComponent(name: 'StatusIndicator', useCases: [
            WidgetbookUseCase(name: 'Ma trận', builder: (_) => Column(mainAxisSize: MainAxisSize.min, children: [
              for (final filled in [false, true]) Padding(padding: const EdgeInsets.only(bottom: UuGap.g3), child: Wrap(spacing: UuGap.g4, children: [
                for (final t in UuTone.values) UuStatusIndicator(label: 'Status', tone: t, filled: filled),
              ])),
            ])),
          ]),
          WidgetbookComponent(name: 'NotificationBadge', useCases: [
            WidgetbookUseCase(name: 'Count · Dot', builder: (_) => const Wrap(spacing: UuGap.g3, crossAxisAlignment: WrapCrossAlignment.center, children: [
              UuNotificationBadge(count: '9', semanticLabel: '9 thông báo mới'), UuNotificationBadge(count: '12'), UuNotificationBadge(semanticLabel: 'Có thông báo mới'),
            ])),
          ]),
          WidgetbookComponent(name: 'CardPushNotification', useCases: [
            WidgetbookUseCase(name: 'Thẻ', builder: (ctx) => SizedBox(width: 366, child: UuCardPushNotification(title: 'Đơn hàng đã giao', content: 'Đơn #DH-1024 đã đến nơi. Chạm để xem chi tiết.', onTap: () {}))),
            WidgetbookUseCase(name: 'Hiện từ đỉnh', builder: (ctx) => Builder(builder: (c) => UuTextButton(label: 'Gửi thông báo', onPressed: () => showUuPushNotification(c, title: 'Bạn có quà mới', content: 'Mã giảm 50.000 ₫ cho đơn đầu tiên')))),
          ]),
          WidgetbookComponent(name: 'Spinner', useCases: [WidgetbookUseCase(name: '18×18', builder: (_) => const UuSpinner())]),
        ]),
        WidgetbookFolder(name: 'Màn · Khối trạng thái', children: [
          WidgetbookComponent(name: 'EmptySection', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 390, child: UuEmptySection(
                  title: 'Chưa có đơn hàng',
                  description: 'Đơn bạn đặt sẽ hiện ở đây.',
                  actionLabel: ctx.knobs.boolean(label: 'Action', initialValue: true) ? 'Khám phá' : null,
                  onAction: () {},
                ))),
          ]),
          WidgetbookComponent(name: 'ErrorSection', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 390, child: UuErrorSection(title: 'Không tải được danh sách', description: 'Kiểm tra kết nối rồi thử lại.', onRetry: () {}))),
          ]),
          WidgetbookComponent(name: 'EmptyScreen', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 390, height: 844, child: UuEmptyScreen(
                  screenTitle: 'Yêu thích',
                  title: 'Chưa có mục yêu thích',
                  description: 'Bấm tim ở khách sạn bạn thích để lưu lại.',
                  onBack: () {},
                  actionLabel: ctx.knobs.boolean(label: 'Action', initialValue: true) ? 'Khám phá' : null,
                  onAction: () {},
                ))),
          ]),
          WidgetbookComponent(name: 'ResultScreen', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 390, height: 844, child: UuResultScreen(
                  title: 'Đặt phòng thành công',
                  description: 'Mã đặt phòng đã gửi vào email của bạn.',
                  primary: const UuGroupAction('Xem đơn'),
                  secondary: ctx.knobs.boolean(label: 'secondary', initialValue: true) ? const UuGroupAction('Về trang chủ') : null,
                ))),
          ]),
          WidgetbookComponent(name: 'ErrorScreen', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => SizedBox(width: 390, height: 844, child: UuErrorScreen(title: 'Không tải được trang', description: 'Kiểm tra kết nối rồi thử lại.', onRetry: () {}))),
          ]),
        ]),
        WidgetbookFolder(name: 'Icon', children: [
          WidgetbookComponent(name: 'UuIcon', useCases: [
            WidgetbookUseCase(name: 'Playground', builder: (ctx) => UuIcon(ctx.knobs.string(label: 'name', initialValue: 'texture'), variant: ctx.knobs.object.dropdown(labelBuilder: _n, label: 'variant', options: UuIconVariant.values), size: ctx.knobs.double.slider(label: 'size', initialValue: 24, min: 16, max: 48))),
          ]),
        ]),
      ],
    );
  }
}

class _Stateful<T> extends StatefulWidget {
  const _Stateful(this.initial, this.builder, {super.key});
  final T initial;
  final Widget Function(T value, ValueChanged<T> set) builder;
  @override
  State<_Stateful<T>> createState() => _StatefulState<T>();
}

class _StatefulState<T> extends State<_Stateful<T>> {
  late T v = widget.initial;
  @override
  Widget build(BuildContext context) => widget.builder(v, (x) => setState(() => v = x));
}

class _ButtonMatrix extends StatelessWidget {
  const _ButtonMatrix();
  @override
  Widget build(BuildContext context) {
    final c = UuTheme.of(context).colors;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(UuGap.g4),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        for (final tone in UuButtonTone.values)
          for (final inverted in [false, true])
            Container(
              margin: const EdgeInsets.only(bottom: UuGap.g2), padding: const EdgeInsets.all(UuGap.g3),
              decoration: BoxDecoration(color: inverted ? c.backgroundInverted : c.backgroundMuted, borderRadius: BorderRadius.circular(UuRadius.lg)),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                for (final type in UuButtonType.values)
                  if (type != UuButtonType.tonal || (tone == UuButtonTone.neutral && !inverted)) Padding(padding: const EdgeInsets.only(bottom: UuGap.g2), child: Wrap(spacing: UuGap.g4, runSpacing: UuGap.g2, children: [
                    for (final st in UuButtonState.values) UuTextButton(label: 'Action', tone: tone, type: type, inverted: inverted, state: st, onPressed: () {}),
                  ])),
              ]),
            ),
      ]),
    );
  }
}

/// Knob type của TextButton: Tonal chỉ hợp lệ với tone Neutral, không Inverted.
UuButtonType _validType(UuButtonType t, BuildContext ctx) {
  if (t != UuButtonType.tonal) return t;
  final tone = ctx.knobs.object.dropdown(labelBuilder: _n, label: 'tone', options: UuButtonTone.values);
  final inverted = ctx.knobs.boolean(label: 'inverted');
  return tone == UuButtonTone.neutral && !inverted ? t : UuButtonType.solid;
}

String _n(Object? e) => e is Enum ? e.name : '$e';

const _cities = [
  UuMenuOption(value: 'hn', label: 'Hà Nội'),
  UuMenuOption(value: 'hp', label: 'Hải Phòng'),
  UuMenuOption(value: 'dn', label: 'Đà Nẵng'),
  UuMenuOption(value: 'hcm', label: 'TP. Hồ Chí Minh'),
  UuMenuOption(value: 'ct', label: 'Cần Thơ', disabled: true),
];

/// Chip `Type=Dropdown` + Menu `Type=Multiple`: mở → chip chevron-up; nhãn "{Tên} · n" khi đã lọc.
class _ChipMenuDemo extends StatefulWidget {
  const _ChipMenuDemo();
  @override
  State<_ChipMenuDemo> createState() => _ChipMenuDemoState();
}

class _ChipMenuDemoState extends State<_ChipMenuDemo> {
  bool open = false;
  Set<String> values = {};
  Set<String> draft = {};

  @override
  Widget build(BuildContext context) {
    return Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
      UuChip(
        label: values.isEmpty ? 'Khu vực' : 'Khu vực · ${values.length}',
        type: UuChipType.dropdown,
        selected: values.isNotEmpty,
        open: open,
        onSelectedChanged: (_) => setState(() { open = !open; draft = {...values}; }),
      ),
      if (open) ...[
        const SizedBox(height: UuGap.g1),
        SizedBox(
          width: UuSize.s60,
          child: UuMenu<String>(
            options: _cities,
            type: UuMenuItemType.multiple,
            values: draft,
            onValuesChanged: (v) => setState(() => draft = v),
            footer: true,
            onApply: () => setState(() { values = draft; open = false; }),
          ),
        ),
      ],
    ]);
  }
}

/// SearchInput + panel gợi ý: rỗng → lịch sử, gõ → gợi ý (giả lập loading 600 ms).
class _SearchDemo extends StatefulWidget {
  const _SearchDemo({required this.flat});
  final bool flat;
  @override
  State<_SearchDemo> createState() => _SearchDemoState();
}

class _SearchDemoState extends State<_SearchDemo> {
  final ctrl = TextEditingController();
  final focus = FocusNode();
  List<String> recent = ['Đà Lạt', 'Phú Quốc'];
  bool loading = false;
  static const all = ['Hà Nội', 'Hạ Long', 'Hà Giang', 'Hội An', 'Huế'];

  @override
  void initState() {
    super.initState();
    focus.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    ctrl.dispose();
    focus.dispose();
    super.dispose();
  }

  void _changed(String q) {
    setState(() => loading = q.isNotEmpty);
    Future.delayed(const Duration(milliseconds: 600), () { if (mounted) setState(() => loading = false); });
  }

  @override
  Widget build(BuildContext context) {
    final q = ctrl.text;
    final hits = loading ? <String>[] : all.where((x) => x.toLowerCase().contains(q.toLowerCase())).toList();
    return Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      UuSearchInput(controller: ctrl, focusNode: focus, placeholder: 'Tìm điểm đến', loading: loading, cancel: widget.flat, onChanged: _changed, onCancel: () => setState(() {})),
      if (focus.hasFocus && UuSearchSuggestions.hasContent(query: q, recent: recent, suggestions: hits)) ...[
        const SizedBox(height: UuGap.g1),
        UuSearchSuggestions(
          query: q,
          recent: recent,
          suggestions: hits,
          flat: widget.flat,
          onClearRecent: () => setState(() => recent = []),
          onSelect: (v) => setState(() { ctrl.text = v; focus.unfocus(); }),
        ),
      ],
    ]);
  }
}

final _placeholderImage = MemoryImage(Uint8List.fromList(const [
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01,
  0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x44, 0x41,
  0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82,
]));
