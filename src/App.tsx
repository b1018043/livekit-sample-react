import React from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Prepare from './prepare/Prepare';
import RoomView from './room/Room';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Prepare/>}/>
        <Route path="/room" element={<RoomView/>}/>
      </Routes>
    </Router>
  );
}

export default App;
