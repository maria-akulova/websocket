import { Grid, Ship } from "../http_server/entities/interface/message";

export interface IUser {
  name: string;
  password:string;
  index: number;
}

export interface IRoom {
  roomId: number;
  roomUsers: Omit<IUser, 'password'>[];
}

export interface IGameMain {
  idGame: number;
  idPlayer: number;
}

export interface IWinner {
  name: string;
  wins: number;
}

export interface IGame {
  idGame: number;
  users: {
    [key: number]: Ship[];  };
  grid: {
    [key: number]: Grid;
  };
  
}

