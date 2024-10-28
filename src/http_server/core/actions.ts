import { GAME_DB, WINNERS } from '../../DB/games';
import { ROOM_DB } from '../../DB/rooms';
import { USERS_DB } from '../../DB/users';
import {
  Coord,
  IncomingMessageRegistration,
  OutgoingMessageRegistration,
  OutgoingMessageCreateGame,
  IncomingMessageAddShips,
  IncomingMessageAttack,
  Ship,
  IncomingMessageAddToRoom,
  OutgoingMessageAttack,
} from '../entities/interface/message';
import { validateUser } from '../entities/validator';
import { createGrid, shot } from '../helpers/grid';

export class ActionResolver {
  static get rooms() {
    return Object.values(ROOM_DB);
  }
  static id = 1;

  static decrementId() {
    return ++this.id;
  }

  static register(mes: IncomingMessageRegistration, socketId: string): OutgoingMessageRegistration {
    const { name, password } = mes;

    const user = validateUser({ name, password }, this.decrementId());

    if (!user.error) {
      USERS_DB[socketId] = { name, password, index: user.index };
    }

    return user;
  }

  static addRoom(key: string) {
    const user = USERS_DB[key];
    const room = {
      roomId: user.index,
      roomUsers: [{ name: user.name, index: user.index }],
    };
    ROOM_DB[user.index] = room;
    return ActionResolver.rooms;
  }

  static addUserToRoom(
    data: IncomingMessageAddToRoom,
    userKey: string
  ): [OutgoingMessageCreateGame | null, string[]] {
    const ind = data.indexRoom;
    const room = ROOM_DB[ind];
    const user = USERS_DB[userKey];
    if (room) {
      if (room.roomUsers.some((u) => u.index === user.index) || room.roomUsers.length === 2) {
        return [null, []];
      }
      room.roomUsers.push({ name: user.name, index: user.index });

      const usersInGame = {
        [user.index]: [],
        [room.roomId]: [],
      };
      const u = ActionResolver.getCurrUsers(Object.keys(usersInGame));

      GAME_DB[room.roomId] = { idGame: room.roomId!, users: usersInGame, grid: {} };
      delete ROOM_DB[ind];
      return [GAME_DB[room.roomId!], u];
    } else {
      throw new Error('Room is undefined.');
    }
  }

  static addShips(data: IncomingMessageAddShips): [boolean, string[]] {
    try {
      const game = GAME_DB[data.gameId];
      game.users[data.indexPlayer] = data.ships;
      game.grid[data.indexPlayer] = createGrid(data.ships);
      const u = ActionResolver.getCurrUsers(Object.keys(game.users));
      if (Object.values(game.users).every((u) => u.length)) {
        return [true, u];
      }
      return [false, u];
    } catch {
      return [false, []];
    }
  }

  static attack(
    data: IncomingMessageAttack,
    random = false
  ): {
    res?: OutgoingMessageAttack;
    nextUser?: number;
    won?: boolean;
    u?: string[];
    arround?: Coord[];
  } {
    const game = GAME_DB[data.gameId];
    const secondUserKey: number = +Object.keys(game.users).find((k) => +k !== data.indexPlayer)!;
    const secondUser = game.grid[secondUserKey];

    const u = ActionResolver.getCurrUsers(Object.keys(game.users));

    let x = random ? Math.floor(Math.random() * 10) : data.x;
    let y = random ? Math.floor(Math.random() * 10) : data.y;


    while (
      random 
    ) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    }

    const [res, won, arround] = shot({ x, y }, secondUser);

    if (won) {
      const winUser = Object.values(USERS_DB).find((u) => u.index === data.indexPlayer)?.name || 'Andy-BOT';

      if (WINNERS[winUser]) {
        WINNERS[winUser].wins++;
      } else {
        WINNERS[winUser] = { name: winUser, wins: 1 };
      }
    }

    return {
      res: {
        position: {
          x,
          y,
        },
        currentPlayer: data.indexPlayer,
        status: res,
      },
      nextUser: secondUserKey,
      won,
      u,
      arround,
    };
  }

  static createSingleGame(socketId: string) {
    const user = USERS_DB[socketId];
    const game = {
      idGame: user.index,
      users: { [user.index]: [], [user.index]: [{} as Ship] },
      grid: { [user.index]: ()=> {}},
    };
    if (ROOM_DB[user.index]) {
      delete ROOM_DB[user.index];
    }
    return game;
  }

  static logout(id: string): void {
    const user = USERS_DB[id];
    if (user) {
      delete ROOM_DB[user.index];
      delete USERS_DB[id];
    }
  }

  private static getCurrUsers(ind: (string | number)[]): string[] {
    const res: string[] = [];
    Object.keys(USERS_DB).forEach((k) => {
      if (ind.includes(USERS_DB[k].index.toString())) {
        res.push(k);
      }
    });

    return res;
  }
}
