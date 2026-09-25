import { useMemo, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import type { MovementPoint, MovementRange } from '../redux/dashboardSlice';

// ─── Shared card shell ────────────────────────────────────────────────────────

interface DashCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function DashCard({ title, subtitle, action, children }: DashCardProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        borderRadius: 2.5,
        border: `1px solid ${theme.palette.customColors.borderLight}`,
        bgcolor: theme.palette.customColors.white,
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box>
          <Box sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 600, fontSize: '0.9375rem' }}>{title}</Box>
          {subtitle && <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>{subtitle}</Box>}
        </Box>
        {action}
      </Box>
      {children}
    </Box>
  );
}

function EmptyState({ message, height = 220 }: { message: string; height?: number }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        bgcolor: theme.palette.customColors.bgLight,
        color: 'text.secondary',
        fontSize: '0.8125rem',
      }}
    >
      {message}
    </Box>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Round the axis max up to a clean number so gridlines land on tidy values. */
function niceScale(max: number, ticks = 4) {
  if (max <= 0) return { max: ticks, step: 1 };
  const raw = max / ticks;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  const step = Math.max(1, nice * mag);
  return { max: step * ticks, step };
}

/** Catmull-Rom → cubic bezier, clamped so curves never dip below the baseline. */
function smoothPath(pts: [number, number][], top: number, bottom: number) {
  if (pts.length < 2) return '';
  const clamp = (y: number) => Math.min(bottom, Math.max(top, y));
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = clamp(p1[1] + (p2[1] - p0[1]) / 6);
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = clamp(p2[1] - (p3[1] - p1[1]) / 6);
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export const CHART_PALETTE = [
  '#5159D7', '#20B46B', '#EFA831', '#009BD8', '#E62C2C', '#9333EA', '#0D9488', '#94A3B8',
];

// ─── Asset movement (area chart) ──────────────────────────────────────────────

interface AssetMovementChartProps {
  data: MovementPoint[];
  range: MovementRange;
  onRangeChange: (r: MovementRange) => void;
  loading?: boolean;
}

const RANGE_SUBTITLE: Record<MovementRange, string> = {
  '7M': 'Added vs retired, last 7 months',
  '1Y': 'Added vs retired, last 12 months',
  All: 'Added vs retired, all time',
};

export function AssetMovementChart({ data, range, onRangeChange, loading }: AssetMovementChartProps) {
  const theme = useTheme();
  const added = theme.palette.primary.main;
  const retired = theme.palette.error.main;
  const axis = theme.palette.text.secondary;
  const grid = theme.palette.customColors.borderLight;

  const W = 800, H = 290;
  const pad = { l: 34, r: 12, t: 12, b: 28 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const bottom = pad.t + ih;

  const chart = useMemo(() => {
    if (data.length < 2) return null;
    const max = Math.max(...data.map((d) => Math.max(d.added, d.retired)), 0);
    const scale = niceScale(max);
    const x = (i: number) => pad.l + (i * iw) / (data.length - 1);
    const y = (v: number) => pad.t + ih - (v / scale.max) * ih;
    const addedPts = data.map((d, i) => [x(i), y(d.added)] as [number, number]);
    const retiredPts = data.map((d, i) => [x(i), y(d.retired)] as [number, number]);
    const yTicks = Array.from({ length: 5 }, (_, i) => i * scale.step);
    const labelEvery = Math.ceil(data.length / 12);
    return { scale, x, y, addedPts, retiredPts, yTicks, labelEvery, max };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const areaPath = (pts: [number, number][]) =>
    `${smoothPath(pts, pad.t, bottom)} L${pts[pts.length - 1][0]},${bottom} L${pts[0][0]},${bottom} Z`;

  const rangeButtons = (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {(['7M', '1Y', 'All'] as MovementRange[]).map((t) => (
        <Box
          key={t}
          component="button"
          onClick={() => onRangeChange(t)}
          sx={{
            px: 1.25,
            py: 0.25,
            borderRadius: 1,
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: 'pointer',
            bgcolor: t === range ? theme.palette.customColors.bgNeutral : 'transparent',
            color: t === range ? 'text.primary' : 'text.secondary',
            '&:hover': { bgcolor: theme.palette.customColors.bgNeutral },
          }}
        >
          {t}
        </Box>
      ))}
    </Box>
  );

  return (
    <DashCard title="Asset movement" subtitle={RANGE_SUBTITLE[range]} action={rangeButtons}>
      {!chart || chart.max === 0 ? (
        <EmptyState message={loading ? 'Loading movement…' : 'No assets added or retired in this period yet.'} height={250} />
      ) : (
        <>
          <Box sx={{ display: 'flex', gap: 2, mb: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: added }} /> Added
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: retired }} /> Retired
            </Box>
          </Box>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Assets added versus retired by month">
            <style>
              {`
                @keyframes revealRight {
                  from { clip-path: inset(0 100% 0 0); }
                  to { clip-path: inset(0 0 0 0); }
                }
              `}
            </style>
            <defs>
              <linearGradient id="mvAdded" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={added} stopOpacity="0.22" />
                <stop offset="100%" stopColor={added} stopOpacity="0" />
              </linearGradient>
              <linearGradient id="mvRetired" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={retired} stopOpacity="0.18" />
                <stop offset="100%" stopColor={retired} stopOpacity="0" />
              </linearGradient>
            </defs>

            {chart.yTicks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={W - pad.r} y1={chart.y(t)} y2={chart.y(t)} stroke={grid} strokeDasharray="3 4" />
                <text x={pad.l - 8} y={chart.y(t) + 4} textAnchor="end" fontSize="11" fill={axis}>{t}</text>
              </g>
            ))}

            <g style={{ animation: 'revealRight 1.2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards' }}>
              <path d={areaPath(chart.addedPts)} fill="url(#mvAdded)" />
              <path d={areaPath(chart.retiredPts)} fill="url(#mvRetired)" />
              <path d={smoothPath(chart.addedPts, pad.t, bottom)} fill="none" stroke={added} strokeWidth="2" />
              <path d={smoothPath(chart.retiredPts, pad.t, bottom)} fill="none" stroke={retired} strokeWidth="2" />
            </g>

            {data.map((d, i) => (
              <g key={d.key}>
                {i % chart.labelEvery === 0 && (
                  <text x={chart.x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} fontSize="11" fill={axis}>
                    {d.label}
                  </text>
                )}
                {/* invisible hit targets → native tooltips */}
                <Tooltip title={`${d.label}: ${d.added} added, ${d.retired} retired`} arrow placement="top">
                  <rect 
                    x={chart.x(i) - (iw / Math.max(1, data.length - 1)) / 2} 
                    y={0} 
                    width={iw / Math.max(1, data.length - 1)} 
                    height={H} 
                    fill="transparent" 
                    style={{ cursor: 'pointer' }}
                  />
                </Tooltip>
              </g>
            ))}
          </svg>
        </>
      )}
    </DashCard>
  );
}

