(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();const T={session:null,customerType:"NATURAL",coreUserId:null,accounts:[],transactions:[],batches:[],paymentBatches:[],sftpBatches:[],charges:[],companyAccount:null};function u(){return T}function g(t){Object.assign(T,t)}function et(){T.session&&localStorage.setItem("banquitoSession",JSON.stringify({session:T.session,customerType:T.customerType}))}function lt(){var e;const t=localStorage.getItem("banquitoSession");if(!t)return!1;try{const s=JSON.parse(t);return T.session=s.session,T.customerType=s.customerType||((e=s.session)==null?void 0:e.customerType)||"NATURAL",!0}catch{return localStorage.removeItem("banquitoSession"),!1}}async function v(t,e={}){const s=await fetch(t,e),a=(s.headers.get("content-type")||"").includes("application/json")?await s.json():await s.text();if(!s.ok){const i=typeof a=="object"?a.error||a.detail||a.message:a;throw new Error(i||`Error HTTP ${s.status}`)}return a}async function ut(t,e){const s=await fetch(t);if(!s.ok){const i=await s.text();throw new Error(i||`Error HTTP ${s.status}`)}const o=await s.blob(),n=URL.createObjectURL(o),a=document.createElement("a");a.href=n,a.download=e,document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(n)}async function pt(){try{return await v("/api/core/v1/health"),{coreUserId:1,coreStatus:"Banca disponible",switchStatus:null}}catch{return{coreUserId:1,coreStatus:"Banca no disponible",switchStatus:null}}}async function mt(){try{return await v("/api/switch/v1/switch/health"),"Pagos disponibles"}catch{return"Pagos no disponibles"}}async function ft(t,e){return v("/api/core/v1/auth/customers/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,password:e})})}async function ht(t,e,s){return v("/api/core/v1/auth/customers/change-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,currentPassword:e,newPassword:s})})}async function gt(t,e){return v(`/api/core/v1/accounts/customer/${t}`,{headers:{"X-Core-User-Id":String(e)}})}async function vt(t,e){return v(`/api/core/v1/accounts/customer/${t}/transactions`,{headers:{"X-Core-User-Id":String(e)}})}async function yt(){var o;const e=(o=u().session)==null?void 0:o.identification,s=e?`/api/switch/v1/payment-batch?ruc=${encodeURIComponent(e)}`:"/api/switch/v1/payment-batch";return v(s)}async function St(){return(await v("/api/switch/v1/billing/charges")).cargos||[]}async function Ct(t){return(await v(`/api/switch/v1/billing/batches/${t}/detail`)).detalles||[]}async function bt(t){return(await v(`/api/switch/v1/billing/batches/${t}/history`)).historial||[]}async function $t(){return(await v("/api/switch/v1/billing/empresa-account")).cuentaEmpresa||null}async function Et(t){const e=new FormData;e.append("file",t),e.append("channel","PORTAL");const o=u().session;return o&&o.identification&&e.append("ruc",o.identification),v("/api/switch/v1/payment-batch/upload-csv",{method:"POST",body:e})}async function Dt(t){return v(`/api/switch/v1/payment-batch/${t}/process`,{method:"POST"})}async function Tt(t,e){const s={summary:`/api/switch/v1/billing/batches/${e}/summary`,detail:`/api/switch/v1/billing/batches/${e}/detail`,history:`/api/switch/v1/billing/batches/${e}/history`,charge:`/api/switch/v1/billing/batches/${e}/charge`,receipt:`/api/switch/v1/billing/batches/${e}/receipt`};return v(s[t])}async function wt(t,e){const s={"receipt-pdf":`/api/switch/v1/payment-batch/${e}/receipt`,"billing-novelties":`/api/switch/v1/billing/batches/${e}/novelties`},o={"receipt-pdf":`recibo_lote_${e}.pdf`,"billing-novelties":`novedades_${e}.csv`};return await ut(s[t],o[t]),o[t]}async function At(t){var n;const s=((n=u().session)==null?void 0:n.identification)||"",o=t.includes(":")&&t.split(":").length===2?t+":00":t;return v(`/api/switch/v1/payment-batch/schedule-queued?scheduledDate=${encodeURIComponent(o)}&ruc=${encodeURIComponent(s)}`,{method:"POST"})}function S(t){const e=Number(t||0);return new Intl.NumberFormat("es-EC",{style:"currency",currency:"USD"}).format(e)}function $(t){if(!t)return"Sin fecha";const e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("es-EC",{dateStyle:"medium",timeStyle:"short"}).format(e)}function w(t){const e=String(t||"").toUpperCase();return["ACTIVO","COMPLETADA","SUCCESS","EXITO","PROCESADO","APROBADO"].some(s=>e.includes(s))?"is-success":["ERROR","RECHAZ","REJECT","FALL","BLOQUEADO","INACTIVO"].some(s=>e.includes(s))?"is-danger":"is-neutral"}function Rt(t){const e=String(t||"N/D");return e.length>4?`**** ${e.slice(-4)}`:e}function Nt(t){return String(t||"").toUpperCase().includes("CREDITO")?"is-credit":"is-debit"}function r(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function p(t,e,s=""){t.textContent=e||"",t.classList.toggle("is-error",s==="error"),t.classList.toggle("is-success",s==="success")}const R=t=>document.querySelector(t);async function Lt(){var e;const t=u();if((e=t.session)!=null&&e.customerId){try{const s=await gt(t.session.customerId,t.coreUserId||1);g({accounts:s})}catch(s){g({accounts:[]}),R("#accountsTable").innerHTML=`<div class="empty-state">${r(s.message)}</div>`}It()}}function It(){const t=u();R("#accountsMetric").textContent=t.accounts.length;const e=t.accounts.reduce((n,a)=>n+Number(a.availableBalance||0),0);R("#balanceMetric").textContent=S(e),Ot();const s=R("#accountsTable");if(!s)return;if(!t.accounts.length){s.innerHTML='<div class="empty-state">No hay cuentas disponibles para este cliente.</div>';return}const o=t.accounts.map(n=>`
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
  `}function Ot(){const t=u(),e=R("#dashboardAccounts");if(e){if(!t.accounts.length){e.innerHTML='<div class="empty-state">No hay cuentas disponibles para este cliente.</div>';return}e.innerHTML=t.accounts.slice(0,3).map(s=>`
      <article class="dashboard-account-card">
        <span>${r(s.accountSubtypeDescription||"Cuenta")}</span>
        <strong>${r(s.accountNumber||"Sin numero")}</strong>
        <div>
          <small>Disponible</small>
          <b>${S(s.availableBalance)}</b>
        </div>
        <em class="badge ${w(s.status)}">${r(s.status||"N/D")}</em>
      </article>
    `).join("")}}const m=t=>document.querySelector(t),M=t=>Array.from(document.querySelectorAll(t));async function Bt(t){t.preventDefault();const e=m("#loginMessage");p(e,"Validando credenciales...");const s=new FormData(t.currentTarget),o=s.get("username"),n=s.get("password");try{const a=await ft(o,n);if(a.passwordChangeRequired){p(e,"Cambio de contraseña requerido.","success"),Pt(o,n);return}const i=a.customerType;if(!i)throw new Error("No se pudo identificar el tipo de cliente. Intenta nuevamente en unos minutos.");g({session:a,customerType:i}),et(),p(e,"Ingreso correcto.","success"),k(),await x()}catch(a){p(e,a.message||"No se pudo iniciar sesion.","error")}}function Pt(t,e){m('[data-view="login"]').classList.add("is-hidden"),m('[data-view="password-change"]').classList.remove("is-hidden");const s=m("#passwordChangeForm");m("#currentPassword").value=e,s.onsubmit=async o=>{o.preventDefault();const n=m("#passwordChangeMessage"),a=m("#newPassword").value,i=m("#confirmPassword").value;if(a!==i){p(n,"Las contraseñas no coinciden.","error");return}if(a===e){p(n,"La nueva contraseña debe ser diferente a la actual.","error");return}p(n,"Actualizando contraseña...");try{const c=await ht(t,e,a),l=c.customerType;g({session:c,customerType:l}),et(),p(n,"Contraseña actualizada con éxito.","success"),m('[data-view="password-change"]').classList.add("is-hidden"),k(),await x()}catch(c){p(n,c.message||"Error al cambiar la contraseña.","error")}}}function k(){var s,o,n,a;m('[data-view="login"]').classList.add("is-hidden"),m('[data-view="password-change"]').classList.add("is-hidden"),m('[data-view="dashboard"]').classList.remove("is-hidden");const t=u(),e=t.customerType==="JURIDICO";m("#sessionType").textContent=e?"Cliente juridico":"Cliente natural",m("#sessionName").textContent=((s=t.session)==null?void 0:s.customerName)||((o=t.session)==null?void 0:o.username)||"Panel principal",m("#sessionMeta").textContent=`${((n=t.session)==null?void 0:n.identificationType)||"ID"} ${((a=t.session)==null?void 0:a.identification)||""}`.trim(),m("#sidebarType").textContent=e?"Perfil juridico":"Perfil natural",M(".company-only").forEach(i=>i.classList.toggle("is-hidden",!e)),M(".natural-only").forEach(i=>i.classList.toggle("is-hidden",e)),J("overview"),window.scrollTo({top:0,left:0,behavior:"auto"}),st()}function Ut(){const t=u();t.session=null,t.accounts=[],t.transactions=[],t.batches=[],t.charges=[],localStorage.removeItem("banquitoSession"),m("#loginForm").reset(),J("overview"),m('[data-view="dashboard"]').classList.add("is-hidden"),m('[data-view="login"]').classList.remove("is-hidden")}function J(t){!(u().customerType==="JURIDICO")&&["payments","reports","sftp"].includes(t)&&(t="overview"),M(".nav-item").forEach(o=>o.classList.toggle("is-active",o.dataset.section===t)),M("[data-section-panel]").forEach(o=>{o.classList.toggle("is-hidden",o.dataset.sectionPanel!==t)})}function st(){var y;const t=u();if(!t.session)return;const e=t.session,s=t.customerType==="JURIDICO",o=e.customerName||"Informacion del cliente",n=`${e.identificationType||"ID"} ${e.identification||""}`.trim(),a=["SUSPENDIDO","BLOQUEADO","INACTIVO","ACTIVO"],i=t.accounts||[],c=a.find(b=>i.some(A=>A.status===b))||((y=i[0])==null?void 0:y.status)||e.status||"N/D",l=c,d=c==="ACTIVO"?"is-success":c==="SUSPENDIDO"||c==="BLOQUEADO"?"is-danger":"is-neutral";m("#profileName").textContent=e.customerName||"Informacion del cliente",m("#profileDetails").innerHTML=`
    <section class="client-identity-card">
      <div class="client-avatar">${s?"CO":"CL"}</div>
      <div>
        <span>${s?"Cliente juridico":"Cliente natural"}</span>
        <strong>${r(o)}</strong>
        <small>${r(n||"Identificacion no disponible")}</small>
      </div>
      <em class="badge ${d}">${r(l)}</em>
    </section>

    <section class="bank-reference-card">
      <span>Referencia bancaria</span>
      <strong>BanQuito</strong>
      <p>Cliente verificado para consultas digitales, productos bancarios y servicios empresariales habilitados.</p>
    </section>

    <section class="profile-info-grid">
      ${[["Usuario digital",e.username],["Correo registrado",e.email],["Telefono de contacto",e.mobilePhone],["Ultimo ingreso",$(e.lastLogin)]].map(([b,A])=>`
          <div>
            <dt>${r(b)}</dt>
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
  `}async function x(){await Lt(),st()}const D=t=>document.querySelector(t);let E={from:null,to:null};function Mt(){const t=D("#transactionsFromDate"),e=D("#transactionsToDate");E={from:(t==null?void 0:t.value)||null,to:(e==null?void 0:e.value)||null},q()}function jt(){const t=D("#transactionsFromDate"),e=D("#transactionsToDate");t&&(t.value=""),e&&(e.value=""),E={from:null,to:null},q()}function Ht(t){if(!E.from&&!E.to)return t;const e=E.from?new Date(`${E.from}T00:00:00`).getTime():null,s=E.to?new Date(`${E.to}T23:59:59.999`).getTime():null;return t.filter(o=>{const n=o.transactionDate;if(!n)return!1;const a=new Date(n).getTime();return!(Number.isNaN(a)||e!==null&&a<e||s!==null&&a>s)})}async function nt(){var e;const t=u();if((e=t.session)!=null&&e.customerId){try{const s=await vt(t.session.customerId,t.coreUserId||1);g({transactions:s})}catch(s){g({transactions:[]}),D("#transactionsTable").innerHTML=`<div class="empty-state">${r(s.message)}</div>`}q()}}function q(){const t=u(),e=Ht(t.transactions||[]),s=D("#transactionsMetric");s&&(s.textContent=t.transactions.length);const o=D("#recentTransactions"),n=D("#transactionsTable");if(!e.length){const l=t.transactions.length?'<div class="empty-state">Sin movimientos en el periodo seleccionado.</div>':'<div class="empty-state">Sin transacciones registradas.</div>';n.innerHTML=l,o&&!t.transactions.length&&(o.innerHTML=l);return}const a=l=>{const d=(l||"").toUpperCase();return d==="COMPLETADA"?"Exitoso":d==="RECHAZADA"?"Rechazado":l||"N/D"},c=`
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
      <tbody>${e.map(l=>{const d=(l.movementType||"").toUpperCase()==="DEBITO",y=l.counterpartAccountNumber||"—";return`
      <tr>
        <td>${r(d?l.accountNumber||"N/D":y)}</td>
        <td>${r(d?y:l.accountNumber||"N/D")}</td>
        <td><span class="badge ${Nt(l.movementType)}">${r(l.movementType||"N/D")}</span></td>
        <td>${S(l.amount)}</td>
        <td>${S(l.resultingBalance)}</td>
        <td><span class="badge ${w(l.status)}">${r(a(l.status))}</span></td>
        <td>${$(l.transactionDate)}</td>
        <td>${r(l.message||"N/D")}</td>
      </tr>
    `}).join("")}</tbody>
    </table>
  `;n.innerHTML=c,o&&(o.innerHTML=`<div class="table-wrap compact-table">${c}</div>`)}const F=t=>document.querySelector(t),xt={summary:"Resumen del lote",detail:"Detalle del lote",charge:"Cargo del lote",receipt:"Comprobante del lote"},Ft={id:"Referencia",fileName:"Archivo",ruc:"RUC",status:"Estado",headerTotalRecords:"Registros",headerTotalAmount:"Monto total",totalAmount:"Monto total",amount:"Monto",chargeAmount:"Valor comision",commissionAmount:"Valor comision",feeAmount:"Valor comision",totalChargeAmount:"Valor comision",chargeStatus:"Respuesta del proceso",commissionStatus:"Estado comision",chargeDate:"Fecha de cobro",receivedAt:"Recibido",createdAt:"Creado",processedAt:"Procesado",updatedAt:"Actualizado",validationResult:"Validacion",batchStatus:"Estado del lote",accountNumber:"Cuenta",description:"Descripcion",message:"Mensaje",notificationStatus:"Estado notif.",rejectionReason:"Motivo rechazo",lineNumber:"Linea",beneficiaryName:"Beneficiario",identification:"Identificacion",identificationNumber:"Identificacion",executedAt:"Ejecutado"},zt=["fileName","ruc","status","validationResult","batchStatus","headerTotalRecords","totalRecords","processedRecords","successfulRecords","failedRecords","headerTotalAmount","totalAmount","amount","chargeAmount","receivedAt","processedAt","createdAt","message"],j=["chargeAmount","commissionAmount","feeAmount","amount","totalChargeAmount"],Vt=["chargeStatus","commissionStatus","status","result"],kt=["lineNumber","accountNumber","beneficiaryName","identification","identificationNumber","amount","status","validationResult","notificationStatus","rejectionReason","message","description","executedAt","createdAt","processedAt"],Jt=new Set(["id","batchId","customerId","userId","createdBy","updatedBy","deletedBy","version","trace","stack","rawPayload","payload"]);function H(t,e){return!(e==null||e===""||Array.isArray(e)||typeof e=="object"||Jt.has(t)||t.startsWith("_"))}function G(t){return Ft[t]||t.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase())}function ot(t,e){if(e==null||e==="")return"N/D";const s=t.toLowerCase();return s.includes("amount")||s.includes("monto")||s.includes("balance")?S(e):s.includes("date")||s.includes("at")||s.includes("fecha")?$(e):String(e)}function qt(t){return String(t||"").trim().toUpperCase()}function P(t){return String((t==null?void 0:t.id)||(t==null?void 0:t.batchId)||(t==null?void 0:t.reference)||"")}function Q(){var t,e;return((e=(t=F("#batchSelector"))==null?void 0:t.value)==null?void 0:e.trim())||""}function I(){const t=Q();return u().batches.find(e=>P(e)===t)||null}function N(t,e){if(!t||typeof t!="object")return;const s=e.find(o=>t[o]!==void 0&&t[o]!==null&&t[o]!=="");return s?t[s]:void 0}function Gt(t,e){return!t||typeof t!="object"?!1:[t.batchId,t.paymentBatchId,t.loteId,t.idLote,t.reference].filter(s=>s!=null).some(s=>String(s)===String(e))}function Qt(t,e){const s=u().charges.find(o=>Gt(o,t));return s||(Array.isArray(e)?e.find(o=>N(o,j)):e&&typeof e=="object"&&N(e,j)?e:null)}function Xt(t,e){const s=Qt(t,e),o=qt(N(e,Vt)),n=N(s,j)??N(e,j),a=Number(n||0)>0,i=["REJECTED","RECHAZADO","FAILED","ERROR"].some(y=>o.includes(y));if(!s&&!a&&!o)return"";const c=s||a?"Comision registrada":"Sin cargo confirmado",l=s||a?"is-success":"is-neutral",d=i&&(s||a)?"La respuesta del proceso vino rechazada, pero existe evidencia de comision registrada. No se interpreta como comision pendiente.":"Validado con la informacion operativa disponible para el lote.";return`
    <div class="charge-reconciliation">
      <div>
        <span>Estado operativo del cobro</span>
        <strong class="badge ${l}">${r(c)}</strong>
      </div>
      <div>
        <span>Valor comision</span>
        <strong>${r(S(n||0))}</strong>
      </div>
      <p>${r(d)}</p>
    </div>
  `}function at(t){return`<span class="badge ${w(t)}">${r(t||"N/D")}</span>`}function Zt(t,e){return e&&typeof e=="object"&&!Array.isArray(e)?e.status||e.batchStatus||e.validationResult||(t==null?void 0:t.status)||"Generado":(t==null?void 0:t.status)||"Generado"}function _t(t,e,s,o){const a=u().session||{},i=new Intl.DateTimeFormat("es-EC",{dateStyle:"medium",timeStyle:"short"}).format(new Date),c=Zt(s,o),l=xt[t]||"Reporte del lote";return`
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
          <h3>${r(l)}</h3>
          <p>${r((s==null?void 0:s.fileName)||`Referencia de lote ${e}`)}</p>
        </div>
        <div class="bank-report-status">
          ${at(c)}
          <small>Emitido ${r(i)}</small>
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

      ${t==="charge"?Xt(e,o):""}

      <section class="bank-report-body">
        <div class="bank-report-section-title">
          <span>Contenido del informe</span>
          <strong>${r(l)}</strong>
        </div>
        ${Wt(o)}
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
  `}}function X(){const t=F("#batchSelector");if(!t)return;const e=u(),s=t.value,o=e.batches.slice().sort((n,a)=>Number(a.id||a.batchId||0)-Number(n.id||n.batchId||0));t.innerHTML=['<option value="">Selecciona por archivo, RUC o fecha</option>',...o.map(n=>{const a=P(n),i=[n.fileName||"Archivo CSV",n.ruc?`RUC ${n.ruc}`:"RUC N/D",n.status||"Estado N/D",S(n.headerTotalAmount),$(n.receivedAt)].join(" - ");return`<option value="${r(a)}">${r(i)}</option>`})].join(""),s&&o.some(n=>P(n)===s)?t.value=s:o.length&&(t.value=P(o[0])),rt(I())}function Kt(t){const e=zt.filter(n=>Object.prototype.hasOwnProperty.call(t,n)).filter(n=>H(n,t[n])),s=Object.keys(t).filter(n=>!e.includes(n)).filter(n=>H(n,t[n])).slice(0,10-e.length),o=[...e,...s].map(n=>[n,t[n]]);return o.length?`
    <dl class="report-ledger">
      ${o.map(([n,a])=>`
        <div>
          <dt>${r(G(n))}</dt>
          <dd>${r(ot(n,a))}</dd>
        </div>
      `).join("")}
    </dl>
  `:""}function Z(t){if(!t.length)return'<div class="empty-state">Sin registros para mostrar.</div>';const e=kt.filter(n=>t.some(a=>H(n,a==null?void 0:a[n]))),s=Array.from(t.reduce((n,a)=>(Object.keys(a||{}).forEach(i=>{!e.includes(i)&&H(i,a[i])&&n.add(i)}),n),new Set)).slice(0,Math.max(0,10-e.length)),o=[...e,...s];return o.length?`
    <div class="table-wrap report-table">
      <table>
        <thead>
          <tr>${o.map(n=>`<th>${r(G(n))}</th>`).join("")}</tr>
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
  `:'<div class="empty-state">El reporte no contiene campos operativos para mostrar.</div>'}function Wt(t){if(Array.isArray(t))return Z(t);if(!t||typeof t!="object")return`<div class="report-note">${r(t||"Sin datos.")}</div>`;const e=Object.entries(t).filter(([,s])=>Array.isArray(s)).map(([s,o])=>`
      <section class="report-section">
        <h3>${r(G(s))}</h3>
        ${Z(o)}
      </section>
    `).join("");return`${Kt(t)}${e||'<div class="report-note">Sin movimientos o novedades relevantes para mostrar.</div>'}`}function C(t,e=""){const s=F("#reportOutput");s.classList.remove("is-error","is-success","is-info"),e&&s.classList.add(`is-${e}`),s.innerHTML=t}async function Yt(t){const e=Q();if(!e){C('<div class="report-empty"><strong>Selecciona un lote.</strong><span>Actualiza la lista y elige por archivo, RUC o fecha antes de consultar.</span></div>',"error");return}try{C('<div class="report-empty"><strong>Consultando reporte...</strong><span>Estamos preparando la informacion del lote seleccionado.</span></div>');const s=await Tt(t,e),o=I();C(_t(t,e,o,s))}catch(s){const o=s.message||"",n=I(),a=((n==null?void 0:n.status)||"").toUpperCase(),i=["PROCESADO","EXITOSO","PROCESSED","SUCCESS"].includes(a);if(o.includes("No service charge found")||o.includes("No hay cargo")){C(i?`
          <div class="report-empty">
            <strong>Información de cargo no disponible</strong>
            <span>El lote fue procesado pero no se generó un cargo de servicio registrado. Contacte al administrador del sistema para más detalles.</span>
          </div>
        `:`
          <div class="report-empty">
            <strong>Lote en espera de procesamiento</strong>
            <span>Este lote se encuentra en estado ${r((n==null?void 0:n.status)||"PENDIENTE")}. El reporte estará disponible automáticamente una vez que el banco procese la operación.</span>
          </div>
        `,"info");return}C(`<div class="report-empty"><strong>No se pudo consultar el reporte.</strong><span>${r(s.message)}</span></div>`,"error")}}async function te(t){const e=Q();if(!e){C('<div class="report-empty"><strong>Selecciona un lote.</strong><span>Actualiza la lista y elige por archivo, RUC o fecha antes de descargar.</span></div>',"error");return}try{C('<div class="report-empty"><strong>Preparando descarga...</strong><span>El archivo se generara con la referencia interna del lote seleccionado.</span></div>');const s=await wt(t,e);C(`
      <div class="download-card">
        <span>Descarga generada</span>
        <strong>${r(s)}</strong>
        <small>Operacion completada para el lote seleccionado.</small>
      </div>
    `,"success")}catch(s){const o=s.message||"",n=I(),a=((n==null?void 0:n.status)||"").toUpperCase(),i=["PROCESADO","EXITOSO","PROCESSED","SUCCESS"].includes(a);if(o.includes("No service charge found")||o.includes("No hay cargo")){C(i?`
          <div class="report-empty">
            <strong>Archivo no disponible</strong>
            <span>El lote fue procesado pero el archivo solicitado no está disponible. Contacte al administrador del sistema.</span>
          </div>
        `:`
          <div class="report-empty">
            <strong>Comprobante aún no generado</strong>
            <span>El lote aún no ha sido procesado. Estará disponible una vez que el lote pase a estado EXITOSO.</span>
          </div>
        `,"info");return}C(`<div class="report-empty"><strong>No se pudo generar la descarga.</strong><span>${r(s.message)}</span></div>`,"error")}}const f=t=>document.querySelector(t);function _(){var s;const t=u(),e=t.accounts.find(o=>o.isFavorite);return(e==null?void 0:e.accountNumber)||((s=t.accounts[0])==null?void 0:s.accountNumber)||null}async function z(){var e;const t=u();if(t.customerType==="JURIDICO"){try{const s=await yt(),o=(e=t.session)==null?void 0:e.identification,n=s.filter(a=>!o||a.ruc===o);g({batches:n,paymentBatches:n})}catch(s){g({batches:[],paymentBatches:[]}),f("#batchesTable").innerHTML=`<div class="empty-state">${r(s.message)}</div>`}ne()}}async function ee(){if(u().customerType!=="JURIDICO")return;try{const s=await St();g({charges:s})}catch{g({charges:[]})}const e=f("#chargesMetric");e&&(e.textContent=u().charges.length)}async function se(){if(u().customerType!=="JURIDICO")return;try{const n=await $t();g({companyAccount:n})}catch{g({companyAccount:_()})}u().companyAccount||g({companyAccount:_()});const s=Rt(u().companyAccount),o=f("#companyAccountMetric");o&&(o.textContent=s),f("#companyAccountHero").textContent=s}function ne(){var l;const t=u(),e=f("#batchesMetric"),s=t.paymentBatches||[];e&&(e.textContent=s.length);const o=f("#batchesTable"),n=f("#recentBatches");if(!s.length){const d='<div class="empty-state">Sin lotes cargados todavia.</div>';o.innerHTML=d,n&&(n.innerHTML=d);return}const a=(l=t.session)==null?void 0:l.identification,c=`
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
          <th>Tiempo de proceso</th>
        </tr>
      </thead>
      <tbody>${s.slice().filter(d=>!d.channel||!(d.channel+"").toLowerCase().includes("sftp")).filter(d=>!a||d.ruc===a).filter(d=>!["PROGRAMADO","SCHEDULED"].includes((d.status||"").toUpperCase())).sort((d,y)=>(y.id||0)-(d.id||0)).map(d=>`
      <tr>
        <td>${r(d.id||"N/D")}</td>
        <td>${r(d.fileName||"Archivo CSV")}</td>
        <td>${r(d.ruc||"N/D")}</td>
        <td><span class="badge ${w(d.status)}">${r(d.status||"N/D")}</span></td>
        <td>${r(d.headerTotalRecords||0)}</td>
        <td>${S(d.headerTotalAmount)}</td>
        <td>${$(d.receivedAt)}</td>
        <td>
          <button class="secondary-button" type="button" data-batch-duration="${d.id}">Ver tiempo</button>
          <div id="batchDuration-${d.id}" class="batch-duration-result"></div>
        </td>
      </tr>
    `).join("")}</tbody>
    </table>
  `;o.innerHTML=c,n&&(n.innerHTML=`<div class="table-wrap compact-table">${c}</div>`),X()}const it=["PROCESADO","PROCESSED","REJECTED","RECHAZADO"];function K(t){const e=(t||"").toString().toUpperCase();return e.includes("EXITO")||e==="SUCCESS"}function W(t){const e=(t||"").toString().toUpperCase();return e.includes("RECHAZ")||e==="REJECTED"}async function oe(t){const e=f(`#batchDuration-${t}`);if(e){e.textContent="Consultando...";try{const s=await bt(Number(t)),o=s.find(i=>(i.newStatus||"").toUpperCase()==="PROCESSING"),n=s.filter(i=>["PROCESSED","REJECTED"].includes((i.newStatus||"").toUpperCase())).sort((i,c)=>new Date(c.changedAt).getTime()-new Date(i.changedAt).getTime())[0];if(!o){e.textContent="Aun no ha comenzado a procesar";return}if(!n){e.textContent="Todavia esta procesando...";return}const a=new Date(n.changedAt).getTime()-new Date(o.changedAt).getTime();e.textContent=`${V(a)} (mm:ss)`}catch{e.textContent="No se pudo obtener el tiempo"}}}function V(t){const e=Math.floor(t/1e3),s=Math.floor(e/60).toString().padStart(2,"0"),o=(e%60).toString().padStart(2,"0");return`${s}:${o}`}function ae(t){const e=t.length,s=t.filter(d=>K(d.status)).length,o=t.filter(d=>W(d.status)).length,n=s+o,a=f("#uploadCounts");a&&(a.textContent=`${n} / ${e} procesadas (${s} exitosas, ${o} rechazadas)`);const i=f("#uploadProgressBar");i&&(i.style.width=e?`${Math.round(n/e*100)}%`:"0%");const c=f("#uploadLiveRows");if(!c)return;const l=t.filter(d=>K(d.status)||W(d.status)).slice(-15).reverse();if(!l.length){c.innerHTML='<div class="empty-state">Analizando líneas del archivo...</div>';return}c.innerHTML=`
    <table>
      <thead>
        <tr><th>Línea</th><th>Cuenta destino</th><th>Monto</th><th>Estado</th></tr>
      </thead>
      <tbody>
        ${l.map(d=>`
          <tr>
            <td>${r(d.lineNumber)}</td>
            <td>${r(d.destinationAccountNumber)}</td>
            <td>${S(d.amount)}</td>
            <td><span class="badge ${w(d.status)}">${r(d.status)}</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `}function re(t,e){const s=f("#uploadProgressPanel"),o=f("#uploadTimer");s==null||s.classList.remove("is-hidden"),o&&(o.textContent="00:00");const n=Date.now(),a=setInterval(()=>{o&&(o.textContent=V(Date.now()-n))},1e3);let i=0;const c=setInterval(async()=>{i++;try{const[l]=await Promise.all([Ct(e),B()]);ae(l);const d=u().batches.find(b=>Number(b.id)===e),y=((d==null?void 0:d.status)||"").toUpperCase();if(d&&it.includes(y)){clearInterval(c),clearInterval(a);const b=V(Date.now()-n);o&&(o.textContent=b);const A=["PROCESADO","PROCESSED"].includes(y);p(t,`Procesamiento completado en ${b}. Estado final: ${d.status}`,A?"success":"error");return}}catch{}i>=600&&(clearInterval(c),clearInterval(a),p(t,"El procesamiento está tomando más tiempo del esperado. Actualiza la lista manualmente.","error"))},2e3)}async function ie(t){t.preventDefault();const e=f("#uploadMessage");if(u().customerType!=="JURIDICO"){p(e,"Solo clientes juridicos pueden enviar pagos masivos.","error");return}const o=f("#csvFile").files[0];if(!o){p(e,"Selecciona un archivo CSV.","error");return}const n=f("#uploadProgressPanel");n==null||n.classList.add("is-hidden");const a=f("#uploadLiveRows");a&&(a.innerHTML="");const i=f("#uploadCounts");i&&(i.textContent="0 / 0 procesadas");const c=f("#uploadProgressBar");c&&(c.style.width="0%"),p(e,"Enviando archivo de pagos...");try{const l=await Et(o);await B();const d=Number(l.batchId),y=(l.batchStatus||"").toUpperCase();if(it.includes(y)){const b=["PROCESADO","PROCESSED"].includes(y);p(e,`Resultado: ${l.validationResult||"procesado"} | Estado: ${l.batchStatus}`,b?"success":"error")}else p(e,"Lote recibido. Procesando pagos automáticamente... ⏳"),re(e,d)}catch(l){p(e,l.message||"No se pudo cargar el CSV.","error")}}async function ce(t){if(u().customerType==="JURIDICO")try{const s=await Dt(t);f("#reportOutput").textContent=typeof s=="string"?s:JSON.stringify(s,null,2),await B()}catch(s){f("#reportOutput").textContent=s.message}}async function B(){u().customerType==="JURIDICO"&&await Promise.all([z(),ee(),se()])}function de(t){const e=t.trim().toLowerCase();document.querySelectorAll("tbody tr, .account-card").forEach(s=>{const o=!e||s.textContent.toLowerCase().includes(e);s.classList.toggle("is-filtered",!o)})}const L=t=>document.querySelector(t);async function O(t=!1){if(u().customerType!=="JURIDICO")return;const s=t?null:document.getElementById("loadSftpBatchesButton");s&&(s.disabled=!0,s.innerHTML='<span class="btn-spinner">⟳</span> Actualizando...');try{const n=(await v("/api/switch/v1/payment-batch")).filter(a=>(a.channel+"").toLowerCase().includes("sftp"));g({sftpBatches:n}),le(),ct()}catch(o){if(g({sftpBatches:[]}),!t){const n=L("#sftpBatchesTable");n&&(n.innerHTML=`<div class="empty-state">${r(o.message)}</div>`)}}finally{s&&(s.disabled=!1,s.innerHTML="⟳ Actualizar")}}function le(){const e=u().sftpBatches||[],s=L("#sftpBatchesTable");if(!s)return;if(!e.length){s.innerHTML=`
      <div class="empty-state">
        <strong>No hay archivos en el buzón.</strong>
        <br><small>Cuando subas un CSV via SFTP o programes un lote, aparecerá aquí con su estado.</small>
      </div>`;return}const o=e.filter(c=>["PROGRAMADO","PENDIENTE","SCHEDULED","PENDING","RECIBIDO"].includes((c.status||"").toUpperCase())),n=e.filter(c=>!["PROGRAMADO","PENDIENTE","SCHEDULED","PENDING","RECIBIDO"].includes((c.status||"").toUpperCase())),i=[...o.sort((c,l)=>new Date(c.scheduledDate||c.receivedAt).getTime()-new Date(l.scheduledDate||l.receivedAt).getTime()),...n.sort((c,l)=>(l.id||0)-(c.id||0))].map(c=>`
        <tr${["PROGRAMADO","PENDIENTE","SCHEDULED","PENDING","RECIBIDO"].includes((c.status||"").toUpperCase())?' class="row-pending"':""}>
          <td>${r(String(c.id||"N/D"))}</td>
          <td>${r(c.fileName||"archivo.csv")}</td>
          <td><span class="badge ${w(c.status)}">${r(c.status||"N/D")}</span></td>
          <td>${r(String(c.headerTotalRecords||0))}</td>
          <td>${S(c.headerTotalAmount)}</td>
          <td>${$(c.receivedAt)}</td>
          <td>
            ${c.scheduledDate?`<span class="badge badge-info">📅 ${$(c.scheduledDate)}</span>`:'<span class="text-muted">Inmediato</span>'}
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
      <tbody>${i}</tbody>
    </table>
  `}function ct(){const t=document.getElementById("sftpScheduleSummary");if(!t)return;const o=(u().sftpBatches||[]).filter(c=>["ENCOLADO","PENDIENTE","PENDING"].includes((c.status||"").toUpperCase()));if(o.length===0){t.style.display="none";return}const n=document.getElementById("sftpScheduledDate"),a=n==null?void 0:n.value;let i;if(a){const c=new Date(a),l=c.toLocaleDateString("es-EC",{day:"numeric",month:"short",year:"numeric"}),d=c.toLocaleTimeString("es-EC",{hour:"2-digit",minute:"2-digit"});i=`📋 ${o.length} ${o.length===1?"archivo":"archivos"} en el buzón ${o.length===1?"será programado":"serán programados"} para el <strong>${l}, ${d}</strong>`}else i=`📋 ${o.length} ${o.length===1?"archivo encolado":"archivos encolados"} en el buzón. Selecciona una fecha y hora para programarlos.`;t.innerHTML=i,t.style.display="block"}async function ue(t){t.preventDefault();const e=L("#sftpUploadMessage");if(u().customerType!=="JURIDICO"){p(e,"Solo clientes jurídicos pueden programar pagos masivos.","error");return}const o=L("#sftpScheduledDate").value;if(!o){p(e,"Selecciona una fecha y hora de efectivización.","error");return}p(e,"⏳ Aplicando regla de efectivización...");try{const n=await At(o);p(e,`✅ Regla de efectivización aplicada. ${n.count||0} lotes del buzón programados para el ${o.replace("T"," ")}`,"success"),L("#sftpScheduledDate").value="",await O()}catch(n){p(e,n.message||"No se pudo aplicar la regla.","error")}}const h=t=>document.querySelector(t),Y=t=>Array.from(document.querySelectorAll(t));"scrollRestoration"in history&&(history.scrollRestoration="manual");let U=null;function pe(){dt(),U=setInterval(()=>O(!0),3e3)}function dt(){U!==null&&(clearInterval(U),U=null)}async function me(){const{coreUserId:t,coreStatus:e}=await pt();g({coreUserId:t}),h("#coreStatus").textContent=e;const s=h("#portalCoreStatus");s&&(s.textContent=e);const o=await mt();h("#switchStatus").textContent=o}async function tt(t){dt(),J(t),t==="transactions"&&await nt(),(t==="payments"||t==="reports")&&(await B(),t==="reports"&&X()),t==="sftp"&&(await O(),pe())}function fe(){lt()&&(k(),x())}function he(){h("#loginForm").addEventListener("submit",Bt),h("#logoutButton").addEventListener("click",Ut),h("#refreshButton").addEventListener("click",async()=>{var e;await x();const t=(e=h(".nav-item.is-active"))==null?void 0:e.dataset.section;t==="transactions"&&await nt(),(t==="payments"||t==="reports")&&(await B(),t==="reports"&&X()),t==="sftp"&&await O()}),h("#globalSearch").addEventListener("input",t=>de(t.target.value)),h("#applyTransactionsFilterButton").addEventListener("click",Mt),h("#clearTransactionsFilterButton").addEventListener("click",jt),h("#uploadForm").addEventListener("submit",ie),h("#loadBatchesButton").addEventListener("click",z),h("#batchSelector").addEventListener("change",()=>rt(I())),h("#csvFile").addEventListener("change",t=>{var e;h("#fileName").textContent=((e=t.target.files[0])==null?void 0:e.name)||"Seleccionar CSV"}),h("#sftpUploadForm").addEventListener("submit",ue),h("#loadSftpBatchesButton").addEventListener("click",O),h("#sftpScheduledDate").addEventListener("input",ct),Y(".nav-item").forEach(t=>{t.addEventListener("click",()=>tt(t.dataset.section))}),Y("[data-section-shortcut]").forEach(t=>{t.addEventListener("click",()=>tt(t.dataset.sectionShortcut))}),document.addEventListener("click",t=>{const e=t.target.closest("[data-process]");e&&ce(e.dataset.process);const s=t.target.closest("[data-report]");s&&Yt(s.dataset.report);const o=t.target.closest("[data-download]");o&&te(o.dataset.download),t.target.closest("[data-refresh-reports]")&&z(),t.target.closest("[data-feature-coming-soon]")&&alert("Estamos trabajando para tu futuro");const i=t.target.closest("[data-batch-duration]");i&&oe(i.dataset.batchDuration)})}he();me();fe();
