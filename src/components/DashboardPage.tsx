import { useCallback, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import api from "../api/axios";

interface DashboardPageProps {
  userName: string;
  onNavigate: (page: string) => void;
}

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function DashboardPage({ userName, onNavigate }: DashboardPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/posts");
      const remotePosts = Array.isArray(response.data?.posts)
        ? response.data.posts
        : [];
      setPosts(remotePosts);
      setError(null);
    } catch (err) {
      setError("貼文載入失敗，請稍後再試");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await loadPosts();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadPosts]);

  const formatTimestamp = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return "";
    }
  };

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/50">
            <span className="text-4xl">👋</span>
          </div>
          <h1 className="text-3xl sm:text-4xl bg-gradient-to-r from-blue-400 leading-relaxed to-cyan-400 bg-clip-text text-transparent">
            歡迎回來，{userName || "用戶"}！
          </h1>
          <p className="text-gray-400">探索最新的貼文和社群動態</p>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-blue-500/20 shadow-lg shadow-blue-500/10 p-6 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate("create-post")}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">✏️</span>
              </div>
              <span className="text-sm text-gray-300">發布貼文</span>
            </button>
            <button
              onClick={() => onNavigate("profile")}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors group"
            >
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">👤</span>
              </div>
              <span className="text-sm text-gray-300">個人資料</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔔</span>
              </div>
              <span className="text-sm text-gray-300">通知</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-colors group">
              <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">⭐</span>
              </div>
              <span className="text-sm text-gray-300">收藏</span>
            </button>
          </div>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          <h2 className="text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <span>📰</span>
            最新貼文
          </h2>

          {isLoading && (
            <Card className="bg-slate-900/50 border-blue-500/20 p-6 text-center text-gray-400">
              正在載入貼文...
            </Card>
          )}

          {!isLoading && error && (
            <Card className="bg-slate-900/50 border-red-500/30 p-6 text-center text-red-300">
              {error}
            </Card>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <Card className="bg-slate-900/50 border-blue-500/20 p-6 text-center text-gray-400">
              目前還沒有任何貼文，成為第一個分享的人吧！
            </Card>
          )}

          {!isLoading &&
            !error &&
            posts.map((post) => (
              <Card
                key={post.id}
                className="bg-slate-900/50 backdrop-blur-xl border-blue-500/20 shadow-lg shadow-blue-500/10 p-6 hover:border-blue-500/40 transition-all"
              >
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                    {post.author.name.slice(0, 1) || "👤"}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-200">
                      {post.author.name || "匿名"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatTimestamp(post.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-300 mb-4 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-blue-500/10">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group">
                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">喜歡</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group">
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">留言</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors group">
                    <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">分享</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors group ml-auto">
                    <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </Card>
            ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => {
              if (!isLoading) {
                loadPosts();
              }
            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white disabled:opacity-60"
            disabled={isLoading}
          >
            載入更多貼文
          </Button>
        </div>
      </div>
    </main>
  );
}
