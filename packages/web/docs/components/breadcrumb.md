### 6.25 Breadcrumb (`Breadcrumb` · `.BreadcrumbItem`)

The location path in the page tree (desktop). **`.BreadcrumbItem` props**: `Label` (TEXT) · `Current` (`False` · `True`)
× `State` (`Default` · `Hover`) — a `Current=True` item has no `Hover` — + **`Type=Overflow`** × `State` (2). **5 variants.** `Breadcrumb`: 1 variant.

| Part | Value |
|---|---|
| Bar | HORIZONTAL · gap **4** · vertically centered |
| Item | horizontal padding **4** · radius `radius-sm` · `body` `object-secondary` · is a link |
| `Hover` | state layer `object-primary` · `opacity-5` |
| `Current=True` | `object-primary` · not a link · `aria-current="page"` |
| Separator | "/" `body` `object-disabled`, `aria-hidden` |

The last item is always the current page. Don't use Breadcrumb instead of `NavigationBar` on apps.

**Truncation** when the path has **more than 4 items**: keep the first item and the **last 2**, and fold the middle items into **one**
`Type=Overflow` item — "…" text `body` `object-secondary`, with `Hover` like a normal item, `aria-label="Hiện đường dẫn ẩn"`,
`aria-haspopup="menu"`. Pressing it opens a `Menu` `Platform=Panel` (§6.21) listing the hidden items top to bottom; picking
one navigates to that page. E.g. 6 items: `Trang chủ / … / Đơn hàng / DH-1024`.

**No icon before the first item** — the first item is text like every other item.
