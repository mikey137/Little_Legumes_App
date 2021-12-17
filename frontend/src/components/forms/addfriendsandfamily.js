import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ThemeProvider } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { colorTheme } from '../../ThemeContext';
import Navbar from '../navbar';
import axios from 'axios'
import { apiConfig } from '../../Constants';


export default function AddFAndFForm(member){
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [relationship, setRelationship] = useState("")
    const [email, setEmail] = useState("")
    const [connectedUser, setConnectedUser] = useState()
    const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false)
    const [editingFamily, setEditingFamily] = useState(false)
    const [memberToEdit, setMemberToEdit] = useState(member)

    let url = apiConfig.url.API_URL

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
          const foundUser = JSON.parse(loggedInUser);
          setConnectedUser(foundUser.username);
        }
    }, []);

    useEffect(() => {
      setMemberToEdit(member)
    }, [member])

    const addFamilyMember = () => {
        axios({
          method: "POST",
          data: {
            firstName: firstName,
            lastName: lastName,
            relationship: relationship,
            email: email,
            connectedUser: connectedUser
          },
          withCredentials: true,
          url: `${url}/addFamilyMember`,
        }).then((res) => {
          console.log(res) 
          if(res.data === "New Family Member Added"){
            setIsSuccessAlertOpen(true)
          }
        });
    };

    return(
        <ThemeProvider theme={colorTheme}>
            <Navbar />
            <div className="add-family">
                <h2 id="friends-family-header">Add family and friends</h2>
                <TextField 
                  onChange={(e) => setFirstName(e.target.value)} 
                  sx={{ m:2, bgcolor: 'white', width: '90%' }} 
                  id="outlined-basic" 
                  label="First Name" 
                  variant="outlined" 
                  defaultValue={memberToEdit.member} 
                />
                <TextField 
                  onChange={(e) => setLastName(e.target.value)} 
                  sx={{ m:2, bgcolor: 'white', width: '90%'  }} 
                  id="outlined-basic" 
                  label="Last Name" 
                  variant="outlined" 
                />
                <FormControl sx={{ m:2, bgcolor: 'white', width: '90%' }}>
                    <InputLabel id="demo-simple-select-label">relationship to child</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={relationship}
                    label="Relationship to Child"
                    onChange={(e) => setRelationship(e.target.value)}
                    >
                    <MenuItem value={'mother'}>Mother</MenuItem>
                    <MenuItem value={'father'}>Father</MenuItem>
                    <MenuItem value={'grandmother'}>Grandmother</MenuItem>
                    <MenuItem value={'grandfather'}>Grandfather</MenuItem>
                    <MenuItem value={'aunt'}>Aunt</MenuItem>
                    <MenuItem value={'uncle'}>Uncle</MenuItem>
                    <MenuItem value={'friend'}>Friend</MenuItem>
                    <MenuItem value={'other'}>Other</MenuItem>
                    </Select>
                </FormControl>
                <TextField 
                  onChange={(e) => setEmail(e.target.value)} 
                  sx={{ m:2, bgcolor: 'white', width: '90%'  }} 
                  id="outlined-basic" 
                  label="Email" 
                  variant="outlined" 
                />
                <div className={isSuccessAlertOpen ? 'show' : 'hidden' }>
                  <Alert severity="success">Family Member Successfully Added</Alert>
                </div>
                <Stack sx={{m:2}}spacing={2} direction="column" justifyContent="center" width="300px">
                    <Button onClick={addFamilyMember} color ="secondary" variant="contained">Add Person</Button>
                    <Button color = "info" variant="contained">Cancel</Button>
                </Stack>
            </div>
        </ThemeProvider>
    )
}