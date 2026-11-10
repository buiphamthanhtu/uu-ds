# uu-ds-native

ÚÙ Design System cho React Native / Expo. Cùng nguồn với bản web và Flutter: token sinh từ `docs/tokens.json`, component theo `docs/design-system.md`, UU icon công khai từ `src/icons/svg`.

Phạm vi bằng bản Flutter `packages/flutter/uu_ds_flutter`. Tên component cùng tên bản Flutter (`UuTextButton`…), prop cùng tên bản web (`tone`, `type`, `inverted`, `size`, `state`, `error`, `disabled`).

## Cài

Gói dùng thẳng mã nguồn TypeScript (không build). Yêu cầu: React 19, React Native ≥ 0.76 (Expo SDK ≥ 52), `react-native-svg`, `react-native-safe-area-context`.

```bash
npx expo install react-native-svg react-native-safe-area-context
npm i "github:buiphamthanhtu/uu-ds#native-v1.0.0"   # repo công khai, nhánh native
```

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UuProvider, UuFeedbackHost, UuTextButton } from 'uu-ds-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <UuProvider brand="default" density="touch">
        <Home />
        <UuFeedbackHost />{/* con cuối của view phủ toàn màn: Toast, Push, panel gợi ý SearchInput */}
      </UuProvider>
    </SafeAreaProvider>
  );
}
```

Desktop / tablet / web: `density="compact"`. Thu gọn chỉ còn icon: `layout="collapsed"`. Đổi một vùng: bọc vùng đó trong `<UuProvider density="compact">`, vùng con kế thừa phần không truyền.

## Token

| Lấy ở đâu | Nội dung |
|---|---|
| `useUu().colors` | 57 token semantic của brand hiện tại — component **chỉ** đọc màu ở đây |
| `useUu().sizes` · `useUu().text` | kích thước control và text style theo density — không gõ cứng 56 / 48 / 32 |
| `tokens.gap` · `tokens.size` · `tokens.radius` · `tokens.opacity` · `tokens.elevation` | thang khoảng cách, kích thước, bo góc, opacity, bóng (`boxShadow`) |
| `tokens.primitiveColors` | primitive — chỉ để định nghĩa semantic, không dùng trong component |

Sinh lại khi `tokens.json` đổi: `npm run tokens:rn` ở gốc repo → `src/tokens.g.ts`. Icon: `npm run rn:icons` → `src/icons.g.ts` (chỉ icon công khai; tên sai TypeScript báo lỗi).

## Product DNA (spec 4.3)

Style riêng của sản phẩm khai một lần ở `UuProvider`, component không đổi dòng nào. Vùng con kế thừa DNA của vùng cha.

```tsx
<UuProvider
  dna={{
    colors: { backgroundInteractive: '#…' },            // 23 token thương hiệu
    radius: { xl4: 12, lg: 8 },                        // nút / chip · thẻ, ô nhập
    elevation: {
      medium: '4px 4px 0px 0px #111',                  // blur 0 = bóng cứng
      none: '2px 2px 0px 2px #111',                    // bóng control; spread = độ dày viền, không thì bị viền che
    },
    fontFamily: {
      display: 'Baloo2_700Bold',
      body: { '400': 'Inter_400Regular', '500': 'Inter_500Medium', '600': 'Inter_600SemiBold', '700': 'Inter_700Bold' },
    },
    borderOuter: { width: 2, color: '#111' },          // viền ngoài control + thẻ, mặc định không có
  }}
  icons={myIcons}                                      // bộ icon riêng, xem dưới
>
```

- **Font**: chỉ đổi họ font; cỡ, line-height, độ đậm giữ thang. `body` là một tên, hoặc map theo độ đậm khi font
  nạp riêng từng weight (`expo-font`) — Android cần map này. App tự nạp font. `useUu().fontDisplay` cho style display.
- **Viền + bóng control** (nút, chip, checkbox, radio, switch, ô nhập, ô OTP): vẽ bên ngoài, không chiếm chỗ —
  chiều cao, vùng chạm giữ nguyên, viền trạng thái (focus, lỗi, đang chọn) vẫn thấy. Cần RN ≥ 0.76 (`boxShadow`).
  Để khe giữa các control lớn hơn viền + độ lệch bóng.
  Viền và bóng nằm ngoài khung control nên khung cha có `overflow: 'hidden'` (vd. hàng bấm được bọc `Pressable` có bo góc)
  sẽ cắt mất — chừa padding cho khung cha hoặc bỏ `overflow: 'hidden'` ở đó.
- **Không đổi được** (phần khoá): state layer, chiều cao control, density, `rounded-circle`, token status.

## Bộ icon riêng

UU icon trong gói chỉ đủ cho component (kèm `texture` làm icon giữ chỗ). Sản phẩm cần icon thì tự mua
license Nucleo hoặc dùng bộ khác: đăng ký tên → SVG (`currentColor`), tên trùng
ghi đè icon mặc định, tên khác vẫn lấy bộ mặc định (icon nội bộ của component như `chevron-down` vẫn chạy).

```tsx
// icons.ts của app
export const myIcons = { paw: { outline: '<svg …>', fill: '<svg …>' } };
declare module 'uu-ds-native' { interface UuIconRegistry { paw: true } } // để TypeScript nhận tên

