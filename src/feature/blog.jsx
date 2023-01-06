const postItem = (props) => {
    let formData = new FormData();
    formData.append('new_post', props.value);

    fetch("api.php", {
        method: 'POST',
        body: formData
    })
}

export { postItem };