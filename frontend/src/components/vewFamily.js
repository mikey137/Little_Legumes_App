import React, {useState, useEffect} from 'react';
import Navbar from './navbar'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { colorTheme } from '../ThemeContext';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios'
import { apiConfig } from '../Constants';

export default function ViewFamily() {
    const [familyMembers, setFamilyMembers] = useState([])

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
                        <EditIcon color="secondary" sx={{margin: 1}}  />
                        <IconButton aria-label="delete" onClick={() => {deleteFamilyMember(member._id); getFamilyMembers()}}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem> 
                    ))}
                </List>
            </div>
        </ThemeProvider>
    </div>
  );
}