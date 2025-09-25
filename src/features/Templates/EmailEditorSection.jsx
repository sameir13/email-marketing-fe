'use client';
import React, { useState, useRef } from 'react';
import EmailEditor from 'react-email-editor';

function EmailEditorSection() {
    const emailEditorRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const exportHtml = () => {
        const unlayer = emailEditorRef.current?.editor;
        
        unlayer?.exportHtml((data) => {
            const { design, html } = data;
            console.log('Design JSON:', design);
            console.log('HTML:', html);
        });
    };

    const saveDesign = () => {
        const unlayer = emailEditorRef.current?.editor;
        
        unlayer?.saveDesign((design) => {
            console.log('Saved design:', design);
        });
    };

    const loadDesign = () => {
        const unlayer = emailEditorRef.current?.editor;
        
        const savedDesign = {}; 
        unlayer?.loadDesign(savedDesign);
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex gap-2 p-4 border-b">
                <button
                    onClick={exportHtml}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    Export HTML
                </button>
                <button
                    onClick={saveDesign}
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                    disabled={loading}
                >
                    Save Design
                </button>
                <button
                    onClick={loadDesign}
                    className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                    disabled={loading}
                >
                    Load Design
                </button>
            </div>
            
            <div className="flex-1">
                <EmailEditor
                    ref={emailEditorRef}
                    onLoad={() => {
                        setLoading(false);
                        console.log('Email editor loaded');
                    }}
                    onReady={() => {
                        console.log('Email editor ready');
                    }}
                    options={{
                        displayMode: 'email',
                        locale: 'en-US',
                    }}
                    tools={{
                        form: {
                            enabled: true
                        }
                    }}
                    appearance={{
                        theme: 'light',
                        panels: {
                            tools: {
                                dock: 'left'
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default EmailEditorSection;
