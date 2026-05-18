const form = document.getElementById('tender-form');
const generateButton = document.getElementById('generate-summary');
const copyButton = document.getElementById('copy-summary');
const output = document.getElementById('summary-output');

const fieldConfig = [
  { id: 'expediente', label: 'Número de expediente' },
  { id: 'organo', label: 'Órgano de contratación' },
  { id: 'objeto', label: 'Objeto del contrato' },
  { id: 'presupuesto', label: 'Presupuesto base de licitación' },
  { id: 'fecha-limite', label: 'Fecha límite de presentación' },
  { id: 'criterios', label: 'Criterios de adjudicación' },
  { id: 'requisitos', label: 'Requisitos técnicos principales' },
  { id: 'riesgos', label: 'Riesgos detectados' }
];

const formatDate = (rawDate) => {
  if (!rawDate) return 'No indicado';

  const [year, month, day] = rawDate.split('-');
  if (!year || !month || !day) return rawDate;
  return `${day}/${month}/${year}`;
};

const getValue = (id) => {
  const element = form.elements.namedItem(id);
  if (!element) return 'No indicado';

  const value = element.value.trim();
  if (!value) return 'No indicado';

  return id === 'fecha-limite' ? formatDate(value) : value;
};

const buildSummary = () => {
  const lines = [
    'RESUMEN DE LICITACIÓN PÚBLICA',
    '================================'
  ];

  fieldConfig.forEach((field) => {
    lines.push(`${field.label}:`);
    lines.push(getValue(field.id));
    lines.push('');
  });

  lines.push('Observación general:');
  lines.push(
    'Revisar pliegos administrativo y técnico para validar cumplimiento, plazos y criterios evaluables antes de presentar oferta.'
  );

  return lines.join('\n');
};

generateButton.addEventListener('click', () => {
  const summary = buildSummary();
  output.textContent = summary;
  copyButton.disabled = false;
});

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
    copyButton.textContent = '¡Copiado!';
    setTimeout(() => {
      copyButton.textContent = 'Copiar resumen';
    }, 1200);
  } catch {
    copyButton.textContent = 'Copia manual';
    setTimeout(() => {
      copyButton.textContent = 'Copiar resumen';
    }, 1400);
  }
});
