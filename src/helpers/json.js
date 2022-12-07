export const formatJson = (json) => {
  return JSON.stringify(JSON.parse(json === '' ? '{}' : json), null, 2);
};
