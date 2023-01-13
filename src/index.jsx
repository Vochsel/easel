// import './styles.css';

import { render } from 'solid-js/web';
import { Header, Footer } from './views/common';
import { Feed } from './views/feed';
import { EaselAuthProvider } from './context/authContext';
import { EaselOwnerProvider } from './context/ownerContext';
import { Tabs } from './views/tabs';
import { loadFollowingFeed } from './feature/blog';
import { loadContentFromList, loadManifest } from './loaders';

function App({ metadata }) {

    return <EaselOwnerProvider metadata={metadata}>
        <EaselAuthProvider>
            <div id='container'>
                <Header metadata={metadata} />
                <Tabs tabNames={["Ben", "Following"]} tabs={[
                    <Feed mode="dynamic" source={location.href + "/content/feed"} />,
                    <Feed mode="manual" getItems={() => { return loadFollowingFeed() }} isEditable={false} />,
                ]} />
                <Footer />
            </div>
        </EaselAuthProvider>
    </EaselOwnerProvider>;
}

window.setupPage = (metadata) => {
    render(() => <App metadata={metadata} />, document.body);
}
