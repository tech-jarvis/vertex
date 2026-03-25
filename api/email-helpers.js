function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeSubjectPart(s, maxLen) {
  if (!s) return '';
  return String(s).replace(/[\r\n]/g, ' ').trim().slice(0, maxLen);
}

module.exports = { escapeHtml, safeSubjectPart };
