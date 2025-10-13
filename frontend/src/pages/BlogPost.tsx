import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowLeft, Share2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const blogPosts = [
    {
      id: '1',
      title: '10 Tips for Creating an Effective B2B Listing',
      excerpt:
        'Learn the best practices for creating listings that attract verified business partners and drive real results.',
      content: `
        <h2>Introduction</h2>
        <p>Creating an effective B2B listing is crucial for attracting the right business partners and driving meaningful results. In this comprehensive guide, we'll explore the top 10 tips that will help you create listings that stand out in the marketplace.</p>
        
        <h2>1. Write Clear and Compelling Headlines</h2>
        <p>Your headline is the first thing potential partners see. Make it count by being specific, clear, and highlighting your unique value proposition. Avoid jargon and focus on the benefits you provide.</p>
        
        <h2>2. Use High-Quality Images</h2>
        <p>Visual content significantly impacts engagement. Use professional, high-resolution images that showcase your products or services. Include multiple angles and use cases to give potential partners a complete picture.</p>
        
        <h2>3. Provide Detailed Descriptions</h2>
        <p>Don't leave potential partners guessing. Include comprehensive information about your offerings, specifications, pricing structures, and delivery terms. The more transparent you are, the more trust you build.</p>
        
        <h2>4. Highlight Your Unique Selling Points</h2>
        <p>What makes you different from competitors? Whether it's your technology, customer service, pricing, or experience, make sure your unique advantages are front and center.</p>
        
        <h2>5. Include Social Proof</h2>
        <p>Testimonials, case studies, and certifications build credibility. Include them in your listing to show potential partners that others have had positive experiences working with you.</p>
        
        <h2>6. Optimize for Search</h2>
        <p>Use relevant keywords naturally throughout your listing. Think about what terms your ideal partners would search for and incorporate them into your title and description.</p>
        
        <h2>7. Keep Information Updated</h2>
        <p>Regularly review and update your listings to ensure all information is current. Outdated information can lead to confusion and lost opportunities.</p>
        
        <h2>8. Respond Quickly to Inquiries</h2>
        <p>Fast response times show professionalism and eagerness to do business. Set up notifications and aim to respond to inquiries within 24 hours.</p>
        
        <h2>9. Use Clear Call-to-Actions</h2>
        <p>Tell potential partners exactly what you want them to do next. Whether it's requesting a quote, scheduling a demo, or downloading a catalog, make the next steps obvious.</p>
        
        <h2>10. Monitor and Improve</h2>
        <p>Track your listing's performance and continuously optimize. Use analytics to understand what works and make data-driven improvements.</p>
        
        <h2>Conclusion</h2>
        <p>Creating an effective B2B listing takes effort, but the results are worth it. By following these 10 tips, you'll be well on your way to attracting quality business partners and growing your network.</p>
      `,
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
      content: `
        <h2>Introduction</h2>
        <p>The B2B marketplace landscape is evolving rapidly, driven by technological innovation and changing business needs. Let's explore the key trends shaping the future of B2B commerce in 2024 and beyond.</p>
        
        <h2>AI-Powered Matching</h2>
        <p>Artificial intelligence is revolutionizing how businesses find partners. Advanced algorithms analyze company profiles, past transactions, and market trends to suggest the most relevant connections, saving time and improving match quality.</p>
        
        <h2>Blockchain for Trust and Transparency</h2>
        <p>Blockchain technology is being adopted to create immutable records of transactions, certifications, and business credentials. This enhances trust and reduces fraud in B2B transactions.</p>
        
        <h2>Video Integration</h2>
        <p>Video content is becoming essential for product demonstrations, virtual factory tours, and building personal connections. Expect to see more integrated video features in B2B platforms.</p>
        
        <h2>Sustainability Focus</h2>
        <p>Environmental, Social, and Governance (ESG) criteria are increasingly important in B2B relationships. Marketplaces are adding features to help businesses showcase their sustainability credentials.</p>
        
        <h2>Conclusion</h2>
        <p>The future of B2B marketplaces is exciting, with technology enabling more efficient, transparent, and sustainable business relationships.</p>
      `,
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
      content: `
        <h2>Why Business Verification Matters</h2>
        <p>In the B2B world, trust is everything. Business verification is your opportunity to prove your legitimacy and build confidence with potential partners. Let's explore how to maximize your verification status.</p>
        
        <h2>Gather Required Documents</h2>
        <p>Start by collecting all necessary documentation: business registration, tax identification, proof of address, and any relevant licenses or certifications. Having these ready streamlines the verification process.</p>
        
        <h2>Complete Your Profile</h2>
        <p>A fully completed profile signals professionalism and transparency. Fill in all sections including company history, team information, and detailed service offerings.</p>
        
        <h2>Add Industry Certifications</h2>
        <p>If you hold industry-specific certifications like ISO standards, quality certifications, or trade memberships, make sure to include them. These significantly boost credibility.</p>
        
        <h2>Provide References</h2>
        <p>Business references from established companies demonstrate your track record. Request permission to list current clients or partners as references.</p>
        
        <h2>Maintain Your Status</h2>
        <p>Verification isn't a one-time event. Keep your information updated, renew certifications promptly, and maintain high standards in your business relationships.</p>
      `,
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
      content: `
        <h2>The Beginning</h2>
        <p>TechFlow started as a small software development company with big ambitions. Founded in 2020, they struggled to find enterprise clients who would trust a young startup.</p>
        
        <h2>Discovering ProMart</h2>
        <p>In early 2022, TechFlow joined ProMart as a company member. They completed their verification process and created detailed listings showcasing their capabilities.</p>
        
        <h2>The Breakthrough</h2>
        <p>Within three months, TechFlow connected with a Fortune 500 company looking for development partners. The verified status and detailed portfolio on ProMart gave the enterprise client confidence to proceed.</p>
        
        <h2>Scaling Up</h2>
        <p>That first major contract led to referrals and more opportunities. TechFlow went from 5 employees to 50 in just two years, all while maintaining the relationships they built through ProMart.</p>
        
        <h2>Key Takeaways</h2>
        <p>TechFlow's success demonstrates the power of trust, verification, and having the right platform to showcase your capabilities to potential partners.</p>
      `,
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
      content: `
        <h2>Introduction to B2B Payment Terms</h2>
        <p>Navigating payment terms is crucial for healthy B2B relationships. Understanding common terms and negotiation strategies can make the difference between success and cash flow problems.</p>
        
        <h2>Common Payment Terms</h2>
        <p>Net 30, Net 60, and Net 90 are standard in B2B transactions. Learn what each means, when they're appropriate, and how they impact your cash flow planning.</p>
        
        <h2>Negotiation Strategies</h2>
        <p>Effective negotiation balances your needs with your partner's constraints. Consider offering early payment discounts or flexible terms based on order volume.</p>
        
        <h2>Risk Mitigation</h2>
        <p>Protect your business with appropriate contracts, credit checks, and payment guarantees. Learn when to require deposits or milestone payments for large projects.</p>
        
        <h2>Building Long-Term Relationships</h2>
        <p>Fair payment terms build trust and encourage repeat business. Find the balance that works for both parties and maintains healthy partnerships.</p>
      `,
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
      content: `
        <h2>The Foundation of Strong Relationships</h2>
        <p>Long-term B2B relationships are built on trust, communication, and mutual value. Let's explore the strategies that turn one-time transactions into lasting partnerships.</p>
        
        <h2>Consistent Communication</h2>
        <p>Regular check-ins, updates, and transparent communication prevent misunderstandings and show your commitment to the partnership.</p>
        
        <h2>Deliver on Promises</h2>
        <p>Nothing builds trust faster than consistently meeting or exceeding expectations. Under-promise and over-deliver whenever possible.</p>
        
        <h2>Adapt and Grow Together</h2>
        <p>The best partnerships evolve as both businesses grow. Be open to adjusting terms, exploring new opportunities, and supporting each other's success.</p>
        
        <h2>Handle Challenges Professionally</h2>
        <p>Problems will arise. How you handle them defines the relationship. Be proactive, solution-oriented, and fair in resolving issues.</p>
        
        <h2>Celebrate Successes</h2>
        <p>Acknowledge milestones and wins together. Recognizing shared achievements strengthens bonds and motivates continued collaboration.</p>
      `,
      category: 'Relationships',
      author: 'James Wilson',
      date: '2024-01-03',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    },
  ];

  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 text-3xl font-bold text-slate-800">Post Not Found</h1>
          <Link to="/blog">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied to clipboard!' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/blog">
              <Button 
                variant="ghost" 
                className="mb-6 text-slate-300 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 border-0">
              {post.category}
            </Badge>

            <h1 
              className="mb-6 text-4xl font-bold md:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {post.title}
            </h1>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="border-amber-500 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 backdrop-blur-sm bg-white/5"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-background"
          >
            <path
              d="M0 120L1440 120L1440 0C1440 0 1080 80 720 80C360 80 0 0 0 0L0 120Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 bg-background">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-8 overflow-hidden rounded-2xl shadow-lg">
              <img
                src={post.image}
                alt={post.title}
                className="h-96 w-full object-cover"
              />
            </div>

            <Card className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-8 shadow-lg">
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-2xl prose-p:mb-4 prose-p:text-slate-600 prose-strong:text-slate-800 prose-headings:text-slate-800 prose-ul:text-slate-600 prose-ol:text-slate-600 prose-li:text-slate-600 prose-blockquote:border-amber-500 prose-blockquote:text-slate-600"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </Card>

            {/* Related Articles */}
            <div className="mt-16 border-t border-slate-200 pt-12">
              <h3 
                className="mb-8 text-2xl font-bold text-slate-800"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Related Articles
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {blogPosts
                  .filter((p) => p.id !== id && p.category === post.category)
                  .slice(0, 2)
                  .map((relatedPost) => (
                    <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`}>
                      <Card className="group h-full rounded-2xl overflow-hidden border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-6">
                          <Badge variant="secondary" className="mb-3 bg-slate-100 text-slate-700">
                            {relatedPost.category}
                          </Badge>
                          <h4 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                            {relatedPost.title}
                          </h4>
                        </div>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Back to Blog CTA */}
            <div className="mt-12 text-center">
              <Link to="/blog">
                <Button 
                  variant="outline"
                  className="border-amber-500 text-amber-600 hover:bg-amber-50 group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to All Articles
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 to-slate-800 text-white mb-5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="mb-4 text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to Grow Your Business?
            </h2>
            <p className="mb-10 text-lg text-slate-300 max-w-2xl mx-auto">
              Join thousands of businesses already succeeding with ProMart.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-amber-500/40 transition-all duration-300 group"
              onClick={() => window.location.href = '/register'}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;