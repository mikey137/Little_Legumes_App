import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { apiConfig } from '../../Constants';

export default function Register({isLoggedIn, setIsLoggedIn}){
    const [registerFirstName, setRegisterFirstName] = useState("")
    const [registerLastName, setRegisterLastName] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [registerVerifyPassword, setRegisterVerifyPassword] = useState("")
    const [registerEmail, setRegisterEmail] = useState("")
    const [isFisrtName, setIsFirstName] = useState(true)
    const [isLastName, setIsLastName] = useState(true)
    const [isEmail, setIsEmail] = useState(true)
    const [isPassword, setIsPassword] = useState(true)
    const [isFormComplete, setIsFormComplete] = useState(false)
    const [isEmailAlertOpen, setIsEmailAlertOpen] = useState(false)
    const [isPasswordMatchAlertOpen, setIsPasswordMatchAlertOpen] = useState(false)
    const [isPasswordStrengthAlertOpen, setIsPasswordStrengthAlertOpen] = useState(false)

    let url = apiConfig.url.API_URL

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

    const verifyForm = () => {
        checkFirstNameField()
        checkLastNameField()
        checkEmailField()
        checkPasswordField()
        checkFormCompleteness()
    }

    const registerUser = async () => {
        try {
            const response = await axios({
                method:"post",
                data:{
                firstName: registerFirstName,
                lastName: registerLastName,
                password: registerPassword,
                email: registerEmail,
                username: registerEmail
                },
                withCredentials: true,
                url: `${url}/register`
            })
            if(response.data === 'User Created'){
                setIsLoggedIn(true)
            }  
        } catch (err) {
            console.error(err)
        }   
    }

    useEffect(() => {
        if(isFormComplete){
            registerUser()
        }
    },[isFormComplete])

    if(isLoggedIn){
        return <Navigate replace to="/calendar" />
    }

    return( 
        <div className="registration-outer">
            <div className="registration-img">
                <h3>Never forget a moment!</h3>
            </div>
            <form className="registration-form">
                <h1 id="register-title">Register</h1>
                <TextField 
                    error={!isFisrtName} 
                    required={true} 
                    color="primary" 
                    sx={{width:'90%', maxWidth: '450px', m:2 }} 
                    id="outlined" 
                    label="First Name" 
                    variant="outlined" 
                    onChange={(e) => setRegisterFirstName(e.target.value)}
                />
                <TextField 
                    error={!isLastName}
                    required={true} 
                    color="primary" 
                    sx={{width:'90%', maxWidth: '450px', m:2 }} 
                    id="outlined" 
                    label="Last Name" 
                    variant="outlined" 
                    onChange={(e) => setRegisterLastName(e.target.value)} 
                />
                <TextField 
                    className = "email-field" 
                    error={!isEmail} 
                    type="email" 
                    required={true} 
                    color="primary" 
                    sx={{width:'90%', maxWidth: '450px', m:2 }} 
                    id="outlined" 
                    label="Email" 
                    variant="outlined" 
                    onChange={(e) => setRegisterEmail(e.target.value)} 
                />
                <div className={isEmailAlertOpen ? 'alert' : 'hidden'}>
                    Must Enter a Valid Email
                </div>
                <TextField 
                    error={!isPassword}
                    required={true} 
                    color="primary" 
                    sx={{width:'90%', maxWidth: '450px', m:2 }} 
                    id="outlined" 
                    label="Password" 
                    variant="outlined" 
                    onChange={(e) => setRegisterPassword(e.target.value)} 
                />
                <TextField 
                    required={true} 
                    color="primary" 
                    sx={{width:'90%', maxWidth: '450px', m:2 }} 
                    id="outlined" 
                    label="Verify Password" 
                    variant="outlined" 
                    onChange={(e) => setRegisterVerifyPassword(e.target.value)}
                />
                <div className={isPasswordMatchAlertOpen ? 'alert' : 'hidden'}>
                    Passwords Must Match!
                </div>
                <div className={isPasswordStrengthAlertOpen ? 'alert' : 'hidden'}>
                    Passwords Must Be 8 characters and contain a number, symbol, lowercase and capital letter.
                </div>
                <Button 
                    type="submit" 
                    onClick={(e) => {e.preventDefault(); verifyForm()}} 
                    color="primary" 
                    sx={{ width: '60%', maxWidth: '250px', m: 3 }} 
                    variant="contained"
                >
                    Submit
                </Button>
            </form>
        </div>
    )
}