/* Mi armario — motor de outfits
   Estilos: Quiet Luxury · European Smart Casual · Classic Old Money · Dark Academia · Street/Libre
   Rotación: cada prenda lleva un contador de uso; las menos usadas / más antiguas tienen prioridad. */

const NEU=['bk','wh','gy','bg','nv','br'],ACC=['ye','pk','tq','eb'];
const BAD=['rd-gn','rd-pk','rd-ye','gn-pk','ye-pk','tq-rd','tq-pk','tq-ye','bl-gn','eb-rd','eb-gn','eb-ye','eb-pk','eb-br'];
const SL=['base','mid','outer','pants','shoes','belt','scarf','hat'];
const SN={base:'Base',mid:'Capa',outer:'Abrigo',pants:'Pantalón',shoes:'Calzado',belt:'Cinturón',scarf:'Bufanda',hat:'Gorro'};
const CAT={base:'PCT',mid:'JS',outer:'A',pants:'B',shoes:'Z',belt:'N',scarf:'F',hat:'G'};
const CLS={P:'base',C:'base',T:'base',J:'mid',S:'mid',A:'outer',B:'pants',Z:'shoes',N:'belt',F:'scarf',G:'hat'};
const CS=[['P','Polos'],['C','Camisas'],['T','Camisetas'],['J','Jerséis'],['S','Sudaderas'],['A','Abrigos'],['B','Pantalones'],['Z','Calzado'],['N','Cinturones'],['F','Bufandas'],['G','Gorros']];
const SK=['quiet','euro','old','dark','street'];
const STY={
 quiet:{n:'Quiet Luxury',d:'Minimalismo y sofisticación: neutros, punto fino, sin logos ni estampados.',q:'quiet luxury'},
 euro:{n:'Euro Smart Casual',d:'Elegancia relajada: contraste claro/oscuro, vaquero oscuro, calzado limpio.',q:'european smart casual'},
 old:{n:'Old Money',d:'Clásicos: marino, crema, camel y oliva; punto sobre camisa, polos y rayas.',q:'old money'},
 dark:{n:'Dark Academia',d:'Tierra, burdeos y marrones; pana, lana, chalecos y texturas.',q:'dark academia'},
 street:{n:'Street / Libre',d:'Casual y deportivo. Aquí vuelven las piezas que no encajan en los otros estilos.',q:'streetwear'}
};

/* ---------- Afinidad prenda × estilo ---------- */
const GRAPHIC=/Brooklyn|West Coast|\bLA\b|Rebel|Five Boroughs|\bNY\b|gráfico|camuflaje/;
const CLASSIC=/pata de gallo|vichy|argyle|geométrico|cuadros marino|cuadros beige|rayas marineras|rayas beige|rugby|rayas rosa|rayas menta/;
const COL={
 quiet:{wh:2,bg:2,gy:1.5,nv:1.5,br:1.3,bk:.9,gn:.3,bl:.3,eb:-3},
 euro:{wh:1.6,bg:1.5,gy:1.4,nv:1.8,br:1.2,bk:1.4,gn:1.2,bl:1.2,eb:-.5},
 old:{wh:1.8,bg:1.8,gy:1.5,nv:2,br:1.3,bk:.2,gn:1.5,bl:1.2,eb:-2},
 dark:{wh:.8,bg:1.6,gy:1,nv:1.2,br:2.2,bk:.8,gn:1.6,bl:-.2,eb:-3},
 street:{wh:1,bg:1,gy:1,nv:1,br:1,bk:1,gn:1,bl:1,eb:1}
};
function colScore(x,s){const n=x.n,c=x.col;
 if(s=='street')return c=='tq'||c=='pk'||c=='ye'||c=='rd'||c=='eb'?.8:COL.street[c];
 if(c=='rd'){const d=/burdeos|terracota|berenjena/.test(n);return({quiet:d?.1:-1.5,euro:d?.7:-.4,old:d?1:-.2,dark:d?2.3:.9})[s]}
 if(c=='ye'){const m=/mostaza/.test(n),p=/pastel/.test(n);return({quiet:-1.5,euro:m?.2:p?.3:-1,old:p||m?.3:-.8,dark:m?1.4:.1})[s]}
 if(c=='pk'){const t=/lila|rosa palo/.test(n);return({quiet:-1.5,euro:t?.2:-1.5,old:t?.1:-1.5,dark:-1.5})[s]}
 if(c=='tq'){const t=/menta/.test(n);return({quiet:-1.8,euro:t?-.3:-1.5,old:t?-.2:-1.8,dark:-2})[s]}
 if(c=='bl'&&/Oxford azul claro/.test(n))return({quiet:1.2,euro:1.6,old:2,dark:.6})[s];
 if(c=='bl'&&/azul petróleo/.test(n))return({quiet:.2,euro:1,old:.4,dark:1.2})[s];
 return COL[s][c]}
