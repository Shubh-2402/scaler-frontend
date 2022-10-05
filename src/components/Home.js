import React, { useEffect, useState } from 'react'
import InterviewCard from './InterviewCard.js'
import Scheduler from './Scheduler.js';
import axios from 'axios';

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
      <h1>Interview Creation Portal</h1>
      <div className='home-body'>
        <Scheduler props={{interviews,setInterviews}}></Scheduler>
        <div className='upcoming'>
          <h2>Upcoming Interviews</h2>
          <div className="cards-container">
          {interviews && interviews.map((interview)=><InterviewCard props={interview}></InterviewCard>)}
          </div>
        </div>
      </div>
      
    </div>
    
  )
}

export default Home