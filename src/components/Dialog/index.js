import React from 'react';

import {
  Button,
  TextField,
  Dialog as MUDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

// import { Container } from './styles';

function Dialog(props) {
  const {
    handleNewRoom,
    handleJoinExistingRoom,
    existingRoomID,
    setExistingRoomID,
  } = props;

  const [open, setOpen] = React.useState(true);
  const [existingRoomSelected, setExistingRoomSelected] = React.useState(false);

  const handleSelectNewRoom = () => {
    handleClose();
    handleNewRoom();
  };

  const handleSelectExistingRoom = () => {
    setExistingRoomSelected(true);
  };

  const handleChange = (event) => {
    setExistingRoomID(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleJoin = () => {
    handleJoinExistingRoom();
    handleClose();
  };

  return (
    <div>
      <MUDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {!existingRoomSelected ? (
          <>
            <DialogTitle id="form-dialog-title">
              Create or join an existing room
            </DialogTitle>
            <DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleSelectNewRoom}
                >
                  Create
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSelectExistingRoom}
                >
                  Join
                </Button>
              </DialogActions>
            </DialogContent>
          </>
        ) : (
          <>
            <DialogTitle id="form-dialog-title">
              Join an existing room
            </DialogTitle>
            <DialogContent>
              {/* <DialogContentText>
                To join an existing room, provide its identifier below.
              </DialogContentText> */}
              <TextField
                id="existing-room-id"
                label="Existing Room ID"
                type="text"
                fullWidth
                variant="outlined"
                value={existingRoomID}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleJoin} color="primary">
                Join
              </Button>
            </DialogActions>
          </>
        )}
      </MUDialog>
    </div>
  );
}

export default Dialog;
