import axios from "axios";

const getData = async (endpoint: string) => {
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
