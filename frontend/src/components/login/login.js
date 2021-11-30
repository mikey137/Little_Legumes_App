import React from 'react'
import './login.css'
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSeedling } from '@fortawesome/free-solid-svg-icons'
import Link from '@mui/material/Link';
import { ThemeProvider } from '@mui/material/styles';
import { colorTheme } from '../../ThemeContext';



export default function Login(){
    const [values, setValues] = React.useState({
        password: '',
        showPassword: false,
      });
    
      const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
      };
    
      const handleClickShowPassword = () => {
        setValues({
          ...values,
          showPassword: !values.showPassword,
        });
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    return(
      <ThemeProvider theme={colorTheme}>
        <div className="container">
            <div className="sliding-background"></div>
            <div className="title_login_card">
                <h1>Little Legumes</h1>
                <div className="login_card">
                <FontAwesomeIcon icon={faSeedling} size="10x" inverse />
                    <TextField sx={{ m: 1, width: '25ch', bgcolor: 'white' }} id="filled-basic" label="Email" variant="filled" />
                    <FormControl sx={{ m: 1, width: '25ch', bgcolor: 'white' }} variant="filled">
                        <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                        <FilledInput
                            id="filled-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <Link href="/dashboard"><Button sx={{ m: 1, width: '25ch' }} variant="contained">Login</Button></Link>
                    <Link href="/register"><Button sx={{ m: 1, width: '25ch', bgcolor: "white" }} variant="outlined">Sign Up</Button></Link>
                </div>
            </div>
        </div>
      </ThemeProvider>
    )
}