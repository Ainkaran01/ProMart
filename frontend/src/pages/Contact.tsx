import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Lottie from 'lottie-react';

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    fetch('https://assets8.lottiefiles.com/packages/lf20_u25cckyh.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(() => console.log('Animation loading failed'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: 'Message sent!',
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      detail: 'contact@promart.com',
      link: 'mailto:contact@promart.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      detail: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      detail: '123 Business Ave, Suite 100, San Francisco, CA 94105',
      link: 'https://maps.google.com',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      detail: 'Mon-Fri: 9:00 AM - 6:00 PM PST',
      link: null,
    },
  ];

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
              <MessageSquare className="mb-6 h-16 w-16 lg:mx-0 mx-auto" />
              <h1 className="mb-6 text-5xl font-bold tracking-tight">Get in Touch</h1>
              <p className="text-xl opacity-95">
                Have questions? We'd love to hear from you. Send us a message and we'll respond
                as soon as possible.
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

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="mb-4 text-2xl font-bold">Contact Information</h2>
                  <p className="text-muted-foreground">
                    Reach out to us through any of these channels
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <Card
                      key={info.title}
                      className="gradient-card p-6 shadow-md transition-all hover:shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold">{info.title}</h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-muted-foreground hover:text-primary"
                            >
                              {info.detail}
                            </a>
                          ) : (
                            <p className="text-sm text-muted-foreground">{info.detail}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

              
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="gradient-card p-8 shadow-premium">
                  <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        placeholder="Tell us more about your inquiry..."
                        rows={8}
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full" size="lg">
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      We typically respond within 24 hours
                    </p>
                  </form>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Visit Our Office</h2>
            <p className="mb-8 text-muted-foreground">
              We welcome you to visit our headquarters in San Francisco
            </p>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0977641932937!2d-122.41941668468186!3d37.77492997975903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1619721181829!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="ProMart Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
