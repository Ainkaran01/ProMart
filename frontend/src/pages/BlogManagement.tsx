import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
}

const BlogManagement = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Getting Started with B2B Marketing',
      excerpt: 'Essential strategies for successful B2B marketing campaigns',
      content: 'Full content here...',
      author: 'Admin',
      date: '2024-01-15',
      image: '/placeholder.svg',
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentPost.id) {
      setPosts(posts.map(p => p.id === currentPost.id ? currentPost as BlogPost : p));
      toast({ title: 'Blog post updated successfully' });
    } else {
      const newPost: BlogPost = {
        ...currentPost,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        author: 'Admin',
      } as BlogPost;
      setPosts([newPost, ...posts]);
      toast({ title: 'Blog post created successfully' });
    }
    
    setIsEditing(false);
    setCurrentPost({});
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
    toast({ title: 'Blog post deleted' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blog Management</h2>
          <p className="text-muted-foreground">Create and manage blog posts</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={currentPost.title || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={currentPost.excerpt || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                required
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={currentPost.content || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                required
                rows={10}
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={currentPost.image || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                {currentPost.id ? 'Update' : 'Create'} Post
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentPost({});
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold">{post.title}</h3>
                    <p className="mb-2 text-sm text-muted-foreground">{post.excerpt}</p>
                    <p className="text-xs text-muted-foreground">
                      By {post.author} • {new Date(post.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCurrentPost(post);
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
