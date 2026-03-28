/* eslint-disable camelcase */
import { randomBytes } from '@noble/post-quantum/utils.js'
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js'
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js'
import { generateKeyPair } from '@stablelib/x25519'
import { encodeURLSafe } from '@stablelib/base64'

export const generateX25519 = () => {
    const kp = generateKeyPair()
    return {
        privateKey: encodeURLSafe(kp.secretKey).replace(/=/g, '').replace(/\n/g, ''),
        publicKey: encodeURLSafe(kp.publicKey).replace(/=/g, '').replace(/\n/g, '')
    }
}

export const generateMlDsa65 = () => {
    const seed = randomBytes(32)
    const kp = ml_dsa65.keygen(seed)
    return {
        mldsa65Verify: encodeURLSafe(kp.publicKey).replace(/=/g, '').replace(/\n/g, ''),
        mldsa65Seed: encodeURLSafe(seed).replace(/=/g, '').replace(/\n/g, '')
    }
}

export const generateMlKem768 = () => {
    const seed = randomBytes(64)
    const kp = ml_kem768.keygen(seed)
    return {
        mlkem768PublicKey: encodeURLSafe(kp.publicKey).replace(/=/g, '').replace(/\n/g, ''),
        mlkem768Seed: encodeURLSafe(seed).replace(/=/g, '').replace(/\n/g, '')
    }
}