/* Excepciones manuales [quiet,euro,old,dark,street]; null = no encaja nunca en ese estilo */
const OV={
 119:[.6,1.6,2,1.6,-1],        // mocasines ante verde
 122:[2,1.8,1.6,.2,.6],        // zapatillas blancas
 125:[1.6,1.8,1.4,2.6,1],      // botas marrones
 126:[1.2,1.8,.5,1.2,1],       // botas negras
 118:[.8,.8,1,.6,.5],          // gorro marino liso
 115:[null,null,null,1.2,1],   // bufanda tartán
 107:[null,null,null,null,1],
 111:[1.2,1.2,.8,1,.6],        // bufanda negra lisa
 109:[.3,1,1.2,1.6,.6],        // bufanda verde botella
 105:[.8,1,1.6,1.8,.4],        // pata de gallo
 106:[.8,.8,1.6,1.8,.4],       // cuadros beige y azul
 108:[.4,.3,1.2,2.2,.4],       // rayas beige y marrón
 112:[.2,1.2,1.4,1.2,.4],      // cuadros marino
 114:[.2,1,.8,1,.4],           // gris cuadros
 104:[.1,.3,1.2,.2,.4],        // vichy azul
 110:[-1.5,-.4,-.4,.8,.5],     // rayas rojo y negro
 69:[.4,.2,1.8,2.4,0],         // chaleco geométrico beige
 73:[-.4,.2,1.8,1.8,0],        // chaleco argyle azul
 72:[.4,.8,.2,.8,.6],          // chaleco universitario negro
 70:[2.6,1.6,1.8,1.8,0],       // cuello alto camel
 54:[null,1,1.2,2,.4],         // sobrecamisa pana marino
 49:[null,.6,-.4,1.2,.8],      // biker marrón
 52:[null,.4,.3,-.4,1],        // bomber negra
 50:[null,.2,.2,.6,.6],        // sobrecamisa cuadros crudo y negro
 33:[.2,.6,.6,2.2,.2],         // camisa marrón jaspeada
 24:[.4,.8,1,1.8,0],           // camisa franela gris
 31:[-.4,.2,-.4,1.4,.6],       // camisa negra de pana
 32:[0,.8,.2,1.6,.4],          // camisa pana azul petróleo
 45:[1,.8,.6,.8,.5],           // camiseta beige manga larga
 48:[1.2,.8,.6,.8,.5]          // camiseta greige manga larga
};
function aff(x,s){const n=x.n,si=SK.indexOf(s);
 if(OV[x.id]&&OV[x.id][si]!==undefined)return OV[x.id][si];
 if(s!='street'&&(x.f===0||GRAPHIC.test(n)))return null;
 let a=colScore(x,s);
 if(s=='street'){a+=x.f===0?1:x.f==1?.2:-1.2;return a}
 if(x.f==2)a+={quiet:.6,euro:.3,old:.7,dark:.4}[s];
 if(x.p){const c=CLASSIC.test(n);a+=c?{quiet:-.5,euro:-.2,old:.5,dark:.6}[s]:{quiet:-2,euro:-.5,old:-.8,dark:.1}[s]}
 const bonus={quiet:/cuello alto|punto fino|lana|Oxford|chino|pinzas|cuero|canalé|crudo|blanca/,
  euro:/pinzas|lana|chino|Oxford|punto|cuero|canalé/,
  old:/rugby|rayas|Oxford|lana|chino|pinzas|trenzado|chaleco|cuello alto|cuero/i,
  dark:/pana|lana|trenzado|franela|jaspeada|marrón/}[s];
 if(bonus&&bonus.test(n))a+={quiet:.8,euro:.4,old:.6,dark:1}[s];
 if(x.c=='T')a+={quiet:-.4,euro:0,old:-1,dark:-1.2}[s];
 if(x.c=='P'&&x.w==0)a+={quiet:0,euro:0,old:.2,dark:-.4}[s];
 if(x.c=='P'&&x.w>=1)a+=.4;
 if(/cremallera/.test(n))a+={quiet:-.2,euro:.3,old:-.3,dark:-.4}[s];
 if(x.c=='B'&&/Vaquero/.test(n)){const t={'negro':[-.5,1.4,-.5,.4],'azul medio':[-1,-.6,.6,-.2],'azul claro':[-2,-1.8,-.8,-1.5],'blanco roto':[.3,.6,1.2,-1],'gris claro':[-1.5,-.5,-.5,-1.5]};
  const k=Object.keys(t).find(k=>n.includes(k));a=t[k][SK.indexOf(s)]}
 if(x.c=='B'&&/elástico/.test(n))a-=.6;
 return a}
