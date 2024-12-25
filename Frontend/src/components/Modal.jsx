import React from 'react';
import './css/Modal.css';

const Modal = ({ isOpen, onClose, onAction, title, setTitle, actionText }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{actionText === 'Create' ? 'Create New Document' : 'Rename Document'}</h2>
        <input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onAction}>{actionText}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;