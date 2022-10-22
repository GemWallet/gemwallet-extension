# getPublicKey

## Introduction

![](../../img/cryptographic-keys.svg)

As the publicKey contains the address as well, `getPublicKey` returns the `public key` as well as the `address`.

## API

### Parameters

The `getPublicKey` method doesn't take any parameters.

### Returns

The `getPublicKey` method returns public key as well as the classic address.

The following values can be returned

- {publicKey: string, address: string}
- null: user refused the authorization
- undefined: something went wrong
