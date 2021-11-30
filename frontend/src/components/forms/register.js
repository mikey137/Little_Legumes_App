import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSeedling } from '@fortawesome/free-solid-svg-icons'
import Button from '@mui/material/Button';
import { colorTheme } from '../../ThemeContext';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios'
import { Navigate } from 'react-router-dom'


export default function Register(){
    const [registerFirstName, setRegisterFirstName] = useState("")
    const [registerLastName, setRegisterLastName] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [registerVerifyPassword, setRegisterVerifyPassword] = useState("")
    const [registerEmail, setRegisterEmail] = useState("")
    const [isRegistered, setIsRegistered] = useState(false)
    const [isFisrtName, setIsFirstName] = useState(true)
    const [isLastName, setIsLastName] = useState(true)
    const [isEmail, setIsEmail] = useState(true)
    const [isPassword, setIsPassword] = useState(true)
    const [isFormComplete, setIsFormComplete] = useState(false)
    const [isEmailAlertOpen, setIsEmailAlertOpen] = useState(false)
    const [isPasswordMatchAlertOpen, setIsPasswordMatchAlertOpen] = useState(false)
    const [isPasswordStrengthAlertOpen, setIsPasswordStrengthAlertOpen] = useState(false)

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

    const checkFirstNameField = () => {
        if(registerFirstName === ""){
            setIsFirstName(false)
        }else{
            setIsFirstName(true)
        }
    }
    const checkLastNameField = () => {
        if(registerLastName === ""){
            setIsLastName(false)
        }else{
            setIsLastName(true)
        }
    }
    const checkEmailField = () => {
        if(registerEmail === ""){
            setIsEmail(false)
        }else{
            setIsEmail(true)
        }
        if(!emailPattern.test(registerEmail)){
            setIsEmailAlertOpen(true)
        }else{
            setIsEmailAlertOpen(false)  
        }
    }
    const checkPasswordField = () => {
        if(registerPassword === ""){
            setIsPassword(false) 
        }else{
            setIsPassword(true)
        }
        if(registerPassword !== registerVerifyPassword){
            setIsPasswordMatchAlertOpen(true)
        }else{
            setIsPasswordMatchAlertOpen(false) 
        }
        if(!strongPasswordPattern.test(registerPassword)){
            setIsPasswordStrengthAlertOpen(true)
        }else{
            setIsPasswordStrengthAlertOpen(false)
        }
    }
    const checkFormCompleteness = () => {
        if(
            registerFirstName !== "" &&
            registerLastName !== "" &&
            registerEmail !== "" &&
            emailPattern.test(registerEmail) &&
            registerPassword !== "" &&
            registerPassword === registerVerifyPassword &&
            strongPasswordPattern.test(registerPassword)
        ){
            setIsFormComplete(true)
        }
    }

    const registerUser = () => {
        checkFirstNameField()
        checkLastNameField()
        checkEmailField()
        checkPasswordField()
        checkFormCompleteness()
        if(isFormComplete){
        axios({
          method:"post",
          data:{
            firstName: registerFirstName,
            lastName: registerLastName,
            password: registerPassword,
            email: registerEmail
          },
          withCredentials: false,
          url: "http://localhost:3001/register"
        }).then((res) => {
            console.log(res)
            if(res.status === 200){
                setIsRegistered(true)
            }
        })}
      }

    if(isRegistered){
        return <Navigate replace to="/Dashboard" />
    }

    return(
        <ThemeProvider theme={colorTheme}>
            <div className="form-card">
                <h1 id="register-title">Register</h1>
                <FontAwesomeIcon icon={faSeedling} size="5x" inverse />
                <form className="registration-form">
                    <TextField error={!isFisrtName} required={true} color="secondary" sx={{width:'90%', m:2 }} id="outlined" label="First Name" variant="outlined" onChange={(e) => setRegisterFirstName(e.target.value)}/>
                    <TextField error={!isLastName}required={true} color="secondary" sx={{width:'90%', m:2 }} id="outlined" label="Last Name" variant="outlined" onChange={(e) => setRegisterLastName(e.target.value)} />
                    <TextField className = "email-field" error={!isEmail} type="email" required={true} color="secondary" sx={{width:'90%', m:2 }} id="outlined" label="Email" variant="outlined" onChange={(e) => setRegisterEmail(e.target.value)} />
                    <div className={isEmailAlertOpen ? 'alert' : 'hidden'}>Must Enter a Valid Email</div>
                    <TextField error={!isPassword}required={true} color="secondary" sx={{width:'90%', m:2 }} id="outlined" label="Password" variant="outlined" onChange={(e) => setRegisterPassword(e.target.value)} />
                    <TextField required={true} color="secondary" sx={{width:'90%', m:2 }} id="outlined" label="Verify Password" variant="outlined" onChange={(e) => setRegisterVerifyPassword(e.target.value)}/>
                    <div className={isPasswordMatchAlertOpen ? 'alert' : 'hidden'}>Passwords Must Match!</div>
                    <div className={isPasswordStrengthAlertOpen ? 'alert' : 'hidden'}>Passwords Must Be 8 characters and contain a number, symbol, lowercase and capital letter.</div>
                    <Button type="submit" onClick={(e) => {e.preventDefault(); registerUser()}} color="secondary" sx={{ width: '60%', m: 3 }} variant="contained">Submit</Button>
                </form>
            </div>
        </ThemeProvider>
    )
}