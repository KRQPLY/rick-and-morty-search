import axios from "axios";
import type Character from "@/types/Character";
import type Episode from "@/types/Episode";
import type Characters from "@/types/Characters";
import type Episodes from "@/types/Episodes";

const getData = async (
  endpoint: string
): Promise<Character | Episode | Characters | Episodes | undefined> => {
  try {
    let response = await axios.get(endpoint);

    let data = response.data;

    return data;
  } catch (e: unknown) {
    if (typeof e === "string") {
      console.error(e.toUpperCase());
    } else if (e instanceof Error) {
      console.error(e.message);
    }
  }
};

export default getData;
