import React from 'react';
import { DayWindowProps } from '../types';
import { Edit2, ExternalLink, HelpCircle } from 'lucide-react';

export const DayWindow: React.FC<DayWindowProps> = ({ dayData, isEditMode, onEdit, editLabel }) => {
  const hasContent = Boolean(dayData.imageUrl);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      onEdit(dayData);
    } else {
      if (hasContent && dayData.linkUrl) {
        window.open(dayData.linkUrl, '_blank', 'noopener,noreferrer');
      }
      // If no content, do nothing (or maybe show a tooltip in a future version)
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative group aspect-square rounded-lg overflow-hidden shadow-lg transform transition-all duration-300
        border-2 
        ${hasContent ? 'bg-white border-gold-400 hover:scale-105 cursor-pointer' : 'bg-red-800 border-red-600 cursor-default'}
        ${isEditMode ? 'hover:ring-4 ring-blue-400 cursor-pointer animate-pulse-slow' : ''}
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

      {/* Number Badge */}
      <div className="absolute top-2 left-2 z-10">
        <div className={`
          flex items-center justify-center w-8 h-8 rounded-full font-christmas font-bold text-lg shadow-sm
          ${hasContent 
            ? 'bg-red-700 text-white shadow-black/40' 
            : 'bg-white/10 text-white backdrop-blur-sm border border-white/20'}
        `}>
          {dayData.day}
        </div>
      </div>

      {/* Edit Mode Overlay */}
      {isEditMode && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div className="bg-white text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Edit2 size={12} /> {editLabel}
          </div>
        </div>
      )}

      {/* Hover Link Indicator (User View) */}
      {!isEditMode && hasContent && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
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
