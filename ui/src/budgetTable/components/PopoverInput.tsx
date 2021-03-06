import React, { useRef, FormEvent } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Popover from '@material-ui/core/Popover';

type Props = {
  anchorEl: HTMLTableCellElement | null;
  index: number;
  name: string;
  onChange: (index: number, value: string) => void;
  setAnchorEl: (AnchorEl: HTMLTableCellElement | null) => void;
};

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column'
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    fontSize: 13,
    margin: 4
  },
  popover: {
    border: '1px solid grey'
  },
  popoverInput: {
    width: 256,
    margin: theme.spacing(1.5),
    fontSize: 13
  }
}));

const PopoverInput = (props: Props) => {
  const { anchorEl, index, onChange, setAnchorEl, ...rest } = props;
  const classes = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);
  const open = Boolean(anchorEl);

  const onClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputRef && inputRef.current && inputRef.current.value) {
      onChange(index, inputRef.current.value);
    }
    setAnchorEl(null);
  };

  return (
    <Popover
      anchorEl={anchorEl}
      elevation={0}
      onClose={onClose}
      open={open}
      PaperProps={{
        square: true,
        style: {
          border: '1px solid grey'
        }
      }}
    >
      <form onSubmit={onSubmit} className={classes.form}>
        <Input
          inputRef={inputRef}
          autoFocus
          autoComplete="off"
          {...rest}
          className={classes.popoverInput}
        />
        <div className={classes.buttonWrapper}>
          <Button type="submit" color="primary" className={classes.button}>
            {'Save'}
          </Button>
          <Button onClick={onClose} color="primary" className={classes.button}>
            {'Cancel'}
          </Button>
        </div>
      </form>
    </Popover>
  );
};

export default PopoverInput;
