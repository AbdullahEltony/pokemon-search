import React, { useState, useEffect, Suspense, lazy, useMemo } from "react";
import axios from "axios";
import "./App.css";
import useDebounce from "./hooks/useDebounce";

// Lazy load the PokemonCard component
const PokemonCard = lazy(() => import("./components/PokemonCard"));

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce the search term using the custom hook
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
        const results = response.data.results;

        // Map over results to fetch Pokemon details lazily when displayed
        const pokemonData = results.map(pokemon => ({
          name: pokemon.name,
          url: pokemon.url
        }));
        setPokemons(pokemonData);
        setLoading(false);
      } catch (err) {
        setError("Error fetching Pokémon data");
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Use useMemo to optimize filtering
  const filteredPokemons = useMemo(() => {
    return pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [pokemons, debouncedSearchTerm]); // Dependencies

  return (
    <div className="App">
      <h1>Pokemon List</h1>
      <input
        type="text"
        placeholder="Search Pokémon..."
        onChange={handleSearchChange}
        className="search-box"
      />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="pokemon-container">
        <Suspense fallback={<p>Loading Pokemon Cards...</p>}>
          {filteredPokemons.map((pokemon, index) => (
            <PokemonCard key={index} pokemon={pokemon} />
          ))}
        </Suspense>
      </div>
    </div>
  );
};

export default App;
