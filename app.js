/* KWanus University — behaviour.
   Reads the curriculum from data.js, keeps the record in localStorage, and
   renders every view. Loaded after data.js, so CURRICULUM and BANK exist. */
"use strict";

/* ---------- storage (safe against corrupt or blocked storage) ---------- */
const store=(()=>{
  let ok=true;
  try{localStorage.setItem('_t','1');localStorage.removeItem('_t');}catch(e){ok=false;}
  const mem={};
  return{
    get(k){
      if(!ok)return k in mem?mem[k]:null;
      try{const raw=localStorage.getItem(k);return raw===null?null:JSON.parse(raw);}
      catch(e){console.warn('Unreadable key '+k+', ignoring.');return null;}
    },
    set(k,v){
      if(!ok){mem[k]=v;return;}
      try{localStorage.setItem(k,JSON.stringify(v));}catch(e){console.warn('Could not save '+k);}
    },
    del(k){if(!ok){delete mem[k];return;}try{localStorage.removeItem(k);}catch(e){}}
  };
})();

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- state ---------- */
let student=store.get('ku_student');
let grades=store.get('ku_grades')||[];
let days=store.get('ku_days')||[];
let hw=store.get('ku_hw')||{};
let userBank=store.get('ku_bank')||{};
let activeExam=null;
let currentCourse=CURRICULUM[0].id;
let authCourse=CURRICULUM[0].id;
let authUnit=1;

/* ---------- dates: all local, never UTC ---------- */
function dayKey(d){
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+day;
}
const todayKey=()=>dayKey(new Date());
function keyToDate(k){const p=k.split('-').map(Number);return new Date(p[0],p[1]-1,p[2]);}

let startISO=store.get('ku_start');
if(!startISO||!/^\d{4}-\d{2}-\d{2}$/.test(startISO)){startISO=todayKey();store.set('ku_start',startISO);}
let start=keyToDate(startISO);

function termName(){
  const m=start.getMonth(),y=start.getFullYear();
  return (m>=7?'Fall':(m<=4?'Spring':'Summer'))+' '+y;
}
/* Each course gets a full four-week cycle per unit, and the five courses are
 * staggered six days apart so you never face five exams on the same day.
 * Fixed-length cycles, so no unit is short-changed by a 28-day February. */
const COURSE_IDX=Object.fromEntries(CURRICULUM.map((c,i)=>[c.id,i]));
function unitDue(id,n){
  const d=new Date(start);
  d.setDate(d.getDate()+n*PROGRAM.cycleDays+COURSE_IDX[id]*PROGRAM.staggerDays);
  d.setHours(23,59,59,0);
  return d;
}
/* The last deadline on the whole program. */
function programEnd(){
  return unitDue(CURRICULUM[CURRICULUM.length-1].id,PROGRAM.units);
}
function cyclesElapsed(){
  return Math.floor((new Date()-start)/86400000/PROGRAM.cycleDays);
}
function currentUnitByCalendar(){return Math.min(PROGRAM.units,Math.max(1,cyclesElapsed()+1));}
function currentAcademicYear(){return yearOfUnit(currentUnitByCalendar());}
function nextSunday(){
  const d=new Date();const s=new Date(d);
  s.setDate(d.getDate()+((7-d.getDay())%7));
  s.setHours(23,59,59,0);return s;
}
const fmtD=d=>d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
/* Calendar-day difference, so the due date itself reads as 0. */
function daysLeft(d){
  const a=new Date();a.setHours(0,0,0,0);
  const b=new Date(d);b.setHours(0,0,0,0);
  return Math.round((b-a)/86400000);
}

/* ---------- streak ---------- */
function logDay(){
  const t=todayKey();
  if(!days.includes(t)){days.push(t);store.set('ku_days',days);}
  renderHero();
}
function streak(){
  let n=0;const d=new Date();
  if(!days.includes(todayKey()))d.setDate(d.getDate()-1);
  for(;;){if(days.includes(dayKey(d))){n++;d.setDate(d.getDate()-1);}else break;}
  return n;
}

/* ---------- question bank ---------- */
function builtIn(id,unit){return (BANK[id]&&BANK[id][unit])||[];}
function mine(id,unit){return (userBank[id]&&userBank[id][unit])||[];}
function questionsFor(id,unit){return builtIn(id,unit).concat(mine(id,unit));}
function examReady(id,unit){return questionsFor(id,unit).length>=PROGRAM.qPerExam;}

/* ---------- grading ---------- */
function passedUnits(id){
  const s=new Set();
  grades.forEach(g=>{if(g.id===id&&g.score>=PROGRAM.pass)s.add(g.unit);});
  return s.size;
}
function isPassed(id,unit){return grades.some(g=>g.id===id&&g.unit===unit&&g.score>=PROGRAM.pass);}
function pct(id){return Math.round(passedUnits(id)/PROGRAM.units*100);}
/* The next unit you owe: the earliest unpassed one. */
function nextUnit(id){
  for(let u=1;u<=PROGRAM.units;u++)if(!isPassed(id,u))return u;
  return PROGRAM.units+1;
}
/* A failed attempt is recorded but never counted toward GPA. */
function pts(score,late){
  if(score<PROGRAM.pass)return null;
  let p=score>=97?4.0:score>=93?3.7:score>=90?3.3:score>=87?3.0:score>=83?2.7:2.3;
  if(late)p=Math.max(0.7,+(p-0.3).toFixed(2));
  return p;
}
function bestByUnit(id){
  const best={};
  grades.forEach(g=>{
    if(g.id!==id||g.score<PROGRAM.pass)return;
    const cur=best[g.unit];
    const better=!cur||g.score>cur.score||(g.score===cur.score&&!g.late&&cur.late);
    if(better)best[g.unit]=g;
  });
  return best;
}
function courseGPA(id){
  const vals=Object.values(bestByUnit(id)).map(g=>pts(g.score,g.late)).filter(v=>v!==null);
  return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;
}
function cumGPA(){
  const v=CURRICULUM.map(c=>courseGPA(c.id)).filter(x=>x!==null);
  return v.length?v.reduce((a,b)=>a+b,0)/v.length:null;
}
function letterOf(g){
  if(g===null||g===undefined)return '—';
  return g>=3.85?'A':g>=3.5?'A−':g>=3.15?'B+':g>=2.85?'B':g>=2.5?'B−':g>=2.15?'C+':g>=1.85?'C':g>=1.5?'C−':g>=1.0?'D':'F';
}
function scoreLetter(score,late){
  const p=pts(score,late);
  return p===null?'F':letterOf(p);
}

/* ---------- homework weeks (local, keyed to the Sunday they are due) ---------- */
const weekKey=()=>dayKey(nextSunday());
function weeksElapsed(){
  const diff=(new Date()-start)/604800000;
  return Math.min(52,Math.max(1,Math.ceil(diff)||1));
}
function markHW(id){
  const k=weekKey();
  hw[id]=hw[id]||[];
  if(!hw[id].includes(k)){hw[id].push(k);store.set('ku_hw',hw);}
  renderCourses();
}
const hwDoneThisWeek=id=>(hw[id]||[]).includes(weekKey());

