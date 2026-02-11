import { Loader2, Activity, Dumbbell } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { formatDistanceToNow } from 'date-fns';

export function ActivityFeed() {
  const { activities, loading } = useActivityFeed();

  const getInitials = (username: string | null, slug: string) => {
    if (username) return username.slice(0, 2).toUpperCase();
    return slug.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          <Activity className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">No recent activity</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          When your friends log workouts, their activity will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex gap-3 p-4 rounded-xl bg-card border border-border"
        >
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarFallback className="bg-secondary text-foreground text-sm font-semibold">
              {getInitials(activity.username, activity.slug)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground truncate">
                {activity.username || activity.slug}
              </span>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                <Dumbbell className="w-3 h-3" />
                {activity.workout_type}
              </span>
              {activity.duration && (
                <span className="text-xs text-muted-foreground">
                  {activity.duration} min
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{activity.summary}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
