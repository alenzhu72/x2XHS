function findEditor(){return document.querySelector('textarea, [contenteditable="true"], input[placeholder*="标题"], input[placeholder*="标题"]')}
function captureX(){
  const articles=[...document.querySelectorAll('article')];
  const main=articles[0]||document.querySelector('main');
  const texts=[...document.querySelectorAll('[data-testid="tweetText"], article div[lang], main div[lang]')]
    .map(x=>x.innerText.trim()).filter(Boolean);
  const unique=[...new Set(texts)];
  const title=main?.querySelector('h1')?.innerText||document.title.replace(/\s*\|.*$/,'');
  const images=[...document.querySelectorAll('article img, main img')].map(x=>x.src).filter(x=>x&&!x.includes('profile_images')).filter((x,i,a)=>a.indexOf(x)===i);
  return {title,text:unique.join('\n\n'),images,url:location.href};
}
function fill(data){let obj;try{obj=JSON.parse(data)}catch{obj={caption:data}};const editor=findEditor();if(!editor)return false;const value=obj.title?`${obj.title}\n\n${obj.caption||''}`:obj.caption||'';if(editor.tagName==='TEXTAREA'||editor.tagName==='INPUT'){const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set||Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set;setter?.call(editor,value)}else{editor.focus();document.execCommand('insertText',false,value)}editor.dispatchEvent(new Event('input',{bubbles:true}));return true}
chrome.runtime.onMessage.addListener((msg,_,send)=>{if(msg.type==='X2XHS_FILL')send({ok:fill(msg.payload)});if(msg.type==='X2XHS_CAPTURE')send(captureX());return true});
