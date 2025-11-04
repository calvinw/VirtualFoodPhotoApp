
import React, { useState } from 'react';
import type { Dish } from '../types';
import Spinner from './Spinner';

interface EditModalProps {
  dish: Dish | null;
  onClose: () => void;
  onApplyEdit: (dish: Dish, prompt: string) => Promise<void>;
}

const EditModal: React.FC<EditModalProps> = ({ dish, onClose, onApplyEdit }) => {
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!dish) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsEditing(true);
    setError(null);
    try {
      await onApplyEdit(dish, prompt);
      onClose();
    } catch (err) {
      setError('Failed to edit image. Please try again.');
      console.error(err);
    } finally {
      setIsEditing(false);
    }
  };
  
  const handleClose = () => {
    if (isEditing) return;
    onClose();
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ animationFillMode: 'forwards' }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Edit Photo: <span className="text-blue-400">{dish.name}</span></h2>
            <button onClick={handleClose} disabled={isEditing} className="text-gray-400 hover:text-white transition-colors">&times;</button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
                <img src={dish.imageUrl!} alt={`Editing ${dish.name}`} className="rounded-lg object-cover w-full aspect-square" />
            </div>

            <form onSubmit={handleSubmit} className="md:w-1/2 flex flex-col">
              <label htmlFor="edit-prompt" className="block text-lg font-semibold text-gray-300 mb-2">
                Describe your edit
              </label>
              <textarea
                id="edit-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Add a retro filter, remove the background, make it look more vibrant..."
                className="w-full flex-grow p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 resize-none"
                disabled={isEditing}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button 
                type="submit" 
                disabled={isEditing || !prompt.trim()}
                className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {isEditing ? (
                  <>
                    <Spinner className="w-5 h-5" />
                    Applying...
                  </>
                ) : (
                  'Apply Edit'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EditModal;
