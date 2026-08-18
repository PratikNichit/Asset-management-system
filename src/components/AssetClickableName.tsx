import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useLayout } from '../hooks/useLayout';

export interface AssetClickableNameProps {
  /** Asset ID or code used for navigation */
  assetId: string;
  /** Primary display name of the asset */
  name: string;
  /** Secondary subtitle e.g. code or category */
  code?: string;
}

export default function AssetClickableName({ assetId, name, code }: AssetClickableNameProps) {
  const { navigateToAsset } = useLayout();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateToAsset(assetId);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        cursor: 'pointer',
        width: 'fit-content',
        '&:hover .asset-title': {
          color: 'primary.main',
          textDecoration: 'underline',
        },
      }}
    >
      <Typography
        className="asset-title"
        sx={{
          fontWeight: 700,
          fontSize: '0.88rem',
          color: 'text.primary',
          lineHeight: 1.2,
          transition: 'color 0.15s ease',
        }}
      >
        {name}
      </Typography>
      {code && (
        <Typography
          sx={{
            fontSize: '0.72rem',
            color: 'text.secondary',
            mt: 0.15,
            fontFamily: '"Roboto Mono", monospace',
          }}
        >
          {code}
        </Typography>
      )}
    </Box>
  );
}
