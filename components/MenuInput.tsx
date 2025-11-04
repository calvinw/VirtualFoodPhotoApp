import React from 'react';
import type { PhotoStyle } from '../types';
import { CameraIcon } from './icons';

interface MenuInputProps {
  menuText: string;
  setMenuText: (text: string) => void;
  selectedStyle: PhotoStyle;
  setSelectedStyle: (style: PhotoStyle) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const styles: PhotoStyle[] = ['Rustic/Dark', 'Bright/Modern', 'Social Media'];

const MenuInput: React.FC<MenuInputProps> = ({
  menuText,
  setMenuText,
  selectedStyle,
  setSelectedStyle,
  onGenerate,
  isLoading,
}) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-lg h-full">
      <div>
        <label htmlFor="menu-input" className="block text-lg font-semibold text-gray-700 mb-2">
          1. Paste Your Menu
        </label>
        <textarea
          id="menu-input"
          value={menuText}
          onChange={(e) => setMenuText(e.target.value)}
          placeholder="e.g.&#10;Spaghetti Carbonara&#10;Margherita Pizza&#10;Tiramisu"
          className="w-full h-48 p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none placeholder-gray-400 text-gray-800"
          disabled={isLoading}
        ></textarea>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">2. Select a Style</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              disabled={isLoading}
              className={`p-3 rounded-lg text-center font-medium transition-all duration-300 border-2 whitespace-nowrap ${
                selectedStyle === style
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <button
          onClick={onGenerate}
          disabled={isLoading || !menuText.trim()}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/20 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <CameraIcon className="w-6 h-6" />
              Generate Photos
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MenuInput;