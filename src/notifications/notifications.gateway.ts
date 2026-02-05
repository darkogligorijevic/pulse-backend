import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<number, string>();

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

      this.onlineUsers.set(payload.sub, client.id);

      console.log(`User ${payload.sub} connected`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  sendNotification(userId: number, payload: any) {
    const socketId = this.onlineUsers.get(userId);
    if (!socketId) return;

    this.server.to(socketId).emit('notification', payload);
  }
}
