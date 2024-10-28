import { Actions } from './common';

export interface IncomingMessageRegistration {
  name: string;
  password: string;
}

export interface OutgoingMessageRegistration {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
}

export interface MessageTemplate<T = unknown> {
  type: Actions;
  data: T;
  id: 0;
}