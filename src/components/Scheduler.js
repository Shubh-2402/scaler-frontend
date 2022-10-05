import React, { useEffect, useState } from "react";
import {useLocation} from 'react-router-dom';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Alert, Button, Snackbar } from "@mui/material";
import axios from "axios";

const baseURL = "https://frozen-coast-35947.herokuapp.com/api/";

const Scheduler = ({interviews, setInterviews, interviewData}) => {
  const [title, setTitle] = useState( "Title");
  const [startTime, setStartTime] = useState(dayjs(new Date()));
  const [endTime, setEndTime] = useState(dayjs(new Date()));
  const [interviewers, setInterviewers] = useState([]);
  const [interviewees, setInterviewees] = useState([]);
  const [selectedInterviewers, setSelectedInterviewers] = useState([]);
  const [selectedInterviewees, setSelectedInterviewees] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("Error");
  const [editModeValue, setEditModeValue] = useState(false);
  const [_id,setID] = useState("");
  const [index,setIndex] = useState(null);

  useEffect(() => {
    if(Object.keys(interviewData).length) {
      const {index, editMode} = interviewData;
      const cur = (interviews[index]);
      setEditModeValue(editMode)
      setTitle(cur.title);
      setStartTime(dayjs(new Date(cur.startTime)));
      setEndTime(dayjs(new Date(cur.endTime)));
      setSelectedInterviewers(cur.admins);
      setSelectedInterviewees(cur.participants);
      setID(cur._id)
      setIndex(index);
    }
  }, [interviewData])
  
  

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleStartChange = (newValue) => {
    const newEnd = dayjs(
      new Date(
        newValue.get("year"),
        newValue.get("month"),
        newValue.get("date"),
        endTime.get("hour"),
        endTime.get("minute"),
        endTime.get("second")
      )
    );

    setStartTime(newValue);
    setEndTime(newEnd);
  };

  const handleEndChange = (newValue) => {
    setEndTime(newValue);
  };

  const handleSelectionInterviewers = (e, newValue) => {
    console.log(newValue)
    setSelectedInterviewers(newValue);
  };
  const handleSelectionInterviewees = (e, newValue) => {
    setSelectedInterviewees(newValue);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = () => {

    const newInterview = {
      title: title,
      startTime: startTime.toDate(),
      endTime: endTime.toDate(),
      admins: selectedInterviewers,
      participants:selectedInterviewees,
    };

    // console.log(newInterview)
    if (!editModeValue) {
    axios
        .post(baseURL  + "interviews" , newInterview)
        .then((response) => {
          // console.log(response)
          setInterviews([...interviews, newInterview])})
        .catch((err)=>{
          setOpen(true)
          // console.log(err.response.data);
          setError(err.response.data)
        });
      } else {
        axios
        .put(baseURL + "interviews", {...newInterview,_id})
        .then((response) => {
          // console.log(response)
          setInterviews([...interviews.slice(0,index),{...newInterview,_id},...interviews.slice(index+1)])})
        .catch((err)=>{
          setOpen(true)
          // console.log(err.response.data);
          setError(err.response.data)
        });
      }
  };

  const handleCancel = () => {
    setTitle("Title");
    setStartTime(dayjs(new Date()));
    setEndTime(dayjs(new Date()));
    setSelectedInterviewers([]);
    setSelectedInterviewees([]);
    setID(null);
    setIndex(0);
  }

  useEffect(() => {
    axios.get(baseURL + "participants").then((response) => {
      const all = response.data;
      setInterviewers(
        all.filter((participants) => participants.role === "Interviewer").map((p)=>p.email)
      );
      setInterviewees(
        all.filter((participants) => participants.role === "Interviewee").map((p)=>p.email)
      );
    });
  }, []);

  return (
    <div className="scheduler">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={3} sx={{ width: 500 }}>
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            value={title}
            onChange={handleTitle}
          />

          <DesktopDatePicker
            label="Date desktop"
            inputFormat="DD/MM/YYYY"
            value={startTime}
            onChange={handleStartChange}
            renderInput={(params) => <TextField {...params} />}
          />

          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={handleStartChange}
            renderInput={(params) => <TextField {...params} />}
          />

          <TimePicker
            label="End Time"
            value={endTime}
            onChange={handleEndChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <Autocomplete
            multiple
            value={selectedInterviewers}
            onChange={handleSelectionInterviewers}
            limitTags={2}
            id="multiple-limit-tags"
            options={interviewers}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Select Interviewers (Min 1)" />
            )}
            sx={{ width: "500px" }}
          />

          <Autocomplete
            multiple
            value={selectedInterviewees}
            onChange={handleSelectionInterviewees}
            limitTags={2}
            id="multiple-limit-tags"
            options={interviewees}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Select Interviewees (Min 1)" />
            )}
            sx={{ width: "500px" }}
          />

          <div className="buttons">
            <Button variant="contained" onClick={handleSubmit}>
              {editModeValue?"Edit":"Create Interview"}
            </Button>

            <Button variant="contained" onClick={handleCancel} color="error">
              Cancel
            </Button>
          </div>

          {open && <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error} 
        </Alert>
      </Snackbar>}
        </Stack>
      </LocalizationProvider>
    </div>
  );
};

export default Scheduler;
