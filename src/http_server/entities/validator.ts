import { USERS_DB } from '../../DB/users';
import { IncomingMessageRegistration, OutgoingMessageRegistration } from './interface/message';

export const validateUser = (
  data: IncomingMessageRegistration,
  index: number
): OutgoingMessageRegistration => {
  let error = false;
  let errorText = '';
  if (!data.name || typeof data.name !== 'string' || !data.password || typeof data.password !== 'string') {
    error = true;
    errorText = 'data is not valid';
  }
  if (Object.values(USERS_DB).some((u) => u.name === data.name)) {
    error = true;
    errorText = 'user with the same name exists';
  }
  return { name: data.name, error, errorText, index };
};
