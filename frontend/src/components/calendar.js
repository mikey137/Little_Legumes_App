import React, { useEffect, useState } from 'react'
import moment from 'moment'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import InfiniteScroll from "react-infinite-scroll-component"
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Fab from '@mui/material/Fab';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios'
import { apiConfig } from '../Constants';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '400px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export default function Calendar(){
  const [months, setMonths] = useState([moment().format("MMMM YYYY"),moment().add(-1,'M').format("MMMM YYYY"), moment().add(-2,'M').format("MMMM YYYY") ])
  const [monthCounter, setMonthCounter] = useState(-3)
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [dateId, setDateId] = useState("")
  const [momentCaption, setMomentCaption] = useState("")
  const [loggedInUser, setLoggedInUser] = useState("")
  const [photoThumbnailUrl, setPhotoThumbnailUrl] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [userPhotos, setUserPhotos] = useState([])
  const [momentsSubArray, setMomentsSubArray] = useState([])
  const [isPhotoUploadAlertOpen, setIsPhotoUploadAlertOpen] = useState(false)
  const [isDailyMomentsDrawOpen, setIsDailyMomentsDrawOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isEmailPrep, setIsEmailPrep] = useState(false)
  const [daysToEmail, setDaysToEmail] = useState([])
  const [familyEmails, setFamilyEmails] = useState([])
  
  let url = apiConfig.url.API_URL

  useEffect(() => {
    getUser()
  },[])

  useEffect(() => {
    if(loggedInUser !== ""){
      getFamilyMembers()
      getPhotos()
    }
  },[loggedInUser])

  useEffect(() => {
    mapPhotosToDates()
  },[userPhotos])

  const getUser = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${url}/user`,
      headers: { jwt_token: localStorage.token }
    }).then((res) => {
      setLoggedInUser(res.data.username)
    });
  };

  const getFamilyMembers = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${url}/familymembers`,
    }).then((res) => {
      const members = res.data.family
      console.log(members)
      setFamilyEmails(members)
      console.log('Got Family')
    });
  };

  const getPhotos = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: `${url}/photos`,
    }).then((res) => {
      const photos = res.data.photos
      setUserPhotos(photos)
      console.log('Got the Photos')
      console.log(res)
    });
  };

  const mapPhotosToDates = () => {
    for(let i = 0; i < userPhotos.length; i++){
      let photo = userPhotos[i]
      let id = photo.dateId
      let thumbnail = photo.url
      let day = document.getElementById(id)
      if(day){
        day.style.backgroundImage = `url(${thumbnail})`
      }
    }
  }

  const handleSendEmail = async (e) => {
		try {
			await axios.post(`${url}/send_mail`, {photos: daysToEmail, emails: familyEmails, user: loggedInUser})
		} catch (error) {
			console.error(error)
		}
	}

  const addPhoto = () => {
    let photoToAdd = {
      user: loggedInUser,
      dateId: dateId,
      momentCaption: momentCaption,
      thumbnailUrl: photoThumbnailUrl,
      url: photoUrl
    } 
    setMomentsSubArray(oldSubArray => [...oldSubArray, photoToAdd])
    setUserPhotos(oldUserPhotos => [...oldUserPhotos, photoToAdd])
    axios({
      method: "POST",
      data: {
        user: loggedInUser,
        dateId: dateId,
        momentCaption: momentCaption,
        thumbnailUrl: photoThumbnailUrl,
        url: photoUrl
      },
      withCredentials: true,
      url: `${url}/addphoto`,
    }).then((res) => {
      console.log(res) 
    });
  };

  const deletePhoto = (moment) => {
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
  };

  const editPhoto = (moment) => {
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
  };

  // useEffect(() => {
  //   const loggedInUser = localStorage.getItem("user");
  //   if (loggedInUser) {
  //     const foundUser = JSON.parse(loggedInUser);
  //     setLoggedInUser(foundUser.username);
  //   }
  //   getPhotos()
  //   getFamilyMembers()
  // }, [])

  const addPhotoInfoToModal = (id) => {
    let subArray = userPhotos.filter(photo => photo.dateId === id)
    setMomentsSubArray(subArray)
  }
 
  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }
  
  const addMoreMonths = () => {
    let newMonth = moment().add(monthCounter,'M').format("MMMM YYYY") 
    setMonths(months.concat(newMonth))
    setMonthCounter(monthCounter -1)
    mapPhotosToDates()
  }
    
  let daysInThisMonth = moment().daysInMonth()
  let firstDayOfMonth = moment().startOf('month').format('d')
    
  function completedCalendarGrid(m){
    let blanks = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      blanks.push(<td className="calendar-day">{""}</td>);
    }
    let daysInMonth = []
    for(let d = 1; d <= daysInThisMonth; d++){
      daysInMonth.push(<td 
          onClick={isEmailPrep ? handleAddDayToEmail : handleOpenDraw} 
          key={d} 
          id={`${m}+${d}`} 
          className="calendar-day"
        >
          {d}
        </td>
        
      )
    }
    let totalSlots = blanks.concat(daysInMonth)
    let rows = []
    let cells = []
    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });
    const completedCalendarGrid = rows.map((d,i) => {
      return <tr id='test'>{d}</tr>
    })
    return completedCalendarGrid
  }

  const myWidget = window.cloudinary.createUploadWidget({
    cloudName: 'nimbus137', 
    uploadPreset: 'k0l0cx3a'},
    (error, result) => { 
      if (!error && result && result.event === "success") { 
        console.log('Done! Here is the image info: ', result.info);
        setPhotoUrl(result.info.url)
        setPhotoThumbnailUrl(result.info.thumbnail_url)
        setIsPhotoUploadAlertOpen(true)
      }
    }
  )

  const handleOpenDraw = (e) => {
    setDateId(e.target.id)
    addPhotoInfoToModal(e.target.id)
    setIsDailyMomentsDrawOpen(true)
  }

  const handleCloseDraw = () => {
    setMomentsSubArray([])
    setIsDailyMomentsDrawOpen(false)
  }

  const handleAddDayToEmail = (e) => {
    let id = e.target.id
    let dayToAdd = userPhotos.filter(photo => photo.dateId === id)
    setDaysToEmail(daysToEmail.concat(dayToAdd))
  }

  const handleEmailPrep = (e) => {
    setIsEmailPrep(true)
  }

  const handleCancelEmail = (e) => {
    setDaysToEmail([])
    setIsEmailPrep(false)
  }

  const drawerContent = (anchor) => (
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
      <Button variant= 'outlined' onClick={handleOpenModal}>
        Add New Moment
      </Button>
      <Typography sx={{m: 3}} variant="h6" component="h2">
        Moments From This Day
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
                onClick={() => {editPhoto(moment)}}  
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
            <IconButton sx={{m:0}}aria-label="delete" onClick={() => setIsEditing(true)} >
              <EditIcon color="secondary" />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => deletePhoto(moment)}>
              <DeleteIcon color="error" />
            </IconButton>
          </div>
        ))}
      </div>
    </Box>
  )

  return(
    <div className="scroll-container">
      <div className="email-outer-wrapper">
        <Fab 
          variant="extended" 
          color="secondary" 
          aria-label="add"
          size="small"
          onClick={handleEmailPrep}
        >
        <EmailIcon sx={{ mr: 1 }} />
        Share Moments
        </Fab>
        <div className={isEmailPrep ? "email-content-container" : "hidden"}>
          <p>Click Dates to Add Photos</p>
          <div className="moment-thumbnail-container">
            {daysToEmail.map((day, index) => (
              <div className="little-calendar-day" style= {{backgroundImage: `url(${day.url})`}}></div>
            ))}
          </div>
          <div className="button-container">
            <Button 
              sx={{m: 1, width: '50%', maxWidth: '250px'}} 
              variant="contained" 
              onClick={() => {handleSendEmail(); handleCancelEmail()}}
            >
              Email Family
            </Button>
            <Button 
              color="info"
              sx={{m: 1, width: '50%', maxWidth: '250px'}} 
              variant="contained" 
              onClick={handleCancelEmail}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    <InfiniteScroll
      dataLength={months.length}
      next={addMoreMonths}
      hasMore={true}
      loader={<h4>Loading ... </h4>}
    >
      {months.map((month, index) => (
        <div className="calendar-container" >
        <div className="calendar-header">{month}</div>
        <div className="calendar-body">
          <table>
            <tbody>{completedCalendarGrid(month)}</tbody>
          </table>  
        </div>
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          id={dateId}
        >
          <Box sx={style}>
            <Typography sx={{m: 3}}id="modal-modal-title" variant="h6" component="h2">
              Moments from this day
            </Typography>
            <div className="calendar-day" style={{backgroundImage: `url(${photoUrl})`}}></div>
            <Button 
              onClick={() => {myWidget.open()}} 
              sx={{m: 1, width: '75%', maxWidth: '250px'}} 
              variant="contained" 
              id="upload_widget" 
              className="cloudinary-button"
            >
              Upload Photo
            </Button>
            <div className={isPhotoUploadAlertOpen ? 'show' : 'hidden'}>
              <Alert variant="outlined" severity="success">Photo selected to upload - Add a caption and click sumbit to finalize!</Alert>
            </div>
            <TextField
              onChange={(e) => setMomentCaption(e.target.value)}
              sx={{m: 3, width: '90%'}}
              id="outlined-multiline-static"
              label="Caption"
              multiline
              rows={4}
            /> 
            <Button 
              onClick={() => {
                addPhoto();
                handleCloseModal(); 
                setIsPhotoUploadAlertOpen(false);
                setPhotoUrl("");
                setPhotoThumbnailUrl("");
              }} 
              sx={{m: 3, width: '75%'}} 
              variant="contained" 
              color="secondary"
            >
              Submit
            </Button>
          </Box>
        </Modal>
        <SwipeableDrawer
            anchor={'bottom'}
            open={isDailyMomentsDrawOpen}
            onClose={handleCloseDraw}
            onOpen={handleOpenDraw}   
          >
            {drawerContent('bottom')}
        </SwipeableDrawer>
      </div>
       ))} 
    </InfiniteScroll> 
    </div>   
  )
}