const AF={};SK.forEach(s=>{AF[s]={};D.forEach(x=>AF[s][x.id]=aff(x,s))});
const ELIG=-.6;

/* ---------- Estado + persistencia ---------- */
const st={s:2,o:'old'};let tab='o',cur=null,wf='P',favs=[],use={},recent=[],AVG=0;
const lsGet=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(e){return d}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
favs=lsGet('fav',[]);use=lsGet('use',{});
let syncF=false,syncU=false,dirtyF=false,dirtyU=false;
const put=(p,b)=>{try{fetch('/api/'+p,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(b)}).catch(()=>{})}catch(e){}};
const svF=()=>{lsSet('fav',favs);if(syncF)put('outfits',favs);else dirtyF=true};
const svU=()=>{lsSet('use',use);calcAvg();if(syncU)put('usage',use);else dirtyU=true};
function calcAvg(){AVG=D.reduce((t,x)=>t+((use[x.id]||[0])[0]),0)/D.length}calcAvg();
async function load(){
 try{const r=await fetch('/api/outfits',{cache:'no-store'});if(r.ok){const d=await r.json();
  if(Array.isArray(d.outfits)){let s=d.outfits;
   if(dirtyF||!s.length){const seen=new Set(s.map(f=>JSON.stringify(f)));s=[...favs.filter(f=>!seen.has(JSON.stringify(f))),...s]}
   const ch=JSON.stringify(s)!=JSON.stringify(d.outfits);favs=s;lsSet('fav',favs);syncF=true;if(ch)put('outfits',favs)}}}catch(e){}
 try{const r=await fetch('/api/usage',{cache:'no-store'});if(r.ok){const d=await r.json();
  if(d.usage&&typeof d.usage=='object'){const s={...d.usage};
   for(const k in use){const a=use[k],b=s[k];if(!b||(dirtyU||!Object.keys(d.usage).length)&&(a[0]>b[0]||a[1]>b[1]))s[k]=b?[Math.max(a[0],b[0]),Math.max(a[1],b[1])]:a}
   const ch=JSON.stringify(s)!=JSON.stringify(d.usage);use=s;lsSet('use',use);calcAvg();syncU=true;if(ch)put('usage',use)}}}catch(e){}
 R()}

/* ---------- Utilidades ---------- */
const $=s=>document.querySelector(s),byId=id=>D.find(x=>x.id==id);
const DAY=864e5;
function pickW(a,f){const w=a.map(x=>Math.exp(f(x)));let r=Math.random()*w.reduce((p,c)=>p+c,0);for(let i=0;i<a.length;i++){r-=w[i];if(r<=0)return a[i]}return a[a.length-1]}
const bad=(a,b)=>BAD.includes(a+'-'+b)||BAD.includes(b+'-'+a);
const A=(x,s=st.o)=>AF[s][x.id];
/* "Necesidad" de salir: sube con los días sin usarla y con tener menos usos que la media */
function need(x){const u=use[x.id]||[0,0],d=u[1]?Math.min((Date.now()-u[1])/DAY,60):60;
 return .6*d/20+.4*Math.max(-2,Math.min(4,AVG-u[0]))}
function okSeason(x,slot){const s=st.s;
 return slot=='base'?(s==1?x.w<=1:x.w>=1):slot=='outer'?(s==2||x.w<=1):(slot=='scarf'||slot=='hat')?s==2:true}
const pool=(slot,sty=st.o)=>D.filter(x=>CLS[x.c]==slot&&okSeason(x,slot)&&AF[sty][x.id]!==null&&AF[sty][x.id]>=ELIG);
const beltOK=(b,sh,pa)=>{if(/Cargo|elástico/.test(pa.n))return false;
 if(sh.col=='bk')return['bk','gy'].includes(b.col);if(sh.col=='br')return['br','bg'].includes(b.col);return true};
const wgt=x=>.6*A(x)+.6*need(x)-(recent.includes(x.id)?.7:0);

