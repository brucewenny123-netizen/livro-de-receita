import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe, Category } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: {
      type: Type.STRING,
      description: "O nome da receita."
    },
    description: {
      type: Type.STRING,
      description: "Uma breve descrição da receita, com 2-3 frases."
    },
    category: {
      type: Type.STRING,
      enum: ['Refeições', 'Drinks', 'Sucos'],
      description: "A categoria da receita."
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: "Um ingrediente."
      },
      description: "Uma lista dos ingredientes necessários."
    },
    instructions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: "Um passo da instrução."
      },
      description: "Uma lista do passo-a-passo para preparar a receita."
    },
  },
  required: ['recipeName', 'description', 'category', 'ingredients', 'instructions']
};

export const generateRecipeAndImage = async (query: string, category: Category): Promise<{ recipe: Recipe; imageUrl: string } | null> => {
  try {
    const recipePrompt = `Gere uma receita detalhada para "${query}" na categoria "${category}". A receita deve ser fácil de seguir.`;
    
    const recipeResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: recipePrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.7,
      },
    });

    const recipeJsonText = recipeResponse.text.trim();
    if (!recipeJsonText) {
      console.error("Gemini recipe response is empty.");
      return null;
    }
    const recipe: Recipe = JSON.parse(recipeJsonText);

    const imagePrompt = `Uma foto de comida profissional e vibrante de "${recipe.recipeName}". ${recipe.description}. Estilo de fotografia de alimentos, luz natural, foco nítido, fundo levemente desfocado.`;
    
    const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
      const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      return { recipe, imageUrl };
    } else {
      console.error("Failed to generate image.");
      return null;
    }

  } catch (error) {
    console.error("Error generating recipe or image with Gemini:", error);
    throw new Error("Falha na comunicação com a API Gemini.");
  }
};


const suggestionsSchema = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      description: "Uma lista de 20 nomes de receitas.",
      items: {
        type: Type.STRING,
        description: "O nome de uma receita criativa."
      }
    }
  },
  required: ['suggestions']
};

export const generateSuggestionsForCategory = async (category: Category): Promise<{ list: string[]; imageUrl: string }> => {
  try {
    // 1. Generate list of suggestions
    const suggestionsPrompt = `Gere uma lista com 20 ideias populares e criativas de receitas para a categoria "${category}". As ideias devem ser de várias cozinhas do mundo e abranger diferentes níveis de dificuldade.`;

    const suggestionsResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: suggestionsPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: suggestionsSchema,
        temperature: 0.8,
      },
    });

    const suggestionsJsonText = suggestionsResponse.text.trim();
    if (!suggestionsJsonText) {
      throw new Error(`Gemini suggestions response for ${category} is empty.`);
    }
    const suggestionsResult: { suggestions: string[] } = JSON.parse(suggestionsJsonText);
    const suggestionList = suggestionsResult.suggestions;

    if (!suggestionList || suggestionList.length === 0) {
      throw new Error(`Failed to parse suggestions for ${category}.`);
    }

    // 2. Generate a representative image for the category
    const imagePrompt = `Uma colagem de fotografia de comida vibrante e artística, mostrando uma variedade de pratos da categoria '${category}'. Inclua representações de pratos como ${suggestionList.slice(0, 4).join(', ')}. O clima é apetitoso, com iluminação de estúdio profissional e cores ricas. Estilo de fotografia de alimentos de alta qualidade, foco nítido.`;

    const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
      const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      return { list: suggestionList, imageUrl };
    } else {
      throw new Error(`Failed to generate image for ${category}.`);
    }

  } catch (error) {
    console.error(`Error generating suggestions for ${category}:`, error);
    throw new Error(`Falha ao gerar sugestões para ${category}.`);
  }
};
