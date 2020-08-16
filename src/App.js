import React from 'react';

import Dialog from '~/components/Dialog';
import Room from '~/components/Room';

import firebase from '~/services/firebase';

import '~/assets/css/App.css';

function App() {
  const [chosen, setChosen] = React.useState(false);
  const [isCaller, setIsCaller] = React.useState(false);
  const [roomId, setRoomId] = React.useState('');

  const handleCreateNewRoom = () => {
    setChosen(true);
    setIsCaller(true);
    console.log('CREATE A NEW ROOM');
    const newRoomId = firebase.generateKey();
    setRoomId(newRoomId);
  };
  const handleJoinExistingRoom = (existingRoomId) => {
    setChosen(true);
    console.log('JOIN AN EXISTING ROOM: ', existingRoomId);
    setRoomId(existingRoomId);
  };

  return (
    <>
      {!chosen && (
        <Dialog
          handleCreateNewRoom={handleCreateNewRoom}
          handleJoinExistingRoom={handleJoinExistingRoom}
        />
      )}
      {chosen && <Room isCaller={isCaller} roomId={roomId} />}
    </>
  );
}

export default App;
