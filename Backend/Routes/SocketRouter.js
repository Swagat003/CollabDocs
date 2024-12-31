import DocumentModel from "../Models/document.js";
import UserModel from "../Models/user.js";

const socketRouter = (io) => {
    const userSocketMap = new Map();

    io.on("connection", (socket) => {
        const userId = socket.handshake.auth.userId;
        userSocketMap.set(userId, socket.id);

        socket.on("join-document", async (documentId) => {
            socket.join(documentId);

            const document = await DocumentModel.findById(documentId).populate('collaborators', 'email');
            if (document) {
                socket.emit("document-fetch", {
                    content: document.content,
                    title: document.title,
                    collaborators: await UserModel.find({ _id: { $in: document.collaborators } }).select('email')
                });
            }
        });

        socket.on("edit-document", async ({ content, title }) => {
            const documentId = socket.handshake.query.documentId;
            socket.to(documentId).emit("document-update", { content, title });
        });

        socket.on("update-collaborators", (collaborators) => {
            const documentId = socket.handshake.query.documentId;
            socket.to(documentId).emit("collaborators-update", collaborators);
        });

        socket.on("remove-collaborator", async (collaboratorId) => {
            const documentId = socket.handshake.query.documentId;
            const socketId = userSocketMap.get(collaboratorId);
            if (socketId) {
                io.to(socketId).emit("collaborator-removed");
                io.sockets.sockets.get(socketId).disconnect(true);
            }
            const document = await DocumentModel.findById(documentId).populate('collaborators', 'email');
            const updatedCollaborators = await UserModel.find({ _id: { $in: document.collaborators } }).select('email');

            io.to(documentId).emit("collaborators-update", updatedCollaborators);
            io.to(documentId).emit("reconnect-sockets");
        });

        socket.on("disconnect", () => {
            userSocketMap.delete(userId);
        });
    });
};

export default socketRouter;