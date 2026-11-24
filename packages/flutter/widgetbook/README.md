# uu_ds_widgetbook

Widgetbook for `uu_ds_flutter`: see the real UU DS Flutter widgets and change their properties with knobs. Storybook only shows the React version,
so Flutter developers look at widgets here.

Web version: https://uucreative.co/uu-ds/widgetbook/ (deployed with `npm run deploy:site`).

## Run

```bash
cd packages/flutter/widgetbook
flutter pub get
flutter run -d chrome        # or -d macos, or a simulator
```

## Build for the web

```bash
flutter build web --release --base-href /widgetbook/
```

The output goes to `build/web/`. Set `--base-href` to the path where the build will live on the site. `npm run deploy:site` builds with
`--base-href /uu-ds/widgetbook/` and places it next to Storybook; set `SKIP_WIDGETBOOK=1` to skip this step.

## Addon bar

- **UU DS**: pick each axis on its own.
  - `brand`: Default or UU.
  - `density`: touch or compact.
  - `layout`: expanded or collapsed.
  - `dna`: sample DNA. "Viền ngoài + bóng cứng" turns on `borderOuterWidth: 2` and `elevationNone`, to show the outer border (spec 4.3) on controls and cards.
- **Viewport**: an iPhone or Android frame.

## Add a use case

Each component in the Web ↔ Flutter table (Storybook page Phát triển / Flutter) is a `WidgetbookComponent` in `lib/main.dart`, placed in
the same functional group as the Storybook sidebar. Each component has a `Playground` use case with knobs for the properties in the spec,
plus a matrix or state use case when the component has many variants. Example icons use `texture`.
