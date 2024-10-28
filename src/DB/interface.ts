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
    [key: number]: string[];
  };
  grid: {
    [key: number]: [][];
  };
}