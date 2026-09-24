import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AssetClickableName from '../components/AssetClickableName';
import AssetStatusBadge from '../components/AssetStatusBadge';
import type { Asset } from './asset';

// ─── Column Definition Type ───────────────────────────────────────────────────

export interface AssetColumnDef {
  /** Unique key — used as the React `key` for the header and cell. */
  key: string;
  /** Text shown in the `<th>`. */
  header: string;
  /** Returns the cell content for a given asset row. */
  render: (asset: Asset) => ReactNode;
  /** Optional min-width hint for the column (CSS value, e.g. '160px'). */
  minWidth?: string;
}

// ─── Shared cell helpers ──────────────────────────────────────────────────────

function AssetAvatar({ name }: { name: string }) {
  const initials = name
    .split(/[\s—]+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar
      sx={{
        width: 34,
        height: 34,
        bgcolor: 'rgba(81,89,215,0.10)',
        color: '#5159D7',
        fontSize: '0.72rem',
        fontWeight: 700,
        borderRadius: 1.5,
        flexShrink: 0,
      }}
    >
      {initials}
    </Avatar>
  );
}

function EmptyCell() {
  return <Typography sx={{ color: 'text.disabled', fontSize: '0.83rem' }}>—</Typography>;
}

// ─── Default column set ───────────────────────────────────────────────────────

export const DEFAULT_ASSET_COLUMNS: AssetColumnDef[] = [
  {
    key: 'asset',
    header: 'ASSET',
    minWidth: '200px',
    render: (asset) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <AssetAvatar name={asset.name} />
        <AssetClickableName assetId={asset.id} name={asset.name} code={asset.code} />
      </Box>
    ),
  },
  {
    key: 'category',
    header: 'CATEGORY',
    render: (asset) => (
      <Chip
        label={asset.category}
        size="small"
        sx={(theme) => ({
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(241,243,249,1)',
          color: 'text.primary',
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 22,
          borderRadius: 1,
        })}
      />
    ),
  },
  {
    key: 'serial',
    header: 'SERIAL',
    render: (asset) => (
      <Typography
        sx={{
          fontFamily: '"Roboto Mono", monospace',
          fontSize: '0.78rem',
          color: '#5159D7',
          letterSpacing: '0.01em',
        }}
      >
        {asset.serial}
      </Typography>
    ),
  },
  {
    key: 'department',
    header: 'DEPARTMENT',
    render: (asset) => asset.department,
  },
  {
    key: 'location',
    header: 'LOCATION',
    render: (asset) => (
      <Typography sx={{ fontSize: '0.83rem', whiteSpace: 'pre-line' }}>
        {asset.location.replace(' — ', '\n— ')}
      </Typography>
    ),
  },
  {
    key: 'assignedTo',
    header: 'ASSIGNED',
    render: (asset) =>
      asset.assignedTo ? (
        <Tooltip title={asset.assignedTo} placement="top">
          <Typography sx={{ fontSize: '0.83rem' }}>{asset.assignedTo}</Typography>
        </Tooltip>
      ) : (
        <EmptyCell />
      ),
  },
  {
    key: 'warranty',
    header: 'WARRANTY',
    render: (asset) =>
      asset.warrantyExpiry ? (
        <Typography sx={{ fontSize: '0.83rem' }}>{asset.warrantyExpiry}</Typography>
      ) : (
        <EmptyCell />
      ),
  },
  {
    key: 'status',
    header: 'STATUS',
    render: (asset) => <AssetStatusBadge status={asset.status} />,
  },
];
