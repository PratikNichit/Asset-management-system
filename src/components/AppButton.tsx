import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import type { ElementType } from 'react';

// ─── Variant & Size Types ────────────────────────────────────────────────────

/**
 * Maps to shadcn-style variant names → MUI color + variant combos.
 *
 * | AppButton variant | MUI equivalent                         |
 * |-------------------|----------------------------------------|
 * | default           | contained + primary                    |
 * | destructive       | contained + error                      |
 * | outline           | outlined  + primary                    |
 * | secondary         | contained + secondary (via theme color)|
 * | ghost             | text + primary                         |
 * | link              | text + primary + underline             |
 */
export type AppButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

/**
 * Maps to shadcn-style size names → MUI sizes / icon-square mode.
 *
 * | AppButton size | MUI size / behaviour       |
 * |----------------|----------------------------|
 * | default        | medium                     |
 * | sm             | small                      |
 * | lg             | large                      |
 * | icon           | medium + equal w/h square  |
 */
export type AppButtonSize = 'default' | 'sm' | 'lg' | 'icon';

// ─── Props ───────────────────────────────────────────────────────────────────

export type AppButtonProps = Omit<MuiButtonProps, 'variant' | 'size' | 'color'> & {
  /** Visual style of the button. Mirrors shadcn variants. @default 'default' */
  variant?: AppButtonVariant;
  /** Size preset. Mirrors shadcn sizes. @default 'default' */
  size?: AppButtonSize;
  /** Shows a CircularProgress spinner and disables the button. */
  loading?: boolean;
  /**
   * Render as a different element/component (MUI `component` prop equivalent
   * of Radix `asChild`). e.g. `component="a"` or `component={RouterLink}`.
   */
  component?: ElementType;
};

// ─── Internal maps ───────────────────────────────────────────────────────────

const VARIANT_MAP: Record<
  AppButtonVariant,
  { muiVariant: MuiButtonProps['variant']; color: MuiButtonProps['color']; isLink?: boolean }
> = {
  default:     { muiVariant: 'contained', color: 'primary' },
  destructive: { muiVariant: 'contained', color: 'error' },
  outline:     { muiVariant: 'outlined',  color: 'primary' },
  secondary:   { muiVariant: 'contained', color: 'secondary' },
  ghost:       { muiVariant: 'text',      color: 'primary' },
  link:        { muiVariant: 'text',      color: 'primary', isLink: true },
};

const SIZE_MAP: Record<AppButtonSize, MuiButtonProps['size']> = {
  default: 'medium',
  sm:      'small',
  lg:      'large',
  icon:    'medium', // square via sx below
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * `AppButton` — project-wide button wrapping MUI `Button`.
 *
 * Accepts shadcn-style `variant` and `size` props and translates them
 * into the correct MUI color + variant combination. All MUI Button props
 * (startIcon, endIcon, href, onClick, sx, …) are forwarded as-is.
 *
 * @example
 * // Default (primary contained)
 * <AppButton>Save</AppButton>
 *
 * @example
 * // Destructive with loading
 * <AppButton variant="destructive" loading={isDeleting}>Delete</AppButton>
 *
 * @example
 * // Icon-only square button
 * <AppButton size="icon" variant="ghost"><DeleteIcon /></AppButton>
 *
 * @example
 * // Render as anchor (asChild equivalent)
 * <AppButton component="a" href="/dashboard">Go to Dashboard</AppButton>
 */
export default function AppButton({
  children,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled = false,
  sx,
  component,
  ...rest
}: AppButtonProps) {
  const { muiVariant, color, isLink } = VARIANT_MAP[variant];
  const muiSize = SIZE_MAP[size];

  return (
    <Button
      variant={muiVariant}
      color={color}
      size={muiSize}
      disabled={disabled || loading}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component={component as any}
      sx={{
        // Icon size: equal width/height square (like shadcn `size="icon"`)
        ...(size === 'icon' && {
          minWidth: 0,
          width:  muiSize === 'small' ? 32 : muiSize === 'large' ? 42 : 36,
          height: muiSize === 'small' ? 32 : muiSize === 'large' ? 42 : 36,
          p: 0,
        }),
        // Link variant: underline on hover, no background
        ...(isLink && {
          textDecoration: 'underline',
          textUnderlineOffset: 4,
          '&:hover': { textDecoration: 'underline' },
        }),
        ...sx,
      }}
      {...rest}
    >
      {loading ? (
        <>
          <CircularProgress
            size={muiSize === 'small' ? 14 : muiSize === 'large' ? 20 : 16}
            color="inherit"
            sx={{ mr: size === 'icon' ? 0 : 1 }}
          />
          {size !== 'icon' && children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
