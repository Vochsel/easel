import { createSignal, createContext, useContext } from "solid-js";
import { checkLogin, handleLogin, handleLogout } from "../feature/auth";
import Cookies from 'js-cookie'
import { currentEaselProfile } from "../feature/account";

const EaselAuthContext = createContext();

export function EaselAuthProvider(props) {

    const [isLoggedIn, setIsLoggedIn] = createSignal(false);

    checkLogin().then(x => setIsLoggedIn(x))

    const context = {
        isLoggedIn,
        login: (private_key) => {
            handleLogin(private_key).then(success => {
                setIsLoggedIn(success);
                if(success) {
                    Cookies.set('easel-user', currentEaselProfile);
                }
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