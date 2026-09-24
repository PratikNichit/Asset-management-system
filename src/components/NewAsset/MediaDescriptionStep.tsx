import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { fieldSx, labelSx } from './shared';

interface Props {
  state: any;
  setters: any;
  refs: any;
  handlers: any;
}

export default function MediaDescriptionStep({ state, setters, refs, handlers }: Props) {
  const { images, documents, description } = state;
  const { setDescription } = setters;
  const { imageInputRef, docInputRef } = refs;
  const { handleImageUpload, handleRemoveImage, handleDocumentUpload, handleRemoveDocument } = handlers;

  return (
    <>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Manrope", sans-serif', color: 'text.primary' }}>
          Photos, files & notes
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.25 }}>
          Add anything that helps identify or document this asset. All optional.
        </Typography>
      </Box>

      <Box>
        <Typography sx={labelSx}>Images</Typography>
        <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" multiple style={{ display: 'none' }} />
        <Box
          onClick={() => imageInputRef.current?.click()}
          sx={{
            border: '2px dashed #CBD5E1',
            borderRadius: 2.5,
            p: 3,
            textAlign: 'center',
            bgcolor: 'background.default',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: 'primary.main', bgcolor: 'action.selected' },
          }}
        >
          <ImageOutlinedIcon sx={{ fontSize: 28, color: 'text.secondary', mb: 0.5 }} />
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary', fontFamily: '"Manrope", sans-serif' }}>
            Drag & drop or browse
          </Typography>
        </Box>

        {images.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', pt: 1.5 }}>
            {images.map((imgUrl: string, idx: number) => (
              <Box
                key={idx}
                sx={{ position: 'relative', width: 64, height: 64, borderRadius: 2, overflow: 'hidden', bgcolor: 'action.hover', border: 1, borderColor: 'divider' }}
              >
                <Box component="img" src={imgUrl} alt={`Asset preview ${idx + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                  sx={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, bgcolor: 'text.primary', color: 'background.paper', p: 0, '&:hover': { bgcolor: 'error.main' } }}
                >
                  <CloseIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box>
        <Typography sx={labelSx}>Documents</Typography>
        <input type="file" ref={docInputRef} onChange={handleDocumentUpload} accept=".pdf,.doc,.docx,.xlsx,.txt" style={{ display: 'none' }} />
        <Box
          onClick={() => docInputRef.current?.click()}
          sx={{
            bgcolor: 'background.default',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 1.5,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
          }}
        >
          <FileUploadOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 400 }}>
            Upload invoice, warranty card...
          </Typography>
        </Box>

        {documents.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 1.5 }}>
            {documents.map((doc: string, i: number) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.default', border: 1, borderColor: 'divider', borderRadius: 2, px: 1.5, py: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: '0.825rem', color: 'text.primary', fontWeight: 500 }}>{doc}</Typography>
                </Box>
                <IconButton size="small" onClick={() => handleRemoveDocument(i)}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box>
        <Typography sx={labelSx}>Description</Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          placeholder="Notes, condition, accessories included..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={fieldSx}
        />
      </Box>
    </>
  );
}
