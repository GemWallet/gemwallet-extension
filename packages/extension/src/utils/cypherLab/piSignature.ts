/*
  This TypeScript library is the exclusive property of Cypher Lab (https://www.cypherlab.fr/)
  and is exclusively reserved for the use of gemWallet. Any form of commercial use, including but
  not limited to selling, licensing, or generating revenue from this code, is strictly prohibited.
*/
function deSerializeRingPoints(ring: string[]): Point[] {
  try {
    const deSerializedPoints: Point[] = [];

    for (const point of ring) {
      console.log('Point: ', point);
      deSerializedPoints.push(Point.fromBase64(point)); // Call serializePoint() on each 'point' object
    }
    return deSerializedPoints;
  } catch (e) {
    console.log('Error: ', e);
  }
  return [];
}
import { getScalarPrivateKeyED25519 } from './privateKeyFormatting';
import { RingSignature, Point, Curve } from '@cypherlab/types-Ring-Signature-audit';
// the private key can be used directly no need to convert it to a scalar
function secp256k1Sign(privkey: string, ring: Point[], message: string, curve: Curve) {
  const privateKey = BigInt(privkey.slice(-64));
  /*if (
    partialSig.alpha === BigInt(0) ||
    partialSig.cpi === BigInt(0) ||
    privateKey === BigInt(0) ||
    partialSig.curve.N === BigInt(0)
  )
    throw new Error('Invalid parameters');*/
  return RingSignature.sign(ring, privateKey, message, curve);
}

// the private key must be converted to a scalar
function ed25519Sign(privkey: string, ring: Point[], message: string, curve: Curve) {
  const privateKey = getScalarPrivateKeyED25519(privkey);
  console.log('Private key: ', privateKey);
  console.log('Ring: ', ring);
  console.log('Message: ', message);
  console.log('Curve: ', curve);
  /*if (
    partialSig.alpha === BigInt(0) ||
    partialSig.cpi === BigInt(0) ||
    privateKey === BigInt(0) ||
    partialSig.curve.N === BigInt(0)
  )
    throw new Error('Invalid parameters');*/
  try {
    return RingSignature.sign(ring, privateKey, message, curve);
  } catch (e) {
    console.log('Error: ', e);
  }
}

/**
 * Make a ring signature from an encrypted partial ring-signature.
 *
 * @param cryptedPartialSign - The encrypted partial ring-signature.
 * @param privkey - The private key to decrypt and sign with.
 *
 * @returns The ring signature.
 */
export function sign(privkey: string, _ring: string[], message: string, _curve: string) {
  console.log('_ring: ', _ring);
  const privateKey = privkey.slice(-64);
  console.log('Git privatekey: ', privateKey);
  const curve = Curve.fromString(_curve);
  console.log('Git curve: ', curve);
  const ring = deSerializeRingPoints(_ring);
  console.log('Ring: ', ring);
  if (
    (privateKey.startsWith('ED') && curve.name !== 'ED25519') ||
    (privateKey.startsWith('00') && curve.name !== 'SECP256K1')
  ) {
    throw new Error('Invalid private key type');
  }

  switch (curve.name) {
    case 'ED25519':
      return ed25519Sign(privateKey, ring, message, curve)?.toBase64();
    case 'SECP256K1':
      return secp256k1Sign(privateKey, ring, message, curve).toBase64();
    default:
      throw new Error('Invalid curve');
  }
}
