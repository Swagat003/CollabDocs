import DocumentModel from "../Models/document.js";
import UserModel from "../Models/user.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await DocumentModel.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (document.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const collaboratorsEmails = await UserModel.find({ _id: { $in: document.collaborators } }).select('email');
        res.status(200).json({ ...document.toObject(), collaborators: collaboratorsEmails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getAllDocuments = async (req, res) => {
    try {
        const userId = req.user._id;
        const ownedDocuments = await DocumentModel.find({ ownerId: userId }).select('-collaborators');
        const sharedDocuments = await DocumentModel.find({ collaborators: userId }).select('-collaborators');

        const ownedDocumentsWithLabel = ownedDocuments.map(doc => ({
            ...doc.toObject(),
            isOwned: true
        }));

        const sharedDocumentsWithLabel = sharedDocuments.map(doc => ({
            ...doc.toObject(),
            isOwned: false
        }));

        const documents = [...ownedDocumentsWithLabel, ...sharedDocumentsWithLabel];
        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const createDocument = async (req, res) => {
    try {
        const createdDate = Date.now();
        const lastModifiedDate = Date.now();
        const document = new DocumentModel({
            ...req.body,
            createdDate,
            lastModifiedDate,
            ownerId: req.user._id,
        });
        await document.save();
        res.status(201).json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await DocumentModel.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (document.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        document.set(req.body);
        document.lastModifiedDate = Date.now();
        await document.save();
        res.status(200).json(document);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await DocumentModel.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        if (document.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await DocumentModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


export const addCollaborator = async (req, res) => {
    try {
        const { documentId, collaboratorEmail } = req.body;

        const collaborator = await UserModel.findOne({ email: collaboratorEmail });
        if (!collaborator) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }

        const document = await DocumentModel.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: "Document not found." });
        }

        if (document.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the owner can add collaborators." });
        }

        if (document.ownerId.toString() === collaborator._id.toString()) {
            return res.status(400).json({ message: "Owner is already a collaborator." });
        }

        if (document.collaborators.includes(collaborator._id)) {
            return res.status(400).json({ message: "User is already a collaborator." });
        }

        document.collaborators.push(collaborator._id);
        await document.save();

        res.status(200).json({ message: "Collaborator added successfully.", document });
    } catch (error) {
        console.error("Error adding collaborator:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const removeCollaborator = async (req, res) => {
    try {
        const { id, collaboratorId } = req.params;
        const document = await DocumentModel.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Document not found." });
        }

        if (document.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the owner can remove collaborators." });
        }

        if (document.ownerId.toString() === collaboratorId) {
            return res.status(400).json({ message: "Owner cannot be removed." });
        }

        const collaboratorIndex = document.collaborators.indexOf(collaboratorId);
        if (collaboratorIndex === -1) {
            return res.status(400).json({ message: "User is not a collaborator." });
        }

        document.collaborators.splice(collaboratorIndex, 1);
        await document.save();

        res.status(200).json({ message: "Collaborator removed successfully.", document });
    } catch (error) {
        console.error("Error removing collaborator:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};