/* ---------- enrolment gate ---------- */
const gate=document.getElementById('gate');
const campus=document.getElementById('campus');
function openGate(){
  gate.hidden=false;
  campus.setAttribute('inert','');campus.setAttribute('aria-hidden','true');
  document.getElementById('nameIn').focus();
}
function closeGate(){
  gate.hidden=true;
  campus.removeAttribute('inert');campus.removeAttribute('aria-hidden');
}
document.getElementById('gateForm').addEventListener('submit',e=>{
  e.preventDefault();
  student=document.getElementById('nameIn').value.trim()||'Student';
  store.set('ku_student',student);
  closeGate();setChip();
});
function setChip(){
  document.getElementById('studentChip').innerHTML='Enrolled: <strong>'+esc(student)+'</strong>';
}

/* ---------- theme ---------- */
const themeBtn=document.getElementById('themeBtn');
function applyTheme(t){
  if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);
  else document.documentElement.removeAttribute('data-theme');
  store.set('ku_theme',t);
  const next=t==='auto'?'dark':t==='dark'?'light':'system';
  const label='Theme: '+(t==='auto'?'system':t)+'. Switch to '+next+'.';
  themeBtn.title=label;
  document.getElementById('themeLabel').textContent=label;
}
themeBtn.addEventListener('click',()=>{
  const cur=store.get('ku_theme')||'auto';
  applyTheme(cur==='auto'?'dark':cur==='dark'?'light':'auto');
});
applyTheme(store.get('ku_theme')||'auto');

/* ---------- tabs (real tablist with arrow-key navigation) ---------- */
const tabs=Array.from(document.querySelectorAll('[role="tab"]'));
function selectTab(tab,focusPanel){
  tabs.forEach(t=>{
    const on=t===tab;
    t.setAttribute('aria-selected',on?'true':'false');
    t.tabIndex=on?0:-1;
    document.getElementById(t.getAttribute('aria-controls')).hidden=!on;
  });
  if(focusPanel){
    const panel=document.getElementById(tab.getAttribute('aria-controls'));
    panel.focus();
  }
  window.scrollTo(0,0);
}
tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>selectTab(tab,false));
  tab.addEventListener('keydown',e=>{
    const map={ArrowRight:1,ArrowLeft:-1,Home:'first',End:'last'};
    if(!(e.key in map))return;
    e.preventDefault();
    const to=map[e.key]==='first'?tabs[0]:map[e.key]==='last'?tabs[tabs.length-1]
      :tabs[(i+map[e.key]+tabs.length)%tabs.length];
    to.focus();selectTab(to,false);
  });
});

/* ---------- renderers ---------- */
function renderHero(){
  const g=cumGPA(),s=streak(),logged=days.includes(todayKey());
  const u=currentUnitByCalendar(),y=currentAcademicYear();
  document.getElementById('heroBox').innerHTML=
   '<div class="gpa"><div class="big">'+(g===null?'—':g.toFixed(2))+'</div>'+
   '<div class="lab">Cumulative GPA'+(g===null?'':' · '+letterOf(g))+'</div></div>'+
   '<div class="meta">'+
    '<div class="term">'+termName()+' · '+YEAR_NAMES[y-1]+' of Four</div>'+
    '<div class="sub">Cycle '+u+' of '+PROGRAM.units+'. Enrolled '+fmtD(start)+' — a deadline every four weeks from that date.</div>'+
    '<div class="streakline">Study streak: <strong>'+s+'</strong> day'+(s===1?'':'s')+(logged?' — today is logged.':'')+'</div>'+
    (logged?'':'<button class="btn small btn-log" type="button" onclick="logDay()">Log today’s study session</button>')+
   '</div>';
}

function renderTrack(){
  const cy=currentAcademicYear();
  const cells=YEAR_NAMES.map((nm,i)=>{
    const y=i+1;
    const lo=(y-1)*PROGRAM.unitsPerYear+1,hi=y*PROGRAM.unitsPerYear;
    const total=CURRICULUM.length*PROGRAM.unitsPerYear;
    let done=0;
    CURRICULUM.forEach(c=>{for(let u=lo;u<=hi;u++)if(isPassed(c.id,u))done++;});
    const cls=done===total?'done':(y===cy?'now':'');
    return '<div class="yr '+cls+'"><div class="n">'+nm+'</div>'+
      '<div class="t">Cycles '+lo+'–'+hi+'<br>'+done+' of '+total+' units passed</div></div>';
  }).join('');
  document.getElementById('trackBox').innerHTML=
    '<div class="boxtitle">The accelerated track</div>'+
    '<div class="sub">A four-year degree at four times speed: three units per academic year, one unit every four weeks, '+programStats().totalDays+' days end to end.</div>'+
    '<div class="yearstrip">'+cells+'</div>';
}

function renderDue(){
  const items=[];
  CURRICULUM.forEach(c=>{
    const u=nextUnit(c.id);
    if(u<=PROGRAM.units)items.push({t:c.short+' — Unit '+u+' exam',d:unitDue(c.id,u)});
  });
  items.push({t:'Weekly homework — all courses',d:nextSunday()});
  items.sort((a,b)=>a.d-b.d);
  document.getElementById('dueList').innerHTML=items.slice(0,6).map(it=>{
    const n=daysLeft(it.d);
    const cls=n<0?'overdue':n===0?'today':n<=3?'soon':'';
    const when=n<0?Math.abs(n)+' day'+(Math.abs(n)===1?'':'s')+' late'
      :n===0?'due today'
      :'due '+fmtD(it.d)+' · '+n+'d';
    return '<div class="due-row '+cls+'"><span>'+esc(it.t)+'</span><span class="when">'+when+'</span></div>';
  }).join('');
}

/* The record only exists in this browser. Nag, but only once it is worth losing. */
function renderNotice(){
  const box=document.getElementById('noticeBox');
  if(!box)return;
  const last=store.get('ku_lastexport');
  const days=last?Math.floor((new Date()-keyToDate(last))/86400000):null;
  const worth=grades.length>=3;
  if(!worth||(days!==null&&days<14)){box.innerHTML='';return;}
  box.innerHTML='<div class="notice"><span><strong>Back up the record.</strong> '+
    grades.length+' exam'+(grades.length===1?'':'s')+' and '+days_countText()+' live only in this browser'+
    (last?', last exported '+days+' days ago':' and have never been exported')+'.</span>'+
    '<button class="btn small" type="button" onclick="exportAll()">Export now</button></div>';
}
function days_countText(){
  return days.length+' study day'+(days.length===1?'':'s');
}

function renderDash(){
  renderHero();renderTrack();renderDue();renderNotice();
  document.getElementById('dashList').innerHTML=CURRICULUM.map(c=>{
    const p=pct(c.id),cg=courseGPA(c.id),done=passedUnits(c.id);
    return '<div class="ledger-row">'+
      '<div class="info">'+
        '<span class="kind '+(c.kind==='General education'?'gen':'')+'">'+c.kind+'</span>'+
        '<h3>'+esc(c.name)+'</h3>'+
        '<div class="school">'+esc(c.school)+'</div>'+
      '</div>'+
      '<div class="gradechip" title="Course grade">'+letterOf(cg)+'</div>'+
      '<div class="prog"><span class="num">'+p+'%</span>'+
        '<div class="ucount">'+done+' of '+PROGRAM.units+' units</div>'+
        '<div class="bar"><i style="width:'+p+'%"></i></div></div>'+
    '</div>';
  }).join('');
}

