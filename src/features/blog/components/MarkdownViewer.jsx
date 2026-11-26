import { useEffect, useRef } from 'react'

export default function Markdown({ content }) {
 const hostRef=useRef(null)
 useEffect(()=>{let cancelled=false,viewer;Promise.all([import('@toast-ui/editor'),import('@toast-ui/editor/dist/toastui-editor.css')]).then(([module])=>{if(cancelled)return;viewer=module.default.factory({el:hostRef.current,viewer:true,initialValue:content||'',usageStatistics:false});hostRef.current.querySelectorAll('a').forEach(link=>{link.rel='noopener noreferrer';if(link.target==='_blank')link.setAttribute('aria-label',`${link.textContent} (membuka tab baru)`)})}).catch(()=>{if(!cancelled&&hostRef.current)hostRef.current.textContent=content||''});return()=>{cancelled=true;viewer?.destroy()}},[content])
 return <div className="markdown-body toast-viewer" ref={hostRef} aria-label="Isi artikel" />
}
