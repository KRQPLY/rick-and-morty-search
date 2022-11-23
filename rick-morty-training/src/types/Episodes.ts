import type Episode from "./Episode";

export default interface Episodes {
  info: { pages: number };
  results: Episode[];
}