function renderCourses(){
  document.getElementById('courseList').innerHTML=CURRICULUM.map(c=>{
    const done=hwDoneThisWeek(c.id),wk=(hw[c.id]||[]).length,owed=nextUnit(c.id);
    const years=[1,2,3,4].map(y=>{
      const us=c.units.filter(u=>yearOfUnit(u.n)===y).map(u=>{
        const passed=isPassed(c.id,u.n);
        const due=unitDue(c.id,u.n),n=daysLeft(due);
        const late=!passed&&n<0;
        const cls=passed?'passed':(u.n===owed?'now':'');
        const stat=passed?'<span class="ustat p">Passed</span>'
          :late?'<span class="ustat o">'+Math.abs(n)+'d late</span>':'';
        return '<div class="unit '+cls+'">'+
          '<div class="uh"><span class="un">Unit '+u.n+' · '+esc(u.name)+'</span>'+
          '<span class="ud">'+(stat||'due '+fmtD(due))+'</span></div>'+
          '<div class="uf">'+esc(u.focus)+'</div>'+
          '<ul class="uw">'+u.work.map(w=>'<li>'+esc(w)+'</li>').join('')+'</ul>'+
        '</div>';
      }).join('');
      return '<div class="yearblock"><div class="ytitle">'+YEAR_NAMES[y-1]+' · cycles '+
        ((y-1)*3+1)+'–'+(y*3)+'</div>'+us+'</div>';
    }).join('');

    return '<div class="course card">'+
      '<span class="kind '+(c.kind==='General education'?'gen':'')+'">'+c.kind+'</span>'+
      '<h3>'+esc(c.name)+'</h3>'+
      '<div class="school">'+esc(c.school)+'</div>'+
      '<div class="hwline">'+
        '<span>Homework weeks logged: '+wk+' of '+weeksElapsed()+' — due Sundays</span>'+
        (done?'<span class="done">This week done</span>'
          :'<button class="btn small quiet" type="button" onclick="markHW(\''+c.id+'\')">Mark week done</button>')+
      '</div>'+
      '<details open><summary>Watch — video classrooms, start here</summary>'+
        '<ul class="linklist">'+c.watch.map(l=>'<li><a href="'+esc(l[1])+'" target="_blank" rel="noopener">'+esc(l[0])+'</a></li>').join('')+'</ul>'+
      '</details>'+
      '<details><summary>Practice — courses, texts and exercises</summary>'+
        '<ul class="linklist">'+c.links.map(l=>l[1]==='#'
          ?'<li><span class="note-sm">'+esc(l[0])+'</span></li>'
          :'<li><a href="'+esc(l[1])+'" target="_blank" rel="noopener">'+esc(l[0])+'</a></li>').join('')+'</ul>'+
      '</details>'+
      '<details><summary>The four-year unit plan — twelve cycles, one year</summary><div class="unitwrap">'+years+'</div></details>'+
      '<details><summary>Standing weekly homework</summary>'+
        '<ul class="linklist">'+c.homework.map(h=>'<li>'+esc(h)+'</li>').join('')+'</ul>'+
      '</details>'+
    '</div>';
  }).join('');
}

/* ---------- exams ---------- */
function renderTestPicker(){
  document.getElementById('testPicker').innerHTML=CURRICULUM.map(c=>{
    const on=c.id===currentCourse;
    return '<button class="btn quiet" type="button" aria-pressed="'+on+'" onclick="openTest(\''+c.id+'\')">'+
      esc(c.short)+' · Unit '+Math.min(nextUnit(c.id),PROGRAM.units)+'</button>';
  }).join('');
}

