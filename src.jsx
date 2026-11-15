import React,{useEffect,useState} from 'react';
import{createRoot}from'react-dom/client';
import{LiveKitRoom,RoomAudioRenderer,VideoTrack,useTracks,ControlBar}from'@livekit/components-react';
import{Track}from'livekit-client';
import'@livekit/components-styles';
import'./style.css';

const API=import.meta.env.VITE_API_URL||'http://localhost:4000';
const req=async(path,opts={})=>{const t=localStorage.getItem('introvert_token');const r=await fetch(API+path,{...opts,headers:{'Content-Type':'application/json',...(t?{Authorization:'Bearer '+t}:{}),...(opts.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'Request failed');return d};
function App(){
 const [user,setUser]=useState(null),[rooms,setRooms]=useState([]),[room,setRoom]=useState(null),[token,setToken]=useState(''),[tab,setTab]=useState('rooms'),[messages,setMessages]=useState([]),[text,setText]=useState(''),[notice,setNotice]=useState(''),[auth,setAuth]=useState({username:'',email:'',password:''}),[mode,setMode]=useState('login');
 const say=s=>{setNotice(s);setTimeout(()=>setNotice(''),3000)};
 const load=async()=>{try{const me=await req('/api/me');setUser(me.user);const x=await req('/api/rooms');setRooms(x.rooms)}catch{setUser(null)}};
 useEffect(()=>{load()},[]);
 const login=async e=>{e.preventDefault();try{const d=await req('/api/auth/'+mode,{method:'POST',body:JSON.stringify(auth)});localStorage.setItem('introvert_token',d.token);await load()}catch(e){say(e.message)}};
 const enter=async r=>{try{await req('/api/rooms/'+r.id+'/join',{method:'POST'});const d=await req('/api/livekit/token',{method:'POST',body:JSON.stringify({roomId:r.id})});setRoom({...r,livekitUrl:d.url});setToken(d.token);setTab('rooms');const m=await req('/api/messages/'+r.id);setMessages(m.messages)}catch(e){say(e.message)}};
 const leave=async()=>{if(room)try{await req('/api/rooms/'+room.id+'/leave',{method:'POST'})}catch{}setRoom(null);setToken('')};
 const send=async e=>{e.preventDefault();if(!text.trim()||!room)return;try{const d=await req('/api/messages/'+room.id,{method:'POST',body:JSON.stringify({body:text})});setMessages(v=>[...v,d.message]);setText('')}catch(e){say(e.message)}};
 const create=async()=>{const name=prompt('Room name?');if(!name)return;try{await req('/api/rooms',{method:'POST',body:JSON.stringify({name,country:'IN',isPrivate:false})});const d=await req('/api/rooms');setRooms(d.rooms)}catch(e){say(e.message)}};
 if(!user)return <main className="auth"><div className="logo">INTROVERT</div><p className="muted">Find your voice. Find your people.</p><form onSubmit={login}><h2>{mode==='login'?'Welcome back':'Create account'}</h2>{mode==='register'&&<input placeholder="Username" required value={auth.username} onChange={e=>setAuth({...auth,username:e.target.value})}/>}<input placeholder="Email" type="email" required value={auth.email} onChange={e=>setAuth({...auth,email:e.target.value})}/><input placeholder="Password (min 8 characters)" type="password" required value={auth.password} onChange={e=>setAuth({...auth,password:e.target.value})}/><button>{mode==='login'?'Login':'Sign up'}</button><p onClick={()=>setMode(mode==='login'?'register':'login')} className="link">{mode==='login'?'Create an account':'Already registered? Login'}</p></form></main>;
 return <div className="app"><header><div className="logo">INTROVERT<span>●</span></div><div className="user">◉ {user.username} <button className="small" onClick={()=>{localStorage.removeItem('introvert_token');setUser(null)}}>Logout</button></div></header>
 <nav>{['rooms','friends','wallet','leaderboard','profile'].map(x=><button className={tab===x?'active':''} onClick={()=>setTab(x)}>{x.toUpperCase()}</button>)}</nav>
 {notice&&<div className="notice">{notice}</div>}
 {room?<section className="room"><div className="roomtop"><div><small>LIVE VOICE ROOM</small><h2>{room.name}</h2><p className="muted">Host & speakers • {room.country||'Global'}</p></div><button className="danger" onClick={leave}>Leave room</button></div>
 <div className="seats">{Array.from({length:12},(_,i)=><div className="seat" key={i}><div className="avatar">{i===0?'♛':'◉'}</div><b>{i===0?user.username:'Open seat '+(i+1)}</b><small>{i===0?'You / Host':'Tap to request'}</small></div>)}</div>
 {token&&<LiveKitRoom serverUrl={room.livekitUrl||undefined} token={token} connect audio video onDisconnected={()=>{}}><RoomAudioRenderer/><div className="lkcontrols"><ControlBar controls={{camera:true,microphone:true,screenShare:false,chat:false}}/></div></LiveKitRoom>}
 <div className="chat"><h3>Room chat</h3><div className="msgs">{messages.map(m=><p><b>{m.sender?.username||'User'}:</b> {m.body}</p>)}</div><form onSubmit={send}><input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a message..."/><button>Send</button></form></div></section>
 :<main>{tab==='rooms'&&<><div className="heading"><div><h1>Voice clubs</h1><p className="muted">Join a room, take a seat, be yourself.</p></div><button onClick={create}>＋ Create room</button></div><div className="cards">{rooms.map(r=><article><div className="roomicon">♫</div><h3>{r.name}</h3><p className="muted">{r.country||'Global'} · {r._count?.members||0}/12 seats</p><button onClick={()=>enter(r)}>Join room</button></article>)}</div></>}
 {tab==='friends'&&<Panel title="Friends & followers" text="Friend and follow APIs are available. Search and discovery UI can be added after your account rules are finalized."/>}
 {tab==='wallet'&&<Wallet/>}{tab==='leaderboard'&&<Leaderboard/>}{tab==='profile'&&<Profile user={user} reload={load}/>}</main>}</div>
}
function Panel({title,text}){return <section className="panel"><h2>{title}</h2><p className="muted">{text}</p></section>}
function Wallet(){const [d,setD]=useState(null);useEffect(()=>{req('/api/wallet').then(setD).catch(()=>{})},[]);return <section className="panel"><h2>Wallet & gifts</h2><h1>{d?.balance??0} <small>coins</small></h1><p className="muted">Gift catalogue and ledger are in the backend. Coin purchases are disabled until verified billing is integrated.</p></section>}
function Leaderboard(){const [rows,setRows]=useState([]);useEffect(()=>{req('/api/leaderboard').then(x=>setRows(x.users)).catch(()=>{})},[]);return <section className="panel"><h2>Leaderboard</h2>{rows.map((u,i)=><p className="rank">#{i+1}　{u.username} <span>{u.coins} coins</span></p>)}</section>}
function Profile({user,reload}){const [bio,setBio]=useState(user.bio||'');return <section className="panel"><h2>Your profile</h2><p>@{user.username}</p><textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Your bio"/><button onClick={()=>req('/api/me',{method:'PATCH',body:JSON.stringify({bio})}).then(reload)}>Save profile</button></section>}
createRoot(document.getElementById('root')).render(<App/>);
