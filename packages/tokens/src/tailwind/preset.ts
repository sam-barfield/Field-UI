/**
 * Tailwind CSS Preset for the Field Design System.
 * Maps Field CSS custom properties directly into Tailwind configuration.
 */
export const fieldTailwindPreset = {
  theme: {
    extend: {
      colors: {
        field: {
          surface: {
            base: 'var(--field-surface-base)',
            raised: 'var(--field-surface-raised)',
            overlay: 'var(--field-surface-overlay)',
            sunken: 'var(--field-surface-sunken)',
            subtle: 'var(--field-surface-subtle)',
            active: 'var(--field-surface-active)',
          },
          border: {
            subtle: 'var(--field-border-subtle)',
            default: 'var(--field-border-default)',
            strong: 'var(--field-border-strong)',
            focus: 'var(--field-border-focus)',
            highlight: 'var(--field-border-highlight)',
          },
          text: {
            primary: 'var(--field-text-primary)',
            secondary: 'var(--field-text-secondary)',
            tertiary: 'var(--field-text-tertiary)',
            inverse: 'var(--field-text-inverse)',
            disabled: 'var(--field-text-disabled)',
          },
          accent: {
            DEFAULT: 'var(--field-accent-primary)',
            hover: 'var(--field-accent-hover)',
            active: 'var(--field-accent-active)',
            subtle: 'var(--field-accent-subtle)',
            contrast: 'var(--field-accent-contrast)',
            text: 'var(--field-accent-text)',
          },
          status: {
            success: {
              DEFAULT: 'var(--field-status-success-base)',
              surface: 'var(--field-status-success-surface)',
              border: 'var(--field-status-success-border)',
              text: 'var(--field-status-success-text)',
            },
            warning: {
              DEFAULT: 'var(--field-status-warning-base)',
              surface: 'var(--field-status-warning-surface)',
              border: 'var(--field-status-warning-border)',
              text: 'var(--field-status-warning-text)',
            },
            danger: {
              DEFAULT: 'var(--field-status-danger-base)',
              surface: 'var(--field-status-danger-surface)',
              border: 'var(--field-status-danger-border)',
              text: 'var(--field-status-danger-text)',
            },
            info: {
              DEFAULT: 'var(--field-status-info-base)',
              surface: 'var(--field-status-info-surface)',
              border: 'var(--field-status-info-border)',
              text: 'var(--field-status-info-text)',
            },
          },
        },
      },
      borderRadius: {
        'field-xs': 'var(--field-radius-xs)',
        'field-sm': 'var(--field-radius-sm)',
        'field-md': 'var(--field-radius-md)',
        'field-lg': 'var(--field-radius-lg)',
        'field-xl': 'var(--field-radius-xl)',
        'field-full': 'var(--field-radius-full)',
      },
      boxShadow: {
        'field-xs': 'var(--field-shadow-xs)',
        'field-sm': 'var(--field-shadow-sm)',
        'field-md': 'var(--field-shadow-md)',
        'field-lg': 'var(--field-shadow-lg)',
        'field-xl': 'var(--field-shadow-xl)',
        'field-glow': 'var(--field-shadow-glow)',
      },
      fontFamily: {
        'field-sans': ['var(--field-font-sans)', 'sans-serif'],
        'field-mono': ['var(--field-font-mono)', 'monospace'],
        'field-display': ['var(--field-font-display)', 'sans-serif'],
      },
    },
  },
};
