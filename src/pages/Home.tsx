
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchRandomRecipesAsync } from '../store/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAppDispatch } from '../hooks/useRedux';

const Home = () => {
  const dispatch = useAppDispatch();
  const { recipes, loading, error } = useSelector((state: RootState) => state.recipes);
  const userRecipes = useSelector((state: RootState) => state.recipes.userRecipes);
  const favoriteRecipes = useSelector((state: RootState) => state.recipes.favoriteRecipes);
  
  useEffect(() => {
    if (recipes.length === 0) {
      dispatch(fetchRandomRecipesAsync());
    }
  }, [dispatch, recipes.length]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Find & Save Your Favorite Recipes
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover recipes based on ingredients you have, save your favorites, and create your own.
        </p>
        <SearchBar className="max-w-xl mx-auto" />
      </div>
      
      {/* User recipes section - only show if they have added some */}
      {userRecipes.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              Your Recipes
            </h2>
            <Link 
              to="/my-recipes" 
              className="flex items-center text-recipe-amber hover:text-recipe-clay font-medium"
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userRecipes.slice(0, 4).map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}
      
      {/* Favorites section - only show if they have favorites */}
      {favoriteRecipes.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              Your Favorites
            </h2>
            <Link 
              to="/favorites" 
              className="flex items-center text-recipe-amber hover:text-recipe-clay font-medium"
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteRecipes.slice(0, 4).map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}
      
      {/* Discover section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-gray-900">
            Discover Recipes
          </h2>
          <Link 
            to="/search" 
            className="flex items-center text-recipe-amber hover:text-recipe-clay font-medium"
          >
            Explore More
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-recipe-amber mx-auto mb-4"></div>
              <p className="text-gray-600">Loading recipes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => dispatch(fetchRandomRecipesAsync())} 
              className="mt-4 text-recipe-amber hover:text-recipe-clay underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.slice(0, 8).map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
