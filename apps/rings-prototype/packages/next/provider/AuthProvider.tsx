import React, {
  useContext,
  useState,
  createContext,
  ReactNode,
  useMemo,
} from "react";
import { useLocalStorage } from "@tipster/next/hooks/useLocalStorage";
import { useRouter, usePathname } from "next/navigation";
import { Spinner, YStack } from "tamagui";
import useEffectOnce from "@tipster/next/hooks/useEffectOnce";

const AuthContext = createContext({});

interface Props {
  children: ReactNode,
}

type Auth = {
  token: string,
  session: any,
  login: Function,
  logout: Function,
}

const accountKey = 'session';

// Base64 encoded unicodes: https://web.dev/articles/base64-encoding
function objToBase64(obj: Object) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

function base64ToObj(base64: string) {
  const binString = atob(base64);
  const uInt8Array = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
  return JSON.parse(new TextDecoder().decode(uInt8Array));
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const { getItem, removeItem, setItem } = useLocalStorage();
  const { replace } = useRouter();
  const [session, setSession] = useState(null);
  const [token, setToken] = useState("");
  const pathname = usePathname();
  const isLoginPage = useMemo(() => (
    pathname?.replace('/', '') === 'login'
  ), [pathname]);
  const [redirectPath, setRedirectPath] = useState<string>('/');

  useEffectOnce( () => {
    const t = getItem(accountKey) || "";
    if (t) {
      setSession(base64ToObj(t));
      setToken(t);
      // If there is an existing session, and we're on login page, then redirect to home directory
      if (isLoginPage) {
        replace('/');
      }
    } else {
      if (!isLoginPage) {
        setRedirectPath(pathname);
      }
      replace('/login');
    }
  });

  const login = async (data) => {
    setSession(data);
    const newToken = objToBase64(data);
    setToken(newToken);
    setItem(accountKey, newToken);
    replace(redirectPath);
  };

  const logout = async () => {
    setSession(null)
    setToken("");
    removeItem(accountKey);
    replace('/login');
    setRedirectPath('/');
  };

  return (
    <AuthContext.Provider value={{ token, session, login, logout }}>
      {(!session && !isLoginPage) ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$violet8" />
        </YStack>
      ) : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () : Auth => {
  return useContext(AuthContext) as Auth;
};
