import React, {useEffect, useState} from 'react';

export default function VideoModal({linkText = 'Watch video', iframeSrc, title = 'Video'}) {
  const [isOpen, setIsOpen] = useState(false);
  const open = (e) => { e.preventDefault(); setIsOpen(true); };
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      <a href="#" onClick={open}>{linkText}</a>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={(e) => { if (e.currentTarget === e.target) close(); }}
          style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px'}}
        >
          <div style={{
            position:'relative',
            width:'min(90vw, 1280px)',
            aspectRatio:'16 / 9',
            background:'#000',
            borderRadius:8,
            boxShadow:'0 10px 35px rgba(0,0,0,0.5)'
          }}>
            <button onClick={close} aria-label="Close"
              style={{position:'absolute', top:8, right:10, fontSize:28, color:'#fff', background:'transparent', border:'none', cursor:'pointer', zIndex:1}}>
              ×
            </button>
            <div style={{position:'absolute', inset:0, borderRadius:8, overflow:'hidden'}}>
              <iframe
                src={iframeSrc}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                title={title}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}


