import React, { useState, useEffect } from "react";
import axios from "axios";

const PokemonCard = ({ pokemon }) => {
  const [details, setDetails] = useState(pokemon);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(pokemon.url);
        setDetails(prev => ({
          ...prev,
          image: response.data.sprites.front_default
        }));
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
      }
    };

    if (!details.image) fetchPokemonDetails();
  }, [pokemon, details.image]);

  return (
    <div className="pokemon-card">
      {details.image ? (
        <img src={details.image} alt={details.name} />
      ) : (
        <div className="skeleton" />
      )}
      <h3>{details.name}</h3>
    </div>
  );
};

export default PokemonCard;
