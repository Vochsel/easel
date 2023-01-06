import { checkLogin, storePrivateKey } from "../auth";
import { Button, FileUpload, IconButton, TextEdit } from "../components/input";
import { useEaselAuth } from "../context/auth";

import hotkeys from 'hotkeys-js';

const Header = ({ metadata }) => {
    const [isLoggedIn] = useEaselAuth();

    return <div id='profile'>
        <div id='profileHeader'>
            <img
                id='headerProfile'
                className="profilePicture"
                src={metadata.profilePicture}
                width={75}
                height={75}
                crossOrigin
            />
            <img
                id='headerPicture'
                src={metadata.headerPicture}
                crossOrigin
            />
        </div>
        <div style={{ display: 'flex' }}>
            <div style={{ 'flex-grow': 1 }}>
                <span id='name'>{metadata.name}</span>
                <span id='handle'>@{metadata.handle}</span>
                <div id='description' innerHTML={metadata.description}></div>
            </div>
            <div>
                {!isLoggedIn() && <Button value="Follow" name="follow" onClick={() => {
                    alert(`Followed!`)
                }}/>}
            </div>
        </div>
        <Nav />
    </div>;
}

const Footer = () => {
    return <div id='footer'>
        Created on <a href='https://github.com/Vochsel/easel' target='_blank'>Easel</a>
    </div>;
}

const UserMenu = () => {
    let upload_btn, post_btn, content;

    hotkeys.filter = function (event) {
        return true;
    }

    hotkeys('shift+enter', 'all', (e) => {
        e.preventDefault();
        post_btn.click();
    })

    return <>
        <IconButton onClick={() => {
            localStorage.clear();
            location.reload();
        }}>
            <box-icon type='solid' name='user' size="md" color="#bbb"></box-icon>
        </IconButton>

        {/* <Button name="publish_rss" value="Update RSS" />
        <Button name="update_easel" value="Update easel.php" /> */}
    </>;
}

const AnonymousMenu = () => {
    return <>
        <IconButton onClick={() => {
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
        }}>
            <box-icon name='user' size="md" color="#bbb"></box-icon>
        </IconButton>
    </>;
}

const Nav = () => {
    const [isLoggedIn] = useEaselAuth();

    return <div id="nav">
        <form method="POST" encType="multipart/form-data" >

            {isLoggedIn() ? <UserMenu /> : <AnonymousMenu />}

        </form>
    </div>;
}

export { Header, Footer, Nav };