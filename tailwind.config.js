/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',    
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY
        'blue-primary': '#2C3E50',
        'blue-primary-100': '#E3EAF0',
        'blue-primary-200': '#C8D4E1',
        'blue-primary-300': '#ACBFD1',
        'blue-primary-400': '#90A9C2',
        'blue-primary-500': '#7594B3',
        'blue-primary-600': '#5A7EA3',
        'blue-primary-700': '#4A6987',
        'blue-primary-800': '#3B536C',
        'blue-primary-900': '#233240',
        'blue-primary-1000':'#1B2530',

        // SECONDARY
        'green-secondary': '#2E8B57',
        'green-secondary-100': '#E0F5E9',
        'green-secondary-200': '#C2EBD4',
        'green-secondary-300': '#A3E1BE',
        'green-secondary-400': '#85D7A9',
        'green-secondary-500': '#66CC93',
        'green-secondary-600': '#48C27E',
        'green-secondary-700': '#38AA6A',
        'green-secondary-800': '#267348',
        'green-secondary-900': '#1E5B39',
        'green-secondary-1000':'#16432A',

        // SUCCESS
        'success': '#2E8B57',
        'success-100': '#AEE4C6',
        'success-200': '#5CC98C',
        'success-300': '#21633E',

        // WARNING 
        'warning': '#FFA07A',
        'warning-100': '#FFD0BD',
        'warning-200': '#FF6122',
        'warning-300': '#C93900',

        // ERROR
        'error': '#F44336',
        'error-100': '#FBC0BC',
        'error-200': '#F88279',
        'error-300': '#C4170B',

        // NEUTRALS
        'neutral-white': '#FFF',
        'neutral-secondary-100': '#E7E7E7',
        'neutral-secondary-200': '#D0CFCF',
        'neutral-secondary-300': '#B9B7B7',
        'neutral-secondary-400': '#A29F9F',
        'neutral-secondary-500': '#8B8686',
        'neutral-secondary-600': '#746E6E',
        'neutral-secondary-700': '#5C5757',
        'neutral-secondary-800': '#444040',
        'neutral-secondary-900': '#2C292A',
        'neutral-secondary-1000':'#151314',
        'neutral-black': '#0A0A0B',

      },
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
    },
  },
  plugins: [],
}

