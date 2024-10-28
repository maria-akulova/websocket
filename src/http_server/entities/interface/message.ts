import { Actions } from './common';

// IncomingMessage interfaces and types
export interface IncomingMessageRegistration {
  name: string;
  password: string;
}

export interface IncomingMessageAddToRoom {
  indexRoom: number;
}

export type IncomingMessageCreateRoom = '';

export interface IncomingMessageAddShips {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
}

export interface IncomingMessageAttack {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
}

export interface IncomingMessageRandomAttack {
  gameId: number;
  indexPlayer: number;
}

// OutgoingMessage interfaces and types
export interface OutgoingMessageRegistration {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
}

export interface OutgoingMessageCreateGame {
  idGame: number;
}

export interface OutgoingMessageStartGame {
  ships: Ship[];
  currentPlayerIndex: number;
}

export interface OutgoingMessageAttack {
  position: Coord;
  currentPlayer: number /* id of the player in the current game */;
  status: AttackStatus;
}

export interface OutgoingMessageTurn {
  currentPlayer: number;
}

// Other types and interfaces
export interface MessageTemplate<T = unknown> {
  type: Actions;
  data: T;
  id: 0;
}

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

export enum Cell {
  default,
  ship,
  empty,
  shot,
  kill,
}

export type Grid = Cell[][];
