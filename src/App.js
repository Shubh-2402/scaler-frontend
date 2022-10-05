import './App.css';
import Home from './components/Home';
import Scheduler from './components/Scheduler.js';
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import {Typography } from '@mui/material';
import { Box } from '@mui/system';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="header">
        <Box  sx={{ textAlign: 'center' }} >
            <Typography variant="h3" sx={{ my: 2 }} color="white">
              Interview Creation Portal
            </Typography>
          </Box>
        </div>

        <Routes>
          {/* <Route path="/:id"  element={<Scheduler/>} /> */}
          <Route exact path="/"  element={<Home/>} />
        </Routes>

      </div>

      
        
      

    </Router>
    
  );
}

export default App;
