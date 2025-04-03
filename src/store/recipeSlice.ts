
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchRecipesByIngredients, fetchRandomRecipes } from '../services/api';

export interface Ingredient {
  id?: number;
  name: string;
  amount?: string;
  unit?: string;
}

export interface Recipe {
  id: number | string;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  summary?: string;
  instructions?: string;
  extendedIngredients?: Ingredient[];
  ingredients?: string[];
  favorite?: boolean;
  userAdded?: boolean;
}

interface RecipeState {
  recipes: Recipe[];
  userRecipes: Recipe[];
  favoriteRecipes: Recipe[];
  filteredRecipes: Recipe[];
  selectedRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
  ingredients: string[];
}

const initialState: RecipeState = {
  recipes: [],
  userRecipes: [],
  favoriteRecipes: [],
  filteredRecipes: [],
  selectedRecipe: null,
  loading: false,
  error: null,
  ingredients: [],
};

// Async thunks
export const fetchRecipesByIngredientsAsync = createAsyncThunk(
  'recipes/fetchByIngredients',
  async (ingredients: string[]) => {
    return await fetchRecipesByIngredients(ingredients);
  }
);

export const fetchRandomRecipesAsync = createAsyncThunk(
  'recipes/fetchRandom',
  async () => {
    return await fetchRandomRecipes();
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
      state.filteredRecipes = action.payload;
    },
    addUserRecipe: (state, action: PayloadAction<Recipe>) => {
      const newRecipe = {
        ...action.payload,
        id: Date.now().toString(),
        userAdded: true
      };
      state.userRecipes.push(newRecipe);
    },
    updateUserRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.userRecipes.findIndex(recipe => recipe.id === action.payload.id);
      if (index !== -1) {
        state.userRecipes[index] = action.payload;
      }
    },
    deleteUserRecipe: (state, action: PayloadAction<string | number>) => {
      state.userRecipes = state.userRecipes.filter(recipe => recipe.id !== action.payload);
      state.favoriteRecipes = state.favoriteRecipes.filter(recipe => recipe.id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<Recipe>) => {
      const recipe = action.payload;
      const existingIndex = state.favoriteRecipes.findIndex(r => r.id === recipe.id);
      
      if (existingIndex >= 0) {
        state.favoriteRecipes.splice(existingIndex, 1);
        // Update favorite status in recipes arrays
        const recipeIndex = state.recipes.findIndex(r => r.id === recipe.id);
        if (recipeIndex >= 0) {
          state.recipes[recipeIndex].favorite = false;
        }
        
        const userRecipeIndex = state.userRecipes.findIndex(r => r.id === recipe.id);
        if (userRecipeIndex >= 0) {
          state.userRecipes[userRecipeIndex].favorite = false;
        }
      } else {
        state.favoriteRecipes.push({...recipe, favorite: true});
        
        // Update favorite status in recipes arrays
        const recipeIndex = state.recipes.findIndex(r => r.id === recipe.id);
        if (recipeIndex >= 0) {
          state.recipes[recipeIndex].favorite = true;
        }
        
        const userRecipeIndex = state.userRecipes.findIndex(r => r.id === recipe.id);
        if (userRecipeIndex >= 0) {
          state.userRecipes[userRecipeIndex].favorite = true;
        }
      }
    },
    setSelectedRecipe: (state, action: PayloadAction<Recipe | null>) => {
      state.selectedRecipe = action.payload;
    },
    filterRecipesByIngredients: (state, action: PayloadAction<string[]>) => {
      state.ingredients = action.payload;
      
      if (action.payload.length === 0) {
        state.filteredRecipes = state.recipes;
        return;
      }
      
      state.filteredRecipes = state.recipes.filter(recipe => {
        // If recipe has ingredients property (string[] format)
        if (recipe.ingredients) {
          return action.payload.every(ingredient => 
            recipe.ingredients!.some(ri => 
              ri.toLowerCase().includes(ingredient.toLowerCase())
            )
          );
        }
        
        // If recipe has extendedIngredients property (object format)
        if (recipe.extendedIngredients) {
          return action.payload.every(ingredient => 
            recipe.extendedIngredients!.some(ri => 
              ri.name.toLowerCase().includes(ingredient.toLowerCase())
            )
          );
        }
        
        return false;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipesByIngredientsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipesByIngredientsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
        state.filteredRecipes = action.payload;
      })
      .addCase(fetchRecipesByIngredientsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recipes';
      })
      .addCase(fetchRandomRecipesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRandomRecipesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
        state.filteredRecipes = action.payload;
      })
      .addCase(fetchRandomRecipesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recipes';
      });
  },
});

export const {
  setRecipes,
  addUserRecipe,
  updateUserRecipe,
  deleteUserRecipe,
  toggleFavorite,
  setSelectedRecipe,
  filterRecipesByIngredients,
} = recipeSlice.actions;

export default recipeSlice.reducer;
