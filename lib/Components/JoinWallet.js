import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Input, Button } from '@bpanel/bpanel-ui';

import styles from '../styles';
import { safeEval, preventDefault } from '../utilities';
import { PLUGIN_NAMESPACE } from '../constants';

class JoinWallet extends Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {}
  }

  render() {
    const {
      handleUpdate,
      handleCreate,
      selectedMultisigWallet,
      textFields,
    } = this.props;

    const {
      cosignerPathInput,
      joinKeyInput,
      joinCosignerNameInput,
      joinXpubInput,
    } = textFields;

    return (
      <div>
       <div className="row">
         <Header type="h3">Join Multisig Wallet</Header>
       </div>
       <div className="row">
         <div className="col-sm">
           <Header type="h5">Cosigner Name</Header>
           <Input
             type="text"
             name="cosignerName"
             style={styles.inputStyle}
             placeholder="cosigner name"
             className="form-control"
             value={joinCosignerNameInput.value}
             onChange={e => handleUpdate(preventDefault(e).target.value, 'joinCosignerNameInput')}
           />
           <Header type="h5">Cosigner Path</Header>
           <Input
             type="text"
             name="cosignerPath"
             placeholder="cosigner path"
             style={styles.inputStyle}
             className="form-control"
             value={cosignerPathInput.value}
             onChange={e => handleUpdate(preventDefault(e).target.value, 'cosignerPathInput')}
           />
         </div>
         <div className="col-sm">
           <Header type="h5">Join Key</Header>
           <Input
             type="text"
             name=""
             placeholder="join key"
             style={styles.inputStyle}
             className="form-control"
             value={joinKeyInput.value}
             onChange={e => handleUpdate(preventDefault(e).target.value, 'joinKeyInput')}
           />
           <Header type="h5">xpub</Header>
           <Input
             type="text"
             name="xpub"
             placeholder="xpub"
             style={styles.inputStyle}
             className="form-control"
             value={joinXpubInput.value}
             onChange={e => handleUpdate(preventDefault(e).target.value, 'joinXpubInput')}
           />
         </div>
       </div>
       <div className="row">
         <Button
           type="action"
           style={styles.wideButton}
           onClick={() => handleCreate({
             walletName: selectedMultisigWallet,
             cosignerName: joinCosignerNameInput.value,
             cosignerPath: cosignerPathInput.value,
             joinKey: joinKeyInput.value,
             xpub: joinXpubInput.value,
           }, 'joinWallet')}
         >
           Join
         </Button>
       </div>
      </div>
    )
  }
}

const mapStateToProps = (state, otherProps) => {
  const pluginState = state.plugins[PLUGIN_NAMESPACE] || {};
  const { selectedMultisigWallet } = pluginState;
  return {
    selectedMultisigWallet,
    ...otherProps
  }
}

export default connect(mapStateToProps)(JoinWallet);

