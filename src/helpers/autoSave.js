import { autorun, set, toJS } from 'mobx';

export const autoSave = (_this, name) => {
  const storedJson = localStorage.getItem(name);

  if (storedJson) {
    set(_this, JSON.parse(storedJson));
  }

  autorun(() => {
    const value = toJS(_this);
    localStorage.setItem(name, JSON.stringify(value));
  });
};

export const clearAutoSave = () => {
  for (let key of Object.keys(localStorage)) {
    if (key.startsWith('osm_') && key !== 'osm_UIStore') {
      localStorage.removeItem(key);
    }
  }
};
