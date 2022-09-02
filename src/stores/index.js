import { createContext, useContext } from "react";
import UIStore from "./UIStore";
import S3ToolStore from "./S3ToolsStore";

class RootStore {
  constructor() {
    this.uiStore = new UIStore(this);
    this.s3ToolStore = new S3ToolStore(this);
  }
}

let rootStore;
const StoreContext = createContext();

export const RootStoreProvider = ({ children }) => {
  const root = rootStore ?? new RootStore();
  return (
    <StoreContext.Provider value={root}>
      {children}
    </StoreContext.Provider>
  );
};

export const useRootStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useRootStore without RootStoreProvider");
  }
  return context;
};