function rnd(anc){const s=st.s,o={},has=k=>anc&&CLS[anc.c]==k;
 const P=k=>{if(has(k))return anc;const a=pool(k);return a.length?pickW(a,wgt):null};
 o.mid=(s==2||has('mid')||Math.random()<.5)?P('mid'):null;
 const noBase=o.mid&&!has('base')&&(/cuello alto/i.test(o.mid.n)||(o.mid.c=='S'&&Math.random()<.35));
 o.base=noBase?null:P('base');
 o.outer=(has('outer')||Math.random()<(s==2?(st.o=='street'?.8:.6):.25))?P('outer'):null;
 o.pants=P('pants');o.shoes=P('shoes');o.belt=null;
 if(has('belt'))o.belt=anc;
 else if(o.pants&&o.shoes&&st.o!='street'&&Math.random()<(st.o=='euro'?.35:.75)){const a=pool('belt').filter(b=>beltOK(b,o.shoes,o.pants));o.belt=a.length?pickW(a,wgt):null}
 o.scarf=(s==2&&(has('scarf')||Math.random()<.5))?P('scarf'):null;
 o.hat=(s==2&&(has('hat')||Math.random()<(st.o=='street'?.35:.15)))?P('hat'):null;
 return o}

const W={base:1,mid:1,outer:.8,pants:1,shoes:.8,belt:.3,scarf:.5,hat:.4};
const LIGHT={wh:1,bg:.8,ye:.8,pk:.7,tq:.6,bl:.55,gy:.45,gn:.35,rd:.3,eb:.35,br:.3,nv:.15,bk:0};
function score(o){
 if(!o.pants||!o.shoes||(!o.base&&!o.mid))return -99;
 const sty=st.o,m=o.mid;
 if(m&&/cuello alto/i.test(m.n)&&o.base)return -99;
 if(m&&/Chaleco/.test(m.n)&&(!o.base||(o.base.c=='T'&&sty!='street')))return -99;
 if(/Cargo|elástico/.test(o.pants.n)&&o.belt)return -99;
 if(o.belt&&!beltOK(o.belt,o.shoes,o.pants))return -99;
 const it=SL.map(k=>o[k]).filter(Boolean),cols=[...new Set(it.map(x=>x.col))];
 for(const a of cols)for(const b of cols)if(a<b&&bad(a,b)&&!(sty=='dark'&&((a=='gn'&&b=='rd')||(a=='rd'&&b=='gn'))))return -99;
 const acc=it.filter(x=>ACC.includes(x.col)&&!(sty=='dark'&&/mostaza/.test(x.n))).map(x=>x.col);
 if(new Set(acc).size>1||acc.length>1)return -99;
 if(it.filter(x=>x.p).length>(sty=='street'?2:1))return -99;
 let sc=0;
 for(const k of SL)if(o[k]){sc+=W[k]*A(o[k])+.4*need(o[k]);if(recent.includes(o[k].id))sc-=.5}
 if(sty!='street')sc-=Math.max(0,it.length-6)*1.2;
 const nn=cols.filter(c=>!NEU.includes(c)).length;
 sc-=Math.max(0,nn-({quiet:1,euro:2,old:2,dark:3,street:9})[sty])*2.5;
 sc-=Math.max(0,cols.length-(sty=='quiet'?3:4))*1.3;
 const tops=[o.base,o.mid].filter(Boolean),pa=o.pants,Lp=LIGHT[pa.col]||0;
 for(const t of tops)if(t.col==pa.col&&t.col!='bk'&&sty!='quiet')sc-=2;
 if(o.shoes.col=='br'&&['bk','gy'].includes(pa.col)&&sty!='street')sc-=1.5;
 if(st.s==2)sc+=((m?m.w:0)+(o.outer?o.outer.w:0))*.4;
 const top=m||o.base,contrast=Math.abs((LIGHT[top.col]||0)-Lp);
 if(sty=='quiet'){if(tops.some(t=>t.col==pa.col&&['bg','wh','gy','nv'].includes(t.col)&&t.n!=pa.n))sc+=.8;if(m&&o.base&&m.c=='J')sc+=.3}
 if(sty=='euro'){if(contrast>=.35)sc+=.7;if(m&&m.c=='J'&&!/Chaleco/.test(m.n))sc+=.2}
 if(sty=='old'){if(contrast>=.35)sc+=.3;if(o.base&&o.base.c=='C'&&m&&m.c=='J')sc+=1;if(m&&/Chaleco/.test(m.n)&&o.base&&o.base.c=='C')sc+=.8;
  sc+=it.filter(x=>['nv','bg','wh','br','gn','gy'].includes(x.col)).length*.25}
 if(sty=='dark'){const tx=it.filter(x=>/pana|trenzado|franela|lana|jaspeada|Chaleco|cuadros|pata de gallo|rayas beige|geométrico/.test(x.n)).length;sc+=Math.min(3,tx)*.5;
  const ea=it.filter(x=>['br','rd','gn','bg'].includes(x.col)).length;sc+=ea>=3?1.6:ea>=2?1:0;if(o.shoes.col=='br')sc+=.8}
 return sc+Math.random()*.8}

