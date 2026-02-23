'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { databases, client, DATABASE_ID, COLLECTION_ID_CONVERSATIONS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import type { ConversationDocument } from '@/lib/types';
const ADMIN_USER_ID = process.env.NEXT_PUBLIC_APPWRITE_ADMIN_USER_ID || "69798d759c496d417b17";

/**
 * Hook that checks if the current user has unread messages.
 * - For admins: checks if any conversation's lastRepliedBy is NOT the admin (client sent last message)
 * - For users: checks if any conversation's lastRepliedBy IS the admin (admin replied)
 */
export function useUnreadMessages() {
    const { user } = useAuth();
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        if (!user) {
            setHasUnread(false);
            return;
        }

        const isAdmin = (user.labels || []).includes('admin') || (user.labels || []).includes('developer');

        const checkUnread = async () => {
            try {
                if (isAdmin) {
                    // Admin: check for conversations where lastRepliedBy is NOT the admin
                    const response = await databases.listDocuments(
                        DATABASE_ID,
                        COLLECTION_ID_CONVERSATIONS,
                        [Query.equal('participants', user.$id), Query.limit(50)]
                    );
                    const convos = response.documents as unknown as ConversationDocument[];
                    const hasNewMessages = convos.some(c => c.lastRepliedBy && c.lastRepliedBy !== user.$id);
                    setHasUnread(hasNewMessages);
                } else {
                    // User: check for conversations where lastRepliedBy is NOT the user (admin replied)
                    const response = await databases.listDocuments(
                        DATABASE_ID,
                        COLLECTION_ID_CONVERSATIONS,
                        [Query.equal('userId', user.$id), Query.limit(1)]
                    );
                    const convos = response.documents as unknown as ConversationDocument[];
                    const hasNewMessages = convos.some(c => c.lastRepliedBy && c.lastRepliedBy !== user.$id);
                    setHasUnread(hasNewMessages);
                }
            } catch {
                // Silently fail — don't break the UI for a notification badge
            }
        };

        checkUnread();

        // Real-time: re-check when any conversation is updated
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COLLECTION_ID_CONVERSATIONS}.documents`,
            () => {
                checkUnread();
            }
        );

        return () => unsubscribe();
    }, [user]);

    return hasUnread;
}
