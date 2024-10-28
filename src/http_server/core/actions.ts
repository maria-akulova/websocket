import { USERS_DB } from '../../DB/users';
import { IncomingMessageRegistration, OutgoingMessageRegistration } from '../entities/interface/message';
import { validateUser } from '../entities/validator';
export class ActionResolver {
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

  static logout(id: string): void {
    delete USERS_DB[id];
  }
}