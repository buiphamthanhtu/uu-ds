# Standard screen frames

Six standard UU DS screen frames to copy structure from. If the product already has its own sample screens (section 8 of `DNA.md`), those come before this file. To build a new screen, find the closest one here, keep the frame and component order, then replace the content. Don't build from scratch.

Each screen has three parts: **frame**, **what to learn**, **common mistakes**. Each component's measurements are in its file under `components/` (spec §6.x); this file only covers how they fit together.

| Need to build | Frame |
|---|---|
| Data entry on an app | [Form](#1-form-on-an-app) |
| Verification code entry | [OTP](#2-verification-code-entry) |
| Picking from a long list, including multi-level picking | [Pick from a list](#3-pick-from-a-list) |
| Confirming an irreversible action | [Destructive confirmation](#4-destructive-confirmation) |
| Done, error, no data yet | [Result, error, empty](#5-result-error-empty) |
| Dashboard, admin page on desktop | [Dashboard](#6-desktop-dashboard) |

**No frame yet:** list screens and settings screens on apps. Build them with `ListGroup` + `ListItem` (§6.32) and say at handoff that the frame is self-built; if the product has a sample screen of the same kind, follow it.

**Spacing between blocks on a screen** is not in the spec, except the template frames in §6.19. Take it from the `gap-*` scale and say at handoff that it is your own choice.

---

## 1. Form on an app

```
Frame 390 · density Touch
├─ NavigationBar         Back action=true · short screen name
├─ Body                  horizontal padding 16 · scrollable
│  ├─ TextInput          Label · one line of free text
│  ├─ Dropdown           Label · one answer from a list
│  ├─ DateInput          Label · a date on the calendar
│  └─ TextArea           Label · multi-line text
└─ Footer                padding 16
   └─ ButtonGroup        one primary button · Secondary button=false
```

**What to learn**
- Each kind of answer has its own component. Dates use `DateInput`, not a `TextInput` with a calendar icon.
- The label stays after the field is filled, so the user always knows what the field is.
- The error sits right under the field that caused it. The error line says how to fix it.

**Common mistakes**
- Using the placeholder instead of a label.
- Reporting input errors with a `Toast`: the toast disappears and the error with it.
- Stretching a `TextInput` tall instead of switching to `TextArea`.

## 2. Verification code entry

```
Frame 390 · density Touch
├─ NavigationBar         Back action=true
└─ Body                  horizontal padding 16
   ├─ Title, description says where the code was sent
   ├─ OTPInput           Masked=False · 6 cells
   └─ TextButton         Ghost · resend code
```

**What to learn**
- SMS codes use `Masked=False` so the user can compare with the message. Only PINs use `Masked=True`.
- Wrong code: all 6 cells red, digits kept, centered error line. The error only shows after the code is complete.

**Common mistakes**
- Building 6 `TextInput`s in a row.
- Clearing all cells on a wrong code.

## 3. Pick from a list

```
Dropdown                 Value=Empty · tap opens a sheet
└─ Menu Platform=Sheet   CardSheet · Navigation=Close · CTA=false
   ├─ Search             on when the list is long
   ├─ Option list        single choice: tap closes
   ├─ Footer             multiple choice: Type=Multiple + Bỏ chọn, Áp dụng
   └─ Child sheet        Navigation=Back · e.g. Province then District
```

**What to learn**
- A child sheet has a Back button on the left and no close button. Back and Close never show together.
- Back returns to the parent sheet. To close the whole chain, go back to the root sheet and close it, so the user never loses track of the level.
- Desktop uses a `Menu` Panel anchored to the field, not a sheet.

**Common mistakes**
- Adding a search field to a list of a few items.
- Using a `CardSheet` for a yes/no question. That is a `Dialog`.

## 4. Destructive confirmation

```
Scrim                    overlay + blur · panel inset 12 each side
└─ CardDialog            Banner=False · vertically centered
   ├─ Close              top right
   └─ Body
      ├─ Slot            the question goes here · Dialog has no separate title
      └─ ButtonGroup     Tone=Danger · Secondary button=true
                         secondary "Giữ đơn" · primary "Huỷ đơn"
```

**What to learn**
- Buttons say exactly what will happen. Reading only the two buttons is enough to understand.
- `Tone=Danger` only turns the primary button red. Order and geometry stay.
- `Danger` is only for things that can't be undone.

**Common mistakes**
- Buttons saying "OK" and "Không".
- Coloring a safe action red, like saving a draft.
- Leaving the `Slot` empty: it is where the content goes, not decoration.
- Opening a dialog on top of a dialog.

## 5. Result, error, empty

| Situation | Use | Buttons |
|---|---|---|
| Done, must move elsewhere | `ResultScreen` | vertical `ButtonGroup`: primary on top, secondary below |
| Error blocks the main function, user can't fix it | `ErrorScreen` | exactly one retry button |
| The whole screen has no data yet | `EmptyScreen` | one action button |
| One block has no data yet | `EmptySection` | one button, hideable |
| Error in one block, the rest still works | `ErrorSection` | one retry button |
| Fixable right away | `Dialog` or `Toast` | depends on the task |

```
Frame 390 · density Touch
├─ NavigationBar         ResultScreen, ErrorScreen: Back action=false
├─ Body                  FILL · centered on both axes · horizontal padding 16
│  └─ Image, title, description
└─ Footer                padding 16 · buttons per the table above
```

**What to learn**
- The image is content and needs `alt`.
- `ErrorScreen` having one button is intentional. If the user still has something else to do, it isn't a full-screen error.
- The button on an empty screen states the next step, e.g. "Xoá bộ lọc".

**Common mistakes**
- Writing "Không có dữ liệu" and stopping there.
- A button saying "OK" that leads nowhere.
- Leaving a Back button on `ResultScreen`.

## 6. Desktop dashboard

```
Frame 1440 · data-density="compact"
├─ SideNav               exactly one selected item · max 2 levels
└─ Main
   ├─ Breadcrumb         text, the last item is the current page
   ├─ KPICard row        one number per card · cost, cancellation rate: Polarity=Inverse
   ├─ Table              TableHeaderCell + TableCell
   │  ├─ Number column   Align=Right + Type=Number
   │  ├─ Status column   Type=Status
   │  └─ Action column   Ghost Small · the rest in "⋯"
   └─ TablePagination    when there is more than one page
```

**What to learn**
- Tables have no outer border and no vertical lines. Hover and selection are states of the whole row.
- Choose `Polarity` by what the metric means. Arrows still follow the number's direction.
- An empty table uses `EmptySection` in the table body.

**Common mistakes**
- Using `Solid` in table rows.
- Flipping the arrow to get a red color.
- Using `Compact` on touch screens.
- Using `Pagination` dots under a table. Tables use `TablePagination`.
