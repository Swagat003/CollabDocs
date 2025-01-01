import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/Document.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import io from 'socket.io-client';
import CollaboratorSidebar from './CollaboratorSidebar';


function Document() {
    const env = import.meta.env;
    const { id } = useParams();
    const [value, setValue] = useState('');
    const [title, setTitle] = useState('');
    const [collaborators, setCollaborators] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const navigate = useNavigate();


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

    useEffect(() => {
        checkTokenValidity();
    }, []);

    const socket = useMemo(() => io(`${env.VITE_BACKEND_URL}`, {
        auth: {
            token: localStorage.getItem('token'),
        },
        query: {
            documentId: id,
        },
    }), [id]);

    const toolbarOptions = [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        ['link', 'blockquote', 'code-block'],
        ['clean']
    ];

    const fetchDocument = async () => {
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
            setValue(data.content);
            setTitle(data.title);
            setCollaborators(data.collaborators);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const setupSocket = useCallback(() => {
        socket.emit('join-document', id);

        socket.on('document-fetch', ({ content, title, collaborators }) => {
            setValue(content);
            setTitle(title);
            setCollaborators(collaborators);
        });

        socket.on('document-update', ({ content, title }) => {
            setValue(content);
            setTitle(title);
        });

        socket.on('collaborators-update', (updatedCollaborators) => {
            setCollaborators(updatedCollaborators);
        });

        socket.on('collaborator-removed', () => {
            socket.disconnect();
            toast.error('You have been removed as a collaborator');
            navigate('/');
        });
        
        socket.on('reconnect-sockets', () => {
            socket.disconnect();
            setTimeout(() => {
                socket.connect();
                setupSocket();
            }, 1000);
        });

        return () => {
            socket.off('document-fetch');
            socket.off('document-update');
            socket.off('collaborators-update');
            socket.off('collaborator-removed');
            socket.off('reconnect-sockets');
            socket.disconnect();
        };
    }, [id, socket, navigate]);

    useEffect(() => {
        setupSocket();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setupSocket();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [setupSocket]);


    const handleContentChange = (newContent) => {
        setValue(newContent);
        socket.emit('edit-document', { content: newContent, title });
    };

    const handleSave = async () => {
        try {
            const url = `${env.VITE_BACKEND_URL}/api/documents/${id}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, content: value })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            toast.success('Document saved successfully');
        }
        catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    };

    const handleDownload = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <link rel="stylesheet" href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css">
                    <style>
                        body { font-family: Arial, sans-serif;}
                        h1 { font-size: 24px; }
                        p { font-size: 14px; }
                        .ql-editor { margin: 1in !important; }
                        @page { size: A4; margin: 1in; }
                        @media print {
                            * {
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="ql-editor">${value}</div>
                </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 300);
    };

    const handleShare = () => {
        setIsSidebarOpen(true);
    };

    const onClose = () => {
        setIsSidebarOpen(false);
    };


    const addCollaborator = async (documentId, email) => {
        try {
            const url = `${env.VITE_BACKEND_URL}/api/documents/${id}/collaborator`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ documentId, collaboratorEmail: email })
            });
            const data = await response.json();
            if (response.ok) {
                const url = `${env.VITE_BACKEND_URL}/api/documents/${id}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                const updatedCollaborators = data.collaborators;
                setCollaborators(updatedCollaborators);
                socket.emit('update-collaborators', updatedCollaborators);
                toast.success('Collaborator added successfully');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to add collaborator');
        }
    };

    const removeCollaborator = async (documentId, collaboratorId) => {
        try {
            const url = `${env.VITE_BACKEND_URL}/api/documents/${id}/collaborator/${collaboratorId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                const url = `${env.VITE_BACKEND_URL}/api/documents/${id}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                const updatedCollaborators = data.collaborators;
                setCollaborators(updatedCollaborators);
                socket.emit('update-collaborators', updatedCollaborators);
                socket.emit('remove-collaborator', collaboratorId);
                toast.success('Collaborator removed successfully');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to remove collaborator');
        }
    };

    return (
        <>
            <div className="menu-bar">
                <div className="menu-section left">
                    <button id='back-btn' onClick={() => navigate(-1)}><i className="fas fa-arrow-left"></i></button>
                    <div id='doc-title'>{title}</div>
                </div>
                <div className="menu-section right">
                    <button className='menus' onClick={handleSave}>Save</button>
                    <button className='menus' onClick={handleDownload}>Download</button>
                    <button className='menus' id="share-btn" onClick={handleShare}>Share</button>
                </div>
            </div>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={handleContentChange}
                modules={{ toolbar: toolbarOptions }}
            />
            <CollaboratorSidebar
                isOpen={isSidebarOpen}
                onClose={() => onClose()}
                documentId={id}
                collaborators={collaborators}
                addCollaborator={addCollaborator}
                removeCollaborator={removeCollaborator}
            />
            <ToastContainer />
        </>
    );
}

export default Document;