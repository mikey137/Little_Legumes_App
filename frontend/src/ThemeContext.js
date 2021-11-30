import { createTheme } from '@mui/material/styles';

export const colorTheme = createTheme({
    palette: {
        primary:{
            main: '#8bc34a',
            light: '#a2cf6e',
            dark:'#618833',
            contrastText: 'white'
        },
        secondary:{
            main: '#00b9dd',
            light: '#00cef6',
            dark: '#0090ac'
        },
        info:{
            main:'#616161',
            light: '#424242',
            dark: '#757575'
        }
    },
    components:{
        MuiLink:{
            styleOverrides:{
                root:{
                    underline: 'none'
                }
            }
        }
    }
})

