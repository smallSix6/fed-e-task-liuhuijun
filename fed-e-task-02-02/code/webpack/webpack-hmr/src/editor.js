import './editor.css'
console.log(222)
export default () => {
    const editorElement = document.createElement('div')

    editorElement.contentEditable = true
    editorElement.className = 'editor'
    editorElement.id = 'editor'

    console.log('editor init completed')

    return editorElement
}