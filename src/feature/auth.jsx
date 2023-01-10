import { SHA256 } from "crypto-js";
import JSEncrypt from "jsencrypt";

export function checkLogin(private_key) {

    let formData = new FormData();
    formData.append('is_logged_in', true);

    return fetch("api.php", {
        method: 'POST',
        body: formData
    }).then(x => x.json()).then(x => {
        console.log(x);
        return x.result;
    });
}

export async function handleLogin(private_key) {

    var crypt = new JSEncrypt();
    crypt.setPrivateKey(private_key);

    var signature = crypt.sign("easel", SHA256, 'sha256');

    let formData = new FormData();
    formData.append('login', signature);

    return fetch("api.php", {
        method: 'POST',
        body: formData
    }).then(x => x.json()).then(x => {
        return x.result;
    });
}

export async function handleLogout() {

    let formData = new FormData();
    formData.append('logout', false);

    return fetch("api.php", {
        method: 'POST',
        body: formData
    }).then(x => x.json()).then(x => {
        console.log(x);
    });
}

export function generateKeys() {
    var crypt = new JSEncrypt({ default_key_size: 1024 });
    const pv = crypt.getPrivateKey();//.replaceAll('\n', '');
    const pb = crypt.getPublicKey().replaceAll('\n', '\\n');

    console.log(pv)
    console.log(pb)
}

window.generateKeys = generateKeys;