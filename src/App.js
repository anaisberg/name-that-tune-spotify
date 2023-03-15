/*global swal*/

import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

const apiToken = 'BQAn9y1NfnKAS4r_SxCjqiOs3-PnLK4kF63RKzteJES0t__UUbjmpgA_t9BgKbaHoooDSKmFFGRDW3UL8hoITAkVbwukrtVyV_wfU_mMqWwlUN31qjqDGK-VwQ5K5T9jBl3zKFkOq3mMxS13lBq6mIipnsAoifk5hvXOLzsel5L846HS0deqV6cAI_j7p1Mlghrmf4sENhhgSA';

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
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => { 
    fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + apiToken,
      },
    })
      .then(response => response.json())
      .then(data => data.items.filter((item) => !!item.track.preview_url))
    .then((items) => {
      console.log("Reply received! This is what I received: ", items);
      setTracks(shuffleArray(items))
      setCurrentTrack(items[0].track)
      setTracksChoice(shuffleArray([items[0].track, items[1].track, items[2].track]))
      setSongsLoaded(true)
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
