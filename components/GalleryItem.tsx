
import React from 'react';
import type { Dish } from '../types';
import Spinner from './Spinner';
import { EditIcon } from './icons';

interface GalleryItemProps {
  dish: Dish;
  onEdit: (dish: Dish) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ dish, onEdit }) => {
  return (
    <div className="group relative aspect-w-4 aspect-h-3 bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border border-gray-700">
      {dish.isGenerating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
          <Spinner className="w-10 h-10" />
          <p className="text-gray-300 mt-3">Creating masterpiece...</p>
        </div>
      )}
      {dish.imageUrl && (
        <img
          src={dish.imageUrl}
          alt={dish.name}
          className="object-cover w-full h-full"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h4 className="text-white font-bold text-lg truncate">{dish.name}</h4>
      </div>
      {!dish.isGenerating && dish.imageUrl && (
         <div className="absolute top-3 right-3">
          <button
              onClick={() => onEdit(dish)}
              className="p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-600"
              aria-label={`Edit photo for ${dish.name}`}
            >
              <EditIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryItem;
