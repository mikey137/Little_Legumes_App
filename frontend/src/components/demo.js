import React, { useEffect, useState, Fragment } from 'react'
import moment from 'moment'
import InfiniteScroll from "react-infinite-scroll-component"
import TransitionsModal from './TransitionsModal';
import EmailFab from './EmailFab';

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const d = new Date();

const demoPhotoArray = [
  {
    url: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    dateId: `${month[d.getMonth()] +' '+ d.getFullYear()}+1`,
    momentCaption: 'Walking in the rain with friends!'
  },
  {
    url: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    dateId: `${month[d.getMonth()] +' '+ d.getFullYear()}+2`,
    momentCaption: 'Hanging on the porch with cousins!'
  },
  {
    url: 'https://images.unsplash.com/photo-1537655780520-1e392ead81f2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    dateId: `${month[d.getMonth()] +' '+ d.getFullYear()}+3`,
    momentCaption: 'Playing with blocks!'
  },
  {
    url: 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8a2lkc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    dateId: `${month[d.getMonth()] +' '+ d.getFullYear()}+4`,
    momentCaption: 'Hiding behind ballons!'
  },
  {
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    dateId: `${month[d.getMonth()] +' '+ d.getFullYear()}+5`,
    momentCaption: 'First day at daycare!'
  },
  {
    url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80',
    dateId: `${month[d.getMonth()] +' '+ d.getFullYear()}+6`,
    momentCaption: 'Shocked they killed Ned!'
  },
  {
    url: 'https://images.unsplash.com/photo-1531325082793-ca7c9db6a4c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    dateId: `${month[d.getMonth()] +' '+ d.getFullYear()}+7`,
    momentCaption: 'Party at the beach!'
  },
  {
    url: 'https://images.unsplash.com/photo-1555009393-f20bdb245c4d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    dateId: `${month[d.getMonth()] +' '+ d.getFullYear()}+8`,
    momentCaption: 'Watering some plants!'
  },
  {
    url: 'https://images.unsplash.com/photo-1552873816-636e43209957?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2831&q=80',
    dateId: `${month[d.getMonth()] +' '+ d.getFullYear()}+9`,
    momentCaption: 'Lost two teeth!'
  },
  {
    url: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGtpZHN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    dateId: `${month[d.getMonth()] +' '+ d.getFullYear()}+10`,
    momentCaption: 'Reading at the park!'
  },
]
export default function DemoCalendar(){
  const [months, setMonths] = useState([moment().format("MMMM YYYY"),moment().add(-1,'M').format("MMMM YYYY"), moment().add(-2,'M').format("MMMM YYYY") ])
  const [monthCounter, setMonthCounter] = useState(-3) 
  const [dateId, setDateId] = useState("")
  const [momentsSubArray, setMomentsSubArray] = useState([])
  const [isEmailPrep, setIsEmailPrep] = useState(false)
  const [daysToEmail, setDaysToEmail] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userPhotos, setUserPhotos] = useState(demoPhotoArray)

  const mapPhotosToDates = () => {
    console.log("running")
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
    let subArray = userPhotos.filter(photo => photo.dateId === id)
    setMomentsSubArray(subArray)
  }
 
  const handleOpenModal = (e) => {
    setIsModalOpen(true)
    setDateId(e.target.id)
    addPhotoInfoToModal(e.target.id)
  }

  const handleAddDayToEmail = (e) => {
    let id = e.target.id
    let dayToAdd = userPhotos.filter(photo => photo.dateId === id)
    setDaysToEmail(daysToEmail.concat(dayToAdd))
  }

  const addMoreMonths = () => {
    let newMonth = moment().add(monthCounter,'M').format("MMMM YYYY") 
    setMonths(months.concat(newMonth))
    setMonthCounter(monthCounter -1)
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
          key={d} 
          id={`${m}+${d}`}
          className="calendar-day"
          onClick={isEmailPrep ? handleAddDayToEmail :handleOpenModal}
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