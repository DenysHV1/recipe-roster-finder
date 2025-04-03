
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import RecipeCard from '../components/RecipeCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';

const MyRecipes = () => {
  const userRecipes = useSelector((state: RootState) => state.recipes.userRecipes);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredUserRecipes = userRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4 md:mb-0">
          My Recipes
        </h1>
        
        <Link to="/add-recipe">
          <Button className="bg-recipe-amber hover:bg-recipe-clay">
            <Plus size={18} className="mr-2" />
            Add New Recipe
          </Button>
        </Link>
      </div>
      
      <div className="mb-8">
        <SearchBar 
          onSearch={(query) => setSearchQuery(query)}
          placeholder="Search your recipes..."
        />
      </div>
      
      {userRecipes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="font-serif text-xl font-medium text-gray-800 mb-3">
            You haven't added any recipes yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start building your recipe collection by adding your favorite recipes.
          </p>
          <Link to="/add-recipe">
            <Button className="bg-recipe-amber hover:bg-recipe-clay">
              <Plus size={18} className="mr-2" />
              Add Your First Recipe
            </Button>
          </Link>
        </div>
      ) : filteredUserRecipes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="font-serif text-xl font-medium text-gray-800 mb-2">
            No recipes match your search
          </h3>
          <p className="text-gray-600">
            Try a different search term or browse all your recipes.
          </p>
          <Button 
            variant="ghost" 
            onClick={() => setSearchQuery('')}
            className="mt-4 text-recipe-amber hover:text-recipe-clay"
          >
            Show All Recipes
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUserRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
