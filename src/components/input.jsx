const Button = (props) => {
    return <input type='submit' className="button" {...props} />
}

const IconButton = (props) => {
    return <div className="icon-button" onClick={props.onClick}>
        {props.children}
    </div>
}

const TextEdit = (props) => {
    return <textarea className="text_edit" {...props}></textarea>
}

const FileUpload = (props) => {
    return <label className="button">
        Upload
        <input type="file" {...props} />
    </label>;
}

const FileUploadInvisible = (props) => {
    return <input type="file" {...props} style={{display: 'none'}}/>;
}

export { Button, TextEdit, FileUpload, IconButton, FileUploadInvisible };