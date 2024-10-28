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

export interface IncomingMessageAddShips {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
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

export type IncomingMessageCreateRoom = '';
export type CreateRoom = '';

export interface Ship {
  position: Coord;
  direction: boolean;
  length: number;
  type: ShipType;
}

type ShipType = 'small' | 'medium' | 'large' | 'huge';
export type AttackStatus = 'miss' | 'killed' | 'shot';

export type Coord = {
  x: number;
  y: number;
};

export interface IncomingMessageAttack {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
}

export interface AddShips {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
}

export interface StartGame {
  ships: Ship[];
  currentPlayerIndex: number;
}

export interface Ship {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: ShipType;
}

export interface OutgoingMessageStartGame {
  ships: Ship[];
  currentPlayerIndex: number;
}
