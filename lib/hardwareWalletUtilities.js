import { Script } from 'bcoin';
import TX from 'bcoin/lib/primitives/tx';
import MTX from 'bcoin/lib/primitives/mtx';
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
export const buildBIP44PathByAccount = account => `m/44'/${account}'/0'`;

export const signTX = async (bcoinApp, accountPath, proposalMTX) => {
  const publicKey = await bcoinApp.getPublicKey(accountPath);
  const { tx, scripts, paths } = proposalMTX;
  // TODO: how do you know which index to use?
  const index = paths[0].index;
  const transaction = new TX(tx).toRaw();
  // TODO: bledger needs to accept buffers
  //const redeem = Script.fromRaw(Buffer.from(scripts[0].data));
  const redeem = Buffer.from(scripts[0].data);

  // maybe need to iterate?
  const ledgerInput = new LedgerTXInput({
    tx: transaction,
    index,
    redeem,
    path: accountPath,
    publicKey: publicKey.publicKey
  });

  const mtx = new MTX(tx);

  await bcoinApp.signTransaction(mtx, [ledgerInput]);

  return mtx;
};
