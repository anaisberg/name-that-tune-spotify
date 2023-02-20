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

const AlbumCover = (props) =>  {
  const src = props.currentTrack.album.images[0].url; 
    return (
        <img src={src} style={{ width: 400, height: 400 }} />
    );
}

const App = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState([]);
  const [tracksChoice, setTracksChoice] = useState([]);
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [timeoutId, setTimeoutId] = useState();

  useEffect(() => { 
    fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + apiToken,
      },
    })
    .then(response => response.json())
    .then((data) => {
      setTracks(shuffleArray(data.items))
      setCurrentTrack(data.items[0].track)
      setTracksChoice(shuffleArray([data.items[0].track, data.items[1].track, data.items[2].track]))
      setSongsLoaded(true)
    })
  }, []);
  
  const selectNewTracks = () => {
    if (!tracks) {
      return;
    }
    setTracks(shuffleArray(tracks));
    setCurrentTrack(tracks[0].track)
    setTracksChoice(shuffleArray([tracks[0].track, tracks[1].track, tracks[2].track]))
  }

  const checkAnswer = (choice) => {
    if (currentTrack.id === choice.id) {
      swal('Bravo!!', 'You won', 'success').then(() => {
        clearTimeout(timeoutId);
        selectNewTracks();
      })
    } else {
      swal('Try again', 'This is not the correct answer', 'error')
    }
  }

  useEffect(() => {
    setTimeoutId(setTimeout(() => selectNewTracks(), 30000));
  }, [currentTrack]);
 
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
        <Sound url={currentTrack.preview_url} playStatus={Sound.status.PLAYING} />
      </div>
        <div className="App-buttons">
        {tracksChoice.map((track) => (
          <Button onClick={() => checkAnswer(track)}> {track.name} </Button>
        ))}
        </div>
    </div>
  );
};

export default App;
