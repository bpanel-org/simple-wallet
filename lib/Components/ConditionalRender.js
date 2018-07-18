import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Button } from '@bpanel/bpanel-ui';
import styles from '../styles';

import { safeEval, preventDefault } from '../utilities';
import { PLUGIN_NAMESPACE } from '../constants';

export default class ConditionalRender extends Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {};
  }

  render() {
    const { shouldRender, alt, children, ...otherProps } = this.props;

    // render alternative component
    // default to a blank div
    let altComponent = alt;
    if (!alt) {
      altComponent = <div />;
    }

    // render conditionally based on shouldRender prop
    return (
      <div>
        {(() => {
          if (!shouldRender) return altComponent;
          return React.Children.map(children, (Component, i) =>
            React.cloneElement(Component, {
              key: i,
              ...otherProps
            })
          );
        })()}
      </div>
    );
  }
}
