import { useState } from 'react';
import Layout from '@/components/Layout';
import { Mail, MapPin, Send, CheckCircle2, Loader2, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return; }
    if (!message.trim()) { setError('Please enter your message.'); return; }

    setSending(true);

    if (API_URL) {
      try {
        const res = await fetch(`${API_URL}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to send message');
        }
      } catch (err: any) {
        setSending(false);
        setError(err.message || 'Network error. Please try again later.');
        return;
      }
    } else {
      await new Promise(r => setTimeout(r, 800));
      try {
        const existing = JSON.parse(localStorage.getItem('livezone_contact_messages') || '[]');
        existing.push({ name: name.trim(), email: email.trim(), message: message.trim(), date: new Date().toISOString() });
        localStorage.setItem('livezone_contact_messages', JSON.stringify(existing));
      } catch {}
    }

    setSending(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 max-w-lg text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-3">Message Sent!</h1>
          <p className="text-muted-foreground mb-8">Thank you for reaching out. We'll get back to you at <strong className="text-foreground">{email}</strong> as soon as possible.</p>
          <button onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); }}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
            Send Another Message
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-6">Contact Us</h1>
        <p className="text-muted-foreground mb-8">Have questions, feedback, or concerns? We'd love to hear from you.</p>
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="card-elevated rounded-xl border border-border p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">contact@livezone.tv</p>
            </div>
          </div>
          <div className="card-elevated rounded-xl border border-border p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Location</h3>
              <p className="text-sm text-muted-foreground">Worldwide — Available Everywhere</p>
            </div>
          </div>
        </div>
        <div className="card-elevated rounded-xl border border-border p-6">
          <h2 className="font-display font-semibold text-foreground mb-4">Send a Message</h2>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
            <input placeholder="Your Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
            <textarea placeholder="Your Message" rows={5} value={message} onChange={e => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none" />
            <button disabled={sending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-hero-gradient text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
