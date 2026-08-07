const KEY="mbsc_v1";
const fallback={profile:{name:"MBSC SOLUTIONS",wa:"7093334820",phone1:"7093334820",phone2:"9491874820"},services:[]};
const data=JSON.parse(localStorage.getItem(KEY)||"null")||fallback;
const p=data.profile||fallback.profile;
document.title=p.name;
document.querySelectorAll("#businessName,#heroName,#footerName").forEach(e=>e.textContent=p.name);
function waLink(service="General Enquiry"){const msg=`Hello ${p.name}, I need details about ${service}.`;return `https://wa.me/${p.wa}?text=${encodeURIComponent(msg)}`}
["topWhatsApp","heroWhatsApp","bottomWhatsApp"].forEach(id=>document.getElementById(id).href=waLink());
const grid=document.getElementById("serviceGrid"), box=document.getElementById("documentBox");
grid.innerHTML=(data.services||[]).map((s,i)=>`<article class="service"><h3>${escapeHtml(s.name)}</h3><p>Click below for details and required documents.</p><button class="primary" onclick="showDocs(${i})">View & WhatsApp</button></article>`).join("");
window.showDocs=function(i){const s=data.services[i];box.innerHTML=`<p class="eyebrow">REQUIREMENTS</p><h3>${escapeHtml(s.name)}</h3><ul>${s.docs.map(d=>`<li>${escapeHtml(d)}</li>`).join("")}</ul><a class="primary" target="_blank" href="${waLink(s.name)}">WhatsApp for ${escapeHtml(s.name)}</a>`;box.scrollIntoView({behavior:"smooth",block:"center"})}
function escapeHtml(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
