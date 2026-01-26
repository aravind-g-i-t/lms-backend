import { Server, Socket } from "socket.io";
import http from "http";
import { UserRole } from "@domain/entities/Message";
import { MessageForListing } from "@application/dtos/message/GetConversations";
import { sendMessageUseCase, getUnreadMessagesCountUseCase, markMessagesReadUseCase } from "./container/shared/useCases";
import { presenceService } from "./container/shared/services";

// interface OnlineUser {
//     userId: string;
//     socketId: string;
//     userType: 'learner' | 'instructor';
// }

// type CallType= "audio"|"video";

export interface Attachment {
    id: string | null
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
}

interface MessageInput {
    content: string;
    attachments: Attachment[]
}

interface AuthenticatedSocket extends Socket {
    userId?: string;
    userType?: 'learner' | 'instructor';
}

export function initializeSockets(server: http.Server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        },
        pingTimeout: 60000,
        pingInterval: 25000
    });


    const userSockets = new Map<string, Set<string>>();
    // Track socket metadata: socketId -> user info
    const socketMetadata = new Map<string, { userId: string, userType: 'learner' | 'instructor' }>();

    io.use((socket: AuthenticatedSocket, next) => {
        // TODO: Validate token/session here
        next();
    });

    io.on("connection", (socket: AuthenticatedSocket) => {
        console.log("User connected", socket.id);

        socket.on("register", async ({ userId, userType }: { userId: string, userType: 'learner' | 'instructor' }) => {
            if (!userId || !userType) {
                socket.emit("error", { message: "userId and userType are required" });
                return;
            }

            // Check if user was previously offline
            // const wasOffline = !presenceService.isOnline(userId);

            // Store user info on socket
            socket.userId = userId;
            socket.userType = userType;

            // Join user's personal room
            socket.join(userId);

            // Add socket to user's socket set
            if (!userSockets.has(userId)) {
                userSockets.set(userId, new Set());
            }
            userSockets.get(userId)!.add(socket.id);

            // Store socket metadata
            socketMetadata.set(socket.id, { userId, userType });

            // Register connection in presence service
            presenceService.userConnected(userId);

            console.log(`${userType} ${userId} is now online (${userSockets.get(userId)!.size} connection(s))`);


            const unreadCount = await getUnreadMessagesCountUseCase.execute({
                role: userType,
                id: userId
            })

            console.log(userType, " unread messages:", unreadCount);


            io.to(userId).emit("unread_count", unreadCount)

            // Only emit status change if user wasn't online before
            // if (!presenceService.isOnline(userId)) {
                const eventName = userType === 'learner' ? 'learnerStatusChanged' : 'instructorStatusChanged';
                const userIdKey = userType === 'learner' ? 'learnerId' : 'instructorId';

                io.emit(eventName, {
                    [userIdKey]: userId,
                    isOnline: true,
                    timestamp: new Date()
                });
            // }

            // Send current online users to the newly connected user
            // const onlineUserIds = Array.from(userSockets.keys());
            // const onlineUsersList = onlineUserIds.map(uid => {
            //     const socketIds = userSockets.get(uid)!;
            //     const firstSocketId = Array.from(socketIds)[0];
            //     const metadata = socketMetadata.get(firstSocketId);
            //     return {
            //         userId: uid,
            //         userType: metadata?.userType
            //     };
            // });
            // socket.emit("onlineUsers", onlineUsersList);
        });

        socket.on("joinChat", (conversationId: string) => {
            if (!conversationId) {
                socket.emit("error", { message: "conversationId is required" });
                return;
            }
            socket.join(`chat:${conversationId}`);
            console.log(`User ${socket.userId} joined chat ${conversationId}`);
        });

        socket.on("leaveChat", (conversationId: string) => {
            socket.leave(`chat:${conversationId}`);
            console.log(`User ${socket.userId} left chat ${conversationId}`);
        });

        // socket.on("messageDeleted",({conversationId:string;receiver}))

        socket.on("sendMessage",
            async (
                data: { receiverId: string, conversationId?: string, courseId: string; message: MessageInput },
                ack?: (response: { success: boolean; error?: string; message?: MessageForListing, conversationId?: string }) => void) => {
                try {
                    console.log("message received on socket", data);

                    if (!socket.userId) {
                        console.log("User not registered");
                        ack?.({ success: false, error: "User not registered" });
                        return;
                    }

                    const result = await sendMessageUseCase.execute({
                        conversationId: data.conversationId!,
                        receiverId: data.receiverId,
                        senderId: socket.userId,
                        senderRole: socket.userType as UserRole,
                        content: data.message.content,
                        attachments: data.message.attachments,
                        courseId: data.courseId
                    });

                    if (!result.message) {
                        ack?.({ success: false, error: "Failed to save message" });
                        return;
                    }

                    ack?.({
                        success: true,
                        message: result.message,
                        conversationId: result.conversation.id as string
                    });

                    if (data.receiverId) {
                        console.log(result.conversation);

                        io.to([data.receiverId, socket.userId]).emit("conversationUpdated", {
                            conversation: result.conversation
                        });
                        io.to(data.receiverId).emit("new_message")
                    }



                    if (result.conversation.id) {
                        socket.to(`chat:${result.conversation.id}`).emit("receiveMessage", {
                            message: result.message,
                            senderId: socket.userId,
                            conversationId: data.conversationId,
                            timestamp: new Date()
                        });



                    } else {
                        socket.emit("error", { message: "Either receiverId or conversationId is required" });
                    }
                } catch (error) {
                    console.error("Error sending message:", error);
                    socket.emit("error", { message: "Failed to send message" });
                }
            }
        );

        socket.on(
            "markMessagesRead",
            async (
                data: { conversationId: string },
                ack?: (res: { success: boolean; error?: string }) => void
            ) => {
                try {
                    console.log("received markMessagesRead request");

                    if (!socket.userId || !socket.userType) {
                        ack?.({ success: false, error: "User not authenticated" });
                        return;
                    }

                    const { conversationId } = data;

                    await markMessagesReadUseCase.execute({
                        conversationId,
                        readerRole: socket.userType as UserRole
                    });

                    console.log("read status updated in db");

                    const unreadCount = await getUnreadMessagesCountUseCase.execute({
                        role: socket.userType,
                        id: socket.userId
                    })

                    io.to(socket.userId).emit("unread_count", unreadCount)

                    io.to(`chat:${data.conversationId}`).emit("messagesRead", {
                        conversationId,
                        readerId: socket.userId,
                        readAt: new Date()
                    });

                    console.log("messagesRead sent to chats");
                    ack?.({ success: true });
                } catch (error) {
                    console.error("markMessagesRead error:", error);
                    ack?.({ success: false, error: "Failed to mark messages as read" });
                }
            }
        );

        socket.on("typing", (data: { conversationId?: string, isTyping: boolean }) => {
            if (data.conversationId) {
                socket.to(`chat:${data.conversationId}`).emit("userTyping", {
                    userId: socket.userId,
                    isTyping: data.isTyping
                });
            }
        });

        socket.on("deleteMessage", (data: { conversationId?: string, messageIds: string[] }) => {
            if (data.conversationId) {
                socket.to(`chat:${data.conversationId}`).emit("messageDeleted", {
                    messageIds:data.messageIds
                });
            }
        });

        socket.on("disconnect", (reason) => {
            console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);

            const metadata = socketMetadata.get(socket.id);

            if (metadata) {
                const { userId, userType } = metadata;

                // Remove socket from user's socket set
                const sockets = userSockets.get(userId);
                if (sockets) {
                    sockets.delete(socket.id);

                    // If no more sockets for this user, remove from map
                    if (sockets.size === 0) {
                        userSockets.delete(userId);
                    }
                }

                // Clean up socket metadata
                socketMetadata.delete(socket.id);

                // Unregister from presence service
                presenceService.userDisconnected(userId);

                // Only emit status change if user is now completely offline
                if (!presenceService.isOnline(userId)) {
                    const eventName = userType === 'learner' ? 'learnerStatusChanged' : 'instructorStatusChanged';
                    const userIdKey = userType === 'learner' ? 'learnerId' : 'instructorId';

                    io.emit(eventName, {
                        [userIdKey]: userId,
                        isOnline: false,
                        timestamp: new Date()
                    });

                    console.log(`${userType} ${userId} went offline (all connections closed)`);
                } else {
                    console.log(`${userType} ${userId} still has ${userSockets.get(userId)?.size || 0} connection(s)`);
                }
            }
        });


        socket.on("startCall", ({ receiverId, conversationId, type }) => {
            console.log("Call initiated.", conversationId, receiverId, socket.userId);

            if (!socket.userId) return;
            if (!presenceService.isOnline(receiverId)) {
                console.log("User offline.");
                io.to(socket.userId).emit("callRejected", { reason: "User offline" })
                return
            }


            io.to(receiverId).emit("incomingCall", {
                conversationId,
                callerId: socket.userId,
                callerRole: socket.userType,
                type: type
            });
        });

        socket.on("acceptCall", ({ conversationId, callerId, type }) => {
            console.log("Acceptiong call.", socket.userId, callerId);
            io.to(callerId).emit("callAccepted", {
                conversationId,
                participantId: socket.userId,
                type

            });

            io.to(socket.userId!).emit("callAccepted", {
                conversationId,
                participantId: callerId,
                type
            });
        });


        socket.on("rejectCall", ({ callerId }) => {
            console.log("Rejecting call.");
            io.to(callerId).emit("callRejected");
        });

        socket.on("endCall", ({ participantId }) => {
            console.log("Ending Call", participantId, socket.userId);

            io.to(participantId).emit("callEnded");
        });

        socket.on(
            "startLiveSession",
            ({ sessionId, courseId }) => {
                if (!socket.userId || socket.userType !== "instructor") return;

                // Join instructor to session socket room
                socket.join(`live:${sessionId}`);

                // Notify learners (you likely already know enrolled learners via courseId)
                io.emit("liveSessionStarted", {
                    sessionId,
                    courseId,
                    startedAt: new Date(),
                });

                console.log("Live session started:", sessionId);
            }
        );

        socket.on(
            "joinLiveSession",
            ({ sessionId }) => {
                if (!socket.userId) return;

                socket.join(`live:${sessionId}`);

                io.to(`live:${sessionId}`).emit("liveSessionParticipantJoined", {
                    sessionId,
                    userId: socket.userId,
                    role: socket.userType,
                    joinedAt: new Date(),
                });

                console.log(
                    `${socket.userType} ${socket.userId} joined live session ${sessionId}`
                );
            }
        );

        socket.on(
            "endLiveSession",
            ({ sessionId }) => {
                if (!socket.userId || socket.userType !== "instructor") return;

                io.to(`live:${sessionId}`).emit("liveSessionEnded", {
                    sessionId,
                    endedAt: new Date(),
                });

                // Optional: remove everyone from socket room
                const room = io.sockets.adapter.rooms.get(`live:${sessionId}`);
                if (room) {
                    room.forEach(socketId => {
                        const s = io.sockets.sockets.get(socketId);
                        s?.leave(`live:${sessionId}`);
                    });
                }

                console.log("Live session ended:", sessionId);
            }
        );




        socket.on("error", (error) => {
            console.error(`Socket error for ${socket.id}:`, error);
        });
    });

    process.on('SIGTERM', () => {
        console.log('SIGTERM received, closing socket server...');
        io.close(() => {
            console.log('Socket server closed');
        });
    });

    return io;
}