function shuffled(arr){
  const a=arr.slice();
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function openTest(id){
  currentCourse=id;authCourse=id;
  const c=COURSE[id],unit=nextUnit(id);
  renderTestPicker();
  const area=document.getElementById('testArea');

  if(unit>PROGRAM.units){
    area.innerHTML='<div class="exam card"><h3 class="serif">'+esc(c.name)+' — complete</h3>'+
      '<p class="rules">All twelve units passed. Course grade: '+letterOf(courseGPA(id))+'. '+
      'Write the capstone and take it to someone who will judge it honestly.</p></div>';
    authUnit=PROGRAM.units;renderAuth();return;
  }

  authUnit=unit;
  const u=c.units[unit-1];
  const qs=questionsFor(id,unit);

  if(qs.length<PROGRAM.qPerExam){
    area.innerHTML='<div class="exam card">'+
      '<h3 class="serif">Unit '+unit+' · '+esc(u.name)+'</h3>'+
      '<p class="rules">'+esc(u.focus)+'</p>'+
      '<span class="duewarn">This exam needs '+PROGRAM.qPerExam+' questions. It has '+qs.length+'.</span>'+
      '<p style="font-size:13.5px;color:var(--slate);max-width:56ch;">Write '+(PROGRAM.qPerExam-qs.length)+
      ' more below and the exam unlocks immediately. Writing the questions is part of the coursework — '+
      'you cannot set a fair exam on material you have not learned.</p></div>';
    renderAuth();return;
  }

  const due=unitDue(id,unit),n=daysLeft(due);
  const warn=n<0
    ?'<span class="duewarn late">This exam is '+Math.abs(n)+' day'+(Math.abs(n)===1?'':'s')+' past due — passing now costs a third of a letter grade.</span>'
    :n===0?'<span class="duewarn today">Due today. Pass it before midnight or the late penalty applies.</span>'
    :'<span class="duewarn">Due '+fmtD(due)+' — '+n+' day'+(n===1?'':'s')+' left.</span>';

  /* Shuffle the questions, and the options inside each one, on every attempt. */
  activeExam={id:id,unit:unit,qs:shuffled(qs).slice(0,PROGRAM.qPerExam).map(q=>{
    const opts=shuffled(q[1].map((text,i)=>({text:text,ok:i===q[2]})));
    return {prompt:q[0],opts:opts,answer:opts.findIndex(o=>o.ok),why:q[3]||''};
  })};

  area.innerHTML='<div class="exam card">'+
    '<h3 class="serif">Unit '+unit+' · '+esc(u.name)+'</h3>'+
    '<p class="rules">'+PROGRAM.qPerExam+' questions. '+PROGRAM.pass+'% to pass. Closed book. Options are reshuffled every attempt.</p>'+
    warn+
    '<form id="examForm">'+activeExam.qs.map((q,i)=>
      '<fieldset class="q" id="q'+i+'"><legend>'+(i+1)+'. '+esc(q.prompt)+'</legend>'+
      q.opts.map((o,j)=>'<label id="o'+i+'_'+j+'"><input type="radio" name="q'+i+'" value="'+j+'">'+esc(o.text)+'</label>').join('')+
      '</fieldset>').join('')+
    '</form>'+
    '<button class="btn" type="button" onclick="gradeTest()">Submit exam</button>'+
    '<div id="examResult"></div>'+
  '</div>';
  renderAuth();
  document.getElementById('testArea').scrollIntoView({behavior:'smooth',block:'start'});
}

function gradeTest(){
  if(!activeExam)return;
  const {id,unit,qs}=activeExam;
  let correct=0,unanswered=0;

  qs.forEach((q,i)=>{
    const sel=document.querySelector('#examForm input[name="q'+i+'"]:checked');
    const chosen=sel?+sel.value:-1;
    if(chosen===-1)unanswered++;
    const right=chosen===q.answer;
    if(right)correct++;
    /* Mark up the question so a wrong answer teaches instead of just scoring. */
    const fs=document.getElementById('q'+i);
    fs.querySelectorAll('input').forEach(inp=>inp.disabled=true);
    if(!right){
      fs.classList.add('wrong');
      if(chosen>=0)document.getElementById('o'+i+'_'+chosen).classList.add('pick-wrong');
    }
    document.getElementById('o'+i+'_'+q.answer).classList.add('pick-right');
    if(q.why&&!right){
      const p=document.createElement('p');
      p.className='why';p.textContent=q.why;
      fs.appendChild(p);
    }
  });

  const score=Math.round(correct/qs.length*100);
  const passed=score>=PROGRAM.pass;
  const late=new Date()>unitDue(id,unit);
  const letter=scoreLetter(score,late);

  grades.push({id:id,course:COURSE[id].short,name:COURSE[id].units[unit-1].name,
    score:score,unit:unit,late:late,date:todayKey()});
  store.set('ku_grades',grades);
  const t=todayKey();if(!days.includes(t)){days.push(t);store.set('ku_days',days);}

  const box=document.getElementById('examResult');
  box.className='result '+(passed?'pass':'fail');
  box.textContent=passed
    ?'Score: '+score+'% ('+correct+' of '+qs.length+') — grade '+letter+
      (late?', late penalty applied':'')+'. Unit '+unit+' passed and logged to your transcript.'
    :'Score: '+score+'% ('+correct+' of '+qs.length+')'+(unanswered?', '+unanswered+' left blank':'')+
      ' — below '+PROGRAM.pass+'%. Failed attempts are recorded but never counted toward your GPA. '+
      'Read the corrections above, study the unit again, then retake it.';
  box.setAttribute('tabindex','-1');box.focus();

  activeExam=null;
  renderDash();renderGradebook();renderStanding();renderCerts();renderTestPicker();
}

/* ---------- question authoring ---------- */
function renderAuth(){
  const c=COURSE[authCourse];
  const unit=Math.min(authUnit,PROGRAM.units);
  const built=builtIn(authCourse,unit).length,own=mine(authCourse,unit);
  const total=built+own.length;
  const short=Math.max(0,PROGRAM.qPerExam-total);

  document.getElementById('authBox').innerHTML=
   '<h3>Write the exam</h3>'+
   '<p class="rules">All twelve units ship with a full exam. Anything you add here deepens the pool a unit '+
   'draws from, so a retake tests knowledge rather than memory of the last attempt. '+
   'Draft questions the way a professor would: one idea each, one defensible answer, and a reason the wrong answers are wrong.</p>'+

   '<div class="tworow">'+
     '<div class="field"><label for="aCourse">Course</label><select id="aCourse">'+
       CURRICULUM.map(x=>'<option value="'+x.id+'"'+(x.id===authCourse?' selected':'')+'>'+esc(x.short)+'</option>').join('')+
     '</select></div>'+
     '<div class="field"><label for="aUnit">Unit</label><select id="aUnit">'+
       c.units.map(u=>'<option value="'+u.n+'"'+(u.n===unit?' selected':'')+'>Unit '+u.n+' · '+esc(u.name)+'</option>').join('')+
     '</select></div>'+
   '</div>'+

   '<p class="rules">This unit has <strong>'+total+'</strong> question'+(total===1?'':'s')+
     ' ('+built+' built in, '+own.length+' written by you). '+
     (short?'<strong>'+short+' more</strong> and the exam unlocks.':'The exam is unlocked.')+'</p>'+

   '<div class="field"><label for="aPaste">Paste questions</label>'+
   '<div class="fmt">Question text on the first line\n* The correct answer (marked with a star)\nA wrong answer\nA wrong answer\n&gt; Why the right answer is right (optional)\n\n(blank line between questions — JSON is also accepted)</div>'+
   '<textarea id="aPaste" placeholder="What does the derivative of a function represent?&#10;* The instantaneous rate of change&#10;The area under the curve&#10;The average slope over an interval&#10;&gt; It is the limit of the difference quotient as h approaches zero."></textarea></div>'+
   '<div class="authrow">'+
     '<button class="btn" type="button" onclick="importQuestions()">Add to the bank</button>'+
     '<button class="btn gold" type="button" onclick="copyPrompt()">Copy a prompt to generate these</button>'+
     '<button class="btn quiet" type="button" onclick="fillSample()">Show the format</button>'+
   '</div>'+
   '<div id="authStatus"></div>'+

   (own.length?'<div class="banklist"><strong style="font-size:13px;">Your questions for Unit '+unit+'</strong>'+
     own.map((q,i)=>'<div class="bank-row"><div class="bq">'+esc(q[0])+
       '<div class="ba">✓ '+esc(q[1][q[2]])+'</div></div>'+
       '<button class="linkbtn" type="button" onclick="deleteQ('+i+')">Remove</button></div>').join('')+
     '</div>':'');

  document.getElementById('aCourse').addEventListener('change',e=>{
    authCourse=e.target.value;authUnit=1;renderAuth();
  });
  document.getElementById('aUnit').addEventListener('change',e=>{
    authUnit=+e.target.value;renderAuth();
  });
}

/* Closes the loop: this builds the whole request, you paste it into an AI or
 * hand it to a tutor, and whatever comes back drops straight into the box above. */
function buildPrompt(){
  const c=COURSE[authCourse];
  const unit=Math.min(authUnit,PROGRAM.units);
  const u=c.units[unit-1];
  const have=questionsFor(authCourse,unit);
  const short=PROGRAM.qPerExam-have.length;
  /* A full bank still benefits from more questions — they deepen the pool the
   * exam draws from, so retakes stop being a memory test. */
  const need=short>0?short:PROGRAM.qPerExam;
  const year=YEAR_NAMES[yearOfUnit(unit)-1];

  return 'Write '+need+(short>0?'':' additional')+' exam question'+(need===1?'':'s')+
   ' for a university unit test.\n'+
   (short>0?'':'This unit’s exam is already unlocked; these deepen the pool it draws from, '+
     'so retaking it tests knowledge rather than memory.\n')+'\n'+
   'Course: '+c.name+'\n'+
   'Program stage: '+year+' of a four-year degree ('+c.kind.toLowerCase()+')\n'+
   'Unit '+unit+' of '+PROGRAM.units+': '+u.name+'\n'+
   'Material covered: '+u.focus+'\n\n'+
   'Coursework this unit is built on:\n'+u.work.map(w=>'- '+w).join('\n')+'\n\n'+
   'Requirements:\n'+
   '- Difficulty must match a real '+year.toLowerCase()+' university exam, not a quiz. '+
     'Test understanding and application, never recall of a definition.\n'+
   '- Exactly four options per question. Wrong options must be plausible to '+
     'someone who half-learned the material — no obvious throwaways.\n'+
   '- Exactly one defensible correct answer per question.\n'+
   '- Each question ends with one line explaining why the right answer is right.\n'+
   '- Do not repeat any of the questions already in this unit, listed at the end.\n\n'+
   'Return them in exactly this plain-text format and nothing else — no numbering, '+
   'no headings, no commentary:\n\n'+
   'Question text on one line\n'+
   '* The correct option\n'+
   'A wrong option\n'+
   'A wrong option\n'+
   'A wrong option\n'+
   '> One line on why the correct answer is correct.\n\n'+
   '(one blank line between questions)\n\n'+
   (have.length
     ? 'Questions already in this unit — do not duplicate these:\n'+
       have.map((q,i)=>(i+1)+'. '+q[0]).join('\n')
     : 'This unit has no questions yet.');
}

function copyPrompt(){
  const text=buildPrompt();
  const done=()=>authStatus('Prompt copied. Paste it into Claude, then paste the '+
    'questions it returns into the box above and press "Add to the bank".',true);
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text,done));
  }else fallbackCopy(text,done);
}
/* Clipboard API is unavailable over file:// and in some mobile browsers.
 * onFail lets each caller put the text somewhere the user can actually reach. */
