import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#7C3AED', // base
      600: '#6D28D9',
      700: '#5B21B6',
      800: '#4C1D95',
      900: '#3C1676',
      950: '#2A0E4A',
    },
  },
});
export default MyPreset;
