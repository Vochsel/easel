import { createResource, createSignal, For, Suspense } from "solid-js";
import { loadItem, loadManifest } from "../loaders";
import { Converter } from "showdown";
import { useEaselAuth } from "../context/auth";
import { Button, FileUploadInvisible, IconButton, TextEdit } from "../components/input";
import { deleteItem, postItem, uploadItem } from "../feature/blog";
import 'boxicons';
import hotkeys from 'hotkeys-js';

const ItemMetadata = (props) => {
    const [isLoggedIn] = useEaselAuth();

    const editButton = <IconButton style={{ display: 'inline', top: '6px', position: 'relative' }} onClick={() => {
        props.setIsEditing(!props.isEditing());
        if (!props.isEditing()) {
            editItem(props.content(), props.item()?.source);
        }
    }}>
        {props.isEditing() ?
            <box-icon type='solid' name='save' size='sm' color="#777" /> :
            <box-icon type='solid' name='edit' size='sm' color="#777" />
        }
    </IconButton>;

    const deleteButton = <IconButton style={{ display: 'inline', top: '6px', position: 'relative' }} onClick={() => {
        deleteItem(props.item()?.source).then(x => console.log(x)).then(() => location.reload());
    }}>
        <box-icon type='solid' name='trash' size='sm' color="#777" />
    </IconButton>;

    return <div className="metadata">
        #<b>{props.item()?.item_name}</b> - {new Date(props.item()?.data?.lastModified).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })} {isLoggedIn() && editButton} {isLoggedIn() && deleteButton}
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

    const [item] = createResource(async () => {
        return new Promise(async resolve => {
            const item = await loadItem(location.pathname + "content/feed", props.source);
            resolve(item);
            console.log(item)
            setContent(item.data.content);
        })
    });

    return <div className="item">
        <hr />
        <ItemMetadata item={item} isEditing={isEditing} setIsEditing={setIsEditing} content={content} />
        <ItemContent item={item} isEditing={isEditing} content={content} setContent={setContent} />
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
                    // TODO: Make the feed refresh without a reload
                    uploadItem(uploadRef.files[0]).then(() => location.reload())
                }} />
            </IconButton>

            <Button ref={postRef} title="Post (Shift+Enter)" style={{
                "margin-bottom": '5px',
                "margin-top": '10px',
            }} value="Post" onClick={() => {
                // TODO: Make the feed refresh without a reload
                postItem(textRef.value).then(() => location.reload())

            }} />
        </div>
    </div>;
}

const FeedItems = () => {
    const [files] = createResource(location.pathname + "content/feed", loadManifest);

    const [isLoggedIn] = useEaselAuth();

    return <div>
        {isLoggedIn() && <NewItem />}
        <For each={files()}>
            {(file, i) => <Suspense fallback={<p>Loading</p>}>
                <Item source={file} />
            </Suspense>
            }
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