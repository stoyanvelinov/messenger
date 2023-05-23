import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    fonts: {
        body: 'Outfit',
    },
    colors: {
        primary: '#142543',
        primaryMid: '#203355',
        primaryDark: '#12213c',
        primaryLight: '#52688E'
        // secondary: '#DBC2CF',
        //#EBBAB9
        //#C3979F
    },
    styles: {
        global: {
            'html, body': {
                h: '100vh',
                margin: '0',
                bg: '#142543',
                color: '#fff'
            }
        }
