import React from 'react';
import PropTypes from 'prop-types';

import { CircularProgress, InputBase, IconButton } from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';

import { Container, Conversation, Message, MessageBox } from './styles';

function ChatPanel(props) {
  const { open, messages, sendMessage } = props;

  const inputMessageElement = React.useRef(null);

  const handleOnSubmitMessage = (event) => {
    event.preventDefault();

    const message = inputMessageElement.current.value;
    if (message) {
      sendMessage(message);

      inputMessageElement.current.value = '';
    }
  };

  return (
    <Container open={open}>
      <Conversation>
        {messages.length > 0 &&
          messages.map((message) => {
            return (
              <Message
                data-time={new Date(message.datetime).toLocaleTimeString([], {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                origin={message.origin}
                key={message.key}
              >
                {message.type === 'file' &&
                  (message.isSending || message.isReceiving) && (
                    <CircularProgress color="inherit" size="1rem" />
                  )}
                {message.content}
              </Message>
            );
          })}
        <div id="testdiv" />
      </Conversation>
      <MessageBox onSubmit={handleOnSubmitMessage}>
        <InputBase
          inputRef={inputMessageElement}
          placeholder="Your message"
          inputProps={{ 'aria-label': 'type your message' }}
        />
        <IconButton
          type="submit"
          aria-label="send message"
          onClick={handleOnSubmitMessage}
        >
          <SendIcon />
        </IconButton>
      </MessageBox>
    </Container>
  );
}

ChatPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      origin: PropTypes.string,
      datetime: PropTypes.number,
    })
  ),
  sendMessage: PropTypes.func.isRequired,
};

ChatPanel.defaultProps = {
  messages: [],
};

export default ChatPanel;
