const getLocalStorage = (storage: string): string | null => {
  return localStorage.getItem(storage);
};

export default getLocalStorage;
