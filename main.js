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

/* === 3D SVG 아이콘 === */
/* 테마에 따라 다크=흰색, 라이트=검정 */
const SVG_NS = 'http://www.w3.org/2000/svg';

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

/* SVG 헬퍼: 엣지 그룹(line 다발) 생성/갱신 */
function makeEdgeGroup(svg, edges, opts){
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('stroke', opts.color);
  g.setAttribute('stroke-width', opts.lw);
  g.setAttribute('fill', 'none');
  g.setAttribute('stroke-linecap', 'round');
  if (opts.dash) g.setAttribute('stroke-dasharray', opts.dash);
  const lines = edges.map(()=> {
    const ln = document.createElementNS(SVG_NS, 'line');
    g.appendChild(ln);
    return ln;
  });
  svg.appendChild(g);
  return { g, lines, edges, opts, update(verts){
    for (let i=0; i<edges.length; i++){
      const [a,b] = edges[i];
      const ln = lines[i];
      ln.setAttribute('x1', verts[a].x.toFixed(2));
      ln.setAttribute('y1', verts[a].y.toFixed(2));
      ln.setAttribute('x2', verts[b].x.toFixed(2));
      ln.setAttribute('y2', verts[b].y.toFixed(2));
    }
  }, recolor(c){ this.opts.color = c; g.setAttribute('stroke', c); }};
}

/* SVG 헬퍼: polyline 한 개 */
function makePolyline(svg, opts){
  const pl = document.createElementNS(SVG_NS, 'polyline');
  pl.setAttribute('stroke', opts.color);
  pl.setAttribute('stroke-width', opts.lw);
  pl.setAttribute('fill', 'none');
  pl.setAttribute('stroke-linecap', 'round');
  pl.setAttribute('stroke-linejoin', 'round');
  if (opts.dash) pl.setAttribute('stroke-dasharray', opts.dash);
  svg.appendChild(pl);
  return { pl, opts, update(pts){
    let s = '';
    for (let i=0; i<pts.length; i++) s += pts[i].x.toFixed(2)+','+pts[i].y.toFixed(2)+' ';
    pl.setAttribute('points', s);
  }, recolor(c){ this.opts.color=c; pl.setAttribute('stroke', c); }};
}

/* SVG 헬퍼: 점(circle) */
function makeDot(svg, opts){
  const c = document.createElementNS(SVG_NS, 'circle');
  c.setAttribute('fill', opts.color);
  c.setAttribute('r', opts.r);
  svg.appendChild(c);
  return { c, opts, update(p, scale){
    c.setAttribute('cx', p.x.toFixed(2));
    c.setAttribute('cy', p.y.toFixed(2));
    if (scale != null) c.setAttribute('r', (opts.r * scale).toFixed(2));
  }, recolor(col){ this.opts.color=col; c.setAttribute('fill', col); }};
}

