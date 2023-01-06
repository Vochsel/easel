import { createSignal, createContext, useContext } from "solid-js";
import { checkLogin, getPrivateKey } from "../auth";

const EaselAuthContext = createContext();

export function EaselAuthProvider(props) {
    const setupLogin = () => {
        var _private_key = getPrivateKey();
        if (!_private_key) return false;
        return checkLogin(_private_key);
    }

    const [isLoggedIn, setIsLoggedIn] = createSignal(setupLogin());

    const context = [
        isLoggedIn,
    ]

    return (
        <EaselAuthContext.Provider value={context}>
            {props.children}
        </EaselAuthContext.Provider>
    );
}

export function useEaselAuth() { return useContext(EaselAuthContext); }