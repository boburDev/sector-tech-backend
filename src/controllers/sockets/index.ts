import { Server, Socket } from "socket.io";

const userStatusMap = new Map<string, boolean>();

export default function registerSocketHandlers(socket: Socket, io: Server) {
    const clientIP = socket.handshake.address;
    const roomId = `room-${clientIP}`;

    socket.join(roomId);
    userStatusMap.set(roomId, true);

    console.log(`🟢 Room ochildi: ${roomId}`);
    console.log(`🔗 ${socket.id} joined ${roomId}`);

    // Admin yoki serverga habar berish: yangi xona ochildi
    io.emit("room:created", { roomId });

    socket.on("chat:message", (data) => {
        console.log(`📨 [${roomId}] Message:`, data);

        // Message to room only
        io.to(roomId).emit("chat:message", {
            from: clientIP,
            data
        });
    });

    socket.on("chat:reply", ({ toRoomId, data }) => {
        // Masalan admindan yuborilgan reply
        console.log(`📤 Reply from admin to ${toRoomId}:`, data);
        io.to(toRoomId).emit("chat:reply", {
            from: "admin",
            data
        });
    });

    socket.on("disconnect", () => {
        userStatusMap.set(roomId, false);
        console.log(`🔴 ${socket.id} disconnected from ${roomId}`);

        io.emit("room:status", { roomId, online: false });
    });

    // Online statusni yuborish
    io.emit("room:status", { roomId, online: true });
}

// socket.on("room:created", ({ roomId }) => {
//     console.log("🆕 Room created:", roomId);
// });

// socket.on("room:status", ({ roomId, online }) => {
//     console.log(`ℹ️ Room ${roomId} is now ${online ? "🟢 ONLINE" : "🔴 OFFLINE"}`);
// });

// socket.emit("chat:reply", {
//     toRoomId: "room-192.168.1.123",
//     data: {
//         text: "Admin salomi!"
//     }
// });
