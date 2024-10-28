import { USERS_DB } from '../../DB/users';
import { ROOM_DB } from '../../DB/rooms';

import { IncomingMessageRegistration, OutgoingMessageRegistration } from '../entities/interface/message';
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
    const user = { name: USERS_DB[key].name, index: USERS_DB[key].index };
    const room = {
      roomId: user.index,
      roomUsers: [
        {
          name: user.name,
          index: user.index,
        },
      ],
    };
    ROOM_DB[key] = room;
    return ActionResolver.rooms;
  }
}