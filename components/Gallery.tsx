
import React from 'react';
import type { Dish } from '../types';
import GalleryItem from './GalleryItem';
import { CameraIcon } from './icons';

interface GalleryProps {
  dishes: Dish[];
  onEditDish: (dish: Dish) => void;
}

const Gallery: React.FC<GalleryProps> = ({ dishes, onEditDish }) => {
  if (dishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-700">
        <CameraIcon className="w-20 h-20 mb-4" />
        <h3 className="text-2xl font-bold text-gray-400">Your Photo Gallery</h3>
        <p className="mt-2 max-w-sm">
          Generated food photos will appear here once you enter a menu and click 'Generate'.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-800/50 rounded-2xl border border-gray-700 h-full overflow-y-auto">
      {dishes.map((dish) => (
        <GalleryItem key={dish.id} dish={dish} onEdit={onEditDish} />
      ))}
    </div>
  );
};

export default Gallery;
