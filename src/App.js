import React from 'react';

import Dialog from '~/components/Dialog';
import Room from '~/components/Room';

import '~/assets/css/App.css';

function App(props) {
  const { firebase } = props;

  const [chosen, setChosen] = React.useState(false);
  const [isCaller, setIsCaller] = React.useState(false);
  const [roomID, setRoomID] = React.useState('');

  React.useEffect(() => {
    console.dir(firebase);

    // // DEBUG
    // const tstKey = firebase.generateKey();
    // firebase.subscribe(tstKey, 'value', (snapshot) => // OR 'child_added'
    //   console.log(snapshot.val())
    // );
    // firebase.save(tstKey, { prop1: 'um', prop2: 'dois' });
    // // DEBUG
  }, [firebase]);

  const handleCreateNewRoom = () => {
    setChosen(true);
    setIsCaller(true);
    console.log('CREATE A NEW ROOM');
    const newRoomID = firebase.generateKey();
    setRoomID(newRoomID);
  };
  const handleJoinExistingRoom = (existingRoomID) => {
    setChosen(true);
    console.log('JOIN AN EXISTING ROOM: ', existingRoomID);
    setRoomID(existingRoomID);
  };

  return (
    <>
      {false && (
        <Dialog
          handleCreateNewRoom={handleCreateNewRoom}
          handleJoinExistingRoom={handleJoinExistingRoom}
        />
      )}
      {true && <Room isCaller={isCaller} roomID="true" firebase={firebase} />}
    </>
  );
}

export default App;
