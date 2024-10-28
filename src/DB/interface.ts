import { Grid, Ship } from '../http_server/entities/interface/message';

export interface IUser {
  name: string;
  index: number;
  password: string;
}

export interface IRoom {
  roomId: number;
  roomUsers: Omit<IUser, 'password'>[];
}

export interface IGame {
  idGame: number;
  users: {
    [key: number]: Ship[];
  };
  grid: {
    [key: number]: Grid;
  };
}

export interface IWinner {
  name: string;
  wins: number;
}
