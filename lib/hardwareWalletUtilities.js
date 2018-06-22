import { Script, Outpoint } from 'bcoin';
import TX from 'bcoin/lib/primitives/tx';
import MTX from 'bcoin/lib/primitives/mtx';
import Coin from 'bcoin/lib/primitives/coin';
import { LedgerBcoin, U2F, LedgerTXInput } from 'bledger/lib/bledger-browser';
const { Device } = U2F;

/**
 * Initializes and returns a new Device
 * NOTE: caller must call device.close when done
 * @returns {Device}
 */
const newDevice = async () => {
  try {
    const devices = await Device.getDevices();
    const device = new Device({
      device: devices[0],
      timeout: 5000
    });
    return device;
  } catch (e) {
    throw e;
  }
}

/**
 * Initializes and returns a new LedgerBcoin
 * @returns {LedgerBcoin}
 */
export const newLedgerBcoin = async () => {
  try {
    const device = await newDevice();
    const ledgerBcoin = new LedgerBcoin({ device });

    // return device so that it can be closed
    return { device, ledgerBcoin };

  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Get public key from an application by path
 * @param {btcApp} - an instance of a key manager like LedgerBcoin
 * @param {path} - bip 44 path
 */
export const getPublicKey = async (btcApp, path) => {
  try {
    return await btcApp.getPublicKey(path);
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Get BIP 44 path by account
 * @param {account} - a BIP 44 account integer
 * @returns {path} - bip 44 path
 */
// TODO: rename this - buildxpubpath
export const buildBIP44PathByAccount = account => `m/44'/${account}'/0'`;

// TODO: clean up arguments
// TODO: properly build tx data
export const signTX = async (bcoinApp, client, accountPath, proposalMTX, walletId) => {
  const { tx, scripts, paths } = proposalMTX;
  const transaction = new TX(tx).toRaw();
  const redeem = Buffer.from(scripts[0].data);
  const mtx = new MTX(tx);

  // fetch input data, use that get create the LedgerTXInputs
  // use the paths to build the full paths along with xpub
  // `${xpub}/${account}/${index}`

  console.assert(paths.length === tx.inputs.length, '');

  const ledgerInputs = [];
  for (let i = 0; i < tx.inputs.length; i++) {
    const { hash, index } = tx.inputs[i].prevout;

    console.log(`hash: ${hash}`);
    // NOTE: walletClient doesn't return enough information
    //console.log(txDetails);
    //const transaction = new MTX(txDetails);
    const coin = await client.getCoin(walletId, hash, index);
    const txDetails = await client.getTX(walletId, hash);
    console.log(coin);
    console.log(txDetails);
    // TODO: using i here isn't correct
    txDetails.inputs[i].prevout = { hash: coin.hash, index: coin.index, script: coin.script };
    const transaction = new MTX(txDetails);
    // getwalletcoin <-- merge the data
    //const txDetails = await walletClient.getTX(hash, index);
    const path = paths[i];
    const { branch, index: pathIndex } = path;
    const idx = `${accountPath}/${branch}/${pathIndex}`;

    console.log(`LedgerTXInput using index: ${idx}`);
    // always need to pass raw txn
    let input = new LedgerTXInput({
      tx: transaction.toRaw(),
      index: idx,
      redeem,
      path: accountPath,
    });
    ledgerInputs.push(input);
  }

  console.log('ledgerInputs:')
  console.log(ledgerInputs);

  await bcoinApp.signTransaction(mtx, ledgerInputs);

  return mtx;
};
