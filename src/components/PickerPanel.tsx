import { useState, useMemo, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import StepHeader from './StepHeader';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PickerPanelProps<T extends { id: string }> {
  step: number;
  icon: ReactNode;
  label: string;
  items: T[];
  selectedId: string | null;
  onSelect: (item: T) => void;
  searchPlaceholder?: string;
  renderItem: (item: T, isSelected: boolean) => ReactNode;
  filterFn: (item: T, query: string) => boolean;
  /** Optional sx overrides forwarded to the root Paper (e.g. maxWidth, width). */
  sx?: SxProps<Theme>;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Generic searchable picker panel.
 *
 * Accepts any list of items with an `id: string` field. The caller controls
 * how items are rendered (`renderItem`) and how they are filtered (`filterFn`),
 * keeping this component fully decoupled from any domain type.
 *
 * @example
 * <PickerPanel<Asset>
 *   step={1}
 *   icon={<Inventory2OutlinedIcon />}
 *   label="Pick asset"
 *   items={assets}
 *   selectedId={selectedAssetId}
 *   onSelect={handleAssetSelect}
 *   renderItem={(a, sel) => <span>{a.name}</span>}
 *   filterFn={(a, q) => a.name.toLowerCase().includes(q)}
 * />
 */
export default function PickerPanel<T extends { id: string }>({
  step,
  icon,
  label,
  items,
  selectedId,
  onSelect,
  searchPlaceholder = 'Search…',
  renderItem,
  filterFn,
  sx,
}: PickerPanelProps<T>) {
  const theme = useTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q ? items.filter((i) => filterFn(i, q)) : items;
  }, [items, query, filterFn]);

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 0,
        border: `1px solid ${theme.palette.customColors.borderLight}`,
        borderRadius: 2.5,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        bgcolor: theme.palette.customColors.white,
        ...sx,
      }}
    >
      <StepHeader step={step} icon={icon} label={label} />

      {/* Search */}
      <OutlinedInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={searchPlaceholder}
        size="small"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          </InputAdornment>
        }
        sx={{
          fontSize: '0.83rem',
          '& fieldset': { borderColor: theme.palette.customColors.borderLight },
          '&:hover fieldset': { borderColor: theme.palette.primary.main },
          borderRadius: 1.5,
        }}
      />

      {/* Scrollable item list */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: 380,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          mx: -0.5,
        }}
      >
        {filtered.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No results found.
          </Typography>
        ) : (
          filtered.map((item) => (
            <Box
              key={item.id}
              onClick={() => onSelect(item)}
              sx={{
                px: 1,
                py: 1.25,
                borderRadius: 1.5,
                cursor: 'pointer',
                bgcolor:
                  selectedId === item.id
                    ? theme.palette.customColors.primaryTransparent
                    : 'transparent',
                transition: 'background 0.12s',
                '&:hover': {
                  bgcolor:
                    selectedId === item.id
                      ? theme.palette.customColors.primaryTransparent
                      : theme.palette.customColors.bgLight,
                },
              }}
            >
              {renderItem(item, selectedId === item.id)}
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
}
