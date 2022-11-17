export default interface Character {
  image: string;
  status: string;
  id: number;
  name: string;
  gender: "Male" | "Female" | "unknown";
  species: string;
  episode: string[];
  lastEpisode: string;
}