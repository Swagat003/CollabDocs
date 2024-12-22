import React from 'react';
import './css/Dashboard.css';

function Dashboard() {
  const documents = [
    { id: 1, title: 'Document 1' },
    { id: 2, title: 'Document 2' },
    { id: 3, title: 'Document 3' },
    // Add more documents as needed
  ];

  return (
    <div className="dashboard">
      <button className="create-doc-btn">Create New Document</button>
      <div className="doc-grid">

        {documents.map((doc) => (
          <div key={doc.id} className="doc-card">
            <div className="doc-card-content">
              <h3>{doc.title}</h3>
              <button className="menu-btn">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}

export default Dashboard;