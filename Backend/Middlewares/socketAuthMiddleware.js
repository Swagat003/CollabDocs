import jwt from "jsonwebtoken";
import DocumentModel from "../Models/document.js";

const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        const documentId = socket.handshake.query.documentId;

        if (!token) {
            return next(new Error("Authentication token is required."));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const document = await DocumentModel.findById(documentId);

        if (!document) {
            return next(new Error("Document not found."));
        }

        const isOwner = document.ownerId.toString() === userId;
        const isCollaborator = document.collaborators.some(
            (collaboratorId) => collaboratorId.toString() === userId
        );

        if (!isOwner && !isCollaborator) {
            return next(new Error("You do not have permission to access this document."));
        }

        socket.user = { id: userId, isOwner };
        socket.documentId = documentId;

        next();
    } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error("Invalid or expired token."));
    }
};

export default socketAuthMiddleware;
