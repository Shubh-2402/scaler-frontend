import React, { useEffect, useState } from "react";
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
// const values = ["Shubham","Seta","Moly","Prakul"]
const baseURL = "http://localhost:5000/api/";

const Scheduler = ({ props }) => {
  // console.log(props)
  const { interviews, setInterviews } = props;
  const [title, setTitle] = useState("Title");
  const [startTime, setStartTime] = useState(dayjs(new Date()));
  const [endTime, setEndTime] = useState(dayjs(new Date()));
  const [interviewers, setInterviewers] = useState([]);
  const [interviewees, setInterviewees] = useState([]);
  const [selectedInterviewers, setSelectedInterviewers] = useState([]);
  const [selectedInterviewees, setSelectedInterviewees] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("Error");
  

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

    var admins = [];
    for (var i=0; i < selectedInterviewers.length ; ++i)
        admins.push(selectedInterviewers[i]['email']);

    var participants = [];
    for (var j=0; j < selectedInterviewees.length ; ++j)
    participants.push(selectedInterviewees[j]['email']);

    const newInterview = {
      title: title,
      startTime: startTime.toDate(),
      endTime: endTime.toDate(),
      admins: admins,
      participants:participants,
    };

    // console.log(newInterview)

    axios
        .post(baseURL + "interviews/", newInterview)
        .then((response) => {
          // console.log(response)
          setInterviews([...interviews, newInterview])})
        .catch((err)=>{
          setOpen(true)
          // console.log(err.response.data);
          setError(err.response.data)
        })
  };

  useEffect(() => {
    axios.get(baseURL + "participants").then((response) => {
      const all = response.data;
      setInterviewers(
        all.filter((participants) => participants.role === "Interviewer")
      );
      setInterviewees(
        all.filter((participants) => participants.role === "Interviewee")
      );
      // console.log(interviewees);
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
            default="Title"
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
            getOptionLabel={(option) => option.email}
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
            getOptionLabel={(option) => option.email}
            renderInput={(params) => (
              <TextField {...params} label="Select Interviewees (Min 1)" />
            )}
            sx={{ width: "500px" }}
          />

          <Button variant="contained" onClick={handleSubmit}>
            Create Interview
          </Button>

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
