import DocumentModel from "../Models/document.js";
import mongoose from "mongoose";

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
        res.status(200).json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

export const getAllDocuments = async (req, res) => {
    try {
        const documents = await DocumentModel.find({ ownerId: req.user._id });
        res.status(200).json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

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
        await document.delete();
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}
