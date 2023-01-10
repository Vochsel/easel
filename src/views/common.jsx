import { Button, FileUpload, IconButton, TextEdit } from "../components/input";
import { useEaselAuth } from "../context/authContext";

import { publishRSS, syncServer } from "../feature/blog";

const Header = ({ metadata }) => {
    const { isLoggedIn } = useEaselAuth();

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
                <Nav />
            </div>
            <div>
                {!isLoggedIn() && <Button value="Follow" name="follow" onClick={() => {
                    alert(`Followed!`)
                }} />}
            </div>
        </div>
    </div>;
}

const Footer = () => {
    return <div id='footer'>
        Created on <a href='https://github.com/Vochsel/easel' target='_blank'>Easel</a>
    </div>;
}

const UserMenu = () => {
    const { logout } = useEaselAuth();
    return <>
        <IconButton onClick={() => {
            logout();
        }}>
            <box-icon type='solid' name='user' size="3vh" color="#bbb"></box-icon>
        </IconButton>
        <IconButton onClick={() => {
            publishRSS().then(x => {
                console.log(x);
            });
        }}>
            <box-icon name='rss' size="3vh" color="#bbb"></box-icon>
        </IconButton>
        <IconButton onClick={() => {
            const version = prompt("Easel version preference:", "latest");
            syncServer(version).then(x => {
                console.log(x);
                location.reload();
            });
        }}>
            <box-icon name='sync' size="3vh" color="#bbb"></box-icon>
        </IconButton>

        {/* <Button name="publish_rss" value="Update RSS" />
        <Button name="update_easel" value="Update easel.php" /> */}
    </>;
}

const AnonymousMenu = () => {
    const { login } = useEaselAuth();

    return <>
        <IconButton onClick={() => {
            const private_key = prompt("Enter private key (Saved locally)");
            login(private_key);
        }}>
            <box-icon name='user' size="md" color="#bbb"></box-icon>
        </IconButton>
    </>;
}

const Nav = () => {
    const { isLoggedIn } = useEaselAuth();

    return <div id="nav">
        <form method="POST" encType="multipart/form-data" >

            {isLoggedIn() ? <UserMenu /> : <AnonymousMenu />}

        </form>
    </div>;
}

export { Header, Footer, Nav };