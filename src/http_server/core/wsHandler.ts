import WebSocket from 'ws';
import { incomingParser, outgoingParser } from '../helpers/parsers';
import {IncomingMessageRegistration , MessageTemplate } from '../entities/interface/message';
import { Actions } from '../entities/interface/common';
import { ActionResolver } from './actions';
export function onConnect(wsClient: WebSocket) {
  console.log('new user connected');
  wsClient.on('message', (message: Buffer) => {
    const inc = incomingParser(message) as MessageTemplate;
    let res;
    switch (inc.type) {
      case Actions.reg:
        res = ActionResolver.register(inc.data as IncomingMessageRegistration);
        break;
      default:
        break;
    }
    const out = outgoingParser({ type: inc.type, id: inc.id, data: JSON.stringify(res) });
    wsClient.send(out);
  });
  wsClient.on('close', () => {
    console.log('user disconnected');
  });
}
export function onOpen() {
  console.log('socket opened');
}