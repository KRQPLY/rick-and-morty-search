const updateLocalStorage = (storage: string, item: any) => {
  localStorage.setItem(storage, JSON.stringify(item));
};

export default updateLocalStorage;
