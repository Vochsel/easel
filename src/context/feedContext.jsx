import { createSignal, createContext, useContext } from "solid-js";
import { loadManifest } from "../loaders";

const EaselFeedContext = createContext();

export function EaselFeedProvider(props) {
    const [items, setItems] = createSignal(props.metadata);

    loadManifest(location.pathname + "content/feed").then(files => {
        setItems(files)
    })

    const context = {
        items,
        addNewItem: (item) => {
            console.log(items())
            // This allows us to show new posts without refreshing
            let _items = [item, ...items()];

            setItems(_items);
        }
    }

    return (
        <EaselFeedContext.Provider value={context}>
            {props.children}
        </EaselFeedContext.Provider>
    );
}

export function useEaselFeed() { return useContext(EaselFeedContext); }