// ─── Distribution by category (donut) ─────────────────────────────────────────

export interface CountDatum {
  name: string;
  value: number;
}

export function CategoryDonut({ data, loading }: { data: CountDatum[]; loading?: boolean }) {
  const theme = useTheme();
  const total = data.reduce((s, d) => s + d.value, 0);

  const segments = useMemo(() => {
    const r = 70;
    const c = 2 * Math.PI * r;
    let offset = 0;
    return data.map((d, i) => {
      const len = (d.value / total) * c;
      const seg = { ...d, color: CHART_PALETTE[i % CHART_PALETTE.length], dash: `${Math.max(len - (data.length > 1 ? 2 : 0), 0)} ${c}`, offset: -offset, r };
      offset += len;
      return seg;
    });
  }, [data, total]);

  return (
    <DashCard title="Distribution by category">
      {total === 0 ? (
        <EmptyState message={loading ? 'Loading assets…' : 'No assets to chart yet.'} />
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <svg viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="Assets by category">
              <style>
                {`
                  @keyframes spinDonut {
                    from { transform: rotate(-270deg) scale(0.5); opacity: 0; }
                    to { transform: rotate(-90deg) scale(1); opacity: 1; }
                  }
                `}
              </style>
              <g
                transform="rotate(-90 100 100)"
                style={{
                  animation: 'spinDonut 1.2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
                  transformOrigin: '100px 100px',
                }}
              >
                {segments.map((s) => (
                  <Tooltip key={s.name} title={`${s.name}: ${s.value}`} arrow placement="top">
                    <circle
                      cx="100"
                      cy="100"
                      r={s.r}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="26"
                      strokeDasharray={s.dash}
                      strokeDashoffset={s.offset}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                    />
                  </Tooltip>
                ))}
              </g>
              <text x="100" y="98" textAnchor="middle" fontSize="24" fontWeight="700" fill={theme.palette.text.primary} fontFamily="Manrope, sans-serif">
                {total.toLocaleString()}
              </text>
              <text x="100" y="118" textAnchor="middle" fontSize="11" fill={theme.palette.text.secondary}>assets</text>
            </svg>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 3, rowGap: 0.75 }}>
            {segments.map((s) => (
              <Box key={s.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.75rem', minWidth: 0 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color, flexShrink: 0 }} />
                <Box sx={{ color: 'text.secondary', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</Box>
                <Box sx={{ fontWeight: 500 }}>{s.value}</Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </DashCard>
  );
}

// ─── Assets by department (bar chart) ─────────────────────────────────────────

// ─── Assets by department (bar chart) ─────────────────────────────────────────

export function DepartmentBars({
  data,
  loading,
  onDetails,
}: {
  data: CountDatum[];
  loading?: boolean;
  onDetails?: () => void;
}) {
  const theme = useTheme();

  const axis = theme.palette.text.secondary;
  const grid = theme.palette.customColors.borderLight;

  const W = 800;
  const H = 270;

  const pad = {
    l: 34,
    r: 12,
    t: 12,
    b: 30,
  };

  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  // Get maximum value safely
  const maxValue = Math.max(...data.map((d) => d.value), 0);

  const scale = niceScale(maxValue);

  const y = (value: number) =>
    pad.t + ih - (value / scale.max) * ih;

  const slot = data.length > 0 ? iw / data.length : iw;

  const barW = Math.min(slot * 0.6, 96);

  const ticks = Array.from(
    { length: 5 },
    (_, i) => i * scale.step
  );

  const short = (value: string) =>
    value.length > 13
      ? `${value.slice(0, 12)}…`
      : value;

  const detailsLink = onDetails ? (
    <Box
      component="button"
      type="button"
      onClick={onDetails}
      sx={{
        border: 'none',
        bgcolor: 'transparent',
        p: 0,
        cursor: 'pointer',
        fontSize: '0.75rem',
        fontWeight: 500,
        color: theme.palette.primary.main,
      }}
    >
      Details
    </Box>
  ) : undefined;

  return (
    <DashCard
      title="Assets by department"
      action={detailsLink}
    >
      {data.length === 0 ? (
        <EmptyState
          message={
            loading
              ? 'Loading assets…'
              : 'No department data yet.'
          }
          height={240}
        />
      ) : (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="Assets per department"
        >
          <style>
            {`
              @keyframes growBar {
                from {
                  transform: scaleY(0);
                  opacity: 0;
                }

                to {
                  transform: scaleY(1);
                  opacity: 1;
                }
              }
            `}
          </style>

          {/* Y-axis gridlines */}
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={pad.l}
                x2={W - pad.r}
                y1={y(tick)}
                y2={y(tick)}
                stroke={grid}
                strokeDasharray="3 4"
              />

              <text
                x={pad.l - 8}
                y={y(tick) + 4}
                textAnchor="end"
                fontSize="11"
                fill={axis}
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const cx =
              pad.l +
              slot * index +
              slot / 2;

            const barHeight =
              pad.t +
              ih -
              y(item.value);

            return (
              <g key={item.name}>
                <Tooltip title={`${item.name}: ${item.value}`} arrow placement="top">
                  <rect
                    x={cx - barW / 2}
                    y={y(item.value)}
                    width={barW}
                    height={Math.max(barHeight, 0)}
                    rx={4}
                    fill={theme.palette.primary.main}
                    style={{
                      cursor: 'pointer',
                      animation:
                        'growBar 0.8s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
                      animationDelay: `${index * 0.05}s`,
                      opacity: 0,
                      transformOrigin: `0px ${pad.t + ih}px`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
                  />
                </Tooltip>

                {/* Department name */}
                <text
                  x={cx}
                  y={H - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill={axis}
                >
                  {short(item.name)}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </DashCard>
  );
}