import { IconBook2 } from '@tabler/icons-react'

export default function Brand({ navigate }) { return <a className="brand" href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}><span className="brand-mark"><IconBook2 size={21} stroke={2.2} aria-hidden="true" /></span><span>delcom<span className="brand-light">blog</span><small>IDEAS WORTH SHARING</small></span></a> }
