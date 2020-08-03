import React from 'react';

import Dialog from '~/components/Dialog';
import Room from '~/components/Room';

import '~/assets/css/App.css';

function App(props) {
  const { firebaseDB } = props;

  React.useEffect(() => {
    console.dir(firebaseDB);
  });

  return (
    <>
      <Dialog />
      <Room />
    </>
  );
}

export default App;
