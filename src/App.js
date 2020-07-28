import React, { useState } from 'react';

import Fab from '@material-ui/core/Fab';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import ChatIcon from '@material-ui/icons/Chat';
import CloseChatIcon from '@material-ui/icons/SpeakerNotesOff';
import Tooltip from '@material-ui/core/Tooltip';

import '~/assets/css/App.css';

function App() {
  const [chatPanel, setChatPanel] = useState(false);

  const openChatPanel = () => {
    setChatPanel(true);

    document.querySelector('.textchat').style.display = 'block';
  };

  const closeChatPanel = () => {
    setChatPanel(false);

    document.querySelector('.textchat').style.display = 'none';
  };

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
        <div className="textchat">TEXTCHAT</div>
        <div className="controls">
          <Tooltip title="Turn camera off" aria-label="turn camera off">
            <Fab color="secondary">
              <VideocamOffIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Turn microphone off" aria-label="turn microphone off">
            <Fab color="secondary">
              <MicOffIcon />
            </Fab>
          </Tooltip>
          {!chatPanel && (
            <Tooltip title="Open chat panel" aria-label="open chat panel">
              <Fab color="default" onClick={openChatPanel}>
                <ChatIcon />
              </Fab>
            </Tooltip>
          )}
          {chatPanel && (
            <Tooltip title="Close chat panel" aria-label="close chat panel">
              <Fab color="default" onClick={closeChatPanel}>
                <CloseChatIcon />
              </Fab>
            </Tooltip>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
