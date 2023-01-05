import _ from 'lodash';
import './styles.css';

import { render } from 'solid-js/web';
import { Header, Footer } from './views/common';
import { Feed } from './views/feed';

function App({ metadata }) {

    return <div id='container'>
        <Header metadata={metadata} />
        <Feed />
        <Footer />
    </div>;
}

window.setupPage = (metadata) => {
    render(() => <App metadata={metadata} />, document.body);
}
