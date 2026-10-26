(function(){
let saved=null;try{saved=localStorage.getItem('alece-doc-theme')}catch(_){saved=null}
document.documentElement.dataset.theme=saved||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>{const t=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=t;try{localStorage.setItem('alece-doc-theme',t)}catch(_){}}));
const search=document.querySelector('#nav-search');if(search){search.addEventListener('input',()=>{const q=search.value.toLocaleLowerCase('pt-BR');document.querySelectorAll('.manual-nav a[data-document]').forEach(a=>{a.hidden=!a.textContent.toLocaleLowerCase('pt-BR').includes(q)})})}
})();
