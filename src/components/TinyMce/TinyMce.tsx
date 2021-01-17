import React from "react"
import tinymce from "tinymce"
import 'tinymce/tinymce';
 import 'tinymce/icons/default';
 import 'tinymce/themes/silver';
 import 'tinymce/plugins/paste';
 import 'tinymce/plugins/link';
 import 'tinymce/plugins/image';
 import 'tinymce/plugins/table';
 import 'tinymce/skins/ui/oxide/skin.min.css';
 import 'tinymce/skins/ui/oxide/content.min.css';
 import 'tinymce/skins/content/default/content.min.css';
 import { Editor } from '@tinymce/tinymce-react';

interface IProps {
    id:string
    onEditorChange:any
    content:string
}

const TinyMce:React.FC<IProps> = ({id,content,onEditorChange}) => {
    return(
        <Editor        
        init={{
            skin:false,
            content_css:false,
            content_style:"body{font-family: 'Bahnschrift';}",
            height: 500,
            width: "100%",
            // placeholder:"Input Your sermon here",
            autosave_restore_when_empty: true,
            menubar: 'preview file view format help',
            plugins: [
                // eslint-disable-next-line
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
            ],
            toolbar:
                // eslint-disable-next-line    
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat',
            toolbar_mode: "sliding",
            style_formats_autohide: true,
            preview_styles: "Mulish 100px 900"
        }}
        value={content} onEditorChange={onEditorChange}
        />
    )
}

export default TinyMce