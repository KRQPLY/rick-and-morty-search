import type Episode from "./Episode";

export default interface Episodes {
  info: { count: number; pages: number; next: string | null; prev: string | null };
  results: Episode[];
}
