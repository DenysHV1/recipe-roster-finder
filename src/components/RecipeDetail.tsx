
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Recipe, setSelectedRecipe, toggleFavorite, deleteUserRecipe } from '../store/recipeSlice';
import { fetchRecipeById } from '../services/api';
import { Heart, Clock, Users, Edit, Trash, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAppDispatch } from '../hooks/useRedux';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedRecipe = useSelector((state: RootState) => state.recipes.selectedRecipe);
  const userRecipes = useSelector((state: RootState) => state.recipes.userRecipes);
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      
      // First check if it's a user recipe
      const userRecipe = userRecipes.find(r => r.id.toString() === id);
      if (userRecipe) {
        dispatch(setSelectedRecipe(userRecipe));
        setLoading(false);
        return;
      }
      
      // Then check if it's already in our recipes state
      const existingRecipe = recipes.find(r => r.id.toString() === id);
      if (existingRecipe) {
        dispatch(setSelectedRecipe(existingRecipe));
        setLoading(false);
        return;
      }
      
      // If not found, fetch from API
      try {
        const fetchedRecipe = await fetchRecipeById(id!);
        dispatch(setSelectedRecipe(fetchedRecipe));
      } catch (error) {
        console.error('Error loading recipe:', error);
        toast({
          title: "Error",
          description: "Failed to load recipe details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipe();
    
    // Cleanup on unmount
    return () => {
      dispatch(setSelectedRecipe(null));
    };
  }, [id, dispatch, userRecipes, recipes]);

  const handleToggleFavorite = () => {
    if (selectedRecipe) {
      dispatch(toggleFavorite(selectedRecipe));
      toast({
        title: selectedRecipe.favorite ? "Removed from favorites" : "Added to favorites",
        description: `"${selectedRecipe.title}" has been ${selectedRecipe.favorite ? "removed from" : "added to"} your favorites.`,
      });
    }
  };

  const handleDelete = () => {
    if (selectedRecipe && selectedRecipe.userAdded) {
      dispatch(deleteUserRecipe(selectedRecipe.id));
      toast({
        title: "Recipe Deleted",
        description: `"${selectedRecipe.title}" has been permanently deleted.`,
      });
      navigate('/my-recipes');
    }
  };

  const handleEdit = () => {
    if (selectedRecipe && selectedRecipe.userAdded) {
      navigate(`/edit-recipe/${selectedRecipe.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-recipe-amber mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!selectedRecipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-serif font-bold text-gray-700">Recipe not found</h2>
        <p className="mt-2 text-gray-600">The recipe you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center text-gray-600 hover:text-recipe-amber"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} className="mr-1" />
        Back
      </Button>
      
      <div className="relative mb-6">
        {selectedRecipe.image && (
          <img 
            src={selectedRecipe.image} 
            alt={selectedRecipe.title} 
            className="w-full rounded-lg recipe-detail-img"
          />
        )}
        
        <div className="flex absolute top-4 right-4 space-x-2">
          <Button 
            size="icon"
            onClick={handleToggleFavorite}
            className="bg-white text-gray-700 hover:text-recipe-amber"
          >
            <Heart 
              size={22} 
              className={selectedRecipe.favorite ? "fill-red-500 text-red-500" : ""}
            />
          </Button>
          
          {selectedRecipe.userAdded && (
            <>
              <Button 
                size="icon"
                onClick={handleEdit}
                className="bg-white text-gray-700 hover:text-recipe-amber"
              >
                <Edit size={20} />
              </Button>
              
              <Button 
                size="icon"
                onClick={handleDelete}
                className="bg-white text-gray-700 hover:text-red-500"
              >
                <Trash size={20} />
              </Button>
            </>
          )}
        </div>
      </div>

      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">{selectedRecipe.title}</h1>
      
      <div className="flex items-center text-gray-600 mb-6 space-x-4">
        {selectedRecipe.readyInMinutes && (
          <div className="flex items-center">
            <Clock size={18} className="mr-1 text-recipe-amber" />
            <span>{selectedRecipe.readyInMinutes} mins</span>
          </div>
        )}
        
        {selectedRecipe.servings && (
          <div className="flex items-center">
            <Users size={18} className="mr-1 text-recipe-amber" />
            <span>{selectedRecipe.servings} servings</span>
          </div>
        )}
      </div>
      
      {selectedRecipe.summary && (
        <div className="mb-6">
          <h2 className="font-serif text-xl font-semibold text-gray-800 mb-2">Summary</h2>
          <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }}></p>
        </div>
      )}
      
      <Separator className="my-6" />
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-serif text-xl font-semibold text-gray-800 mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {selectedRecipe.extendedIngredients ? (
              selectedRecipe.extendedIngredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <input 
                    type="checkbox" 
                    id={`ingredient-${index}`} 
                    className="mt-1 mr-2 ingredient-checkbox" 
                  />
                  <label htmlFor={`ingredient-${index}`} className="cursor-pointer">
                    <span>
                      {ingredient.amount} {ingredient.unit} {ingredient.name}
                    </span>
                  </label>
                </li>
              ))
            ) : selectedRecipe.ingredients ? (
              selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <input 
                    type="checkbox" 
                    id={`ingredient-${index}`} 
                    className="mt-1 mr-2 ingredient-checkbox" 
                  />
                  <label htmlFor={`ingredient-${index}`} className="cursor-pointer">
                    <span>{ingredient}</span>
                  </label>
                </li>
              ))
            ) : (
              <li>No ingredients listed</li>
            )}
          </ul>
        </div>
        
        <div>
          <h2 className="font-serif text-xl font-semibold text-gray-800 mb-4">Instructions</h2>
          {selectedRecipe.instructions ? (
            <div 
              className="text-gray-700 space-y-4"
              dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }}
            />
          ) : (
            <p className="text-gray-600">No instructions available.</p>
          )}
        </div>
      </div>
      
      {selectedRecipe.sourceUrl && (
        <div className="mt-8">
          <a 
            href={selectedRecipe.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-recipe-amber hover:text-recipe-clay underline"
          >
            View Original Recipe
          </a>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
