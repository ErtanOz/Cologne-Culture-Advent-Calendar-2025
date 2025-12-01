
import React, { useState, useCallback } from 'react';
import { DayWindowProps } from '../types';
import { Edit2, ExternalLink, HelpCircle, Share2, Check, Lock, Link as LinkIcon } from 'lucide-react';

export const DayWindow: React.FC<DayWindowProps> = ({ dayData, isEditMode, onEdit, editLabel, shareLabel, copyLabel, copiedLabel, lockedLabel }) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isShareCopied, setIsShareCopied] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  
  const hasContent = Boolean(dayData.imageUrl);

  // Web Audio API Helper to avoid external file issues
  const playSynthesizedSound = useCallback((type: 'open' | 'locked' | 'hover') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      const playTone = (freq: number, startTime: number, duration: number, vol: number = 0.1, wave: OscillatorType = 'sine') => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;

      if (type === 'open') {
        // Magic Chime: C Major Arpeggio
        playTone(523.25, now, 0.8, 0.1);       // C5
        playTone(659.25, now + 0.1, 0.8, 0.1); // E5
        playTone(783.99, now + 0.2, 0.8, 0.1); // G5
        playTone(1046.50, now + 0.3, 1.2, 0.15); // C6
        playTone(1318.51, now + 0.4, 1.5, 0.05); // E6 (Sparkle)
      } else if (type === 'locked') {
        // Wood Thud: Low Triangle wave with rapid pitch drop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        
        // Pitch drop effect
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'hover') {
        // Soft Ting: Very high, very short, very quiet
        playTone(1200, now, 0.05, 0.03); 
      }

    } catch (e) {
      console.warn("Audio synth failed", e);
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // If clicking a button inside, prevent main click
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    if (isEditMode) {
      e.preventDefault();
      onEdit(dayData);
    } else {
      if (hasContent && dayData.linkUrl) {
        // Play festive sound when opening content
        playSynthesizedSound('open');
        
        // Open link immediately (popup blockers might block setTimeout)
        // Using a tiny timeout to allow the sound to start triggering is usually fine,
        // but robust apps open immediately. We'll stick to the existing behavior but optimize.
        setTimeout(() => {
             window.open(dayData.linkUrl, '_blank', 'noopener,noreferrer');
        }, 300);
      } else if (!hasContent) {
        // Trigger shake effect, sound and message for locked/empty windows
        playSynthesizedSound('locked');
        setIsShaking(true);
        setShowLockedMessage(true);
        setTimeout(() => setIsShaking(false), 500); // Duration matches CSS animation
        setTimeout(() => setShowLockedMessage(false), 2500); // Hide message after 2.5s
      }
    }
  };

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('day', dayData.day.toString());
    url.searchParams.delete('admin');
    return url.toString();
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = getShareUrl();
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy link', err);
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = getShareUrl();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: dayData.title || `Day ${dayData.day} - Advent Calendar`,
          text: `Check out what's behind window ${dayData.day}!`,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share dismissed', err);
      }
    } else {
      // Fallback to copy if native share isn't supported
      navigator.clipboard.writeText(shareUrl).then(() => {
        setIsShareCopied(true);
        setTimeout(() => setIsShareCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy link', err);
      });
    }
  };

  return (
    <div
      id={`day-${dayData.day}`}
      onClick={handleClick}
      onMouseEnter={() => {
        if (!isEditMode && hasContent) {
          playSynthesizedSound('hover');
        }
      }}
      className={`
        relative group aspect-square rounded-lg overflow-hidden shadow-lg transform transition-all duration-300
        border-2 cursor-pointer
        ${hasContent ? 'bg-white border-gold-400 hover:scale-105' : 'bg-red-800 border-red-600 hover:scale-[1.02]'}
        ${isEditMode ? 'hover:ring-4 ring-blue-400 animate-pulse-slow' : ''}
        ${isShaking ? 'animate-shake' : ''}
      `}
    >
      {/* Background/Content Layer */}
      <div className="absolute inset-0 flex items-center justify-center">
        {hasContent ? (
          <>
            <img
              src={dayData.imageUrl}
              alt={dayData.title || `Day ${dayData.day}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {dayData.title && (
               <div className="absolute bottom-0 left-0 right-0 p-2 pt-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-center">
                 <p className="text-white text-sm font-bold font-sans tracking-wide drop-shadow-md truncate text-center w-full px-1">
                   {dayData.title}
                 </p>
               </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-red-300/50">
             <HelpCircle size={48} strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Number Badge (Top Left) */}
      <div className="absolute top-2 left-2 z-20">
        <div className={`
          flex items-center justify-center w-8 h-8 rounded-full font-christmas font-bold text-lg shadow-sm
          ${hasContent 
            ? 'bg-red-700 text-white shadow-black/40' 
            : 'bg-white/10 text-white backdrop-blur-sm border border-white/20'}
        `}>
          {dayData.day}
        </div>
      </div>

      {/* Action Buttons (Top Right) - Only if content exists and not in edit mode */}
      {!isEditMode && hasContent && (
        <div className="absolute top-2 right-2 z-30 flex gap-2">
          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            aria-label={copyLabel}
            className={`
              flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-all duration-300
              ${isLinkCopied 
                ? 'bg-green-600 text-white scale-110' 
                : 'bg-black/50 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm'}
            `}
            title={isLinkCopied ? copiedLabel : copyLabel}
          >
            {isLinkCopied ? <Check size={16} strokeWidth={3} /> : <LinkIcon size={16} />}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            aria-label={shareLabel}
            className={`
              flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-all duration-300
              ${isShareCopied 
                ? 'bg-green-600 text-white scale-110' 
                : 'bg-black/50 text-white hover:bg-white hover:text-red-700 backdrop-blur-sm'}
            `}
            title={isShareCopied ? copiedLabel : shareLabel}
          >
            {isShareCopied ? <Check size={16} strokeWidth={3} /> : <Share2 size={16} />}
          </button>
        </div>
      )}

      {/* Edit Mode Overlay */}
      {isEditMode && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div className="bg-white text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Edit2 size={12} /> {editLabel}
          </div>
        </div>
      )}

      {/* Locked Message Overlay (Appears when clicked on empty) */}
      {showLockedMessage && !hasContent && !isEditMode && (
         <div className="absolute inset-0 z-40 bg-black/80 flex items-center justify-center animate-fade-in text-center p-2">
            <div className="text-white font-christmas text-lg drop-shadow-md flex flex-col items-center gap-1">
               <Lock size={24} className="text-red-400 mb-1" />
               <span>{lockedLabel}</span>
            </div>
         </div>
      )}

      {/* Hover Link Indicator (User View) */}
      {!isEditMode && hasContent && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-10 pointer-events-none">
           <ExternalLink className="text-white drop-shadow-md transform scale-0 group-hover:scale-100 transition-transform duration-300" size={32} />
        </div>
      )}

      {/* Door Pattern (Texture for empty days) */}
      {!hasContent && (
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
      )}
    </div>
  );
};
