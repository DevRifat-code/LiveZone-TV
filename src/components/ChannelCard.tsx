import { Play, Tv } from 'lucide-react';
import { Channel } from '@/lib/m3u-parser';
import { useNavigate } from 'react-router-dom';

interface ChannelCardProps {
  channel: Channel;
  type?: 'tv' | 'movie';
}

const ChannelCard = ({ channel, type = 'tv' }: ChannelCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const path = type === 'movie' ? '/movies/watch' : '/live/watch';
    navigate(`${path}?url=${encodeURIComponent(channel.url)}&name=${encodeURIComponent(channel.name)}`);
  };

  return (
    <button
      onClick={handleClick}
      className="card-elevated rounded-xl overflow-hidden text-left w-full group cursor-pointer border border-border focus:outline-none focus:ring-2 focus:ring-ring active:scale-[0.98] transition-all duration-200"
    >
      <div className="aspect-video bg-gradient-to-br from-accent to-background flex items-center justify-center relative overflow-hidden">
        {channel.logo ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`flex flex-col items-center justify-center ${channel.logo ? 'hidden' : ''}`}>
          <Tv className="w-10 h-10 text-primary/30" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Play className="w-5 h-5 text-white ml-0.5" />
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground font-medium backdrop-blur-sm">
            {type === 'movie' ? 'Movie' : 'Live'}
          </span>
        </div>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
          {channel.name}
        </h3>
        {channel.group && channel.group !== 'Uncategorized' && (
          <span className="text-xs text-muted-foreground mt-1 block truncate">
            {channel.group}
          </span>
        )}
      </div>
    </button>
  );
};

export default ChannelCard;
