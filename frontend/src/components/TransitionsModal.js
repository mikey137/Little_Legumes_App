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
  alignItems: 'center'
};

export default function TransitionsModal({ isModalOpen, setIsModalOpen, momentsSubArray, setMomentsSubArray, demoPhotos, setDemoPhotos, dateId, setDateId }) {
  const [isEditing, setIsEditing] = useState(false)
  const [momentCaption, setMomentCaption] = useState("")

  const deletePhoto = (moment) => {
    document.getElementById(moment.dateId).style.backgroundImage = ""
    setMomentsSubArray(momentsSubArray.filter((photo) => photo.url !== moment.url))
    setDemoPhotos(demoPhotos.filter((photo) => photo.url !== moment.url))
  }

  const editCaption = (moment) => {
    moment.momentCaption = momentCaption
    setIsEditing(false)
  }

  return (
    <ThemeProvider theme={colorTheme}>
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
                onClick={() => setIsModalOpen(false)}
              />
              <CloudinaryWidget
                momentsSubArray = { momentsSubArray }
                setMomentsSubArray = { setMomentsSubArray }  
                demoPhotos = { demoPhotos }
                setDemoPhotos = { setDemoPhotos } 
                dateId = { dateId }
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
                      <EditIcon color="secondary" />
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