function fallbackCopy(text,onOk,onFail){
  const ta=document.createElement('textarea');
  ta.value=text;ta.setAttribute('readonly','');
  ta.style.cssText='position:fixed;top:0;left:-9999px;';
  document.body.appendChild(ta);ta.select();
  let ok=false;
  try{ok=document.execCommand('copy');}catch(e){ok=false;}
  ta.remove();
  if(ok)onOk();
  else if(onFail)onFail();
  else{
    document.getElementById('aPaste').value=text;
    authStatus('Could not reach the clipboard, so the prompt is in the box above. '+
      'Cut it, paste it into Claude, then replace it with the questions you get back.',true);
  }
}

function fillSample(){
  document.getElementById('aPaste').value=
   'What does the derivative of a function represent?\n'+
   '* The instantaneous rate of change at a point\n'+
   'The total area under the curve\n'+
   'The average slope across the whole domain\n'+
   'The maximum value of the function\n'+
   '> It is the limit of the difference quotient as h approaches zero.\n\n'+
   'Which test confirms a critical point is a local minimum?\n'+
   '* The second derivative is positive there\n'+
   'The first derivative is positive there\n'+
   'The function is increasing there\n'+
   'The second derivative is zero there\n'+
   '> A positive second derivative means the curve is concave up at that point.';
}

function authStatus(msg,ok){
  const el=document.getElementById('authStatus');
  if(!el)return;
  el.className='status '+(ok?'ok':'err');
  el.textContent=msg;
}

/* Accepts either the starred plain-text format or a JSON array. */
function parseQuestions(text){
  const trimmed=text.trim();
  if(!trimmed)throw new Error('Nothing to add — the box is empty.');

  if(trimmed[0]==='['){
    const arr=JSON.parse(trimmed);
    if(!Array.isArray(arr))throw new Error('JSON must be an array of questions.');
    return arr.map((q,i)=>{
      if(!Array.isArray(q)||typeof q[0]!=='string'||!Array.isArray(q[1])||typeof q[2]!=='number')
        throw new Error('Question '+(i+1)+' is not in the form [prompt, [options], correctIndex, why].');
      if(q[1].length<2)throw new Error('Question '+(i+1)+' needs at least two options.');
      if(q[2]<0||q[2]>=q[1].length)throw new Error('Question '+(i+1)+' has a correct index outside its options.');
      return [String(q[0]),q[1].map(String),q[2],String(q[3]||'')];
    });
  }

  return trimmed.split(/\n\s*\n/).map((block,bi)=>{
    const lines=block.split('\n').map(l=>l.trim()).filter(Boolean);
    if(lines.length<3)throw new Error('Question '+(bi+1)+' needs a prompt and at least two options.');
    const prompt=lines[0];
    const opts=[];let answer=-1,why='';
    lines.slice(1).forEach(line=>{
      if(line[0]==='>'){why=line.slice(1).trim();return;}
      const correct=line[0]==='*';
      const text=correct?line.slice(1).trim():line;
      if(correct){
        if(answer!==-1)throw new Error('Question '+(bi+1)+' marks more than one answer correct.');
        answer=opts.length;
      }
      opts.push(text);
    });
    if(opts.length<2)throw new Error('Question '+(bi+1)+' needs at least two options.');
    if(answer===-1)throw new Error('Question '+(bi+1)+' has no answer marked with a star.');
    return [prompt,opts,answer,why];
  });
}

function importQuestions(){
  let parsed;
  try{parsed=parseQuestions(document.getElementById('aPaste').value);}
  catch(err){authStatus(err.message,false);return;}

  userBank[authCourse]=userBank[authCourse]||{};
  const list=userBank[authCourse][authUnit]||[];
  userBank[authCourse][authUnit]=list.concat(parsed);
  store.set('ku_bank',userBank);

  const total=questionsFor(authCourse,authUnit).length;
  document.getElementById('aPaste').value='';
  renderAuth();
  authStatus('Added '+parsed.length+' question'+(parsed.length===1?'':'s')+'. Unit '+authUnit+' now has '+total+
    (total>=PROGRAM.qPerExam?' — the exam is unlocked.':' of '+PROGRAM.qPerExam+' needed.'),true);
  renderTestPicker();
  if(authCourse===currentCourse&&total>=PROGRAM.qPerExam&&authUnit===nextUnit(authCourse))openTest(authCourse);
}

function deleteQ(i){
  const list=(userBank[authCourse]||{})[authUnit];
  if(!list)return;
  if(!confirm('Remove this question from Unit '+authUnit+'?'))return;
  list.splice(i,1);
  store.set('ku_bank',userBank);
  renderAuth();renderTestPicker();
}

/* ---------- the Dean ----------
 * Deterministic. No network, no model, no excuses — it reads the same record
 * you do and works out what you owe today. The lecture is a separate button.
 */
let hoursPerUnit=store.get('ku_hpu')||40;

function programStats(){
  const now=new Date(),end=programEnd();
  const totalUnits=CURRICULUM.length*PROGRAM.units;
  const passed=CURRICULUM.reduce((a,c)=>a+passedUnits(c.id),0);
  /* Expected by now = every unit whose deadline has already gone by. */
  let expected=0,overdue=0;
  CURRICULUM.forEach(c=>{
    for(let u=1;u<=PROGRAM.units;u++){
      if(unitDue(c.id,u)<now){expected++;if(!isPassed(c.id,u))overdue++;}
    }
  });
  const left=totalUnits-passed;
  const remaining=Math.max(0,daysLeft(end));
  const hours=left*hoursPerUnit;
  return {
    end:end,
    totalDays:Math.round((end-start)/86400000),
    elapsed:Math.max(0,daysLeft(start)*-1),
    remaining:remaining,
    totalUnits:totalUnits,passed:passed,expected:expected,overdue:overdue,left:left,
    behind:Math.max(0,expected-passed),
    hours:hours,
    perDay:remaining>0?hours/remaining:hours
  };
}

