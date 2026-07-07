(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();const E={session:null,customerType:"NATURAL",coreUserId:null,accounts:[],transactions:[],batches:[],paymentBatches:[],sftpBatches:[],charges:[],companyAccount:null};function u(){return E}function g(t){Object.assign(E,t)}function K(){E.session&&localStorage.setItem("banquitoSession",JSON.stringify({session:E.session,customerType:E.customerType}))}function rt(){var e;const t=localStorage.getItem("banquitoSession");if(!t)return!1;try{const s=JSON.parse(t);return E.session=s.session,E.customerType=s.customerType||((e=s.session)==null?void 0:e.customerType)||"NATURAL",!0}catch{return localStorage.removeItem("banquitoSession"),!1}}async function v(t,e={}){const s=await fetch(t,e),a=(s.headers.get("content-type")||"").includes("application/json")?await s.json():await s.text();if(!s.ok){const c=typeof a=="object"?a.error||a.detail||a.message:a;throw new Error(c||`Error HTTP ${s.status}`)}return a}async function it(t,e){const s=await fetch(t);if(!s.ok){const c=await s.text();throw new Error(c||`Error HTTP ${s.status}`)}const o=await s.blob(),n=URL.createObjectURL(o),a=document.createElement("a");a.href=n,a.download=e,document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(n)}async function ct(){try{return await v("/api/core/v1/health"),{coreUserId:1,coreStatus:"Banca disponible",switchStatus:null}}catch{return{coreUserId:1,coreStatus:"Banca no disponible",switchStatus:null}}}async function dt(){try{return await v("/api/switch/v1/switch/health"),"Pagos disponibles"}catch{return"Pagos no disponibles"}}async function lt(t,e){return v("/api/core/v1/auth/customers/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,password:e})})}async function ut(t,e,s){return v("/api/core/v1/auth/customers/change-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,currentPassword:e,newPassword:s})})}async function pt(t,e){return v(`/api/core/v1/accounts/customer/${t}`,{headers:{"X-Core-User-Id":String(e)}})}async function mt(t,e){return v(`/api/core/v1/accounts/customer/${t}/transactions`,{headers:{"X-Core-User-Id":String(e)}})}async function ft(){var o;const e=(o=u().session)==null?void 0:o.identification,s=e?`/api/switch/v1/payment-batch?ruc=${encodeURIComponent(e)}`:"/api/switch/v1/payment-batch";return v(s)}async function ht(){return(await v("/api/switch/v1/billing/charges")).cargos||[]}async function gt(t){return(await v(`/api/switch/v1/billing/batches/${t}/detail`)).detalles||[]}async function vt(){return(await v("/api/switch/v1/billing/empresa-account")).cuentaEmpresa||null}async function yt(t){const e=new FormData;e.append("file",t),e.append("channel","PORTAL");const o=u().session;return o&&o.identification&&e.append("ruc",o.identification),v("/api/switch/v1/payment-batch/upload-csv",{method:"POST",body:e})}async function St(t){return v(`/api/switch/v1/payment-batch/${t}/process`,{method:"POST"})}async function Ct(t,e){const s={summary:`/api/switch/v1/billing/batches/${e}/summary`,detail:`/api/switch/v1/billing/batches/${e}/detail`,history:`/api/switch/v1/billing/batches/${e}/history`,charge:`/api/switch/v1/billing/batches/${e}/charge`,receipt:`/api/switch/v1/billing/batches/${e}/receipt`};return v(s[t])}async function bt(t,e){const s={"receipt-pdf":`/api/switch/v1/payment-batch/${e}/receipt`,"billing-novelties":`/api/switch/v1/billing/batches/${e}/novelties`},o={"receipt-pdf":`recibo_lote_${e}.pdf`,"billing-novelties":`novedades_${e}.csv`};return await it(s[t],o[t]),o[t]}async function $t(t){var n;const s=((n=u().session)==null?void 0:n.identification)||"",o=t.includes(":")&&t.split(":").length===2?t+":00":t;return v(`/api/switch/v1/payment-batch/schedule-queued?scheduledDate=${encodeURIComponent(o)}&ruc=${encodeURIComponent(s)}`,{method:"POST"})}function y(t){const e=Number(t||0);return new Intl.NumberFormat("es-EC",{style:"currency",currency:"USD"}).format(e)}function $(t){if(!t)return"Sin fecha";const e=new Date(t);return Number.isNaN(e.getTime())?t:new Intl.DateTimeFormat("es-EC",{dateStyle:"medium",timeStyle:"short"}).format(e)}function A(t){const e=String(t||"").toUpperCase();return["ACTIVO","COMPLETADA","SUCCESS","PROCESADO","APROBADO"].some(s=>e.includes(s))?"is-success":["ERROR","RECHAZ","REJECT","FALL","BLOQUEADO","INACTIVO"].some(s=>e.includes(s))?"is-danger":"is-neutral"}function Et(t){const e=String(t||"N/D");return e.length>4?`**** ${e.slice(-4)}`:e}function At(t){return String(t||"").toUpperCase().includes("CREDITO")?"is-credit":"is-debit"}function i(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function p(t,e,s=""){t.textContent=e||"",t.classList.toggle("is-error",s==="error"),t.classList.toggle("is-success",s==="success")}const w=t=>document.querySelector(t);async function Tt(){var e;const t=u();if((e=t.session)!=null&&e.customerId){try{const s=await pt(t.session.customerId,t.coreUserId||1);g({accounts:s})}catch(s){g({accounts:[]}),w("#accountsTable").innerHTML=`<div class="empty-state">${i(s.message)}</div>`}wt()}}function wt(){const t=u();w("#accountsMetric").textContent=t.accounts.length;const e=t.accounts.reduce((n,a)=>n+Number(a.availableBalance||0),0);w("#balanceMetric").textContent=y(e),Dt();const s=w("#accountsTable");if(!s)return;if(!t.accounts.length){s.innerHTML='<div class="empty-state">No hay cuentas disponibles para este cliente.</div>';return}const o=t.accounts.map(n=>`
      <tr>
        <td><strong>${i(n.accountNumber||"Sin numero")}</strong></td>
        <td>${i(n.accountSubtypeDescription||"Cuenta")}</td>
        <td>${y(n.accountingBalance)}</td>
        <td><strong class="amount-highlight" style="color: #02745c; font-size: 15px;">${y(n.availableBalance)}</strong></td>
        <td><span class="badge ${A(n.status)}">${i(n.status||"N/D")}</span></td>
        <td>${i(n.branchName||"N/D")}</td>
        <td>${n.openingDate?i(String(n.openingDate).split("T")[0]):"N/D"}</td>
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
  `}function Dt(){const t=u(),e=w("#dashboardAccounts");if(e){if(!t.accounts.length){e.innerHTML='<div class="empty-state">No hay cuentas disponibles para este cliente.</div>';return}e.innerHTML=t.accounts.slice(0,3).map(s=>`
      <article class="dashboard-account-card">
        <span>${i(s.accountSubtypeDescription||"Cuenta")}</span>
        <strong>${i(s.accountNumber||"Sin numero")}</strong>
        <div>
          <small>Disponible</small>
          <b>${y(s.availableBalance)}</b>
        </div>
        <em class="badge ${A(s.status)}">${i(s.status||"N/D")}</em>
      </article>
    `).join("")}}const m=t=>document.querySelector(t),P=t=>Array.from(document.querySelectorAll(t));async function Rt(t){t.preventDefault();const e=m("#loginMessage");p(e,"Validando credenciales...");const s=new FormData(t.currentTarget),o=s.get("username"),n=s.get("password");try{const a=await lt(o,n);if(a.passwordChangeRequired){p(e,"Cambio de contraseña requerido.","success"),Nt(o,n);return}const c=a.customerType;if(!c)throw new Error("No se pudo identificar el tipo de cliente. Intenta nuevamente en unos minutos.");g({session:a,customerType:c}),K(),p(e,"Ingreso correcto.","success"),z(),await H()}catch(a){p(e,a.message||"No se pudo iniciar sesion.","error")}}function Nt(t,e){m('[data-view="login"]').classList.add("is-hidden"),m('[data-view="password-change"]').classList.remove("is-hidden");const s=m("#passwordChangeForm");m("#currentPassword").value=e,s.onsubmit=async o=>{o.preventDefault();const n=m("#passwordChangeMessage"),a=m("#newPassword").value,c=m("#confirmPassword").value;if(a!==c){p(n,"Las contraseñas no coinciden.","error");return}if(a===e){p(n,"La nueva contraseña debe ser diferente a la actual.","error");return}p(n,"Actualizando contraseña...");try{const r=await ut(t,e,a),l=r.customerType;g({session:r,customerType:l}),K(),p(n,"Contraseña actualizada con éxito.","success"),m('[data-view="password-change"]').classList.add("is-hidden"),z(),await H()}catch(r){p(n,r.message||"Error al cambiar la contraseña.","error")}}}function z(){var s,o,n,a;m('[data-view="login"]').classList.add("is-hidden"),m('[data-view="password-change"]').classList.add("is-hidden"),m('[data-view="dashboard"]').classList.remove("is-hidden");const t=u(),e=t.customerType==="JURIDICO";m("#sessionType").textContent=e?"Cliente juridico":"Cliente natural",m("#sessionName").textContent=((s=t.session)==null?void 0:s.customerName)||((o=t.session)==null?void 0:o.username)||"Panel principal",m("#sessionMeta").textContent=`${((n=t.session)==null?void 0:n.identificationType)||"ID"} ${((a=t.session)==null?void 0:a.identification)||""}`.trim(),m("#sidebarType").textContent=e?"Perfil juridico":"Perfil natural",P(".company-only").forEach(c=>c.classList.toggle("is-hidden",!e)),P(".natural-only").forEach(c=>c.classList.toggle("is-hidden",e)),V("overview"),window.scrollTo({top:0,left:0,behavior:"auto"}),W()}function Lt(){const t=u();t.session=null,t.accounts=[],t.transactions=[],t.batches=[],t.charges=[],localStorage.removeItem("banquitoSession"),m("#loginForm").reset(),V("overview"),m('[data-view="dashboard"]').classList.add("is-hidden"),m('[data-view="login"]').classList.remove("is-hidden")}function V(t){!(u().customerType==="JURIDICO")&&["payments","reports","sftp"].includes(t)&&(t="overview"),P(".nav-item").forEach(o=>o.classList.toggle("is-active",o.dataset.section===t)),P("[data-section-panel]").forEach(o=>{o.classList.toggle("is-hidden",o.dataset.sectionPanel!==t)})}function W(){var S;const t=u();if(!t.session)return;const e=t.session,s=t.customerType==="JURIDICO",o=e.customerName||"Informacion del cliente",n=`${e.identificationType||"ID"} ${e.identification||""}`.trim(),a=["SUSPENDIDO","BLOQUEADO","INACTIVO","ACTIVO"],c=t.accounts||[],r=a.find(b=>c.some(T=>T.status===b))||((S=c[0])==null?void 0:S.status)||e.status||"N/D",l=r,d=r==="ACTIVO"?"is-success":r==="SUSPENDIDO"||r==="BLOQUEADO"?"is-danger":"is-neutral";m("#profileName").textContent=e.customerName||"Informacion del cliente",m("#profileDetails").innerHTML=`
    <section class="client-identity-card">
      <div class="client-avatar">${s?"CO":"CL"}</div>
      <div>
        <span>${s?"Cliente juridico":"Cliente natural"}</span>
        <strong>${i(o)}</strong>
        <small>${i(n||"Identificacion no disponible")}</small>
      </div>
      <em class="badge ${d}">${i(l)}</em>
    </section>

    <section class="bank-reference-card">
      <span>Referencia bancaria</span>
      <strong>BanQuito</strong>
      <p>Cliente verificado para consultas digitales, productos bancarios y servicios empresariales habilitados.</p>
    </section>

    <section class="profile-info-grid">
      ${[["Usuario digital",e.username],["Correo registrado",e.email],["Telefono de contacto",e.mobilePhone],["Ultimo ingreso",$(e.lastLogin)]].map(([b,T])=>`
          <div>
            <dt>${i(b)}</dt>
            <dd>${i(T||"N/D")}</dd>
          </div>
        `).join("")}
    </section>

    <section class="profile-map-card">
      <div>
        <span>Ubicacion registrada</span>
        <strong>${i(e.address||"Direccion no disponible")}</strong>
      </div>
      <div class="map-lines" aria-hidden="true"></div>
    </section>
  `}async function H(){await Tt(),W()}const O=t=>document.querySelector(t);async function Y(){var e;const t=u();if((e=t.session)!=null&&e.customerId){try{const s=await mt(t.session.customerId,t.coreUserId||1);g({transactions:s})}catch(s){g({transactions:[]}),O("#transactionsTable").innerHTML=`<div class="empty-state">${i(s.message)}</div>`}It()}}function It(){const t=u(),e=O("#transactionsMetric");e&&(e.textContent=t.transactions.length);const s=O("#recentTransactions"),o=O("#transactionsTable");if(!t.transactions.length){const r='<div class="empty-state">Sin transacciones registradas.</div>';s&&(s.innerHTML=r),o.innerHTML=r;return}const n=r=>{const l=(r||"").toUpperCase();return l==="COMPLETADA"?"Exitoso":l==="RECHAZADA"?"Rechazado":r||"N/D"},c=`
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
      <tbody>${t.transactions.map(r=>{const l=(r.movementType||"").toUpperCase()==="DEBITO",d=r.counterpartAccountNumber||"—";return`
      <tr>
        <td>${i(l?r.accountNumber||"N/D":d)}</td>
        <td>${i(l?d:r.accountNumber||"N/D")}</td>
        <td><span class="badge ${At(r.movementType)}">${i(r.movementType||"N/D")}</span></td>
        <td>${y(r.amount)}</td>
        <td>${y(r.resultingBalance)}</td>
        <td><span class="badge ${A(r.status)}">${i(n(r.status))}</span></td>
        <td>${$(r.transactionDate)}</td>
        <td>${i(r.message||"N/D")}</td>
      </tr>
    `}).join("")}</tbody>
    </table>
  `;o.innerHTML=c,s&&(s.innerHTML=`<div class="table-wrap compact-table">${c}</div>`)}const x=t=>document.querySelector(t),Ot={summary:"Resumen del lote",detail:"Detalle del lote",charge:"Cargo del lote",receipt:"Comprobante del lote"},Bt={id:"Referencia",fileName:"Archivo",ruc:"RUC",status:"Estado",headerTotalRecords:"Registros",headerTotalAmount:"Monto total",totalAmount:"Monto total",amount:"Monto",chargeAmount:"Valor comision",commissionAmount:"Valor comision",feeAmount:"Valor comision",totalChargeAmount:"Valor comision",chargeStatus:"Respuesta del proceso",commissionStatus:"Estado comision",chargeDate:"Fecha de cobro",receivedAt:"Recibido",createdAt:"Creado",processedAt:"Procesado",updatedAt:"Actualizado",validationResult:"Validacion",batchStatus:"Estado del lote",accountNumber:"Cuenta",description:"Descripcion",message:"Mensaje",notificationStatus:"Estado notif.",rejectionReason:"Motivo rechazo",lineNumber:"Linea",beneficiaryName:"Beneficiario",identification:"Identificacion",identificationNumber:"Identificacion",executedAt:"Ejecutado"},Ut=["fileName","ruc","status","validationResult","batchStatus","headerTotalRecords","totalRecords","processedRecords","successfulRecords","failedRecords","headerTotalAmount","totalAmount","amount","chargeAmount","receivedAt","processedAt","createdAt","message"],M=["chargeAmount","commissionAmount","feeAmount","amount","totalChargeAmount"],Pt=["chargeStatus","commissionStatus","status","result"],Mt=["lineNumber","accountNumber","beneficiaryName","identification","identificationNumber","amount","status","validationResult","notificationStatus","rejectionReason","message","description","executedAt","createdAt","processedAt"],jt=new Set(["id","batchId","customerId","userId","createdBy","updatedBy","deletedBy","version","trace","stack","rawPayload","payload"]);function j(t,e){return!(e==null||e===""||Array.isArray(e)||typeof e=="object"||jt.has(t)||t.startsWith("_"))}function J(t){return Bt[t]||t.replace(/([A-Z])/g," $1").replace(/^./,e=>e.toUpperCase())}function tt(t,e){if(e==null||e==="")return"N/D";const s=t.toLowerCase();return s.includes("amount")||s.includes("monto")||s.includes("balance")?y(e):s.includes("date")||s.includes("at")||s.includes("fecha")?$(e):String(e)}function Ht(t){return String(t||"").trim().toUpperCase()}function B(t){return String((t==null?void 0:t.id)||(t==null?void 0:t.batchId)||(t==null?void 0:t.reference)||"")}function k(){var t,e;return((e=(t=x("#batchSelector"))==null?void 0:t.value)==null?void 0:e.trim())||""}function N(){const t=k();return u().batches.find(e=>B(e)===t)||null}function D(t,e){if(!t||typeof t!="object")return;const s=e.find(o=>t[o]!==void 0&&t[o]!==null&&t[o]!=="");return s?t[s]:void 0}function xt(t,e){return!t||typeof t!="object"?!1:[t.batchId,t.paymentBatchId,t.loteId,t.idLote,t.reference].filter(s=>s!=null).some(s=>String(s)===String(e))}function Ft(t,e){const s=u().charges.find(o=>xt(o,t));return s||(Array.isArray(e)?e.find(o=>D(o,M)):e&&typeof e=="object"&&D(e,M)?e:null)}function zt(t,e){const s=Ft(t,e),o=Ht(D(e,Pt)),n=D(s,M)??D(e,M),a=Number(n||0)>0,c=["REJECTED","RECHAZADO","FAILED","ERROR"].some(S=>o.includes(S));if(!s&&!a&&!o)return"";const r=s||a?"Comision registrada":"Sin cargo confirmado",l=s||a?"is-success":"is-neutral",d=c&&(s||a)?"La respuesta del proceso vino rechazada, pero existe evidencia de comision registrada. No se interpreta como comision pendiente.":"Validado con la informacion operativa disponible para el lote.";return`
    <div class="charge-reconciliation">
      <div>
        <span>Estado operativo del cobro</span>
        <strong class="badge ${l}">${i(r)}</strong>
      </div>
      <div>
        <span>Valor comision</span>
        <strong>${i(y(n||0))}</strong>
      </div>
      <p>${i(d)}</p>
    </div>
  `}function et(t){return`<span class="badge ${A(t)}">${i(t||"N/D")}</span>`}function Vt(t,e){return e&&typeof e=="object"&&!Array.isArray(e)?e.status||e.batchStatus||e.validationResult||(t==null?void 0:t.status)||"Generado":(t==null?void 0:t.status)||"Generado"}function Jt(t,e,s,o){const a=u().session||{},c=new Intl.DateTimeFormat("es-EC",{dateStyle:"medium",timeStyle:"short"}).format(new Date),r=Vt(s,o),l=Ot[t]||"Reporte del lote";return`
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
          <h3>${i(l)}</h3>
          <p>${i((s==null?void 0:s.fileName)||`Referencia de lote ${e}`)}</p>
        </div>
        <div class="bank-report-status">
          ${et(r)}
          <small>Emitido ${i(c)}</small>
        </div>
      </header>

      <dl class="bank-report-context">
        <div>
          <dt>Cliente</dt>
          <dd>${i(a.customerName||"Cliente juridico")}</dd>
        </div>
        <div>
          <dt>Identificacion</dt>
          <dd>${i(`${a.identificationType||"RUC"} ${a.identification||(s==null?void 0:s.ruc)||"N/D"}`.trim())}</dd>
        </div>
        <div>
          <dt>Lote consultado</dt>
          <dd>${i((s==null?void 0:s.fileName)||`Lote ${e}`)}</dd>
        </div>
        <div>
          <dt>Fecha de recepcion</dt>
          <dd>${i($(s==null?void 0:s.receivedAt))}</dd>
        </div>
      </dl>

      ${t==="charge"?zt(e,o):""}

      <section class="bank-report-body">
        <div class="bank-report-section-title">
          <span>Contenido del informe</span>
          <strong>${i(l)}</strong>
        </div>
        ${qt(o)}
      </section>

      <footer class="bank-report-footer">
        <span>Documento informativo generado desde Banca Web BanQuito.</span>
        <strong>Grupo 1 - Switch de pagos</strong>
      </footer>
    </article>
  `}function st(t){const e=x("#selectedBatchPreview");if(e){if(!t){e.className="selected-batch empty-state",e.innerHTML="Carga los lotes disponibles para elegir una operacion.";return}e.className="selected-batch",e.innerHTML=`
    <div>
      <span>Archivo</span>
      <strong>${i(t.fileName||"Archivo CSV")}</strong>
    </div>
    <div>
      <span>RUC</span>
      <strong>${i(t.ruc||"N/D")}</strong>
    </div>
    <div>
      <span>Estado</span>
      ${et(t.status)}
    </div>
    <div>
      <span>Monto</span>
      <strong>${y(t.headerTotalAmount)}</strong>
    </div>
    <div>
      <span>Recibido</span>
      <strong>${i($(t.receivedAt))}</strong>
    </div>
  `}}function q(){const t=x("#batchSelector");if(!t)return;const e=u(),s=t.value,o=e.batches.slice().sort((n,a)=>Number(a.id||a.batchId||0)-Number(n.id||n.batchId||0));t.innerHTML=['<option value="">Selecciona por archivo, RUC o fecha</option>',...o.map(n=>{const a=B(n),c=[n.fileName||"Archivo CSV",n.ruc?`RUC ${n.ruc}`:"RUC N/D",n.status||"Estado N/D",y(n.headerTotalAmount),$(n.receivedAt)].join(" - ");return`<option value="${i(a)}">${i(c)}</option>`})].join(""),s&&o.some(n=>B(n)===s)?t.value=s:o.length&&(t.value=B(o[0])),st(N())}function kt(t){const e=Ut.filter(n=>Object.prototype.hasOwnProperty.call(t,n)).filter(n=>j(n,t[n])),s=Object.keys(t).filter(n=>!e.includes(n)).filter(n=>j(n,t[n])).slice(0,10-e.length),o=[...e,...s].map(n=>[n,t[n]]);return o.length?`
    <dl class="report-ledger">
      ${o.map(([n,a])=>`
        <div>
          <dt>${i(J(n))}</dt>
          <dd>${i(tt(n,a))}</dd>
        </div>
      `).join("")}
    </dl>
  `:""}function G(t){if(!t.length)return'<div class="empty-state">Sin registros para mostrar.</div>';const e=Mt.filter(n=>t.some(a=>j(n,a==null?void 0:a[n]))),s=Array.from(t.reduce((n,a)=>(Object.keys(a||{}).forEach(c=>{!e.includes(c)&&j(c,a[c])&&n.add(c)}),n),new Set)).slice(0,Math.max(0,10-e.length)),o=[...e,...s];return o.length?`
    <div class="table-wrap report-table">
      <table>
        <thead>
          <tr>${o.map(n=>`<th>${i(J(n))}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${t.map(n=>`
            <tr>
              ${o.map(a=>`<td>${i(tt(a,n==null?void 0:n[a]))}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `:'<div class="empty-state">El reporte no contiene campos operativos para mostrar.</div>'}function qt(t){if(Array.isArray(t))return G(t);if(!t||typeof t!="object")return`<div class="report-note">${i(t||"Sin datos.")}</div>`;const e=Object.entries(t).filter(([,s])=>Array.isArray(s)).map(([s,o])=>`
      <section class="report-section">
        <h3>${i(J(s))}</h3>
        ${G(o)}
      </section>
    `).join("");return`${kt(t)}${e||'<div class="report-note">Sin movimientos o novedades relevantes para mostrar.</div>'}`}function C(t,e=""){const s=x("#reportOutput");s.classList.remove("is-error","is-success","is-info"),e&&s.classList.add(`is-${e}`),s.innerHTML=t}async function Gt(t){const e=k();if(!e){C('<div class="report-empty"><strong>Selecciona un lote.</strong><span>Actualiza la lista y elige por archivo, RUC o fecha antes de consultar.</span></div>',"error");return}try{C('<div class="report-empty"><strong>Consultando reporte...</strong><span>Estamos preparando la informacion del lote seleccionado.</span></div>');const s=await Ct(t,e),o=N();C(Jt(t,e,o,s))}catch(s){const o=s.message||"",n=N(),a=((n==null?void 0:n.status)||"").toUpperCase(),c=["PROCESADO","EXITOSO","PROCESSED","SUCCESS"].includes(a);if(o.includes("No service charge found")||o.includes("No hay cargo")){C(c?`
          <div class="report-empty">
            <strong>Información de cargo no disponible</strong>
            <span>El lote fue procesado pero no se generó un cargo de servicio registrado. Contacte al administrador del sistema para más detalles.</span>
          </div>
        `:`
          <div class="report-empty">
            <strong>Lote en espera de procesamiento</strong>
            <span>Este lote se encuentra en estado ${i((n==null?void 0:n.status)||"PENDIENTE")}. El reporte estará disponible automáticamente una vez que el banco procese la operación.</span>
          </div>
        `,"info");return}C(`<div class="report-empty"><strong>No se pudo consultar el reporte.</strong><span>${i(s.message)}</span></div>`,"error")}}async function Qt(t){const e=k();if(!e){C('<div class="report-empty"><strong>Selecciona un lote.</strong><span>Actualiza la lista y elige por archivo, RUC o fecha antes de descargar.</span></div>',"error");return}try{C('<div class="report-empty"><strong>Preparando descarga...</strong><span>El archivo se generara con la referencia interna del lote seleccionado.</span></div>');const s=await bt(t,e);C(`
      <div class="download-card">
        <span>Descarga generada</span>
        <strong>${i(s)}</strong>
        <small>Operacion completada para el lote seleccionado.</small>
      </div>
    `,"success")}catch(s){const o=s.message||"",n=N(),a=((n==null?void 0:n.status)||"").toUpperCase(),c=["PROCESADO","EXITOSO","PROCESSED","SUCCESS"].includes(a);if(o.includes("No service charge found")||o.includes("No hay cargo")){C(c?`
          <div class="report-empty">
            <strong>Archivo no disponible</strong>
            <span>El lote fue procesado pero el archivo solicitado no está disponible. Contacte al administrador del sistema.</span>
          </div>
        `:`
          <div class="report-empty">
            <strong>Comprobante aún no generado</strong>
            <span>El lote aún no ha sido procesado. Estará disponible una vez que el lote pase a estado EXITOSO.</span>
          </div>
        `,"info");return}C(`<div class="report-empty"><strong>No se pudo generar la descarga.</strong><span>${i(s.message)}</span></div>`,"error")}}const f=t=>document.querySelector(t);function Q(){var s;const t=u(),e=t.accounts.find(o=>o.isFavorite);return(e==null?void 0:e.accountNumber)||((s=t.accounts[0])==null?void 0:s.accountNumber)||null}async function F(){var s;const t=u();if(t.customerType!=="JURIDICO")return;try{const o=await ft(),n=(s=t.session)==null?void 0:s.identification,a=o.filter(c=>!n||c.ruc===n);g({batches:a,paymentBatches:a})}catch(o){g({batches:[],paymentBatches:[]}),f("#batchesTable").innerHTML=`<div class="empty-state">${i(o.message)}</div>`}Zt();const e=document.getElementById("batchesTable");e&&e.scrollIntoView({behavior:"smooth",block:"start"})}async function _t(){if(u().customerType!=="JURIDICO")return;try{const s=await ht();g({charges:s})}catch{g({charges:[]})}const e=f("#chargesMetric");e&&(e.textContent=u().charges.length)}async function Xt(){if(u().customerType!=="JURIDICO")return;try{const n=await vt();g({companyAccount:n})}catch{g({companyAccount:Q()})}u().companyAccount||g({companyAccount:Q()});const s=Et(u().companyAccount),o=f("#companyAccountMetric");o&&(o.textContent=s),f("#companyAccountHero").textContent=s}function Zt(){var l;const t=u(),e=f("#batchesMetric"),s=t.paymentBatches||[];e&&(e.textContent=s.length);const o=f("#batchesTable"),n=f("#recentBatches");if(!s.length){const d='<div class="empty-state">Sin lotes cargados todavia.</div>';o.innerHTML=d,n&&(n.innerHTML=d);return}const a=(l=t.session)==null?void 0:l.identification,r=`
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
      <tbody>${s.slice().filter(d=>!d.channel||!(d.channel+"").toLowerCase().includes("sftp")).filter(d=>!a||d.ruc===a).filter(d=>!["PROGRAMADO","SCHEDULED"].includes((d.status||"").toUpperCase())).sort((d,S)=>(S.id||0)-(d.id||0)).map(d=>`
      <tr>
        <td>${i(d.id||"N/D")}</td>
        <td>${i(d.fileName||"Archivo CSV")}</td>
        <td>${i(d.ruc||"N/D")}</td>
        <td><span class="badge ${A(d.status)}">${i(d.status||"N/D")}</span></td>
        <td>${i(d.headerTotalRecords||0)}</td>
        <td>${y(d.headerTotalAmount)}</td>
        <td>${$(d.receivedAt)}</td>

      </tr>
    `).join("")}</tbody>
    </table>
  `;o.innerHTML=r,n&&(n.innerHTML=`<div class="table-wrap compact-table">${r}</div>`),q()}const nt=["PROCESADO","PROCESSED","REJECTED","RECHAZADO"],Kt=["SUCCESS","REJECTED"];function _(t){const e=Math.floor(t/1e3),s=Math.floor(e/60).toString().padStart(2,"0"),o=(e%60).toString().padStart(2,"0");return`${s}:${o}`}function Wt(t){const e=t.length,s=t.filter(d=>(d.status||"").toUpperCase()==="SUCCESS").length,o=t.filter(d=>(d.status||"").toUpperCase()==="REJECTED").length,n=s+o,a=f("#uploadCounts");a&&(a.textContent=`${n} / ${e} procesadas (${s} exitosas, ${o} rechazadas)`);const c=f("#uploadProgressBar");c&&(c.style.width=e?`${Math.round(n/e*100)}%`:"0%");const r=f("#uploadLiveRows");if(!r)return;const l=t.filter(d=>Kt.includes((d.status||"").toUpperCase())).slice(-15).reverse();if(!l.length){r.innerHTML='<div class="empty-state">Analizando líneas del archivo...</div>';return}r.innerHTML=`
    <table>
      <thead>
        <tr><th>Línea</th><th>Cuenta destino</th><th>Monto</th><th>Estado</th></tr>
      </thead>
      <tbody>
        ${l.map(d=>`
          <tr>
            <td>${i(d.lineNumber)}</td>
            <td>${i(d.destinationAccountNumber)}</td>
            <td>${y(d.amount)}</td>
            <td><span class="badge ${A(d.status)}">${i(d.status)}</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `}function Yt(t,e){const s=f("#uploadProgressPanel"),o=f("#uploadTimer");s==null||s.classList.remove("is-hidden"),o&&(o.textContent="00:00");const n=Date.now(),a=setInterval(()=>{o&&(o.textContent=_(Date.now()-n))},1e3);let c=0;const r=setInterval(async()=>{c++;try{const[l]=await Promise.all([gt(e),I()]);Wt(l);const d=u().batches.find(b=>Number(b.id)===e),S=((d==null?void 0:d.status)||"").toUpperCase();if(d&&nt.includes(S)){clearInterval(r),clearInterval(a);const b=_(Date.now()-n);o&&(o.textContent=b);const T=["PROCESADO","PROCESSED"].includes(S);p(t,`Procesamiento completado en ${b}. Estado final: ${d.status}`,T?"success":"error");return}}catch{}c>=600&&(clearInterval(r),clearInterval(a),p(t,"El procesamiento está tomando más tiempo del esperado. Actualiza la lista manualmente.","error"))},2e3)}async function te(t){t.preventDefault();const e=f("#uploadMessage");if(u().customerType!=="JURIDICO"){p(e,"Solo clientes juridicos pueden enviar pagos masivos.","error");return}const o=f("#csvFile").files[0];if(!o){p(e,"Selecciona un archivo CSV.","error");return}const n=f("#uploadProgressPanel");n==null||n.classList.add("is-hidden");const a=f("#uploadLiveRows");a&&(a.innerHTML="");const c=f("#uploadCounts");c&&(c.textContent="0 / 0 procesadas");const r=f("#uploadProgressBar");r&&(r.style.width="0%"),p(e,"Enviando archivo de pagos...");try{const l=await yt(o);await I();const d=Number(l.batchId),S=(l.batchStatus||"").toUpperCase();if(nt.includes(S)){const b=["PROCESADO","PROCESSED"].includes(S);p(e,`Resultado: ${l.validationResult||"procesado"} | Estado: ${l.batchStatus}`,b?"success":"error")}else p(e,"Lote recibido. Procesando pagos automáticamente... ⏳"),Yt(e,d)}catch(l){p(e,l.message||"No se pudo cargar el CSV.","error")}}async function ee(t){if(u().customerType==="JURIDICO")try{const s=await St(t);f("#reportOutput").textContent=typeof s=="string"?s:JSON.stringify(s,null,2),await I()}catch(s){f("#reportOutput").textContent=s.message}}async function I(){u().customerType==="JURIDICO"&&await Promise.all([F(),_t(),Xt()])}function se(t){const e=t.trim().toLowerCase();document.querySelectorAll("tbody tr, .account-card").forEach(s=>{const o=!e||s.textContent.toLowerCase().includes(e);s.classList.toggle("is-filtered",!o)})}const R=t=>document.querySelector(t);async function L(t=!1){if(u().customerType!=="JURIDICO")return;const s=t?null:document.getElementById("loadSftpBatchesButton");s&&(s.disabled=!0,s.innerHTML='<span class="btn-spinner">⟳</span> Actualizando...');try{const n=(await v("/api/switch/v1/payment-batch")).filter(a=>(a.channel+"").toLowerCase().includes("sftp"));g({sftpBatches:n}),ne(),ot()}catch(o){if(g({sftpBatches:[]}),!t){const n=R("#sftpBatchesTable");n&&(n.innerHTML=`<div class="empty-state">${i(o.message)}</div>`)}}finally{s&&(s.disabled=!1,s.innerHTML="⟳ Actualizar")}}function ne(){const e=u().sftpBatches||[],s=R("#sftpBatchesTable");if(!s)return;if(!e.length){s.innerHTML=`
      <div class="empty-state">
        <strong>No hay archivos en el buzón.</strong>
        <br><small>Cuando subas un CSV via SFTP o programes un lote, aparecerá aquí con su estado.</small>
      </div>`;return}const o=e.filter(r=>["PROGRAMADO","PENDIENTE","SCHEDULED","PENDING","RECIBIDO"].includes((r.status||"").toUpperCase())),n=e.filter(r=>!["PROGRAMADO","PENDIENTE","SCHEDULED","PENDING","RECIBIDO"].includes((r.status||"").toUpperCase())),c=[...o.sort((r,l)=>new Date(r.scheduledDate||r.receivedAt).getTime()-new Date(l.scheduledDate||l.receivedAt).getTime()),...n.sort((r,l)=>(l.id||0)-(r.id||0))].map(r=>`
        <tr${["PROGRAMADO","PENDIENTE","SCHEDULED","PENDING","RECIBIDO"].includes((r.status||"").toUpperCase())?' class="row-pending"':""}>
          <td>${i(String(r.id||"N/D"))}</td>
          <td>${i(r.fileName||"archivo.csv")}</td>
          <td><span class="badge ${A(r.status)}">${i(r.status||"N/D")}</span></td>
          <td>${i(String(r.headerTotalRecords||0))}</td>
          <td>${y(r.headerTotalAmount)}</td>
          <td>${$(r.receivedAt)}</td>
          <td>
            ${r.scheduledDate?`<span class="badge badge-info">📅 ${$(r.scheduledDate)}</span>`:'<span class="text-muted">Inmediato</span>'}
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
  `}function ot(){const t=document.getElementById("sftpScheduleSummary");if(!t)return;const o=(u().sftpBatches||[]).filter(r=>["ENCOLADO","PENDIENTE","PENDING"].includes((r.status||"").toUpperCase()));if(o.length===0){t.style.display="none";return}const n=document.getElementById("sftpScheduledDate"),a=n==null?void 0:n.value;let c;if(a){const r=new Date(a),l=r.toLocaleDateString("es-EC",{day:"numeric",month:"short",year:"numeric"}),d=r.toLocaleTimeString("es-EC",{hour:"2-digit",minute:"2-digit"});c=`📋 ${o.length} ${o.length===1?"archivo":"archivos"} en el buzón ${o.length===1?"será programado":"serán programados"} para el <strong>${l}, ${d}</strong>`}else c=`📋 ${o.length} ${o.length===1?"archivo encolado":"archivos encolados"} en el buzón. Selecciona una fecha y hora para programarlos.`;t.innerHTML=c,t.style.display="block"}async function oe(t){t.preventDefault();const e=R("#sftpUploadMessage");if(u().customerType!=="JURIDICO"){p(e,"Solo clientes jurídicos pueden programar pagos masivos.","error");return}const o=R("#sftpScheduledDate").value;if(!o){p(e,"Selecciona una fecha y hora de efectivización.","error");return}p(e,"⏳ Aplicando regla de efectivización...");try{const n=await $t(o);p(e,`✅ Regla de efectivización aplicada. ${n.count||0} lotes del buzón programados para el ${o.replace("T"," ")}`,"success"),R("#sftpScheduledDate").value="",await L()}catch(n){p(e,n.message||"No se pudo aplicar la regla.","error")}}const h=t=>document.querySelector(t),X=t=>Array.from(document.querySelectorAll(t));"scrollRestoration"in history&&(history.scrollRestoration="manual");let U=null;function ae(){at(),U=setInterval(()=>L(!0),3e3)}function at(){U!==null&&(clearInterval(U),U=null)}async function re(){const{coreUserId:t,coreStatus:e}=await ct();g({coreUserId:t}),h("#coreStatus").textContent=e;const s=h("#portalCoreStatus");s&&(s.textContent=e);const o=await dt();h("#switchStatus").textContent=o}async function Z(t){at(),V(t),t==="transactions"&&await Y(),(t==="payments"||t==="reports")&&(await I(),t==="reports"&&q()),t==="sftp"&&(await L(),ae())}function ie(){rt()&&(z(),H())}function ce(){h("#loginForm").addEventListener("submit",Rt),h("#logoutButton").addEventListener("click",Lt),h("#refreshButton").addEventListener("click",async()=>{var e;await H();const t=(e=h(".nav-item.is-active"))==null?void 0:e.dataset.section;t==="transactions"&&await Y(),(t==="payments"||t==="reports")&&(await I(),t==="reports"&&q()),t==="sftp"&&await L()}),h("#globalSearch").addEventListener("input",t=>se(t.target.value)),h("#uploadForm").addEventListener("submit",te),h("#loadBatchesButton").addEventListener("click",F),h("#batchSelector").addEventListener("change",()=>st(N())),h("#csvFile").addEventListener("change",t=>{var e;h("#fileName").textContent=((e=t.target.files[0])==null?void 0:e.name)||"Seleccionar CSV"}),h("#sftpUploadForm").addEventListener("submit",oe),h("#loadSftpBatchesButton").addEventListener("click",L),h("#sftpScheduledDate").addEventListener("input",ot),X(".nav-item").forEach(t=>{t.addEventListener("click",()=>Z(t.dataset.section))}),X("[data-section-shortcut]").forEach(t=>{t.addEventListener("click",()=>Z(t.dataset.sectionShortcut))}),document.addEventListener("click",t=>{const e=t.target.closest("[data-process]");e&&ee(e.dataset.process);const s=t.target.closest("[data-report]");s&&Gt(s.dataset.report);const o=t.target.closest("[data-download]");o&&Qt(o.dataset.download),t.target.closest("[data-refresh-reports]")&&F(),t.target.closest("[data-feature-coming-soon]")&&alert("Estamos trabajando para tu futuro")})}ce();re();ie();
