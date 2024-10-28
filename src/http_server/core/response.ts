import WebSocket from 'ws';
import { ActionResolver } from './actions';
import {
  IncomingMessageAddShips,
  IncomingMessageAddToRoom,
  IncomingMessageAttack,
  IncomingMessageCreateRoom,
  IncomingMessageRegistration,
  MessageTemplate,
} from '../entities/interface/message';
import { incomingParser, outgoingParser } from '../helpers/parsers';
import { Actions } from '../entities/interface/common';
import { connections } from './wsHandler';
import { WINNERS } from '../../DB/games';
import { getUsersShips } from '../helpers/getters';
import { USERS_DB } from '../../DB/users';
import { BOT_INDEX_PLUS } from '../entities/constants';

export const reg = (ws: WebSocket, message: Buffer, key: string): void => {
  const inc = incomingParser(message) as MessageTemplate<IncomingMessageRegistration>;
  const res = ActionResolver.register(inc.data as IncomingMessageRegistration, key);

  ws.send(outgoingParser({ type: inc.type, id: inc.id, data: JSON.stringify(res) }));
  ws.send(outgoingParser({ type: Actions.u_room, id: inc.id, data: JSON.stringify(ActionResolver.rooms) }));
  ws.send(
    outgoingParser({
      type: Actions.u_winners,
      id: inc.id,
      data: JSON.stringify(Object.values(WINNERS)),
    })
  );
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
  const [res, u] = ActionResolver.addUserToRoom(inc.data as IncomingMessageAddToRoom, key);
  if (!res) {
    return;
  }
  connections.forEach((c) => {
    c.send(outgoingParser({ type: Actions.u_room, id: inc.id, data: JSON.stringify(ActionResolver.rooms) }));
  });
  u.forEach((k) => {
    connections.get(k).send(
      outgoingParser({
        type: Actions.c_game,
        id: inc.id,
        data: JSON.stringify({ ...res, idPlayer: USERS_DB[k].index }),
      })
    );
  });
};

export const addShips = (ws: WebSocket, message: Buffer, key: string): void => {
  const inc = incomingParser(message) as MessageTemplate<IncomingMessageAddShips>;
  const [full, keys] = ActionResolver.addShips(inc.data);
  if (full) {
    keys.forEach((sId) => {
      const data = getUsersShips(inc.data.gameId, sId, key);
      connections
        .get(sId)
        .send(outgoingParser({ type: Actions.s_game, id: inc.id, data: JSON.stringify(data) }));
      connections.get(sId).send(
        outgoingParser({
          type: Actions.turn,
          id: inc.id,
          data: JSON.stringify({ currentPlayer: data.currentPlayerIndex }),
        })
      );
    });
  }
};

export const attack = (ws: WebSocket, message: Buffer, key: string, random = false): void => {
  const inc = incomingParser(message) as MessageTemplate<IncomingMessageAttack>;
  const { res, nextUser, won, u, arround } = ActionResolver.attack(inc.data, random);
  if (!res) {
    return;
  }
  u?.forEach((c) => {
    connections.get(c).send(outgoingParser({ type: Actions.attack, id: inc.id, data: JSON.stringify(res) }));
    if (res?.status === 'miss') {
      connections.get(c).send(
        outgoingParser({
          type: Actions.turn,
          id: inc.id,
          data: JSON.stringify({ currentPlayer: nextUser }),
        })
      );
    } else {
      //const nextUser = inc.data.indexPlayer;
      connections.get(c).send(
        outgoingParser({
          type: Actions.turn,
          id: inc.id,
          data: JSON.stringify({ currentPlayer: inc.data.indexPlayer }),
        })
      );

      arround?.forEach((coordinates) => {
        connections.get(c).send(
          outgoingParser({
            type: Actions.attack,
            id: inc.id,
            data: JSON.stringify({
              position: coordinates,
              currentPlayer: inc.data.indexPlayer,
              status: 'miss',
            }),
          })
        );
      });
    }
    if (won) {
      connections.get(c).send(
        outgoingParser({
          type: Actions.finish,
          id: inc.id,
          data: JSON.stringify({ winPlayer: res?.currentPlayer }),
        })
      );
    }
  });
  if (won) {
    connections.forEach((c) => {
      c.send(
        outgoingParser({
          type: Actions.u_winners,
          id: inc.id,
          data: JSON.stringify(Object.values(WINNERS)),
        })
      );
    });
  }

  // if bot attack
  if (nextUser! - BOT_INDEX_PLUS > 0) {
    console.log('BOT ATTACK');
    const mess: IncomingMessageAttack = {
      ...inc.data,
      indexPlayer: nextUser!,
    };
    attack(
      ws,
      outgoingParser({ type: Actions.attack, id: inc.id, data: JSON.stringify(mess) }) as unknown as Buffer,
      key,
      true
    );
  }
};

export const sPlay = (ws: WebSocket, message: Buffer, key: string): void => {
  const inc = incomingParser(message) as MessageTemplate<IncomingMessageCreateRoom>;
  const res = ActionResolver.createSingleGame(key);
  connections.forEach((c) => {
    c.send(outgoingParser({ type: Actions.u_room, id: inc.id, data: JSON.stringify(ActionResolver.rooms) }));
  });

  ws.send(
    outgoingParser({
      type: Actions.c_game,
      id: inc.id,
      data: JSON.stringify({ ...res, idPlayer: USERS_DB[key].index }),
    })
  );
};
