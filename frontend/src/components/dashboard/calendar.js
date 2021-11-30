import React, { useState } from 'react'
import moment from 'moment'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import UploadPhotoWidget from '../uploads'
import Button from '@mui/material/Button';
import InfiniteScroll from "react-infinite-scroll-component"



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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  const addMoreMonths = () => {
      let lastMonth = months[months.length-1]
      let newMonth = moment(lastMonth).add(-1,'M').format("MMMM YYYY") 
      setMonths(months.concat(newMonth))
  }
    
  let daysInThisMonth = moment().daysInMonth()
  let firstDayOfMonth = moment().startOf('month').format('d')
  
  const findNumberOfBlanks = () => {
    let blanks = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      blanks.push(<td className="calendar-day">{""}</td>);
    }
    return blanks
  }

  const fillDaysInMonth = () => {
    let daysInMonth = []
    for(let d = 1; d <= daysInThisMonth; d++){
      daysInMonth.push(<td onClick={handleOpenModal} key={d} className={"calendar-day"}>{d}</td>)
    }
    return daysInMonth
  }

    
  function createGridFromSlots(totalSlots){
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
      return <tr>{d}</tr>
    })
    return completedCalendarGrid
  }
    
  const blanks = findNumberOfBlanks()
  const daysInMonth = fillDaysInMonth()
  const totalSlots = blanks.concat(daysInMonth)
  const completedCalendarGrid = createGridFromSlots(totalSlots)

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
            <tbody>{completedCalendarGrid}</tbody>
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
              sx={{m: 3, width: '90%'}}
              id="outlined-multiline-static"
              label="Caption"
              multiline
              rows={4}
            /> 
            <Button sx={{m: 3, width: '75%'}} variant="contained" color="secondary">Submit</Button>
          </Box>
        </Modal>
      </div>
       ))} 
    </InfiniteScroll>    
  )
}