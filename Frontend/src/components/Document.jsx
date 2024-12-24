import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './css/Document.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



function Document() {
    const { id } = useParams();
    const [value, setValue] = useState('');
    const [title, setTitle] = useState('My Document');
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

    const handleSave = () => {
        // Implement save functionality
        console.log('Document saved');
    };

    const handleDownload = () => {
        // Implement download functionality
        console.log('Document downloaded');
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
                    <input
                        id='doc-title'
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        readOnly={true}
                    />
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
        </>
    );
}

export default Document;