function showDocs(service,docs){
  const box=document.getElementById("documentBox");
  const number="917093334820";
  const message=`Hello MBSC SOLUTIONS, I need details about ${service}.`;
  box.innerHTML=`
    <p class="eyebrow">REQUIREMENTS</p>
    <h3>${service}</h3>
    <ul>${docs.map(d=>`<li>${d}</li>`).join("")}</ul>
    <a class="primary" target="_blank" href="https://wa.me/${number}?text=${encodeURIComponent(message)}">WhatsApp for ${service}</a>`;
  box.scrollIntoView({behavior:"smooth",block:"center"});
}