function build(anc){let c=[];
 for(let t=0;t<3&&!c.length;t++)for(let i=0;i<260;i++){const o=rnd(anc),v=score(o);if(v>-50)c.push([o,v])}
 if(!c.length)return anc?build():rnd();
 c.sort((a,b)=>b[1]-a[1]);const o={...pickW(c.slice(0,12),x=>x[1]/1.2)[0]};
 o.anchor=anc?anc.id:null;mark(o);return o}
function mark(o){recent.unshift(...SL.map(k=>o[k]&&o[k].id).filter(Boolean));recent=recent.slice(0,40)}
/* Prenda "a la que le toca salir": entre las más desatendidas que encajan con el estilo */
function pickAnchor(){const c=[];
 for(const k of ['base','mid','outer','pants','shoes','belt','scarf','hat'])for(const x of pool(k))if(A(x)>=.2)c.push(x);
 c.sort((a,b)=>need(b)-need(a));const t=c.slice(0,6);return t.length?pickW(t,x=>need(x)*1.8):null}
const nw=()=>{cur=build(pickAnchor());R()};
function swap(slot){const a=pool(slot).filter(x=>x!=cur[slot]),c=[];
 for(let i=0;i<60&&a.length&&c.length<8;i++){const o={...cur,[slot]:pickW(a,wgt)};
  if((slot=='pants'||slot=='shoes')&&o.belt&&!beltOK(o.belt,o.shoes,o.pants))o.belt=null;
  if(score(o)>-50)c.push(o)}
 if(c.length){const keepA=cur.anchor&&CLS[byId(cur.anchor).c]!=slot?cur.anchor:null;cur=pickW(c,o=>score(o));cur.sv=0;cur.worn=0;cur.anchor=keepA}R()}
const setS=k=>{st.s=+k;cur=null;R()},setO=k=>{st.o=k;cur=null;R()};
/* Rescatar: elige la prenda más olvidada de TODO el armario y arma un outfit con el estilo donde mejor encaja */
function rescue(){const all=D.slice().sort((a,b)=>need(b)-need(a)).slice(0,6);
 const x=pickW(all,y=>need(y)*1.2);
 const best=SK.filter(s=>s!='street').map(s=>[s,AF[s][x.id]]).filter(p=>p[1]!==null).sort((a,b)=>b[1]-a[1])[0];
 st.o=best&&best[1]>=-.6?best[0]:'street';
 if(x.w==2||x.c=='F'||x.c=='G')st.s=2;else if(x.w==0)st.s=1;
 cur=build(x);R()}

/* Aviso: prenda más olvidada de todo el armario (≥21 días o nunca) */
function forgotten(){const x=D.slice().sort((a,b)=>need(b)-need(a))[0],u=use[x.id];
 const d=u&&u[1]?(Date.now()-u[1])/DAY:null;return d===null||d>=21?x:null}

/* ---------- Guardar y registrar uso ---------- */
function save(){if(cur.sv)return;favs.unshift(Object.fromEntries(SL.filter(s=>cur[s]).map(s=>[s,cur[s].id])));cur.sv=1;svF();R()}
const del=i=>{favs.splice(i,1);svF();R()};
function logWear(ids){const prev={};const t=Date.now();
 for(const id of ids){prev[id]=use[id]?[...use[id]]:null;use[id]=[((use[id]||[0])[0])+1,t]}svU();return prev}
function wearCur(){if(cur.worn){for(const id in cur.undo){if(cur.undo[id])use[id]=cur.undo[id];else delete use[id]}svU();cur.worn=0;cur.undo=null}
 else{cur.undo=logWear(SL.filter(s=>cur[s]).map(s=>cur[s].id));cur.worn=1}R()}
