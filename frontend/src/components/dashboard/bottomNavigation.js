import React, { useState } from 'react'
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
import UploadPhotoWidget from '../uploads'
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function BottomNavbar(){
    const [state, setState] = useState({
        bottom: false
    })
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
            <TextField id="outlined-basic" label="Date" variant="outlined" />
            <TextField
              sx={{m: 3, width: '90%'}}
              id="outlined-multiline-static"
              label="Caption"
              multiline
              rows={4}
            />
            <Button sx={{m: 3, width: '75%'}} variant="contained" color="secondary">Submit</Button> 
            <UploadPhotoWidget />
        </Box>
    )
    
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