import { runReport, runDownload } from '../services/api';
import { getState } from '../hooks/useState';

const $ = (selector: string): any => document.querySelector(selector);

async function runReportHandler(type: string) {
  const batchId = $('#batchIdInput').value.trim();
  if (!batchId) {
    $('#reportOutput').textContent = 'Ingresa el ID del lote.';
    return;
  }

  try {
    const data = await runReport(type, batchId);
    $('#reportOutput').textContent = JSON.stringify(data, null, 2);
  } catch (error: any) {
    $('#reportOutput').textContent = error.message;
  }
}

async function runDownloadHandler(type: string) {
  const batchId = $('#batchIdInput').value.trim();
  if (!batchId) {
    $('#reportOutput').textContent = 'Ingresa el ID del lote.';
    return;
  }

  try {
    const fileName = await runDownload(type, batchId);
    $('#reportOutput').textContent = `Descarga generada: ${fileName}`;
  } catch (error: any) {
    $('#reportOutput').textContent = error.message;
  }
}

export {
  runReportHandler,
  runDownloadHandler,
};
