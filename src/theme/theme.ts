import { createTheme, type Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      primaryTransparent: string;
      successTransparent: string;
      warningTransparent: string;
      errorTransparent: string;
      infoTransparent: string;
      
      bgLightest: string;
      bgLight: string;
      bgNeutral: string;
      bgNeutralDark: string;
      
      borderLight: string;
      white: string;
      
      bgLightestTransparent: string;
      bgNeutralTransparent1: string;
      bgNeutralTransparent2: string;
    };
  }
  interface PaletteOptions {
    customColors?: Partial<Palette['customColors']>;
  }
}

export function getAppTheme(mode: 'light' | 'dark' = 'light'): Theme {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#6366F1' : '#5159D7',
      },
      success: {
        main: '#20B46B',
      },
      warning: {
        main: '#EFA831',
      },
      error: {
        main: '#E62C2C',
      },
      info: {
        main: '#009BD8',
      },
      background: {
        default: isDark ? '#0F172A' : '#FDFDFF',
        paper: isDark ? '#1E293B' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F8FAFC' : '#1B1B1B',
        secondary: isDark ? '#94A3B8' : '#4A5568',
      },
      customColors: {
        primaryTransparent: isDark ? 'rgba(99, 102, 241, 0.2)' : '#5159D71A',
        successTransparent: isDark ? 'rgba(32, 180, 107, 0.2)' : '#20B46B26',
        warningTransparent: isDark ? 'rgba(239, 168, 49, 0.25)' : '#EFA83133',
        errorTransparent: isDark ? 'rgba(230, 44, 44, 0.25)' : '#E62C2C26',
        infoTransparent: isDark ? 'rgba(0, 155, 216, 0.25)' : '#009BD826',
        
        bgLightest: isDark ? '#0F172A' : '#FDFDFF',
        bgLight: isDark ? '#1E293B' : '#F9FAFD',
        bgNeutral: isDark ? '#334155' : '#F1F3F9',
        bgNeutralDark: isDark ? '#475569' : '#EDF0F8',
        
        borderLight: isDark ? '#334155' : '#E2E5E9',
        white: isDark ? '#1E293B' : '#FFFFFF',
        
        bgLightestTransparent: isDark ? 'rgba(15, 23, 42, 0.8)' : '#FDFDFFCC',
        bgNeutralTransparent1: isDark ? 'rgba(51, 65, 85, 0.5)' : '#F1F3F980',
        bgNeutralTransparent2: isDark ? 'rgba(51, 65, 85, 0.3)' : '#F1F3F966',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"Manrope", sans-serif' },
      h2: { fontFamily: '"Manrope", sans-serif' },
      h3: { fontFamily: '"Manrope", sans-serif' },
      h4: { fontFamily: '"Manrope", sans-serif' },
      h5: { fontFamily: '"Manrope", sans-serif' },
      h6: { fontFamily: '"Manrope", sans-serif' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
}

const theme = getAppTheme('light');
export default theme;
