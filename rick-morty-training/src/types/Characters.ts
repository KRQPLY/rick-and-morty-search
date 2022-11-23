import type Character from "./Character";

export default interface Characters {
  info: { count: number; pages: number };
  results: Character[];
}
