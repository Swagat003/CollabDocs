import React, { useState } from 'react';
import './css/CollaboratorSidebar.css';
import { ToastContainer, toast } from 'react-toastify';

const CollaboratorSidebar = ({ isOpen, onClose, documentId, collaborators, addCollaborator, removeCollaborator }) => {
  const [email, setEmail] = useState('');

  const handleAddCollaborator = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (email.trim()) {
      addCollaborator(documentId, email);
      setEmail('');
    }
  };

  const handleRemoveCollaborator = (collaboratorId) => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeCollaborator(documentId, collaboratorId);
    }
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/document/${documentId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Link copied to clipboard');
    }).catch((err) => {
      console.error('Failed to copy link: ', err);
    });
  };

  return (
    <div className={isOpen ? 'collaborator-sidebar open' : 'collaborator-sidebar'}>
      <div className="sidebar-header">
        <h2>Collaborators</h2>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <div className="sidebar-content">
        <input
          type="email"
          placeholder="Enter collaborator's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className='add-collaborators-btn' onClick={handleAddCollaborator}>Add</button>
        <div className="collaborator-list">
          {collaborators && collaborators.length > 0 ? (
            collaborators.map((collaborator) => (

              <div key={collaborator._id || collaborator.email} className="collaborator-item">
                <div className='collaborator-email'> {collaborator.email} </div>
                <button onClick={handleRemoveCollaborator(collaborator._id)} className="remove-collaborator-btn">&times;</button>
              </div>

            ))
          ) : (
            <div className="no-collaborators">No collaborators added yet.</div>
          )}
        </div>
        <button className='copy-link-btn' onClick={handleCopyLink}>Copy Link</button>
      </div>
    </div>
  );
};

export default CollaboratorSidebar;