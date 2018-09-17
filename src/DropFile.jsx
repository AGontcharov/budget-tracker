// @flow
import * as React from 'react';
import Dropzone from 'react-dropzone';

import BudgetTable from './BudgetTable';

type Props = {};

type State = {
  data: Array<{
    date: string,
    type: string,
    category: string,
    details: string,
    price: string
  }>
};

class DropFile extends React.Component<Props, State> {
  state = {
    data: []
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
  };

  modifyFile = (csvFile: string) => {
    const results = csvFile.split('\n');

    const data = results.map((row, index) => {
      // Convert every row into an array of strings
      const transaction = row.split(',');
      return {
        date: transaction[2],
        type: transaction[0],
        category: '',
        details: transaction[4],
        price: transaction[6]
      };
    });

    // Remove the headers
    data.shift();
    this.setState({ data });
  };

  render() {
    const { data } = this.state;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Dropzone onDrop={this.onDrop} multiple={false} />
        <BudgetTable data={data} />
      </div>
    );
  }
}

export default DropFile;
