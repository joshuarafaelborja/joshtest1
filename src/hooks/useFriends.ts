import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Friend {
  id: string;
  user_id: string;
  username: string | null;
  slug: string;
  last_active: string | null;
  friendship_id: string;
  status: string;
}

export interface FriendRequest {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at: string;
  sender_username: string | null;
  sender_slug: string;
}

export function useFriends() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = useCallback(async () => {
    if (!user) {
      setFriends([]);
      setPendingRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch accepted friendships
    const { data: friendships } = await supabase
      .from('friendships')
      .select('*')
      .eq('status', 'accepted')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    if (friendships && friendships.length > 0) {
      const friendUserIds = friendships.map(f =>
        f.user_id === user.id ? f.friend_id : f.user_id
      );

      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', friendUserIds);

      if (profiles) {
        const friendList: Friend[] = profiles.map(p => {
          const friendship = friendships.find(
            f => (f.user_id === p.user_id || f.friend_id === p.user_id)
          );
          return {
            id: p.id,
            user_id: p.user_id,
            username: p.username,
            slug: p.slug,
            last_active: (p as any).last_active || null,
            friendship_id: friendship?.id || '',
            status: 'accepted',
          };
        });
        setFriends(friendList);
      }
    } else {
      setFriends([]);
    }

    // Fetch pending requests sent TO me
    const { data: pending } = await supabase
      .from('friendships')
      .select('*')
      .eq('friend_id', user.id)
      .eq('status', 'pending');

    if (pending && pending.length > 0) {
      const senderIds = pending.map(p => p.user_id);
      const { data: senderProfiles } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', senderIds);

      const requests: FriendRequest[] = pending.map(p => {
        const profile = senderProfiles?.find(sp => sp.user_id === p.user_id);
        return {
          ...p,
          sender_username: profile?.username || null,
          sender_slug: profile?.slug || '',
        };
      });
      setPendingRequests(requests);
    } else {
      setPendingRequests([]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const searchUsers = async (query: string) => {
    if (!user || query.length < 2) return [];

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,slug.ilike.%${query}%`)
      .neq('user_id', user.id)
      .limit(10);

    return data || [];
  };

  const sendFriendRequest = async (friendUserId: string) => {
    if (!user) return { error: 'Not authenticated' };

    // Check if friendship already exists
    const { data: existing } = await supabase
      .from('friendships')
      .select('*')
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${friendUserId}),and(user_id.eq.${friendUserId},friend_id.eq.${user.id})`
      );

    if (existing && existing.length > 0) {
      return { error: 'Friend request already exists' };
    }

    const { error } = await supabase
      .from('friendships')
      .insert({ user_id: user.id, friend_id: friendUserId });

    if (!error) fetchFriends();
    return { error: error?.message || null };
  };

  const acceptRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId);

    if (!error) fetchFriends();
    return { error: error?.message || null };
  };

  const removeFriend = async (friendshipId: string) => {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    if (!error) fetchFriends();
    return { error: error?.message || null };
  };

  return {
    friends,
    pendingRequests,
    loading,
    searchUsers,
    sendFriendRequest,
    acceptRequest,
    removeFriend,
    refetch: fetchFriends,
  };
}
