import { LedgerBcoin, U2F } from 'bledger/lib/bledger-browser';
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

export const buildBIP44PathByAccount = (account) => {
    return `m/44'/${account}'/0'`;
}
