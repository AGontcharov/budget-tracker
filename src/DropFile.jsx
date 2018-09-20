// @flow
import * as React from 'react';
import { withTheme } from '@material-ui/core/styles';
import Dropzone from 'react-dropzone';

// Custom Component
import BudgetTable from './BudgetTable';

// Material UI
import Typography from '@material-ui/core/Typography';
import Upload from '@material-ui/icons/CloudUpload';

type Props = {
  theme: Object
};

type State = {
  data: Array<{
    date: string,
    type: string,
    category: string,
    details: string,
    price: number
  }>,
  dropzoneActive: boolean
};

class DropFile extends React.Component<Props, State> {
  state = {
    data: [],
    dropzoneActive: false
  };

  onDrop = (acceptedFiles: Array<Blob>, rejectedFiles: Array<Blob>) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        // Do whatever you want with the file content
        this.modifyFile(result.toString());
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });

    this.setState({ dropzoneActive: false });
  };

  onDragEnter = () => {
    this.setState({ dropzoneActive: true });
  };

  onDragLeave = () => {
    this.setState({ dropzoneActive: false });
  };

  modifyFile = (csvFile: string) => {
    const results = csvFile.split('\n');
    const data = results.map((row, index) => {
      // Convert every row into an array of strings
      const transaction = row.split(',');
      return {
        date: new Date(transaction[2]),
        type: transaction[0],
        category: '',
        details: transaction[4],
        price: Number(transaction[6])
      };
    });

    // Remove the headers
    data.shift();
    data.pop();

    this.setState({ data });
  };

  render() {
    const { data, dropzoneActive } = this.state;
    const { theme } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Dropzone
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          multiple={false}
          style={{
            width: 847,
            height: 150,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'solid 1px',
            borderColor: theme.palette.accent.main,
            borderRadius: 10
          }}
        >
          {dropzoneActive && (
            <div>
              <Typography variant="body1" align="center">
                Drop files...
              </Typography>
            </div>
          )}
          {!dropzoneActive && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="body1" align="center" style={{ margin: 8 }}>
                Drop your RBC CSV file here to get started!
              </Typography>
              <Upload style={{ fontSize: 32 }} color="primary" />
            </div>
          )}
        </Dropzone>
        <BudgetTable data={data} />
      </div>
    );
  }
}

export default withTheme()(DropFile);
