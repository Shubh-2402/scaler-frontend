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
    const all = [...selectedInterviewers, ...selectedInterviewees];

    var participants = [];
    for (var i = 0; i < all.length; ++i) participants.push(all[i]["email"]);

    const newInterview = {
      title: title,
      startTime: startTime.toDate(),
      endTime: endTime.toDate(),
      participants: participants,
    };

    // console.log(newInterview.endTime.toISOString())
    // console.log(interviews[0].startTime)
    // console.log(newInterview.endTime.toISOString() > interviews[0].startTime);

    var conflict = false;

    for(var j=0;j<interviews.length;j++){
      const inter = interviews[j]
      // console.log(((newInterview.endTime.toISOString() > inter.startTime) && (newInterview.endTime.toISOString() < inter.endTime)))
      // console.log(inter)

      if(((newInterview.endTime.toISOString() > inter.startTime) && (newInterview.endTime.toISOString() < inter.endTime)) || ((newInterview.startTime.toISOString() > inter.start) && (newInterview.startTime.toISOString() < inter.endTime)) || ((newInterview.endTime.toISOString() > inter.endTime) && (newInterview.startTime.toISOString() < inter.startTime)) ){
        console.log("time")
        const part = newInterview.participants;

        for(var k=0;k<part.length;k++){
          if(inter.participants.includes(part[k])){
            conflict=true
            break;
          }
        }

      }
    }
    console.log(conflict)

    if(conflict){
      setOpen(true)
    }else{
      axios
        .post(baseURL + "interviews/", newInterview)
        .then((response) => setInterviews([...interviews, newInterview]));
    }
    // window.location.reload(true)
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
          All participants are not available for the time slot 
        </Alert>
      </Snackbar>}
        </Stack>
      </LocalizationProvider>
    </div>
  );
};

export default Scheduler;
