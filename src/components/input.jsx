const Button = (props) => {
    return <input type='submit' className="button" {...props} />
}

const TextEdit = (props) => {
    return <textarea {...props} className="text_edit"></textarea>
}

const FileUpload = (props) => {
    return <label className="button">
        Upload
        <input type="file" {...props} />
    </label>;
}

export { Button, TextEdit, FileUpload };