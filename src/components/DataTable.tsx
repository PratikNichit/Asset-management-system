import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export interface DataTableColumnDef<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  minWidth?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumnDef<T>[];
  keyExtractor: (item: T) => string;
  toolbar?: React.ReactNode;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  toolbar,
  selectedIds,
  onSelectionChange,
  emptyMessage = 'No results match your search.',
  onRowClick,
}: DataTableProps<T>) {
  const theme = useTheme();

  const isSelectionEnabled = selectedIds !== undefined;
  const isAllSelected = data.length > 0 && data.every((item) => selectedIds?.has(keyExtractor(item)));
  const isIndeterminate = !isAllSelected && data.some((item) => selectedIds?.has(keyExtractor(item)));

  function handleSelectAll(checked: boolean) {
    if (!onSelectionChange || !selectedIds) return;
    const next = new Set(selectedIds);
    for (const item of data) {
      const id = keyExtractor(item);
      checked ? next.add(id) : next.delete(id);
    }
    onSelectionChange(next);
  }

  function handleSelectRow(id: string, checked: boolean) {
    if (!onSelectionChange || !selectedIds) return;
    const next = new Set(selectedIds);
    checked ? next.add(id) : next.delete(id);
    onSelectionChange(next);
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.customColors.borderLight}`,
        borderRadius: 2.5,
        overflow: 'hidden',
        bgcolor: theme.palette.customColors.white,
      }}
    >
      {toolbar && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${theme.palette.customColors.borderLight}`,
            flexWrap: 'wrap',
          }}
        >
          {toolbar}
        </Box>
      )}

      <TableContainer>
        <Table size="small" aria-label="data table">
          <TableHead>
            <TableRow
              sx={{
                bgcolor: theme.palette.customColors.bgLight,
                '& th': {
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  color: 'text.secondary',
                  letterSpacing: '0.04em',
                  py: 1.25,
                  borderBottom: `1px solid ${theme.palette.customColors.borderLight}`,
                },
              }}
            >
              {isSelectionEnabled && (
                <TableCell padding="checkbox" sx={{ pl: 2 }}>
                  <Checkbox
                    size="small"
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell key={col.key} style={col.minWidth ? { minWidth: col.minWidth } : undefined}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (isSelectionEnabled ? 1 : 0)}
                  sx={{ textAlign: 'center', py: 6 }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds?.has(id) ?? false;

                return (
                  <TableRow
                    key={id}
                    hover
                    selected={isSelected}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    sx={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      transition: 'background 0.1s',
                      '& td': {
                        py: 1.5,
                        fontSize: '0.83rem',
                        borderBottom: `1px solid ${theme.palette.customColors.borderLight}`,
                        color: 'text.primary',
                      },
                      '&.Mui-selected': {
                        bgcolor: `${theme.palette.primary.main}08`,
                      },
                    }}
                  >
                    {isSelectionEnabled && (
                      <TableCell padding="checkbox" sx={{ pl: 2 }} onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(id, e.target.checked)}
                        />
                      </TableCell>
                    )}

                    {columns.map((col) => (
                      <TableCell key={col.key}>{col.render(item)}</TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
