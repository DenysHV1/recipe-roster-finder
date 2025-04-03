
import { Heart } from 'lucide-react';
import { Recipe, toggleFavorite } from '../store/recipeSlice';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useRedux';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const dispatch = useAppDispatch();
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(recipe));
  };

  return (
    <Link to={`/recipe/${recipe.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full recipe-card-img"
          />
          <button 
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <Heart 
              size={20} 
              className={recipe.favorite ? "fill-red-500 text-red-500" : "text-gray-500"}
            />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-serif text-lg font-medium text-gray-900 mb-1">{recipe.title}</h3>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{recipe.readyInMinutes} mins</span>
            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
