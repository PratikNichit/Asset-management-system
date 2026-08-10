import { createTheme } from '@mui/material/styles';

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

const theme = createTheme({
  palette: {
    primary: {
      main: '#5159D7',
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
      default: '#FDFDFF', // bgLightest
      paper: '#FFFFFF', // white
    },
    text: {
      primary: '#1B1B1B',
      secondary: '#321C00',
    },
    customColors: {
      primaryTransparent: '#5159D71A',
      successTransparent: '#20B46B26',
      warningTransparent: '#EFA83133',
      errorTransparent: '#E62C2C26',
      infoTransparent: '#009BD826',
      
      bgLightest: '#FDFDFF',
      bgLight: '#F9FAFD',
      bgNeutral: '#F1F3F9',
      bgNeutralDark: '#EDF0F8',
      
      borderLight: '#E2E5E9',
      white: '#FFFFFF',
      
      bgLightestTransparent: '#FDFDFFCC',
      bgNeutralTransparent1: '#F1F3F980',
      bgNeutralTransparent2: '#F1F3F966',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
