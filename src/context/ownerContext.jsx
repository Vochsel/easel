import { createSignal, createContext, useContext } from "solid-js";
import { getFollowers, getFollowing } from "../feature/account";
import { checkLogin, handleLogin, handleLogout } from "../feature/auth";
import { loadManifest } from "../loaders";

const EaselOwnerContext = createContext();

export function EaselOwnerProvider(props) {

    const [metadata, setMetadata] = createSignal(props.metadata);

    const [followers, setFollowers] = createSignal(0);
    const [following, setFollowing] = createSignal(0);

    getFollowers(".").then(fList => setFollowers(fList));
    getFollowing(".").then(fList => setFollowing(fList));

    const context = {
        metadata,
        followers,
        following,
    }

    return (
        <EaselOwnerContext.Provider value={context}>
            {props.children}
        </EaselOwnerContext.Provider>
    );
}

export function useEaselOwner() { return useContext(EaselOwnerContext); }