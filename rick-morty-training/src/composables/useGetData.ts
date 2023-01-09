import axios from "axios";
import type Character from "@/types/Character";
import type Episode from "@/types/Episode";
import type Characters from "@/types/Characters";
import type Episodes from "@/types/Episodes";

const useGetData = () => {
  const characterEndpoint = "https://rickandmortyapi.com/api/character";
  const episodeEndpoint = "https://rickandmortyapi.com/api/episode/?episode=";
  const cachedEpisodes: { [key: string]: Episode[] } = {};
  const cachedCharactersByUrl: { [key: string]: Characters } = {};
  const cachedCharacters: Character[] = [];

  const getData = async (endpoint: string): Promise<Character | Characters | Episode | Episodes | undefined> => {
    try {
      const response = await axios.get(endpoint);
      const data = response.data;

      return data;
    } catch (e: unknown) {
      if (typeof e === "string") {
        console.error(e.toUpperCase());
      } else if (e instanceof Error) {
        console.error(e.message);
      }
    }
  };

  const getEpisode = async (endpoint: string): Promise<string> => {
    if (!cachedEpisodes[endpoint]) {
      const episode = (await getData(endpoint)) as Episode | undefined;

      if (!episode) {
        return "";
      }
      cachedEpisodes[endpoint] = [episode];
    }
    return cachedEpisodes[endpoint][0].episode;
  };

  const getIdsInEpisodes = async (episode: string): Promise<number[]> => {
    const endpoint = `${episodeEndpoint.concat(episode)}`;
    const ids: Set<number> = new Set();

    if (!cachedEpisodes[endpoint]) {
      const episodes = (await getData(endpoint)) as Episodes | undefined;
      let episodesResults = episodes?.results;
      let nextUrl = episodes?.info.next;

      while (nextUrl) {
        const nextPageEpisodes = (await getData(nextUrl)) as Episodes | undefined;

        if (!nextPageEpisodes) {
          break;
        }
        episodesResults = episodesResults?.concat(nextPageEpisodes.results);
        nextUrl = nextPageEpisodes.info.next;
      }

      if (!episodesResults) {
        return [];
      }

      cachedEpisodes[endpoint] = episodesResults;
    }
    cachedEpisodes[endpoint].forEach((episode) => {
      episode.characters.forEach((character) => {
        ids.add(Number(character.replace("https://rickandmortyapi.com/api/character/", "")));
      });
    });
    return [...ids];
  };

  const getCharactersByName = async (page: number, name: string): Promise<{ results: Character[]; count: number }> => {
    const endpoint = `${characterEndpoint}?page=${page}&name=${name}`;

    if (!cachedCharactersByUrl[endpoint]) {
      const characters = (await getData(endpoint)) as Characters | undefined;
      if (!characters) {
        return { results: [], count: 0 };
      }
      cachedCharactersByUrl[endpoint] = characters;
      cachedCharacters.push(
        ...characters.results.filter(
          (character) => !cachedCharacters.some((cachedCharacter) => cachedCharacter.id === character.id)
        )
      );
    }
    return {
      results: cachedCharactersByUrl[endpoint].results,
      count: cachedCharactersByUrl[endpoint].info.count,
    };
  };

  const getCharactersByIdentifiers = async (ids: number[]): Promise<Character[]> => {
    const uncachedIds = ids.filter((id) => !cachedCharacters.some((character) => character.id === id));

    if (uncachedIds.length) {
      const endpoint = `${characterEndpoint}/${JSON.stringify([...uncachedIds])}`;
      const uncachedCharacters = (await getData(endpoint)) as Character[] | undefined;
      if (uncachedCharacters) {
        cachedCharacters.push(...uncachedCharacters);
      }
    }
    return cachedCharacters.filter((character) => ids.includes(character.id)).sort((a, b) => a.id - b.id);
  };

  return {
    getEpisode,
    getIdsInEpisodes,
    getCharactersByName,
    getCharactersByIdentifiers,
  };
};

export default useGetData;
