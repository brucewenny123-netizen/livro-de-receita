export type Category = 'Refeições' | 'Drinks' | 'Sucos';

export interface Recipe {
  recipeName: string;
  description: string;
  category: Category;
  ingredients: string[];
  instructions: string[];
}

export type Suggestions = {
  [key in Category]?: {
    list: string[];
    imageUrl: string;
  };
};
