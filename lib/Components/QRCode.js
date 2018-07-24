import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qrImage from 'qr-image';

/*
* Taken from:
* https://github.com/jprichardson/react-qr
* */

// TODO: pure component
export default class ReactQR extends Component {
  constructor(props) {
    super(props);
  }
  static get propTypes() {
    return {
      text: PropTypes.string,
      containerStyle: PropTypes.object,
    };
  }
  render() {
    const { text, containerStyle } = this.props;
    if (text) {
      const pngBuffer = qrImage.imageSync(text, { type: 'png', margin: 1 });
      const dataURI = `data:image/png;base64,${pngBuffer.toString('base64')}`;
      return (
        <div style={containerStyle}>
          <img className="react-qr" src={dataURI} />
        </div>
      );
    }
    // return empty div when no text passed in
    return <div />;
  }
}
