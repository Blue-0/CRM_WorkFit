import React, { useState, useRef, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

const WorkoutChatLayer = ({ userId }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Bonjour ! Je suis ton coach IA. Dis-moi ce que tu veux travailler aujourd\'hui, ou pose-moi n\'importe quelle question sur ton entraînement.',
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingContent]);

    const sendMessage = useCallback(async () => {
        const text = input.trim();
        if (!text || loading) return;

        const updatedMessages = [...messages, { role: 'user', content: text }];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);
        setStreamingContent('');

        try {
            const response = await fetch(`${API_URL}/api/health/chat-workout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId,
                },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            if (!response.ok) throw new Error(`Erreur ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                            fullContent += parsed.content;
                            setStreamingContent(fullContent);
                        }
                        if (parsed.error) {
                            fullContent += `\n[Erreur: ${parsed.error}]`;
                            setStreamingContent(fullContent);
                        }
                    } catch {
                        // Ligne non-JSON, ignorer
                    }
                }
            }

            // Fin du stream : ajouter le message complet à l'historique
            const finalContent = fullContent || "Je n'ai pas pu générer de réponse.";
            setMessages(prev => [...prev, { role: 'assistant', content: finalContent }]);
            setStreamingContent('');

        } catch (err) {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: "Une erreur s'est produite. Vérifie ta connexion et réessaie." },
            ]);
            setStreamingContent('');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [input, loading, messages, userId]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="card h-100" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header d-flex align-items-center gap-3 border-bottom py-16 px-24">
                <div
                    className="w-40-px h-40-px rounded-circle d-flex align-items-center justify-content-center"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                    <span className="text-white text-xl">🤖</span>
                </div>
                <div>
                    <h6 className="text-lg mb-0 fw-semibold">Coach IA</h6>
                    <p className="text-sm text-secondary-light mb-0">Propulsé par LightRAG</p>
                </div>
                {loading && (
                    <span className="ms-auto badge text-sm fw-normal" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                        En train de répondre...
                    </span>
                )}
            </div>

            {/* Zone de messages */}
            <div
                className="card-body px-24 py-20 flex-grow-1 overflow-auto"
                style={{ flex: 1, overflowY: 'auto', maxHeight: '60vh' }}
            >
                <div className="d-flex flex-column gap-16">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`d-flex gap-10 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div
                                className="w-32-px h-32-px rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-sm"
                                style={{
                                    background: msg.role === 'user'
                                        ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                                        : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    color: 'white',
                                    minWidth: '32px',
                                }}
                            >
                                {msg.role === 'user' ? '👤' : '🤖'}
                            </div>
                            <div
                                className="px-16 py-12 radius-8 text-sm"
                                style={{
                                    maxWidth: '75%',
                                    background: msg.role === 'user' ? '#3b82f6' : '#f1f5f9',
                                    color: msg.role === 'user' ? '#ffffff' : '#1e293b',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.6',
                                    borderRadius: msg.role === 'user'
                                        ? '18px 18px 4px 18px'
                                        : '18px 18px 18px 4px',
                                }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Message en cours de streaming */}
                    {loading && streamingContent && (
                        <div className="d-flex gap-10 flex-row">
                            <div
                                className="w-32-px h-32-px rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-sm"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', minWidth: '32px' }}
                            >
                                🤖
                            </div>
                            <div
                                className="px-16 py-12 radius-8 text-sm"
                                style={{
                                    maxWidth: '75%',
                                    background: '#f1f5f9',
                                    color: '#1e293b',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.6',
                                    borderRadius: '18px 18px 18px 4px',
                                }}
                            >
                                {streamingContent}
                                <span className="streaming-cursor" />
                            </div>
                        </div>
                    )}

                    {/* Indicateur d'attente (avant le premier chunk) */}
                    {loading && !streamingContent && (
                        <div className="d-flex gap-10 flex-row">
                            <div
                                className="w-32-px h-32-px rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', minWidth: '32px' }}
                            >
                                <span className="text-white text-sm">🤖</span>
                            </div>
                            <div
                                className="px-16 py-12 radius-8 d-flex align-items-center gap-6"
                                style={{ background: '#f1f5f9', borderRadius: '18px 18px 18px 4px' }}
                            >
                                <span className="typing-dot" style={{ animationDelay: '0s' }} />
                                <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                                <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Zone de saisie */}
            <div className="card-footer border-top py-16 px-24">
                <div className="d-flex gap-8 align-items-end">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ex: Génère-moi une séance pecs 45 min, ou pose n'importe quelle question..."
                        rows={2}
                        disabled={loading}
                        className="form-control radius-8 text-sm"
                        style={{ resize: 'none', flex: 1 }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="btn btn-primary radius-8 d-flex align-items-center gap-6 px-20 py-12"
                        style={{ flexShrink: 0 }}
                    >
                        <span>{loading ? '...' : 'Envoyer'}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
                <p className="text-xs text-secondary-light mt-8 mb-0">
                    Entrée pour envoyer · Maj+Entrée pour sauter une ligne
                </p>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-6px); }
                }
                .typing-dot {
                    width: 8px;
                    height: 8px;
                    background: #94a3b8;
                    border-radius: 50%;
                    display: inline-block;
                    animation: bounce 1.2s infinite;
                }
                .streaming-cursor {
                    display: inline-block;
                    width: 2px;
                    height: 14px;
                    background: #7c3aed;
                    margin-left: 2px;
                    vertical-align: text-bottom;
                    animation: blink 0.8s infinite;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default WorkoutChatLayer;
