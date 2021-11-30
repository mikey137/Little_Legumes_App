import React from "react"
import { useEffect } from "react"
import Button from '@mui/material/Button';

export default function UploadPhotoWidget() {

  useEffect(()=> {
    var myWidget = window.cloudinary.createUploadWidget({
      cloudName: 'nimbus137', 
      uploadPreset: 'k0l0cx3a'},
      (error, result) => { 
        if (!error && result && result.event === "success") { 
          console.log('Done! Here is the image info: ', result.info); 
        }
      }
    )
    
    document.getElementById("upload_widget").addEventListener(
      "click",
      function () {
        myWidget.open();
      },
      false
    );
  })

  return(     
    <Button variant="contained" id="upload_widget" className="cloudinary-button">Upload Photo</Button>        
  )
}





