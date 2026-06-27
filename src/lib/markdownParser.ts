/**
 * Lightweight, secure markdown parser for displaying reports safely.
 * Includes basic XSS prevention sanitization.
 */
export function compileMarkdownToHtml(md: string): string {
  let html = md;

  // Basic HTML Escaping for XSS prevention (Input sanitization)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Restore allowed safe structural tags from markdown conversion (e.g. sub tags for formulas)
  html = html
    .replace(/&lt;sub&gt;/g, '<sub>')
    .replace(/&lt;\/sub&gt;/g, '</sub>')
    .replace(/&lt;hr class="divider"&gt;/g, '<hr class="divider">')
    .replace(/&lt;br\s*\/?&gt;/g, '<br/>');

  // Parse tables
  const tableRegex = /\|(.+)\|[\r\n]+\|([-:\s|]+)\|[\r\n]+((?:\|.+|[\r\n]+)*)/g;
  html = html.replace(tableRegex, (_, header, __, rows) => {
    const headers = header.split('|').map((h: string) => h.trim()).filter((h: string) => h);
    const headerHtml = `<thead><tr>${headers.map((h: string) => `<th>${h}</th>`).join('')}</tr></thead>`;
    
    const bodyRows = rows.trim().split('\n').map((row: string) => {
      const cols = row.split('|').map((c: string) => c.trim()).filter((c: string, idx: number) => {
        return c || idx > 0;
      });
      // Remove trailing cell if matching length
      if (cols.length > headers.length) cols.pop();
      return `<tr>${cols.map((c: string) => `<td>${c}</td>`).join('')}</tr>`;
    }).join('');

    return `<div class="table-container"><table>${headerHtml}<tbody>${bodyRows}</tbody></table></div>`;
  });

  // Parse Headers
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2 id="$1">$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');

  // Parse bullet lists
  html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/^(<li>.*?<\/li>)+/gm, '<ul>$&</ul>');

  // Parse bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Horizontal Rules
  html = html.replace(/^---$/gm, '<hr class="divider">');

  // Clean mathematical representations
  html = html.replace(/\$PM_\{10\}\$/g, 'PM<sub>10</sub>');
  html = html.replace(/\$PM_\{2.5\}\$/g, 'PM<sub>2.5</sub>');
  html = html.replace(/\$PM_10\$/g, 'PM<sub>10</sub>');
  html = html.replace(/\$PM_2.5\$/g, 'PM<sub>2.5</sub>');

  return html;
}
export default compileMarkdownToHtml;
