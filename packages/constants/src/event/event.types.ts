import { Payment } from '../payment/payment.types';
import { GEM_WALLET } from '../global/global.constant';
import { Message } from '../message/message.constant';

// Event listeners
interface MessageEventData {
  app: typeof GEM_WALLET;
  type: Message;
  source: Message;
  messageId: number;
  // Not all the MessageEventData have a payload
  payload?: any;
}

export interface NetworkEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.RequestNetwork;
    source: Message.MsgRequest;
    messageId: number;
  };
}

export interface AddressEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.RequestAddress;
    source: Message.MsgRequest;
    messageId: number;
    payload: {
      url: string;
      title: string;
      favicon: string | null | undefined;
    };
  };
}

export interface PublicKeyEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.RequestPublicKey;
    source: Message.MsgRequest;
    messageId: number;
    payload: {
      url: string;
      title: string;
      favicon: string | null | undefined;
    };
  };
}

export interface SignMessageListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.RequestSignMessage;
    source: Message.MsgRequest;
    messageId: number;
    payload: {
      url: string;
      title: string;
      favicon: string | null | undefined;
      message: string;
    };
  };
}

export interface PaymentEventListener extends MessageEvent<MessageEventData> {
  data: {
    app: typeof GEM_WALLET;
    type: Message.SendPayment;
    source: Message.MsgRequest;
    messageId: number;
    payload: Payment;
  };
}

export type EventListener =
  | NetworkEventListener
  | AddressEventListener
  | PublicKeyEventListener
  | PaymentEventListener
  | SignMessageListener;
