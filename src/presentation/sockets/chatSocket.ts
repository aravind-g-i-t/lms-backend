// import { Server, Socket } from "socket.io";
// import { ISendMessageUseCase } from "@application/IUseCases/message/ISendMessage";
// import { IMarkMessagesReadUseCase } from "@application/IUseCases/message/IMarkMessagesRead";
// import { SendMessageInput } from "@application/dtos/message/SendMessage";

// export const registerChatSocket = (
//     io: Server,
//     _sendMessageUseCase: ISendMessageUseCase,
//     _markReadUseCase: IMarkMessagesReadUseCase
// ) => {

//     io.on("connection", (socket: Socket) => {
//         console.log("Socket connected:", socket.id);

//         socket.on("join", (userId: string) => {
//             socket.join(userId);
//         });

//         socket.on("send_message", async (data:SendMessageInput) => {
//             try {

//                 const message = await _sendMessageUseCase.execute({
//                     conversationId: data.conversationId,
//                     courseId: data.courseId,
//                     senderId: data.senderId,
//                     receiverId: data.receiverId,
//                     senderRole: data.senderRole,
//                     content: data.content,
//                     attachments: data.attachments
//                 });

//                 // Emit message to receiver's room
//                 io.to(data.receiverId).emit("new_message", message);

//                 // Emit to sender (to update UI instantly)
//                 io.to(data.senderId).emit("message_sent", message);

//             } catch (error) {
//                 console.error("send_message error:", error);
//                 socket.emit("error_message", "Failed to send message");
//             }
//         });

//         // 3️⃣ MARK MESSAGES AS READ
//         socket.on("mark_read", async (data) => {
//             try {
//                 /*
//                 data = {
//                     conversationId,
//                     readerId,
//                     readerRole
//                 }
//                 */

//                 await _markReadUseCase.execute({
//                     conversationId: data.conversationId,
//                     readerRole: data.readerRole
//                 });

//                 // Inform the other side that messages were read
//                 io.to(data.readerId).emit("messages_read", {
//                     conversationId: data.conversationId,
//                     readerRole: data.readerRole
//                 });

//             } catch (error) {
//                 console.error("mark_read error:", error);
//             }
//         });

//         socket.on("disconnect", () => {
//             console.log("Socket disconnected:", socket.id);
//         });
//     });
// };
