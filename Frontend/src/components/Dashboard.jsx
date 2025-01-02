import React from 'react';
import './css/Dashboard.css';
import { useState, useEffect , useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Modal from './Modal';


function Dashboard() {
  const env = import.meta.env;
  const navigate = useNavigate();
  const [Documents, setDocuments] = useState([]);
  const [menuVisible, setMenuVisible] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [modalAction, setModalAction] = useState('');
  const [currentDocId, setCurrentDocId] = useState(null);
  const menuRef = useRef(null);

  const checkTokenValidity = async () => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    } else {
      try {
        const url = `${env.VITE_BACKEND_URL}/api/auth/verify`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (!response.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
          throw new Error(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  const fetchDocuments = async () => {
    try {
      const url = `${env.VITE_BACKEND_URL}/api/documents`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    checkTokenValidity();
  },[]);

  useEffect(() => {
    fetchDocuments()
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);
  
  const toggleMenu = (id) => {
    setMenuVisible(menuVisible === id ? null : id);
  };

  const navigateToDocument = (id) => {
    navigate(`/document/${id}`);
  }

  const handleCreateNewDocument = async () => {
    if (!newTitle.trim()) {
      toast.error('Document title cannot be empty.');
      return;
    }

    try {
      const url = `${env.VITE_BACKEND_URL}/api/documents`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newTitle, content: ' ' })
      });

      const data = await response.json();
      console.log('Response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      setDocuments((prevDocs) => [...prevDocs, data]);
      setIsModalOpen(false);
      setNewTitle('');
      toast.success('Document created successfully!');
    } catch (err) {
      console.error('Error creating document:', err);
      toast.error('Failed to create document. Please try again.');
    }
  };


  const handleRenameDocument = async () => {
    try {
      const url = `${env.VITE_BACKEND_URL}/api/documents/${currentDocId}`;
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newTitle })
      });
      setDocuments(Documents.map(doc => doc._id === currentDocId ? { ...doc, title: newTitle } : doc));
      setIsModalOpen(false);
      setNewTitle('');
      setCurrentDocId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDocument = async (id) => {
    try {
      const url = `${env.VITE_BACKEND_URL}/api/documents/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(data.message);
      }
      setDocuments(Documents.filter(doc => doc._id !== id));
      toast.success('Document deleted successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete document. Please try again.');
    }
  };
  
  const handleDownloadDocument = async (id) => {
    try {
      const url = `${env.VITE_BACKEND_URL}/api/documents/${id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            const title = data.title;
            const content = data.content;
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${title}</title>
                        <link rel="stylesheet" href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css">
                        <style>
                            body { font-family: Arial, sans-serif; margin: 0; }
                            .print-wrapper { margin: 1in; }
                            h1 { font-size: 24px; }
                            p { font-size: 14px; }
                            .ql-editor { margin: 0 !important; }
                            @page { size: A4; margin: 0; }
                            @media print {
                                .print-wrapper { margin: 1in; }
                                * {
                                    -webkit-print-color-adjust: exact;
                                    print-color-adjust: exact;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="print-wrapper">
                            <div class="ql-editor">${value}</div>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 300);
      } catch (err) {
        console.error(err);
      }
  }

  const openCreateModal = () => {
    setModalAction('Create');
    setIsModalOpen(true);
  };

  const openRenameModal = (id, title) => {
    setCurrentDocId(id);
    setNewTitle(title);
    setModalAction('Rename');
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard">
      <button className="create-doc-btn" onClick={openCreateModal}>Create New Document</button>
      <div className="doc-grid">

        {Documents.map((doc) => (
          <div key={doc._id} className="doc-card" onClick={() => navigateToDocument(doc._id)}>
            <div className="doc-card-content">
              <p className="doc-content-preview">{doc.content ? doc.content.substring(0, 100) : 'No content available'}...</p>
              <div className="doc-card-footer">
                <div>
                  <h3>{doc.title}</h3>
                  <p className="doc-date">{new Date(doc.createdDate).toLocaleDateString()}</p>
                </div>
                <button className="menu-btn" onClick={(e) => { e.stopPropagation(); toggleMenu(doc._id); }}>
                  <i className="fas fa-ellipsis-v"></i>
                </button>
                {menuVisible === doc._id && (
                  <div ref={menuRef} className="menu-options" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => openRenameModal(doc._id, doc.title)}>Rename</button>
                    <button onClick={()=> handleDeleteDocument(doc._id)}>Delete</button>
                    <button onClick={() => handleDownloadDocument(doc._id)}>Download</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {setIsModalOpen(false); setNewTitle(''); setCurrentDocId(null);}}
        onAction={modalAction === 'Create' ? handleCreateNewDocument : handleRenameDocument}
        title={newTitle}
        setTitle={setNewTitle}
        actionText={modalAction}
      />
      <ToastContainer />
    </div>
  );
}

export default Dashboard;