<UuProvider icons={myIcons}>…<UuIcon name="paw" color={c.objectPrimary} /></UuProvider>
```

Một sản phẩm dùng một bộ, không trộn từng icon của hai bộ. Giấy phép bộ app tự gắn thuộc về app (UU icon ngoài
bản công khai cần license Nucleo riêng — `src/icons/NOTICE.md` của repo UU DS).

## Component

| Web (React) | React Native |
|---|---|
| `TextButtonAccent` / `TextButtonNeutral` · `TextButtonDanger` | `UuTextButton tone="accent" \| "neutral"` · `UuTextButtonDanger` |
| `IconButtonAccent` / `IconButtonNeutral` · `ToggleButton` | `UuIconButton` · `UuToggleButton` |
| `TextInput` · `TextArea` · `OTPInput` · `SearchInput` | `UuTextInput` · `UuTextArea` · `UuOTPInput` · `UuSearchInput` |
| `DateInput` · `Dropdown` | `UuDateInput` (mở picker của app qua `onOpen`) · `UuDropdown` |
| `Checkbox` · `Radio` · `Switch` · `Chip` | `UuCheckbox` · `UuRadio` · `UuSwitch` · `UuChip` |
| `ListItem` · `ListGroup` (+ `ListIconContainer`, `ListAvatar`, `ListValue`) | `UuListItem` (`selection` checkbox / radio / switch, `trailing="chevron"`, `action`) · `UuListGroup` |
| `CheckboxInput` · `RadioInput` · `RadioList` | `UuCheckboxInput` · `UuRadioInput` · `UuRadioList` |
| `Menu` · `MenuItem` · `MenuSection` · `MenuDivider` | `UuMenu` (`options` hoặc `groups` có tiêu đề nhóm) · `UuMenuItem` · `UuMenuSection` · `UuMenuDivider` (+ `UuMenuPanel`, `UuMenuAnchor`) |
| `NavigationBar` · `BottomBar` · `Pagination` · `SegmentedControl` | `UuNavigationBar` · `UuBottomBar` · `UuPagination` · `UuSegmentedControl` |
| `Tab` · `TabBar` · `Breadcrumb` · `SideNav` | `UuTab` · `UuTabBar` · `UuBreadcrumb` · `UuSideNav` / `UuSideNavItem` / `UuSideNavSection` |
| `Toast` · `ButtonGroup` | `UuToast` / `showUuToast` · `UuButtonGroup` |
| `CardSheet` / `BottomSheet` · `CardDialog` / `Dialog` | `UuCardSheet` / `UuBottomSheet visible` · `UuCardDialog` / `UuDialog visible` |
| `Badge` · `StatusIndicator` · `NotificationBadge` | `UuBadge` · `UuStatusIndicator` · `UuNotificationBadge` |
| `EmptyScreen` · `EmptySection` · `ErrorSection` · `ResultScreen` · `ErrorScreen` | cùng tên, tiền tố `Uu` |
| `CardPushNotification` | `UuCardPushNotification` / `showUuPushNotification` |
| `SideSheet` · `Popover` · `Tooltip` | `UuSideSheet` / `UuSideSheetModal` · `UuPopover` / `UuPopoverAnchor` · `UuTooltip` |
| `Table` · `TableRow` · `TableHeaderCell` · `TableCell` · `TablePagination` · `KPICard` | cùng tên, tiền tố `Uu` |
| `Spinner` · `Icon` | `UuSpinner` · `UuIcon` |

Khác bản Flutter do nền tảng:

- Sheet, Dialog, SideSheet là component có `visible` (kiểu `Modal` của RN), không phải hàm `show…`. Toast và Push vẫn gọi bằng hàm, cần `<UuFeedbackHost />`. Toast tự nổi trên `UuBottomBar` và trên bàn phím (cách 12) — app không truyền chiều cao thanh.
- Panel `Menu` neo bằng `Modal` trong suốt + `measureInWindow`; bấm ra ngoài hoặc nút Back Android thì đóng. Bàn phím đang mở thì mép trên bàn phím là đáy — thiếu chỗ thì panel lật lên.
- Ô nhập gần đáy màn: app tự giữ ô trên bàn phím — Android (edge-to-edge) bọc `KeyboardAvoidingView behavior="padding"`, iOS dùng `ScrollView automaticallyAdjustKeyboardInsets`. Xem `example/App.tsx`.
- `DateInput` không kèm date picker — app tự mở picker (vd. `@react-native-community/datetimepicker`) trong `onOpen` rồi đặt `value`.
- Scrim chỉ có màu `overlay`; blur 16 cần `expo-blur`, app tự bọc nếu muốn.
- Tooltip chỉ hiện khi có con trỏ (web, iPad có chuột). Trên màn chạm, nhãn phải tự đủ nghĩa.
- Chấm của `StatusIndicator` nhấp nháy 1.6 s, đứng yên khi bật "Giảm chuyển động".

## State layer

`UuPressable surface="onDark" | "onLight"` phủ lớp màu object của variant, opacity 5/10 (nền sáng) hoặc 20/40 (nền tối) khi hover / pressed. Không ripple Android, không đổi nền, chữ, font-weight. Disabled và Loading không có lớp.

```tsx
const { colors: c } = useUu();
<UuTextButton label="Tiếp tục" size="large" suffixIcon="chevron-right" onPress={submit} />
<UuTextButton label="Thêm địa chỉ" type="outline" prefixIcon="texture" onPress={add} />
<UuTextInput label="Số điện thoại" requirement="required" prefixLabel="+84" actionLabel="Dán" />
<UuIcon name="texture" variant="fill" size={24} color={c.objectInteractive} />
<UuBottomSheet visible={open} header="Xoá tài khoản" onClose={close} cta={<UuButtonGroup tone="danger" primary={{ label: 'Xoá', onPress: remove }} />}>…</UuBottomSheet>
```

## App mẫu

`packages/react-native/example` — app Expo trưng bày đủ nhóm component, đổi brand / density tại chỗ:

```bash
cd packages/react-native/example && npm install && npx expo start
```