function wearFav(i){logWear(Object.values(favs[i]));R();flash=i;setTimeout(()=>{flash=-1;R()},1400)}
let flash=-1;
function ago(x){const u=use[x.id];if(!u||!u[0])return'Sin estrenar';const d=Math.floor((Date.now()-u[1])/DAY);
 return`×${u[0]} · ${d<1?'hoy':d==1?'ayer':d<14?'hace '+d+' d':'hace '+Math.round(d/7)+' sem'}`}

/* ---------- Interfaz ---------- */
const chips=(a,c,f)=>a.map(([k,l])=>`<button class="ch ${k==c?'on':''}" onclick="${f}('${k}')">${l}</button>`).join('');
const card=(x,slot,sw)=>`<div class="it ${cur&&cur.anchor==x.id?'rs':''}" ${sw?`onclick="swap('${slot}')"`:''}><div class="im"><img src="${x.img}" alt=""></div><b>${x.n}</b><small>${slot?SN[slot]+' · ':''}${ago(x)}</small>${cur&&cur.anchor==x.id?'<span class="tg">Le tocaba salir</span>':''}</div>`;
const refQ=()=>encodeURIComponent(STY[st.o].q+' outfit hombre '+['base','mid','pants','shoes'].map(k=>cur[k]&&cur[k].n.toLowerCase()).filter(Boolean).join(' '));
function R(){let h='';
 if(tab=='o'){if(!cur)cur=build(pickAnchor());
  h=`<h1>Hoy me pongo</h1><div class="row">${chips([[1,'Fresco 10–15°'],[2,'Frío 5–10°']],st.s,'setS')}</div>
  <div class="row sc">${chips(SK.map(k=>[k,STY[k].n]),st.o,'setO')}</div>
  <p class="hint" style="margin:-2px 0 12px">${STY[st.o].d}</p>
  <div class="grid">${SL.filter(s=>cur[s]).map(s=>card(cur[s],s,1)).join('')}</div>
  <p class="hint">Toca una prenda para cambiarla por otra que combine.</p>
  <div class="row"><button class="pb" onclick="nw()">Otro outfit</button><button class="sb" onclick="save()">${cur.sv?'Guardado':'Guardar'}</button></div>
  ${(()=>{const f=forgotten();return f?`<p class="hint" style="margin:0 0 10px">Olvidada: <b>${f.n}</b> (${ago(f).toLowerCase()}).</p>`:''})()}
  <div class="row"><button class="sb" style="flex:1" onclick="wearCur()">${cur.worn?'Anotado ✓ (deshacer)':'Me lo pongo hoy'}</button><button class="sb" style="flex:1" onclick="rescue()">Rescatar olvidada</button></div>
  <div class="row"><a class="sb" style="flex:1;text-align:center;text-decoration:none" target="_blank" rel="noopener" href="https://www.pinterest.com/search/pins/?q=${refQ()}">Referencias en Pinterest</a><a class="sb" style="flex:1;text-align:center;text-decoration:none" target="_blank" rel="noopener" href="https://www.google.com/search?tbm=isch&q=${refQ()}">En Google</a></div>`}
 else if(tab=='a'){const used=D.filter(x=>(use[x.id]||[0])[0]>0).length;
  h=`<h1>Mi armario <span>${D.length}</span></h1><p class="hint" style="margin:-8px 0 12px">${used} de ${D.length} prendas estrenadas con "Me lo pongo hoy".</p><div class="row sc">${CS.map(([k,l])=>`<button class="ch ${k==wf?'on':''}" onclick="wf='${k}';R()">${l} ${D.filter(x=>x.c==k).length}</button>`).join('')}</div>
  <div class="grid">${D.filter(x=>x.c==wf).map(x=>card(x,null,0)).join('')}</div>`}
 else h=`<h1>Guardados</h1>`+(favs.length?favs.map((f,i)=>`<div class="fv"><div class="mini">${SL.filter(s=>f[s]&&byId(f[s])).map(s=>`<img src="${byId(f[s]).img}" alt="">`).join('')}</div><button class="sb" onclick="wearFav(${i})">${flash==i?'Anotado ✓':'Me lo pongo'}</button><button class="sb" onclick="del(${i})">Quitar</button></div>`).join(''):`<p class="hint">Aún no has guardado ningún outfit. Genera uno y pulsa Guardar.</p>`);
 $('#app').innerHTML=h;document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==tab));
 try{const c=document.querySelector('.sc .ch.on');if(c&&c.scrollIntoView)c.scrollIntoView({inline:'center',block:'nearest'})}catch(e){}}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;R();scrollTo(0,0)});
R();load();
