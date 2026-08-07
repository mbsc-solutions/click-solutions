const KEY="mbsc_v1";

const DEFAULT_SERVICES=[
{name:"Tractor Loans",docs:["Aadhaar Card","PAN Card","Address Proof","Bank Statement","Land / income related documents"]},
{name:"Agri SME Loans",docs:["Aadhaar Card","PAN Card","Business / income proof","Bank Statement","Address Proof"]},
{name:"Construction Equipment Loans",docs:["Aadhaar Card","PAN Card","Quotation / equipment details","Bank Statement","Income / business proof"]},
{name:"Business Loans",docs:["Aadhaar Card","PAN Card","Business proof","Bank Statement","Income / financial documents"]},
{name:"Gold Loans",docs:["Aadhaar Card","PAN Card","Gold ornaments","Address / KYC documents"]},
{name:"Commercial Vehicle Loans",docs:["Aadhaar Card","PAN Card","Vehicle quotation","Address Proof","Income / business proof"]},
{name:"Home Loans",docs:["Aadhaar Card","PAN Card","Income proof","Bank Statement","Property documents"]},
{name:"Auto & Car Loans",docs:["Aadhaar Card","PAN Card","Vehicle quotation","Address Proof","Income proof"]},
{name:"Bike Loans",docs:["Aadhaar Card","PAN Card","Vehicle quotation","Address Proof"]},
{name:"Credit Cards",docs:["Aadhaar Card","PAN Card","Income proof","Bank Statement / salary proof"]},
{name:"PF Services",docs:["Aadhaar Card","PAN Card","UAN / PF details","Bank account details"]},
{name:"ITR Filing",docs:["PAN Card","Aadhaar Card","Bank details","Form 16 / income details","Investment / capital-gain statements, if applicable"]},
{name:"AEPS & Banking Services",docs:["Aadhaar Card","Registered mobile number","Bank account details, where required"]},
{name:"Bill Payments & Recharge",docs:["Customer / bill details","Registered mobile number"]},
{name:"Other Services",docs:["Please contact us for the service-specific checklist"]}
];

const DEFAULT_PROFILE={name:"MBSC SOLUTIONS",wa:"7093334820",phone1:"7093334820",phone2:"9491874820"};

let stored=null;
try{stored=JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){stored=null}

const data=stored||{profile:DEFAULT_PROFILE,services:DEFAULT_SERVICES};
const p=data.profile||DEFAULT_PROFILE;

if(!Array.isArray(data.services)||data.services.length===0){
  data.services=DEFAULT_SERVICES;
  try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}
}

document.title=p.name;
document.querySelectorAll("#businessName,#heroName,#footerName").forEach(e=>e.textContent=p.name);

function waLink(service="General Enquiry"){
  const msg=`Hello ${p.name}, I need details about ${service}.`;
  return `https://wa.me/${p.wa}?text=${encodeURIComponent(msg)}`;
}

["topWhatsApp","heroWhatsApp","bottomWhatsApp"].forEach(id=>{
  const e=document.getElementById(id);
  if(e)e.href=waLink();
});

const grid=document.getElementById("serviceGrid");
const box=document.getElementById("documentBox");

if(grid){
  grid.innerHTML=data.services.map((s,i)=>`
    <article class="service">
      <h3>${escapeHtml(s.name)}</h3>
      <p>Click below for details and required documents.</p>
      <button class="primary" onclick="showDocs(${i})">View & WhatsApp</button>
    </article>
  `).join("");
}

window.showDocs=function(i){
  const s=data.services[i];
  box.innerHTML=`
    <p class="eyebrow">REQUIREMENTS</p>
    <h3>${escapeHtml(s.name)}</h3>
    <ul>${s.docs.map(d=>`<li>${escapeHtml(d)}</li>`).join("")}</ul>
    <a class="primary" target="_blank" href="${waLink(s.name)}">WhatsApp for ${escapeHtml(s.name)}</a>`;
  box.scrollIntoView({behavior:"smooth",block:"center"});
};

function escapeHtml(s){
  return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}
