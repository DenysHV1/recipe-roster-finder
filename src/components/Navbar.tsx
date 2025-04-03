
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif text-recipe-amber text-2xl font-bold">Recipe Roster</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-recipe-amber">
              Home
            </Link>
            <Link to="/search" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-recipe-amber">
              Search
            </Link>
            <Link to="/my-recipes" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-recipe-amber">
              My Recipes
            </Link>
            <Link to="/favorites" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-recipe-amber flex items-center">
              <Heart size={16} className="mr-1" />
              Favorites
            </Link>
            <Link to="/add-recipe" className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-recipe-amber text-white hover:bg-recipe-clay transition-colors">
              Add Recipe
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-recipe-amber focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-recipe-amber"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-recipe-amber"
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link>
            <Link
              to="/my-recipes"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-recipe-amber"
              onClick={() => setIsMenuOpen(false)}
            >
              My Recipes
            </Link>
            <Link
              to="/favorites"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-recipe-amber flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart size={16} className="mr-1" />
              Favorites
            </Link>
            <Link
              to="/add-recipe"
              className="block px-3 py-2 rounded-md text-base font-medium bg-recipe-amber text-white hover:bg-recipe-clay transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Add Recipe
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
