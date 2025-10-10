import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Lottie from 'lottie-react';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('https://assets3.lottiefiles.com/packages/lf20_w98qte06.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(() => console.log('Animation loading failed'));
  }, []);

  const blogPosts = [
    {
      id: '1',
      title: '10 Tips for Creating an Effective B2B Listing',
      excerpt:
        'Learn the best practices for creating listings that attract verified business partners and drive real results.',
      category: 'Tips & Tricks',
      author: 'Sarah Johnson',
      date: '2024-01-15',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    },
    {
      id: '2',
      title: 'The Future of B2B Marketplaces in 2024',
      excerpt:
        'Explore the emerging trends and technologies shaping the future of business-to-business commerce.',
      category: 'Industry Insights',
      author: 'Michael Chen',
      date: '2024-01-12',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    },
    {
      id: '3',
      title: 'How to Verify Your Business for Maximum Trust',
      excerpt:
        'A comprehensive guide to business verification and building credibility on B2B platforms.',
      category: 'Guides',
      author: 'Emily Rodriguez',
      date: '2024-01-10',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    },
    {
      id: '4',
      title: 'Success Story: From Startup to Enterprise Partner',
      excerpt:
        'Read how TechFlow scaled their business by leveraging ProMart to find the right partners.',
      category: 'Success Stories',
      author: 'David Park',
      date: '2024-01-08',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    },
    {
      id: '5',
      title: 'Understanding B2B Payment Terms and Negotiations',
      excerpt:
        'Master the art of B2B negotiations with our expert insights on payment terms and contracts.',
      category: 'Business Finance',
      author: 'Lisa Thompson',
      date: '2024-01-05',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    },
    {
      id: '6',
      title: 'Building Long-Term B2B Relationships',
      excerpt:
        'Discover strategies for maintaining strong business relationships that stand the test of time.',
      category: 'Relationships',
      author: 'James Wilson',
      date: '2024-01-03',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    },
  ];

  const categories = ['All', 'Tips & Tricks', 'Industry Insights', 'Guides', 'Success Stories', 'Business Finance', 'Relationships'];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left text-primary-foreground"
            >
              <h1 className="mb-6 text-5xl font-bold tracking-tight">ProMart Blog</h1>
              <p className="text-xl opacity-95">
                Insights, tips, and success stories from the B2B marketplace
              </p>
            </motion.div>
            {animationData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block"
              >
                <Lottie animationData={animationData} loop={true} />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4">Featured Post</Badge>
            <Card className="gradient-card overflow-hidden shadow-premium">
              <div className="grid md:grid-cols-2">
                <div className="relative h-80 md:h-auto">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center p-8">
                  <Badge variant="secondary" className="mb-4 w-fit">
                    {blogPosts[0].category}
                  </Badge>
                  <h2 className="mb-4 text-3xl font-bold">{blogPosts[0].title}</h2>
                  <p className="mb-6 text-muted-foreground">{blogPosts[0].excerpt}</p>
                  <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {blogPosts[0].author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(blogPosts[0].date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {blogPosts[0].readTime}
                    </div>
                  </div>
                  <Link to={`/blog/${blogPosts[0].id}`}>
                    <Button className="w-fit">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Latest Articles</h2>
          {filteredPosts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No articles found in this category</p>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.slice(1).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="gradient-card group h-full overflow-hidden shadow-md transition-all hover:shadow-premium">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <Badge variant="secondary" className="mb-3">
                        {post.category}
                      </Badge>
                      <h3 className="mb-3 text-xl font-semibold group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>
                      <Link to={`/blog/${post.id}`}>
                        <Button variant="ghost" className="group -ml-4 p-0">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t bg-gradient-to-br from-muted/30 to-background py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold">Stay Updated</h2>
            <p className="mb-6 text-muted-foreground">
              Subscribe to our newsletter for the latest B2B insights and success stories
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:w-80"
              />
              <Button size="lg">Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
