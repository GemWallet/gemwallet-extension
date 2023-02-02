export enum Message {
  RequestAddress = 'REQUEST_ADDRESS',
  RequestAddTrustline = 'REQUEST_ADD_TRUSTLINE',
  RequestConnection = 'REQUEST_CONNECTION',
  RequestNetwork = 'REQUEST_NETWORK',
  RequestPublicKey = 'REQUEST_PUBLIC_KEY',
  RequestSignMessage = 'REQUEST_SIGN_MESSAGE',
  ReceivePaymentHash = 'RECEIVE_PAYMENT_HASH',
  ReceiveTrustlineHash = 'RECEIVE_TRUSTLINE_HASH',
  ReceiveAddress = 'RECEIVE_ADDRESS',
  ReceiveNetwork = 'RECEIVE_NETWORK',
  ReceivePublicKey = 'RECEIVE_PUBLIC_KEY',
  ReceiveSignMessage = 'RECEIVE_SIGN_MESSAGE',
  SendPayment = 'SEND_PAYMENT',
  MsgRequest = 'GEM_WALLET_MSG_REQUEST',
  MsgResponse = 'GEM_WALLET_MSG_RESPONSE'
}
