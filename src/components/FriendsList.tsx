import { useState } from 'react';
import { Search, UserPlus, UserCheck, UserX, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useFriends } from '@/hooks/useFriends';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export function FriendsList() {
  const { friends, pendingRequests, loading, searchUsers, sendFriendRequest, acceptRequest, removeFriend } = useFriends();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const results = await searchUsers(query);
    setSearchResults(results);
    setSearching(false);
  };

  const handleSendRequest = async (userId: string) => {
    const { error } = await sendFriendRequest(userId);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Friend request sent!');
      setSentRequests(prev => new Set(prev).add(userId));
    }
  };

  const handleAccept = async (friendshipId: string) => {
    const { error } = await acceptRequest(friendshipId);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Friend request accepted!');
    }
  };

  const handleRemove = async (friendshipId: string) => {
    const { error } = await removeFriend(friendshipId);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Friend removed');
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by username or slug..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Search Results */}
      {searchQuery.length >= 2 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search Results</h3>
          {searching ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : searchResults.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No users found</p>
          ) : (
            <div className="space-y-2">
              {searchResults.map((result) => {
                const isFriend = friends.some(f => f.user_id === result.user_id);
                const isPending = sentRequests.has(result.user_id);
                return (
                  <div key={result.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-secondary text-foreground text-sm font-semibold">
                        {getInitials(result.username, result.slug)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {result.username || result.slug}
                      </p>
                      <p className="text-xs text-muted-foreground">@{result.slug}</p>
                    </div>
                    {isFriend ? (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" /> Friends
                      </span>
                    ) : isPending ? (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Sent
                      </span>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleSendRequest(result.user_id)}>
                        <UserPlus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Friend Requests ({pendingRequests.length})
          </h3>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-primary/30">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {getInitials(req.sender_username, req.sender_slug)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {req.sender_username || req.sender_slug}
                  </p>
                  <p className="text-xs text-muted-foreground">Wants to connect</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAccept(req.id)}>
                    <UserCheck className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleRemove(req.id)}>
                    <UserX className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Friends ({friends.length})
        </h3>
        {friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border rounded-xl bg-card/50 p-6">
            <UserPlus className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No friends yet. Search for users above to connect!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-secondary text-foreground text-sm font-semibold">
                    {getInitials(friend.username, friend.slug)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {friend.username || friend.slug}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {friend.last_active
                      ? `Active ${formatDistanceToNow(new Date(friend.last_active), { addSuffix: true })}`
                      : 'No recent activity'}
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleRemove(friend.friendship_id)}>
                  <UserX className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
