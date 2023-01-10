import { createSignal, createContext, useContext } from "solid-js";
import { checkLogin, handleLogin, handleLogout } from "../feature/auth";

const EaselAuthContext = createContext();

export function EaselAuthProvider(props) {

    const [isLoggedIn, setIsLoggedIn] = createSignal(false);

    checkLogin().then(x => setIsLoggedIn(x))

    const context = {
        isLoggedIn,
        login: (private_key) => {
            handleLogin(private_key).then(success => {
                setIsLoggedIn(success);
            });
        },
        logout: () => {
            handleLogout().then(() => {
                setIsLoggedIn(false);
            });
        },
    }

    return (
        <EaselAuthContext.Provider value={context}>
            {props.children}
        </EaselAuthContext.Provider>
    );
}

export function useEaselAuth() { return useContext(EaselAuthContext); }