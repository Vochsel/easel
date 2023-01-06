import { checkLogin, storePrivateKey } from "../auth";
import { Button, FileUpload, TextEdit } from "../components/input";
import { useEaselAuth } from "../context/auth";

import hotkeys from 'hotkeys-js';

const Header = ({ metadata }) => {
    return <div id='profile'>
        <div id='profileHeader'>
            <img
                id='headerProfile'
                className="profilePicture"
                src={metadata.profilePicture}
                width={75}
                height={75}
            />
            <img
                id='headerPicture'
                src={metadata.headerPicture}
            />
        </div>
        <span id='name'>{metadata.name}</span>
        <span id='handle'>@{metadata.handle}</span>
        <div id='description' innerHTML={metadata.description}></div>
        <Nav />
    </div>;
}

const Footer = () => {
    return <div id='footer'>
        Created on <a href='https://github.com/Vochsel/easel' target='_blank'>Easel</a>
    </div>;
}

const UserMenu = () => {
    let upload_btn, post_btn;

    hotkeys.filter = function (event) {
        return true;
    }

    hotkeys('shift+enter', 'all', (e) => {
        e.preventDefault();
        post_btn.click();
    })

    return <>
        <Button value="Logout" name="logout" type="button" onClick={() => {
            localStorage.clear();
            location.reload();
        }} />
        <Button name="publish_rss" value="Update RSS" />
        <Button name="update_easel" value="Update easel.php" />
        <TextEdit name="new_post" />
        <Button ref={post_btn} name="post" value="Post (Shift + Enter)" />
        <FileUpload ref={upload_btn} name="upload_media" onChange={() => {
            let form_el = upload_btn.parentElement.parentElement;
            var trigger = document.createElement("input");
            trigger.type = "text";
            trigger.value = "true"
            trigger.name = "has_upload";
            trigger.style.display = "none";
            form_el.appendChild(trigger);
            form_el.submit();
        }} />
    </>;
}

const AnonymousMenu = () => {
    return <>
        <Button value="Follow" name="follow" />
        <Button value="Login" name="login" onClick={() => {
            const private_key = prompt("Enter private key (Saved locally)");
            try {
                if (checkLogin(private_key)) {
                    storePrivateKey(private_key);
                    location.reload();
                    return;
                }
            } catch (error) {
                alert("Incorrect password");

            }
        }} />
    </>;
}

const Nav = () => {
    const [isLoggedIn] = useEaselAuth();

    return <div id="nav">
        <form method="POST" encType="multipart/form-data">

            {isLoggedIn() ? <UserMenu /> : <AnonymousMenu />}

        </form>
    </div>;
}

export { Header, Footer, Nav };