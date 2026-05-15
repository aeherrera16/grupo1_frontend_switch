import './styles.css';
import { checkServices, checkSwitchService } from './services/api';
import { restoreSession as restoreSessionHook, getState, setState } from './hooks/useState';
import { login, logout, showDashboard, activateSection, renderProfile, refreshAll } from './pages/LoginPage';
import { loadAccounts, renderAccounts } from './pages/AccountsPage';
import { loadTransactions, renderTransactions } from './pages/TransactionsPage';
import { loadBatches, uploadCsvHandler, processBatchHandler, refreshCompanyData } from './pages/PaymentsPage';
import { runReportHandler, runDownloadHandler } from './pages/ReportsPage';
import { filterVisibleRows } from './pages/DashboardPage';

const $ = (selector: string): any => document.querySelector(selector);
const $$ = (selector: string): any[] => Array.from(document.querySelectorAll(selector));

async function checkServicesStatus() {
  const { coreUserId, coreStatus } = await checkServices();
  setState({ coreUserId });
  $('#coreStatus').textContent = coreStatus;

  const switchStatus = await checkSwitchService();
  $('#switchStatus').textContent = switchStatus;
}

function restoreSession() {
  const restored = restoreSessionHook();
  if (restored) {
    showDashboard();
    refreshAll();
  }
}

function bindEvents() {
  $('#loginForm').addEventListener('submit', login);
  $('#logoutButton').addEventListener('click', logout);
  $('#refreshButton').addEventListener('click', refreshAll);
  $('#globalSearch').addEventListener('input', (event: any) => filterVisibleRows(event.target.value));
  $('#uploadForm').addEventListener('submit', uploadCsvHandler);
  $('#loadBatchesButton').addEventListener('click', loadBatches);
  $('#csvFile').addEventListener('change', (event: any) => {
    $('#fileName').textContent = event.target.files[0]?.name || 'Seleccionar CSV';
  });

  $$('.nav-item').forEach((button: any) => {
    button.addEventListener('click', () => activateSection(button.dataset.section));
  });

  document.addEventListener('click', (event: any) => {
    const processButton = event.target.closest('[data-process]');
    if (processButton) processBatchHandler(processButton.dataset.process);

    const reportButton = event.target.closest('[data-report]');
    if (reportButton) runReportHandler(reportButton.dataset.report);

    const downloadButton = event.target.closest('[data-download]');
    if (downloadButton) runDownloadHandler(downloadButton.dataset.download);
  });
}

bindEvents();
checkServicesStatus();
restoreSession();
