import React, { useEffect, useState } from 'react'
import moment from 'moment'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InfiniteScroll from "react-infinite-scroll-component"
import axios from 'axios'

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

  const getPhotos = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:3001/photos",
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
      url: "http://localhost:3001/addphoto",
    }).then((res) => {
      console.log(res) 
    });
    getPhotos()
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
    console.log('test')
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
 
  const handleOpenModal = (e) => {
    setIsModalOpen(true);
    setDateId(e.target.id)
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
          onClick={handleOpenModal} 
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
      }
    }
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
        >
          <Box sx={style}>
            <Typography sx={{m: 3}}id="modal-modal-title" variant="h6" component="h2">
              Add Moment
            </Typography>
            <TextField
              onChange={(e) => {setMomentCaption(e.target.vaule)}}
              sx={{m: 3, width: '90%'}}
              id="outlined-multiline-static"
              label="Caption"
              multiline
              rows={4}
            /> 
            <Button 
              onClick={() => {myWidget.open()}} 
              sx={{m: 1, width: '75%', maxWidth: '250px'}} 
              variant="contained" 
              id="upload_widget" 
              className="cloudinary-button"
            >
              Upload Photo
            </Button>
            <Button 
              onClick={addPhoto} 
              sx={{m: 3, width: '75%'}} 
              variant="contained" 
              color="secondary"
            >
              Submit
            </Button>
          </Box>
        </Modal>
      </div>
       ))} 
    </InfiniteScroll>    
  )
}