(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const l of c.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function s(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(n){if(n.ep)return;n.ep=!0;const c=s(n);fetch(n.href,c)}})();const o={session:null,customerType:"NATURAL",coreUserId:null,accounts:[],transactions:[],batches:[],charges:[],companyAccount:null},a=t=>document.querySelector(t),m=t=>Array.from(document.querySelectorAll(t));function p(t){const e=Number(t||0);return new Intl.NumberFormat("es-EC",{style:"currency",currency:"USD"}).format(e)}function f(t){if(!t)return"Sin fecha";const e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("es-EC",{dateStyle:"medium",timeStyle:"short"}).format(e)}function g(t){const e=String(t||"").toUpperCase();return["ACTIVO","COMPLETADA","SUCCESS","PROCESADO","APROBADO"].some(s=>e.includes(s))?"is-success":["ERROR","RECHAZ","FALL","BLOQUEADO","INACTIVO"].some(s=>e.includes(s))?"is-danger":"is-neutral"}function $(t){const e=String(t||"N/D");return e.length>4?`**** ${e.slice(-4)}`:e}function C(){var e;const t=o.accounts.find(s=>s.isFavorite);return(t==null?void 0:t.accountNumber)||((e=o.accounts[0])==null?void 0:e.accountNumber)||null}function S(t){return String(t||"").toUpperCase().includes("CREDITO")?"is-credit":"is-debit"}function I(t){const e=String(t||"N/D");return e.length>14?`${e.slice(0,8)}...${e.slice(-4)}`:e}function i(t){return String(t??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function u(t,e,s=""){t.textContent=e||"",t.classList.toggle("is-error",s==="error"),t.classList.toggle("is-success",s==="success")}async function d(t,e={}){const s=await fetch(t,e),c=(s.headers.get("content-type")||"").includes("application/json")?await s.json():await s.text();if(!s.ok){const l=typeof c=="object"?c.error||c.detail||c.message:c;throw new Error(l||`Error HTTP ${s.status}`)}return c}async function L(t,e){const s=await fetch(t);if(!s.ok){const l=await s.text();throw new Error(l||`Error HTTP ${s.status}`)}const r=await s.blob(),n=URL.createObjectURL(r),c=document.createElement("a");c.href=n,c.download=e,document.body.appendChild(c),c.click(),c.remove(),URL.revokeObjectURL(n)}async function D(){try{const t=await d("/api/core/core/v1/auth/test-data");o.coreUserId=t.coreUserId||1,a("#coreStatus").textContent="Core conectado"}catch{o.coreUserId=1,a("#coreStatus").textContent="Core sin conexion"}try{await d("/api/switch/api/switch/health"),a("#switchStatus").textContent="Switch conectado"}catch{a("#switchStatus").textContent="Switch sin conexion"}}async function N(t){t.preventDefault();const e=a("#loginMessage");u(e,"Validando credenciales en Core...");const s=new FormData(t.currentTarget);try{const r=await d("/api/core/core/v1/auth/customers/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:s.get("username"),password:s.get("password")})}),n=r.customerType;if(!n)throw new Error("Core no devolvio el tipo de cliente. Reinicia el servicio Core para cargar los cambios.");o.session=r,o.customerType=n,localStorage.setItem("banquitoSession",JSON.stringify({session:r,customerType:n})),u(e,"Ingreso correcto.","success"),w(),await v()}catch(r){u(e,r.message||"No se pudo iniciar sesion.","error")}}function w(){var s,r,n,c,l;a('[data-view="login"]').classList.add("is-hidden"),a('[data-view="dashboard"]').classList.remove("is-hidden");const t=o.customerType==="JURIDICO";a("#sessionType").textContent=t?"Cliente juridico":"Cliente natural",a("#sessionName").textContent=((s=o.session)==null?void 0:s.customerName)||((r=o.session)==null?void 0:r.username)||"Dashboard",a("#sessionMeta").textContent=`${((n=o.session)==null?void 0:n.identificationType)||"ID"} ${((c=o.session)==null?void 0:c.identification)||""}`.trim(),a("#sidebarType").textContent=t?"Perfil juridico":"Perfil natural",m(".company-only").forEach(h=>h.classList.toggle("is-hidden",!t)),m(".natural-only").forEach(h=>h.classList.toggle("is-hidden",t));const e=(l=a(".nav-item.is-active"))==null?void 0:l.dataset.section;!t&&["payments","reports"].includes(e)&&y("overview"),E()}function A(){o.session=null,o.accounts=[],o.transactions=[],o.batches=[],o.charges=[],localStorage.removeItem("banquitoSession"),a("#loginForm").reset(),y("overview"),a('[data-view="dashboard"]').classList.add("is-hidden"),a('[data-view="login"]').classList.remove("is-hidden")}function O(){var e;const t=localStorage.getItem("banquitoSession");if(t)try{const s=JSON.parse(t);o.session=s.session,o.customerType=s.customerType||((e=s.session)==null?void 0:e.customerType)||"NATURAL",w(),v()}catch{localStorage.removeItem("banquitoSession")}}function y(t){!(o.customerType==="JURIDICO")&&["payments","reports"].includes(t)&&(t="overview"),m(".nav-item").forEach(s=>s.classList.toggle("is-active",s.dataset.section===t)),m("[data-section-panel]").forEach(s=>{s.classList.toggle("is-hidden",s.dataset.sectionPanel!==t)})}function E(){if(!o.session)return;const t=o.session;a("#profileName").textContent=t.customerName||"Informacion del cliente",a("#profileDetails").innerHTML=[["Tipo",o.customerType==="JURIDICO"?"Juridico":"Natural"],["Identificacion",`${t.identificationType||"N/D"} ${t.identification||""}`.trim()],["Usuario",t.username],["Correo",t.email],["Telefono",t.mobilePhone],["Direccion",t.address],["Estado credencial",t.status],["Ultimo ingreso",f(t.lastLogin)]].map(([e,s])=>`
      <div>
        <dt>${i(e)}</dt>
        <dd>${i(s||"N/D")}</dd>
      </div>
    `).join("")}async function U(){var t;if((t=o.session)!=null&&t.customerId){try{o.accounts=await d(`/api/core/core/v1/accounts/customer/${o.session.customerId}`,{headers:{"X-Core-User-Id":String(o.coreUserId||1)}})}catch(e){o.accounts=[],a("#accountsList").innerHTML=`<div class="empty-state">${i(e.message)}</div>`}M()}}async function x(){var t;if((t=o.session)!=null&&t.customerId){try{o.transactions=await d(`/api/core/core/v1/accounts/customer/${o.session.customerId}/transactions`,{headers:{"X-Core-User-Id":String(o.coreUserId||1)}})}catch(e){o.transactions=[],a("#transactionsTable").innerHTML=`<div class="empty-state">${i(e.message)}</div>`}R()}}function M(){a("#accountsMetric").textContent=o.accounts.length;const t=o.accounts.reduce((s,r)=>s+Number(r.availableBalance||0),0);a("#balanceMetric").textContent=p(t);const e=a("#accountsList");if(!o.accounts.length){e.innerHTML='<div class="empty-state">No hay cuentas disponibles para este cliente.</div>';return}e.innerHTML=o.accounts.map(s=>`
      <article class="account-card">
        <span>${i(s.accountSubtypeDescription||"Cuenta")}</span>
        <strong>${i(s.accountNumber||"Sin numero")}</strong>
        <dl>
          <div>
            <dt>Disponible</dt>
            <dd>${p(s.availableBalance)}</dd>
          </div>
          <div>
            <dt>Contable</dt>
            <dd>${p(s.accountingBalance)}</dd>
          </div>
          <div>
            <dt>Estado</dt>
            <dd><span class="badge ${g(s.status)}">${i(s.status||"N/D")}</span></dd>
          </div>
          <div>
            <dt>Agencia</dt>
            <dd>${i(s.branchName||"N/D")}</dd>
          </div>
        </dl>
      </article>
    `).join("")}function R(){a("#transactionsMetric").textContent=o.transactions.length;const t=a("#recentTransactions"),e=a("#transactionsTable");if(!o.transactions.length){const n='<div class="empty-state">Sin transacciones registradas.</div>';t.innerHTML=n,e.innerHTML=n;return}const r=`
    <table>
      <thead>
        <tr>
          <th>Cuenta</th>
          <th>Movimiento</th>
          <th>Monto</th>
          <th>Saldo resultante</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Descripcion</th>
          <th>UUID</th>
        </tr>
      </thead>
      <tbody>${o.transactions.map(n=>`
    <tr>
      <td>${i(n.accountNumber||"N/D")}</td>
      <td><span class="badge ${S(n.movementType)}">${i(n.movementType||"N/D")}</span></td>
      <td>${p(n.amount)}</td>
      <td>${p(n.resultingBalance)}</td>
      <td><span class="badge ${g(n.status)}">${i(n.status||"N/D")}</span></td>
      <td>${f(n.transactionDate)}</td>
      <td>${i(n.message||"N/D")}</td>
      <td><span title="${i(n.transactionUuid||"N/D")}">${i(I(n.transactionUuid))}</span></td>
    </tr>
  `).join("")}</tbody>
    </table>
  `;e.innerHTML=r,t.innerHTML=r}async function T(){if(o.customerType==="JURIDICO"){try{o.batches=await d("/api/switch/api/payment-batch")}catch(t){o.batches=[],a("#batchesTable").innerHTML=`<div class="empty-state">${i(t.message)}</div>`}B()}}async function P(){if(o.customerType==="JURIDICO"){try{const t=await d("/api/switch/api/billing/charges");o.charges=t.cargos||[]}catch{o.charges=[]}a("#chargesMetric").textContent=o.charges.length}}async function H(){if(o.customerType!=="JURIDICO")return;try{const e=await d("/api/switch/api/billing/empresa-account");o.companyAccount=e.cuentaEmpresa||null}catch{o.companyAccount=C()}o.companyAccount||(o.companyAccount=C());const t=$(o.companyAccount);a("#companyAccountMetric").textContent=t,a("#companyAccountHero").textContent=t}function B(){a("#batchesMetric").textContent=o.batches.length;const t=a("#batchesTable"),e=a("#recentBatches");if(!o.batches.length){const n='<div class="empty-state">Sin lotes cargados todavia.</div>';t.innerHTML=n,e.innerHTML=n;return}const r=`
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Archivo</th>
          <th>RUC</th>
          <th>Estado</th>
          <th>Registros</th>
          <th>Monto</th>
          <th>Recibido</th>
          <th>Accion</th>
        </tr>
      </thead>
      <tbody>${o.batches.slice().sort((n,c)=>(c.id||0)-(n.id||0)).map(n=>`
      <tr>
        <td>${i(n.id||"N/D")}</td>
        <td>${i(n.fileName||"Archivo CSV")}</td>
        <td>${i(n.ruc||"N/D")}</td>
        <td><span class="badge ${g(n.status)}">${i(n.status||"N/D")}</span></td>
        <td>${i(n.headerTotalRecords||0)}</td>
        <td>${p(n.headerTotalAmount)}</td>
        <td>${f(n.receivedAt)}</td>
        <td><button class="secondary-button" data-process="${i(n.id)}" type="button">Procesar</button></td>
      </tr>
    `).join("")}</tbody>
    </table>
  `;t.innerHTML=r,e.innerHTML=r}async function J(t){t.preventDefault();const e=a("#uploadMessage");if(o.customerType!=="JURIDICO"){u(e,"Solo clientes juridicos pueden enviar pagos masivos.","error");return}const s=a("#csvFile").files[0];if(!s){u(e,"Selecciona un archivo CSV.","error");return}const r=new FormData;r.append("file",s),r.append("channel","WEB"),u(e,"Enviando archivo al Switch...");try{const n=await d("/api/switch/api/payment-batch/upload-csv",{method:"POST",body:r});u(e,`Resultado: ${n.validationResult||"procesado"} | Estado: ${n.batchStatus||"N/D"}`,"success"),await b()}catch(n){u(e,n.message||"No se pudo cargar el CSV.","error")}}async function F(t){if(o.customerType==="JURIDICO")try{const e=await d(`/api/switch/api/payment-processor/process/${t}`,{method:"POST"});a("#reportOutput").textContent=typeof e=="string"?e:JSON.stringify(e,null,2),await b()}catch(e){a("#reportOutput").textContent=e.message}}async function j(t){const e=a("#batchIdInput").value.trim();if(!e){a("#reportOutput").textContent="Ingresa el ID del lote.";return}const s={summary:`/api/switch/api/billing/batches/${e}/summary`,detail:`/api/switch/api/billing/batches/${e}/detail`,history:`/api/switch/api/billing/batches/${e}/history`,charge:`/api/switch/api/billing/batches/${e}/charge`,receipt:`/api/switch/api/billing/batches/${e}/receipt`};try{const r=await d(s[t]);a("#reportOutput").textContent=JSON.stringify(r,null,2)}catch(r){a("#reportOutput").textContent=r.message}}async function q(t){const e=a("#batchIdInput").value.trim();if(!e){a("#reportOutput").textContent="Ingresa el ID del lote.";return}const s={"receipt-pdf":`/api/switch/api/payment-batch/${e}/receipt`,"billing-novelties":`/api/switch/api/billing/batches/${e}/novelties`},r={"receipt-pdf":`recibo_lote_${e}.pdf`,"billing-novelties":`novedades_${e}.csv`};try{await L(s[t],r[t]),a("#reportOutput").textContent=`Descarga generada: ${r[t]}`}catch(n){a("#reportOutput").textContent=n.message}}async function b(){o.customerType==="JURIDICO"&&await Promise.all([T(),P(),H()])}async function v(){await Promise.all([U(),x(),b()])}function k(){a("#loginForm").addEventListener("submit",N),a("#logoutButton").addEventListener("click",A),a("#refreshButton").addEventListener("click",v),a("#globalSearch").addEventListener("input",t=>V(t.target.value)),a("#uploadForm").addEventListener("submit",J),a("#loadBatchesButton").addEventListener("click",T),a("#csvFile").addEventListener("change",t=>{var e;a("#fileName").textContent=((e=t.target.files[0])==null?void 0:e.name)||"Seleccionar CSV"}),m(".nav-item").forEach(t=>{t.addEventListener("click",()=>y(t.dataset.section))}),document.addEventListener("click",t=>{const e=t.target.closest("[data-process]");e&&F(e.dataset.process);const s=t.target.closest("[data-report]");s&&j(s.dataset.report);const r=t.target.closest("[data-download]");r&&q(r.dataset.download)})}function V(t){const e=t.trim().toLowerCase();document.querySelectorAll("tbody tr, .account-card").forEach(s=>{const r=!e||s.textContent.toLowerCase().includes(e);s.classList.toggle("is-filtered",!r)})}k();D();O();
