// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

// Custom Component
import EnhancedSnackbar from 'components/EnhancedSnackbar';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Upload from '@material-ui/icons/CloudUpload';

// Helper Functions
import { isLoading, loadData } from 'ducks/data';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  classes: {
    root: string,
    dropZoneInactive: string,
    dropZoneInactiveText: string,
    rejected: string,
    upload: string
  },
  theme: Object,
  isLoading: boolean => void,
  loadData: (Array<Transaction>) => void
};

const styles = theme => ({
  root: {
    height: 110,
    padding: '0 15%',
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 1px',
    borderColor: theme.palette.accent.main,
    borderRadius: 10,
    margin: theme.spacing.unit * 4.5,
    marginBottom: theme.spacing.unit * 2
  },
  dropZoneInactive: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  dropZoneInactiveText: {
    margin: theme.spacing.unit
  },
  // TODO: Accepted styles?
  rejected: {
    borderColor: theme.palette.error.dark
  },
  upload: {
    fontSize: theme.spacing.unit * 4
  }
});

const DropFile = (props: Props) => {
  const { classes, isLoading, loadData } = props;
  const [isRejected, setIsRejected] = useState(false);

  const onDrop = (acceptedFiles: Array<Blob>, rejectedFiles: Array<Blob>) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        props.isLoading(true);
        modifyFile(result.toString());
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });
  };

  const modifyFile = (csvFile: string) => {
    const results = csvFile.split('\n');
    results.pop();

    const data = results.map((row, index) => {
      // Convert every row into an array of strings
      const transaction = row.split(',');
      return {
        id: index - 1,
        date: new Date(transaction[2]),
        type: transaction[0],
        category: '',
        // Remove the quotes around the details
        details: transaction[4].replace(/^"(.*)"$/, '$1'),
        price: Number(transaction[6])
      };
    });

    // Remove the headers
    data.shift();
    isLoading(false);
    loadData(data);
  };

  const onSnackbarClose = () => {
    setIsRejected(false);
  };

  return (
    <React.Fragment>
      <Dropzone
        accept="text/csv"
        onDropAccepted={() => setIsRejected(false)}
        onDropRejected={() => setIsRejected(true)}
        onDrop={onDrop}
        multiple={false}
      >
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
          return (
            <div
              {...getRootProps()}
              className={isDragReject ? `${classes.root} ${classes.rejected}` : classes.root}
            >
              <input {...getInputProps()} />

              <div className={classes.dropZoneInactive}>
                {isDragActive ? (
                  <Typography align="center">Drop files...</Typography>
                ) : (
                  <React.Fragment>
                    <Typography align="center" className={classes.dropZoneInactiveText}>
                      Drop your RBC CSV file here to get started!
                    </Typography>
                    <Upload className={classes.upload} color="primary" />
                  </React.Fragment>
                )}
              </div>
            </div>
          );
        }}
      </Dropzone>

      <EnhancedSnackbar
        open={isRejected}
        onClose={onSnackbarClose}
        message="Only CSV files are accepted"
        variant="error"
      />
    </React.Fragment>
  );
};

export default withStyles(styles, { withTheme: true })(
  connect(
    null,
    { isLoading, loadData }
  )(DropFile)
);
