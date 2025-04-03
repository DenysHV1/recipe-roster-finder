
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search for recipes...",
  className = "" 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        // Navigate to search page with query
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-12"
        />
        <Button 
          type="submit" 
          variant="ghost" 
          size="icon"
          className="absolute right-0 top-0 bottom-0 text-gray-500"
        >
          <Search size={18} />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
