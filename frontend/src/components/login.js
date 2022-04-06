import React,{useState} from 'react'
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { apiConfig } from '../Constants';

export default function Login({ setLoginStatus }){
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [isNoUserAlertOpen, setIsNoUserAlertOpen] = useState(false)
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  });

  let url = apiConfig.url.API_URL
  
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

  const login = async() => {
    try {
      const response = await axios({
        method: "POST",
        data: {
          username: loginEmail,
          password: loginPassword,
        },
        withCredentials: true,
        url: `${url}/login`,
      })

      const token = await response.data.jwtToken
      console.log(token)

      if(token){
        localStorage.setItem("token", token)
        setLoginStatus(true)
      }
    } catch (err) {
      console.log(err.message)
    }
  };

  return(
    <div className="landing-outer">
      <div className="landing-background"></div>
      <div className="landing-overlay"></div>
      <div className="login-container">
        <TextField 
          onChange={(e) => setLoginEmail(e.target.value)} 
          sx={{ m: 1, width: '25ch', bgcolor: 'white' }} 
          id="filled-basic" 
          label="Email" 
          variant="filled" 
        />
        <FormControl 
          onChange={(e) => setLoginPassword(e.target.value)} 
          sx={{ m: 1, width: '25ch', bgcolor: 'white' }} 
          variant="filled"
        >
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
            abel="Password"
          />
        </FormControl>
        <Button 
          onClick={login} 
          sx={{ m: 1, width: '25ch' }} 
          variant="contained"
        >
          Login
        </Button>
        <Link href="/register">
          <Button 
            sx={{ m: 1, width: '25ch', bgcolor: "white" }} 
            variant="outlined"
          >
            Sign Up
          </Button>
        </Link>
        <div className={isNoUserAlertOpen ? 'show' : 'hidden'}>
          <Alert sx={{ m: 1}} variant= "filled" severity="error">
            Sorry, please try a different email or password
          </Alert>
        </div> 
      </div>               
    </div>
  )
}