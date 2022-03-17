import React from 'react'
import Button from '@mui/material/Button';

export default function Landing(){
    return(
        <div className="landing-outer">
            <div className="landing-background"></div>
            <div className="landing-overlay"></div>
            <div className="landing-text">
                Share and track all your kids precious moments!
            </div>
            <div className="landing-btn-container">
                <Button 
                    variant="contained" 
                    sx={{ m: 1, width: '25ch' }} 
                    color="primary"
                >
                    <a href="/demo">View Demo</a> 
                </Button>
            </div>
        </div>
    )
}