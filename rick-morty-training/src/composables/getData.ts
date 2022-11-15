import axios from "axios";

const getData = async (endpoint: string) => {
  let data = null;
  try {
    let response = await axios.get(endpoint);

    data = await response.data;

    return data;
  } catch (err: any) {
    console.error(err.message);
    return false;
  }
};

export default getData;
