gsap.registerPlugin(ScrollTrigger);

/* === UI Grid === */
const gridOverlay = document.getElementById('gridOverlay');
for (let i = 0; i < 12; i++) {
  const col = document.createElement('div');
  col.className = 'gc';
  gridOverlay.appendChild(col);
}

/* === Cursor === */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cursor.style.left=mx+'px'; cursor.style.top=my+'px';
});
(function animRing(){
  rx+=(mx-rx)*.10; ry+=(my-ry)*.10;
  cursorRing.style.left=rx+'px'; cursorRing.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,.panel-inner,.hbtn,.stack-item,button,.ig-box').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ gsap.to(cursor,{width:12,height:12,duration:.16}); gsap.to(cursorRing,{width:48,height:48,duration:.26}); });
  el.addEventListener('mouseleave',()=>{ gsap.to(cursor,{width:6,height:6,duration:.16}); gsap.to(cursorRing,{width:30,height:30,duration:.26}); });
});

/* === 테마 토글 === */
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

function applyTheme(dark) {
  htmlEl.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeToggle.textContent = dark ? 'LIGHT' : 'DARK';
  localStorage.setItem('theme', dark ? 'dark' : 'light');

  /* ripple 배경색 전환 */
  const bg = document.getElementById('rippleBg');
  if (bg) {
    bg.style.background = dark
      ? 'radial-gradient(ellipse 80% 80% at 35% 50%, #222 0%, #0e0e0e 100%)'
      : 'radial-gradient(ellipse 80% 80% at 35% 50%, #dddbd5 0%, #f0eeea 100%)';
  }
}

/* 저장된 테마 복원 */
const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme !== 'light');

themeToggle.addEventListener('click', () => {
  applyTheme(htmlEl.getAttribute('data-theme') === 'light');
});

