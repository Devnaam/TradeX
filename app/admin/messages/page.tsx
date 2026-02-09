'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils';

interface Message {
    id: number;
    userId: number;
    user: {
        id: number;
        name: string;
        phone: string;
        userId: string | null;
    };
    subject: string;
    category: string;
    message: string;
    adminReply: string | null;
    status: string;
    createdAt: string;
    repliedAt: string | null;
}

export default function AdminMessagesPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'replied'>('all');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMessages();
    }, [filter]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/messages?filter=${filter}`);

            if (response.status === 401) {
                router.push('/admin');
                return;
            }

            const data = await response.json();
            if (data.success) {
                setMessages(data.data.messages);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (messageId: number) => {
        if (!replyText.trim()) {
            setError('Reply cannot be empty');
            return;
        }

        if (replyText.length < 10) {
            setError('Reply must be at least 10 characters');
            return;
        }

        setSending(true);
        setError('');

        try {
            const response = await fetch('/api/admin/messages/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messageId,
                    adminReply: replyText,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setReplyingTo(null);
                setReplyText('');
                fetchMessages();
            } else {
                setError(data.error || 'Failed to send reply');
            }
        } catch (error) {
            setError('Failed to send reply');
        } finally {
            setSending(false);
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'replied'
            ? 'bg-green-100 text-green-700 border-green-300'
            : 'bg-yellow-100 text-yellow-700 border-yellow-300';
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'deposit':
                return '💰';
            case 'withdrawal':
                return '💸';
            case 'plan':
                return '📊';
            case 'account':
                return '👤';
            default:
                return '💬';
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/admin/logout', {
                method: 'POST',
                credentials: 'include',
            });
            window.location.href = '/admin';
        } catch (error) {
            window.location.href = '/admin';
        }
    };

    const pendingCount = messages.filter((m) => m.status === 'pending').length;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-emerald-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex justify-between items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <Link href="/admin/dashboard">
                                <button className="text-white hover:text-white/80 transition-colors">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                            </Link>
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-white/30">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">User Messages</h1>
                                    <p className="text-xs text-white/80 hidden sm:block">Manage support requests</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-white/20 border-2 border-white/30 rounded-button transition-all flex-shrink-0"
                        >
                            <span className="hidden sm:inline">Logout</span>
                            <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="card !p-4 sm:!p-5 border-2 border-neutral-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-foreground">{messages.length}</p>
                                <p className="text-xs sm:text-sm text-neutral-600 font-medium">Total Messages</p>
                            </div>
                        </div>
                    </div>

                    <div className="card !p-4 sm:!p-5 border-2 border-yellow-300 bg-yellow-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-yellow-900">{pendingCount}</p>
                                <p className="text-xs sm:text-sm text-yellow-800 font-medium">Pending Replies</p>
                            </div>
                        </div>
                    </div>

                    <div className="card !p-4 sm:!p-5 border-2 border-green-300 bg-green-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-green-900">
                                    {messages.filter((m) => m.status === 'replied').length}
                                </p>
                                <p className="text-xs sm:text-sm text-green-800 font-medium">Replied</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="card !p-2 sm:!p-3">
                    <div className="grid grid-cols-3 gap-2">
                        {(['all', 'pending', 'replied'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition-all capitalize ${filter === tab
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-background text-foreground hover:bg-neutral-200'
                                    }`}
                            >
                                <span className="block sm:inline">{tab}</span>
                                {tab === 'pending' && pendingCount > 0 && (
                                    <span className="ml-0 sm:ml-2 block sm:inline mt-1 sm:mt-0 px-2 py-0.5 bg-white text-emerald-600 rounded-full text-xs font-bold">
                                        {pendingCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages List */}
                {loading ? (
                    <div className="card !p-8 sm:!p-12 text-center border-2 border-neutral-200">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-emerald-600 border-t-transparent mb-4"></div>
                        <p className="text-sm text-neutral-600 font-medium">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="card !p-8 sm:!p-12 text-center border-2 border-neutral-200">
                        <div className="text-5xl sm:text-6xl mb-4">📭</div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">No Messages</h3>
                        <p className="text-sm text-neutral-600">
                            {filter === 'all' ? 'No messages from users yet' : `No ${filter} messages`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className="card !p-4 sm:!p-6 border-2 border-neutral-200 shadow-md">
                                {/* Message Header */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4 pb-4 border-b border-neutral-200">
                                    <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                                        <div className="text-2xl sm:text-3xl flex-shrink-0">{getCategoryIcon(msg.category)}</div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-foreground text-base sm:text-lg mb-2 break-words">{msg.subject}</h3>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs text-neutral-600">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span className="truncate">{msg.user.name}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {msg.user.phone}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="truncate">{formatDateTime(msg.createdAt)}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`text-xs px-3 py-1.5 rounded-full font-bold capitalize border-2 flex-shrink-0 self-start ${getStatusColor(
                                            msg.status
                                        )}`}
                                    >
                                        {msg.status}
                                    </span>
                                </div>

                                {/* User Message */}
                                <div className="bg-neutral-100 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-neutral-200">
                                    <p className="text-xs font-bold text-neutral-700 mb-2 uppercase tracking-wide">
                                        User's Message:
                                    </p>
                                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed break-words">
                                        {msg.message}
                                    </p>
                                </div>

                                {/* Admin Reply Section */}
                                {msg.adminReply ? (
                                    <div className="bg-emerald-50 rounded-lg p-3 sm:p-4 border-2 border-emerald-200">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                            <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                                                Your Reply:
                                            </p>
                                            {msg.repliedAt && (
                                                <p className="text-xs text-emerald-700">{formatDateTime(msg.repliedAt)}</p>
                                            )}
                                        </div>
                                        <p className="text-sm text-emerald-900 whitespace-pre-wrap leading-relaxed break-words">
                                            {msg.adminReply}
                                        </p>
                                    </div>
                                ) : replyingTo === msg.id ? (
                                    <div className="space-y-3">
                                        {error && (
                                            <div className="card !p-3 bg-red-50 border-2 border-red-500">
                                                <p className="text-xs sm:text-sm font-medium text-red-800">{error}</p>
                                            </div>
                                        )}
                                        <textarea
                                            className="w-full border-2 border-emerald-600 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 min-h-[100px] sm:min-h-[120px]"
                                            placeholder="Type your reply here..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            autoFocus
                                        />
                                        <p className="text-xs text-neutral-500">
                                            {replyText.length} characters (minimum 10)
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => handleReply(msg.id)}
                                                disabled={sending}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-button transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {sending ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span className="text-sm sm:text-base">Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </svg>
                                                        <span className="text-sm sm:text-base">Send Reply</span>
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setReplyingTo(null);
                                                    setReplyText('');
                                                    setError('');
                                                }}
                                                className="sm:flex-shrink-0 px-6 py-3 bg-neutral-200 hover:bg-neutral-300 text-foreground font-bold rounded-button transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setReplyingTo(msg.id)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-button transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                        </svg>
                                        <span className="text-sm sm:text-base">Reply to User</span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
