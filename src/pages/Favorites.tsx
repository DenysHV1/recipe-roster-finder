
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import RecipeCard from '../components/RecipeCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';

const Favorites = () => {
  const favoriteRecipes = useSelector((state: RootState) => state.recipes.favoriteRecipes);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredFavorites = favoriteRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-6">
        My Favorites
      </h1>
      
      <div className="mb-8">
        <SearchBar 
          onSearch={(query) => setSearchQuery(query)}
          placeholder="Search your favorites..."
        />
      </div>
      
      {favoriteRecipes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-red-400" />
          </div>
          <h3 className="font-serif text-xl font-medium text-gray-800 mb-3">
            You don't have any favorite recipes yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start exploring recipes and add them to your favorites by clicking the heart icon.
          </p>
          <Link to="/search">
            <Button className="bg-recipe-amber hover:bg-recipe-clay">
              Explore Recipes
            </Button>
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="font-serif text-xl font-medium text-gray-800 mb-2">
            No favorites match your search
          </h3>
          <p className="text-gray-600">
            Try a different search term or browse all your favorites.
          </p>
          <Button 
            variant="ghost" 
            onClick={() => setSearchQuery('')}
            className="mt-4 text-recipe-amber hover:text-recipe-clay"
          >
            Show All Favorites
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavorites.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
