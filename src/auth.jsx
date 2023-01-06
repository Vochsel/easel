
export function storePrivateKey(key) {
    localStorage.setItem('privateKey', key);
}

export function getPrivateKey() {
    return localStorage.getItem("privateKey");
}

export function checkLogin(private_key) {
    var crypt = new JSEncrypt();
    crypt.setPrivateKey(private_key);
    const pk = crypt.getPublicKey().replaceAll('\n', '');
    return pk === metadata.publicKey
}

export function generateKeys() {
    var crypt = new JSEncrypt({ default_key_size: 1024 });
    const pv = crypt.getPrivateKey().replaceAll('\n', '');
    const pb = crypt.getPublicKey().replaceAll('\n', '');

    console.log(pv)
    console.log(pb)
}