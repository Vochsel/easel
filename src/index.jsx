import _ from 'lodash';
import './styles.css';

import { render } from 'solid-js/web';
import { Header, Footer } from './views/common';
import { Feed } from './views/feed';
import { EaselAuthProvider } from './context/auth';

function App({ metadata }) {

    return <EaselAuthProvider>
        <div id='container'>
            <Header metadata={metadata} />
            <Feed />
            <Footer />
        </div>
    </EaselAuthProvider>;
}

window.setupPage = (metadata) => {
    render(() => <App metadata={metadata} />, document.body);
}
