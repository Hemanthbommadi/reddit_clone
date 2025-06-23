import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

interface Post {
  id: string;
  user_id: string;
  image_url: string;
  caption: string;
  created_at: string;
  likes: number;
  user: {
    username: string;
    avatar_url: string;
  };
}

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {posts.map((post) => (
        <div key={post.id} className="bg-white border rounded-lg mb-8">
          <div className="flex items-center p-4">
            <img
              src={post.user.avatar_url || 'https://via.placeholder.com/40'}
              alt={post.user.username}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="ml-3 font-semibold">{post.user.username}</span>
          </div>
          
          <img
            src={post.image_url}
            alt={post.caption}
            className="w-full aspect-square object-cover"
          />
          
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <div className="flex space-x-4">
                <button className="hover:text-red-500">
                  <Heart className="h-6 w-6" />
                </button>
                <button className="hover:text-blue-500">
                  <MessageCircle className="h-6 w-6" />
                </button>
                <button className="hover:text-green-500">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
              <button className="hover:text-yellow-500">
                <Bookmark className="h-6 w-6" />
              </button>
            </div>
            
            <div className="font-semibold mb-2">{post.likes} likes</div>
            
            <div className="space-y-2">
              <p>
                <span className="font-semibold mr-2">{post.user.username}</span>
                {post.caption}
              </p>
              <p className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}