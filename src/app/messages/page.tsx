
'use client';

import { Send, User, Loader2, ArrowLeft, CheckCheck, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { databases, client } from '@/lib/appwrite';
import { ID, Query, AppwriteException } from 'appwrite';
import type { ConversationDocument, MessageDocument } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// --- Configuration ---
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID_CONVERSATIONS = "conversations";
const COLLECTION_ID_MESSAGES = "messages";
const ADMIN_USER_ID = process.env.NEXT_PUBLIC_APPWRITE_ADMIN_USER_ID || "69798d759c496d417b17";

// ==========================================
// ADMIN VIEW — sees all conversations as list
// ==========================================
const AdminMessagesView = ({ adminId }: { adminId: string }) => {
    const [conversations, setConversations] = useState<ConversationDocument[]>([]);
    const [selectedConvo, setSelectedConvo] = useState<ConversationDocument | null>(null);
    const [messages, setMessages] = useState<MessageDocument[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingConvos, setLoadingConvos] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [unreadConvoIds, setUnreadConvoIds] = useState<Set<string>>(new Set());
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const selectedConvoRef = useRef<string | null>(null);
    const { toast } = useToast();

    // Keep ref in sync so the real-time callback can access latest selected convo
    useEffect(() => {
        selectedConvoRef.current = selectedConvo?.$id ?? null;
    }, [selectedConvo]);

    // Fetch all conversations where admin is a participant
    useEffect(() => {
        const fetchConversations = async () => {
            setLoadingConvos(true);
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID_CONVERSATIONS,
                    [Query.equal('participants', adminId), Query.orderDesc('lastUpdatedAt')]
                );
                setConversations(response.documents as unknown as ConversationDocument[]);
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
                toast({ title: 'Error', description: 'Could not load conversations.', variant: 'destructive' });
            } finally {
                setLoadingConvos(false);
            }
        };

        fetchConversations();

        // Real-time: listen for new/updated conversations
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COLLECTION_ID_CONVERSATIONS}.documents`,
            (response) => {
                const updatedDoc = response.payload as unknown as ConversationDocument;
                if (!updatedDoc.participants.includes(adminId)) return;

                setConversations((prevConvos) => {
                    const existingConvoIndex = prevConvos.findIndex(c => c.$id === updatedDoc.$id);
                    let newConvos = [...prevConvos];
                    if (existingConvoIndex > -1) {
                        newConvos[existingConvoIndex] = updatedDoc;
                    } else {
                        newConvos.unshift(updatedDoc);
                    }
                    return newConvos.sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime());
                });

                // Mark as unread if this conversation is not currently open
                if (updatedDoc.$id !== selectedConvoRef.current) {
                    setUnreadConvoIds(prev => new Set(prev).add(updatedDoc.$id));
                }
            }
        );

        return () => unsubscribe();
    }, [adminId, toast]);

    // Fetch messages when a conversation is selected
    useEffect(() => {
        if (!selectedConvo) return;

        setLoadingMessages(true);
        setMessages([]);

        const fetchMessages = async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID_MESSAGES,
                    [Query.equal('conversationId', selectedConvo.$id), Query.orderAsc('$createdAt'), Query.limit(100)]
                );
                setMessages(response.documents as unknown as MessageDocument[]);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();

        // Real-time: listen for new messages in this conversation
        const messageSubscription = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
            (response) => {
                if (String(response.events).includes('create')) {
                    const newMessageDoc = response.payload as unknown as MessageDocument;
                    if (newMessageDoc.conversationId === selectedConvo?.$id) {
                        setMessages((prev) => {
                            // Prevent duplicate messages
                            if (prev.some(m => m.$id === newMessageDoc.$id)) return prev;
                            return [...prev, newMessageDoc];
                        });
                    }
                }
            }
        );

        return () => messageSubscription();
    }, [selectedConvo]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConvo || sending) return;

        const messageText = newMessage;
        setNewMessage('');
        setSending(true);

        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_MESSAGES,
                ID.unique(),
                {
                    conversationId: selectedConvo.$id,
                    senderId: adminId,
                    text: messageText,
                }
            );

            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_CONVERSATIONS,
                selectedConvo.$id,
                {
                    lastMessage: messageText,
                    lastUpdatedAt: new Date().toISOString(),
                    lastRepliedBy: adminId,
                }
            );
        } catch (error) {
            console.error("Failed to send message:", error);
            setNewMessage(messageText);
            toast({
                title: 'Message Error',
                description: 'Could not send message. Please check collection permissions.',
                variant: 'destructive',
            });
        } finally {
            setSending(false);
        }
    };

    if (loadingConvos) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    }

    return (
        <div className="grid md:grid-cols-[320px_1fr] h-full gap-4">
            {/* Conversation List */}
            <Card className={cn("flex-col md:flex", {
                "hidden": selectedConvo,
                "flex": !selectedConvo
            })}>
                <CardHeader className="border-b">
                    <CardTitle className="text-lg">💬 Customer Chats</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-y-auto">
                    <div className="flex flex-col">
                        {conversations.map((convo) => (
                            <div
                                key={convo.$id}
                                onClick={() => {
                                    setSelectedConvo(convo);
                                    setUnreadConvoIds(prev => {
                                        const next = new Set(prev);
                                        next.delete(convo.$id);
                                        return next;
                                    });
                                }}
                                className={cn(
                                    "flex items-center gap-3 p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors",
                                    { 'bg-primary/5 border-l-4 border-l-primary': selectedConvo?.$id === convo.$id }
                                )}
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                        {convo.userName?.charAt(0)?.toUpperCase() ?? 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-grow overflow-hidden">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm">{convo.userName}</p>
                                        {convo.lastRepliedBy === adminId ? (
                                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                <CheckCheck className="h-2.5 w-2.5" /> Replied
                                            </span>
                                        ) : convo.lastRepliedBy ? (
                                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 animate-pulse">
                                                <AlertCircle className="h-2.5 w-2.5" /> Needs Reply
                                            </span>
                                        ) : null}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{convo.userEmail}</p>
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">{convo.lastMessage}</p>
                                </div>
                                {unreadConvoIds.has(convo.$id) && (
                                    <span className="flex-shrink-0 h-3 w-3 rounded-full bg-yellow-400 animate-pulse" title="New message" />
                                )}
                            </div>
                        ))}
                        {conversations.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                <User className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                <p>No conversations yet.</p>
                                <p className="text-xs mt-1">Customer messages will appear here.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className={cn("flex-col h-full md:flex", {
                "hidden": !selectedConvo,
                "flex": !!selectedConvo
            })}>
                {selectedConvo ? (
                    <>
                        <CardHeader className="flex flex-row items-center gap-3 border-b py-3">
                            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConvo(null)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {selectedConvo.userName?.charAt(0)?.toUpperCase() ?? 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-base">{selectedConvo.userName}</CardTitle>
                                <p className="text-xs text-muted-foreground">{selectedConvo.userEmail}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3 overflow-y-auto p-4">
                            {loadingMessages ? (
                                <div className="flex justify-center items-center h-full">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    {messages.length === 0 && (
                                        <div className="text-center text-muted-foreground text-sm py-8">
                                            No messages yet. Send a reply!
                                        </div>
                                    )}
                                    {messages.map((message) => (
                                        <div key={message.$id} className={`flex ${message.senderId === adminId ? 'justify-end' : 'justify-start'}`}>
                                            <div className={cn(
                                                "rounded-2xl px-4 py-2.5 max-w-[75%] shadow-sm",
                                                message.senderId === adminId
                                                    ? 'bg-primary text-primary-foreground rounded-br-md'
                                                    : 'bg-muted rounded-bl-md'
                                            )}>
                                                <p className="text-sm">{message.text}</p>
                                                <p className={cn(
                                                    "text-[10px] mt-1 opacity-60",
                                                    message.senderId === adminId ? 'text-right' : 'text-left'
                                                )}>
                                                    {new Date(message.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </CardContent>
                        <CardFooter className="pt-4 border-t">
                            <form onSubmit={handleSendMessage} className="relative w-full">
                                <Input
                                    placeholder="Type your reply..."
                                    className="pr-12"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    disabled={sending}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                    disabled={!newMessage.trim() || sending}
                                >
                                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </form>
                        </CardFooter>
                    </>
                ) : (
                    <div className="hidden md:flex flex-col items-center justify-center h-full text-muted-foreground">
                        <User className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Select a conversation</p>
                        <p className="text-sm">Choose a customer chat from the left to start replying.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

// ==========================================
// USER VIEW — single chat with admin/support
// ==========================================
const UserMessagesView = ({ user }: { user: NonNullable<ReturnType<typeof useAuth>>['user'] }) => {
    const [conversation, setConversation] = useState<ConversationDocument | null>(null);
    const [messages, setMessages] = useState<MessageDocument[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const findOrCreateConversation = async () => {
            setLoading(true);
            try {
                let convo: ConversationDocument | null = null;

                // Step 1: Try to find an existing conversation
                try {
                    const response = await databases.listDocuments(
                        DATABASE_ID,
                        COLLECTION_ID_CONVERSATIONS,
                        [
                            Query.equal('userId', user.$id),
                        ]
                    );
                    convo = response.documents.length > 0 ? (response.documents[0] as unknown as ConversationDocument) : null;
                } catch (listError) {
                    if (listError instanceof AppwriteException) {
                        toast({
                            title: 'Error Reading Conversations',
                            description: 'Could not search for existing conversations. Please check READ permissions for "Users" on the "conversations" collection.',
                            variant: 'destructive'
                        });
                        console.error("Appwrite Error (Listing Conversations):", listError.message);
                    }
                    setLoading(false);
                    return;
                }

                // Step 2: If no conversation exists, create one
                if (!convo) {
                    try {
                        convo = await databases.createDocument(
                            DATABASE_ID,
                            COLLECTION_ID_CONVERSATIONS,
                            ID.unique(),
                            {
                                participants: [user.$id, ADMIN_USER_ID],
                                lastMessage: 'Conversation started.',
                                lastUpdatedAt: new Date().toISOString(),
                                userName: user.name || 'User',
                                userId: user.$id,
                                userEmail: user.email || '',
                            }
                        ) as unknown as ConversationDocument;
                    } catch (createError) {
                        if (createError instanceof AppwriteException) {
                            toast({
                                title: 'Error Creating Conversation',
                                description: 'Could not create a new conversation. Please check CREATE permissions for "Users" on the "conversations" collection.',
                                variant: 'destructive'
                            });
                            console.error("Appwrite Error (Creating Conversation):", createError.message);
                        }
                        setLoading(false);
                        return;
                    }
                }

                setConversation(convo);

                // Step 3: Fetch messages for the conversation
                const messagesResponse = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID_MESSAGES,
                    [Query.equal('conversationId', convo.$id), Query.orderAsc('$createdAt'), Query.limit(100)]
                );
                setMessages(messagesResponse.documents as unknown as MessageDocument[]);

            } catch (error) {
                console.error("An unexpected error occurred in findOrCreateConversation:", error);
                toast({
                    title: 'Unexpected Error',
                    description: 'An unexpected error occurred. Please check the console.',
                    variant: 'destructive'
                });
            } finally {
                setLoading(false);
            }
        };

        findOrCreateConversation();
    }, [user, toast]);

    // Real-time: listen for new messages
    useEffect(() => {
        if (!conversation) return;

        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
            (response) => {
                if (String(response.events).includes('create')) {
                    const newMessageDoc = response.payload as unknown as MessageDocument;
                    if (newMessageDoc.conversationId === conversation.$id) {
                        setMessages((prev) => {
                            if (prev.some(m => m.$id === newMessageDoc.$id)) return prev;
                            return [...prev, newMessageDoc];
                        });
                    }
                }
            }
        );

        return () => unsubscribe();
    }, [conversation]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversation || !user || sending) return;

        const messageText = newMessage;
        setNewMessage('');
        setSending(true);

        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_MESSAGES,
                ID.unique(),
                {
                    conversationId: conversation.$id,
                    senderId: user.$id,
                    text: messageText,
                }
            );

            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_CONVERSATIONS,
                conversation.$id,
                {
                    lastMessage: messageText,
                    lastUpdatedAt: new Date().toISOString(),
                    lastRepliedBy: user.$id,
                }
            );
        } catch (error) {
            console.error("Failed to send message:", error);
            setNewMessage(messageText);
            toast({
                title: 'Message Error',
                description: 'Could not send message. Please check permissions.',
                variant: 'destructive',
            });
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto h-full">
            <Card className="h-full flex flex-col">
                <CardHeader className="border-b">
                    <CardTitle>💬 Chat with Support</CardTitle>
                    <p className="text-sm text-muted-foreground">Send us a message and we&apos;ll get back to you as soon as possible.</p>
                </CardHeader>
                <CardContent className="flex-grow space-y-3 overflow-y-auto p-6">
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-8">
                            <p>No messages yet. Say hello! 👋</p>
                        </div>
                    )}
                    {messages.map((message) => (
                        <div key={message.$id} className={`flex ${message.senderId === user?.$id ? 'justify-end' : 'justify-start'}`}>
                            <div className={cn(
                                "rounded-2xl px-4 py-2.5 max-w-[75%] shadow-sm",
                                message.senderId === user?.$id
                                    ? 'bg-primary text-primary-foreground rounded-br-md'
                                    : 'bg-muted rounded-bl-md'
                            )}>
                                <p className="text-sm">{message.text}</p>
                                <p className={cn(
                                    "text-[10px] mt-1 opacity-60",
                                    message.senderId === user?.$id ? 'text-right' : 'text-left'
                                )}>
                                    {new Date(message.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </CardContent>
                <CardFooter className="pt-4 border-t">
                    <form onSubmit={handleSendMessage} className="relative w-full">
                        <Input
                            placeholder="Type your message..."
                            className="pr-12"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={sending}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            disabled={!newMessage.trim() || sending}
                        >
                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}

// ==========================================
// MAIN PAGE — decides which view to render
// ==========================================
export default function MessagesPage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="container h-full flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
                <User className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground mt-4">Please log in to view your messages.</p>
                <Button asChild className="mt-6">
                    <Link href="/login?redirect_to=/messages">Login</Link>
                </Button>
            </div>
        );
    }

    const isPrivilegedUser = (user.labels || []).includes('admin') || (user.labels || []).includes('developer');

    return (
        <div className="container h-full flex flex-col py-4 md:pb-8">
            <div className="flex-1 min-h-0">
                {isPrivilegedUser ? <AdminMessagesView adminId={user.$id} /> : <UserMessagesView user={user} />}
            </div>
        </div>
    );
}
