import { getRandomNumberBetween } from './util.js';

export const pokemons = [
  '/images/catch-em-all/pokemons/abra.png',
  '/images/catch-em-all/pokemons/bellsprout.png',
  '/images/catch-em-all/pokemons/bulbasaur.png',
  '/images/catch-em-all/pokemons/caterpie.png',
  '/images/catch-em-all/pokemons/charmander.png',
  '/images/catch-em-all/pokemons/dratini.png',
  '/images/catch-em-all/pokemons/eevee.png',
  '/images/catch-em-all/pokemons/jigglypuff.png',
  '/images/catch-em-all/pokemons/mankey.png',
  '/images/catch-em-all/pokemons/meowth.png',
  '/images/catch-em-all/pokemons/mew.png',
  '/images/catch-em-all/pokemons/pidgey.png',
  '/images/catch-em-all/pokemons/pikachu.png',
  '/images/catch-em-all/pokemons/psyduck.png',
  '/images/catch-em-all/pokemons/rattata.png',
  '/images/catch-em-all/pokemons/snorlax.png',
  '/images/catch-em-all/pokemons/squirtle.png',
  '/images/catch-em-all/pokemons/venonat.png',
  '/images/catch-em-all/pokemons/weedle.png',
  '/images/catch-em-all/pokemons/zubat.png',
];

export const getRandomPokemon = () => {
  return pokemons[getRandomNumberBetween(0, pokemons.length - 1)];
};