/* 셰이프별 빌더: SVG 안에 엘리먼트를 만들고 update(aA,aB) 함수를 반환 */
const shapeBuilders = {
  html(svg, W, H){
    const cx=W/2, cy=H/2, s=24;
    const v=[[-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]];
    const e=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    const front = makeEdgeGroup(svg, e, {color:cc(0.55), lw:1});
    const back  = makeEdgeGroup(svg, e, {color:cc(0.20), lw:1, dash:'3 4'});
    return {
      groups:[front, back],
      colors:[0.55, 0.20],
      update(aA, aB){
        front.update(v.map(([x,y,z])=>project3D(x,y,z,aA*.6,aA,cx,cy)));
        back .update(v.map(([x,y,z])=>project3D(x,y,z,-aB*.4,0.8-aB,cx,cy)));
      }
    };
  },

  css(svg, W, H){
    const cx=W/2, cy=H/2, r=26;
    /* 두 개의 구체 와이어프레임 (앞/뒤). 각 구체는 경선 8개 + 위선 4개 = 폴리라인 12개 */
    const buildSphere = (col, lw, dash) => {
      const lines = [];
      // 경선
      for (let i=0;i<8;i++){
        lines.push({type:'mer', phi:(i/8)*Math.PI*2, pl:makePolyline(svg,{color:col,lw,dash})});
      }
      // 위선
      for (let i=1;i<5;i++){
        const lat=(i/5)*Math.PI - Math.PI/2;
        lines.push({type:'lat', lat, pl:makePolyline(svg,{color:col,lw,dash})});
      }
      return lines;
    };
    const sphA = buildSphere(cc(0.55), .8, null);
    const sphB = buildSphere(cc(0.20), .8, '2 4');
    const updateSphere = (lines, ax, ay) => {
      for (const o of lines){
        const pts = [];
        if (o.type === 'mer'){
          for (let t=0;t<=32;t++){
            const th=(t/32)*Math.PI*2;
            pts.push(project3D(Math.sin(th)*Math.cos(o.phi)*r, Math.cos(th)*r, Math.sin(th)*Math.sin(o.phi)*r, ax, ay, cx, cy));
          }
        } else {
          const rr=Math.cos(o.lat)*r, yy=Math.sin(o.lat)*r;
          for (let t=0;t<=32;t++){
            const ph2=(t/32)*Math.PI*2;
            pts.push(project3D(Math.cos(ph2)*rr, yy, Math.sin(ph2)*rr, ax, ay, cx, cy));
          }
        }
        o.pl.update(pts);
      }
    };
    return {
      polylineGroups:[{lines:sphA, alpha:0.55},{lines:sphB, alpha:0.20}],
      update(aA, aB){
        updateSphere(sphA, aA*.5, aA);
        updateSphere(sphB, aB*.3, -aB);
      }
    };
  },

  js(svg, W, H){
    const cx=W/2, cy=H/2, s=26;
    const v=[[0,-s,0],[s,0,0],[0,0,s],[-s,0,0],[0,0,-s],[0,s,0]];
    const e=[[0,1],[0,2],[0,3],[0,4],[5,1],[5,2],[5,3],[5,4],[1,2],[2,3],[3,4],[4,1]];
    const front = makeEdgeGroup(svg, e, {color:cc(0.55), lw:1});
    const back  = makeEdgeGroup(svg, e, {color:cc(0.22), lw:1, dash:'2 5'});
    return {
      groups:[front, back],
      colors:[0.55, 0.22],
      update(aA, aB){
        front.update(v.map(([x,y,z])=>project3D(x,y,z,aA*.5,aA,cx,cy)));
        back .update(v.map(([x,y,z])=>project3D(x,y,z,-aB*.4,-aB+Math.PI/4,cx,cy)));
      }
    };
  },

  react(svg, W, H){
    const cx=W/2, cy=H/2, rx=28, ry=10;
    /* 4개의 궤도 + 중심점 */
    const orbits = [
      { ay:0,            ax:0,            pl:makePolyline(svg,{color:cc(0.55),lw:.9}),  alpha:0.55, fix:'ay' },
      { ay:0,            ax:Math.PI/3,    pl:makePolyline(svg,{color:cc(0.40),lw:.9}),  alpha:0.40, fix:'ay' },
      { ay:0,            ax:-Math.PI/3,   pl:makePolyline(svg,{color:cc(0.28),lw:.9, dash:'2 4'}), alpha:0.28, fix:'ay' },
      { ay:0,            ax:0,            pl:makePolyline(svg,{color:cc(0.16),lw:.8, dash:'2 4'}), alpha:0.16, fix:'ayNeg' },
    ];
    const center = makeDot(svg, {color:cc(0.5), r:3.5});
    const buildOrbit = (ax, ay) => {
      const pts = [];
      for (let t=0;t<=64;t++){
        const ph=(t/64)*Math.PI*2;
        pts.push(project3D(Math.cos(ph)*rx, Math.sin(ph)*ry, 0, ax, ay, cx, cy));
      }
      return pts;
    };
    return {
      polylineGroups:[
        {lines:[{pl:orbits[0].pl}], alpha:0.55},
        {lines:[{pl:orbits[1].pl}], alpha:0.40},
        {lines:[{pl:orbits[2].pl}], alpha:0.28},
        {lines:[{pl:orbits[3].pl}], alpha:0.16},
      ],
      dots:[{dot:center, alpha:0.5}],
      update(aA, aB){
        orbits[0].pl.update(buildOrbit(0, aA));
        orbits[1].pl.update(buildOrbit(Math.PI/3, aA));
        orbits[2].pl.update(buildOrbit(-Math.PI/3, aA));
        orbits[3].pl.update(buildOrbit(0, -aB));
        center.update({x:cx, y:cy});
      }
    };
  },

  gsap(svg, W, H){
    const cx=W/2, cy=H/2;
    const waveA = makePolyline(svg, {color:cc(0.55), lw:1});
    const waveB = makePolyline(svg, {color:cc(0.22), lw:1, dash:'3 5'});
    const dotL = makeDot(svg, {color:cc(0.45), r:2.5});
    const dotR = makeDot(svg, {color:cc(0.45), r:2.5});
    const buildWave = (phase, amp, aA) => {
      const pts = [];
      for (let i=0;i<=60;i++){
        const t=i/60;
        const x=-28+t*56;
        const y=Math.sin(t*Math.PI*3+phase)*amp;
        const z=Math.cos(t*Math.PI*2+phase)*12;
        pts.push(project3D(x,y,z,aA*.3,aA,cx,cy));
      }
      return pts;
    };
    return {
      polylineGroups:[
        {lines:[{pl:waveA}], alpha:0.55},
        {lines:[{pl:waveB}], alpha:0.22},
      ],
      dots:[{dot:dotL, alpha:0.45},{dot:dotR, alpha:0.45}],
      update(aA, aB){
        waveA.update(buildWave(aA, 18, aA));
        waveB.update(buildWave(-aB+Math.PI, 14, aA));
        const pL = project3D(-28,0,0,aA*.3,aA,cx,cy);
        const pR = project3D( 28,0,0,aA*.3,aA,cx,cy);
        dotL.update(pL); dotR.update(pR);
      }
    };
  },

  figma(svg, W, H){
    const cx=W/2, cy=H/2, s=18;
    const t2=(1+Math.sqrt(5))/2;
    const iv=[[-1,t2,0],[1,t2,0],[-1,-t2,0],[1,-t2,0],[0,-1,t2],[0,1,t2],[0,-1,-t2],[0,1,-t2],[t2,0,-1],[t2,0,1],[-t2,0,-1],[-t2,0,1]].map(([x,y,z])=>{const l=Math.sqrt(x*x+y*y+z*z);return[x/l*s,y/l*s,z/l*s];});
    const ie=[[0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],[2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],[4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],[7,8],[7,10],[8,9],[10,11]];
    const front = makeEdgeGroup(svg, ie, {color:cc(0.50), lw:.8});
    const back  = makeEdgeGroup(svg, ie, {color:cc(0.18), lw:.8, dash:'2 5'});
    return {
      groups:[front, back],
      colors:[0.50, 0.18],
      update(aA, aB){
        front.update(iv.map(([x,y,z])=>project3D(x,y,z,aA*.4,aA,cx,cy)));
        back .update(iv.map(([x,y,z])=>project3D(x,y,z,-aB*.3,-aB+Math.PI/5,cx,cy)));
      }
    };
  },

  scss(svg, W, H){
    const cx=W/2, cy=H/2, r=24, h=20;
    const hv=[];
    for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2;hv.push([Math.cos(a)*r,-h,Math.sin(a)*r]);hv.push([Math.cos(a)*r,h,Math.sin(a)*r]);}
    const he=[];
    for(let i=0;i<6;i++){const nx=(i+1)%6;he.push([i*2,nx*2],[i*2+1,nx*2+1],[i*2,i*2+1]);}
    const front = makeEdgeGroup(svg, he, {color:cc(0.55), lw:1});
    const back  = makeEdgeGroup(svg, he, {color:cc(0.20), lw:1, dash:'2 4'});
    return {
      groups:[front, back],
      colors:[0.55, 0.20],
      update(aA, aB){
        front.update(hv.map(([x,y,z])=>project3D(x,y,z,aA*.5,aA,cx,cy)));
        back .update(hv.map(([x,y,z])=>project3D(x,y,z,-aB*.4,-aB+Math.PI/6,cx,cy)));
      }
    };
  },

  git(svg, W, H){
    const cx=W/2, cy=H/2;
    const nv=[[0,-28,0],[0,-10,12],[-14,8,-8],[14,8,-8],[0,24,0]];
    const ge=[[0,1],[0,2],[1,3],[2,4],[3,4],[1,2],[2,3]];
    const front = makeEdgeGroup(svg, ge, {color:cc(0.50), lw:1});
    const back  = makeEdgeGroup(svg, ge, {color:cc(0.18), lw:1, dash:'2 5'});
    const dots  = nv.map(()=> makeDot(svg, {color:cc(0.45), r:3}));
    return {
      groups:[front, back],
      colors:[0.50, 0.18],
      dots: dots.map(d=>({dot:d, alpha:0.45})),
      update(aA, aB){
        const vA = nv.map(([x,y,z])=>project3D(x,y,z,aA*.5,aA,cx,cy));
        front.update(vA);
        back .update(nv.map(([x,y,z])=>project3D(x,y,z,-aB*.3,-aB+Math.PI/3,cx,cy)));
        for (let i=0; i<vA.length; i++) dots[i].update(vA[i], vA[i].sc);
      }
    };
  },
};

