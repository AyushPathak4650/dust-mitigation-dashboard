import { describe, test, expect } from 'vitest';
import { compileMarkdownToHtml } from '../../src/lib/markdownParser';

describe('Lightweight Markdown Compiler & Sanitization', () => {
  test('converts basic markdown typography elements', () => {
    const markdown = '# Heading 1\n## Heading 2\n**Bold Text**';
    const html = compileMarkdownToHtml(markdown);

    expect(html).toContain('<h1>Heading 1</h1>');
    expect(html).toContain('<h2 id="Heading 2">Heading 2</h2>');
    expect(html).toContain('<strong>Bold Text</strong>');
  });

  test('escapes HTML tags to prevent XSS injection attacks', () => {
    const malicious = '<script>alert("XSS")</script> **Normal Bold**';
    const html = compileMarkdownToHtml(malicious);

    // malicous brackets should be escaped
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('<strong>Normal Bold</strong>');
  });

  test('parses markdown table grids to semantic tables', () => {
    const tableMd = `
| Header 1 | Header 2 |
|---|---|
| Cell 1 | Cell 2 |
    `.trim();

    const html = compileMarkdownToHtml(tableMd);
    expect(html).toContain('<div class="table-container">');
    expect(html).toContain('<table>');
    expect(html).toContain('<th>Header 1</th>');
    expect(html).toContain('<td>Cell 1</td>');
  });
});
