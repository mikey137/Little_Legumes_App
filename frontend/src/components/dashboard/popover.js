import React from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function AddMomentPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="outlined" onClick={handleClick}>
        Add Moment
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div id="popover-card">
            <TextField id="outlined-basic" label="Date" variant="outlined" />
            <TextField id="outlined-basic" label="Caption" variant="outlined" />
        </div>
      </Popover>
    </div>
  );
}