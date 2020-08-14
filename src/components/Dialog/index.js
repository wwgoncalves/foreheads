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
  const { handleCreateNewRoom, handleJoinExistingRoom } = props;

  const [open, setOpen] = React.useState(true);
  const [joinSelected, setJoinSelected] = React.useState(false);
  const [existingRoomID, setExistingRoomID] = React.useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectCreate = () => {
    handleCreateNewRoom();
    handleClose();
  };

  const handleSelectJoin = () => {
    setJoinSelected(true);
  };

  const handleChange = (event) => {
    setExistingRoomID(event.target.value);
  };

  const handleJoin = (event) => {
    event.preventDefault();

    handleJoinExistingRoom(existingRoomID);
    handleClose();
  };

  return (
    <div>
      <MUDialog
        open={open}
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="form-dialog-title"
      >
        {!joinSelected ? (
          <>
            <DialogTitle id="form-dialog-title">
              Create or join an existing room
            </DialogTitle>
            <DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSelectCreate}
                >
                  Create a new
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSelectJoin}
                >
                  Join a room
                </Button>
              </DialogActions>
            </DialogContent>
          </>
        ) : (
          <form onSubmit={handleJoin}>
            <DialogTitle id="form-dialog-title">
              Join an existing room
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                To join an existing room, provide its identifier below.
              </DialogContentText>
              <TextField
                required
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
              <Button type="submit" variant="contained" color="primary">
                Join
              </Button>
            </DialogActions>
          </form>
        )}
      </MUDialog>
    </div>
  );
}

export default Dialog;
