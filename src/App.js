/*global swal*/

import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

const apiToken = 'BQBXlpR83yFORFKYF-wKNZXLLvcOrympGeeg31UxVsANpNewhePkObrGbjE8nX85IRfk3AbjrO4Hc4DJp4ISF0E_LEvgKZcd3nnrT2jB6DPpiV3Kh1wVTDPmhomC7GWNPwlkTPr-voHROVdeAMKovnDxG4Zc936yM1mQ7Y0Zh17eILBirpq4-OFxTP23GnqkBYPTP7dDY2VnkQ'

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

const AlbumCover = (props) =>  {
  const src = props.currentTrack.album.images[0].url; 
  console.log('src album', src)
    return (
        <img src={src} style={{ width: 400, height: 400 }} />
    );
}

const App = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState([]);
  const [tracksChoice, setTracksChoice] = useState([]);
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);

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
      setTracks(shuffleArray(data.items))
      setCurrentTrack(data.items[0].track)
      setTracksChoice(shuffleArray([data.items[0].track, data.items[1].track, data.items[2].track]))
      setSongsLoaded(true)
      console.log('trakcs')
    })
  }, []);
  

  const checkAnswer = (choice) => {
    if (currentTrack.id === choice.id) {
      swal('Bravo!!', 'You won', 'success')
    } else {
      swal('Try again', 'This is not the correct answer', 'error')
    }
  }

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
        <AlbumCover currentTrack={currentTrack} />
        {shouldPlay && <Sound url={tcurrentTrack.preview_url} playStatus={Sound.status.PLAYING} />}
      </div>
      <div className="App-buttons">
        <button onClick={() => setShouldPlay((previousValue) => !previousValue)}>
          Play
        </button>
        <div className="App-buttons">
          {tracksChoice.map((track) => (
            <button onClick={() => checkAnswer(currentTrack, track)}> {track.name} </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
