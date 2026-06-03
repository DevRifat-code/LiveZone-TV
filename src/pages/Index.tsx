import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ChannelCard from '@/components/ChannelCard';
import { Link } from 'react-router-dom';
import { fetchAllPlaylists, Channel } from '@/lib/m3u-parser';
import { getTVPlaylists } from '@/lib/store';
import { Tv, Play, Globe, Zap, Film, Radio, TrendingUp, Users, Monitor, ChevronRight, Loader2 } from 'lucide-react';

const features = [
  { icon: Tv, title: 'Live TV', desc: 'Watch thousands of live TV channels from around the world in real-time.' },
  { icon: Film, title: 'Movies', desc: 'Stream movies from a curated collection of international films.' },
  { icon: Globe, title: 'Worldwide', desc: 'Channels from Bangladesh, India, Pakistan, USA, and more.' },
  { icon: Zap, title: 'Instant Play', desc: 'No signup, no downloads. Just click and watch instantly.' },
];

const stats = [
  { icon: Monitor, value: '10,000+', label: 'Live Channels' },
  { icon: Film, value: '5,000+', label: 'Movies' },
  { icon: Globe, value: '50+', label: 'Countries' },
  { icon: TrendingUp, value: 'Free', label: 'No Subscription' },
];

const Index = () => {
  const [popularChannels, setPopularChannels] = useState<Channel[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  useEffect(() => {
    getTVPlaylists().then(urls => fetchAllPlaylists(urls)).then(chs => {
      const shuffled = chs.sort(() => Math.random() - 0.5).slice(0, 12);
      setPopularChannels(shuffled);
      setLoadingPopular(false);
    });
  }, []);

  return (
    <Layout>
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="hero-glow -top-48 -left-48" />
        <div className="hero-glow -bottom-48 -right-48" style={{ background: 'radial-gradient(circle, hsl(330 80% 50% / 0.08), transparent 70%)' }} />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Radio className="w-3.5 h-3.5" />
              <span className="animate-pulse">Live</span>
              Streaming Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-foreground leading-tight mb-6">
              Watch{' '}
              <span className="text-gradient">Live TV</span>
              {' '}From<br />
              <span className="text-gradient">Anywhere</span> in the World
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Stream thousands of live channels and movies for free. No signup required.
              Your gateway to global entertainment, available on any device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/live"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-hero-gradient text-white font-semibold text-base hover:opacity-90 transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <Play className="w-5 h-5" />
                Watch Live TV
              </Link>
              <Link
                to="/movies"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-base hover:bg-accent transition-all duration-200 border border-border"
              >
                <Film className="w-5 h-5" />
                Browse Movies
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 md:p-6 text-center border border-border animate-fade-in">
              <s.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-xl md:text-2xl font-display font-bold text-gradient">{s.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground">
              Popular <span className="text-gradient">Channels</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Trending live channels picked for you</p>
          </div>
          <Link to="/live" className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {loadingPopular ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground text-sm">Loading channels...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularChannels.map(ch => (
              <ChannelCard key={ch.id} channel={ch} type="tv" />
            ))}
          </div>
        )}
        <div className="text-center mt-6 sm:hidden">
          <Link to="/live" className="inline-flex items-center gap-1 text-sm text-primary font-medium">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-4">
            Why Choose <span className="text-gradient">LiveZone</span>?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            The best free streaming experience across all your devices.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card-elevated rounded-xl p-6 border border-border text-center group animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 p-8 md:p-16 text-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to Start Watching?
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto text-lg">
              Jump into thousands of channels right now. Free, fast, and available worldwide.
            </p>
            <Link
              to="/live"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-purple-700 font-semibold hover:bg-white/90 transition-all duration-200 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Start Watching
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
