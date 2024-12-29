import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/Document.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';



function Document() {
    const { id } = useParams();
    const [value, setValue] = useState('');
    const [title, setTitle] = useState('');
    const navigate = useNavigate();

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
            const url = `/api/documents/${id}`;
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
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const handleSave = () => {
        try {
            const url = `/api/documents/${id}`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, content: value })
            });
            toast.success('Document saved successfully');
        }
        catch (err) {
            console.error(err);
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
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { font-size: 24px; }
                        p { font-size: 14px; }
                        .ql-editor { margin: 1in !important; }
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
        // Implement share functionality
        console.log('Document shared');
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
                onChange={setValue}
                modules={{ toolbar: toolbarOptions }}
            />
            <ToastContainer />
        </>
    );
}

export default Document;