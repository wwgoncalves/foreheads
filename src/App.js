import React from 'react';

import {
  Fab,
  InputBase,
  IconButton,
  Tooltip,
  Snackbar,
} from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ChatIcon from '@material-ui/icons/Chat';
import CloseChatIcon from '@material-ui/icons/SpeakerNotesOff';
import CloseIcon from '@material-ui/icons/Close';

import '~/assets/css/App.css';

function App() {
  const [cameraIsOn, setCameraIsOn] = React.useState(false);
  const [micIsOn, setMicIsOn] = React.useState(false);
  const [chatPanelIsOpen, setChatPanelIsOpen] = React.useState(false);
  const [snackbarIsOpen, setSnackbarIsOpen] = React.useState(false);
  const [snackPack, setSnackPack] = React.useState([]);
  const [snack, setSnack] = React.useState(undefined);

  React.useEffect(() => {
    if (snackPack.length && !snack) {
      // Set a new snack when we don't have an active one
      setSnack(snackPack[0]);
      setSnackPack((prev) => prev.slice(1));
      setSnackbarIsOpen(true);
    } else if (snackPack.length && snack && snackbarIsOpen) {
      // Close an active snack when a new one is added
      setSnackbarIsOpen(false);
    }
  }, [snackPack, snack, snackbarIsOpen]);

  const openChatPanel = () => {
    setChatPanelIsOpen(true);

    document.querySelector('.textchat').style.display = 'flex';
    document.querySelector('.message input').focus();
  };

  const closeChatPanel = () => {
    setChatPanelIsOpen(false);

    document.querySelector('.textchat').style.display = 'none';
  };

  // const openSnackbar = () => setSnackbarIsOpen(true);
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarIsOpen(false);
  };

  const addSnack = (message) => {
    setSnackPack((prev) => [
      ...prev,
      { message, key: String(new Date().getTime()) },
    ]);
  };

  const turnCameraOn = () => {
    setCameraIsOn(true);
    addSnack('Now your camera is turned on. Smile!');
  };
  const turnCameraOff = () => {
    setCameraIsOn(false);
    addSnack('Your camera is turned off now.');
  };

  const turnMicOn = () => {
    setMicIsOn(true);
    addSnack('Now your microphone is open.');
  };
  const turnMicOff = () => {
    setMicIsOn(false);
    addSnack('Your microphone is muted now.');
  };

  const exitSnackbar = () => setSnack(undefined);

  return (
    <div className="container">
      <header>HEADER</header>
      <main>
        <div className="videocall">
          <div className="someone">
            someone
            <div className="me">me</div>
          </div>
        </div>
        <div className="textchat">
          <div className="conversation" />
          <div className="message">
            <InputBase
              placeholder="Message..."
              inputProps={{ 'aria-label': 'type your message' }}
            />
            <IconButton type="submit" aria-label="send message">
              <SendIcon />
            </IconButton>
          </div>
        </div>
        <div className="controls">
          {cameraIsOn ? (
            <Tooltip title="Turn camera off" aria-label="turn camera off">
              <Fab color="secondary" onClick={turnCameraOff}>
                <VideocamOffIcon />
              </Fab>
            </Tooltip>
          ) : (
            <Tooltip title="Turn camera on" aria-label="turn camera on">
              <Fab color="primary" onClick={turnCameraOn}>
                <VideocamIcon />
              </Fab>
            </Tooltip>
          )}
          {micIsOn ? (
            <Tooltip
              title="Turn microphone off"
              aria-label="turn microphone off"
            >
              <Fab color="secondary" onClick={turnMicOff}>
                <MicOffIcon />
              </Fab>
            </Tooltip>
          ) : (
            <Tooltip title="Turn microphone on" aria-label="turn microphone on">
              <Fab color="primary" onClick={turnMicOn}>
                <MicIcon />
              </Fab>
            </Tooltip>
          )}

          {chatPanelIsOpen ? (
            <Tooltip title="Close chat panel" aria-label="close chat panel">
              <Fab color="default" onClick={closeChatPanel}>
                <CloseChatIcon />
              </Fab>
            </Tooltip>
          ) : (
            <Tooltip title="Open chat panel" aria-label="open chat panel">
              <Fab color="default" onClick={openChatPanel}>
                <ChatIcon />
              </Fab>
            </Tooltip>
          )}
        </div>
        <Snackbar
          key={snack ? snack.key : undefined}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={snackbarIsOpen}
          autoHideDuration={5000}
          onClose={closeSnackbar}
          onExited={exitSnackbar}
          message={snack ? snack.message : undefined}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={closeSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </main>
    </div>
  );
}

export default App;
