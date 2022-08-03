import { MessagingResponse } from '../types/message.types';

export interface Payment {
  // 	The amount of currency to deliver (in drops)
  amount: string;
  // The unique address of the account receiving the payment
  destination: string;
}

export interface PaymentResponseHash {
  hash: string;
  error: never;
}

export interface PaymentResponseError {
  hash: never;
  error: string;
}

export type PaymentResponse =
  | (MessagingResponse & PaymentResponseHash)
  | (MessagingResponse & PaymentResponseError);
