import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    lastModifiedDate: {
        type: Date,
        default: Date.now,
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
})

const DocumentModel = mongoose.model('Document', documentSchema);
export default DocumentModel;