import { createContext, useContext } from 'react';
import AppStore from './AppStore';
import UIStore from './UIStore';
import S3ToolsStore from './S3ToolsStore';

class Stores {
  constructor() {
    this.appStore = new AppStore(this);
    this.uiStore = new UIStore(this);
    this.s3ToolsStore = new S3ToolsStore(this);
  }
}

let stores;
const StoresContext = createContext();

export const StoresProvider = ({ children }) => {
  const root = stores ?? new Stores();
  return <StoresContext.Provider value={root}>{children}</StoresContext.Provider>;
};

export const useStores = () => {
  const context = useContext(StoresContext);
  if (context === undefined) {
    throw new Error('useStores without a root StoreProvider');
  }
  return context;
};
