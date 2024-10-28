import WebSocket from 'ws';
import { ActionResolver } from './actions';
import {  IncomingMessageAddShips, IncomingMessageAddToRoom, IncomingMessageCreateRoom, IncomingMessageRegistration, MessageTemplate, OutgoingMessageCreateGame } from '../entities/interface/message';
import { incomingParser, outgoingParser } from '../helpers/parsers';
import { Actions } from '../entities/interface/common';
import { connections } from './wsHandler';
import { getUsersShips } from '../helpers/getters';

export const reg = (ws: WebSocket, message: Buffer, key: string): void => {
  const inc = incomingParser(message) as MessageTemplate<IncomingMessageRegistration>;
  const res = ActionResolver.register(inc.data as IncomingMessageRegistration, key);
  ws.send(outgoingParser({ type: inc.type, id: inc.id, data: JSON.stringify(res) }));
  ws.send(outgoingParser({ type: Actions.u_room, id: inc.id, data: JSON.stringify(ActionResolver.rooms) }));
};
export const createRoom = (ws: WebSocket, message: Buffer, key: string): void => {
  const inc = incomingParser(message) as MessageTemplate<IncomingMessageCreateRoom>;
  const res = ActionResolver.addRoom(key);
  connections.forEach((c) => {
    c.send(outgoingParser({ type: Actions.u_room, id: inc.id, data: JSON.stringify(res) }));
  });
};
export const addToRoom = (ws: WebSocket, message: Buffer, key: string): void => {
  const inc = incomingParser(message) as MessageTemplate<IncomingMessageAddToRoom>;
  const res = ActionResolver.addUserToRoom(
    inc.data as IncomingMessageAddToRoom,
    key
  ) as unknown as OutgoingMessageCreateGame;
  if (!res) {
    return;
  }
  let i: number = 1;

  connections.forEach((c) => {
    c.send(
      outgoingParser({ type: Actions.u_room, id: inc.id, data: JSON.stringify({ ...res, idPlayer: i + 1 }) })
    );
    c.send(
      outgoingParser({ type: Actions.c_game, id: inc.id, data: JSON.stringify({ ...res, idPlayer: i + 1 }) })
    );
    i++;
  });
};
export const addShips = (ws: WebSocket, message: Buffer, key: string): void => {
const inc = incomingParser(message) as MessageTemplate<IncomingMessageAddShips>;
  const res = ActionResolver.addShips(inc.data);
  if (res) {
    connections.forEach((c, sId) => {
      const data = getUsersShips(inc.data.gameId, sId, key);
      c.send(outgoingParser({ type: Actions.s_game, id: inc.id, data: JSON.stringify(data) }));
    });
  }
};
