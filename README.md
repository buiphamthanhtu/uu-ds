# uu-ds-native

UU Design system for React Native / Expo. It shares one source with the web and Flutter versions: tokens are generated from `docs/tokens.json`, components follow `docs/design-system.md`, and the public UU icons come from `src/icons/svg`.

The scope matches the Flutter package `packages/flutter/uu_ds_flutter`. Component names match Flutter (`UuTextButton`…), and prop names match the web version (`tone`, `type`, `inverted`, `size`, `state`, `error`, `disabled`).

## Install

The package is used as TypeScript source, with no build step. Requires React 19, React Native ≥ 0.76 (Expo SDK ≥ 52), `react-native-svg` and `react-native-safe-area-context`.

```bash
npx expo install react-native-svg react-native-safe-area-context
npm i "github:buiphamthanhtu/uu-ds#native-v1.0.1"   # public repo, native branch
```

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UuProvider, UuFeedbackHost, UuTextButton } from 'uu-ds-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <UuProvider brand="default" density="touch">
        <Home />
        <UuFeedbackHost />{/* last child of the full-screen view: Toast, Push, SearchInput suggestion panel */}
      </UuProvider>
    </SafeAreaProvider>
  );
}
```

Desktop, tablet or web: `density="compact"`. Icons only: `layout="collapsed"`. To change one region, wrap it in `<UuProvider density="compact">`; anything you don't pass is inherited from the parent.

## Tokens

| Where | What |
|---|---|
| `useUu().colors` | the 57 semantic tokens of the current brand. Components read colors **only** from here |
| `useUu().sizes` · `useUu().text` | control sizes and text styles for the current density. Don't hard-code 56 / 48 / 32 |
| `tokens.gap` · `tokens.size` · `tokens.radius` · `tokens.opacity` · `tokens.elevation` | scales for spacing, size, radius, opacity and shadow (`boxShadow`) |
| `tokens.primitiveColors` | primitives. Only for defining semantic tokens, never used in components |

When `tokens.json` changes, regenerate: `npm run tokens:rn` at the repo root → `src/tokens.g.ts`. Icons: `npm run rn:icons` → `src/icons.g.ts` (public icons only; TypeScript flags a wrong name).

## Product DNA (spec 4.3)

Declare the product's own style once on `UuProvider`; no component code changes. A child region inherits the DNA of its parent.

```tsx
<UuProvider
  dna={{
    colors: { backgroundInteractive: '#…' },            // the 22 brand tokens
    radius: { xl4: 12, lg: 8 },                        // buttons / chips · cards, fields
    elevation: {
      medium: '4px 4px 0px 0px #111',                  // blur 0 = hard shadow
      none: '2px 2px 0px 2px #111',                    // control shadow; spread = border width, or the border covers it
    },
    fontFamily: {
      display: 'Baloo2_700Bold',
      body: { '400': 'Inter_400Regular', '500': 'Inter_500Medium', '600': 'Inter_600SemiBold', '700': 'Inter_700Bold' },
    },
    borderOuter: { width: 2, color: '#111' },          // outer border on controls and cards, off by default
  }}
  icons={myIcons}                                      // custom icon set, see below
>
```

- **Font**: only the font family changes; size, line height and weight stay on the scale. `body` is one name, or a map by
  weight when each weight is loaded separately (`expo-font`). Android needs this map. The app loads its own fonts.
  `useUu().fontDisplay` gives the display style.
- **Control border and shadow** (buttons, chips, checkboxes, radios, switches, fields, OTP cells): drawn outside, taking no
  space. Height and touch area stay the same, and state borders (focus, error, selected) stay visible. Needs RN ≥ 0.76 (`boxShadow`).
  Keep the gap between controls larger than the border plus the shadow offset.
  The border and shadow sit outside the control's frame, so a parent with `overflow: 'hidden'` (for example a rounded
  `Pressable` row) clips them. Give the parent padding, or remove `overflow: 'hidden'` there.
- **Locked** (can't change): state layer, control height, density, `rounded-circle`, status tokens.

## Custom icon set

The UU icons in the package only cover what components need (plus `texture` as a placeholder). If the product needs icons,
buy a Nucleo license or use another set. Register name → SVG (`currentColor`). A matching name overrides the default icon;
other names still come from the default set, so components' own icons such as `chevron-down` keep working.

```tsx
// the app's icons.ts
export const myIcons = { paw: { outline: '<svg …>', fill: '<svg …>' } };
declare module 'uu-ds-native' { interface UuIconRegistry { paw: true } } // so TypeScript accepts the name

