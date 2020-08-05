import React from 'react';

import Dialog from '~/components/Dialog';
import Room from '~/components/Room';

import '~/assets/css/App.css';

function App(props) {
  const { firebase } = props;

  const [chosen, setChosen] = React.useState(false);
  const [roomID, setRoomID] = React.useState('');

  React.useEffect(() => {
    console.dir(firebase);

    // // DEBUG
    // const tstKey = firebase.getKey();
    // firebase.subscribe(tstKey, 'value', (snapshot) => // OR 'child_added'
    //   console.log(snapshot.val())
    // );
    // firebase.save(tstKey, { prop1: 'um', prop2: 'dois' });
    // // DEBUG
  }, [firebase]);

  const handleCreateNewRoom = () => {
    setChosen(true);
    console.log('CREATE A NEW ROOM');
  };
  const handleJoinExistingRoom = (existingRoomID) => {
    setChosen(true);
    console.log(existingRoomID);
    setRoomID(existingRoomID);
  };

  return (
    <>
      <Dialog
        handleCreateNewRoom={handleCreateNewRoom}
        handleJoinExistingRoom={handleJoinExistingRoom}
      />
      {chosen && <Room roomID={roomID} />}
    </>
  );
}

export default App;
