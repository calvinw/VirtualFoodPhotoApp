
export type PhotoStyle = 'Rustic/Dark' | 'Bright/Modern' | 'Social Media';

export interface Dish {
  id: string;
  name: string;
  imageUrl: string | null;
  isGenerating: boolean;
  editHistory: string[];
}
