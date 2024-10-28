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
export interface IncomingMessageAddToRoom {
  indexRoom: number;
}
export interface OutgoingMessageCreateGame {
  idGame: number;
}
export interface AddToRoom {
  indexRoom: number;
}

export interface CreateGame {
  idGame: number;
  idPlayer: number;
}