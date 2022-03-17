import React, {  useState } from 'react'
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios'
import { apiConfig } from '../Constants'

export default function EmailFab({ isEmailPrep, setIsEmailPrep, daysToEmail, setDaysToEmail}){
    const [emailAddress, setEmailAddress] = useState([""])

    let url = apiConfig.url.API_URL

    const handleSendEmail = async (e) => {
		try {
			await axios.post(`${url}/send_mail`, {photos: daysToEmail, emails: emailAddress,})
		} catch (err) {
			console.error(err)
		}
	}
    
    const handleCancelEmail = (e) => {
        setDaysToEmail([])
        setIsEmailPrep(false)
        setEmailAddress([])
    }
    return(
        <div className="email-outer-wrapper">
            <Fab 
                variant="extended" 
                color="secondary" 
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
                    sx={{ m: 1, width: '25ch', bgcolor: 'white' }}
                />
                <div className="button-container">
                    <Button 
                    sx={{m: 1, width: '50%', maxWidth: '250px'}} 
                    variant="contained" 
                    onClick={() => { handleSendEmail(); handleCancelEmail()}}
                    >
                    Send Email
                    </Button>
                    <Button 
                    color="info"
                    sx={{m: 1, width: '50%', maxWidth: '250px'}} 
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