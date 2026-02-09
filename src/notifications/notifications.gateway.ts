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
  implements OnGatewayConnection {

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

      if (!payload || !payload.sub) 
        return client.disconnect();

      const roomName = `user_${payload.sub}`;
      client.join(roomName);

      console.log(`User ${payload.sub} joined room ${roomName}`);
    } catch {
      client.disconnect();
    }
  }

  sendNotification(userId: number, payload: any) {
    this.server.to(`user_${userId}`).emit('notification', payload);
  }

  broadcastMarkAsRead(userId: number, ids: number[]) {
    this.server.to(`user_${userId}`).emit('marked_as_read', {ids});
  }

  broadcastMarkAsAllRead(userId: number) {
    this.server.to(`user_${userId}`).emit('all_read');
  }
}
