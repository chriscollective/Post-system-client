import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useState } from 'react';
import { Image, Video, Smile, Hash, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import api from '../api/axios';

interface CreatePostPageProps {
  onNavigate: (page: string) => void;
}

export function CreatePostPage({ onNavigate }: CreatePostPageProps) {
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (content.length <= maxChars) {
      setPostContent(content);
      setCharCount(content.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (postContent.trim().length === 0) {
      toast.error('貼文內容不能為空');
      return;
    }

    if (postContent.trim().length < 10) {
      toast.error('貼文內容至少需要10個字元');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/api/posts", {
        content: postContent.trim(),
      });

      const createdAt = response.data?.post?.createdAt;
      toast.success("貼文發布成功！", {
        description: createdAt
          ? `建立於 ${new Date(createdAt).toLocaleString()}`
          : "您的貼文已經發布到動態牆",
      });

      setPostContent("");
      setCharCount(0);
      onNavigate("dashboard");
    } catch (error) {
      const message =
        (error as any)?.response?.data?.message || "請稍後再試";
      toast.error("發布失敗", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickTags = ['技術分享', '學習筆記', '專案展示', '問題討論', '資源推薦'];

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/50">
            <span className="text-4xl">✍️</span>
          </div>
          <h1 className="text-3xl sm:text-4xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            製作新POST
          </h1>
          <p className="text-gray-400">分享您的想法和創意</p>
        </div>

        {/* Create Post Form */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-blue-500/20 shadow-2xl shadow-blue-500/10 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-300 text-lg">
                貼文內容
              </Label>
              <Textarea
                id="content"
                value={postContent}
                onChange={handleContentChange}
                placeholder="分享您的想法..."
                className="min-h-48 bg-slate-800/50 border-blue-500/30 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                required
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {charCount < 10 && charCount > 0 && (
                    <span className="text-yellow-400">至少需要10個字元</span>
                  )}
                </span>
                <span
                  className={`text-sm ${
                    charCount > maxChars * 0.9
                      ? 'text-red-400'
                      : charCount > maxChars * 0.7
                      ? 'text-yellow-400'
                      : 'text-gray-500'
                  }`}
                >
                  {charCount} / {maxChars}
                </span>
              </div>
            </div>

            {/* Quick Tags */}
            <div className="space-y-3">
              <Label className="text-gray-300">快速標籤</Label>
              <div className="flex flex-wrap gap-2">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const newContent = postContent + ` #${tag}`;
                      if (newContent.length <= maxChars) {
                        setPostContent(newContent);
                        setCharCount(newContent.length);
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Options */}
            <div className="space-y-3">
              <Label className="text-gray-300">添加媒體</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 border border-blue-500/20 rounded-lg hover:bg-slate-800/70 hover:border-blue-500/40 transition-all group"
                >
                  <Image className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-400">圖片</span>
                </button>
                <button
                  type="button"
                  className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 border border-blue-500/20 rounded-lg hover:bg-slate-800/70 hover:border-blue-500/40 transition-all group"
                >
                  <Video className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-400">影片</span>
                </button>
                <button
                  type="button"
                  className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 border border-blue-500/20 rounded-lg hover:bg-slate-800/70 hover:border-blue-500/40 transition-all group"
                >
                  <Smile className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-400">表情</span>
                </button>
                <button
                  type="button"
                  className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 border border-blue-500/20 rounded-lg hover:bg-slate-800/70 hover:border-blue-500/40 transition-all group"
                >
                  <Hash className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-gray-400">標籤</span>
                </button>
              </div>
            </div>

            {/* Preview Section */}
            {postContent && (
              <div className="space-y-2">
                <Label className="text-gray-300">預覽</Label>
                <div className="p-4 bg-slate-800/30 border border-blue-500/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div>
                      <p className="text-gray-200">您</p>
                      <p className="text-xs text-gray-500">現在</p>
                    </div>
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap">{postContent}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-blue-500/20">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onNavigate('dashboard')}
                className="flex-1 border border-blue-500/30 hover:bg-slate-800/50"
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || postContent.trim().length < 10}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    發布中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    發布貼文
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Tips */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-blue-500/20 shadow-lg shadow-blue-500/10 p-6 mt-6">
          <h3 className="text-lg text-blue-400 mb-3 flex items-center gap-2">
            <span>💡</span>
            貼文小技巧
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>使用標籤（#）讓更多人看到您的貼文</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>添加圖片或影片可以提高互動率</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>清楚簡潔的內容更容易獲得關注</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>分享有價值的內容能建立良好的社群形象</span>
            </li>
          </ul>
        </Card>
      </div>
    </main>
  );
}
