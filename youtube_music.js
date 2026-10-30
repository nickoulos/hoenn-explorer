/* Official Ruby/Sapphire soundtrack chapters, streamed only by the visible YouTube player.
 * Source: https://www.youtube.com/watch?v=DzFlPk2UnQg (PokemonCoJp).
 * Area reuse: pret/pokeemerald data/maps/<area>/map.json music fields.
 */
(function(root){
  'use strict';
  const chapter=(title,startSeconds,endSeconds)=>({title,videoId:'DzFlPk2UnQg',startSeconds,endSeconds});
  const tracks={
    littleroot:chapter('Littleroot Town',239,327),
    route101:chapter('Route 101',576,636),
    oldale:chapter('Oldale Town',636,701),
    center:chapter('Pokémon Center',701,765),
    petalburg:chapter('Petalburg City',1002,1066),
    route104:chapter('Route 104',1114,1185),
    woods:chapter('Petalburg Woods',1185,1249),
    rustboro:chapter('Rustboro City',1474,1576),
    mart:chapter('Poké Mart',4054,4130)
  };
  const areas={littleroot:'littleroot',route101:'route101',route102:'route101',route103:'route101',oldale:'oldale',
    petalburg:'petalburg',route104south:'route104',route104north:'route104',route105:'route104',route116:'route104',
    woods:'woods',rusturf:'woods',rustboro:'rustboro',center:'center',mart:'mart'};

  class LocationMusic {
    constructor(){this.area='littleroot';this.key=areas[this.area];this.player=null;this.playing=false;this.visible=true;}
    get track(){return tracks[this.key];}
    payload(){const {videoId,startSeconds,endSeconds}=this.track;return {videoId,startSeconds,endSeconds};}
    attach(player){this.player=player;this.playing=false;if(this.track)player.cueVideoById(this.payload());}
    detach(){if(this.player)this.player.pauseVideo();this.player=null;this.playing=false;}
    setVisible(visible){this.visible=visible;if(!visible){this.playing=false;if(this.player)this.player.pauseVideo();}}
    setArea(area){
      this.area=area;const key=areas[area];if(key===this.key)return;this.key=key;
      if(!this.player)return;
      if(!this.track){this.playing=false;this.player.pauseVideo();return;}
      if(this.playing&&this.visible)this.player.loadVideoById(this.payload());
      else this.player.cueVideoById(this.payload());
    }
    onState(state){
      if(!this.player)return;
      if(state===1){if(!this.visible){this.player.pauseVideo();this.playing=false;}else this.playing=true;}
      else if(state===2)this.playing=false;
      else if(state===0&&this.playing&&this.visible&&this.track)this.player.loadVideoById(this.payload());
    }
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={LocationMusic,tracks,areas};
  if(!root.document)return;

  const doc=root.document,model=new LocationMusic();
  const toggle=doc.getElementById('music-toggle'),panel=doc.getElementById('music-panel');
  const status=doc.getElementById('music-status'),title=doc.getElementById('music-theme'),link=doc.getElementById('music-link');
  let player=null,opened=false,startupHandled=false,ticket=0,apiPromise=null,areaTimer=null,requestedArea='littleroot';
  let journeyStarted=false,pendingStart=false;
  function startWhenReady(){
    if(!pendingStart||!opened||doc.hidden||!model.player)return;
    pendingStart=false;
    status.textContent='Starting music…';
    model.player.playVideo();
  }
  function updateTheme(){
    const t=model.track;title.textContent=t?t.title:'No theme for this area';
    link.href=t?'https://www.youtube.com/watch?v='+t.videoId+'&t='+t.startSeconds+'s':'https://www.youtube.com/watch?v=DzFlPk2UnQg';
  }
  function api(){
    if(root.YT&&root.YT.Player)return Promise.resolve();
    if(apiPromise)return apiPromise;
    apiPromise=new Promise((resolve,reject)=>{
      const script=doc.createElement('script');script.src='https://www.youtube.com/iframe_api';
      const timer=setTimeout(()=>{script.remove();reject(new Error('YouTube did not respond.'));},20000);
      root.onYouTubeIframeAPIReady=()=>{clearTimeout(timer);resolve();};
      script.onerror=()=>{clearTimeout(timer);script.remove();reject(new Error('YouTube could not connect.'));};
      doc.head.appendChild(script);
    }).catch(error=>{apiPromise=null;throw error;});
    return apiPromise;
  }
  function close(){
    pendingStart=false;
    startupHandled=true;
    opened=false;++ticket;model.detach();if(player){player.destroy();player=null;}
    panel.hidden=true;toggle.hidden=false;toggle.setAttribute('aria-expanded','false');
    doc.getElementById('music-frame').replaceChildren();toggle.focus();
  }
  async function open({automatic=false}={}){
    if(opened)return;
    opened=true;const current=++ticket;
    if(!automatic){
      if(doc.exitPointerLock)doc.exitPointerLock();
      if(typeof root.hoennPauseForMusic==='function')root.hoennPauseForMusic();
    }
    panel.hidden=false;toggle.hidden=true;toggle.setAttribute('aria-expanded','true');
    model.setVisible(!doc.hidden);updateTheme();status.textContent='Connecting to YouTube…';
    if(!automatic)doc.getElementById('music-close').focus();
    try{
      await api();if(!opened||current!==ticket)return;
      const mount=doc.createElement('div');mount.id='youtube-player';doc.getElementById('music-frame').replaceChildren(mount);
      player=new root.YT.Player(mount,{width:'100%',height:'100%',host:'https://www.youtube-nocookie.com',
        playerVars:{playsinline:1,controls:1,autoplay:0,origin:location.origin,rel:0},
        events:{
          onReady(event){
            if(!opened||current!==ticket){event.target.destroy();return;}
            model.attach(event.target);event.target.getIframe().title='Official Pokémon soundtrack — YouTube player';
            status.textContent=journeyStarted?'Press Play to resume.':'Music starts when you enter.';
            startWhenReady();
          },
          onStateChange(event){
            if(!opened||current!==ticket)return;model.onState(event.data);
            if(event.data===1)status.textContent='Playing · music follows your journey.';
            else if(event.data===2)status.textContent='Paused · press Play to resume.';
            else if(event.data===5)status.textContent=journeyStarted?'Music ready.':'Music starts when you enter.';
          },
          onAutoplayBlocked(){status.textContent='Your browser blocked playback. Press Play to start music.';},
          onError(event){model.playing=false;status.textContent='YouTube cannot play here (code '+event.data+'). Try the YouTube link below.';}
        }});
    }catch(error){if(opened&&current===ticket)status.textContent=error.message+' Close and reopen to retry, or use the link below.';}
  }
  toggle.addEventListener('click',()=>open());
  root.hoennOpenMusicOnStart=()=>{
    if(startupHandled)return;
    startupHandled=true;
    open({automatic:true});
  };
  root.hoennStartMusic=()=>{
    if(journeyStarted)return;
    journeyStarted=true;
    if(!opened||doc.hidden)return;
    pendingStart=true;
    startWhenReady();
  };
  doc.getElementById('music-close').addEventListener('click',close);
  // Do not forward player controls/keyboard navigation to the first-person controller.
  panel.addEventListener('keydown',event=>event.stopPropagation());
  panel.addEventListener('keyup',event=>event.stopPropagation());
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden)pendingStart=false;model.setVisible(!doc.hidden);});
  root.hoennSetMusicArea=area=>{
    if(area===requestedArea)return;requestedArea=area;clearTimeout(areaTimer);
    areaTimer=setTimeout(()=>{model.setArea(area);updateTheme();},800);
  };
  updateTheme();
})(typeof window!=='undefined'?window:globalThis);
