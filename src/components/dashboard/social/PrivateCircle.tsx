import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { UserPlus, Heart, MessageCircle, ImageIcon, Send, MoreVertical, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Post {
  id: string;
  author: {
    name: string;
    initials: string;
    relation: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  likedByMe: boolean;
  category: "meal" | "activity" | "wellness" | "milestone";
}

const POSTS: Post[] = [
  {
    id: "1",
    author: { name: "Mom", initials: "MJ", relation: "Family" },
    content: "Made a colorful Buddha bowl for lunch today! 🥗 Quinoa, roasted veggies, and tahini dressing. Feeling energized and ready for the afternoon!",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    timestamp: "2 hours ago",
    likes: 12,
    comments: 4,
    likedByMe: true,
    category: "meal"
  },
  {
    id: "2",
    author: { name: "Partner", initials: "JD", relation: "Family" },
    content: "Hit a new milestone today - 30 days of consistent morning walks! 🎉 The sunrise views have been incredible. Thank you all for the encouragement!",
    timestamp: "5 hours ago",
    likes: 24,
    comments: 8,
    likedByMe: false,
    category: "milestone"
  },
  {
    id: "3",
    author: { name: "Dr. Sarah Chen", initials: "SC", relation: "Physician" },
    content: "Quick reminder for everyone: staying hydrated is just as important in cooler weather. Aim for 8 glasses throughout the day! 💧",
    timestamp: "1 day ago",
    likes: 18,
    comments: 5,
    likedByMe: true,
    category: "wellness"
  },
  {
    id: "4",
    author: { name: "Coach Alex", initials: "AK", relation: "Fitness Coach" },
    content: "Recovery day yoga session 🧘‍♂️ Remember, rest is progress too! Taking care of my body so I can come back stronger.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    timestamp: "2 days ago",
    likes: 15,
    comments: 6,
    likedByMe: false,
    category: "activity"
  }
];

const CATEGORY_COLORS = {
  meal: "bg-orange-500/10 text-orange-700 border-orange-200",
  activity: "bg-blue-500/10 text-blue-700 border-blue-200",
  wellness: "bg-green-500/10 text-green-700 border-green-200",
  milestone: "bg-purple-500/10 text-purple-700 border-purple-200"
};

export const PrivateCircle = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>(POSTS);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.likedByMe ? post.likes - 1 : post.likes + 1,
            likedByMe: !post.likedByMe 
          }
        : post
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Private Circle</CardTitle>
                <CardDescription>A safe space for your trusted 4 of 100 members</CardDescription>
              </div>
            </div>
            <Button size="sm" variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <p className="text-sm text-muted-foreground">
              This is your personal health community - share meals, workouts, wellness wins, and get support from family, friends, and healthcare providers. 
              This is a judgment-free zone focused on encouragement and conversation. 💚
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Create Post */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                You
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea 
                placeholder="Share something with your circle... a meal, a win, a question..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add photo
                </Button>
                <Button size="sm" disabled={!newPost.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="glass hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {post.image && <AvatarImage src={post.author.initials} />}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {post.author.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{post.author.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {post.author.relation}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="space-y-3">
                <p className="text-sm leading-relaxed">{post.content}</p>
                
                {post.image && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img 
                      src={post.image} 
                      alt="Post content" 
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                <Badge variant="outline" className={`text-xs ${CATEGORY_COLORS[post.category]}`}>
                  {post.category}
                </Badge>
              </div>

              {/* Post Actions */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`gap-2 ${post.likedByMe ? 'text-red-500' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart className={`h-4 w-4 ${post.likedByMe ? 'fill-current' : ''}`} />
                  <span className="text-sm">{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{post.comments}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State Encouragement */}
      <Card className="glass border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Build Your Circle</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Invite family, friends, or healthcare providers to join your private health community. 
            Share your journey and support each other!
          </p>
          <Button className="mt-4" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite members
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
