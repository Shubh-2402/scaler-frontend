import React, { useEffect, useState } from 'react'
import InterviewCard from './InterviewCard.js'
import Scheduler from './Scheduler.js';
import axios from 'axios';
import {Typography } from '@mui/material';

const baseURL = "http://localhost:5000/api/interviews/";

const Home = () => {
  const [interviews, setInterviews] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [interviewData, setInterviewData] = useState({});

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setInterviews(response.data);
    });
    setMounted(true);
  },[]);

  return (
    <div className='home'>
      <div className='home-body'>
        <Scheduler interviews={interviews} setInterviews={setInterviews} interviewData={interviewData} />
        <div className='upcoming'>
          <Typography variant="h4" gutterBottom>Upcoming Interviews</Typography>
          <div className="cards-container">
          {interviews && interviews.map((interview, index)=><InterviewCard props={{interview, index}} setInterviewData={setInterviewData} />)}
          </div>
        </div>
      </div>
      
    </div>
    
  )
}

export default Home