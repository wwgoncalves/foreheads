import React from 'react';

import Dialog from '~/components/Dialog';
import Room from '~/components/Room';

import '~/assets/css/App.css';

function App(props) {
  const { firebaseDB } = props;

  const [chosen, setChosen] = React.useState(false);
  const [existingRoomID, setExistingRoomID] = React.useState('');

  React.useEffect(() => {
    console.dir(firebaseDB);
  }, [firebaseDB]);

  const handleNewRoom = () => {
    setChosen(true);
    console.log('CREATE A NEW ROOM');
  };
  const handleJoinExistingRoom = () => {
    setChosen(true);
    console.log(existingRoomID);
  };

  return (
    <>
      <Dialog
        handleNewRoom={handleNewRoom}
        handleJoinExistingRoom={handleJoinExistingRoom}
        existingRoomID={existingRoomID}
        setExistingRoomID={setExistingRoomID}
      />
      {chosen && <Room />}
    </>
  );
}

export default App;