function deanOrders(){
  const now=new Date(),out=[];
  CURRICULUM.forEach(c=>{
    const u=nextUnit(c.id);
    if(u>PROGRAM.units)return;
    const due=unitDue(c.id,u),n=daysLeft(due),have=questionsFor(c.id,u).length;

    if(n<0)out.push({p:0,cls:'late',
      what:'Sit the '+c.short+' Unit '+u+' exam — '+Math.abs(n)+' day'+(Math.abs(n)===1?'':'s')+' late',
      why:'It is already costing you a third of a letter grade. Waiting longer costs nothing more, but the unit behind it is not going to learn itself.'});
    else if(n<=3)out.push({p:1,cls:'soon',
      what:'Sit the '+c.short+' Unit '+u+' exam — '+(n===0?'due today':n+' day'+(n===1?'':'s')+' left'),
      why:esc(c.units[u-1].name)+'. Review before you open it; it is closed book and eight of ten passes.'});
    else if(n<=7)out.push({p:2,cls:'',
      what:c.short+' Unit '+u+' exam in '+n+' days',
      why:'Finish the unit work now so the exam is a formality, not a gamble.'});

    if(have<PROGRAM.qPerExam&&n<=14)out.push({p:1,cls:'soon',
      what:'Write '+(PROGRAM.qPerExam-have)+' more questions for '+c.short+' Unit '+u,
      why:'The exam is locked until it has '+PROGRAM.qPerExam+'. The Dean cannot grade an exam that does not exist.'});
  });

  const unlogged=CURRICULUM.filter(c=>!hwDoneThisWeek(c.id));
  if(unlogged.length)out.push({p:3,cls:'',
    what:'Log this week’s homework: '+unlogged.map(c=>esc(c.short)).join(', '),
    why:'Due Sunday. Five ticks a week is the floor, and the record is the only thing keeping you honest.'});

  if(!days.includes(todayKey()))out.push({p:4,cls:'',
    what:'Log today’s study session',
    why:'The streak is at '+streak()+'. It resets the day you skip.'});

  /* The actual work, drawn from the unit you are currently in. */
  CURRICULUM.forEach(c=>{
    const u=nextUnit(c.id);
    if(u>PROGRAM.units)return;
    const w=c.units[u-1].work;
    out.push({p:5,cls:'',what:esc(c.short)+': '+esc(w[0]),
      why:'Unit '+u+' — '+esc(c.units[u-1].name)+'.'});
  });

  return out.sort((a,b)=>a.p-b.p);
}

function deanStanding(){
  const s=programStats();
  if(s.expected===0&&s.passed===0)
    return {tone:'',verdict:'Term has begun.',
      text:'Nothing is due yet. Use that. The first deadline is '+fmtD(unitDue(CURRICULUM[0].id,1))+
      ', and the students who fail this program are the ones who treat month one as a warm-up.'};
  if(s.behind===0&&s.overdue===0)
    return {tone:'good',verdict:'You are on schedule.',
      text:s.passed+' of '+s.totalUnits+' units passed, nothing overdue, cumulative GPA '+
      (cumGPA()===null?'not yet set':cumGPA().toFixed(2))+'. Keep the pace and do not celebrate — '+
      s.left+' units and '+s.remaining+' days remain.'};
  if(s.behind<=2)
    return {tone:'warn',verdict:'You are slipping.',
      text:'You should have '+s.expected+' units passed by now and you have '+s.passed+'. That is '+
      s.behind+' behind — recoverable this week, and only this week. '+
      (s.overdue?s.overdue+' exam'+(s.overdue===1?' is':'s are')+' past due. Sit '+(s.overdue===1?'it':'them')+' today.':'Close the gap before the next deadline lands on top of it.')};
  return {tone:'bad',verdict:'You are behind, and it is compounding.',
    text:s.behind+' units behind schedule with '+s.overdue+' exam'+(s.overdue===1?'':'s')+' past due. '+
    projection(s)+' '+
    'Pick the single most overdue exam, sit it today, and do not open anything else until it is passed.'};
}
/* Projected finish from the pace you have actually held, not from optimism. */
function projection(s){
  const elapsed=Math.max(1,s.elapsed);
  if(s.passed===0)return 'At your current pace — no units passed in '+elapsed+' days — you do not finish at all.';
  const perDay=s.passed/elapsed;
  const needed=Math.round(s.left/perDay);
  const over=needed-s.remaining;
  if(over<=0)return 'Your pace still clears it, but only just: '+needed+' more days of work against '+s.remaining+' remaining.';
  return 'At the pace you have actually held ('+s.passed+' units in '+elapsed+' days) the remaining '+
    s.left+' take about '+needed+' more days — roughly '+over+' days past the deadline.';
}

function renderDean(){
  const st=deanStanding(),s=programStats(),orders=deanOrders();

  document.getElementById('standingBox').innerHTML=
    '<div class="standing '+st.tone+'"><div class="verdict">'+st.verdict+'</div><p>'+st.text+'</p></div>';

  document.getElementById('ordersBox').innerHTML=orders.length
    ? orders.slice(0,9).map((o,i)=>'<div class="order '+o.cls+'"><span class="rank">'+(i+1)+'</span>'+
        '<span class="body"><span class="what">'+o.what+'</span><span class="why">'+o.why+'</span></span></div>').join('')
    : '<div class="empty">Nothing outstanding. That has never once been true — check your deadlines.</div>';

  const dayLoad=s.perDay.toFixed(1);
  document.getElementById('paceBox').innerHTML=
    '<div class="boxtitle">The numbers</div>'+
    '<div class="sub">Twelve four-week cycles, five courses staggered six days apart, '+s.totalDays+' days from enrolment to the final deadline — inside one year.</div>'+
    '<div class="statgrid">'+
      '<div class="stat"><div class="v">'+s.remaining+'</div><div class="k">days left of '+s.totalDays+'</div></div>'+
      '<div class="stat"><div class="v">'+s.passed+' / '+s.totalUnits+'</div><div class="k">units passed</div></div>'+
      '<div class="stat'+(s.behind?' alert':'')+'"><div class="v">'+(s.behind?'−'+s.behind:'0')+'</div><div class="k">units behind schedule</div></div>'+
      '<div class="stat'+(s.perDay>8?' alert':'')+'"><div class="v">'+dayLoad+'h</div><div class="k">a day to finish on time</div></div>'+
    '</div>'+
    '<div class="loadnote">That last number assumes <input type="text" id="hpuIn" value="'+hoursPerUnit+
      '" aria-label="Hours of work per unit" inputmode="numeric"> hours of real work per unit '+
      '<button class="btn small quiet" type="button" onclick="saveHPU()">Recalculate</button><br>'+
      s.left+' units left × '+hoursPerUnit+' hours = '+s.hours.toLocaleString()+' hours, across '+s.remaining+' days. '+
      'A four-year degree is roughly 5,400 hours; this program is a compressed version of one, not a credit-for-credit copy. '+
      'If the number above is above eight, the schedule is fiction — either raise your hours or extend the enrolment date in the Registrar.</div>';

  renderLecture();
}

function saveHPU(){
  const v=parseFloat(document.getElementById('hpuIn').value);
  if(!isFinite(v)||v<=0||v>500)return;
  hoursPerUnit=v;store.set('ku_hpu',v);renderDean();
}

