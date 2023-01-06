import { createResource, createSignal, For, Suspense } from "solid-js";
import { loadItem, loadManifest } from "../loaders";
import { Converter } from "showdown";
import { useEaselAuth } from "../context/auth";
import { Button, FileUploadInvisible, IconButton, TextEdit } from "../components/input";
import { postItem } from "../feature/blog";
import 'boxicons';

const ItemMetadata = (props) => {
    var d = new Date(props.item()?.data?.lastModified);
    var df = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) //weekday: 'long',

    const [isLoggedIn] = useEaselAuth();

    const editButton = <input type='button' value={props.isEditing() ? "Save" : "Edit"} onClick={() => {
        props.setIsEditing(!props.isEditing());
        if (!props.isEditing()) {

            let formData = new FormData();
            formData.append('edit_post', props.content());
            formData.append('source', props.item()?.source);

            fetch("api.php", {
                method: 'POST',
                body: formData
            }).then(x => x.text()).then(x => console.log(x));
        }
    }
    } />;

    return <div className="metadata">
        #<b>{props.item()?.item_name}</b> - {df} {isLoggedIn() && editButton}
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
    let textRef, uploadRef;

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
                <box-icon name='image-add' size='lg' color="#777" />
                <FileUploadInvisible ref={uploadRef}/>
            </IconButton>
            <Button style={{
                "margin-bottom": '5px',
                "margin-top": '10px',

            }} value="Post" onClick={() => {
                postItem(textRef.value);
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