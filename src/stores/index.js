import { createContext, useContext } from 'react';
import AppStore from './AppStore';
import UIStore from './UIStore';
import S3Store from './S3Store';
import IAMStore from './IAMStore';

class Stores {
  constructor() {
    this.appStore = new AppStore(this);
    this.uiStore = new UIStore(this);
    this.s3Store = new S3Store(this);
    this.iamStore = new IAMStore(this);
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
