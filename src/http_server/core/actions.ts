import { USERS_DB } from '../../DB/users';
import { ROOM_DB } from '../../DB/rooms';
import { GAME_DB } from '../../DB/games';


import { IncomingMessageAddShips, IncomingMessageAddToRoom, IncomingMessageRegistration, OutgoingMessageCreateGame, OutgoingMessageRegistration } from '../entities/interface/message';
import { validateUser } from '../entities/validator';
export class ActionResolver {
  static id = 1;

  static decrementId() {
    return ++this.id;
  }

  static get rooms() {
    return Object.values(ROOM_DB);
  }

  static register(mes: IncomingMessageRegistration, socketId: string): OutgoingMessageRegistration {
    const { name, password } = mes;
    const user = validateUser({ name, password }, this.decrementId());
    if (!user.error) {
      USERS_DB[socketId] = { name, password, index: user.index };
    }
    return user;
  }

  static logout(id: string): void {
    delete ROOM_DB[id];
  }

  static addRoom(key: string) {
    const user = USERS_DB[key];
    const room = {
      roomId: user.index,
      roomUsers: [user],

    };
    ROOM_DB[key] = room;
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
      delete ROOM_DB[ind];      delete ROOM_DB[ind];
      return [GAME_DB[room.roomId!], u];
    } else {
      throw new Error('Room is undefined.');
    }
  }
  static addShips(data: IncomingMessageAddShips): boolean {
    try {
      const game = GAME_DB[data.gameId];
      game.users[data.indexPlayer] = data.ships;
      console.log("🚀 ~ file: actions.ts:61 ~ ActionResolver ~ addShips ~ game.users:", game.users)
      if (Object.values(game.users).every(u => u.length)) {
        return true;
      }
      return false;
    } catch  {
      return false;
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