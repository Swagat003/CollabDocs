import { Router } from "express";
import {ensureAuthenticity} from '../Middlewares/Auth.js';
import {getDocumentById, getAllDocuments, createDocument, updateDocument, deleteDocument} from '../Controllers/DocumentController.js';

const documentRouter = Router();

documentRouter.get('/', ensureAuthenticity, getAllDocuments);
documentRouter.get('/:id', ensureAuthenticity, getDocumentById);
documentRouter.post('/', ensureAuthenticity, createDocument);
documentRouter.put('/:id', ensureAuthenticity, updateDocument);
documentRouter.delete('/:id', ensureAuthenticity, deleteDocument);

export default documentRouter;
