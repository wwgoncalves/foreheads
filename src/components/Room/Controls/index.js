import React from 'react';
import PropTypes from 'prop-types';

import { Fab, Tooltip } from '@material-ui/core';

import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ChatIcon from '@material-ui/icons/Chat';
import CloseChatIcon from '@material-ui/icons/SpeakerNotesOff';
import CallEndIcon from '@material-ui/icons/CallEnd';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import { Container } from './styles';

function Controls(props) {
  const {
    alone,
    cameraIsOn,
    micIsOn,
    chatPanelIsOpen,
    turnCameraOn,
    turnCameraOff,
    turnMicOn,
    turnMicOff,
    openChatPanel,
    closeChatPanel,
    transferFile,
    endCall,
  } = props;

  return (
    <Container>
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
          <Tooltip title="Turn microphone off" aria-label="turn microphone off">
            <Fab color="default" onClick={turnMicOff}>
              <MicIcon />
            </Fab>
          </Tooltip>
        ) : (
          <Tooltip title="Turn microphone on" aria-label="turn microphone on">
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
            <Tooltip title="Transfer file" aria-label="transfer file">
              <label htmlFor="transfer-file">
                <input type="file" id="transfer-file" onChange={transferFile} />
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
    </Container>
  );
}

Controls.propTypes = {
  alone: PropTypes.bool.isRequired,
  cameraIsOn: PropTypes.bool.isRequired,
  micIsOn: PropTypes.bool.isRequired,
  chatPanelIsOpen: PropTypes.bool.isRequired,
  turnCameraOn: PropTypes.func.isRequired,
  turnCameraOff: PropTypes.func.isRequired,
  turnMicOn: PropTypes.func.isRequired,
  turnMicOff: PropTypes.func.isRequired,
  openChatPanel: PropTypes.func.isRequired,
  closeChatPanel: PropTypes.func.isRequired,
  transferFile: PropTypes.func.isRequired,
  endCall: PropTypes.func.isRequired,
};

export default Controls;
