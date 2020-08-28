import React from 'react';

import { StylesProvider } from '@material-ui/core/styles';

import Dialog from '~/components/Dialog';
import Room from '~/components/Room';

import firebase from '~/services/firebase';

import '~/assets/css/App.css';
import GlobalStyle from './styles/global';

function App() {
  const [chosen, setChosen] = React.useState(false);
  const [isCaller, setIsCaller] = React.useState(false);
  const [roomId, setRoomId] = React.useState('');

  const handleCreateNewRoom = () => {
    setChosen(true);
    setIsCaller(true);
    const newRoomId = firebase.generateKey();
    setRoomId(newRoomId);
  };

  const handleJoinExistingRoom = (existingRoomId) => {
    setChosen(true);
    setRoomId(existingRoomId);
  };

  return (
    <StylesProvider injectFirst>
      <GlobalStyle />
      {!chosen && (
        <Dialog
          handleCreateNewRoom={handleCreateNewRoom}
          handleJoinExistingRoom={handleJoinExistingRoom}
        />
      )}
      {chosen && <Room isCaller={isCaller} roomId={roomId} />}
    </StylesProvider>
  );
}

export default App;