/* ---------- the lecture: full program state, handed to Claude ---------- */
function buildBriefing(kind){
  const s=programStats(),st=deanStanding();
  const lines=[];
  lines.push('You are my lecturer and academic advisor at KWanus University, a private, self-directed');
  lines.push('program that compresses a four-year degree into one calendar year. I am the only student.');
  lines.push('Be direct. Hold me to the standard. Do not congratulate me for work I have not done.');
  lines.push('');
  lines.push('== WHERE I STAND ==');
  lines.push('Student: '+(student||'unknown')+'. Enrolled '+startISO+'. Day '+s.elapsed+' of '+s.totalDays+'.');
  lines.push('Academic year '+currentAcademicYear()+' of 4, cycle '+currentUnitByCalendar()+' of 12.');
  lines.push('Units passed: '+s.passed+' of '+s.totalUnits+'. Expected by now: '+s.expected+'.');
  lines.push('Overdue exams: '+s.overdue+'. Cumulative GPA: '+(cumGPA()===null?'none yet':cumGPA().toFixed(2)+' ('+letterOf(cumGPA())+')'));
  lines.push('Study streak: '+streak()+' days. Dean’s assessment: '+st.verdict);
  lines.push('');
  lines.push('== EVERY COURSE ==');
  CURRICULUM.forEach(c=>{
    const u=nextUnit(c.id),g=courseGPA(c.id);
    lines.push('');
    lines.push(c.name+' ('+c.kind+')');
    lines.push('  Passed '+passedUnits(c.id)+'/'+PROGRAM.units+' units. Grade: '+letterOf(g)+
      (g===null?'':' ('+g.toFixed(2)+')')+'. Homework this week: '+(hwDoneThisWeek(c.id)?'logged':'NOT logged'));
    if(u<=PROGRAM.units){
      const unit=c.units[u-1],due=unitDue(c.id,u),n=daysLeft(due);
      lines.push('  Current unit '+u+': '+unit.name);
      lines.push('  Covers: '+unit.focus);
      lines.push('  Due: '+due.toDateString()+' ('+(n<0?Math.abs(n)+' DAYS OVERDUE':n+' days away')+')');
      lines.push('  Exam bank: '+questionsFor(c.id,u).length+'/'+PROGRAM.qPerExam+
        (examReady(c.id,u)?' — unlocked':' — LOCKED, questions still needed'));
      unit.work.forEach(w=>lines.push('    - '+w));
    }else lines.push('  All twelve units complete.');
  });

  const recent=grades.slice(-8).reverse();
  if(recent.length){
    lines.push('');
    lines.push('== RECENT EXAM RESULTS (newest first) ==');
    recent.forEach(g=>lines.push('  '+g.date+'  '+(g.course||g.id)+' Unit '+g.unit+': '+g.score+'% '+
      scoreLetter(g.score,g.late)+(g.late?' (late)':'')+(g.score>=PROGRAM.pass?'':'  <-- FAILED')));
  }

  lines.push('');
  lines.push('== WHAT I NEED FROM YOU ==');
  if(kind==='daily'){
    lines.push('Give me today’s plan. Pick the two or three things that actually matter most given');
    lines.push('what is overdue and what is due soonest, put them in order, and say roughly how long');
    lines.push('each should take. Then teach me the single hardest concept in my most urgent unit —');
    lines.push('properly, with an example I can work, not a summary. End with one question that tests');
    lines.push('whether I understood it.');
  }else if(kind==='weekly'){
    lines.push('Run my weekly review. Tell me what I actually accomplished against what was scheduled,');
    lines.push('name the course I am neglecting and why that is dangerous given what is coming, and set');
    lines.push('specific targets for the next seven days with days attached. If I am behind, say so');
    lines.push('plainly and tell me what to drop to catch up. Do not be encouraging for its own sake.');
  }else if(kind==='debrief'){
    lines.push('I failed or struggled with a recent exam (see results above). Work out what I most');
    lines.push('likely do not understand, teach that concept from the ground up, give me three worked');
    lines.push('examples of increasing difficulty, then five practice problems with answers hidden');
    lines.push('until the end. Tell me whether I am ready to retake it.');
  }else if(kind==='lecture'){
    lines.push('Deliver an actual lecture on the current unit of the course I am most behind in.');
    lines.push('Assume I have done the reading and nothing more. Build from first principles, derive');
    lines.push('rather than assert, and use concrete examples. Aim for something I could take notes on');
    lines.push('for forty minutes. Finish with the three things a professor would expect me to be able');
    lines.push('to do afterwards.');
  }else{
    lines.push('[Type your question here, then send.]');
  }
  return lines.join('\n');
}

function renderLecture(){
  document.getElementById('lectureBox').innerHTML=
   '<h3>Office hours</h3>'+
   '<p class="rules">These copy your entire academic record — every course, unit, deadline, exam '+
   'result and gap — into a prompt for Claude. Paste it in and you get a lecturer who already knows '+
   'exactly where you are. No key, no cost beyond what you already pay, nothing about you leaves '+
   'this browser until you paste it yourself.</p>'+
   '<div class="authrow">'+
     '<button class="btn" type="button" onclick="copyBriefing(\'daily\')">Today’s plan</button>'+
     '<button class="btn quiet" type="button" onclick="copyBriefing(\'weekly\')">Weekly review</button>'+
     '<button class="btn quiet" type="button" onclick="copyBriefing(\'lecture\')">Lecture me</button>'+
     '<button class="btn quiet" type="button" onclick="copyBriefing(\'debrief\')">Exam debrief</button>'+
     '<button class="btn quiet" type="button" onclick="copyBriefing(\'ask\')">Ask a question</button>'+
   '</div>'+
   '<div id="lectureStatus"></div>';
}

function copyBriefing(kind){
  const text=buildBriefing(kind);
  const el=document.getElementById('lectureStatus');
  const ok=()=>{el.className='status ok';
    el.textContent='Briefing copied ('+text.split('\n').length+' lines). Paste it into Claude.';};
  const fail=()=>{
    el.className='status err';
    el.textContent='Could not reach the clipboard. The briefing is selected below — copy it manually.';
    const ta=document.createElement('textarea');
    ta.value=text;ta.style.cssText='width:100%;margin-top:10px;min-height:200px;';
    el.appendChild(ta);ta.select();
  };
  if(navigator.clipboard&&navigator.clipboard.writeText)
    navigator.clipboard.writeText(text).then(ok).catch(()=>fallbackCopy(text,ok,fail));
  else fallbackCopy(text,ok,fail);
}

/* ---------- registrar ---------- */
function renderCerts(){
  document.getElementById('certList').innerHTML=CERTS.map(c=>{
    const p=pct(c[3]),need=c[4],ready=p>=need;
    const free=c[1].startsWith('Free');
    const unitsNeeded=Math.ceil(need/100*PROGRAM.units);
    return '<div class="cred card">'+
      '<span class="flag '+(free?'free':'paid')+'">'+(free?'Free':'Paid')+'</span>'+
      '<h3>'+esc(c[0])+'</h3>'+
      '<div class="cost">'+esc(c[1])+'</div>'+
      '<div class="gate-note">'+(ready
        ? 'Earned — '+esc(COURSE[c[3]].short)+' is at '+p+'%.'
        : 'Unlocks at '+need+'% of '+esc(COURSE[c[3]].short)+' ('+unitsNeeded+' units). You are at '+p+'%.')+'</div>'+
      '<div class="actions"><a class="btn '+(ready?'gold':'quiet')+'" href="'+esc(c[2])+'" target="_blank" rel="noopener">'+
        (ready?'Claim it — you’re ready':'Open the course')+'</a></div>'+
    '</div>';
  }).join('');
}

function renderGradebook(){
  const rows=grades.slice().reverse().map((g,i)=>{
    const idx=grades.length-1-i;
    return '<tr><td>'+esc(g.course||COURSE[g.id].short)+' · Unit '+g.unit+'<br>'+
      '<span style="color:var(--slate);font-size:12px;">'+esc(g.name)+'</span>'+
      (g.late?' <span class="late-tag">LATE</span>':'')+'</td>'+
      '<td class="'+(g.score>=PROGRAM.pass?'score-pass':'score-fail')+'">'+g.score+'%</td>'+
      '<td>'+scoreLetter(g.score,g.late)+'</td>'+
      '<td>'+esc(g.date)+'</td>'+
      '<td><button class="linkbtn" type="button" onclick="deleteGrade('+idx+')">Strike</button></td></tr>';
  }).join('');
  document.getElementById('gradebook').innerHTML=
    '<thead><tr><th>Exam</th><th>Score</th><th>Grade</th><th>Date</th><th><span class="sr-only">Actions</span></th></tr></thead>'+
    '<tbody>'+(rows||'<tr><td colspan="5" style="color:var(--slate);">No exams on record yet.</td></tr>')+'</tbody>';
}

