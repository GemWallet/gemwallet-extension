export enum TransactionStatus {
  // waiting: waiting for a user interaction
  Waiting = 'WAITING',
  // pending: transaction is pending to be a success or rejected (in progress)
  Pending = 'PENDING',
  // success: transaction has been successful
  Success = 'SUCCESS',
  // rejected: transaction has been rejected
  Rejected = 'REJECTED'
}

export enum TransactionTypes {
  AccountDelete = 'AccountDelete',
  AccountSet = 'AccountSet',
  CheckCancel = 'CheckCancel',
  CheckCash = 'CheckCash',
  CheckCreate = 'CheckCreate',
  DepositPreauth = 'DepositPreauth',
  EscrowCancel = 'EscrowCancel',
  EscrowCreate = 'EscrowCreate',
  EscrowFinish = 'EscrowFinish',
  NFTokenAcceptOffer = 'NFTokenAcceptOffer',
  NFTokenBurn = 'NFTokenBurn',
  NFTokenCancelOffer = 'NFTokenCancelOffer',
  NFTokenCreateOffer = 'NFTokenCreateOffer',
  NFTokenMint = 'NFTokenMint',
  OfferCancel = 'OfferCancel',
  OfferCreate = 'OfferCreate',
  Payment = 'Payment',
  PaymentChannelClaim = 'PaymentChannelClaim',
  PaymentChannelCreate = 'PaymentChannelCreate',
  PaymentChannelFund = 'PaymentChannelFund',
  SetRegularKey = 'SetRegularKey',
  SignerListSet = 'SignerListSet',
  TicketCreate = 'TicketCreate',
  TrustSet = 'TrustSet'
}
