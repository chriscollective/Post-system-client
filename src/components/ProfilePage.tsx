import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Edit2, Save, Mail, Calendar, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import api from "../api/axios";

interface ProfilePageProps {
  userName: string;
  userEmail: string;
  onNavigate: (page: string) => void;
}

export function ProfilePage({
  userName,
  userEmail,
  onNavigate,
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userName || "John Doe",
    email: userEmail || "john.doe@example.com",
    bio: "熱愛技術的開發者，專注於前端開發和使用者體驗設計。",
    location: "台北, 台灣",
    joinDate: "2024年1月",
  });
  const [posts, setPosts] = useState<
    Array<{
      id: string;
      content: string;
      createdAt: string;
    }>
  >([]);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const generateClientId = useCallback(() => {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }, []);

  const loadMyPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    try {
      const response = await api.get("/api/posts/me");
      const list = Array.isArray(response.data?.posts)
        ? response.data.posts
        : [];
      setPosts(
        list.map((post: any) => ({
          id: String(post.id ?? post._id ?? generateClientId()),
          content: post.content ?? "",
          createdAt: post.createdAt ?? new Date().toISOString(),
        }))
      );
      setPostsError(null);
    } catch (error) {
      setPosts([]);
      setPostsError("無法載入貼文，請稍後再試");
    } finally {
      setIsLoadingPosts(false);
    }
  }, [generateClientId]);

  useEffect(() => {
    loadMyPosts();
  }, [loadMyPosts]);

  useEffect(() => {
    if (isEditing) {
      return;
    }
    setProfileData((prev) => ({
      ...prev,
      name: userName || prev.name,
      email: userEmail || prev.email,
    }));
  }, [userName, userEmail, isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("個人資料已更新！");
  };

  const stats = useMemo(
    () => [
      { label: "貼文", value: String(posts.length) },
      { label: "追蹤中", value: "156" },
      { label: "追蹤者", value: "892" },
    ],
    [posts.length]
  );

  const formatDateTime = useCallback((iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  }, []);

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-blue-500/20 shadow-2xl shadow-blue-500/10 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-6xl shadow-xl shadow-blue-500/50">
                👤
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg">
                <Edit2 className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h1 className="text-3xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {profileData.name}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profileData.email}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profileData.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  加入於 {profileData.joinDate}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              編輯資料
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-blue-500/20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl text-blue-400">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Profile Details */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* About Section */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-blue-500/20 shadow-lg shadow-blue-500/10 p-6">
            <h2 className="text-xl text-blue-400 mb-4 flex items-center gap-2">
              <span>📝</span>
              關於我
            </h2>
            {isEditing ? (
              <Textarea
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
                className="min-h-32 bg-slate-800/50 border-blue-500/30 text-white"
              />
            ) : (
              <p className="text-gray-300 leading-relaxed">{profileData.bio}</p>
            )}
          </Card>

          {/* Account Settings */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-blue-500/20 shadow-lg shadow-blue-500/10 p-6">
            <h2 className="text-xl text-blue-400 mb-4 flex items-center gap-2">
              <span>⚙️</span>
              帳號設定
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">使用者名稱</Label>
                {isEditing ? (
                  <Input
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="bg-slate-800/50 border-blue-500/30 text-white"
                  />
                ) : (
                  <div className="text-gray-400">{profileData.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">信箱地址</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="bg-slate-800/50 border-blue-500/30 text-white"
                  />
                ) : (
                  <div className="text-gray-400">{profileData.email}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">所在地</Label>
                {isEditing ? (
                  <Input
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData({ ...profileData, location: e.target.value })
                    }
                    className="bg-slate-800/50 border-blue-500/30 text-white"
                  />
                ) : (
                  <div className="text-gray-400">{profileData.location}</div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Save Changes Button */}
        {isEditing && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30"
            >
              <Save className="w-4 h-4 mr-2" />
              儲存變更
            </Button>
          </div>
        )}

        {/* Personal Posts Section */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-blue-500/20 shadow-lg shadow-blue-500/10 p-6 mt-6">
          <h2 className="text-xl text-blue-400 mb-4 flex items-center gap-2">
            <span>🗂️</span>
            個人貼文
          </h2>
          {isLoadingPosts ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              載入貼文中...
            </div>
          ) : postsError ? (
            <div className="text-center text-red-300 py-6">{postsError}</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-400 py-6">
              尚未發布任何貼文，立即分享你的第一則貼文吧！
              <div className="mt-4">
                <Button
                  onClick={() => onNavigate("create-post")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  前往發布貼文
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-slate-800/30 border border-blue-500/10 rounded-lg hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{profileData.name}</span>
                    <span>{formatDateTime(post.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