/* 모든 stack-svg 초기화 + 애니메이션 루프 */
const stackInstances = [];
document.querySelectorAll('.stack-svg').forEach(svg=>{
  const shape = svg.dataset.shape;
  const builder = shapeBuilders[shape];
  if(!builder) return;
  const inst = builder(svg, 80, 80);
  inst.shape = shape;
  inst.aA = 0;
  inst.aB = Math.PI/4;
  stackInstances.push(inst);
});

(function tickAll(){
  stackInstances.forEach(inst=>{
    inst.aA += 0.018;
    inst.aB += 0.009;
    inst.update(inst.aA, inst.aB);
  });
  requestAnimationFrame(tickAll);
})();

/* 테마 변경 시 stroke / fill 색상 갱신 */
function refreshStackColors(){
  stackInstances.forEach(inst=>{
    if (inst.groups && inst.colors){
      inst.groups.forEach((g, i)=> g.recolor(cc(inst.colors[i])));
    }
    if (inst.polylineGroups){
      inst.polylineGroups.forEach(pg=>{
        pg.lines.forEach(l=> l.pl.recolor(cc(pg.alpha)));
      });
    }
    if (inst.dots){
      inst.dots.forEach(d=> d.dot.recolor(cc(d.alpha)));
    }
  });
}

/* 테마 변경 시 stroke / fill 색상 갱신
   - applyTheme()를 재할당하지 않고, 토글 버튼 클릭 직후 색상만 갱신.
   - 클릭 핸들러는 등록 순서대로 실행되므로,
     기존 applyTheme가 data-theme를 바꾼 뒤 이 핸들러가 새 색상을 읽어 적용함. */
themeToggle.addEventListener('click', refreshStackColors);
/* 페이지 로드 시 저장된 테마가 적용된 직후의 색상도 한 번 맞춰줌 */
refreshStackColors();

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
