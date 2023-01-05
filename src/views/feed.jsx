import { createResource, createSignal, For, lazy, Suspense } from "solid-js";
import { fetchContent, loadContent } from "../loaders";
import { Converter } from "showdown";

const ItemMetadata = (props) => {
    var d = new Date(props.data.lastModified);
    var df = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) //weekday: 'long',

    return <div className="metadata">
        #<b>{props.item_name}</b> - {df}
    </div>;
}

const ItemContent = (props) => {
    const [isEditing, setIsEditing] = createSignal(false);
    const converter = new showdown.Converter();
    const converted = converter.makeHtml(props.data.content);

    return <div className="content" innerHTML={converted}>

    </div>;
}

const Item = (props) => {
    console.log(props)
    return <div className="item">
        <hr />
        <ItemMetadata  {...props} />
        <ItemContent {...props} />
    </div>;
}

const FeedItems = () => {
    const [items] = createResource(fetchContent);

    return <div>
        <For each={items()}>
            {(item, i) => <Item {...item} />}
        </For>
    </div>;
}

const Feed = () => {

    return <div>
        <Suspense fallback={<p>Loading...</p>}>
            <FeedItems />
        </Suspense>
    </div>;
}

export { Item, Feed };