<UuProvider icons={myIcons}>…<UuIcon name="paw" color={c.objectPrimary} /></UuProvider>
```

A product uses one set; don't mix single icons from two sets. The license of a set the app adds belongs to the app (UU icons
beyond the public edition need a separate Nucleo license; see `src/icons/NOTICE.md` in the UU DS repo).

## Components

| Web (React) | React Native |
|---|---|
| `TextButtonAccent` / `TextButtonNeutral` · `TextButtonDanger` | `UuTextButton tone="accent" \| "neutral"` · `UuTextButtonDanger` |
| `IconButtonAccent` / `IconButtonNeutral` · `ToggleButton` | `UuIconButton` · `UuToggleButton` |
| `TextInput` · `TextArea` · `OTPInput` · `SearchInput` | `UuTextInput` · `UuTextArea` · `UuOTPInput` · `UuSearchInput` |
| `DateInput` · `Dropdown` | `UuDateInput` (opens the app's picker through `onOpen`) · `UuDropdown` |
| `Checkbox` · `Radio` · `Switch` · `Chip` | `UuCheckbox` · `UuRadio` · `UuSwitch` · `UuChip` |
| `ListItem` · `ListGroup` (+ `ListIconContainer`, `ListAvatar`, `ListValue`) | `UuListItem` (`selection` checkbox / radio / switch, `trailing="chevron"`, `action`) · `UuListGroup` |
| `CheckboxInput` · `RadioInput` · `RadioList` | `UuCheckboxInput` · `UuRadioInput` · `UuRadioList` |
| `Menu` · `MenuItem` · `MenuSection` · `MenuDivider` | `UuMenu` (`options`, or `groups` with group titles) · `UuMenuItem` · `UuMenuSection` · `UuMenuDivider` (+ `UuMenuPanel`, `UuMenuAnchor`) |
| `NavigationBar` · `BottomBar` · `Pagination` · `SegmentedControl` | `UuNavigationBar` · `UuBottomBar` · `UuPagination` · `UuSegmentedControl` |
| `Tab` · `TabBar` · `Breadcrumb` · `SideNav` | `UuTab` · `UuTabBar` · `UuBreadcrumb` · `UuSideNav` / `UuSideNavItem` / `UuSideNavSection` |
| `Toast` · `ButtonGroup` | `UuToast` / `showUuToast` · `UuButtonGroup` |
| `CardSheet` / `BottomSheet` · `CardDialog` / `Dialog` | `UuCardSheet` / `UuBottomSheet visible` · `UuCardDialog` / `UuDialog visible` |
| `Badge` · `StatusIndicator` · `NotificationBadge` | `UuBadge` · `UuStatusIndicator` · `UuNotificationBadge` |
| `EmptyScreen` · `EmptySection` · `ErrorSection` · `ResultScreen` · `ErrorScreen` | same names, with the `Uu` prefix |
| `CardPushNotification` | `UuCardPushNotification` / `showUuPushNotification` |
| `SideSheet` · `Popover` · `Tooltip` | `UuSideSheet` / `UuSideSheetModal` · `UuPopover` / `UuPopoverAnchor` · `UuTooltip` |
| `Table` · `TableRow` · `TableHeaderCell` · `TableCell` · `TablePagination` · `KPICard` | same names, with the `Uu` prefix |
| `Spinner` · `Icon` | `UuSpinner` · `UuIcon` |

Differences from Flutter, because of the platform:

- Sheet, Dialog and SideSheet are components with `visible` (like RN's `Modal`), not `show…` functions. Toast and Push are still called as functions and need `<UuFeedbackHost />`. Toast sits above `UuBottomBar` and above the keyboard (12 apart) on its own; the app doesn't pass the bar height.
- The `Menu` panel is anchored with a transparent `Modal` + `measureInWindow`. A tap outside or the Android Back button closes it. While the keyboard is open, its top edge counts as the bottom of the screen; if there isn't room, the panel flips up.
- Fields near the bottom of the screen: the app keeps them above the keyboard. On Android (edge-to-edge), wrap in `KeyboardAvoidingView behavior="padding"`; on iOS, use `ScrollView automaticallyAdjustKeyboardInsets`. See `example/App.tsx`.
- `DateInput` ships without a date picker. The app opens its own picker (for example `@react-native-community/datetimepicker`) in `onOpen`, then sets `value`.
- The scrim is the `overlay` color only. The 16 blur needs `expo-blur`; the app wraps it if wanted.
- Tooltip only shows with a pointer (web, iPad with a mouse). On touch screens, labels must make sense on their own.
- The `StatusIndicator` dot blinks every 1.6 s and stays still when Reduce Motion is on.

## State layer

`UuPressable surface="onDark" | "onLight"` lays the variant's object color over the control on hover and press, at opacity 5/10 (light backgrounds) or 20/40 (dark backgrounds). No Android ripple; background, text and font weight never change. Disabled and Loading have no layer.

```tsx
const { colors: c } = useUu();
<UuTextButton label="Tiếp tục" size="large" suffixIcon="chevron-right" onPress={submit} />
<UuTextButton label="Thêm địa chỉ" type="outline" prefixIcon="texture" onPress={add} />
<UuTextInput label="Số điện thoại" requirement="required" prefixLabel="+84" actionLabel="Dán" />
<UuIcon name="texture" variant="fill" size={24} color={c.objectInteractive} />
<UuBottomSheet visible={open} header="Xoá tài khoản" onClose={close} cta={<UuButtonGroup tone="danger" primary={{ label: 'Xoá', onPress: remove }} />}>…</UuBottomSheet>
```

## Example app

`packages/react-native/example`: an Expo app that shows every component group, with brand and density switches:

```bash
cd packages/react-native/example && npm install && npx expo start
```
