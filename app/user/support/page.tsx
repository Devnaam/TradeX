'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';

interface Message {
  id: number;
  subject: string;
  category: string;
  message: string;
  adminReply: string | null;
  status: string;
  createdAt: string;
  repliedAt: string | null;
}

export default function SupportPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    { value: 'deposit', label: 'Deposit Issue' },
    { value: 'withdrawal', label: 'Withdrawal Issue' },
    { value: 'plan', label: 'Plan Query' },
    { value: 'account', label: 'Account Issue' },
    { value: 'general', label: 'General Query' },
  ];

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/support/messages', {
        headers: {
          'x-user-id': user.id.toString(),
        },
      });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.message.length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }

    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    setSending(true);

    try {
      const response = await fetch('/api/user/support/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString(),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('✅ Message sent successfully! Admin will reply soon.');
        setFormData({ subject: '', category: 'general', message: '' });
        fetchMessages();
        setTimeout(() => {
          setActiveTab('history');
          setSuccess('');
        }, 2000);
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-emerald-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/user/dashboard">
              <button className="text-white hover:text-white/80 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>
            </Link>
            <div className="flex items-center gap-2 flex-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h1 className="text-lg font-bold">Support Center</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Tab Switcher */}
        <div className="card !p-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('new')}
              className={`py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'new'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-background text-foreground hover:bg-neutral-200'
              }`}
            >
              New Message
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-background text-foreground hover:bg-neutral-200'
              }`}
            >
              Message History ({messages.length})
            </button>
          </div>
        </div>

        {/* New Message Form */}
        {activeTab === 'new' && (
          <div className="card !p-6 border-2 border-neutral-200 shadow-lg">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Contact Admin</h2>
                  <p className="text-sm text-neutral-600">We'll respond within 1-2 hours</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Success Message */}
              {success && (
                <div className="card !p-4 bg-green-50 border-2 border-green-500">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="card !p-4 bg-red-50 border-2 border-red-500">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Category
                </label>
                <select
                  className="input-field border-2 border-neutral-300 focus:border-emerald-600"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="input-field border-2 border-neutral-300 focus:border-emerald-600"
                  placeholder="Brief description of your issue"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  maxLength={100}
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Message
                </label>
                <textarea
                  className="input-field border-2 border-neutral-300 focus:border-emerald-600 min-h-[150px]"
                  placeholder="Describe your issue in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {formData.message.length} characters (minimum 10)
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-6 rounded-button transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Message History */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {loading ? (
              <div className="card !p-12 text-center border-2 border-neutral-200">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent mb-4"></div>
                <p className="text-sm text-neutral-600">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="card !p-12 text-center border-2 border-neutral-200">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-foreground mb-2">No Messages Yet</h3>
                <p className="text-neutral-600 mb-6">You haven't sent any messages to admin.</p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-8 rounded-button transition-all shadow-lg"
                >
                  Send Your First Message
                </button>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="card !p-5 border-2 border-neutral-200 shadow-md">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{getCategoryIcon(msg.category)}</div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{msg.subject}</h3>
                        <p className="text-xs text-neutral-500">{formatDateTime(msg.createdAt)}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold capitalize border-2 ${getStatusColor(
                        msg.status
                      )}`}
                    >
                      {msg.status}
                    </span>
                  </div>

                  {/* User Message */}
                  <div className="bg-neutral-100 rounded-lg p-4 mb-4 border border-neutral-200">
                    <p className="text-xs font-bold text-neutral-700 mb-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Message:
                    </p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{msg.message}</p>
                  </div>

                  {/* Admin Reply */}
                  {msg.adminReply ? (
                    <div className="bg-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-emerald-900">Admin Reply:</p>
                        {msg.repliedAt && (
                          <p className="text-xs text-emerald-700 ml-auto">{formatDateTime(msg.repliedAt)}</p>
                        )}
                      </div>
                      <p className="text-sm text-emerald-900 whitespace-pre-wrap">{msg.adminReply}</p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-800 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Waiting for admin reply...
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
