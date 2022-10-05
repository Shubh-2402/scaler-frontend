import { Button, Typography } from '@mui/material';
import React from 'react'
import {
    Link,
    useNavigate
  } from "react-router-dom";

const InterviewCard = ({props, setInterviewData}) => {

    const {title,startTime,endTime,admins,participants, _id} = props.interview
    const index = props.index
    var options1 = { year: 'numeric', month: 'long', day: 'numeric' };
    var options2 = { minute: '2-digit', hour: '2-digit' };
    const date = new Date(startTime)
    const st = new Date(startTime)
    const et = new Date(endTime)
    const navigate = useNavigate();

    const openEditMenu = () => {
        setInterviewData({index,editMode: true});
    };
    
  return (
    <div className='card'>
        <Typography variant="h4" gutterBottom>
        {title}
        </Typography>
        <div className="card-time">
            <Typography variant="h5" gutterBottom>
            {date.toLocaleDateString("en-US", options1)}
            </Typography>
            <Typography variant="h5" gutterBottom>
                {st.toLocaleTimeString(undefined, options2)} - {et.toLocaleTimeString(undefined, options2)}
            </Typography>
        </div>
        <div className='participants'>
        <Typography variant="h5">Participants</Typography>
            {participants && participants.map((participant)=> <Typography variant="h7">{participant}</Typography>)}
            {admins && admins.map((admin)=> <Typography variant="h7">{admin}</Typography>)}
        </div>
        <div className="buttons">
            <div className="button">
            <Button variant="contained" onClick={openEditMenu}>Reschedule/Edit</Button>
            </div>
            <div className="button">
                <Button variant="contained" color="error">Delete</Button>
            </div>
        </div>
        
    </div>
  )
}

export default InterviewCard