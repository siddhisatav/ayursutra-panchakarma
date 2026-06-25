import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';

// All therapies known to the recommendation + booking system
const KNOWN_THERAPY_NAMES = [
    'Vamana', 'Virechana', 'Basti', 'Nasya', 'Raktamokshana',
    'Shirodhara', 'Abhyanga', 'Swedana', 'Pizhichil', 'Takradhara'
];

const AIHealthAssistant = () => {
    const [messages, setMessages] = useState([
        { id: 1, type: 'ai', text: 'Namaste! I am your Ayurvedic AI Assistant. How can I help you today?', data: null }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/ai-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            const responseData = data.data;
            
            const aiMsg = { 
                id: Date.now() + 1, 
                type: 'ai', 
                text: responseData.reply,
                data: {
                    therapy: responseData.therapy,
                    diet: responseData.diet,
                    lifestyle: responseData.lifestyle
                }
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("AI Assistant Error:", error);
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                type: 'ai', 
                text: "I'm sorry, I'm having trouble connecting to the wisdom of AyurSutra. Please try again later." 
            }]);
        } finally {
            setLoading(false);
        }
    };

    const symptomChips = ["stress", "headache", "digestion", "insomnia", "body pain"];

    // Saves the recommended therapy to localStorage and navigates to booking page
    const handleBookAppointment = (therapyString) => {
        try {
            if (therapyString && therapyString.trim()) {
                // Extract the known therapy name from the AI response string
                const matched = KNOWN_THERAPY_NAMES.find(name =>
                    therapyString.toLowerCase().includes(name.toLowerCase())
                );
                const therapyToSave = matched || therapyString.trim();
                localStorage.setItem('ayursutra_recommended_therapy', therapyToSave);
            }
        } catch (err) {
            console.error('Error saving recommended therapy:', err);
        }
        navigate('/book-appointment');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-ayur-primary p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-serif font-bold">AI Health Assistant</h2>
                        <p className="text-xs text-ayur-beige/80">Ayurvedic Recommendations</p>
                    </div>
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-ayur-beige/10">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                msg.type === 'user' ? 'bg-ayur-primary text-white' : 'bg-ayur-accent text-ayur-primary'
                            }`}>
                                {msg.type === 'user' ? <User size={18} /> : <Bot size={18} />}
                            </div>
                            <div className="space-y-2">
                                <div className={`p-4 rounded-2xl ${
                                    msg.type === 'user' 
                                    ? 'bg-ayur-primary text-white rounded-tr-none' 
                                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm border border-gray-100 dark:border-gray-600 rounded-tl-none'
                                }`}>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                </div>
                                
                                {msg.data && (
                                    <div className="space-y-2">
                                        {/* Therapy / Diet / Lifestyle info cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in zoom-in-95 duration-300">
                                            <div className="p-3 bg-white dark:bg-gray-700 rounded-xl border-l-4 border-ayur-primary shadow-sm">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-ayur-primary">🧠 Therapy</span>
                                                <p className="text-xs mt-1 dark:text-gray-200">{msg.data.therapy}</p>
                                            </div>
                                            <div className="p-3 bg-white dark:bg-gray-700 rounded-xl border-l-4 border-green-500 shadow-sm">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-green-600">🥗 Diet</span>
                                                <p className="text-xs mt-1 dark:text-gray-200">{msg.data.diet}</p>
                                            </div>
                                            <div className="p-3 bg-white dark:bg-gray-700 rounded-xl border-l-4 border-blue-400 shadow-sm">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-blue-500">🧘 Lifestyle</span>
                                                <p className="text-xs mt-1 dark:text-gray-200">{msg.data.lifestyle}</p>
                                            </div>
                                        </div>

                                        {/* Book Appointment button — only shown when a therapy is recommended */}
                                        {msg.data.therapy && (
                                            <button
                                                onClick={() => handleBookAppointment(msg.data.therapy)}
                                                className="w-full px-4 py-2.5 bg-ayur-primary hover:bg-ayur-primary/90 text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                                            >
                                                📅 Book Appointment for{' '}
                                                {KNOWN_THERAPY_NAMES.find(n =>
                                                    msg.data.therapy.toLowerCase().includes(n.toLowerCase())
                                                ) || 'Recommended Therapy'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 items-center text-gray-500 dark:text-gray-400">
                            <div className="w-8 h-8 rounded-full bg-ayur-accent text-ayur-primary flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </div>
                            <span className="text-sm italic">AI is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap gap-2 mb-4">
                    {symptomChips.map(chip => (
                        <button
                            key={chip}
                            onClick={() => handleSend(chip)}
                            className="text-xs px-3 py-1.5 rounded-full bg-ayur-beige/30 hover:bg-ayur-accent text-ayur-primary border border-ayur-primary/20 transition-all"
                        >
                            + {chip}
                        </button>
                    ))}
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Describe your symptoms (e.g., 'I have stress and headache')..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-ayur-primary/50 transition-all"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={loading || !input.trim()}
                        className="bg-ayur-primary hover:bg-ayur-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-lg flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIHealthAssistant;
