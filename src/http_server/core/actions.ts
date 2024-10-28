import { USERS_DB } from '../../DB/users';
import { IncomingMessageRegistration, OutgoingMessageRegistration } from '../entities/interface/message';
import { validateUser } from '../entities/validator';
export class ActionResolver {
  
  static register(mes: IncomingMessageRegistration): OutgoingMessageRegistration {
    const { name, password } = mes;
    const user = validateUser({ name, password }, Number(USERS_DB.length));
    if (!user.error) {
      USERS_DB.push({name, password, index: user.index});
    }
    return user;
  }
}