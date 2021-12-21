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
import axios from 'axios'
import { apiConfig } from '../../Constants';

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

  let url = apiConfig.url.API_URL

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

  const addPhoto = () => {
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

  const deletePhoto = (id) => {
    console.log(id)
    axios({
      method: "DELETE",
      withCredentials: true,
      url: `${url}/deletephoto/${id}`,
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



  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setLoggedInUser(foundUser.username);
    }
    getPhotos()
  }, [])

  const mapPhotosToDates = () => {
    for(let i = 0; i < userPhotos.length; i++){
      let photo = userPhotos[i]
      let id = photo.dateId
      let thumbnail = photo.url
      document.getElementById(id).style.backgroundImage = `url(${thumbnail})`
    }
  }

  useEffect(() => {
    mapPhotosToDates()
  },[userPhotos])

  const addPhotoInfoToModal = (id) => {
    console.log(id)
    let subArray = userPhotos.filter(photo => photo.dateId === id)
    setMomentsSubArray(subArray)
  }
 
  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => setIsModalOpen(false);
  
  const addMoreMonths = () => {
      let lastMonth = months[months.length-1]
      let newMonth = moment(lastMonth).add(-1,'M').format("MMMM YYYY") 
      setMonths(months.concat(newMonth))
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
          onClick={handleOpenDraw} 
          key={d} 
          id={`${m}+${d}`} 
          className={"calendar-day"}
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
            <IconButton aria-label="delete" onClick={() => deletePhoto(moment._id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </div>
        ))}
      </div>
    </Box>
  )

  return(
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
                getPhotos()
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
  )
}