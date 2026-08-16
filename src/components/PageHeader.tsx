import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PageHeaderProps {
  /** Primary page title rendered as an h5. */
  title: string;
  /** Optional subtitle rendered as body2 below the title. */
  subtitle?: string;
  /**
   * Optional slot rendered on the right side of the header row.
   * Typically one or more `<AppButton>` elements.
   */
  actions?: React.ReactNode;
  /** Extra sx overrides on the outer wrapper Box. */
  sx?: SxProps<Theme>;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * PageHeader — standardised top-of-page title block.
 *
 * Renders a bold Manrope h5 title with an optional muted subtitle and an
 * optional right-aligned actions slot. Used identically across all route pages
 * so typography, spacing and layout stay consistent from one screen to another.
 *
 * @example
 * // Simple
 * <PageHeader title="Maintenance" subtitle="Track work orders across all assets." />
 *
 * @example
 * // With action button
 * <PageHeader
 *   title="Assets"
 *   subtitle="2 148 total · 1 902 in use"
 *   actions={<AppButton startIcon={<AddIcon />}>Add asset</AppButton>}
 * />
 */
export default function PageHeader({ title, subtitle, actions, sx }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
        mb: 3,
        ...sx,
      }}
    >
      {/* ── Title + subtitle ──────────────────────────────────────────────── */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontFamily: '"Manrope", sans-serif',
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.85rem' }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* ── Optional actions slot ─────────────────────────────────────────── */}
      {actions && (
        <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center', flexShrink: 0 }}>
          {actions}
        </Box>
      )}
    </Box>
  );
}
