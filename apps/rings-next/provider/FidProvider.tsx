import React, {
    useContext,
    useState,
    createContext,
    ReactNode,
} from "react";

import { useLocalStorage } from "@farcaster/rings-next/hooks/useLocalStorage";
import useEffectOnce from "@farcaster/rings-next/hooks/useEffectOnce";


interface Props {
    children: ReactNode,
}

type FidContextProps = {
    fid: number,
    setFid: Function,
}

const FidContext = createContext({});

const FID_KEY = 'FID';

const FidProvider: React.FC<Props> = ({ children }) => {
    const [fid, setFid] = useState(0);
    const { getItem, removeItem, setItem } = useLocalStorage();

    useEffectOnce(() => {
        const t = Number(getItem(FID_KEY) || "0");
        if (t !== 0) {
          setFid(t);
        }
    });

    const setFidAndLocalStore = (fid: number) => {
        setFid(fid);
        setItem(FID_KEY, fid.toString());
    }

    return (
      <FidContext.Provider value={{ fid, setFid: setFidAndLocalStore }}>
        {children}
      </FidContext.Provider>
    );
};
  
export default FidProvider;

export const useFid = () : FidContextProps => {
    return useContext(FidContext) as FidContextProps;
};
