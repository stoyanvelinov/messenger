import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    fonts: {
        body: 'Outfit',
    },
    colors: {
        primary: '#142543',
        secondary: '#FEB2B2',
    },
    styles: {
        'body': {
            margin: 0
        }
    }
}
);
export default theme;