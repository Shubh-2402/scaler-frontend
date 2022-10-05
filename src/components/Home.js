import React, { useEffect, useState } from 'react'
import InterviewCard from './InterviewCard.js'
import Scheduler from './Scheduler.js';
import axios from 'axios';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

const baseURL = "http://localhost:5000/api/interviews/";

const Home = () => {

  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      // console.log(response.data);
      setInterviews(response.data);
    });
  },[]);



  return (
    <div className='home'>
    <div className="header">
      <Box  sx={{ textAlign: 'center' }} >
          <Typography variant="h3" sx={{ my: 2 }} color="white">
            Interview Creation Portal
          </Typography>
        </Box>
    </div>
      
      <div className='home-body'>
        <Scheduler props={{interviews,setInterviews}}></Scheduler>
        <div className='upcoming'>
          <Typography variant="h4" gutterBottom>Upcoming Interviews</Typography>
          <div className="cards-container">
          {interviews && interviews.map((interview)=><InterviewCard props={interview}></InterviewCard>)}
          </div>
        </div>
      </div>
      
    </div>
    
  )
}

export default Home