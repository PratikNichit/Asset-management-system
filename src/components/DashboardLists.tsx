import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import type { Asset } from '../types/asset';
import type { ActivityItem } from '../redux/dashboardSlice';
import { bucketStatus } from '../redux/dashboardSlice';
import { DashCard } from './DashboardCharts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeDay(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(new Date()) - startOf(d)) / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Recent activity ──────────────────────────────────────────────────────────

export function RecentActivity({ items, loading }: { items: ActivityItem[]; loading?: boolean }) {
  const theme = useTheme();

  return (
    <DashCard title="Recent activity" subtitle="Latest assignments and maintenance across your workspace">
      {items.length === 0 ? (
        <Box sx={{ py: 3, textAlign: 'center', fontSize: '0.8125rem', color: 'text.secondary' }}>
          {loading ? 'Loading activity…' : 'No activity yet. Assign an asset or schedule maintenance to see it here.'}
        </Box>
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, position: 'relative' }}>
          {items.map((item, i) => (
            <Box
              key={item.id}
              component="li"
              sx={{ display: 'flex', gap: 1.5, position: 'relative', pb: i === items.length - 1 ? 0 : 2 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.75 }}>
                <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: theme.palette.primary.main, flexShrink: 0 }} />
                {i !== items.length - 1 && (
                  <Box sx={{ width: '1px', flex: 1, bgcolor: theme.palette.customColors.borderLight, mt: 0.5 }} />
                )}
              </Box>
              <Box>
                <Box sx={{ fontSize: '0.875rem' }}>
                  <Box component="span" sx={{ fontWeight: 600 }}>{item.actor}</Box>{' '}
                  <Box component="span" sx={{ color: 'text.secondary' }}>{item.action}</Box>{' '}
                  <Box component="span" sx={{ fontWeight: 500 }}>{item.target}</Box>
                </Box>
                <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>{relativeDay(item.date)}</Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </DashCard>
  );
}

// ─── Recently added assets table ──────────────────────────────────────────────

const COLS = '2.2fr 1.2fr 1.2fr 1.4fr 0.9fr';

function StatusChip({ status }: { status: string }) {
  const theme = useTheme();
  const cc = theme.palette.customColors;
  const bucket = bucketStatus(status);

  const map = {
    assigned: { bg: cc.successTransparent, fg: theme.palette.success.main },
    available: { bg: cc.infoTransparent, fg: theme.palette.info.main },
    maintenance: { bg: cc.warningTransparent, fg: theme.palette.warning.main },
    retired: { bg: cc.bgNeutralTransparent1, fg: theme.palette.text.secondary },
    other: { bg: cc.errorTransparent, fg: theme.palette.error.main },
  }[bucket];

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.25,
        borderRadius: 10,
        fontSize: '0.75rem',
        fontWeight: 500,
        bgcolor: map.bg,
        color: 'text.primary',
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: map.fg }} />
      {status}
    </Box>
  );
}

interface RecentAssetsTableProps {
  assets: Asset[];
  loading?: boolean;
  onViewAll: () => void;
}

export function RecentAssetsTable({ assets, loading, onViewAll }: RecentAssetsTableProps) {
  const theme = useTheme();
  const border = `1px solid ${theme.palette.customColors.borderLight}`;

  const viewAll = (
    <Box
      component="button"
      onClick={onViewAll}
      sx={{ border: 'none', bgcolor: 'transparent', p: 0, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, color: theme.palette.primary.main }}
    >
      View all
    </Box>
  );

  const headCell = { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'text.secondary' } as const;

  return (
    <DashCard title="Recently added assets" action={viewAll}>
      {assets.length === 0 ? (
        <Box sx={{ py: 3, textAlign: 'center', fontSize: '0.8125rem', color: 'text.secondary' }}>
          {loading ? 'Loading assets…' : 'No assets yet. Add your first asset to see it here.'}
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 680 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: COLS, px: 1, py: 1, bgcolor: theme.palette.customColors.bgLight, borderRadius: 1.5 }}>
              <Box sx={headCell}>Asset</Box>
              <Box sx={headCell}>Category</Box>
              <Box sx={headCell}>Department</Box>
              <Box sx={headCell}>Assigned to</Box>
              <Box sx={{ ...headCell, textAlign: 'right' }}>Status</Box>
            </Box>
            {assets.map((a, i) => (
              <Box
                key={a.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: COLS,
                  alignItems: 'center',
                  px: 1,
                  py: 1.25,
                  fontSize: '0.875rem',
                  borderTop: i === 0 ? 'none' : border,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</Box>
                  <Box sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontFamily: 'monospace' }}>{a.code}</Box>
                </Box>
                <Box sx={{ color: 'text.secondary' }}>{a.category || '—'}</Box>
                <Box sx={{ color: 'text.secondary' }}>{a.department || '—'}</Box>
                <Box sx={{ color: 'text.secondary' }}>{a.assignedTo || '—'}</Box>
                <Box sx={{ textAlign: 'right' }}>
                  <StatusChip status={a.status} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </DashCard>
  );
}
