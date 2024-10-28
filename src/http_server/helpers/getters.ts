import { GAME_DB } from '../../DB/games';
import { USERS_DB } from '../../DB/users';
import { OutgoingMessageStartGame } from '../entities/interface/message';

export function getUsersShips(gameId: number, sId: string, key: string): OutgoingMessageStartGame {
  const game = GAME_DB[gameId];
  const user = USERS_DB[sId];
  const keyUser = USERS_DB[key];
  const res = {
    currentPlayerIndex: keyUser.index,
    ships: game.users[user.index],
  };
  return res;
}
