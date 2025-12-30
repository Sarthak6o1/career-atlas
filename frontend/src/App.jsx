import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ChatProvider } from './context/ChatContext.jsx'
import Workbench from './pages/Workbench.jsx'
import Auth from './pages/Auth.jsx'
import { isAuthenticated } from './services/authService'
import './styles/main.css'

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <ChatProvider>
                <Routes>
                    <Route path="/login" element={<Auth />} />
                    <Route
                        path="/workbench"
                        element={
                            <ProtectedRoute>
                                <Workbench />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/workbench" replace />} />
                    <Route path="*" element={<Navigate to="/workbench" replace />} />
                </Routes>
            </ChatProvider>
        </BrowserRouter>
    )
}

export default App
