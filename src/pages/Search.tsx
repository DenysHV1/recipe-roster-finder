
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../store/store';
import { fetchRecipesByIngredientsAsync } from '../store/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import IngredientsFilter from '../components/IngredientsFilter';
import { useAppDispatch } from '../hooks/useRedux';

const Search = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { filteredRecipes, loading, error } = useSelector((state: RootState) => state.recipes);
  
  // Extract search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    
    if (query) {
      setSearchQuery(query);
      // Use query to search recipes (in a real app, we'd call an API endpoint here)
    }
  }, [location.search]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a full implementation, we would dispatch a search action here
  };
  
  // Dispatch async action to fetch recipes if we have none
  useEffect(() => {
    if (filteredRecipes.length === 0 && !loading) {
      dispatch(fetchRecipesByIngredientsAsync([]));
    }
  }, [dispatch, filteredRecipes.length, loading]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-6">
        Search Recipes
      </h1>
      
      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search by recipe name..."
        />
        {searchQuery && (
          <p className="text-gray-600 mt-2">
            Search results for: <span className="font-medium">{searchQuery}</span>
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <IngredientsFilter />
        </div>
        
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-recipe-amber mx-auto mb-4"></div>
                <p className="text-gray-600">Searching recipes...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => dispatch(fetchRecipesByIngredientsAsync([]))} 
                className="text-recipe-amber hover:text-recipe-clay underline"
              >
                Try Again
              </button>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="font-serif text-xl font-medium text-gray-800 mb-2">No recipes found</h3>
              <p className="text-gray-600">
                Try adjusting your ingredients filter or search terms.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Found {filteredRecipes.length} recipes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
