import React, {  useState, useRef, useEffect} from 'react'
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import EmailIcon from '@mui/icons-material/Email';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import axios from 'axios'
import { apiConfig } from '../Constants'

export default function EmailFab({ isEmailPrep, setIsEmailPrep, daysToEmail, setDaysToEmail}){
    const [emailAddress, setEmailAddress] = useState([""])
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const timer = useRef();

    const buttonSx = {
        position: "relative",
        m: 1,
        width: '250px',
        ...(success && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[700],
          },
        }),
      };
    
      useEffect(() => {
    return () => {
        clearTimeout(timer.current);
    };
    }, []);


    let url = apiConfig.url.API_URL

    const handleButtonClick = () => {
        if (!loading) {
          setSuccess(false);
          setLoading(true);
          timer.current = window.setTimeout(() => {
            setSuccess(true);
            setLoading(false);
          }, 2000);
        }
      };

    const handleSendEmail = async (e) => {
		try {
            setSuccess(false)
            setLoading(true)

			const response = await axios.post(`${url}/send_mail`, 
                {photos: daysToEmail, emails: emailAddress,}
            )

           if(response.data === 'Email Sent'){
                setSuccess(true)
                setLoading(false)
                setTimeout(() => {
                    setDaysToEmail([])
                    setIsEmailPrep(false)
                    setEmailAddress([])
                    setSuccess(false)
                },2000)
           }
		} catch (err) {
			console.error(err)
		}
	}
    
    const handleCancelEmail = () => {
        console.log('test')
        setDaysToEmail([])
        setIsEmailPrep(false)
        setEmailAddress([])
        setSuccess(false)
    }
    return(
        <div className="email-outer-wrapper">
            <Fab 
                variant="extended" 
                color="primary" 
                aria-label="add"
                size="small"
                onClick={() => setIsEmailPrep(!isEmailPrep)}
            >
                <EmailIcon sx={{ mr: 1 }} />
                Share Moments
            </Fab>
            <div className={isEmailPrep ? "email-content-container" : "hidden"}>
                <p>Click Dates to Add Photos</p>
                <div className="moment-thumbnail-container">
                    {daysToEmail.map((day, index) => (
                        <div 
                            className="little-calendar-day" 
                            style= {{backgroundImage: `url(${day.url})`}}
                        >
                        </div>
                    ))}
                </div>
                <TextField 
                    id="filled-basic" 
                    label="Enter Email Address" 
                    variant="filled" 
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    sx={{ m: 1, width: '250px', bgcolor: 'white' }}
                />
                <div className="button-container">
                    <Button 
                    sx={buttonSx} 
                    variant="contained" 
                    disabled={loading}
                    onClick={() => { handleButtonClick(); handleSendEmail()}}
                    >
                    {success ? "Email Sent" : "Send Email"}
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                color: green[500],
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Button>
                    <Button 
                    color="info"
                    sx={{m: 1, width: '250px'}} 
                    variant="contained" 
                    onClick={handleCancelEmail}
                    >
                    Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}