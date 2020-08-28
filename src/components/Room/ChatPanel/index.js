import React from 'react';
import PropTypes from 'prop-types';

import { InputBase, IconButton } from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';

import { Container, Conversation, Message, MessageBox } from './styles';

function ChatPanel(props) {
  const { open, messages, sendMessage } = props;

  const inputMessageElement = React.useRef(null);

  const handleOnSubmitMessage = () => {
    const message = inputMessageElement.current.value;
    sendMessage(message);

    inputMessageElement.current.value = '';
  };

  return (
    <Container open={open}>
      <Conversation>
        {messages &&
          messages.map((message) => {
            if (message.type === 'text') {
              return (
                <Message
                  origin={message.origin}
                  key={`${message.origin}-${message.datetime}`}
                >
                  {message.content}
                </Message>
              );
            }
            return <Message>TBD</Message>;
          })}
        <div id="testdiv" />
      </Conversation>
      <MessageBox>
        <InputBase
          inputRef={inputMessageElement}
          placeholder="Your message"
          inputProps={{ 'aria-label': 'type your message' }}
        />
        <IconButton
          type="submit"
          aria-label="send message"
          onClick={handleOnSubmitMessage}
          onSubmit={handleOnSubmitMessage}
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
