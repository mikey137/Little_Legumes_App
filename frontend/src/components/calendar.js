import React, { useEffect, useState } from 'react'
import moment from 'moment'
import InfiniteScroll from "react-infinite-scroll-component"
import TransitionsModal from './TransitionsModal';
import EmailFab from './EmailFab';
import axios from 'axios'
import { apiConfig } from '../Constants';
import { Fragment } from 'react';

export default function Calendar(){
  const [months, setMonths] = useState([moment().format("MMMM YYYY"),moment().add(-1,'M').format("MMMM YYYY"), moment().add(-2,'M').format("MMMM YYYY") ])
  const [monthCounter, setMonthCounter] = useState(-3)
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [dateId, setDateId] = useState("")
  const [momentCaption, setMomentCaption] = useState("")
  const [loggedInUser, setLoggedInUser] = useState("")
  const [userPhotos, setUserPhotos] = useState([])
  const [momentsSubArray, setMomentsSubArray] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [isEmailPrep, setIsEmailPrep] = useState(false)
  const [daysToEmail, setDaysToEmail] = useState([])
  const [familyEmails, setFamilyEmails] = useState([])
  const isThisDemo = false
  
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

  const addPhotoInfoToModal = (id) => {
    let subArray = userPhotos.filter(photo => photo.dateId === id)
    setMomentsSubArray(subArray)
  }
 
  const handleOpenModal = (e) => {
    setIsModalOpen(true)
    setDateId(e.target.id)
    addPhotoInfoToModal(e.target.id)
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
          onClick={isEmailPrep ? handleAddDayToEmail : handleOpenModal} 
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

  return(
    <Fragment>
      <TransitionsModal 
        isModalOpen = { isModalOpen} 
        setIsModalOpen = { setIsModalOpen }
        momentsSubArray = { momentsSubArray }
        userPhotos = { userPhotos }
        setUserPhotos = { setUserPhotos }
        setMomentsSubArray = { setMomentsSubArray }
        dateId = { dateId }
        setDateId = { setDateId }
        isThisDemo = { isThisDemo }
        loggedInUser = { loggedInUser }
        getPhotos = { getPhotos }
      />
    <div className="scroll-container">
      <EmailFab 
        isEmailPrep = { isEmailPrep }
        setIsEmailPrep = { setIsEmailPrep }
        daysToEmail = { daysToEmail }
        setDaysToEmail = { setDaysToEmail }
      />  
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
      </div>
       ))} 
    </InfiniteScroll> 
    </div>
    </Fragment>   
  )
}