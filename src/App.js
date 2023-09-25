
import React, {useState, useRef} from 'react';
import "./app.css"
import { Route, Routes, Link, BrowserRouter as Router } from 'react-router-dom'  
import Seasons from "./game/seasons.js";
import Rummy from './game/Rummy';
import Web3oWits from './game/Web3oWits';
import War from './game/War';
import Solitare from './game/solitare';


function App() {

  return (
    <Routes>
      <Route path="/" element={ 
        <>
        <Link to="/seasons" >Seasons</Link> <br/>
        <Link to="/rummy" >Rummy</Link> <br/>
        <Link to="/web3" >Web 3 of Wits</Link> <br/>
        <Link to="/war" >War</Link> <br/>
        <Link to="/solitaire" >Solitaire</Link> <br/>
        </>
      } />
      <Route path="/seasons" element={<Seasons />} />
      <Route path="/rummy" element={<Rummy />} />
      <Route path="/web3" element={<Web3oWits />} />
      <Route path="/war" element={<War />} />
      <Route path="/solitaire" element={<Solitare />} />
    </Routes>
      );
}

export default App;

