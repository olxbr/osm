import { makeAutoObservable } from "mobx";
import { autoSave } from "../helpers";

class UIStore {
  colorSchemes = ["light", "dark"];
  colorScheme = null;

  constructor() {
    makeAutoObservable(this);
    this.colorScheme = "light";
    autoSave(this, "uiStore");
  }

  setColorScheme = (color)  => {
    if (!this.colorSchemes.includes(color)) return;
    this.colorScheme = color;
  };
}

export default UIStore;
