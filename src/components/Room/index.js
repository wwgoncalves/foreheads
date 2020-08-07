import React from 'react';

import {
  Fab,
  InputBase,
  IconButton,
  Tooltip,
  Snackbar,
  Slide,
  Button,
} from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ChatIcon from '@material-ui/icons/Chat';
import CloseChatIcon from '@material-ui/icons/SpeakerNotesOff';
import CloseIcon from '@material-ui/icons/Close';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import CallEndIcon from '@material-ui/icons/CallEnd';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import WebRTC from '~/services/webrtc';

// import { Container } from './styles';

function SlideUpTransition(props) {
  return <Slide {...props} direction="down" />;
}

function CustomSnackbar(props) {
  return (
    <Snackbar
      {...props}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      TransitionComponent={SlideUpTransition}
    />
  );
}

function Room(props) {
  const { isCaller, roomID, firebase } = props;

  const [alone, setAlone] = React.useState(true);
  const [cameraIsOn, setCameraIsOn] = React.useState(true);
  const [micIsOn, setMicIsOn] = React.useState(true);
  const [chatPanelIsOpen, setChatPanelIsOpen] = React.useState(false);
  const [snackbarIsOpen, setSnackbarIsOpen] = React.useState(false);
  const [snackPack, setSnackPack] = React.useState([]);
  const [snack, setSnack] = React.useState(undefined);

  React.useEffect(() => {
    const webrtc = new WebRTC(
      '',
      '',
      document.getElementById('myVideo'),
      document.getElementById('theirVideo'),
      firebase,
      roomID,
      setAlone
    );

    webrtc.initMedia(isCaller);
  }, []);

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

  const exitSnackbar = () => setSnack(undefined);

  const turnCameraOn = () => {
    setCameraIsOn(true);
    addSnack('Camera turned on');
  };
  const turnCameraOff = () => {
    setCameraIsOn(false);
    addSnack('Camera turned off');
  };

  const turnMicOn = () => {
    setMicIsOn(true);
    addSnack('Microphone unmuted');
  };
  const turnMicOff = () => {
    setMicIsOn(false);
    addSnack('Microphone muted');
  };

  const endCall = () => {};

  const transferFile = () => {};

  return (
    <div className="container">
      <header>
        <div>
          <span>Room ID:</span>
          <strong>
            <span id="room-id">{roomID}</span>
          </strong>
        </div>
        <Tooltip title="Share on WhatsApp" aria-label="share on whatsapp">
          <Button
            className="whatsapp"
            size="small"
            onClick={() =>
              window.open(`whatsapp://send?text=${encodeURIComponent(roomID)}`)
            }
            startIcon={<WhatsAppIcon />}
          >
            Share
          </Button>
        </Tooltip>
      </header>
      <main>
        <div className="videocall">
          <div className="someone">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video id="theirVideo" autoPlay />
            <div className={`me ${alone ? 'alone' : ''}`}>
              <video id="myVideo" autoPlay muted />
            </div>
          </div>
        </div>
        <div className="textchat">
          <div className="conversation">
            <span className="theirs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore?
            </span>
            <span className="mine">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat.
            </span>
            <span className="theirs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore?
            </span>
            {/* <span className="theirs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore?
            </span>
            <span className="mine">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat.
            </span>
            <span className="mine">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat.
            </span>
            <span className="mine">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium?
            </span>
            <span className="theirs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore?
            </span>
            <span className="mine">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat.
            </span> */}
            <span className="theirs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore?
            </span>
            <span className="mine">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat.
            </span>
          </div>
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
          <div>
            {cameraIsOn ? (
              <Tooltip title="Turn camera off" aria-label="turn camera off">
                <Fab color="default" onClick={turnCameraOff}>
                  <VideocamIcon />
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="Turn camera on" aria-label="turn camera on">
                <Fab color="secondary" onClick={turnCameraOn}>
                  <VideocamOffIcon />
                </Fab>
              </Tooltip>
            )}
            {micIsOn ? (
              <Tooltip
                title="Turn microphone off"
                aria-label="turn microphone off"
              >
                <Fab color="default" onClick={turnMicOff}>
                  <MicIcon />
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip
                title="Turn microphone on"
                aria-label="turn microphone on"
              >
                <Fab color="secondary" onClick={turnMicOn}>
                  <MicOffIcon />
                </Fab>
              </Tooltip>
            )}

            {chatPanelIsOpen ? (
              <Tooltip title="Close chat panel" aria-label="close chat panel">
                <Fab color="default" onClick={closeChatPanel}>
                  <ChatIcon />
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="Open chat panel" aria-label="open chat panel">
                <Fab color="default" onClick={openChatPanel}>
                  <CloseChatIcon />
                </Fab>
              </Tooltip>
            )}
          </div>

          {!alone && (
            <>
              <div>
                <Tooltip title="Transfer file" aria-label="transfer file">
                  <Fab color="default" onClick={transferFile}>
                    <AttachFileIcon />
                  </Fab>
                </Tooltip>
              </div>
              <div>
                <Tooltip title="End call" aria-label="end call">
                  <Fab color="secondary" onClick={endCall}>
                    <CallEndIcon />
                  </Fab>
                </Tooltip>
              </div>
            </>
          )}
        </div>
        <CustomSnackbar
          key={snack ? snack.key : undefined}
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

export default Room;
