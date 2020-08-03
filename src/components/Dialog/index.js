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

function Dialog() {
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <MUDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Join an existing room or create a new
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To join an existing room, provide its identifier below. Or create a
            new one.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="existing-room-id"
            label="Existing Room ID"
            type="text"
            variant="outlined"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Create new
          </Button>
          <Button onClick={handleClose} color="primary">
            Join
          </Button>
        </DialogActions>
      </MUDialog>
    </div>
  );
}

export default Dialog;
