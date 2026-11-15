/* No remote scripts, trackers, or services. Metadata is in data/gallery.js. */
(() => {
  'use strict';
  const data = window.GALLERY_DATA;
  const $ = id => document.getElementById(id);
  const stories = new Map(data.stories.map(s => [s.id, s]));
  // A filename is a single file, never a URL or a path outside its collection.
  const validFile = name => typeof name === 'string' && /^[^/\\\x00-\x1f]+\.(png|jpe?g|webp|gif|avif)$/i.test(name) && name !== '..';
  const items = data.illustrations.filter(i => !i.example && stories.has(i.story) && validFile(i.filename) && /^[a-z0-9-]+$/.test(i.story));
  const path = (item, thumbnail = false) => `${thumbnail ? 'thumbnails' : 'images'}/${encodeURIComponent(item.story)}/${encodeURIComponent(thumbnail ? item.thumbnail : item.filename)}`;
  const direct = item => new URL(path(item), data.siteUrl).href;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const embed = item => `<img src="${escape(direct(item))}" alt="${escape(item.alt || item.description || item.title)}">`;
  // Exposed for small, dependency-free regression checks.
  window.GalleryHelpers = {validFile, path, direct, escape, embed};
  let selected = 'all', active = null, lastTrigger = null, toastTimer;
  const element = (tag, className, text) => {const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node;};
  const count = id => items.filter(i => i.story === id).length;
  const symbols = ['✧','☾','✦','♜','◇','☼','❋','✎','∞','♛','◈'];
  data.stories.forEach(story => {const option = element('option', '', story.title); option.value = story.id; $('story-filter').append(option);});
  const navStories = [{id:'all',title:'All collections'}, ...data.stories];
  const navButtons = navStories.map(story => {
    const button = element('button'); button.type = 'button'; button.append(element('span','',story.title), element('span','count',story.id === 'all' ? data.stories.length : count(story.id)));
    button.addEventListener('click', () => choose(story.id)); $('collections').append(button); return {id:story.id,button};
  });
  function choose(id) {
    selected = stories.has(id) ? id : 'all';
    $('story-filter').value = selected;
    const hash = selected === 'all' ? '#archive' : `#story=${encodeURIComponent(selected)}`;
    if (location.hash !== hash) history.replaceState(null, '', hash);
    render();
  }
  function placeholder(story, index) {
    const card = element('article','card collection-card');
    const button = element('button','card-trigger'); button.type='button'; button.setAttribute('aria-label',`Browse ${story.title}`);
    const art = element('div','art'); art.style.setProperty('--hue', String(170 + index * 17)); art.setAttribute('aria-hidden','true');
    const total = count(story.id);
    art.append(element('span','sigil',symbols[index % symbols.length]),element('span','soon',total ? 'Explore the collection' : 'Awaiting illustrations'));
    const meta = element('div','card-meta'); meta.append(element('span','',`Universe ${String(index+1).padStart(2,'0')}`),element('span','',`${total} illustration${total===1?'':'s'}`));
    button.append(art,meta,element('h4','',story.title),element('p','',total ? 'Step into this illustrated world.' : 'A story waiting to be illustrated.'));
    button.addEventListener('click',()=>{choose(story.id); $('view-title').setAttribute('tabindex','-1'); $('view-title').focus({preventScroll:true});});
    card.append(button); return card;
  }
  function illustration(item) {
    const card = element('article','card');
    const button = element('button','card-trigger'); button.type='button'; button.setAttribute('aria-label',`View ${item.title}`);
    const art = element('div','art');
    if(validFile(item.thumbnail)) {
      const img = element('img'); img.src = path(item,true); img.alt = item.alt || item.description || item.title; img.loading='lazy'; img.decoding='async';
      img.addEventListener('load',()=>art.classList.add('loaded'));
      img.addEventListener('error',()=>{img.remove(); art.append(element('span','soon','Preview unavailable'));}); art.append(img);
    } else art.append(element('span','soon','Open full illustration'));
    const meta = element('div','card-meta'); meta.append(element('span','',stories.get(item.story).title));
    if(item.chapter !== undefined && item.chapter !== '') meta.append(element('span','',`Ch. ${item.chapter}`));
    button.append(art,meta,element('h4','',item.title),element('p','',item.description || 'View illustration'));
    button.addEventListener('click',()=>open(item,button)); card.append(button); return card;
  }
  function render() {
    navButtons.forEach(({id,button})=>button.setAttribute('aria-pressed',String(id===selected)));
    const query = $('search').value.trim().toLocaleLowerCase();
    const results = items.filter(i=>(selected==='all'||i.story===selected)&&String(i.title).toLocaleLowerCase().includes(query));
    $('view-title').textContent = selected==='all' ? 'All collections' : stories.get(selected).title;
    $('gallery').replaceChildren();
    if(selected==='all' && !query) data.stories.forEach((story,index)=>$('gallery').append(placeholder(story,index)));
    else if(selected==='all' && query) data.stories.forEach(story=>{
      const group = results.filter(i=>i.story===story.id);
      if(group.length) {const heading=element('h4','story-divider',story.title); $('gallery').append(heading); group.forEach(i=>$('gallery').append(illustration(i)));}
    });
    else results.forEach(i=>$('gallery').append(illustration(i)));
    // Empty collections are navigation, not fake illustrations. Never match them to artwork searches.
    if(!query && selected!=='all') data.stories.forEach((story,index)=>{if(selected===story.id&&count(story.id)===0) $('gallery').append(placeholder(story,index));});
    const collections = !query ? data.stories.filter(s=>(selected==='all'||selected===s.id)&&!count(s.id)).length : 0;
    $('result-count').textContent = `${results.length} illustration${results.length===1?'':'s'}${collections ? ` · ${collections} awaiting art` : ''}`;
    $('empty').hidden = $('gallery').children.length > 0;
  }
  function open(item,trigger) {
    active=item; lastTrigger=trigger;
    $('viewer-title').textContent=item.title;
    $('viewer-story').textContent=stories.get(item.story).title;
    $('viewer-chapter').textContent=item.chapter !== undefined && item.chapter !== '' ? `Chapter ${item.chapter}` : '';
    $('viewer-description').textContent=item.description || '';
    $('full-image').alt=item.alt || item.description || item.title;
    $('full-image').src=path(item);
    $('original').href=path(item); $('direct-url').value=direct(item);
    $('viewer').showModal(); $('close-viewer').focus();
  }
  $('full-image').addEventListener('error',()=>{$('full-image').alt='The original image could not load. Check its filename and upload folder.';});
  $('viewer').addEventListener('close',()=>{$('full-image').removeAttribute('src'); active=null; if(lastTrigger?.isConnected) lastTrigger.focus();});
  $('close-viewer').addEventListener('click',()=>$('viewer').close());
  // Native dialogs provide Escape, keyboard focus containment, and inert background content.
  [$('viewer'),$('copy-fallback')].forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close();}}));
  async function copy(value) {
    try {await navigator.clipboard.writeText(value); $('toast').textContent='Copied to clipboard'; clearTimeout(toastTimer); toastTimer=setTimeout(()=>{$('toast').textContent='';},3000);}
    catch {$('copy-text').value=value; $('copy-fallback').showModal(); $('copy-text').focus(); $('copy-text').select();}
  }
  $('copy-url').addEventListener('click',()=>{if(active) copy(direct(active));});
  $('copy-html').addEventListener('click',()=>{if(active) copy(embed(active));});
  $('close-copy').addEventListener('click',()=>$('copy-fallback').close());
  $('search').addEventListener('input',render);
  $('story-filter').addEventListener('change',event=>choose(event.target.value));
  $('reset').addEventListener('click',()=>{$('search').value=''; choose('all');});
  function fromHash(){let id='all'; try{if(location.hash.startsWith('#story=')) id=decodeURIComponent(location.hash.slice(7));}catch{} selected=stories.has(id)?id:'all'; $('story-filter').value=selected; render();}
  window.addEventListener('hashchange',fromHash); fromHash();
})();
