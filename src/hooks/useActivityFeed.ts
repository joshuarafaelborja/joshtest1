import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ActivityItem {
  id: string;
  user_id: string;
  workout_type: string;
  duration: number | null;
  summary: string;
  created_at: string;
  username: string | null;
  slug: string;
}

export function useActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Get friend IDs first
    const { data: friendships } = await supabase
      .from('friendships')
      .select('*')
      .eq('status', 'accepted')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    if (!friendships || friendships.length === 0) {
      setActivities([]);
      setLoading(false);
      return;
    }

    const friendUserIds = friendships.map(f =>
      f.user_id === user.id ? f.friend_id : f.user_id
    );

    // Fetch activities from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: acts } = await supabase
      .from('activities')
      .select('*')
      .in('user_id', friendUserIds)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    if (acts && acts.length > 0) {
      // Get profiles for these users
      const userIds = [...new Set(acts.map(a => a.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      const enriched: ActivityItem[] = acts.map(a => {
        const profile = profiles?.find(p => p.user_id === a.user_id);
        return {
          ...a,
          username: profile?.username || null,
          slug: profile?.slug || '',
        };
      });

      setActivities(enriched);
    } else {
      setActivities([]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const postActivity = async (workoutType: string, duration: number | null, summary: string) => {
    if (!user) return;

    await supabase.from('activities').insert({
      user_id: user.id,
      workout_type: workoutType,
      duration,
      summary,
    });

    // Also update last_active
    await supabase
      .from('profiles')
      .update({ last_active: new Date().toISOString() } as any)
      .eq('user_id', user.id);
  };

  return {
    activities,
    loading,
    postActivity,
    refetch: fetchActivities,
  };
}
