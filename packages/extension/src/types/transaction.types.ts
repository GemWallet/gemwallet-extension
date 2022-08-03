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
