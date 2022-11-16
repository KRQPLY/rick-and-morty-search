const getImageUrl = (name: string) => {
  return new URL(name, import.meta.url).href;
};

export default getImageUrl;
