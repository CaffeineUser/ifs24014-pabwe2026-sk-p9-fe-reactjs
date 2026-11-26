import { useEffect, useRef, useState } from 'react'

export default function MarkdownEditor({ value, onChange, labelledBy }) {
 const mountRef=useRef(null),changeRef=useRef(onChange),initialValueRef=useRef(value)
 const [fallback,setFallback]=useState(false)
 useEffect(()=>{changeRef.current=onChange},[onChange])
 useEffect(()=>{let cancelled=false;let editor;Promise.all([import('@toast-ui/editor'),import('@toast-ui/editor/dist/toastui-editor.css')]).then(([module])=>{if(cancelled)return;const Editor=module.default;editor=new Editor({el:mountRef.current,height:'100%',initialEditType:'markdown',previewStyle:'vertical',initialValue:initialValueRef.current,usageStatistics:false,autofocus:false,toolbarItems:[['heading','bold','italic'],['hr','quote'],['ul','ol'],['link','code']]});mountRef.current.querySelector('[contenteditable="true"]')?.setAttribute('aria-label','Isi artikel dalam Markdown');mountRef.current.querySelector('.CodeMirror textarea')?.setAttribute('aria-label','Isi artikel dalam Markdown');editor.on('change',()=>changeRef.current(editor.getMarkdown()))}).catch(()=>{if(!cancelled)setFallback(true)});return()=>{cancelled=true;editor?.destroy()}},[])
 if(fallback)return <textarea className="markdown-editor-fallback" aria-label="Isi artikel dalam Markdown" value={value} onChange={event=>onChange(event.target.value)} />
 return <div className="markdown-editor-host" ref={mountRef} role="group" aria-labelledby={labelledBy} />
}
