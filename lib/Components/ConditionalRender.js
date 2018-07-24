import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ConditionalRender extends Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {
      shouldRender: PropTypes.bool,
      alt: PropTypes.element,
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.object,
      ]),
    };
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
              ...otherProps,
            })
          );
        })()}
      </div>
    );
  }
}
