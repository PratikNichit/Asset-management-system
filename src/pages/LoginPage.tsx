import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import Tooltip from '@mui/material/Tooltip';
import AppButton from '../components/AppButton';
import { useAppSelector } from '../app/hooks';
import { selectAuthError } from '../redux/authSlice';

export interface LoginPageProps {
  /** Callback triggered when user submits login credentials. Should return a rejected promise on failure. */
  onLogin?: (email: string, password: string) => Promise<void>;
}

/**
 * LoginPage — Split-screen modern login page for the Asset Management System.
 *
 * Implements left-side authentication form and right-side hero showcase banner
 * matching theme tokens (`theme.palette.primary.main`, `theme.palette.customColors`).
 */
export default function LoginPage({ onLogin }: LoginPageProps) {
  const theme = useTheme();
  const authError = useAppSelector(selectAuthError);

  const [email, setEmail] = useState('nichitpratik9@gmail.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  // Combine local validation errors with Redux auth errors
  const error = localError || authError || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await onLogin?.(email.trim(), password);
    } catch {
      // error is already in Redux via authSlice.signIn.rejected
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* ── Left Column: Form Section ───────────────────────────────────── */}
      <Box
        sx={{
          flex: { xs: 1, md: 1.1, lg: 1 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 3, sm: 6, md: 8, lg: 12 },
          py: 4,
          bgcolor: theme.palette.customColors.white,
          zIndex: 1,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 440,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Logo & Brand Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.customColors.white,
                fontWeight: 800,
                fontSize: '1.25rem',
                fontFamily: '"Manrope", sans-serif',
                borderRadius: 2.5,
                boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
              }}
            >
              A
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.4rem',
                color: theme.palette.primary.main,
                letterSpacing: '-0.02em',
                fontFamily: '"Manrope", sans-serif',
              }}
            >
              Project Atlas
            </Typography>
          </Box>

          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              mb: 1,
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.75rem', sm: '2.1rem' },
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 3,
              fontSize: '0.925rem',
            }}
          >
            Please enter your credentials to access your dashboard.
          </Typography>

          {/* Demo Hint Banner */}
          <Box
            sx={{
              p: 1.5,
              mb: 3,
              borderRadius: 2,
              bgcolor: theme.palette.customColors.primaryTransparent,
              border: `1px solid ${theme.palette.primary.main}30`,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              Demo Credentials:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.785rem' }}>
                  Email: <strong>nichitpratik9@gmail.com</strong>
                </Typography>
                <Tooltip title="Copy Email">
                  <IconButton
                    size="small"
                    onClick={() => navigator.clipboard.writeText('nichitpratik9@gmail.com')}
                    sx={{ p: 0.25, color: theme.palette.primary.main }}
                  >
                    <ContentCopyOutlinedIcon sx={{ fontSize: '0.85rem' }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.785rem' }}>
                  Password: <strong>Admin@123</strong>
                </Typography>
                <Tooltip title="Copy Password">
                  <IconButton
                    size="small"
                    onClick={() => navigator.clipboard.writeText('Admin@123')}
                    sx={{ p: 0.25, color: theme.palette.primary.main }}
                  >
                    <ContentCopyOutlinedIcon sx={{ fontSize: '0.85rem' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {error && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.error.main,
                mb: 2,
                p: 1.25,
                bgcolor: theme.palette.customColors.errorTransparent,
                borderRadius: 1.5,
                fontWeight: 600,
              }}
            >
              {error}
            </Typography>
          )}

          {/* Email Address Field */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.75,
                fontSize: '0.785rem',
              }}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nichitpratik9@gmail.com"
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: theme.palette.customColors.bgLight,
                  '& fieldset': {
                    borderColor: theme.palette.customColors.borderLight,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '1.5px',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.35,
                  fontSize: '0.9rem',
                },
              }}
            />
          </Box>

          {/* Password Field */}
          <Box sx={{ mb: 2.5 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.75,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '0.785rem',
                }}
              >
                Password
              </Typography>
              <Link
                underline="hover"
                href="#forgot"
                onClick={(e) => e.preventDefault()}
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  cursor: 'pointer',
                }}
              >
                Forgot Password?
              </Link>
            </Box>
            <TextField
              fullWidth
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin@123"
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        edge="end"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowPassword((prev) => !prev);
                        }}
                        aria-label="toggle password visibility"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        ) : (
                          <VisibilityOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: theme.palette.customColors.bgLight,
                  '& fieldset': {
                    borderColor: theme.palette.customColors.borderLight,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '1.5px',
                  },
                },
                '& .MuiInputBase-input': {
                  py: 1.35,
                  fontSize: '0.9rem',
                },
              }}
            />
          </Box>

          {/* Remember Me Checkbox */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: theme.palette.customColors.borderLight,
                    '&.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                    p: 0.5,
                    mr: 0.5,
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                  Remember this device for 30 days
                </Typography>
              }
            />
          </Box>

          {/* Submit Button */}
          <AppButton
            type="submit"
            variant="default"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2.5,
              fontSize: '0.95rem',
              fontWeight: 700,
              bgcolor: theme.palette.primary.main,
              boxShadow: `0 8px 20px ${theme.palette.primary.main}35`,
              '&:hover': {
                bgcolor: '#434ab8',
                boxShadow: `0 10px 24px ${theme.palette.primary.main}50`,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: '#fff' }} />
            ) : (
              'Login to Dashboard'
            )}
          </AppButton>

          {/* Contact Sales Link */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
              Don't have an enterprise account?{' '}
              <Link
                underline="hover"
                href="#contact"
                onClick={(e) => e.preventDefault()}
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  cursor: 'pointer',
                }}
              >
                Contact Sales
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Right Column: Hero Banner Showcase ────────────────────────────── */}
      <Box
        sx={{
          flex: { md: 1, lg: 1.2 },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { md: 6, lg: 8 },
          position: 'relative',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #373DBB 60%, #2A2F99 100%)`,
          color: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Tech Dot Overlay Pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
            opacity: 0.6,
          }}
        />

        {/* Floating Light Ambient Glows */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Header Pill Badge */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              borderRadius: 10,
              bgcolor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: '#20B46B',
                boxShadow: '0 0 8px #20B46B',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: '0.725rem',
                letterSpacing: '0.1em',
                color: 'rgba(255, 255, 255, 0.95)',
                textTransform: 'uppercase',
              }}
            >
              SYSTEM STATUS: OPTIMAL
            </Typography>
          </Box>
        </Box>

        {/* Middle Main Showcase Content */}
        <Box sx={{ position: 'relative', zIndex: 1, my: 'auto', maxWidth: 600 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontFamily: '"Manrope", sans-serif',
              fontSize: { md: '2.5rem', lg: '3.1rem' },
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              mb: 2.5,
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            Mastering every asset with precision control.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: { md: '1rem', lg: '1.1rem' },
              lineHeight: 1.6,
              mb: 5,
              maxWidth: 520,
            }}
          >
            Project Atlas provides real-time visibility across your entire operation, turning complex data into actionable operational insights.
          </Typography>

          {/* Stats Bar */}
          <Box
            sx={{
              pt: 3.5,
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              gap: { md: 4, lg: 6 },
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { md: '1.8rem', lg: '2.1rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                99.9%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 700,
                  fontSize: '0.675rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                UPTIME SLAS
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { md: '1.8rem', lg: '2.1rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                2,148
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 700,
                  fontSize: '0.675rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                ASSETS TRACKED
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { md: '1.8rem', lg: '2.1rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                150+
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 700,
                  fontSize: '0.675rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                INTEGRATIONS
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Bottom Testimonial Glassmorphic Card */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            p: 3,
            borderRadius: 3.5,
            bgcolor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontStyle: 'italic',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              color: 'rgba(255, 255, 255, 0.95)',
              mb: 2,
            }}
          >
            "Atlas transformed our maintenance response speed by 40% in just two quarters. It's the engine of our operation."
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                color: '#FFF',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid rgba(255, 255, 255, 0.4)',
              }}
            >
              PN
            </Avatar>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: 500,
                fontSize: '0.8rem',
              }}
            >
              <strong>Pratik Nicit</strong> — Founder, Atlas.co
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
