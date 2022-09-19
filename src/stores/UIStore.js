import { makeAutoObservable } from 'mobx';
import { autoSave } from '../helpers';

const COLOR_SCHEMES = ['light', 'dark'];

class UIStore {
  colorScheme = null;

  constructor() {
    makeAutoObservable(this);
    this.colorScheme = 'light';
    autoSave(this, 'osm_UIStore');
  }

  setColorScheme = (color) => {
    if (!COLOR_SCHEMES.includes(color)) return;
    this.colorScheme = color;
  };
}

export default UIStore;
