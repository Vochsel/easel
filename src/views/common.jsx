
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
    </div>;
}

const Footer = () => {
    return <div id='footer'>
        Created on <a href='https://github.com/Vochsel/easel' target='_blank'>Easel</a>
    </div>;
}

export { Header, Footer };