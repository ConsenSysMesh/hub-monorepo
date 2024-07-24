import React, {
    useContext,
    useState,
    createContext,
    ReactNode,
} from "react";

interface Props {
    children: ReactNode,
}

type FidContextProps = {
    fid: number,
    setFid: Function,
}

const FidContext = createContext({});

const FidProvider: React.FC<Props> = ({ children }) => {
    const [fid, setFid] = useState(Number(process.env.NEXT_PUBLIC_FID_2));

    return (
      <FidContext.Provider value={{ fid, setFid }}>
        {children}
      </FidContext.Provider>
    );
};
  
export default FidProvider;

export const useFid = () : FidContextProps => {
    return useContext(FidContext) as FidContextProps;
};
