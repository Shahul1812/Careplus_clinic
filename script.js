
document.addEventListener("DOMContentLoaded",()=>{
  const body=document.body;
  setTimeout(()=>body.classList.remove("is-loading"),650);

  const header=document.querySelector(".site-header");
  const progress=document.querySelector(".progress");
  const menu=document.querySelector(".menu-toggle");
  const links=document.querySelector(".nav-links");

  window.addEventListener("scroll",()=>{
    header?.classList.toggle("scrolled",scrollY>30);
    if(progress){
      const h=document.documentElement.scrollHeight-innerHeight;
      progress.style.width=(h>0?(scrollY/h)*100:0)+"%";
    }
  });

  menu?.addEventListener("click",()=>links?.classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>links?.classList.remove("open")));

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")});
  },{threshold:.12});
  document.querySelectorAll(".reveal,.stagger").forEach(el=>observer.observe(el));

  const glow=document.querySelector(".cursor-glow");
  window.addEventListener("pointermove",e=>{
    if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"}
  });

  document.querySelectorAll("[data-count]").forEach(el=>{
    const target=Number(el.dataset.count);
    const obs=new IntersectionObserver(entries=>{
      if(!entries[0].isIntersecting)return;
      obs.disconnect();
      let start=0; const duration=1200; const t0=performance.now();
      const tick=now=>{
        const p=Math.min((now-t0)/duration,1);
        start=Math.floor(target*(1-Math.pow(1-p,3)));
        el.textContent=start+(el.dataset.suffix||"");
        if(p<1)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    obs.observe(el);
  });

  document.querySelectorAll(".faq-q").forEach(q=>q.addEventListener("click",()=>{
    const item=q.parentElement;
    document.querySelectorAll(".faq-item").forEach(x=>{if(x!==item)x.classList.remove("open")});
    item.classList.toggle("open");
  }));

  document.querySelectorAll("[data-tilt]").forEach(card=>{
    card.addEventListener("pointermove",e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${y*-3}deg) rotateY(${x*3}deg) translateY(-6px)`;
    });
    card.addEventListener("pointerleave",()=>card.style.transform="");
  });

  document.querySelectorAll("form[data-demo-form]").forEach(form=>{
    form.addEventListener("submit",e=>{
      e.preventDefault();
      const msg=form.querySelector(".form-message");
      if(msg)msg.textContent="Thank you. Your request has been captured for this demo website.";
      showToast("Request submitted successfully");
      form.reset();
    });
  });

  window.showToast=(text)=>{
    let t=document.querySelector(".toast");
    if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}
    t.textContent=text;t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"),2800);
  };
});
