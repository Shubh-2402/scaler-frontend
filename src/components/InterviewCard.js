import { Button, Typography } from '@mui/material';
import React from 'react'

const InterviewCard = ({props}) => {

    const {title,startTime,endTime,admins,participants} = props
    var options1 = { year: 'numeric', month: 'long', day: 'numeric' };
    var options2 = { minute: '2-digit', hour: '2-digit' };
    const date = new Date(startTime)
    const st = new Date(startTime)
    const et = new Date(endTime)

    
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
        <Typography variant="h5">Particpants</Typography>
            {participants && participants.map((participant)=> <Typography variant="h7">{participant}</Typography>)}
            {admins && admins.map((admin)=> <Typography variant="h7">{admin}</Typography>)}
        </div>
        <div className="buttons">
            <div className="button"><Button variant="contained" >Reschedule/Edit</Button></div>
            <div className="button">
                <Button variant="contained" color="error">Delete</Button>
            </div>
        </div>
        
    </div>
  )
}

export default InterviewCard