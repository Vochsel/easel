import { createSignal, createContext, useContext, mergeProps } from "solid-js";
import { loadContentFromList, loadManifest } from "../loaders";

const EaselFeedContext = createContext();

// Mode can be dynamic | manual
export function EaselFeedProvider(props) {
    const merged = mergeProps({ isEditable: true, mode: 'dynamic' }, props);

    const [items, setItems] = createSignal([]);
    const [isEditable, setIsEditable] = createSignal(merged.isEditable);


    if (props.mode === 'manual') {
        console.log('using manual');
        props.getItems().then(items => {
            setItems(items);
        })
    } else if (props.mode === 'dynamic') {
        console.log('using dynamic');
        loadManifest(props.source).then(list => loadContentFromList(list)).then(items => {
            setItems(items);
        });
    }

    const context = {
        items,
        isEditable,
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