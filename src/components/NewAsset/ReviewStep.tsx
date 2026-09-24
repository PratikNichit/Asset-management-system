import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

// Small presentational helper for the review step
function ReviewSection({ title, rows, onEdit }: { title: string; rows: [string, string][]; onEdit: () => void }) {
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2.5, p: 2.25 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: 'text.primary', fontFamily: '"Manrope", sans-serif' }}>{title}</Typography>
        <Chip
          label="Edit"
          size="small"
          onClick={onEdit}
          clickable
          sx={{ fontSize: '0.75rem', fontWeight: 600, height: 24, bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}
        />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.25 }}>
        {rows.map(([label, value]) => (
          <Box key={label}>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{label}</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'text.primary', fontWeight: 500 }}>{value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

interface Props {
  state: any;
  handlers: any;
}

export default function ReviewStep({ state, handlers }: Props) {
  const {
    assetName, assetId, serialNumber, category, brand, model,
    purchaseDate, purchaseCost, vendor, warrantyUntil,
    department, location, assignedEmployee, status,
    images, documents, description
  } = state;
  const { goToStep } = handlers;

  return (
    <>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}>
          Review & create
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.25 }}>
          Check everything's right before adding it to inventory.
        </Typography>
      </Box>

      <ReviewSection
        title="Basic information"
        onEdit={() => goToStep(0)}
        rows={[
          ['Asset name', assetName || '—'],
          ['Asset ID', assetId],
          ['Serial number', serialNumber || '—'],
          ['Category', category || '—'],
          ['Brand / Model', [brand, model].filter(Boolean).join(' / ') || '—'],
        ]}
      />
      <ReviewSection
        title="Purchase & warranty"
        onEdit={() => goToStep(1)}
        rows={[
          ['Purchase date', purchaseDate || '—'],
          ['Purchase cost', purchaseCost ? `₹${purchaseCost}` : '—'],
          ['Vendor', vendor || '—'],
          ['Warranty until', warrantyUntil || '—'],
        ]}
      />
      <ReviewSection
        title="Assignment"
        onEdit={() => goToStep(2)}
        rows={[
          ['Department', department || '—'],
          ['Location', location || '—'],
          ['Assigned to', assignedEmployee],
          ['Status', status],
        ]}
      />
      <ReviewSection
        title="Media"
        onEdit={() => goToStep(3)}
        rows={[
          ['Images', images.length ? `${images.length} attached` : '—'],
          ['Documents', documents.length ? `${documents.length} attached` : '—'],
          ['Description', description ? description : '—'],
        ]}
      />
    </>
  );
}
