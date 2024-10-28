import { WebSocketServer } from 'ws';
import 'dotenv/config';

const port: number = +process.env.PORT! || 4000;

const wsServer = new WebSocketServer({ port });

wsServer.on('listening', ()=> {});
wsServer.on('connection', ()=> {});
