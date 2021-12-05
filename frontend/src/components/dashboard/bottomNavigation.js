import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'

export default function BottomNavbar(){
    const [dateOfMoment, setDateOfMoment] = useState("")
    const [momentCaption, setMomentCaption] = useState("")
    const [loggedInUser, setLoggedInUser] = useState("")
    const [photoThumbnailUrl, setPhotoThumbnailUrl] = useState("")
    const [photoUrl, setPhotoUrl] = useState("")
    const [state, setState] = useState({
        bottom: false
    })

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
          const foundUser = JSON.parse(loggedInUser);
          setLoggedInUser(foundUser.username);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear()
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (
          event &&
          event.type === 'keydown' &&
          (event.key === 'Tab' || event.key === 'Shift')
        ) {
          return;
        }
        setState({ ...state, [anchor]: open });
    };

    const myWidget = window.cloudinary.createUploadWidget({
        cloudName: 'nimbus137', 
        uploadPreset: 'k0l0cx3a'},
        (error, result) => { 
          if (!error && result && result.event === "success") { 
            console.log('Done! Here is the image info: ', result.info);
            setPhotoUrl(result.info.url)
            setPhotoThumbnailUrl(result.info.thumbnail_url)
          }
        }
      )

    const drawerContent = (anchor) => (
        <Box
            sx={{ 
                width: '100vw', 
                height: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
            role="presentation"
        >
            <IconButton sx={{mr: '90vw'}}onClick={toggleDrawer(anchor, false)}><CloseIcon /></IconButton>
            <Typography sx={{m: 3}} variant="h6" component="h2">
              Add Moment
            </Typography>
            <TextField helperText="date of moment" type="date" onChange={(e) => {setDateOfMoment(e.target.value)}} id="outlined-basic"  variant="outlined" />
            <TextField
              onChange={(e) => {setMomentCaption(e.target.value)}}
              sx={{m: 3, width: '90%', maxWidth: '400px'}}
              id="outlined-multiline-static"
              label="Caption"
              multiline
              rows={4}
            />
            <Button onClick={() => {myWidget.open()}} sx={{m: 1, width: '75%', maxWidth: '250px'}} variant="contained" id="upload_widget" className="cloudinary-button">Upload Photo</Button>
            <Button onClick={addPhoto} sx={{m: 1, width: '75%', maxWidth: '250px'}} variant="contained" color="secondary">Submit</Button> 
        </Box>
    )

    const addPhoto = () => {
        axios({
          method: "POST",
          data: {
            user: loggedInUser,
            dateOfMoment: dateOfMoment,
            momentCaption: momentCaption,
            thumbnailUrl: photoThumbnailUrl,
            url: photoUrl
          },
          withCredentials: true,
          url: "http://localhost:3001/addphoto",
        }).then((res) => {
          console.log(res) 
        });
    };
    
    return(
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
                <BottomNavigation showLabels={true}>
                    <BottomNavigationAction label="View Family" icon={<GroupIcon />} />
                    <BottomNavigationAction label="Add Moment" icon={<AddCircleIcon />} onClick={toggleDrawer('bottom', true)} />
                    <SwipeableDrawer
                        anchor={'bottom'}
                        open={state['bottom']}
                        onClose={toggleDrawer('bottom', false)}
                        onOpen={toggleDrawer('bottom', true)}   
                    >
                        {drawerContent('bottom')}
                    </SwipeableDrawer>  
                    <BottomNavigationAction onClick={handleLogout}label="Logout" icon={<LogoutIcon/>} />
                </BottomNavigation>
            </Paper>
    )
}