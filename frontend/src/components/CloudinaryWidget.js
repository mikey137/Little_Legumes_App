import React from 'react'
import Button from '@mui/material/Button';
import axios from 'axios'
import { apiConfig } from '../Constants';

export default function CloudinaryWidget({loggedInUser, dateId, userPhotos, setUserPhotos, momentsSubArray, setMomentsSubArray, isThisDemo, getPhotos}){
    let url = apiConfig.url.API_URL

    const myWidget = window.cloudinary.createUploadWidget({
        cloudName: 'nimbus137', 
        uploadPreset: 'k0l0cx3a'},
        (error, result) => { 
          if (!error && result && result.event === "success") { 
            console.log('Done! Here is the image info: ', result.info);
            if(isThisDemo){
                setUserPhotos(userPhotos.concat({url: result.info.url, dateId: dateId}))
                setMomentsSubArray(momentsSubArray.concat({url: result.info.url, dateId: dateId}))
            }else{
                addPhoto(result)
            }
          }
        }
    )

    const addPhoto = (result) => {
        let photoToAdd = {
          user: loggedInUser,
          dateId: dateId,
          momentCaption: '',
          thumbnailUrl: result.info.thumbnail_url,
          url: result.info.url
        } 
        setMomentsSubArray(oldSubArray => [...oldSubArray, photoToAdd])
        setUserPhotos(oldUserPhotos => [...oldUserPhotos, photoToAdd])
        axios({
          method: "POST",
          data: {
            user: loggedInUser,
            dateId: dateId,
            momentCaption: '',
            thumbnailUrl: result.info.thumbnail_url,
            url: result.info.url
          },
          withCredentials: true,
          url: `${url}/addphoto`,
        }).then((res) => {
          console.log(res) 
          getPhotos()
        });
      };

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