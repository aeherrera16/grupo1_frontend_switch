(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();const D={session:null,customerType:"NATURAL",coreUserId:null,accounts:[],transactions:[],batches:[],paymentBatches:[],sftpBatches:[],charges:[],companyAccount:null};function u(){return D}function g(t){Object.assign(D,t)}function et(){D.session&&localStorage.setItem("banquitoSession",JSON.stringify({session:D.session,customerType:D.customerType}))}function dt(){var e;const t=localStorage.getItem("banquitoSession");if(!t)return!1;try{const s=JSON.parse(t);return D.session=s.session,D.customerType=s.customerType||((e=s.session)==null?void 0:e.customerType)||"NATURAL",!0}catch{return localStorage.removeItem("banquitoSession"),!1}}async function y(t,e={}){const s=await fetch(t,e),a=(s.headers.get("content-type")||"").includes("application/json")?await s.json():await s.text();if(!s.ok){const c=typeof a=="object"?a.error||a.detail||a.message:a;throw new Error(c||`Error HTTP ${s.status}`)}return a}async function ut(t,e){const s=await fetch(t);if(!s.ok){const c=await s.text();throw new Error(c||`Error HTTP ${s.status}`)}const o=await s.blob(),n=URL.createObjectURL(o),a=document.createElement("a");a.href=n,a.download=e,document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(n)}async function pt(){try{return await y("/api/core/v1/health"),{coreUserId:1,coreStatus:"Banca disponible",switchStatus:null}}catch{return{coreUserId:1,coreStatus:"Banca no disponible",switchStatus:null}}}async function mt(){try{return await y("/api/switch/v1/switch/health"),"Pagos disponibles"}catch{return"Pagos no disponibles"}}async function ft(t,e){return y("/api/core/v1/auth/customers/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,password:e})})}async function ht(t,e,s){return y("/api/core/v1/auth/customers/change-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,currentPassword:e,newPassword:s})})}async function gt(t,e){return y(`/api/core/v1/accounts/customer/${t}`,{headers:{"X-Core-User-Id":String(e)}})}async function vt(t,e){return y(`/api/core/v1/accounts/customer/${t}/transactions`,{headers:{"X-Core-User-Id":String(e)}})}async function yt(){var o;const e=(o=u().session)==null?void 0:o.identification,s=e?`/api/switch/v1/payment-batch?ruc=${encodeURIComponent(e)}`:"/api/switch/v1/payment-batch";return y(s)}async function St(){return(await y("/api/switch/v1/billing/charges")).cargos||[]}async function bt(t){return(await y(`/api/switch/v1/billing/batches/${t}/detail`)).detalles||[]}async function Ct(){return(await y("/api/switch/v1/billing/empresa-account")).cuentaEmpresa||null}async function $t(t){const e=new FormData;e.append("file",t),e.append("channel","PORTAL");const o=u().session;return o&&o.identification&&e.append("ruc",o.identification),y("/api/switch/v1/payment-batch/upload-csv",{method:"POST",body:e})}async function Et(t){return y(`/api/switch/v1/payment-batch/${t}/process`,{method:"POST"})}async function Tt(t,e){const s={summary:`/api/switch/v1/billing/batches/${e}/summary`,detail:`/api/switch/v1/billing/batches/${e}/detail`,history:`/api/switch/v1/billing/batches/${e}/history`,charge:`/api/switch/v1/billing/batches/${e}/charge`,receipt:`/api/switch/v1/billing/batches/${e}/receipt`};return y(s[t])}async function Dt(t,e){const s={"receipt-pdf":`/api/switch/v1/payment-batch/${e}/receipt`,"billing-novelties":`/api/switch/v1/billing/batches/${e}/novelties`},o={"receipt-pdf":`recibo_lote_${e}.pdf`,"billing-novelties":`novedades_${e}.csv`};return await ut(s[t],o[t]),o[t]}async function wt(t){var n;const s=((n=u().session)==null?void 0:n.identification)||"",o=t.includes(":")&&t.split(":").length===2?t+":00":t;return y(`/api/switch/v1/payment-batch/schedule-queued?scheduledDate=${encodeURIComponent(o)}&ruc=${encodeURIComponent(s)}`,{method:"POST"})}function S(t){const e=Number(t||0);return new Intl.NumberFormat("es-EC",{style:"currency",currency:"USD"}).format(e)}function $(t){if(!t)return"Sin fecha";const e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("es-EC",{dateStyle:"medium",timeStyle:"short"}).format(e)}function w(t){const e=String(t||"").toUpperCase();return["ACTIVO","COMPLETADA","SUCCESS","EXITO","PROCESADO","APROBADO"].some(s=>e.includes(s))?"is-success":["ERROR","RECHAZ","REJECT","FALL","BLOQUEADO","INACTIVO"].some(s=>e.includes(s))?"is-danger":"is-neutral"}function At(t){const e=String(t||"N/D");return e.length>4?`**** ${e.slice(-4)}`:e}function Rt(t){return String(t||"").toUpperCase().includes("CREDITO")?"is-credit":"is-debit"}function r(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function p(t,e,s=""){t.textContent=e||"",t.classList.toggle("is-error",s==="error"),t.classList.toggle("is-success",s==="success")}const R=t=>document.querySelector(t);async function Nt(){var e;const t=u();if((e=t.session)!=null&&e.customerId){try{const s=await gt(t.session.customerId,t.coreUserId||1);g({accounts:s})}catch(s){g({accounts:[]}),R("#accountsTable").innerHTML=`<div class="empty-state">${r(s.message)}</div>`}Lt()}}function Lt(){const t=u();R("#accountsMetric").textContent=t.accounts.length;const e=t.accounts.reduce((n,a)=>n+Number(a.availableBalance||0),0);R("#balanceMetric").textContent=S(e),It();const s=R("#accountsTable");if(!s)return;if(!t.accounts.length){s.innerHTML='<div class="empty-state">No hay cuentas disponibles para este cliente.</div>';return}const o=t.accounts.map(n=>`
      <tr>
        <td><strong>${r(n.accountNumber||"Sin numero")}</strong></td>
        <td>${r(n.accountSubtypeDescription||"Cuenta")}</td>
        <td>${S(n.accountingBalance)}</td>
        <td><strong class="amount-highlight" style="color: #02745c; font-size: 15px;">${S(n.availableBalance)}</strong></td>
        <td><span class="badge ${w(n.status)}">${r(n.status||"N/D")}</span></td>
        <td>${r(n.branchName||"N/D")}</td>
        <td>${n.openingDate?r(String(n.openingDate).split("T")[0]):"N/D"}</td>
      </tr>
    `).join("");s.innerHTML=`
    <table>
      <thead>
        <tr>
          <th>Número de Cuenta</th>
          <th>Tipo de Cuenta</th>
          <th>Saldo Contable</th>
          <th>Saldo Disponible</th>
          <th>Estado</th>
          <th>Agencia</th>
          <th>Fecha de Apertura</th>
        </tr>
      </thead>
      <tbody>${o}</tbody>
    </table>
  `}function It(){const t=u(),e=R("#dashboardAccounts");if(e){if(!t.accounts.length){e.innerHTML='<div class="empty-state">No hay cuentas disponibles para este cliente.</div>';return}e.innerHTML=t.accounts.slice(0,3).map(s=>`
      <article class="dashboard-account-card">
        <span>${r(s.accountSubtypeDescription||"Cuenta")}</span>
        <strong>${r(s.accountNumber||"Sin numero")}</strong>
        <div>
          <small>Disponible</small>
          <b>${S(s.availableBalance)}</b>
        </div>
        <em class="badge ${w(s.status)}">${r(s.status||"N/D")}</em>
      </article>
    `).join("")}}const m=t=>document.querySelector(t),M=t=>Array.from(document.querySelectorAll(t));async function Ot(t){t.preventDefault();const e=m("#loginMessage");p(e,"Validando credenciales...");const s=new FormData(t.currentTarget),o=s.get("username"),n=s.get("password");try{const a=await ft(o,n);if(a.passwordChangeRequired){p(e,"Cambio de contraseña requerido.","success"),Bt(o,n);return}const c=a.customerType;if(!c)throw new Error("No se pudo identificar el tipo de cliente. Intenta nuevamente en unos minutos.");g({session:a,customerType:c}),et(),p(e,"Ingreso correcto.","success"),V(),await x()}catch(a){p(e,a.message||"No se pudo iniciar sesion.","error")}}function Bt(t,e){m('[data-view="login"]').classList.add("is-hidden"),m('[data-view="password-change"]').classList.remove("is-hidden");const s=m("#passwordChangeForm");m("#currentPassword").value=e,s.onsubmit=async o=>{o.preventDefault();const n=m("#passwordChangeMessage"),a=m("#newPassword").value,c=m("#confirmPassword").value;if(a!==c){p(n,"Las contraseñas no coinciden.","error");return}if(a===e){p(n,"La nueva contraseña debe ser diferente a la actual.","error");return}p(n,"Actualizando contraseña...");try{const i=await ht(t,e,a),d=i.customerType;g({session:i,customerType:d}),et(),p(n,"Contraseña actualizada con éxito.","success"),m('[data-view="password-change"]').classList.add("is-hidden"),V(),await x()}catch(i){p(n,i.message||"Error al cambiar la contraseña.","error")}}}function V(){var s,o,n,a;m('[data-view="login"]').classList.add("is-hidden"),m('[data-view="password-change"]').classList.add("is-hidden"),m('[data-view="dashboard"]').classList.remove("is-hidden");const t=u(),e=t.customerType==="JURIDICO";m("#sessionType").textContent=e?"Cliente juridico":"Cliente natural",m("#sessionName").textContent=((s=t.session)==null?void 0:s.customerName)||((o=t.session)==null?void 0:o.username)||"Panel principal",m("#sessionMeta").textContent=`${((n=t.session)==null?void 0:n.identificationType)||"ID"} ${((a=t.session)==null?void 0:a.identification)||""}`.trim(),m("#sidebarType").textContent=e?"Perfil juridico":"Perfil natural",M(".company-only").forEach(c=>c.classList.toggle("is-hidden",!e)),M(".natural-only").forEach(c=>c.classList.toggle("is-hidden",e)),k("overview"),window.scrollTo({top:0,left:0,behavior:"auto"}),st()}function Pt(){const t=u();t.session=null,t.accounts=[],t.transactions=[],t.batches=[],t.charges=[],localStorage.removeItem("banquitoSession"),m("#loginForm").reset(),k("overview"),m('[data-view="dashboard"]').classList.add("is-hidden"),m('[data-view="login"]').classList.remove("is-hidden")}function k(t){!(u().customerType==="JURIDICO")&&["payments","reports","sftp"].includes(t)&&(t="overview"),M(".nav-item").forEach(o=>o.classList.toggle("is-active",o.dataset.section===t)),M("[data-section-panel]").forEach(o=>{o.classList.toggle("is-hidden",o.dataset.sectionPanel!==t)})}function st(){var v;const t=u();if(!t.session)return;const e=t.session,s=t.customerType==="JURIDICO",o=e.customerName||"Informacion del cliente",n=`${e.identificationType||"ID"} ${e.identification||""}`.trim(),a=["SUSPENDIDO","BLOQUEADO","INACTIVO","ACTIVO"],c=t.accounts||[],i=a.find(C=>c.some(A=>A.status===C))||((v=c[0])==null?void 0:v.status)||e.status||"N/D",d=i,l=i==="ACTIVO"?"is-success":i==="SUSPENDIDO"||i==="BLOQUEADO"?"is-danger":"is-neutral";m("#profileName").textContent=e.customerName||"Informacion del cliente",m("#profileDetails").innerHTML=`
    <section class="client-identity-card">
      <div class="client-avatar">${s?"CO":"CL"}</div>
      <div>
        <span>${s?"Cliente juridico":"Cliente natural"}</span>
        <strong>${r(o)}</strong>
        <small>${r(n||"Identificacion no disponible")}</small>
      </div>
      <em class="badge ${l}">${r(d)}</em>
    </section>

    <section class="bank-reference-card">
      <span>Referencia bancaria</span>
      <strong>BanQuito</strong>
      <p>Cliente verificado para consultas digitales, productos bancarios y servicios empresariales habilitados.</p>
    </section>

    <section class="profile-info-grid">
      ${[["Usuario digital",e.username],["Correo registrado",e.email],["Telefono de contacto",e.mobilePhone],["Ultimo ingreso",$(e.lastLogin)]].map(([C,A])=>`
          <div>
            <dt>${r(C)}</dt>
            <dd>${r(A||"N/D")}</dd>
          </div>
        `).join("")}
    </section>

    <section class="profile-map-card">
      <div>
        <span>Ubicacion registrada</span>
        <strong>${r(e.address||"Direccion no disponible")}</strong>
      </div>
      <div class="map-lines" aria-hidden="true"></div>
    </section>
  `}async function x(){await Nt(),st()}const T=t=>document.querySelector(t);let E={from:null,to:null};function Ut(){const t=T("#transactionsFromDate"),e=T("#transactionsToDate");E={from:(t==null?void 0:t.value)||null,to:(e==null?void 0:e.value)||null},q()}function Mt(){const t=T("#transactionsFromDate"),e=T("#transactionsToDate");t&&(t.value=""),e&&(e.value=""),E={from:null,to:null},q()}function jt(t){if(!E.from&&!E.to)return t;const e=E.from?new Date(`${E.from}T00:00:00`).getTime():null,s=E.to?new Date(`${E.to}T23:59:59.999`).getTime():null;return t.filter(o=>{const n=o.transactionDate;if(!n)return!1;const a=new Date(n).getTime();return!(Number.isNaN(a)||e!==null&&a<e||s!==null&&a>s)})}async function nt(){var e;const t=u();if((e=t.session)!=null&&e.customerId){try{const s=await vt(t.session.customerId,t.coreUserId||1);g({transactions:s})}catch(s){g({transactions:[]}),T("#transactionsTable").innerHTML=`<div class="empty-state">${r(s.message)}</div>`}q()}}function q(){const t=u(),e=jt(t.transactions||[]),s=T("#transactionsMetric");s&&(s.textContent=t.transactions.length);const o=T("#recentTransactions"),n=T("#transactionsTable");if(!e.length){const d=t.transactions.length?'<div class="empty-state">Sin movimientos en el periodo seleccionado.</div>':'<div class="empty-state">Sin transacciones registradas.</div>';n.innerHTML=d,o&&!t.transactions.length&&(o.innerHTML=d);return}const a=d=>{const l=(d||"").toUpperCase();return l==="COMPLETADA"?"Exitoso":l==="RECHAZADA"?"Rechazado":d||"N/D"},i=`
    <table>
      <thead>
        <tr>
          <th>Cuenta Origen</th>
          <th>Cuenta Destino</th>
          <th>Movimiento</th>
          <th>Monto</th>
          <th>Saldo resultante</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Descripcion</th>
        </tr>
      </thead>
      <tbody>${e.map(d=>{const l=(d.movementType||"").toUpperCase()==="DEBITO",v=d.counterpartAccountNumber||"—";return`
      <tr>
        <td>${r(l?d.accountNumber||"N/D":v)}</td>
        <td>${r(l?v:d.accountNumber||"N/D")}</td>
        <td><span class="badge ${Rt(d.movementType)}">${r(d.movementType||"N/D")}</span></td>
        <td>${S(d.amount)}</td>
        <td>${S(d.resultingBalance)}</td>
        <td><span class="badge ${w(d.status)}">${r(a(d.status))}</span></td>
        <td>${$(d.transactionDate)}</td>
        <td>${r(d.message||"N/D")}</td>
      </tr>
    `}).join("")}</tbody>
    </table>
  `;n.innerHTML=i,o&&(o.innerHTML=`<div class="table-wrap compact-table">${i}</div>`)}const F=t=>document.querySelector(t),Ht={summary:"Resumen del lote",detail:"Detalle del lote",charge:"Cargo del lote",receipt:"Comprobante del lote"},xt={id:"Referencia",fileName:"Archivo",ruc:"RUC",status:"Estado",headerTotalRecords:"Registros",headerTotalAmount:"Monto total",totalAmount:"Monto total",amount:"Monto",chargeAmount:"Valor comision",commissionAmount:"Valor comision",feeAmount:"Valor comision",totalChargeAmount:"Valor comision",chargeStatus:"Respuesta del proceso",commissionStatus:"Estado comision",chargeDate:"Fecha de cobro",receivedAt:"Recibido",createdAt:"Creado",processedAt:"Procesado",updatedAt:"Actualizado",validationResult:"Validacion",batchStatus:"Estado del lote",accountNumber:"Cuenta",description:"Descripcion",message:"Mensaje",notificationStatus:"Estado notif.",rejectionReason:"Motivo rechazo",lineNumber:"Linea",beneficiaryName:"Beneficiario",identification:"Identificacion",identificationNumber:"Identificacion",executedAt:"Ejecutado"},Ft=["fileName","ruc","status","validationResult","batchStatus","headerTotalRecords","totalRecords","processedRecords","successfulRecords","failedRecords","headerTotalAmount","totalAmount","amount","chargeAmount","receivedAt","processedAt","createdAt","message"],j=["chargeAmount","commissionAmount","feeAmount","amount","totalChargeAmount"],zt=["chargeStatus","commissionStatus","status","result"],Vt=["lineNumber","accountNumber","beneficiaryName","identification","identificationNumber","amount","status","validationResult","notificationStatus","rejectionReason","message","description","executedAt","createdAt","processedAt"],kt=new Set(["id","batchId","customerId","userId","createdBy","updatedBy","deletedBy","version","trace","stack","rawPayload","payload"]);function H(t,e){return!(e==null||e===""||Array.isArray(e)||typeof e=="object"||kt.has(t)||t.startsWith("_"))}function J(t){return xt[t]||t.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase())}function ot(t,e){if(e==null||e==="")return"N/D";const s=t.toLowerCase();return s.includes("amount")||s.includes("monto")||s.includes("balance")?S(e):s.includes("date")||s.includes("at")||s.includes("fecha")?$(e):String(e)}function qt(t){return String(t||"").trim().toUpperCase()}function P(t){return String((t==null?void 0:t.id)||(t==null?void 0:t.batchId)||(t==null?void 0:t.reference)||"")}function G(){var t,e;return((e=(t=F("#batchSelector"))==null?void 0:t.value)==null?void 0:e.trim())||""}function I(){const t=G();return u().batches.find(e=>P(e)===t)||null}function N(t,e){if(!t||typeof t!="object")return;const s=e.find(o=>t[o]!==void 0&&t[o]!==null&&t[o]!=="");return s?t[s]:void 0}function Jt(t,e){return!t||typeof t!="object"?!1:[t.batchId,t.paymentBatchId,t.loteId,t.idLote,t.reference].filter(s=>s!=null).some(s=>String(s)===String(e))}function Gt(t,e){const s=u().charges.find(o=>Jt(o,t));return s||(Array.isArray(e)?e.find(o=>N(o,j)):e&&typeof e=="object"&&N(e,j)?e:null)}function Qt(t,e){const s=Gt(t,e),o=qt(N(e,zt)),n=N(s,j)??N(e,j),a=Number(n||0)>0,c=["REJECTED","RECHAZADO","FAILED","ERROR"].some(v=>o.includes(v));if(!s&&!a&&!o)return"";const i=s||a?"Comision registrada":"Sin cargo confirmado",d=s||a?"is-success":"is-neutral",l=c&&(s||a)?"La respuesta del proceso vino rechazada, pero existe evidencia de comision registrada. No se interpreta como comision pendiente.":"Validado con la informacion operativa disponible para el lote.";return`
    <div class="charge-reconciliation">
      <div>
        <span>Estado operativo del cobro</span>
        <strong class="badge ${d}">${r(i)}</strong>
      </div>
      <div>
        <span>Valor comision</span>
        <strong>${r(S(n||0))}</strong>
      </div>
      <p>${r(l)}</p>
    </div>
  `}function at(t){return`<span class="badge ${w(t)}">${r(t||"N/D")}</span>`}function Xt(t,e){return e&&typeof e=="object"&&!Array.isArray(e)?e.status||e.batchStatus||e.validationResult||(t==null?void 0:t.status)||"Generado":(t==null?void 0:t.status)||"Generado"}function Zt(t,e,s,o){const a=u().session||{},c=new Intl.DateTimeFormat("es-EC",{dateStyle:"medium",timeStyle:"short"}).format(new Date),i=Xt(s,o),d=Ht[t]||"Reporte del lote";return`
    <article class="bank-report">
      <header class="bank-report-cover">
        <div class="bank-report-brand">
          <span>BQ</span>
          <div>
            <strong>Banco BanQuito</strong>
            <small>Informe empresarial</small>
          </div>
        </div>
        <div class="bank-report-title">
          <span>Reporte generado</span>
          <h3>${r(d)}</h3>
          <p>${r((s==null?void 0:s.fileName)||`Referencia de lote ${e}`)}</p>
        </div>
        <div class="bank-report-status">
          ${at(i)}
          <small>Emitido ${r(c)}</small>
        </div>
      </header>

      <dl class="bank-report-context">
        <div>
          <dt>Cliente</dt>
          <dd>${r(a.customerName||"Cliente juridico")}</dd>
        </div>
        <div>
          <dt>Identificacion</dt>
          <dd>${r(`${a.identificationType||"RUC"} ${a.identification||(s==null?void 0:s.ruc)||"N/D"}`.trim())}</dd>
        </div>
        <div>
          <dt>Lote consultado</dt>
          <dd>${r((s==null?void 0:s.fileName)||`Lote ${e}`)}</dd>
        </div>
        <div>
          <dt>Fecha de recepcion</dt>
          <dd>${r($(s==null?void 0:s.receivedAt))}</dd>
        </div>
      </dl>

      ${t==="charge"?Qt(e,o):""}

      <section class="bank-report-body">
        <div class="bank-report-section-title">
          <span>Contenido del informe</span>
          <strong>${r(d)}</strong>
        </div>
        ${Kt(o)}
      </section>

      <footer class="bank-report-footer">
        <span>Documento informativo generado desde Banca Web BanQuito.</span>
        <strong>Grupo 1 - Switch de pagos</strong>
      </footer>
    </article>
  `}function rt(t){const e=F("#selectedBatchPreview");if(e){if(!t){e.className="selected-batch empty-state",e.innerHTML="Carga los lotes disponibles para elegir una operacion.";return}e.className="selected-batch",e.innerHTML=`
    <div>
      <span>Archivo</span>
      <strong>${r(t.fileName||"Archivo CSV")}</strong>
    </div>
    <div>
      <span>RUC</span>
      <strong>${r(t.ruc||"N/D")}</strong>
    </div>
    <div>
      <span>Estado</span>
      ${at(t.status)}
    </div>
    <div>
      <span>Monto</span>
      <strong>${S(t.headerTotalAmount)}</strong>
    </div>
    <div>
      <span>Recibido</span>
      <strong>${r($(t.receivedAt))}</strong>
    </div>
  `}}function Q(){const t=F("#batchSelector");if(!t)return;const e=u(),s=t.value,o=e.batches.slice().sort((n,a)=>Number(a.id||a.batchId||0)-Number(n.id||n.batchId||0));t.innerHTML=['<option value="">Selecciona por archivo, RUC o fecha</option>',...o.map(n=>{const a=P(n),c=[n.fileName||"Archivo CSV",n.ruc?`RUC ${n.ruc}`:"RUC N/D",n.status||"Estado N/D",S(n.headerTotalAmount),$(n.receivedAt)].join(" - ");return`<option value="${r(a)}">${r(c)}</option>`})].join(""),s&&o.some(n=>P(n)===s)?t.value=s:o.length&&(t.value=P(o[0])),rt(I())}function _t(t){const e=Ft.filter(n=>Object.prototype.hasOwnProperty.call(t,n)).filter(n=>H(n,t[n])),s=Object.keys(t).filter(n=>!e.includes(n)).filter(n=>H(n,t[n])).slice(0,10-e.length),o=[...e,...s].map(n=>[n,t[n]]);return o.length?`
    <dl class="report-ledger">
      ${o.map(([n,a])=>`
        <div>
          <dt>${r(J(n))}</dt>
          <dd>${r(ot(n,a))}</dd>
        </div>
      `).join("")}
    </dl>
  `:""}function X(t){if(!t.length)return'<div class="empty-state">Sin registros para mostrar.</div>';const e=Vt.filter(n=>t.some(a=>H(n,a==null?void 0:a[n]))),s=Array.from(t.reduce((n,a)=>(Object.keys(a||{}).forEach(c=>{!e.includes(c)&&H(c,a[c])&&n.add(c)}),n),new Set)).slice(0,Math.max(0,10-e.length)),o=[...e,...s];return o.length?`
    <div class="table-wrap report-table">
      <table>
        <thead>
          <tr>${o.map(n=>`<th>${r(J(n))}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${t.map(n=>`
            <tr>
              ${o.map(a=>`<td>${r(ot(a,n==null?void 0:n[a]))}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `:'<div class="empty-state">El reporte no contiene campos operativos para mostrar.</div>'}function Kt(t){if(Array.isArray(t))return X(t);if(!t||typeof t!="object")return`<div class="report-note">${r(t||"Sin datos.")}</div>`;const e=Object.entries(t).filter(([,s])=>Array.isArray(s)).map(([s,o])=>`
      <section class="report-section">
        <h3>${r(J(s))}</h3>
        ${X(o)}
      </section>
    `).join("");return`${_t(t)}${e||'<div class="report-note">Sin movimientos o novedades relevantes para mostrar.</div>'}`}function b(t,e=""){const s=F("#reportOutput");s.classList.remove("is-error","is-success","is-info"),e&&s.classList.add(`is-${e}`),s.innerHTML=t}async function Wt(t){const e=G();if(!e){b('<div class="report-empty"><strong>Selecciona un lote.</strong><span>Actualiza la lista y elige por archivo, RUC o fecha antes de consultar.</span></div>',"error");return}try{b('<div class="report-empty"><strong>Consultando reporte...</strong><span>Estamos preparando la informacion del lote seleccionado.</span></div>');const s=await Tt(t,e),o=I();b(Zt(t,e,o,s))}catch(s){const o=s.message||"",n=I(),a=((n==null?void 0:n.status)||"").toUpperCase(),c=["PROCESADO","EXITOSO","PROCESSED","SUCCESS"].includes(a);if(o.includes("No service charge found")||o.includes("No hay cargo")){b(c?`
          <div class="report-empty">
            <strong>Información de cargo no disponible</strong>
            <span>El lote fue procesado pero no se generó un cargo de servicio registrado. Contacte al administrador del sistema para más detalles.</span>
          </div>
        `:`
          <div class="report-empty">
            <strong>Lote en espera de procesamiento</strong>
            <span>Este lote se encuentra en estado ${r((n==null?void 0:n.status)||"PENDIENTE")}. El reporte estará disponible automáticamente una vez que el banco procese la operación.</span>
          </div>
        `,"info");return}b(`<div class="report-empty"><strong>No se pudo consultar el reporte.</strong><span>${r(s.message)}</span></div>`,"error")}}async function Yt(t){const e=G();if(!e){b('<div class="report-empty"><strong>Selecciona un lote.</strong><span>Actualiza la lista y elige por archivo, RUC o fecha antes de descargar.</span></div>',"error");return}try{b('<div class="report-empty"><strong>Preparando descarga...</strong><span>El archivo se generara con la referencia interna del lote seleccionado.</span></div>');const s=await Dt(t,e);b(`
      <div class="download-card">
        <span>Descarga generada</span>
        <strong>${r(s)}</strong>
        <small>Operacion completada para el lote seleccionado.</small>
      </div>
    `,"success")}catch(s){const o=s.message||"",n=I(),a=((n==null?void 0:n.status)||"").toUpperCase(),c=["PROCESADO","EXITOSO","PROCESSED","SUCCESS"].includes(a);if(o.includes("No service charge found")||o.includes("No hay cargo")){b(c?`
          <div class="report-empty">
            <strong>Archivo no disponible</strong>
            <span>El lote fue procesado pero el archivo solicitado no está disponible. Contacte al administrador del sistema.</span>
          </div>
        `:`
          <div class="report-empty">
            <strong>Comprobante aún no generado</strong>
            <span>El lote aún no ha sido procesado. Estará disponible una vez que el lote pase a estado EXITOSO.</span>
          </div>
        `,"info");return}b(`<div class="report-empty"><strong>No se pudo generar la descarga.</strong><span>${r(s.message)}</span></div>`,"error")}}const f=t=>document.querySelector(t);function Z(){var s;const t=u(),e=t.accounts.find(o=>o.isFavorite);return(e==null?void 0:e.accountNumber)||((s=t.accounts[0])==null?void 0:s.accountNumber)||null}async function z(){var s;const t=u();if(t.customerType!=="JURIDICO")return;try{const o=await yt(),n=(s=t.session)==null?void 0:s.identification,a=o.filter(c=>!n||c.ruc===n);g({batches:a,paymentBatches:a})}catch(o){g({batches:[],paymentBatches:[]}),f("#batchesTable").innerHTML=`<div class="empty-state">${r(o.message)}</div>`}se();const e=document.getElementById("batchesTable");e&&e.scrollIntoView({behavior:"smooth",block:"start"})}async function te(){if(u().customerType!=="JURIDICO")return;try{const s=await St();g({charges:s})}catch{g({charges:[]})}const e=f("#chargesMetric");e&&(e.textContent=u().charges.length)}async function ee(){if(u().customerType!=="JURIDICO")return;try{const n=await Ct();g({companyAccount:n})}catch{g({companyAccount:Z()})}u().companyAccount||g({companyAccount:Z()});const s=At(u().companyAccount),o=f("#companyAccountMetric");o&&(o.textContent=s),f("#companyAccountHero").textContent=s}function se(){var d;const t=u(),e=f("#batchesMetric"),s=t.paymentBatches||[];e&&(e.textContent=s.length);const o=f("#batchesTable"),n=f("#recentBatches");if(!s.length){const l='<div class="empty-state">Sin lotes cargados todavia.</div>';o.innerHTML=l,n&&(n.innerHTML=l);return}const a=(d=t.session)==null?void 0:d.identification,i=`
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
        </tr>
      </thead>
      <tbody>${s.slice().filter(l=>!l.channel||!(l.channel+"").toLowerCase().includes("sftp")).filter(l=>!a||l.ruc===a).filter(l=>!["PROGRAMADO","SCHEDULED"].includes((l.status||"").toUpperCase())).sort((l,v)=>(v.id||0)-(l.id||0)).map(l=>`
      <tr>
        <td>${r(l.id||"N/D")}</td>
        <td>${r(l.fileName||"Archivo CSV")}</td>
        <td>${r(l.ruc||"N/D")}</td>
        <td><span class="badge ${w(l.status)}">${r(l.status||"N/D")}</span></td>
        <td>${r(l.headerTotalRecords||0)}</td>
        <td>${S(l.headerTotalAmount)}</td>
        <td>${$(l.receivedAt)}</td>

      </tr>
    `).join("")}</tbody>
    </table>
  `;o.innerHTML=i,n&&(n.innerHTML=`<div class="table-wrap compact-table">${i}</div>`),Q()}const it=["PROCESADO","PROCESSED","REJECTED","RECHAZADO"];function _(t){const e=(t||"").toString().toUpperCase();return e.includes("EXITO")||e==="SUCCESS"}function K(t){const e=(t||"").toString().toUpperCase();return e.includes("RECHAZ")||e==="REJECTED"}function W(t){const e=Math.floor(t/1e3),s=Math.floor(e/60).toString().padStart(2,"0"),o=(e%60).toString().padStart(2,"0");return`${s}:${o}`}function ne(t){const e=t.length,s=t.filter(l=>_(l.status)).length,o=t.filter(l=>K(l.status)).length,n=s+o,a=f("#uploadCounts");a&&(a.textContent=`${n} / ${e} procesadas (${s} exitosas, ${o} rechazadas)`);const c=f("#uploadProgressBar");c&&(c.style.width=e?`${Math.round(n/e*100)}%`:"0%");const i=f("#uploadLiveRows");if(!i)return;const d=t.filter(l=>_(l.status)||K(l.status)).slice(-15).reverse();if(!d.length){i.innerHTML='<div class="empty-state">Analizando líneas del archivo...</div>';return}i.innerHTML=`
    <table>
      <thead>
        <tr><th>Línea</th><th>Cuenta destino</th><th>Monto</th><th>Estado</th></tr>
      </thead>
      <tbody>
        ${d.map(l=>`
          <tr>
            <td>${r(l.lineNumber)}</td>
            <td>${r(l.destinationAccountNumber)}</td>
            <td>${S(l.amount)}</td>
            <td><span class="badge ${w(l.status)}">${r(l.status)}</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `}function oe(t,e){const s=f("#uploadProgressPanel"),o=f("#uploadTimer");s==null||s.classList.remove("is-hidden"),o&&(o.textContent="00:00");const n=Date.now(),a=setInterval(()=>{o&&(o.textContent=W(Date.now()-n))},1e3);let c=0;const i=setInterval(async()=>{c++;try{const[d]=await Promise.all([bt(e),B()]);ne(d);const l=u().batches.find(C=>Number(C.id)===e),v=((l==null?void 0:l.status)||"").toUpperCase();if(l&&it.includes(v)){clearInterval(i),clearInterval(a);const C=W(Date.now()-n);o&&(o.textContent=C);const A=["PROCESADO","PROCESSED"].includes(v);p(t,`Procesamiento completado en ${C}. Estado final: ${l.status}`,A?"success":"error");return}}catch{}c>=600&&(clearInterval(i),clearInterval(a),p(t,"El procesamiento está tomando más tiempo del esperado. Actualiza la lista manualmente.","error"))},2e3)}async function ae(t){t.preventDefault();const e=f("#uploadMessage");if(u().customerType!=="JURIDICO"){p(e,"Solo clientes juridicos pueden enviar pagos masivos.","error");return}const o=f("#csvFile").files[0];if(!o){p(e,"Selecciona un archivo CSV.","error");return}const n=f("#uploadProgressPanel");n==null||n.classList.add("is-hidden");const a=f("#uploadLiveRows");a&&(a.innerHTML="");const c=f("#uploadCounts");c&&(c.textContent="0 / 0 procesadas");const i=f("#uploadProgressBar");i&&(i.style.width="0%"),p(e,"Enviando archivo de pagos...");try{const d=await $t(o);await B();const l=Number(d.batchId),v=(d.batchStatus||"").toUpperCase();if(it.includes(v)){const C=["PROCESADO","PROCESSED"].includes(v);p(e,`Resultado: ${d.validationResult||"procesado"} | Estado: ${d.batchStatus}`,C?"success":"error")}else p(e,"Lote recibido. Procesando pagos automáticamente... ⏳"),oe(e,l)}catch(d){p(e,d.message||"No se pudo cargar el CSV.","error")}}async function re(t){if(u().customerType==="JURIDICO")try{const s=await Et(t);f("#reportOutput").textContent=typeof s=="string"?s:JSON.stringify(s,null,2),await B()}catch(s){f("#reportOutput").textContent=s.message}}async function B(){u().customerType==="JURIDICO"&&await Promise.all([z(),te(),ee()])}function ie(t){const e=t.trim().toLowerCase();document.querySelectorAll("tbody tr, .account-card").forEach(s=>{const o=!e||s.textContent.toLowerCase().includes(e);s.classList.toggle("is-filtered",!o)})}const L=t=>document.querySelector(t);async function O(t=!1){if(u().customerType!=="JURIDICO")return;const s=t?null:document.getElementById("loadSftpBatchesButton");s&&(s.disabled=!0,s.innerHTML='<span class="btn-spinner">⟳</span> Actualizando...');try{const n=(await y("/api/switch/v1/payment-batch")).filter(a=>(a.channel+"").toLowerCase().includes("sftp"));g({sftpBatches:n}),ce(),ct()}catch(o){if(g({sftpBatches:[]}),!t){const n=L("#sftpBatchesTable");n&&(n.innerHTML=`<div class="empty-state">${r(o.message)}</div>`)}}finally{s&&(s.disabled=!1,s.innerHTML="⟳ Actualizar")}}function ce(){const e=u().sftpBatches||[],s=L("#sftpBatchesTable");if(!s)return;if(!e.length){s.innerHTML=`
      <div class="empty-state">
        <strong>No hay archivos en el buzón.</strong>
        <br><small>Cuando subas un CSV via SFTP o programes un lote, aparecerá aquí con su estado.</small>
      </div>`;return}const o=e.filter(i=>["PROGRAMADO","PENDIENTE","SCHEDULED","PENDING","RECIBIDO"].includes((i.status||"").toUpperCase())),n=e.filter(i=>!["PROGRAMADO","PENDIENTE","SCHEDULED","PENDING","RECIBIDO"].includes((i.status||"").toUpperCase())),c=[...o.sort((i,d)=>new Date(i.scheduledDate||i.receivedAt).getTime()-new Date(d.scheduledDate||d.receivedAt).getTime()),...n.sort((i,d)=>(d.id||0)-(i.id||0))].map(i=>`
        <tr${["PROGRAMADO","PENDIENTE","SCHEDULED","PENDING","RECIBIDO"].includes((i.status||"").toUpperCase())?' class="row-pending"':""}>
          <td>${r(String(i.id||"N/D"))}</td>
          <td>${r(i.fileName||"archivo.csv")}</td>
          <td><span class="badge ${w(i.status)}">${r(i.status||"N/D")}</span></td>
          <td>${r(String(i.headerTotalRecords||0))}</td>
          <td>${S(i.headerTotalAmount)}</td>
          <td>${$(i.receivedAt)}</td>
          <td>
            ${i.scheduledDate?`<span class="badge badge-info">📅 ${$(i.scheduledDate)}</span>`:'<span class="text-muted">Inmediato</span>'}
          </td>
        </tr>
      `).join("");s.innerHTML=`
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Archivo</th>
          <th>Estado</th>
          <th>Registros</th>
          <th>Monto</th>
          <th>Recibido</th>
          <th>Ejecución Programada</th>
        </tr>
      </thead>
      <tbody>${c}</tbody>
    </table>
  `}function ct(){const t=document.getElementById("sftpScheduleSummary");if(!t)return;const o=(u().sftpBatches||[]).filter(i=>["ENCOLADO","PENDIENTE","PENDING"].includes((i.status||"").toUpperCase()));if(o.length===0){t.style.display="none";return}const n=document.getElementById("sftpScheduledDate"),a=n==null?void 0:n.value;let c;if(a){const i=new Date(a),d=i.toLocaleDateString("es-EC",{day:"numeric",month:"short",year:"numeric"}),l=i.toLocaleTimeString("es-EC",{hour:"2-digit",minute:"2-digit"});c=`📋 ${o.length} ${o.length===1?"archivo":"archivos"} en el buzón ${o.length===1?"será programado":"serán programados"} para el <strong>${d}, ${l}</strong>`}else c=`📋 ${o.length} ${o.length===1?"archivo encolado":"archivos encolados"} en el buzón. Selecciona una fecha y hora para programarlos.`;t.innerHTML=c,t.style.display="block"}async function le(t){t.preventDefault();const e=L("#sftpUploadMessage");if(u().customerType!=="JURIDICO"){p(e,"Solo clientes jurídicos pueden programar pagos masivos.","error");return}const o=L("#sftpScheduledDate").value;if(!o){p(e,"Selecciona una fecha y hora de efectivización.","error");return}p(e,"⏳ Aplicando regla de efectivización...");try{const n=await wt(o);p(e,`✅ Regla de efectivización aplicada. ${n.count||0} lotes del buzón programados para el ${o.replace("T"," ")}`,"success"),L("#sftpScheduledDate").value="",await O()}catch(n){p(e,n.message||"No se pudo aplicar la regla.","error")}}const h=t=>document.querySelector(t),Y=t=>Array.from(document.querySelectorAll(t));"scrollRestoration"in history&&(history.scrollRestoration="manual");let U=null;function de(){lt(),U=setInterval(()=>O(!0),3e3)}function lt(){U!==null&&(clearInterval(U),U=null)}async function ue(){const{coreUserId:t,coreStatus:e}=await pt();g({coreUserId:t}),h("#coreStatus").textContent=e;const s=h("#portalCoreStatus");s&&(s.textContent=e);const o=await mt();h("#switchStatus").textContent=o}async function tt(t){lt(),k(t),t==="transactions"&&await nt(),(t==="payments"||t==="reports")&&(await B(),t==="reports"&&Q()),t==="sftp"&&(await O(),de())}function pe(){dt()&&(V(),x())}function me(){h("#loginForm").addEventListener("submit",Ot),h("#logoutButton").addEventListener("click",Pt),h("#refreshButton").addEventListener("click",async()=>{var e;await x();const t=(e=h(".nav-item.is-active"))==null?void 0:e.dataset.section;t==="transactions"&&await nt(),(t==="payments"||t==="reports")&&(await B(),t==="reports"&&Q()),t==="sftp"&&await O()}),h("#globalSearch").addEventListener("input",t=>ie(t.target.value)),h("#applyTransactionsFilterButton").addEventListener("click",Ut),h("#clearTransactionsFilterButton").addEventListener("click",Mt),h("#uploadForm").addEventListener("submit",ae),h("#loadBatchesButton").addEventListener("click",z),h("#batchSelector").addEventListener("change",()=>rt(I())),h("#csvFile").addEventListener("change",t=>{var e;h("#fileName").textContent=((e=t.target.files[0])==null?void 0:e.name)||"Seleccionar CSV"}),h("#sftpUploadForm").addEventListener("submit",le),h("#loadSftpBatchesButton").addEventListener("click",O),h("#sftpScheduledDate").addEventListener("input",ct),Y(".nav-item").forEach(t=>{t.addEventListener("click",()=>tt(t.dataset.section))}),Y("[data-section-shortcut]").forEach(t=>{t.addEventListener("click",()=>tt(t.dataset.sectionShortcut))}),document.addEventListener("click",t=>{const e=t.target.closest("[data-process]");e&&re(e.dataset.process);const s=t.target.closest("[data-report]");s&&Wt(s.dataset.report);const o=t.target.closest("[data-download]");o&&Yt(o.dataset.download),t.target.closest("[data-refresh-reports]")&&z(),t.target.closest("[data-feature-coming-soon]")&&alert("Estamos trabajando para tu futuro")})}me();ue();pe();
