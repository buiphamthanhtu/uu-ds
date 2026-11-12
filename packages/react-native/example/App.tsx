import { useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
// Icon minh hoạ (gear, heart…) gắn như bộ icon DNA, không nằm trong package uu-ds-native.
import { demoIcons } from './demoIcons.g';
import {
  UuBadge, UuBottomBar, UuBottomSheet, UuBreadcrumb, UuButtonGroup, UuCheckboxInput, UuChip, UuDateInput, UuDialog, UuDropdown,
  UuEmptySection, UuFeedbackHost, UuListGroup, UuListIconContainer, UuListItem, UuListValue, UuIconButton, UuKPICard, UuMenu, UuNavigationBar, UuNotificationBadge, UuOTPInput, UuPagination,
  UuPopover, UuPopoverAnchor, UuProvider, UuRadioList, UuSearchInput, UuSegmentedControl, UuStatusIndicator, UuSwitch, UuTabBar,
  UuTable, UuTableCell, UuTablePagination, UuTableRow, UuTextArea, UuTextButton, UuTextButtonDanger, UuTextInput, UuToast,
  UuToggleButton, showUuPushNotification, showUuToast, useUu, type UuBrand, type UuDensity,
} from 'uu-ds-native';

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { colors: c, text } = useUu();
  return (
    <View style={{ gap: 12, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: c.borderMuted }}>
      <Text accessibilityRole="header" style={[text.titleSm, { color: c.objectSecondary }]}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

const Row = ({ children }: { children: ReactNode }) => <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>{children}</View>;

function Gallery({ brand, setBrand, density, setDensity }: { brand: UuBrand; setBrand: (b: UuBrand) => void; density: UuDensity; setDensity: (d: UuDensity) => void }) {
  const { colors: c } = useUu();
  const [on, setOn] = useState(true);
  const [check, setCheck] = useState<boolean | null>(null);
  const [radio, setRadio] = useState('a');
  const [chip, setChip] = useState(true);
  const [chipOpen, setChipOpen] = useState(false);
  const [city, setCity] = useState<string | undefined>();
  const [ddOpen, setDdOpen] = useState(false);
  const [q, setQ] = useState('');
  const [otp, setOtp] = useState('12');
  const [tab, setTab] = useState(0);
  const [nav, setNav] = useState('home');
  const [page, setPage] = useState(3);
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [pop, setPop] = useState(false);
  const [rows, setRows] = useState<string[]>(['a']);
  const cities = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.backgroundMuted }} edges={['top']}>
      <UuNavigationBar title="UU DS Native" subActionIcon="gear" subActionLabel="Cài đặt" />
      {/* Giữ ô đang gõ trên bàn phím: Android edge-to-edge không tự co màn → KeyboardAvoidingView;
          iOS → ScrollView tự thêm inset và cuộn tới ô đang gõ. */}
      <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'android'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
        <Section title="Theme">
          <UuSegmentedControl items={[{ value: 'default', label: 'Default' }, { value: 'uu', label: 'UU' }]} value={brand} onChange={setBrand} />
          <UuSegmentedControl items={[{ value: 'touch', label: 'Touch' }, { value: 'compact', label: 'Compact' }]} value={density} onChange={setDensity} />
        </Section>

        <Section title="Button">
          <Row>
            <UuTextButton label="Lưu" onPress={() => showUuToast({ content: 'Đã lưu thay đổi', type: 'positive' })} />
            <UuTextButton label="Huỷ" tone="neutral" type="outline" />
            <UuTextButton label="Đang lưu" state="loading" />
            <UuTextButton label="Tắt" state="disabled" />
            <UuTextButton label="Thêm" type="outline" prefixIcon="plus" />
          </Row>
          <Row>
            <UuTextButtonDanger label="Xoá" onPress={() => setDialog(true)} />
            <UuIconButton icon="heart" label="Thích" tone="neutral" type="tonal" />
            <UuToggleButton active={on} onToggle={setOn} icon="star" label="Theo dõi" activeLabel="Đang theo dõi" />
          </Row>
        </Section>

        <Section title="List">
          <UuListGroup title="Cài đặt">
            <UuListItem title="Thông tin cá nhân" leading={<UuListIconContainer icon="user" />} trailing="chevron" onPress={() => showUuToast({ content: 'Mở Thông tin cá nhân' })} />
            <UuListItem title="Thông báo đẩy" description="Đơn hàng, khuyến mãi" selection={{ type: 'switch', checked: on, onChange: setOn }} />
            <UuListItem title="Ngôn ngữ" trailing={<UuListValue>Tiếng Việt</UuListValue>} onPress={() => {}} />
            <UuListItem title="Nhà riêng" description="12 Nguyễn Huệ, Quận 1" leading={<UuListIconContainer icon="location" />} action={{ icon: 'pen', label: 'Sửa', onPress: () => showUuToast({ content: 'Sửa địa chỉ' }) }} onPress={() => {}} />
          </UuListGroup>
        </Section>

        <Section title="Selection">
          <Row>
            <UuSwitch checked={on} onChange={setOn} accessibilityLabel="Thông báo" />
            <UuChip label="Còn hàng" selected={chip} onSelectedChange={setChip} />
            <UuChip label="Gỡ được" type="input" onRemove={() => {}} />
          </Row>
          <UuCheckboxInput checked={check} label="Chọn tất cả (Indeterminate)" onChange={(v) => setCheck(v)} />
          <UuRadioList options={[{ value: 'a', label: 'Giao tiêu chuẩn' }, { value: 'b', label: 'Giao nhanh' }, { value: 'c', label: 'Tự đến lấy', disabled: true }]} value={radio} onChange={setRadio} />
        </Section>

        <Section title="Field">
          <UuTextInput label="Họ tên" requirement="required" placeholder="Nhập họ tên" />
          <UuTextInput label="Email" placeholder="ten@vidu.com" error errorMessage="Email chưa đúng định dạng" defaultValue="ten@" />
          <UuSearchInput value={q} onChangeText={setQ} recent={['áo khoác', 'giày chạy']} suggestions={cities.filter((x) => x.toLowerCase().includes(q.toLowerCase()))} onSelectSuggestion={setQ} />
          <UuDropdown
            label="Thành phố"
            value={city}
            open={ddOpen}
            onOpen={() => setDdOpen(true)}
            onClose={() => setDdOpen(false)}
            menu={<UuMenu groups={[{ title: 'Miền Bắc', options: [{ value: 'Hà Nội', label: 'Hà Nội' }, { value: 'Hải Phòng', label: 'Hải Phòng' }] }, { title: 'Miền Nam', options: [{ value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' }, { value: 'Cần Thơ', label: 'Cần Thơ' }] }]} value={city} onSelect={setCity} />}
          />
          <UuDateInput label="Ngày sinh" value={new Date(1995, 4, 12)} />
          <UuTextArea label="Ghi chú" />
          <UuOTPInput value={otp} onChange={setOtp} />
        </Section>

        <Section title="Navigation">
          <UuTabBar items={[{ value: 0, label: 'Tất cả' }, { value: 1, label: 'Đang giao', badge: true }, { value: 2, label: 'Đã giao' }]} value={tab} onChange={setTab} />
          <UuBreadcrumb items={[{ label: 'Trang chủ' }, { label: 'Đơn hàng' }, { label: 'Tháng 11' }, { label: 'Tuần 2' }, { label: '#1024' }]} />
          <Row>
            <UuPagination position="middle" />
            <UuChip label="Bộ lọc" type="dropdown" open={chipOpen} onSelectedChange={() => setChipOpen((o) => !o)} />
          </Row>
        </Section>

        <Section title="Feedback">
          <Row>
            <UuBadge label="Mặc định" />
            <UuBadge label="Đã giao" tone="success" />
            <UuBadge label="Chờ duyệt" tone="warning" />
            <UuBadge label="Lỗi" tone="error" />
          </Row>
          <Row>
            <UuStatusIndicator label="Trực tuyến" tone="success" />
            <UuStatusIndicator label="Mới" tone="highlight" filled />
            <UuNotificationBadge count="3" />
            <UuNotificationBadge />
          </Row>
          <UuToast content="Không kết nối được máy chủ" type="negative" actionLabel="Thử lại" />
          <Row>
            <UuTextButton label="Mở sheet" tone="neutral" type="outline" size="small" onPress={() => setSheet(true)} />
            <UuTextButton label="Push" tone="neutral" type="outline" size="small" onPress={() => showUuPushNotification({ title: 'Đơn #1024 đã giao', content: 'Bấm để xem chi tiết đơn hàng.' })} />
            <UuPopoverAnchor open={pop} onClose={() => setPop(false)} popover={<UuPopover title="Lọc nhanh" onClose={() => setPop(false)} primaryLabel="Áp dụng" onPrimary={() => setPop(false)}><Text>Nội dung popover</Text></UuPopover>}>
              <UuTextButton label="Popover" tone="neutral" type="outline" size="small" onPress={() => setPop(true)} />
            </UuPopoverAnchor>
          </Row>
          <UuEmptySection title="Chưa có đơn hàng" description="Đơn bạn đặt sẽ hiện ở đây." actionLabel="Mua sắm ngay" />
        </Section>

        <Section title="Data">
          <Row>
            <View style={{ flex: 1 }}><UuKPICard label="Doanh thu" value="12,4 tr" trend="up" delta="+8%" onPress={() => {}} /></View>
            <View style={{ flex: 1 }}><UuKPICard label="Tỉ lệ huỷ" value="3,1%" trend="up" delta="+0,4%" polarity="inverse" /></View>
          </Row>
          {/* Bảng + phân trang là component desktop: trên điện thoại màn tự bọc cuộn ngang. */}
          <ScrollView horizontal contentContainerStyle={{ width: 560 }}>
          <View style={{ flex: 1 }}>
          <UuTable columns={[{ type: 'checkbox', checked: rows.length === 2 ? true : rows.length ? null : false, onCheckedChange: (v) => setRows(v ? ['a', 'b'] : []) }, { label: 'Đơn', sort: 'ascending', onSort: () => {} }, { label: 'Trạng thái', flex: 1.4 }, { label: 'Tổng', align: 'right' }]}>
            {[['a', '#1024', 'success', 'Đã giao', '320.000'], ['b', '#1025', 'warning', 'Đang giao', '1.150.000']].map(([id, no, tone, st, sum]) => (
              <UuTableRow
                key={id}
                selected={rows.includes(id)}
                cells={[
                  <UuTableCell type="checkbox" checked={rows.includes(id)} onCheckedChange={(v) => setRows(v ? [...rows, id] : rows.filter((x) => x !== id))} />,
                  <UuTableCell content={no} />,
                  <UuTableCell type="status" content={st} statusTone={tone as 'success'} />,
                  <UuTableCell type="number" content={sum} />,
                ]}
              />
            ))}
          </UuTable>
          <UuTablePagination page={page} pageCount={12} onPageChange={setPage} totalRows={120} />
          </View>
          </ScrollView>
        </Section>
      </ScrollView>
      </KeyboardAvoidingView>

      <View style={{ position: 'absolute', left: 12, right: 12, bottom: 24 }}>
        <UuBottomBar
          items={[{ value: 'home', label: 'Trang chủ', icon: 'house' }, { value: 'orders', label: 'Đơn hàng', icon: 'receipt', badge: '2' }, { value: 'me', label: 'Tài khoản', icon: 'user' }]}
          value={nav}
          onChange={setNav}
        />
      </View>

      <UuBottomSheet visible={sheet} header="Chọn phương thức" onClose={() => setSheet(false)} handle cta={<UuButtonGroup primary={{ label: 'Xác nhận', onPress: () => setSheet(false) }} secondary={{ label: 'Huỷ', onPress: () => setSheet(false) }} />}>
        <UuRadioList options={[{ value: 'a', label: 'Tiền mặt' }, { value: 'b', label: 'Chuyển khoản' }]} value={radio} onChange={setRadio} />
      </UuBottomSheet>
      <UuDialog visible={dialog} onClose={() => setDialog(false)} buttonGroup={<UuButtonGroup tone="danger" primary={{ label: 'Xoá', onPress: () => setDialog(false) }} secondary={{ label: 'Huỷ', onPress: () => setDialog(false) }} />}>
        <Text style={{ fontSize: 16 }}>Xoá đơn #1024? Không hoàn tác được.</Text>
      </UuDialog>
      <UuFeedbackHost />
    </SafeAreaView>
  );
}

export default function App() {
  const [brand, setBrand] = useState<UuBrand>('default');
  const [density, setDensity] = useState<UuDensity>('touch');
  return (
    <SafeAreaProvider>
      <UuProvider brand={brand} density={density} icons={demoIcons}>
        <StatusBar style="dark" />
        <Gallery brand={brand} setBrand={setBrand} density={density} setDensity={setDensity} />
      </UuProvider>
    </SafeAreaProvider>
  );
}
