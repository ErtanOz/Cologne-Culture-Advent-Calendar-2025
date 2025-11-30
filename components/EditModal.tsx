import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { EditModalProps } from '../types';

export const EditModal: React.FC<EditModalProps> = ({ dayData, isOpen, onClose, onSave, t }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (dayData) {
      setImageUrl(dayData.imageUrl || '');
      setLinkUrl(dayData.linkUrl || '');
      setTitle(dayData.title || '');
    }
  }, [dayData]);

  if (!isOpen || !dayData) return null;

  const handleSave = () => {
    onSave(dayData.day, imageUrl, linkUrl, title);
    onClose();
  };

  const handleClear = () => {
      setImageUrl('');
      setLinkUrl('');
      setTitle('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-4 border-red-700">
        <div className="bg-red-700 p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold font-christmas">{t.editDay} {dayData.day}</h2>
          <button onClick={onClose} className="hover:bg-red-800 p-1 rounded transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t.titleLabel}</label>
            <input
              type="text"
              placeholder={t.titlePlaceholder}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">
              {t.titleHelp}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t.imageLabel}</label>
            <input
              type="url"
              placeholder={t.imagePlaceholder}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">
              {t.imageHelp}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t.linkLabel}</label>
            <input
              type="url"
              placeholder={t.linkPlaceholder}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">
              {t.linkHelp}
            </p>
          </div>

           {imageUrl && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">{t.preview}:</p>
              <div className="relative w-full h-32 bg-slate-100 rounded overflow-hidden flex items-center justify-center border border-slate-200 group">
                <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                {title && (
                   <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center truncate">
                     {title}
                   </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 flex justify-between items-center border-t border-slate-200">
          <button
             onClick={handleClear}
             className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors text-sm font-medium"
          >
              <Trash2 size={16}/> {t.clear}
          </button>
          <div className="flex gap-2">
            <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded transition-colors text-sm font-medium"
            >
                {t.cancel}
            </button>
            <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded shadow-md transition-all transform hover:scale-105 font-bold"
            >
                <Save size={18} /> {t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
