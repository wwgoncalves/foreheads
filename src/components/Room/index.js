import React from 'react';
import PropTypes from 'prop-types';

import { Fab, IconButton, Tooltip, Snackbar, Slide } from '@material-ui/core';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ChatIcon from '@material-ui/icons/Chat';
import CloseChatIcon from '@material-ui/icons/SpeakerNotesOff';
import CloseIcon from '@material-ui/icons/Close';
import CallEndIcon from '@material-ui/icons/CallEnd';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import WebRTC from '~/services/webrtc';

import Header from './Header';
import TextChat from './ChatPanel';

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
  const { isCaller, roomId } = props;

  const localMediaElement = React.useRef(null);
  const remoteMediaElement = React.useRef(null);
  const [webRTC, setWebRTC] = React.useState(null);
  const [alone, setAlone] = React.useState(true);

  const [messages, setMessages] = React.useState([]);
  const [chatPanelIsOpen, setChatPanelIsOpen] = React.useState(false);

  const [cameraIsOn, setCameraIsOn] = React.useState(true);
  const [micIsOn, setMicIsOn] = React.useState(true);

  const [snackbarIsOpen, setSnackbarIsOpen] = React.useState(false);
  const [snackPack, setSnackPack] = React.useState([]);
  const [snack, setSnack] = React.useState(undefined);

  const onLocalMedia = (stream) => {
    localMediaElement.current.srcObject = stream;
  };

  const onRemoteMedia = (stream) => {
    if (remoteMediaElement.current.srcObject) return;
    remoteMediaElement.current.srcObject = stream;
    setAlone(false);
  };

  const addSnack = (message) => {
    setSnackPack((prev) => [
      ...prev,
      { message, key: String(new Date().getTime()) },
    ]);
  };
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarIsOpen(false);
  };
  const exitSnackbar = () => setSnack(undefined);

  const turnCameraOn = () => {
    if (webRTC) {
      webRTC.unmuteTrack('video');
      setCameraIsOn(true);
      addSnack('Camera turned on');
    }
  };
  const turnCameraOff = () => {
    if (webRTC) {
      webRTC.muteTrack('video');
      setCameraIsOn(false);
      addSnack('Camera turned off');
    }
  };

  const turnMicOn = () => {
    if (webRTC) {
      webRTC.unmuteTrack('audio');
      setMicIsOn(true);
      addSnack('Microphone unmuted');
    }
  };
  const turnMicOff = () => {
    if (webRTC) {
      webRTC.muteTrack('audio');
      setMicIsOn(false);
      addSnack('Microphone muted');
    }
  };

  const openChatPanel = () => {
    setChatPanelIsOpen(true);
  };
  const closeChatPanel = () => {
    setChatPanelIsOpen(false);
  };

  const addMessage = (messageObject) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        ...messageObject,
        key: `${messageObject.origin}-${messageObject.datetime}`,
      },
    ]);
  };
  const replaceMessage = (messageObject) => {
    const messageKey = `${messageObject.origin}-${messageObject.datetime}`;

    setMessages((prevMessages) => {
      const messagesArray = prevMessages;
      const index = messagesArray.findIndex(
        (message) => message.key === messageKey
      );
      if (index !== -1) {
        messagesArray[index] = {
          ...messageObject,
          key: messageKey,
        };
      }

      return [...messagesArray];
    });
  };

  const transferFile = (event) => {
    function readFile(file) {
      return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => {
          resolve(fr.result);
        };
        fr.onerror = () => {
          reject(new Error('File reading failed.'));
        };
        fr.readAsArrayBuffer(file);
      });
    }

    const file = event.target.files[0];

    readFile(file)
      .then((fileArrayBuffer) => {
        const datetime = new Date().getTime();
        const fileName = file.name;
        const fileType = file.type;
        const fileSize = fileArrayBuffer.byteLength;

        const messageObject = {
          type: 'file',
          content: `${fileName} (${fileType}, ${fileSize} bytes)`,
          origin: 'mine',
          datetime,
          isSending: true,
        };
        addMessage(messageObject);

        if (webRTC) {
          webRTC.sendFile({
            datetime,
            fileName,
            fileType,
            fileSize,
            fileArrayBuffer,
          });
        }
      })
      .catch((error) => console.error(error));
  };

  const endCall = () => {
    if (webRTC) {
      webRTC.endPeerConnection();
    }
  };

  const sendMessage = (message) => {
    const messageObject = {
      type: 'text',
      content: message,
      datetime: new Date().getTime(),
    };

    if (webRTC) {
      webRTC.sendMessage(messageObject);
    }

    messageObject.origin = 'mine';
    addMessage(messageObject);
  };

  const onFileSent = (fileInfo) => {
    const { datetime, fileName, fileType, fileSize } = fileInfo;

    const messageObject = {
      type: 'file',
      content: `${fileName} (${fileType}, ${fileSize} bytes)`,
      origin: 'mine',
      datetime,
      isSending: false,
    };

    replaceMessage(messageObject);
  };

  const onMessage = (messageObject) => {
    // eslint-disable-next-line no-param-reassign
    messageObject.origin = 'theirs';
    addMessage(messageObject);
  };

  const onFileTransfer = (fileInfo) => {
    const { datetime, fileName, fileType, fileSize } = fileInfo;
    // console.log(
    //   `TO BE TRANSFERRED: ${fileName} - ${fileType} - ${fileSize} bytes`
    // );
    const messageObject = {
      type: 'file',
      content: `${fileName} (${fileType}, ${fileSize} bytes)`,
      origin: 'theirs',
      datetime,
      isReceiving: true,
    };

    addMessage(messageObject);
  };
  const onFileReady = (fileInfo, fileBlob) => {
    const { datetime, fileName, fileType, fileSize } = fileInfo;
    // console.log(
    //   `FILE AVAILABLE: ${fileName} - ${fileType} - ${fileSize} bytes`
    // );

    // const a = document.createElement('a');
    const a = {};
    a.innerText = `${fileName} (${fileType}, ${fileSize} bytes)`;
    a.href = URL.createObjectURL(fileBlob);
    a.target = '_blank';
    // document.querySelector('#testdiv').prepend(a);

    const messageObject = {
      type: 'file',
      content: (
        <a href={a.href} target={a.target}>
          {a.innerText}
        </a>
      ),
      origin: 'theirs',
      datetime,
      isReceiving: false,
    };

    replaceMessage(messageObject);
  };

  React.useEffect(() => {
    async function buildWebRTCObject() {
      const mediaConstraints = {
        audio: true,
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const webrtcOptions = {
        networkId: roomId,
        mediaConstraints,
        onLocalMedia,
        onRemoteMedia,
        onFileSent,
        onMessage,
        onFileTransfer,
        onFileReady,
      };
      setWebRTC(await WebRTC.build(webrtcOptions));
    }

    // setMessages([
    //   {
    //     type: 'text',
    //     content:
    //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore?',
    //     origin: 'theirs',
    //     datetime: new Date().getTime() + 0,
    //   },
    //   {
    //     type: 'text',
    //     content:
    //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore?',
    //     origin: 'theirs',
    //     datetime: new Date().getTime() + 1,
    //   },
    //   {
    //     type: 'text',
    //     content:
    //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore?',
    //     origin: 'theirs',
    //     datetime: new Date().getTime() + 2,
    //   },
    //   {
    //     type: 'text',
    //     content:
    //       'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
    //     origin: 'mine',
    //     datetime: new Date().getTime() + 3,
    //   },
    // ]);

    buildWebRTCObject();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    async function initWebRTCSession() {
      if (webRTC) {
        await webRTC.init(isCaller);
      }
    }

    initWebRTCSession();
  }, [webRTC]); // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <div className="container">
      <Header roomId={roomId} />
      <main>
        <div className="videocall">
          <div className="someone">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video id="theirVideo" ref={remoteMediaElement} autoPlay />
            <div className={`me ${alone ? 'alone' : ''}`}>
              <video id="myVideo" ref={localMediaElement} autoPlay muted />
            </div>
          </div>
        </div>
        <TextChat
          open={chatPanelIsOpen}
          messages={messages}
          sendMessage={sendMessage}
        />
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
          </div>

          {!alone && (
            <>
              <div>
                {chatPanelIsOpen ? (
                  <Tooltip
                    title="Close chat panel"
                    aria-label="close chat panel"
                  >
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
                <Tooltip title="Transfer file" aria-label="transfer file">
                  <label htmlFor="transfer-file">
                    <input
                      type="file"
                      id="transfer-file"
                      onChange={transferFile}
                    />
                    <Fab color="default" component="span">
                      <AttachFileIcon />
                    </Fab>
                  </label>
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

Room.propTypes = {
  isCaller: PropTypes.bool.isRequired,
  roomId: PropTypes.string.isRequired,
};

export default Room;
