import React from 'react';
import './css/Dashboard.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Dashboard() {

  const [Documents, setDocuments] = useState([]);
  const [menuVisible, setMenuVisible] = useState(null);

  const fetchDocuments = async () => {
    try {
      const url = '/api/documents';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, []);

  const toggleMenu = (id) => {
    setMenuVisible(menuVisible === id ? null : id);
  };

  const navigateToDocument = (id) => {
    navigate(`/document/${id}`);
  }

  return (
    <div className="dashboard">
      <button className="create-doc-btn">Create New Document</button>
      <div className="doc-grid">

        {Documents.map((doc) => (
          <div key={doc._id} className="doc-card" onClick={() => navigateToDocument(doc._id)}>
          <div className="doc-card-content">
            <p className="doc-content-preview">{doc.content.substring(0, 100)}...</p>
            <div className="doc-card-footer">
              <div>
                <h3>{doc.title}</h3>
                <p className="doc-date">{new Date(doc.createdDate).toLocaleDateString()}</p>
              </div>
              <button className="menu-btn" onClick={() => toggleMenu(doc._id)}>
                <i className="fas fa-ellipsis-v"></i>
              </button>
              {menuVisible === doc._id && (
                <div className="menu-options">
                  <button>Edit</button>
                  <button>Delete</button>
                  <button>Share</button>
                  <button>Download</button>
                </div>
              )}
            </div>
          </div>
        </div>
        ))}

      </div>
    </div>
  );
}

export default Dashboard;