import { sha512 } from '@noble/hashes/sha512';

import * as ed from '@noble/ed25519';

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
/**
 * this function will take the private key XRPL format and format it to be used in the decryption process
 * the private key are
 */
/**
 * return the scalar private key from a private key
 *
 * @param privateKey - The private key XRPL format on ED25519, as an hex string
 *
 * @returns - the scalar private key as a bigint
 */
export function getScalarPrivateKeyED25519(privateKey: string): bigint {
  return ed.utils.getExtendedPublicKey(BigInt('0x' + privateKey).toString(16)).scalar;
}
