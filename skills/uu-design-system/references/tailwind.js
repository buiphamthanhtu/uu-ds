// Chỉ dùng nếu dự án chạy Tailwind. Không dùng Tailwind thì bỏ qua file này —
// tokens.css đã đủ để build.
// UU DS Tailwind theme — requires uu-ds-tokens.css to be imported.
// All values resolve through CSS custom properties, so any [data-theme="…"] brand mode just works.

module.exports = {
  theme: {
    extend: {
          "colors": {
                "background-surface": "var(--background-surface)",
                "background-muted": "var(--background-muted)",
                "background-subtle": "var(--background-subtle)",
                "background-emphasized": "var(--background-emphasized)",
                "background-inverted": "var(--background-inverted)",
                "background-disabled": "var(--background-disabled)",
                "background-interactive": "var(--background-interactive)",
                "background-interactive-muted": "var(--background-interactive-muted)",
                "background-accent": "var(--background-accent)",
                "background-accent-muted": "var(--background-accent-muted)",
                "background-accent-subtle": "var(--background-accent-subtle)",
                "background-accent-medium": "var(--background-accent-medium)",
                "background-accent-emphasized": "var(--background-accent-emphasized)",
                "background-positive": "var(--background-positive)",
                "background-positive-muted": "var(--background-positive-muted)",
                "background-negative": "var(--background-negative)",
                "background-negative-muted": "var(--background-negative-muted)",
                "background-attention": "var(--background-attention)",
                "background-attention-muted": "var(--background-attention-muted)",
                "background-warning": "var(--background-warning)",
                "background-warning-muted": "var(--background-warning-muted)",
                "object-primary": "var(--object-primary)",
                "object-primary-inverted": "var(--object-primary-inverted)",
                "object-secondary": "var(--object-secondary)",
                "object-disabled": "var(--object-disabled)",
                "object-on-light": "var(--object-on-light)",
                "object-on-dark": "var(--object-on-dark)",
                "object-interactive": "var(--object-interactive)",
                "object-interactive-muted": "var(--object-interactive-muted)",
                "object-interactive-inverted": "var(--object-interactive-inverted)",
                "object-on-interactive": "var(--object-on-interactive)",
                "object-accent": "var(--object-accent)",
                "object-accent-muted": "var(--object-accent-muted)",
                "object-accent-inverted": "var(--object-accent-inverted)",
                "object-on-accent": "var(--object-on-accent)",
                "object-positive": "var(--object-positive)",
                "object-on-positive": "var(--object-on-positive)",
                "object-negative": "var(--object-negative)",
                "object-on-negative": "var(--object-on-negative)",
                "object-attention": "var(--object-attention)",
                "object-on-attention": "var(--object-on-attention)",
                "object-warning": "var(--object-warning)",
                "object-on-warning": "var(--object-on-warning)",
                "border": "var(--border)",
                "border-muted": "var(--border-muted)",
                "border-emphasized": "var(--border-emphasized)",
                "border-subtle": "var(--border-subtle)",
                "border-medium": "var(--border-medium)",
                "border-inverted": "var(--border-inverted)",
                "border-muted-inverted": "var(--border-muted-inverted)",
                "border-interactive": "var(--border-interactive)",
                "border-interactive-inverted": "var(--border-interactive-inverted)",
                "border-highlight": "var(--border-highlight)"
          },
          "spacing": {
                "0": "var(--gap-0)",
                "0-5": "var(--gap-0-5)",
                "1": "var(--gap-1)",
                "1-5": "var(--gap-1-5)",
                "2": "var(--gap-2)",
                "2-5": "var(--gap-2-5)",
                "3": "var(--gap-3)",
                "3-5": "var(--gap-3-5)",
                "4": "var(--gap-4)",
                "5": "var(--gap-5)",
                "6": "var(--gap-6)",
                "7": "var(--gap-7)",
                "8": "var(--gap-8)",
                "9": "var(--gap-9)",
                "10": "var(--gap-10)",
                "11": "var(--gap-11)",
                "12": "var(--gap-12)",
                "14": "var(--gap-14)",
                "16": "var(--gap-16)"
          },
          "borderRadius": {
                "none": "var(--radius-none)",
                "sm": "var(--radius-sm)",
                "base": "var(--radius-base)",
                "lg": "var(--radius-lg)",
                "xl": "var(--radius-xl)",
                "2xl": "var(--rounded-2xl)",
                "3xl": "var(--rounded-3xl)",
                "4xl": "var(--rounded-4xl)",
                "circle": "var(--rounded-circle)"
          },
          "fontSize": {
                "3xs": [
                      "var(--font-size-3xs)",
                      {
                            "lineHeight": "var(--font-height-base)"
                      }
                ],
                "2xs": [
                      "var(--font-size-2xs)",
                      {
                            "lineHeight": "var(--font-height-2xs)"
                      }
                ],
                "xs": [
                      "var(--font-size-xs)",
                      {
                            "lineHeight": "var(--font-height-xs)"
                      }
                ],
                "sm": [
                      "var(--font-size-sm)",
                      {
                            "lineHeight": "var(--font-height-sm)"
                      }
                ],
                "base": [
                      "var(--font-size-base)",
                      {
                            "lineHeight": "var(--font-height-base)"
                      }
                ],
                "lg": [
                      "var(--font-size-lg)",
                      {
                            "lineHeight": "var(--font-height-lg)"
                      }
                ],
                "xl": [
                      "var(--font-size-xl)",
                      {
                            "lineHeight": "var(--font-height-xl)"
                      }
                ],
                "2xl": [
                      "var(--font-size-2xl)",
                      {
                            "lineHeight": "var(--font-height-2xl)"
                      }
                ],
                "3xl": [
                      "var(--font-size-3xl)",
                      {
                            "lineHeight": "var(--font-height-3xl)"
                      }
                ],
                "4xl": [
                      "var(--font-size-4xl)",
                      {
                            "lineHeight": "var(--font-height-4xl)"
                      }
                ],
                "5xl": [
                      "var(--font-size-5xl)",
                      {
                            "lineHeight": "var(--font-height-5xl)"
                      }
                ]
          },
          "fontFamily": {
                "body": [
                      "var(--font-family-body)"
                ],
                "display": [
                      "var(--font-family-display)"
                ]
          },
          "fontWeight": {
                "normal": "var(--font-weight-normal)",
                "medium": "var(--font-weight-medium)",
                "semibold": "var(--font-weight-semibold)",
                "bold": "var(--font-weight-bold)"
          },
          "boxShadow": {
                "low": "var(--elevation-low)",
                "medium": "var(--elevation-medium)",
                "high": "var(--elevation-high)",
                "none": "var(--elevation-none)"
          }
    }
  }
};
