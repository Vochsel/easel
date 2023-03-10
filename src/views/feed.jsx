import { createResource, createSignal, For, Suspense } from "solid-js";
import { loadItem, loadManifest } from "../loaders";
import { Converter } from "showdown";
import { useEaselAuth } from "../context/authContext";
import { Button, FileUploadInvisible, IconButton, TextEdit } from "../components/input";
import { deleteItem, editItem, postItem, uploadItem } from "../feature/blog";
import 'boxicons';
import hotkeys from 'hotkeys-js';
import { EaselFeedProvider, useEaselFeed } from "../context/feedContext";

const EditButtons = (props) => {
    return <span>
        <IconButton style={{ display: 'inline', top: '6px', position: 'relative' }} onClick={() => {
            props.setIsEditing(!props.isEditing());
            if (!props.isEditing()) {
                editItem(props.content(), props?.source);
            }
        }}>
            {props.isEditing() ?
                <box-icon type='solid' name='save' size='2.5vh' color="#777" /> :
                <box-icon type='solid' name='edit' size='2.5vh' color="#777" />
            }
        </IconButton>
        <IconButton style={{ display: 'inline', top: '6px', position: 'relative' }} onClick={() => {
            deleteItem(props?.source).then(x => console.log(x)).then(() => location.reload());
        }}>
            <box-icon type='solid' name='trash' size='2.5vh' color="#777" />
        </IconButton>
    </span>
}

const ItemMetadata = (props) => {

    const { isLoggedIn } = useEaselAuth();

    const { isEditable } = useEaselFeed();

    return <div className="metadata">
        #<b>{props?.name}</b> {props.author && <span>{props.author}</span>} - {new Date(props?.lastModified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })} {isLoggedIn() && isEditable() && <EditButtons isEditing={props.isEditing} setIsEditing={props.setIsEditing} />}
    </div>;
}

const ItemContent = (props) => {
    const converter = new Converter();

    return <div className="content">
        {
            props.isEditing() ?
                <TextEdit value={props.content()} style={{ width: '100%', height: '100px' }} onChange={(e) => {
                    props.setContent(e.target.value);
                }} /> :
                <div innerHTML={converter.makeHtml(props.content())}></div>
        }
    </div>;
}

const Item = (props) => {
    const [isEditing, setIsEditing] = createSignal(false);
    const [content, setContent] = createSignal("");

    let item = props.item;
    console.log(item)

    let name = item.item_name;

    setContent(item.data.content);

    return <div className="item">
        <hr />
        <ItemMetadata
            name={name}
            author={item?.author}
            lastModified={item.data.lastModified}
            source={item.source}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            content={content}
        />
        <ItemContent isEditing={isEditing} content={content} setContent={setContent} />
    </div>;
}

const NewItem = (props) => {
    let textRef, uploadRef, postRef;

    hotkeys.filter = function (event) {
        return true;
    }

    hotkeys('shift+enter', 'all', (e) => {
        e.preventDefault();
        postRef.click();
    })

    const { addNewItem } = useEaselFeed();

    return <div className="item" style={{ "text-align": 'right' }}>
        <hr />
        <TextEdit ref={textRef} className="text_area" style={{
            width: '100%',
            height: '100px',
            resize: 'none'
        }} placeholder="What's on your mind?" />

        <div style={{
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'right',
            gap: '10px',
        }}>
            <IconButton onClick={() => {
                uploadRef.click();
            }}>
                <box-icon name='image-add' size='40px' color="#777" />
                <FileUploadInvisible ref={uploadRef} onChange={() => {
                    uploadItem(uploadRef.files[0]).then(item => {
                        // TODO: Figure out pathing and abs/rel...
                        addNewItem(item.path.split('/').slice(-1)[0]);
                    });
                }} />
            </IconButton>

            <Button ref={postRef} title="Post (Shift+Enter)" style={{
                "margin-bottom": '5px',
                "margin-top": '10px',
            }} value="Post" onClick={() => {
                postItem(textRef.value).then(item => {
                    // TODO: Figure out pathing and abs/rel...
                    addNewItem(item.path.split('/').slice(-1)[0]);
                });

            }} />
        </div>
    </div>;
}

const FeedItems = () => {

    const { items } = useEaselFeed();
    const { isLoggedIn } = useEaselAuth();

    return <div>
        {isLoggedIn() && <NewItem />}
        <For each={items()}>
            {(item, i) => <Suspense fallback={<p>Loading</p>}>
                <Item item={item} />
            </Suspense>
            }
        </For>
        {items().length == 0 && <p>Loading...</p>}
    </div>;
}

const Feed = (props) => {
    return <EaselFeedProvider {...props}>
        <FeedItems />
    </EaselFeedProvider>;
}

export { Item, Feed };