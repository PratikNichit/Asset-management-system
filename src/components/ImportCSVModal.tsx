import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import AppButton from './AppButton';

interface ImportCSVModalProps {
  open: boolean;
  onClose: () => void;
  onImportSuccess: (count: number) => void;
}

export default function ImportCSVModal({ open, onClose, onImportSuccess }: ImportCSVModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onImportSuccess(4);
      setFile(null);
      onClose();
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Manrope", sans-serif' }}>
          Import Employees CSV
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Upload a standard `.csv` file containing employee names, roles, emails, and departments.
        </Typography>

        <Box
          component="label"
          sx={{
            border: '2px dashed',
            borderColor: file ? 'primary.main' : 'customColors.borderLight',
            borderRadius: 2.5,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: file ? 'primary.light' : 'customColors.bgLight',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.light',
            },
          }}
        >
          <input type="file" accept=".csv" hidden onChange={handleFileChange} />
          {file ? (
            <>
              <InsertDriveFileOutlinedIcon sx={{ fontSize: 36, color: 'primary.main' }} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'primary.main' }}>
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(file.size / 1024).toFixed(1)} KB
              </Typography>
            </>
          ) : (
            <>
              <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                Click to browse or drag & drop CSV file
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CSV format: name, role, email, department, location
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <AppButton variant="outline" size="sm" onClick={onClose}>
          Cancel
        </AppButton>
        <AppButton
          variant="default"
          size="sm"
          disabled={!file}
          loading={isUploading}
          onClick={handleImport}
        >
          Upload & Import
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
