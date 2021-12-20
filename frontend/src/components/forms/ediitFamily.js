import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { ThemeProvider } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { colorTheme } from '../../ThemeContext';
import axios from 'axios'
import { apiConfig } from '../../Constants';


export default function EditFamilyForm(member){
    const [firstName, setFirstName] = useState(member.member.firstName)
    const [lastName, setLastName] = useState(member.member.lastName)
    const [relationship, setRelationship] = useState(member.member.relationship)
    const [email, setEmail] = useState(member.member.email)
    const [connectedUser, setConnectedUser] = useState()
    const [isUpdateProcessed, setIsUpdateProcessed] = useState(false)

    let url = apiConfig.url.API_URL

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
          const foundUser = JSON.parse(loggedInUser);
          setConnectedUser(foundUser.username);
        }
    }, []);

    const editFamilyMember = (id) => {
        axios({
          method: "PUT",
          data: {
            firstName: firstName,
            lastName: lastName,
            relationship: relationship,
            email: email,
            connectedUser: connectedUser
          },
          withCredentials: true,
          url: `${url}/editfamilymember/${id}`,
        }).then((res) => {
          console.log(res) 
          if(res.data === "Member Info Updated"){
            setIsUpdateProcessed(true)
            window.location.reload(isUpdateProcessed)
          }
        });
    };

    return(
        <ThemeProvider theme={colorTheme}>
            <div className="add-family">
                <h2 id="friends-family-header">Update {member.member.firstName}'s Info</h2>
                <TextField 
                  onChange={(e) => setFirstName(e.target.value)} 
                  sx={{ m:2, bgcolor: 'white', width: '90%' }} 
                  id="outlined-basic" 
                  label="First Name" 
                  variant="outlined" 
                  defaultValue={member.member.firstName}
                />
                <TextField 
                  onChange={(e) => setLastName(e.target.value)} 
                  sx={{ m:2, bgcolor: 'white', width: '90%'  }} 
                  id="outlined-basic" 
                  label="Last Name" 
                  variant="outlined" 
                  defaultValue={member.member.lastName}
                />
                <FormControl sx={{ m:2, bgcolor: 'white', width: '90%' }}>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">relationship to child</InputLabel>
                    <NativeSelect
                        inputProps={{
                            id:'uncontrolled-native'
                        }}
                        onChange={(e) => setRelationship(e.target.value)}
                        defaultValue={member.member.relationship}
                    >
                        <option value={'mother'}>Mother</option>
                        <option value={'father'}>Father</option>
                        <option value={'grandmother'}>Grandmother</option>
                        <option value={'grandfather'}>Grandfather</option>
                        <option value={'aunt'}>Aunt</option>
                        <option value={'uncle'}>Uncle</option>
                        <option value={'friend'}>Friend</option>
                        <option value={'other'}>Other</option>
                    </NativeSelect>
                </FormControl>
                <TextField 
                  onChange={(e) => setEmail(e.target.value)} 
                  sx={{ m:2, bgcolor: 'white', width: '90%'  }} 
                  id="outlined-basic" 
                  label="Email" 
                  variant="outlined" 
                  defaultValue={member.member.email}
                />
                <Stack sx={{m:2}}spacing={2} direction="column" justifyContent="center" width="300px">
                    <Button onClick={() => editFamilyMember(member.member._id)} color ="secondary" variant="contained">Update</Button>
                </Stack>
            </div>
        </ThemeProvider>
    )
}