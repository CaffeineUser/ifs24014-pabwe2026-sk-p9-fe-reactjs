import { useEffect, useState } from 'react'
import { IconArrowLeft, IconArrowRight, IconClock } from '@tabler/icons-react'
import { categoryOf, dateOf, titleOf, unwrap } from '../../helpers/blogHelper'
import { getPublicPost } from './api/blogApi'
import Brand from '../../components/Brand'
import Header from '../../components/Header'
import MarkdownViewer from './components/MarkdownViewer'

export default function ArticleDetail({ path,navigate,theme,toggleTheme,user,onLogout }) {
 const slug=decodeURIComponent(path.split('?')[0].split('/').pop());const [post,setPost]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(true)
 useEffect(()=>{let live=true;getPublicPost(slug).then(r=>live&&setPost(unwrap(r))).catch(e=>live&&setError(e.message)).finally(()=>live&&setLoading(false));return()=>{live=false}},[slug])
 return <><Header navigate={navigate} user={user} onLogout={onLogout} theme={theme} toggleTheme={toggleTheme}/><main className="article-page">{loading?<div className="empty-state">Memuat artikel...</div>:error?<div className="empty-state"><h2>Artikel tidak ditemukan.</h2><p>{error}</p><button className="button button-dark" onClick={()=>navigate('/')}>Kembali ke beranda</button></div>:post&&<><button className="back-link" onClick={()=>navigate('/')}><IconArrowLeft size={17}/> Semua cerita</button><article className="article-full"><div className="article-topline"><span className="category-label">{categoryOf(post)}</span><span className="reading-time"><IconClock size={15}/>{post.reading_time||5} menit baca</span></div><h1>{titleOf(post)}</h1><p className="article-deck">{post.excerpt||post.summary}</p><div className="article-byline"><span className="avatar">{(post.author?.username||post.author_name||'D')[0].toUpperCase()}</span><div><strong>{post.author?.username||post.author_name||'Tim Delcom'}</strong><time>{dateOf(post.published_at)}</time></div></div>{(post.cover_image_path||post.cover_image||post.image_url)&&<img className="article-cover" src={post.cover_image_path||post.cover_image||post.image_url} alt={`Sampul artikel ${titleOf(post)}`} width="1400" height="680"/>}<MarkdownViewer content={post.content||post.body||post.markdown}/></article><div className="article-bottom"><span>Terima kasih telah membaca.</span><button className="button button-outline" onClick={()=>navigate('/')}>Jelajahi cerita lain <IconArrowRight size={16}/></button></div></>}</main><footer className="site-footer"><Brand navigate={navigate}/><span>© 2026 Delcom Blog</span></footer></>
}
