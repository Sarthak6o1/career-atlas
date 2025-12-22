import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ChatProvider } from './context/ChatContext.jsx'
import Workbench from './pages/Workbench.jsx'
import './styles/main.css'

function App() {
    return (
        <BrowserRouter>
            <ChatProvider>
                <Routes>
                    <Route path="/" element={<Workbench />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </ChatProvider>
        </BrowserRouter>
    )
}

export default App
