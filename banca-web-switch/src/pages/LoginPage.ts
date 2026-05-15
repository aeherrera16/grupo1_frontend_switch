import { login as loginApi } from '../services/api';
import { getState, setState, saveSession } from '../hooks/useState';
import { setMessage, escapeHtml, formatDate } from '../utils/formatters';
import { loadAccounts } from './AccountsPage';
import { loadTransactions } from './TransactionsPage';
import { refreshCompanyData } from './PaymentsPage';

const $ = (selector: string): any => document.querySelector(selector);
const $$ = (selector: string): any[] => Array.from(document.querySelectorAll(selector));

async function login(event: SubmitEvent) {
  event.preventDefault();
  const loginMessage = $('#loginMessage');
  setMessage(loginMessage, 'Validando credenciales en Core...');

  const form = new FormData(event.currentTarget as HTMLFormElement);

  try {
    const session = await loginApi(form.get('username') as string, form.get('password') as string);

    const realType = session.customerType;
    if (!realType) {
      throw new Error('Core no devolvio el tipo de cliente. Reinicia el servicio Core para cargar los cambios.');
    }

    setState({ session, customerType: realType });
    saveSession();
    setMessage(loginMessage, 'Ingreso correcto.', 'success');
    showDashboard();
    await refreshAll();
  } catch (error: any) {
    setMessage(loginMessage, error.message || 'No se pudo iniciar sesion.', 'error');
  }
}

function showDashboard() {
  $('[data-view="login"]').classList.add('is-hidden');
  $('[data-view="dashboard"]').classList.remove('is-hidden');

  const state = getState();
  const isCompany = state.customerType === 'JURIDICO';
  $('#sessionType').textContent = isCompany ? 'Cliente juridico' : 'Cliente natural';
  $('#sessionName').textContent = state.session?.customerName || state.session?.username || 'Dashboard';
  $('#sessionMeta').textContent = `${state.session?.identificationType || 'ID'} ${state.session?.identification || ''}`.trim();
  $('#sidebarType').textContent = isCompany ? 'Perfil juridico' : 'Perfil natural';

  $$('.company-only').forEach((element: any) => element.classList.toggle('is-hidden', !isCompany));
  $$('.natural-only').forEach((element: any) => element.classList.toggle('is-hidden', isCompany));

  const activeSection = $('.nav-item.is-active')?.dataset.section;
  if (!isCompany && ['payments', 'reports'].includes(activeSection)) {
    activateSection('overview');
  }

  renderProfile();
}

function logout() {
  const state = getState();
  state.session = null;
  state.accounts = [];
  state.transactions = [];
  state.batches = [];
  state.charges = [];
  localStorage.removeItem('banquitoSession');
  $('#loginForm').reset();
  activateSection('overview');
  $('[data-view="dashboard"]').classList.add('is-hidden');
  $('[data-view="login"]').classList.remove('is-hidden');
}

function activateSection(section: string) {
  const state = getState();
  const isCompany = state.customerType === 'JURIDICO';
  if (!isCompany && ['payments', 'reports'].includes(section)) section = 'overview';

  $$('.nav-item').forEach((button: any) => button.classList.toggle('is-active', button.dataset.section === section));
  $$('[data-section-panel]').forEach((panel: any) => {
    panel.classList.toggle('is-hidden', panel.dataset.sectionPanel !== section);
  });
}

function renderProfile() {
  const state = getState();
  if (!state.session) return;

  const session = state.session;
  $('#profileName').textContent = session.customerName || 'Informacion del cliente';
  $('#profileDetails').innerHTML = [
    ['Tipo', state.customerType === 'JURIDICO' ? 'Juridico' : 'Natural'],
    ['Identificacion', `${session.identificationType || 'N/D'} ${session.identification || ''}`.trim()],
    ['Usuario', session.username],
    ['Correo', session.email],
    ['Telefono', session.mobilePhone],
    ['Direccion', session.address],
    ['Estado credencial', session.status],
    ['Ultimo ingreso', formatDate(session.lastLogin)],
  ]
    .map(([label, value]) => `
      <div>
        <dt>${escapeHtml(label)}</dt>
        <dd>${escapeHtml(value || 'N/D')}</dd>
      </div>
    `)
    .join('');
}

async function refreshAll() {
  await Promise.all([loadAccounts(), loadTransactions(), refreshCompanyData()]);
}

export {
  login,
  logout,
  showDashboard,
  activateSection,
  renderProfile,
  refreshAll,
};
