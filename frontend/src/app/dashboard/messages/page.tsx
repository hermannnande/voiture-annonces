'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatRelativeTime, formatPrice } from '@/lib/utils';
import { Send, MessageSquare } from 'lucide-react';

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const threadIdParam = searchParams.get('thread');
  const { user, isAuthenticated } = useAuthStore();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchThreads();
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Si un thread est spécifié dans l'URL et que les threads sont chargés
    if (threadIdParam && threads.length > 0 && !selectedThread) {
      const threadToSelect = threads.find((t: any) => t.id === threadIdParam);
      if (threadToSelect) {
        fetchMessages(threadIdParam);
      }
    }
  }, [threadIdParam, threads, selectedThread]);

  const fetchThreads = async () => {
    try {
      const response = await api.get('/messages/threads');
      setThreads(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (threadId: string) => {
    try {
      const response = await api.get(`/messages/threads/${threadId}`);
      setSelectedThread(response.data);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread) return;

    setSending(true);
    try {
      const response = await api.post(`/messages/threads/${selectedThread.id}/messages`, {
        body: newMessage,
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

          <div className="card overflow-hidden" style={{ height: '600px' }}>
            <div className="flex h-full">
              {/* Liste des conversations */}
              <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : threads.length === 0 ? (
                  <div className="p-6 text-center text-gray-600">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Aucune conversation</p>
                  </div>
                ) : (
                  threads.map((thread: any) => {
                    const otherUser = thread.buyer.id === user?.id ? thread.seller : thread.buyer;
                    const lastMessage = thread.messages[0];

                    return (
                      <button
                        key={thread.id}
                        onClick={() => fetchMessages(thread.id)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                          selectedThread?.id === thread.id ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-bold">
                              {otherUser.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-semibold text-gray-900 truncate">
                                {otherUser.name}
                              </p>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                {formatRelativeTime(lastMessage?.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 font-medium truncate mb-1">
                              {thread.listing.title}
                            </p>
                            {lastMessage && (
                              <p className="text-sm text-gray-500 truncate">
                                {lastMessage.body}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Zone de messages */}
              <div className="flex-1 flex flex-col">
                {selectedThread ? (
                  <>
                    {/* En-tête */}
                    <div className="p-4 border-b border-gray-200 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {selectedThread.buyer.id === user?.id 
                              ? selectedThread.seller.name 
                              : selectedThread.buyer.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedThread.listing.title}
                          </p>
                          <p className="text-sm font-semibold text-primary-600">
                            {formatPrice(selectedThread.listing.priceFcfa)} FCFA
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-600 py-8">
                          Aucun message. Commencez la conversation !
                        </div>
                      ) : (
                        messages.map((message: any) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender.id === user?.id
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-white text-gray-900'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">{message.body}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.sender.id === user?.id ? 'text-primary-100' : 'text-gray-500'
                                }`}
                              >
                                {formatRelativeTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Zone d'envoi */}
                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Écrivez votre message..."
                          className="flex-1 input"
                          disabled={sending}
                        />
                        <button
                          type="submit"
                          disabled={sending || !newMessage.trim()}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <Send className="w-5 h-5" />
                          <span className="hidden sm:inline">Envoyer</span>
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>Sélectionnez une conversation pour voir les messages</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
      <MessagesContent />
    </Suspense>
  );
}

