import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { colorTheme } from "../ThemeContext";
import { ThemeProvider } from "@mui/material";
import CloudinaryWidget from './CloudinaryWidget';
import axios from 'axios';
import { apiConfig } from '../Constants';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  height: '80vh',
  maxWidth: 450,
  maxHeight: 900,
  bgcolor: 'rgb(255,247,236)',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  FocusEvent: 'none'
};

export default function TransitionsModal({ isModalOpen, setIsModalOpen, momentsSubArray, setMomentsSubArray, userPhotos, setUserPhotos, dateId, isThisDemo, loggedInUser, getPhotos }) {
  const [isEditing, setIsEditing] = useState(false)
  const [momentCaption, setMomentCaption] = useState("")

  let url = apiConfig.url.API_URL

  const deletePhoto = (moment) => {
    if(isThisDemo){
      document.getElementById(moment.dateId).style.backgroundImage = ""
      setMomentsSubArray(momentsSubArray.filter((photo) => photo.url !== moment.url))
      setUserPhotos(userPhotos.filter((photo) => photo.url !== moment.url))
    }else{
      document.getElementById(moment.dateId).style.backgroundImage = ""

      let newUserPhotosArray = userPhotos.filter((photo) => photo._id !== moment._id)
      setUserPhotos(newUserPhotosArray)
      
      let newSubArray = momentsSubArray.filter((photo) => photo._id !== moment._id)
      setMomentsSubArray(newSubArray)

      axios({
        method: "DELETE",
        withCredentials: true,
        url: `${url}/deletephoto/${moment._id}`,
      }).then((res) => {
        console.log('photo deleted')
      });
    }
  }

  const editCaption = (moment) => {
    if(isThisDemo){
      moment.momentCaption = momentCaption
      setIsEditing(false)
    }else{
      moment.momentCaption = momentCaption
      axios({
        method: "PUT",
        data: {
          user: moment.loggedInUser,
          dateId: moment.dateId,
          momentCaption: momentCaption,
          thumbnailUrl: moment.photoThumbnailUrl,
          url: moment.photoUrl
        },
        withCredentials: true,
        url: `${url}/editphoto/${moment._id}`,
      }).then((res) => {
        console.log(res) 
        if(res.data === "Photo Edit Completed"){
          setIsEditing(false)
        }
      });
    }
  }

  return (
    <ThemeProvider theme={colorTheme}>
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={isModalOpen}
          onClose={() => {setIsModalOpen(false); setIsEditing(false); }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isModalOpen}>
            <Box sx={style}>
              <CloseIcon 
                sx={{position: 'absolute', top: '10px', left: '10px', cursor: 'pointer'}}
                onClick={() => {setIsModalOpen(false); setIsEditing(false)}}
              />
              <CloudinaryWidget
                momentsSubArray = { momentsSubArray }
                setMomentsSubArray = { setMomentsSubArray }  
                userPhotos = { userPhotos }
                setUserPhotos = { setUserPhotos } 
                dateId = { dateId }
                loggedInUser = { loggedInUser }
                isThisDemo = { isThisDemo}
                getPhotos = { getPhotos }
              />
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Photos From Today
              </Typography>
              <div className = "moments-container">
                {momentsSubArray.map((moment, index) => (
                  <div className = "moment-wrapper">
                    <div className="moment-image" style={{backgroundImage: `url(${moment.url})`}}></div>
                    <p className={isEditing ? "hidden" : "moment-caption" }>{moment.momentCaption}</p>
                    <div className={isEditing ? "editing-container-display" : "editing-container-hidden"}>
                      <TextField
                        onChange={(e) => setMomentCaption(e.target.value)}
                        sx={{m: 3, width: '90%'}}
                        id="outlined-multiline-static"
                        label="Caption"
                        multiline
                        rows={4}
                      /> 
                      <Button 
                        onClick={() => editCaption(moment)} 
                        sx={{m: 1, width: '75%', maxWidth: '250px'}} 
                        variant="contained"
                      >
                        Submit Changes
                      </Button>
                      <Button 
                        onClick={() => setIsEditing(false)} 
                        sx={{m: 1, width: '75%', maxWidth: '250px'}} 
                        variant="contained"
                        color="info"
                      >
                        Cancel
                      </Button>
                    </div>
                    <IconButton 
                      aria-label="edit" 
                      onClick={() => setIsEditing(true)} >
                      <EditIcon color="brownish" />
                    </IconButton>
                    <IconButton 
                      aria-label="delete" 
                      onClick={() => deletePhoto(moment)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </div>
                ))}
              </div>
            </Box>
          </Fade>
        </Modal>
      </div>
    </ThemeProvider>
  );
}