import WebSocket from 'ws';
import http from 'http';
import { hostname } from 'os';
import { incomingParser } from '../helpers/parsers';
import { IncomingMessageRegistration, MessageTemplate } from '../entities/interface/message';
import { Actions } from '../entities/interface/common';
import { ActionResolver } from './actions';

export const connections = new Map();

export function onConnect(wsClient: WebSocket, req: http.IncomingMessage) {
  const key = req.headers['sec-websocket-key'] as string;
  console.log('new user connected ', key);
  connections.set(key, wsClient);

  wsClient.on('message', (message: Buffer) => {
    const inc = incomingParser(message) as MessageTemplate;
    console.log(`recieved ${inc.type} from ${key}`);
    switch (inc.type) {
      case Actions.reg:
        ActionResolver.register(inc.data as IncomingMessageRegistration, key);
        break;

      
      default:
        break;
    }
  });

  wsClient.on('close', () => {
    wsClient.close();
    connections.delete(key);
    ActionResolver.logout(key);
    
    console.log('user disconnected ', key);
  });
}

export function onListen() {
  console.log(`WebSocket listening on localhost:${process.env.PORT}, os hostName: ${hostname()}`);
}

process.on('SIGINT', () => {
  connections.forEach((c) => {
    c.close();
  });
  process.exit();
});
