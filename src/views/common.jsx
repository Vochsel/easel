import { Button, FileUpload, IconButton, TextEdit } from "../components/input";
import { useEaselAuth } from "../context/authContext";
import { useEaselOwner } from "../context/ownerContext";
import { currentEaselProfile, followUser } from "../feature/account";

import { publishRSS, syncServer } from "../feature/blog";
import { Menu } from "./menu";

const Header = () => {
    const { metadata, following, followers } = useEaselOwner();
    const { isLoggedIn } = useEaselAuth();

    return <div id='profile'>
        <div id='profileHeader'>
            <img
                id='headerProfile'
                className="profilePicture"
                src={metadata().profilePicture}
                width={75}
                height={75}
                crossOrigin
            />
            <img
                id='headerPicture'
                src={metadata().headerPicture}
                crossOrigin
            />
        </div>
        <div style={{ display: 'flex' }}>
            <div style={{ 'flex-grow': 1 }}>
                <span id='name'>{metadata().name}</span>
                <span id='handle'>@{metadata().handle}</span>
                <div id='description' innerHTML={metadata().description}></div>
                <Menu />
            </div>
            <div style={{ display: 'flex', 'flex-direction': 'column', gap: '10px', 'text-align': 'right' }}>
                {!isLoggedIn() && <Button value="Follow" name="follow" onClick={() => {
                    followUser(currentEaselProfile)
                }} />}

            </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', 'padding-top': '10px' }}>
            <span id="follower_count"><b>Followers: </b>{followers().length}</span>
            <span id="following_count"><b>Following: </b>{following().length}</span>
        </div>
    </div>;
}

const Footer = () => {
    return <div id='footer'>
        Created on <a href='https://github.com/Vochsel/easel' target='_blank'>Easel</a>
    </div>;
}

export { Header, Footer };