import React, { useState } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';

// Material UI
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import NoSsr from '@material-ui/core/NoSsr';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const suggestions = [
  { label: 'Debt' },
  { label: 'Entertainment' },
  { label: 'Dinning' },
  { label: 'Food' },
  { label: 'Health Care' },
  { label: 'Housing' },
  { label: 'Income' },
  { label: 'Investment' },
  { label: 'Other' },
  { label: 'Personal Care' },
  { label: 'Transportation' },
  { label: 'Savings' },
  { label: 'Subscription' },
  { label: 'Utilities' }
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label
}));

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 200
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto'
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  singleValue: {
    fontSize: 13
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 13
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  }
}));

// TODO: Fix type
const inputComponent = ({ inputRef, ...props }: any) => <div ref={inputRef} {...props} />;

// Overwrite the control component
const Control = (props: any) => (
  <TextField
    fullWidth
    InputProps={{
      inputComponent,
      inputProps: {
        className: props.selectProps.classes.input,
        inputRef: props.innerRef,
        children: props.children,
        ...props.innerProps
      }
    }}
    {...props.selectProps.textFieldProps}
  />
);

// Overwrite the Options component
const Option = (props: any) => (
  <MenuItem
    ref={props.innerRef}
    selected={props.isFocused}
    component="div"
    style={{
      fontWeight: props.isSelected ? 500 : 400,
      fontSize: 13
    }}
    {...props.innerProps}
  >
    {props.children}
  </MenuItem>
);

// Overwrite the placeholder component
const Placeholder = (props: any) => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.placeholder}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

// Overwrite the singleValue component
const SingleValue = (props: any) => (
  <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
    {props.children}
  </Typography>
);

// Overwrite the valueContainer component
const ValueContainer = (props: any) => (
  <div className={props.selectProps.classes.valueContainer}>{props.children}</div>
);

// Overwrite the menu component
const Menu = (props: any) => (
  <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
    {props.children}
  </Paper>
);

const components = {
  Control,
  Menu,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

type Props = {
  autoFocus?: boolean;
  onChange: (value: string) => void;
  value: { value: string; label: string } | null;
};

const IntegrationReactSelect = (props: Props) => {
  const [value, setValue] = useState(props.value);
  const classes = useStyles();
  const theme = useTheme();

  const onChange = (value: any) => {
    props.onChange(value ? value.value : '');
    setValue(value);
  };

  const selectStyles = {
    input: (base: any) => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit'
      }
    })
  };

  return (
    <div className={classes.root}>
      <NoSsr>
        <CreatableSelect
          isClearable
          classes={classes}
          styles={selectStyles}
          options={suggestions}
          components={components}
          value={value}
          onChange={onChange}
          placeholder="Choose..."
        />
      </NoSsr>
    </div>
  );
};

export default IntegrationReactSelect;