function renderStanding(){
  const rows=CURRICULUM.map(c=>{
    const g=courseGPA(c.id),done=passedUnits(c.id);
    return '<tr><td>'+esc(c.name)+'<br><span style="color:var(--slate);font-size:12px;">'+c.kind+'</span></td>'+
      '<td>'+done+' / '+PROGRAM.units+'</td>'+
      '<td>'+pct(c.id)+'%</td>'+
      '<td>'+(g===null?'—':g.toFixed(2))+'</td>'+
      '<td>'+letterOf(g)+'</td></tr>';
  }).join('');
  const cum=cumGPA();
  document.getElementById('standing').innerHTML=
    '<thead><tr><th>Course</th><th>Units</th><th>Progress</th><th>GPA</th><th>Grade</th></tr></thead>'+
    '<tbody>'+rows+'</tbody>'+
    '<tfoot><tr><td>Cumulative</td><td>'+CURRICULUM.reduce((a,c)=>a+passedUnits(c.id),0)+' / '+
      (CURRICULUM.length*PROGRAM.units)+'</td><td></td><td>'+(cum===null?'—':cum.toFixed(2))+
      '</td><td>'+letterOf(cum)+'</td></tr></tfoot>';
}

function deleteGrade(i){
  const g=grades[i];
  if(!g)return;
  if(!confirm('Strike this attempt from the transcript?\n\n'+g.name+' — '+g.score+'% on '+g.date))return;
  grades.splice(i,1);store.set('ku_grades',grades);
  renderDash();renderGradebook();renderStanding();renderCerts();renderTestPicker();
}

/* ---------- admin: the record must be portable ---------- */
function renderAdmin(){
  document.getElementById('adminBox').innerHTML=
   '<h3>Registrar office</h3>'+
   '<p class="rules">Everything lives in this browser only. Export regularly — clearing site data wipes the whole record, and no one is holding a copy for you.</p>'+
   '<div class="adminrow">'+
     '<div class="field" style="flex:1;min-width:180px;"><label for="nameEdit">Student name</label>'+
     '<input type="text" id="nameEdit" value="'+esc(student||'')+'"></div>'+
     '<button class="btn quiet" type="button" onclick="saveName()">Save</button>'+
   '</div>'+
   '<div class="adminrow">'+
     '<div class="field" style="flex:1;min-width:180px;"><label for="startEdit">Enrolment date (sets every deadline)</label>'+
     '<input type="text" id="startEdit" value="'+esc(startISO)+'" placeholder="YYYY-MM-DD"></div>'+
     '<button class="btn quiet" type="button" onclick="saveStart()">Save</button>'+
   '</div>'+
   '<div class="adminrow">'+
     '<button class="btn" type="button" onclick="exportAll()">Export the record</button>'+
     '<button class="btn quiet" type="button" onclick="document.getElementById(\'importFile\').click()">Import a record</button>'+
     '<button class="btn danger" type="button" onclick="wipeAll()">Withdraw and erase</button>'+
     '<input type="file" id="importFile" accept="application/json,.json" style="display:none">'+
   '</div>'+
   '<div id="adminStatus"></div>';

  document.getElementById('importFile').addEventListener('change',importAll);
}
function adminStatus(msg,ok){
  const el=document.getElementById('adminStatus');
  if(!el)return;
  el.className='status '+(ok?'ok':'err');
  el.textContent=msg;
}
function saveName(){
  const v=document.getElementById('nameEdit').value.trim();
  if(!v){adminStatus('A name is required.',false);return;}
  student=v;store.set('ku_student',v);setChip();
  adminStatus('Name updated.',true);
}
function saveStart(){
  const v=document.getElementById('startEdit').value.trim();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(v)){adminStatus('Use the form YYYY-MM-DD.',false);return;}
  const d=keyToDate(v);
  if(isNaN(d)){adminStatus('That is not a real date.',false);return;}
  startISO=v;start=d;store.set('ku_start',v);
  renderAll();
  adminStatus('Enrolment date set. Every unit deadline has moved with it.',true);
}
function exportAll(){
  const payload={format:'kwanus-university',version:2,exported:new Date().toISOString(),
    student:student,start:startISO,grades:grades,days:days,hw:hw,bank:userBank};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='kwanus-record-'+todayKey()+'.json';
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  store.set('ku_lastexport',todayKey());
  renderNotice();
  adminStatus('Exported. Keep it somewhere that is not this browser.',true);
}
function importAll(e){
  const file=e.target.files&&e.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    let d;
    try{d=JSON.parse(reader.result);}
    catch(err){adminStatus('That file is not valid JSON.',false);return;}
    if(!d||d.format!=='kwanus-university'){adminStatus('That is not a KWanus University record.',false);return;}
    if(!confirm('Replace the current record with this file?\n\nStudent: '+(d.student||'unknown')+
      '\nExams on record: '+((d.grades||[]).length)+'\n\nThis cannot be undone.'))return;
    student=d.student||student;
    grades=Array.isArray(d.grades)?d.grades:[];
    days=Array.isArray(d.days)?d.days:[];
    hw=d.hw&&typeof d.hw==='object'?d.hw:{};
    userBank=d.bank&&typeof d.bank==='object'?d.bank:{};
    if(/^\d{4}-\d{2}-\d{2}$/.test(d.start||'')){startISO=d.start;start=keyToDate(startISO);}
    store.set('ku_student',student);store.set('ku_grades',grades);store.set('ku_days',days);
    store.set('ku_hw',hw);store.set('ku_bank',userBank);store.set('ku_start',startISO);
    setChip();renderAll();
    adminStatus('Record restored: '+grades.length+' exam'+(grades.length===1?'':'s')+' and '+
      days.length+' study day'+(days.length===1?'':'s')+'.',true);
  };
  reader.readAsText(file);
  e.target.value='';
}
function wipeAll(){
  if(!confirm('Erase the entire record — grades, streak, homework and every question you wrote?\n\nExport first if you want it back.'))return;
  if(!confirm('Last check. This permanently deletes everything.'))return;
  ['ku_student','ku_grades','ku_days','ku_hw','ku_bank','ku_start','ku_lastexport','ku_hpu'].forEach(k=>store.del(k));
  location.reload();
}

/* ---------- boot ---------- */
function renderAll(){
  renderDash();renderDean();renderCourses();renderTestPicker();
  renderAuth();renderCerts();renderGradebook();renderStanding();renderAdmin();
}
if(student){closeGate();setChip();}else{openGate();}
renderAll();
openTest(currentCourse);

/* Offline support. Needs a real origin — opening the file directly is fine,
 * it just means no install prompt and no offline cache. */
if('serviceWorker' in navigator&&location.protocol.startsWith('http')){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js')
      .catch(err=>console.warn('Offline support unavailable:',err.message));
  });
}
