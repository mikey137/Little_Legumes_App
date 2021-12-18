import React, {useState, useEffect} from 'react';
import Navbar from './navbar'
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { colorTheme } from '../ThemeContext';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios'
import { apiConfig } from '../Constants';
import AddFAndFForm from './forms/addfriendsandfamily';
import EditFamilyForm from './forms/ediitFamily';

export default function ViewFamily() {
    const [familyMembers, setFamilyMembers] = useState([])
    const [familyMemberToEdit, setFamilyMemberToEdit] = useState()
    const [isDrawOpen, setIsDrawOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    let url = apiConfig.url.API_URL

    const getFamilyMembers = () => {
        axios({
          method: "GET",
          withCredentials: true,
          url: `${url}/familymembers`,
        }).then((res) => {
          const members = res.data.family
          setFamilyMembers(members)
          console.log('Got Family')
          console.log(res.data)
        });
    };
    
    useEffect(() => {
        getFamilyMembers()
    },[])

    const deleteFamilyMember = (id) => {
        console.log(id)
        axios({
          method: "DELETE",
          withCredentials: true,
          url: `${url}/deletefamily/${id}`,
        }).then((res) => {
          console.log('family member deleted')
        });
    };

    const handleOpenDraw = (e) => {
        setIsDrawOpen(true)
        setIsEdit(false)
    }

    const handleCloseDraw = (e) => {
        setIsDrawOpen(false)
    }

    const drawerContent = (anchor) => (
        <ThemeProvider theme={colorTheme} >
            <Box
            sx={{ 
                width: '100vw', 
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
            role="presentation"
            >
                <IconButton 
                    sx={{mr: '90vw'}}
                    onClick={handleCloseDraw}
                >
                    <CloseIcon />
                </IconButton>
                {isEdit ? <EditFamilyForm member= {familyMemberToEdit} /> : <AddFAndFForm />}   
            </Box>
        </ThemeProvider>
    )

  return (
    <div>
        <Navbar />
        <ThemeProvider theme={colorTheme} >
            <div className="list-container">
                <h2 className="family-list-title">Friends and Family</h2>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                {familyMembers.map((member) => (
                    <ListItem key={member._id} alignItems="flex-start" sx={{marginBottom: 1}}>
                        <AccountCircleIcon sx={{fontSize: 50, marginRight: 2}} />
                        <ListItemText
                            primary= {`${member.firstName} ${member.lastName}`} 
                            secondary={
                            <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {member.email}
                            </Typography>
                            -{member.relationship}
                            </React.Fragment>
                        }
                        />
                        <IconButton aria-label="delete" onClick={() => {setIsEdit(true); handleOpenDraw(); setFamilyMemberToEdit(member) }}>
                            <EditIcon color="secondary" />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => {deleteFamilyMember(member._id); getFamilyMembers()}}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </ListItem> 
                    ))}
                </List>
                <Button 
                    onClick={handleOpenDraw} 
                    sx={{ m: 1, width: '25ch', }} 
                    variant="outlined"
                >
                    Add Family Member
                </Button>
            </div>
        </ThemeProvider>
        <SwipeableDrawer
            anchor={'bottom'}
            open={isDrawOpen}
            onClose={handleCloseDraw}
            onOpen={handleOpenDraw}   
        >
            {drawerContent('bottom')}
        </SwipeableDrawer>
    </div>
  );
}