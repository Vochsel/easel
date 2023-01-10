// import './styles.css';

import { render } from 'solid-js/web';
import { Header, Footer } from './views/common';
import { Feed } from './views/feed';
import { EaselAuthProvider } from './context/authContext';
import { EaselOwnerProvider } from './context/ownerContext';

function App({ metadata }) {

    return <EaselOwnerProvider metadata={metadata}>
        <EaselAuthProvider>
            <div id='container'>
                <Header metadata={metadata} />
                <Feed />
                <Footer />
            </div>
        </EaselAuthProvider>
    </EaselOwnerProvider>;
}

window.setupPage = (metadata) => {
    render(() => <App metadata={metadata} />, document.body);
}
