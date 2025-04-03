
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Recipe, addUserRecipe, updateUserRecipe } from '../store/recipeSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface RecipeFormProps {
  mode: 'add' | 'edit';
}

const RecipeForm = ({ mode }: RecipeFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRecipes = useSelector((state: RootState) => state.recipes.userRecipes);
  
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [readyInMinutes, setReadyInMinutes] = useState('');
  const [servings, setServings] = useState('');
  const [summary, setSummary] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  
  useEffect(() => {
    // If edit mode, populate form with recipe data
    if (mode === 'edit' && id) {
      const recipeToEdit = userRecipes.find(recipe => recipe.id.toString() === id);
      
      if (recipeToEdit) {
        setTitle(recipeToEdit.title);
        setImage(recipeToEdit.image);
        setReadyInMinutes(recipeToEdit.readyInMinutes?.toString() || '');
        setServings(recipeToEdit.servings?.toString() || '');
        setSummary(recipeToEdit.summary || '');
        setInstructions(recipeToEdit.instructions || '');
        
        if (recipeToEdit.ingredients && recipeToEdit.ingredients.length > 0) {
          setIngredients(recipeToEdit.ingredients);
        } else if (recipeToEdit.extendedIngredients && recipeToEdit.extendedIngredients.length > 0) {
          setIngredients(recipeToEdit.extendedIngredients.map(ing => 
            `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`
          ));
        }
      } else {
        toast({
          title: "Recipe not found",
          description: "The recipe you're trying to edit doesn't exist.",
          variant: "destructive"
        });
        navigate('/my-recipes');
      }
    }
  }, [mode, id, userRecipes, navigate]);
  
  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };
  
  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };
  
  const removeIngredientField = (index: number) => {
    if (ingredients.length > 1) {
      const updatedIngredients = [...ingredients];
      updatedIngredients.splice(index, 1);
      setIngredients(updatedIngredients);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty ingredients
    const filteredIngredients = ingredients.filter(ing => ing.trim() !== '');
    
    if (!title) {
      toast({
        title: "Missing title",
        description: "Please provide a recipe title.",
        variant: "destructive"
      });
      return;
    }
    
    if (!image) {
      toast({
        title: "Missing image",
        description: "Please provide an image URL for your recipe.",
        variant: "destructive"
      });
      return;
    }
    
    if (filteredIngredients.length === 0) {
      toast({
        title: "Missing ingredients",
        description: "Please add at least one ingredient.",
        variant: "destructive"
      });
      return;
    }
    
    const recipeData: Recipe = {
      id: mode === 'edit' && id ? id : Date.now().toString(),
      title,
      image,
      readyInMinutes: parseInt(readyInMinutes) || 0,
      servings: parseInt(servings) || 0,
      summary,
      instructions,
      ingredients: filteredIngredients,
      userAdded: true,
    };
    
    if (mode === 'add') {
      dispatch(addUserRecipe(recipeData));
      toast({
        title: "Recipe Added",
        description: `"${title}" has been added to your recipes.`,
      });
    } else {
      dispatch(updateUserRecipe(recipeData));
      toast({
        title: "Recipe Updated",
        description: `"${title}" has been updated.`,
      });
    }
    
    navigate('/my-recipes');
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-6">
        {mode === 'add' ? 'Add New Recipe' : 'Edit Recipe'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Recipe Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Homemade Chocolate Chip Cookies"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-1"
              required
            />
            {image && (
              <div className="mt-2">
                <img 
                  src={image} 
                  alt="Recipe preview" 
                  className="h-40 object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="readyInMinutes">Cooking Time (minutes)</Label>
              <Input
                id="readyInMinutes"
                type="number"
                value={readyInMinutes}
                onChange={(e) => setReadyInMinutes(e.target.value)}
                placeholder="e.g., 30"
                min="0"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                placeholder="e.g., 4"
                min="1"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A brief description of your recipe"
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="ingredients">Ingredients</Label>
            <div className="space-y-2 mt-1">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center">
                  <Input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder="e.g., 2 cups flour"
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredientField(index)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                    disabled={ingredients.length === 1}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addIngredientField}
                className="mt-2 text-recipe-amber hover:text-recipe-clay"
              >
                <Plus size={16} className="mr-1" />
                Add Ingredient
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Step-by-step instructions for your recipe"
              className="mt-1"
              rows={6}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/my-recipes')}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-recipe-amber hover:bg-recipe-clay">
            {mode === 'add' ? 'Add Recipe' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
