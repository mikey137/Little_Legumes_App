import React, {  useState, useRef, useEffect} from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import EmailIcon from '@mui/icons-material/Email';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import axios from 'axios'
import { apiConfig } from '../Constants'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];
  

export default function EmailFab({ isEmailPrep, setIsEmailPrep, daysToEmail, setDaysToEmail, isThisDemo}){
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [familyMembers, setFamilyMembers] = useState([])
    const [emailList, setEmailList] = useState([])
    const timer = useRef();

    const buttonSx = {
        position: "relative",
        m: 1,
        width: '250px',
        ...(success && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[700],
          },
        }),
    };
    
      useEffect(() => {
    return () => {
        clearTimeout(timer.current);
    };
    }, []);


    let url = apiConfig.url.API_URL

    useEffect(() => {
        getFamilyMembers()
    },[])

    const getFamilyMembers = () => {
        axios({
          method: "GET",
          withCredentials: true,
          url: `${url}/familymembers`,
        }).then((res) => {
            const members = res.data.family
            console.log(members)
            setFamilyMembers(members)
        });
      };

    const handleButtonClick = () => {
        if (!loading) {
          setSuccess(false);
          setLoading(true);
          timer.current = window.setTimeout(() => {
            setSuccess(true);
            setLoading(false);
          }, 2000);
        }
      };

    const handleSendEmail = async (e) => {
		try {
            setSuccess(false)
            setLoading(true)

			const response = await axios.post(`${url}/send_mail`, 
                {photos: daysToEmail, emails: emailList,}
            )

           if(response.data === 'Email Sent'){
                setSuccess(true)
                setLoading(false)
                setTimeout(() => {
                    setDaysToEmail([])
                    setIsEmailPrep(false)
                    setEmailList([])
                    setSuccess(false)
                },2000)
           }
		} catch (err) {
			console.error(err)
		}
	}
    
    const handleCancelEmail = () => {
        console.log('test')
        setDaysToEmail([])
        setIsEmailPrep(false)
        setEmailList([])
        setSuccess(false)
    }

    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        console.log(event.target.key)
        setEmailList(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    return(
        <div className="email-outer-wrapper">
            <Fab 
                variant="extended" 
                color="primary" 
                aria-label="add"
                size="small"
                onClick={() => setIsEmailPrep(!isEmailPrep)}
            >
                <EmailIcon sx={{ mr: 1 }} />
                Share Moments
            </Fab>
            <div className={isEmailPrep ? "email-content-container" : "hidden"}>
                <p>Click Dates to Add Photos</p>
                <div className="moment-thumbnail-container">
                    {daysToEmail.map((day, index) => (
                        <div 
                            className="little-calendar-day" 
                            style= {{backgroundImage: `url(${day.url})`}}
                        >
                        </div>
                    ))}
                </div>
                {isThisDemo ? 
                    <TextField 
                        id="filled-basic" 
                        label="Enter Email Address" 
                        variant="filled" 
                        value={emailList}
                        onChange={(e) => setEmailList(e.target.value)}
                        sx={{ m: 1, width: '250px', bgcolor: 'white' }}
                    />
                    :
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-chip-label">Family Members To Email</InputLabel>
                        <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={emailList}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                        >
                        {familyMembers.map((member) => (
                            <MenuItem
                            key= {member.firstName}
                            value={member.email}
                            >
                            {member.email}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                }               
                <div className="button-container">
                    <Button 
                    sx={buttonSx} 
                    variant="contained" 
                    disabled={loading}
                    onClick={() => { handleButtonClick(); handleSendEmail()}}
                    >
                    {success ? "Email Sent" : "Send Email"}
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                color: green[500],
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Button>
                    <Button 
                    color="info"
                    sx={{m: 1, width: '250px'}} 
                    variant="contained" 
                    onClick={handleCancelEmail}
                    >
                    Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}