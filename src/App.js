/*global swal*/

import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

const apiToken = '<<Copy the Spotify token here>>';

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
};

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
};


const App = () => {
  const [tracks, setTracks] = useState();
  const [songsLoaded, setSongsLoaded] = useState(false);
  useEffect(() => { 
    fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + apiToken,
      },
    })
    .then(response => response.json())
    .then((data) => {
      console.log("Reply received! This is what I received: ", data);
      setTracks(data.items)
      setSongsLoaded(true)
    })
  }, []);
  
  if (!songsLoaded) {
    return (
      <div className="App">
        <img src={loading} className="App-logo" alt="logo"/>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome on the Name that Tune</h1>
      </header>
      <div className="App-images">
          <p>We have loaded {tracks.length} songs</p>
          <p>The first song is: {tracks[0].track.name}</p>
      </div>
      <div className="App-buttons">
      </div>
    </div>
  );
};

export default App;
