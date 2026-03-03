import React, { useState, useRef, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

const WorkoutChatLayer = ({ userId }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Bonjour ! Je suis ton coach IA. Dis-moi ce que tu veux travailler aujourd\'hui, ou pose-moi n\'importe quelle question sur ton entraînement. 💪',
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const updatedMessages = [...messages, { role: 'user', content: text }];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

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

            const data = await response.json();
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: data.content || "Je n'ai pas pu générer de réponse." },
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: "Une erreur s'est produite. Vérifie ta connexion et réessaie." },
            ]);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
                            {/* Avatar */}
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

                            {/* Bulle */}
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

                    {/* Indicateur de chargement */}
                    {loading && (
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
                                <span
                                    className="rounded-circle"
                                    style={{ width: 8, height: 8, background: '#94a3b8', display: 'inline-block', animation: 'bounce 1.2s infinite' }}
                                />
                                <span
                                    className="rounded-circle"
                                    style={{ width: 8, height: 8, background: '#94a3b8', display: 'inline-block', animation: 'bounce 1.2s infinite 0.2s' }}
                                />
                                <span
                                    className="rounded-circle"
                                    style={{ width: 8, height: 8, background: '#94a3b8', display: 'inline-block', animation: 'bounce 1.2s infinite 0.4s' }}
                                />
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
            `}</style>
        </div>
    );
};

export default WorkoutChatLayer;
