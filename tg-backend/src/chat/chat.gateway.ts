// // src/chat/chat.gateway.ts
// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { Req, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
// import { MessageService } from 'src/modules/message/message.service';
// import { ApiBearerAuth } from '@nestjs/swagger';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// export class ChatGateway {
//   @WebSocketServer()
//   server: Server | undefined;

//   constructor(private readonly messageService: MessageService) {}

//   async handleConnection(@ConnectedSocket() client: Socket) {
//     console.log(`Client connected: ${client.id}`);
//   }

//   async handleDisconnect(@ConnectedSocket() client: Socket) {
//     console.log(`Client disconnected: ${client.id}`);
//   }

//   // Evento: Enviar uma mensagem
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @SubscribeMessage('sendMessage')
//   async handleMessage(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: { chatId: number; content: string },
//     @Req() req: AuthenticatedRequest,
//   ) {
//     const { chatId, content } = data;

//     const message = await this.messageService.sendMessage(
//       {
//         chatId,
//         content,
//       },
//       req.user.id,
//     );

//     if (this.server) {
//       this.server.to(`chat_${chatId}`).emit('receiveMessage', message);
//     }

//     return message;
//   }

//   @SubscribeMessage('joinChat')
//   async handleJoinChat(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() chatId: number,
//   ) {
//     client.join(`chat_${chatId}`);
//     console.log(`Client ${client.id} joined chat ${chatId}`);
//   }

//   // Evento: Sair de um chat
//   @SubscribeMessage('leaveChat')
//   async handleLeaveChat(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() chatId: number,
//   ) {
//     client.leave(`chat_${chatId}`);
//     console.log(`Client ${client.id} left chat ${chatId}`);
//   }
// }
