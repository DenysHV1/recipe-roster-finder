
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';
import { filterRecipesByIngredients } from '../store/recipeSlice';
import { RootState } from '../store/store';
import { toast } from '@/components/ui/use-toast';
import { useAppDispatch } from '../hooks/useRedux';

const IngredientsFilter = () => {
  const dispatch = useAppDispatch();
  const activeIngredients = useSelector((state: RootState) => state.recipes.ingredients);
  const [ingredientInput, setIngredientInput] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ingredient = ingredientInput.trim();
    if (!ingredient) return;
    
    if (activeIngredients.includes(ingredient)) {
      toast({
        title: "Ingredient already added",
        description: `"${ingredient}" is already in your filter.`,
      });
      return;
    }
    
    const updatedIngredients = [...activeIngredients, ingredient];
    dispatch(filterRecipesByIngredients(updatedIngredients));
    setIngredientInput('');
  };
  
  const handleRemoveIngredient = (ingredient: string) => {
    const updatedIngredients = activeIngredients.filter(ing => ing !== ingredient);
    dispatch(filterRecipesByIngredients(updatedIngredients));
  };
  
  const handleClearAll = () => {
    dispatch(filterRecipesByIngredients([]));
  };
  
  const toggleFilter = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };
  
  return (
    <div className="mb-6">
      <Button 
        variant="outline" 
        onClick={toggleFilter}
        className="flex items-center mb-2 md:hidden"
      >
        <Filter size={16} className="mr-2" />
        Filter by Ingredients
        {activeIngredients.length > 0 && (
          <Badge className="ml-2 bg-recipe-amber">{activeIngredients.length}</Badge>
        )}
      </Button>
      
      <div className={`${isFilterExpanded || window.innerWidth >= 768 ? 'block' : 'hidden'} bg-gray-50 rounded-lg p-4`}>
        <h3 className="font-serif text-lg font-medium text-gray-800 mb-3">Filter by Ingredients</h3>
        
        <form onSubmit={handleAddIngredient} className="flex mb-3">
          <Input
            type="text"
            placeholder="Add an ingredient..."
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            className="mr-2"
          />
          <Button type="submit" className="bg-recipe-amber hover:bg-recipe-clay">
            <Plus size={16} />
          </Button>
        </form>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {activeIngredients.map((ingredient, index) => (
            <Badge key={index} className="bg-white text-gray-700 border border-gray-200 flex items-center">
              {ingredient}
              <button 
                onClick={() => handleRemoveIngredient(ingredient)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
          
          {activeIngredients.length === 0 && (
            <p className="text-gray-500 text-sm">No ingredients selected. Add ingredients to filter recipes.</p>
          )}
        </div>
        
        {activeIngredients.length > 0 && (
          <Button 
            variant="ghost" 
            onClick={handleClearAll} 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default IngredientsFilter;
