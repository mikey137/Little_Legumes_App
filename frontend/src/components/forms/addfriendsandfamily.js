import React from 'react'
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ThemeProvider } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { colorTheme } from '../../ThemeContext';
import Navbar from '../navbar';


export default function AddFAndFForm(){

    return(
        <ThemeProvider theme={colorTheme}>
            <Navbar />
            <div className="add-family">
                <h2 id="friends-family-header">Add family and friends</h2>
                <TextField sx={{ m:2, bgcolor: 'white', width: '90%' }} id="outlined-basic" label="First Name" variant="outlined" />
                <TextField sx={{ m:2, bgcolor: 'white', width: '90%'  }} id="outlined-basic" label="Last Name" variant="outlined" />
                <FormControl sx={{ m:2, bgcolor: 'white', width: '90%' }}>
                    <InputLabel id="demo-simple-select-label">relationship to child</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={''}
                    label="Age"
                    onChange={''}
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
                <TextField sx={{ m:2, bgcolor: 'white', width: '90%'  }} id="outlined-basic" label="Email" variant="outlined" />
                <Stack sx={{m:2}}spacing={2} direction="column" justifyContent="center" width="300px">
                    <Button color ="secondary" variant="contained">Add Person</Button>
                    <Button color = "info" variant="contained">Cancel</Button>
                </Stack>
            </div>
        </ThemeProvider>
    )
}