/* === 시계 === */
function updateTime(){
  const now=new Date(), pad=n=>String(n).padStart(2,'0');
  const el=document.getElementById('topTime');
  if(el) el.textContent=`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
updateTime(); setInterval(updateTime,1000);

/* === MENU === */
const menuBtn=document.getElementById('menuBtn');
const fullMenu=document.getElementById('fullMenu');
const fmClose=document.getElementById('fmClose');
function openMenu(){ fullMenu.classList.add('open'); menuBtn.textContent='✕'; }
function closeMenu(){ fullMenu.classList.remove('open'); menuBtn.textContent='MENU'; }
menuBtn.addEventListener('click',()=>fullMenu.classList.contains('open')?closeMenu():openMenu());
fmClose.addEventListener('click',closeMenu);
document.querySelectorAll('.fm-link').forEach(l=>l.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeMenu(); });

/* === 헤더 active === */
const hbtns=document.querySelectorAll('.hbtn');
function setActive(id){
  hbtns.forEach(b=>b.classList.remove('active'));
  const t=document.querySelector(`.hbtn[href="#${id}"]`);
  if(t) t.classList.add('active');
}
ScrollTrigger.create({trigger:'#work', start:'top center', onEnter:()=>setActive('work'), onLeaveBack:()=>setActive('intro')});
ScrollTrigger.create({trigger:'#stack',start:'top center', onEnter:()=>setActive('stack'),onLeaveBack:()=>setActive('work')});
ScrollTrigger.create({trigger:'#info', start:'top center', onEnter:()=>setActive('info'), onLeaveBack:()=>setActive('stack')});

/* === Ripples — 다크 배경 물결 === */
$(function(){
  try {
    const bg = document.getElementById('rippleBg');
    const isDarkNow = htmlEl.getAttribute('data-theme') !== 'light';
    bg.style.background = isDarkNow
      ? 'radial-gradient(ellipse 80% 80% at 35% 50%, #222 0%, #0e0e0e 100%)'
      : 'radial-gradient(ellipse 80% 80% at 35% 50%, #dddbd5 0%, #f0eeea 100%)';
    $('#rippleBg').ripples({
      resolution:256, dropRadius:28, perturbance:0.055,
      interactive:true, crossOrigin:'anonymous'
    });
  } catch(e) {
    const bg = document.getElementById('rippleBg');
    if(bg) bg.style.background='radial-gradient(ellipse 80% 80% at 35% 50%, #1a1a1a 0%, #0e0e0e 100%)';
  }
});

/* 인트로 영역 마우스 → rippleBg 드롭 */
document.getElementById('intro').addEventListener('mousemove', e => {
  const bg = document.getElementById('rippleBg');
  if(!bg) return;
  const rect = bg.getBoundingClientRect();
  if(e.clientX < rect.right){
    try { $(bg).ripples('drop', e.clientX-rect.left, e.clientY-rect.top, 18, 0.04); } catch(err){}
  }
});

/* === 스킬바 애니메이션 === */
ScrollTrigger.create({
  trigger:'#intro', start:'top top', once:true,
  onEnter:()=>{
    setTimeout(()=>{
      document.querySelectorAll('.isl-fill').forEach((bar,i)=>{
        setTimeout(()=>bar.classList.add('animated'), 600+i*100);
      });
    },400);
  }
});

/* === 인트로 박스 stagger === */
gsap.utils.toArray('.ig-box').forEach((box,i)=>{
  gsap.fromTo(box,{opacity:0,y:18},{opacity:1,y:0,duration:0.7,delay:0.55+i*0.07,ease:'power3.out'});
});

/* === WORK PANELS scrub === */
const panels=gsap.utils.toArray('.proj-panel');
const SCROLL_PER=800;
const workEl=document.getElementById('work');
workEl.style.height=(panels.length*SCROLL_PER+window.innerHeight)+'px';

gsap.to('.work-label',{opacity:1,duration:0.7,scrollTrigger:{trigger:'#work',start:'top 85%'}});

panels.forEach((panel,i)=>{
  gsap.set(panel,{position:'fixed',bottom:0,left:'50%',xPercent:-50,width:'70vw',height:'60dvh',opacity:0,y:'30dvh',borderRadius:'20px 20px 0 0',zIndex:10+i});
  const tl=gsap.timeline({scrollTrigger:{trigger:workEl,start:`top+=${i*SCROLL_PER} top`,end:`top+=${(i+1)*SCROLL_PER} top`,scrub:1.2}});
  tl.to(panel,{opacity:1,y:'0dvh',ease:'none',duration:0.28},0)
    .to(panel,{width:'100vw',ease:'none',duration:1},0)
    .to(panel,{height:'100dvh',ease:'none',duration:1},0)
    .to(panel,{borderRadius:'0px',ease:'none',duration:0.38},0.62);
});

ScrollTrigger.create({
  trigger:workEl, start:`top+=${panels.length*SCROLL_PER} top`,
  onEnter:()=>panels.forEach(p=>gsap.set(p,{position:'absolute',bottom:0,y:0})),
  onLeaveBack:()=>panels.forEach(p=>gsap.set(p,{position:'fixed'})),
});

/* === 3D Canvas 아이콘 === */
/* 테마에 따라 다크=흰색, 라이트=검정 */
function cc(a) {
  const dark = document.documentElement.getAttribute('data-theme') !== 'light';
  return dark ? `rgba(255,255,255,${a})` : `rgba(26,26,26,${a})`;
}

function project3D(x,y,z,ax,ay,cx,cy,fov=200){
  const cosY=Math.cos(ay),sinY=Math.sin(ay);
  const x1=x*cosY-z*sinY, z1=x*sinY+z*cosY;
  const cosX=Math.cos(ax),sinX=Math.sin(ax);
  const y1=y*cosX-z1*sinX, z2=y*sinX+z1*cosX;
  const sc=fov/(fov+z2+100);
  return{x:cx+x1*sc, y:cy+y1*sc, z:z2, sc};
}
function drawEdges(ctx,verts,edges,color,lw){
  ctx.strokeStyle=color; ctx.lineWidth=lw;
  edges.forEach(([a,b])=>{
    ctx.beginPath(); ctx.moveTo(verts[a].x,verts[a].y);
    ctx.lineTo(verts[b].x,verts[b].y); ctx.stroke();
  });
}

const shapes={
  html(ctx,W,H,aA,aB){
    const cx=W/2,cy=H/2,s=24;
    const v=[[-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]];
    const e=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    drawEdges(ctx,v.map(([x,y,z])=>project3D(x,y,z,aA*.6,aA,cx,cy)),e,cc(0.55),1);
    ctx.setLineDash([3,4]);
    drawEdges(ctx,v.map(([x,y,z])=>project3D(x,y,z,-aB*.4,0.8-aB,cx,cy)),e,cc(0.20),1);
    ctx.setLineDash([]);
  },
  css(ctx,W,H,aA,aB){
    const cx=W/2,cy=H/2,r=26;
    function sph(ay,ax,col,lw,dash){
      if(dash)ctx.setLineDash([2,4]);else ctx.setLineDash([]);
      ctx.strokeStyle=col; ctx.lineWidth=lw;
      for(let i=0;i<8;i++){
        const phi=(i/8)*Math.PI*2; ctx.beginPath(); let f=true;
        for(let t=0;t<=32;t++){
          const th=(t/32)*Math.PI*2;
          const p=project3D(Math.sin(th)*Math.cos(phi)*r,Math.cos(th)*r,Math.sin(th)*Math.sin(phi)*r,ax,ay,cx,cy);
          f?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y); f=false;
        }
        ctx.stroke();
      }
      for(let i=1;i<5;i++){
        const lat=(i/5)*Math.PI-Math.PI/2,rr=Math.cos(lat)*r,yy=Math.sin(lat)*r;
        ctx.beginPath(); let f=true;
        for(let t=0;t<=32;t++){
          const ph2=(t/32)*Math.PI*2;
          const p=project3D(Math.cos(ph2)*rr,yy,Math.sin(ph2)*rr,ax,ay,cx,cy);
          f?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y); f=false;
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    sph(aA,aA*.5,cc(0.55),.8,false);
    sph(-aB,aB*.3,cc(0.20),.8,true);
  },
  js(ctx,W,H,aA,aB){
    const cx=W/2,cy=H/2,s=26;
    const v=[[0,-s,0],[s,0,0],[0,0,s],[-s,0,0],[0,0,-s],[0,s,0]];
    const e=[[0,1],[0,2],[0,3],[0,4],[5,1],[5,2],[5,3],[5,4],[1,2],[2,3],[3,4],[4,1]];
    drawEdges(ctx,v.map(([x,y,z])=>project3D(x,y,z,aA*.5,aA,cx,cy)),e,cc(0.55),1);
    ctx.setLineDash([2,5]);
    drawEdges(ctx,v.map(([x,y,z])=>project3D(x,y,z,-aB*.4,-aB+Math.PI/4,cx,cy)),e,cc(0.22),1);
    ctx.setLineDash([]);
  },
  react(ctx,W,H,aA,aB){
    const cx=W/2,cy=H/2,rx=28,ry=10;
    function orbit(ax,ay,col,lw,dash){
      if(dash)ctx.setLineDash([2,4]);else ctx.setLineDash([]);
      ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.beginPath(); let f=true;
      for(let t=0;t<=64;t++){
        const ph=(t/64)*Math.PI*2;
        const p=project3D(Math.cos(ph)*rx,Math.sin(ph)*ry,0,ax,ay,cx,cy);
        f?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y); f=false;
      }
      ctx.stroke(); ctx.setLineDash([]);
    }
    orbit(0,aA,cc(0.55),.9,false);
    orbit(Math.PI/3,aA,cc(0.40),.9,false);
    orbit(-Math.PI/3,aA,cc(0.28),.9,true);
    orbit(0,-aB,cc(0.16),.8,true);
    ctx.beginPath(); ctx.arc(cx,cy,3.5,0,Math.PI*2);
    ctx.fillStyle=cc(0.5); ctx.fill();
  },
  gsap(ctx,W,H,aA,aB){
    const cx=W/2,cy=H/2;
    function wave(phase,amp,col,lw,dash){
      if(dash)ctx.setLineDash([3,5]);else ctx.setLineDash([]);
      ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.beginPath();
      for(let i=0;i<=60;i++){
        const t=i/60,x=-28+t*56,y=Math.sin(t*Math.PI*3+phase)*amp,z=Math.cos(t*Math.PI*2+phase)*12;
        const p=project3D(x,y,z,aA*.3,aA,cx,cy);
        i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);
      }
      ctx.stroke(); ctx.setLineDash([]);
    }
    wave(aA,18,cc(0.55),1,false);
    wave(-aB+Math.PI,14,cc(0.22),1,true);
    [[-28,0,0],[28,0,0]].forEach(([x,y,z])=>{
      const p=project3D(x,y,z,aA*.3,aA,cx,cy);
      ctx.beginPath(); ctx.arc(p.x,p.y,2.5,0,Math.PI*2);
      ctx.fillStyle=cc(0.45); ctx.fill();
    });
  },
  figma(ctx,W,H,aA,aB){
    const cx=W/2,cy=H/2,s=18;
    const t2=(1+Math.sqrt(5))/2;
    const iv=[[-1,t2,0],[1,t2,0],[-1,-t2,0],[1,-t2,0],[0,-1,t2],[0,1,t2],[0,-1,-t2],[0,1,-t2],[t2,0,-1],[t2,0,1],[-t2,0,-1],[-t2,0,1]].map(([x,y,z])=>{const l=Math.sqrt(x*x+y*y+z*z);return[x/l*s,y/l*s,z/l*s];});
    const ie=[[0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],[2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],[4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],[7,8],[7,10],[8,9],[10,11]];
    drawEdges(ctx,iv.map(([x,y,z])=>project3D(x,y,z,aA*.4,aA,cx,cy)),ie,cc(0.50),.8);
    ctx.setLineDash([2,5]);
    drawEdges(ctx,iv.map(([x,y,z])=>project3D(x,y,z,-aB*.3,-aB+Math.PI/5,cx,cy)),ie,cc(0.18),.8);
    ctx.setLineDash([]);
  },
  scss(ctx,W,H,aA,aB){
    const cx=W/2,cy=H/2,r=24,h=20;
    const hv=[];
    for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2;hv.push([Math.cos(a)*r,-h,Math.sin(a)*r]);hv.push([Math.cos(a)*r,h,Math.sin(a)*r]);}
    const he=[];
    for(let i=0;i<6;i++){const nx=(i+1)%6;he.push([i*2,nx*2],[i*2+1,nx*2+1],[i*2,i*2+1]);}
    drawEdges(ctx,hv.map(([x,y,z])=>project3D(x,y,z,aA*.5,aA,cx,cy)),he,cc(0.55),1);
    ctx.setLineDash([2,4]);
    drawEdges(ctx,hv.map(([x,y,z])=>project3D(x,y,z,-aB*.4,-aB+Math.PI/6,cx,cy)),he,cc(0.20),1);
    ctx.setLineDash([]);
  },
  git(ctx,W,H,aA,aB){
    const cx=W/2,cy=H/2;
    const nv=[[0,-28,0],[0,-10,12],[-14,8,-8],[14,8,-8],[0,24,0]];
    const ge=[[0,1],[0,2],[1,3],[2,4],[3,4],[1,2],[2,3]];
    const vA=nv.map(([x,y,z])=>project3D(x,y,z,aA*.5,aA,cx,cy));
    drawEdges(ctx,vA,ge,cc(0.50),1);
    vA.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,3*p.sc,0,Math.PI*2);ctx.fillStyle=cc(0.45);ctx.fill();});
    ctx.setLineDash([2,5]);
    drawEdges(ctx,nv.map(([x,y,z])=>project3D(x,y,z,-aB*.3,-aB+Math.PI/3,cx,cy)),ge,cc(0.18),1);
    ctx.setLineDash([]);
  },
};

document.querySelectorAll('.stack-canvas').forEach(cv=>{
  const shape=cv.dataset.shape;
  if(!shapes[shape]) return;
  const ctx=cv.getContext('2d'), W=cv.width, H=cv.height;
  let aA=0, aB=Math.PI/4;
  (function tick(){
    ctx.clearRect(0,0,W,H);
    shapes[shape](ctx,W,H,aA,aB);
    aA+=0.018; aB+=0.009;
    requestAnimationFrame(tick);
  })();
});

/* Stack 진입 */
gsap.set('.stack-item',{opacity:0});
gsap.utils.toArray('.stack-item').forEach((item,i)=>{
  gsap.fromTo(item,{opacity:0,y:28},{opacity:1,y:0,duration:.7,delay:i*.06,ease:'power3.out',
    scrollTrigger:{trigger:item,start:'top 90%',once:true}});
});

/* 툴팁 */
const tooltip=document.getElementById('stackTooltip');
document.querySelectorAll('.stack-item').forEach(item=>{
  item.addEventListener('mousemove',e=>{
    tooltip.textContent=item.dataset.tip; tooltip.classList.add('show');
    tooltip.style.left=(e.clientX+14)+'px'; tooltip.style.top=(e.clientY-28)+'px';
  });
  item.addEventListener('mouseleave',()=>tooltip.classList.remove('show'));
});

/* INFO 진입 */
gsap.fromTo('.info-big-title',{opacity:0,y:40},{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.info-big-title',start:'top 85%'}});
gsap.utils.toArray('.info-col').forEach((col,i)=>{
  gsap.fromTo(col,{opacity:0,y:32},{opacity:1,y:0,duration:.8,delay:i*.12,ease:'power3.out',scrollTrigger:{trigger:'.info-grid',start:'top 82%'}});
});
gsap.fromTo('.info-footer',{opacity:0},{opacity:1,duration:.8,scrollTrigger:{trigger:'.info-footer',start:'top 90%'}});
