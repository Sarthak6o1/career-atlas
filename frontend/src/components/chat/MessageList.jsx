import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import EmptyState from './EmptyState';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../../hooks/useChat.js';

const MessageList = ({ messages: propMessages, isLoading: propIsLoading }) => {
    const { messages: contextMessages, isLoading: contextIsLoading } = useChat();

    // Use props if provided, otherwise fallback to context
    const messages = propMessages || contextMessages;
    const isLoading = propIsLoading !== undefined ? propIsLoading : contextIsLoading;

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
            {messages.length === 0 && <EmptyState />}

            {messages.map((m) => <MessageItem key={m.id} message={m} />)}

            {isLoading && <TypingIndicator />}

            <div ref={bottomRef} />
        </div>
    );
};

export default MessageList;
