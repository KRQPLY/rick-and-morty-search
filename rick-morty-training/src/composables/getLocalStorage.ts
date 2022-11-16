const getLocalStorage = (storage: string) => {
  let item = localStorage.getItem(storage);
  if (item) return JSON.parse(item);
  else return [];
};

export default getLocalStorage;
