import { createTheme } from '@mui/material/styles';

export const colorTheme = createTheme({
    palette: {
        primary:{
            main: 'rgb(255,75,3)',
            light: 'rgb(255,127,77)',
            dark:'rgba(230, 65, 0)',
            contrastText: 'rgb(253,247,236)'
        },
        secondary:{
            main: 'rgb(252,255,101)',
            light: 'rgb(255, 127, 101)',
            dark: 'rgb(255,85,51)'
        },
        info:{
            main:'#616161',
            light: '#424242',
            dark: '#757575'
        },
        white:{
            main:'rgb(253,247,236)'
        },
        brownish:{
            main: 'rgb(52,33,3)'
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

