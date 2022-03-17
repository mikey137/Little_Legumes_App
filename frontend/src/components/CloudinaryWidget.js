import React from 'react'
import Button from '@mui/material/Button';

export default function CloudinaryWidget({dateId, demoPhotos, setDemoPhotos, momentsSubArray, setMomentsSubArray}){
    const myWidget = window.cloudinary.createUploadWidget({
        cloudName: 'nimbus137', 
        uploadPreset: 'k0l0cx3a'},
        (error, result) => { 
          if (!error && result && result.event === "success") { 
            console.log('Done! Here is the image info: ', result.info);
             setDemoPhotos(demoPhotos.concat({url: result.info.url, dateId: dateId}))
             setMomentsSubArray(momentsSubArray.concat({url: result.info.url, dateId: dateId}))
          }
        }
    )

    return(
        <Button 
            onClick={() => {myWidget.open()}} 
            sx={{m: 1, width: '75%', maxWidth: '250px'}} 
            variant="contained" 
            id="upload_widget" 
            className="cloudinary-button"
        >
            Upload Photo
        </Button>
    )
}