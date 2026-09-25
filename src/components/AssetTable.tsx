import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AppButton from './AppButton';
import DataTable from './DataTable';
import type { Asset } from '../types/asset';
import type { AssetColumnDef } from '../types/assetColumns';
import { DEFAULT_ASSET_COLUMNS } from '../types/assetColumns';

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CategoryTabsProps {
  tabs: Array<{ label: string; value: string }>;
  active: string;
  counts: Record<string, number>;
  onChange: (value: string) => void;
}

function CategoryTabs({ tabs, active, counts, onChange }: CategoryTabsProps) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
      {tabs.map(({ label, value }) => {
        const isActive = active === value;
        return (
          <Chip
            key={value}
            id={`asset-tab-${value.toLowerCase().replace(/\s+/g, '-')}`}
            label={isActive ? `${label} · ${counts[value] ?? 0}` : label}
            onClick={() => onChange(value)}
            sx={{
              height: 32,
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.8rem',
              borderRadius: '999px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              bgcolor: isActive ? theme.palette.primary.main : theme.palette.customColors.bgNeutral,
              color: isActive ? '#fff' : theme.palette.text.secondary,
              border: 'none',
              '&:hover': {
                bgcolor: isActive
                  ? theme.palette.primary.main
                  : theme.palette.customColors.bgNeutralDark,
              },
            }}
          />
        );
      })}
    </Box>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AssetTableProps {
  /**
   * The assets to display.
   * Category tabs and counts are auto-derived from this array.
   */
  assets: Asset[];

  /**
   * Column definitions — controls which columns appear, their headers,
   * and how each cell is rendered.
   *
   * Pass `DEFAULT_ASSET_COLUMNS` for the full standard set, or compose
   * your own array to show a subset, reorder, or add custom columns.
   *
   * @default DEFAULT_ASSET_COLUMNS
   */
  columns?: AssetColumnDef[];

  /**
   * Fields of `Asset` to include in the search.
   * Each entry is a key whose value must be `string | null`.
   *
   * @default ['name', 'code', 'serial']
   */
  searchFields?: Array<keyof Pick<Asset, 'name' | 'code' | 'serial' | 'department' | 'location' | 'assignedTo'>>;

  /**
   * Placeholder text for the search input.
   * @default 'Search…'
   */
  searchPlaceholder?: string;

  /**
   * Called when the user clicks a row.
   * When provided, rows get a `pointer` cursor.
   */
  onRowClick?: (asset: Asset) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * AssetTable — a column-driven, self-contained asset inventory table.
 *
 * The component owns: category tabs (auto-derived from data) and search.
 * It knows nothing about column names or cell content
 * — those come entirely from the `columns` prop.
 *
 * @example
 * // Full default table
 * <AssetTable assets={assets} columns={DEFAULT_ASSET_COLUMNS} />
 *
 * @example
 * // Only name + status
 * <AssetTable
 *   assets={assets}
 *   columns={DEFAULT_ASSET_COLUMNS.filter(c => ['asset', 'status'].includes(c.key))}
 * />
 *
 * @example
 * // Custom column added to the end
 * const cols = [
 *   ...DEFAULT_ASSET_COLUMNS,
 *   { key: 'actions', header: 'ACTIONS', render: (a) => <EditButton id={a.id} /> },
 * ];
 * <AssetTable assets={assets} columns={cols} />
 */
export default function AssetTable({
  assets,
  columns = DEFAULT_ASSET_COLUMNS,
  searchFields = ['name', 'code', 'serial'],
  searchPlaceholder = 'Search…',
  onRowClick,
}: AssetTableProps) {
  const theme = useTheme();

  // ── Local UI state ──────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  
  const [sortOrder, setSortOrder] = useState<'name-asc' | 'name-desc' | 'warranty' | 'newest'>('newest');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

  // ── Category tabs — derived entirely from the data ─────────────────────────

  const categoryTabs = useMemo(() => {
    const seen = new Set<string>();
    for (const a of assets) seen.add(a.category);
    return [
      { label: 'All', value: 'All' },
      ...[...seen].sort().map((c) => ({ label: c, value: c })),
    ];
  }, [assets]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: assets.length };
    for (const a of assets) counts[a.category] = (counts[a.category] ?? 0) + 1;
    return counts;
  }, [assets]);

  // ── Filtered rows ────────────────────────────────────────────────────────────

  const filteredAssets = useMemo(() => {
    const q = search.toLowerCase();
    let result = assets.filter((a) => {
      const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchesSearch =
        !q || searchFields.some((f) => (a[f] ?? '').toLowerCase().includes(q));
      return matchesCategory && matchesStatus && matchesSearch;
    });
    
    result.sort((a, b) => {
      if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
      if (sortOrder === 'warranty') {
        const dateA = a.warrantyExpiry ? new Date(a.warrantyExpiry).getTime() : 0;
        const dateB = b.warrantyExpiry ? new Date(b.warrantyExpiry).getTime() : 0;
        return dateA - dateB;
      }
      return (b.id || '').localeCompare(a.id || '');
    });

    return result;
  }, [assets, activeCategory, search, searchFields, statusFilter, sortOrder]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Box>
      {/* ── Category tabs ────────────────────────────────────────────────── */}
      <CategoryTabs
        tabs={categoryTabs}
        active={activeCategory}
        counts={categoryCounts}
        onChange={setActiveCategory}
      />

      <DataTable
        data={filteredAssets}
        columns={columns}
        keyExtractor={(asset) => asset.id}
        onRowClick={onRowClick}
        emptyMessage="No assets match your search."
        toolbar={
          <>
            <OutlinedInput
              id="asset-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              size="small"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                </InputAdornment>
              }
              sx={{
                flex: 1,
                fontSize: '0.85rem',
                '& fieldset': { borderColor: theme.palette.customColors.borderLight },
                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                borderRadius: 1.5,
              }}
            />
            <AppButton
              id="asset-filter-btn"
              variant="outline"
              size="sm"
              startIcon={<FilterListIcon sx={{ fontSize: 16 }} />}
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            >
              Filter
            </AppButton>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={() => setFilterAnchorEl(null)}
              slotProps={{ paper: { sx: { width: 160, borderRadius: 2, mt: 0.5 } } }}
            >
              {['All', 'Available', 'In Use', 'Maintenance', 'Retired', 'Lost'].map((status) => (
                <MenuItem
                  key={status}
                  selected={statusFilter === status}
                  onClick={() => { setStatusFilter(status); setFilterAnchorEl(null); }}
                  sx={{ fontSize: '0.85rem' }}
                >
                  {status}
                </MenuItem>
              ))}
            </Menu>

            <AppButton
              id="asset-sort-btn"
              variant="outline"
              size="sm"
              startIcon={<SwapVertIcon sx={{ fontSize: 16 }} />}
              onClick={(e) => setSortAnchorEl(e.currentTarget)}
            >
              Sort
            </AppButton>
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={() => setSortAnchorEl(null)}
              slotProps={{ paper: { sx: { width: 160, borderRadius: 2, mt: 0.5 } } }}
            >
              <MenuItem selected={sortOrder === 'newest'} onClick={() => { setSortOrder('newest'); setSortAnchorEl(null); }} sx={{ fontSize: '0.85rem' }}>Newest First</MenuItem>
              <MenuItem selected={sortOrder === 'name-asc'} onClick={() => { setSortOrder('name-asc'); setSortAnchorEl(null); }} sx={{ fontSize: '0.85rem' }}>Name (A-Z)</MenuItem>
              <MenuItem selected={sortOrder === 'name-desc'} onClick={() => { setSortOrder('name-desc'); setSortAnchorEl(null); }} sx={{ fontSize: '0.85rem' }}>Name (Z-A)</MenuItem>
              <MenuItem selected={sortOrder === 'warranty'} onClick={() => { setSortOrder('warranty'); setSortAnchorEl(null); }} sx={{ fontSize: '0.85rem' }}>Warranty Expiry</MenuItem>
            </Menu>
          </>
        }
      />
    </Box>
  );
}