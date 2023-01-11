
export function postEaselAPI(data) {

    // let formData = new FormData();
    // formData.append('is_logged_in', true);

    return fetch("api.php", {
        method: 'POST',
        body: data
    }).then(x => x.json());
}