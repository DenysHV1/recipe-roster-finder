
// The Spoonacular API key should be properly secured in a production environment
// For this demo, we'll use a placeholder that users can replace with their own key
const API_KEY = 'YOUR_SPOONACULAR_API_KEY';
const BASE_URL = 'https://api.spoonacular.com';

// Mock data for development in case API key isn't available
const mockRecipes = [
  {
    id: 1,
    title: 'Spaghetti Carbonara',
    image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    readyInMinutes: 30,
    servings: 4,
    summary: 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
    instructions: '1. Cook spaghetti according to package directions. 2. In a separate pan, cook pancetta until crispy. 3. Beat eggs and mix with grated cheese. 4. Drain pasta and immediately add to the pan with pancetta. 5. Remove from heat and add egg mixture, stirring quickly. 6. Add black pepper and serve immediately.',
    extendedIngredients: [
      { id: 1, name: 'spaghetti', amount: '400', unit: 'g' },
      { id: 2, name: 'eggs', amount: '4', unit: '' },
      { id: 3, name: 'pancetta', amount: '150', unit: 'g' },
      { id: 4, name: 'Parmesan cheese', amount: '50', unit: 'g' },
      { id: 5, name: 'black pepper', amount: '1', unit: 'tsp' }
    ]
  },
  {
    id: 2,
    title: 'Avocado Toast',
    image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    readyInMinutes: 10,
    servings: 2,
    summary: 'A simple and nutritious breakfast toast topped with mashed avocado.',
    instructions: '1. Toast bread slices. 2. Mash avocado and spread on toast. 3. Season with salt, pepper, and red pepper flakes. 4. Optionally top with a poached egg.',
    extendedIngredients: [
      { id: 1, name: 'bread', amount: '2', unit: 'slices' },
      { id: 2, name: 'avocado', amount: '1', unit: '' },
      { id: 3, name: 'salt', amount: '1', unit: 'pinch' },
      { id: 4, name: 'pepper', amount: '1', unit: 'pinch' },
      { id: 5, name: 'red pepper flakes', amount: '1', unit: 'pinch' }
    ]
  },
  {
    id: 3,
    title: 'Chicken Curry',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    readyInMinutes: 45,
    servings: 4,
    summary: 'A flavorful Indian-inspired curry dish with tender chicken pieces.',
    instructions: '1. Sauté onions, garlic, and ginger. 2. Add curry powder and cook until fragrant. 3. Add chicken pieces and brown. 4. Add coconut milk and simmer until chicken is cooked through. 5. Serve with rice.',
    extendedIngredients: [
      { id: 1, name: 'chicken thighs', amount: '500', unit: 'g' },
      { id: 2, name: 'onion', amount: '1', unit: '' },
      { id: 3, name: 'garlic', amount: '3', unit: 'cloves' },
      { id: 4, name: 'ginger', amount: '1', unit: 'inch' },
      { id: 5, name: 'curry powder', amount: '2', unit: 'tbsp' },
      { id: 6, name: 'coconut milk', amount: '400', unit: 'ml' }
    ]
  },
  {
    id: 4,
    title: 'Greek Salad',
    image: 'https://images.unsplash.com/photo-1608032077018-c921cc15d541?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    readyInMinutes: 15,
    servings: 2,
    summary: 'A fresh Mediterranean salad with crisp vegetables and feta cheese.',
    instructions: '1. Chop cucumber, tomatoes, and red onion. 2. Combine with olives and feta cheese. 3. Dress with olive oil, lemon juice, oregano, salt, and pepper.',
    extendedIngredients: [
      { id: 1, name: 'cucumber', amount: '1', unit: '' },
      { id: 2, name: 'tomatoes', amount: '2', unit: '' },
      { id: 3, name: 'red onion', amount: '1/2', unit: '' },
      { id: 4, name: 'olives', amount: '1/4', unit: 'cup' },
      { id: 5, name: 'feta cheese', amount: '100', unit: 'g' },
      { id: 6, name: 'olive oil', amount: '2', unit: 'tbsp' },
      { id: 7, name: 'lemon juice', amount: '1', unit: 'tbsp' }
    ]
  }
];

export const fetchRecipesByIngredients = async (ingredients: string[]) => {
  // If no API key is provided, return mock data
  if (API_KEY === 'YOUR_SPOONACULAR_API_KEY') {
    console.log('Using mock data (no API key provided)');
    return mockRecipes;
  }

  try {
    const ingredientsParam = ingredients.join(',');
    const response = await fetch(
      `${BASE_URL}/recipes/findByIngredients?ingredients=${ingredientsParam}&number=10&apiKey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes by ingredients:', error);
    return mockRecipes; // Fallback to mock data on error
  }
};

export const fetchRandomRecipes = async () => {
  // If no API key is provided, return mock data
  if (API_KEY === 'YOUR_SPOONACULAR_API_KEY') {
    console.log('Using mock data (no API key provided)');
    return mockRecipes;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/recipes/random?number=10&apiKey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.recipes;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return mockRecipes; // Fallback to mock data on error
  }
};

export const fetchRecipeById = async (id: string | number) => {
  // If no API key is provided, return mock data
  if (API_KEY === 'YOUR_SPOONACULAR_API_KEY') {
    console.log('Using mock data (no API key provided)');
    const recipe = mockRecipes.find(recipe => recipe.id === Number(id));
    return recipe || mockRecipes[0];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe by id:', error);
    const recipe = mockRecipes.find(recipe => recipe.id === Number(id));
    return recipe || mockRecipes[0]; // Fallback to mock data on error
  }
};
