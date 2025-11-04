
import React, { useState, useCallback } from 'react';
import type { Dish, PhotoStyle } from './types';
import { generateFoodImage, editFoodImage } from './services/geminiService';
import MenuInput from './components/MenuInput';
import Gallery from './components/Gallery';
import EditModal from './components/EditModal';

const App: React.FC = () => {
  const [menuText, setMenuText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<PhotoStyle>('Bright/Modern');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const handleGeneratePhotos = useCallback(async () => {
    if (!menuText.trim()) return;
    setIsLoading(true);

    const dishNames = menuText.split('\n').filter(name => name.trim() !== '');
    const initialDishes: Dish[] = dishNames.map(name => ({
      id: crypto.randomUUID(),
      name,
      imageUrl: null,
      isGenerating: true,
      editHistory: [],
    }));

    setDishes(initialDishes);

    const generationPromises = initialDishes.map(async (dish) => {
      try {
        const imageUrl = await generateFoodImage(dish.name, selectedStyle);
        setDishes(prevDishes =>
          prevDishes.map(d =>
            d.id === dish.id ? { ...d, imageUrl, isGenerating: false, editHistory: [imageUrl] } : d
          )
        );
      } catch (error) {
        console.error(`Failed to generate image for ${dish.name}:`, error);
        setDishes(prevDishes =>
          prevDishes.map(d => (d.id === dish.id ? { ...d, isGenerating: false } : d))
        );
      }
    });

    await Promise.allSettled(generationPromises);
    setIsLoading(false);
  }, [menuText, selectedStyle]);

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
  };
  
  const handleCloseModal = () => {
    setEditingDish(null);
  };

  const handleApplyEdit = async (dishToEdit: Dish, prompt: string) => {
    if (!dishToEdit.imageUrl) return;

    try {
      const newImageUrl = await editFoodImage(dishToEdit.imageUrl, prompt);
      setDishes(prevDishes =>
        prevDishes.map(d =>
          d.id === dishToEdit.id
            ? { ...d, imageUrl: newImageUrl, editHistory: [...d.editHistory, newImageUrl] }
            : d
        )
      );
    } catch (error) {
        console.error("Editing failed in App component", error);
        throw error; // Re-throw to be caught in the modal
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Virtual Food Photographer
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Turn your menu into stunning, AI-generated food photography.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[70vh]">
          <div className="lg:col-span-4">
            <MenuInput
              menuText={menuText}
              setMenuText={setMenuText}
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              onGenerate={handleGeneratePhotos}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-8">
            <Gallery dishes={dishes} onEditDish={handleEditDish} />
          </div>
        </main>
      </div>
      <EditModal 
        dish={editingDish}
        onClose={handleCloseModal}
        onApplyEdit={handleApplyEdit}
      />
    </div>
  );
};

export default App;
