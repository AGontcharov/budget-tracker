import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

// Custom Component
import EnhancedSnackbar from 'components/EnhancedSnackbar';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Upload from '@material-ui/icons/CloudUpload';

// Helper Functions
import { setLoading, loadData } from 'ducks/data';

// TypeScript
import { Transaction } from 'ducks/data';

type Props = {
  setLoading: (paylod: boolean) => void;
  loadData: (payload: Array<Transaction>) => void;
};

const useStyles = makeStyles(theme => ({
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
    margin: theme.spacing(4.5),
    marginBottom: theme.spacing(2)
  },
  dropZoneInactive: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  dropZoneInactiveText: {
    margin: theme.spacing(1)
  },
  // TODO: Accepted styles?
  rejected: {
    borderColor: theme.palette.error.dark
  },
  upload: {
    fontSize: theme.spacing(4)
  }
}));

const DropFile = (props: Props) => {
  const { setLoading, loadData } = props;
  const classes = useStyles();
  const [isRejected, setIsRejected] = useState(false);

  const onDrop = (acceptedFiles: Array<Blob>) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        setLoading(true);
        if (result) {
          modifyFile(result.toString());
        }
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });
  };

  const modifyFile = useCallback(
    (csvFile: string) => {
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
          description: '',
          price: Number(transaction[6])
        };
      });

      // Remove the headers
      data.shift();
      setLoading(false);
      loadData(data);
    },
    [setLoading, loadData]
  );

  const onSnackbarClose = useCallback(() => {
    setIsRejected(false);
  }, []);

  return (
    <>
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
                  <Typography align="center">{'Drop files...'}</Typography>
                ) : (
                  <>
                    <Typography align="center" className={classes.dropZoneInactiveText}>
                      {'Drop your RBC CSV file here to get started!'}
                    </Typography>
                    <Upload className={classes.upload} color="primary" />
                  </>
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
    </>
  );
};

export default connect(
  null,
  { setLoading, loadData }
)(DropFile);
