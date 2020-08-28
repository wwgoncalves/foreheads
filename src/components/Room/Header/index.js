import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip, Button, ButtonGroup } from '@material-ui/core';

import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';

import copyToClipboard from '~/util/copyToClipboard';

import { Container } from './styles';

function Header(props) {
  const { roomId } = props;

  const roomIdElement = React.useRef(null);

  return (
    <Container>
      <Tooltip title="Room ID" aria-label="room id">
        <strong>
          <span id="room-id" ref={roomIdElement}>
            {roomId}
          </span>
        </strong>
      </Tooltip>
      <ButtonGroup aria-label="button group">
        <Tooltip
          title="Copy to clipboard"
          aria-label="copy room id to clipboard"
        >
          <Button
            variant="contained"
            size="small"
            onClick={() => copyToClipboard(roomIdElement)}
          >
            <CopyIcon fontSize="small" />
          </Button>
        </Tooltip>
        <Tooltip
          title="Share on WhatsApp"
          aria-label="share room id on whatsapp"
        >
          <Button
            className="whatsapp"
            size="small"
            onClick={() =>
              window.open(`whatsapp://send?text=${encodeURIComponent(roomId)}`)
            }
          >
            <WhatsAppIcon fontSize="small" />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Container>
  );
}

Header.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default Header;
