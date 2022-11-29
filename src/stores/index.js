import { createContext, useContext } from 'react';
import AppStore from './AppStore';
import UIStore from './UIStore';
import S3Store from './S3Store';
import IAMStore from './IAMStore';
import EC2Store from './EC2Store';

class Stores {
  constructor() {
    this.appStore = new AppStore(this);
    this.uiStore = new UIStore(this);
    this.s3Store = new S3Store(this);
    this.iamStore = new IAMStore(this);
    this.ec2Store = new EC2Store(this);
  }
}

const StoresContext = createContext();

export const StoresProvider = ({ children }) => {
  return <StoresContext.Provider value={new Stores()}>{children}</StoresContext.Provider>;
};

export const useStores = () => {
  const context = useContext(StoresContext);

  if (context === undefined) {
    throw new Error('useStores without a root StoreProvider');
  }

  return context;
};
