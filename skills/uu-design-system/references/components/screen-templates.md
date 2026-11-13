### 6.19 Screen templates (`ResultScreen` · `ErrorScreen` · `EmptyScreen` · `EmptySection` · `ErrorSection`)

Three screen templates. In the design they belong to the same family as `Sheet` (6.8) and `Dialog` (6.10): a **390 × 844** frame,
`NavigationBar` on top, `Body` FILL centered on both axes with horizontal padding 16, `Footer` HUG padding 16,
`IOS Home indicator` at the bottom.

| Template | Content | Footer |
|---|---|---|
| `ResultScreen` | The task is done; the user must move elsewhere | Vertical `ButtonGroup` — primary on top, secondary path below |
| `ErrorScreen` | An error blocks the core function and cannot be fixed by the user | **One** button only: retry |
| `EmptyScreen` | The whole screen has no data yet | **One** action button (create, explore), hideable via `Action` |

All three **have code components** for building screens quickly — web `ResultScreen` · `ErrorScreen` · `EmptyScreen`, Flutter
`UuResultScreen` · `UuErrorScreen` · `UuEmptyScreen`. `ResultScreen` / `ErrorScreen` only build the `Body` + `Footer` (image, title, description,
buttons) — the screen places the `NavigationBar` and safe area; `EmptyScreen` includes a `NavigationBar` with a back button. `ResultScreen` takes a primary button + an optional secondary path; `ErrorScreen`
takes exactly one retry button.

**Embedded blocks** (not a whole screen — placed in one region of a screen, including a table body):

| Component | When | Button |
|---|---|---|
| `EmptySection` | One block of the screen has no data (empty list, empty table) | One button, hideable via `Action` |
| `ErrorSection` | The error is in one block only; the rest of the screen still works | One retry button |

```
EmptySection · ErrorSection   V · p 12 · g12 · centered · 390 × HUG
├─ Content wrapper            V · g12 · FILL · centered
│  ├─ Image                   128 circle · background-accent-muted + illustration
│  ├─ Title                   heading-sm (smaller than the screens) · object-primary · centered
│  └─ Description             body · object-primary · centered
└─ ButtonGroup                one button · HUG
```

Shared props: `Title`, `Description` (TEXT); `EmptyScreen` / `EmptySection` add `Action` (BOOLEAN). The illustration
of **every** empty and error screen / block is a **128 circle** with `background-accent-muted` (ResultScreen keeps a square
without background — the screen decides the image). The image is content → `alt`.

Pick correctly: whole-screen error → `ErrorScreen`; one-block error → `ErrorSection`; an error the user can fix right away → `Dialog` / `Toast`.

The `NavigationBar` of `ResultScreen` and `ErrorScreen` sets `Back action=false` — when the task is done or the system is broken there is
nowhere to go back to. `EmptyScreen` **has** a back button (`Back action=true`) — an empty screen is still a normal screen. `Mini app=false` so the templates work outside a mini-app environment.

> `ErrorScreen` having only **one** button is intentional. If there is anything else the user can do right away, the error
> does not block the core function — it belongs to the `Dialog` or `Toast` branch, not a full-page error screen.
