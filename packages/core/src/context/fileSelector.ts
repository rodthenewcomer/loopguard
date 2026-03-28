/**
 * Extracts a focused, relevant slice of a source file.
 *
 * Instead of sending an entire file to the AI model, this function
 * returns only the lines around an error plus import statements —
 * typically 85–95% fewer tokens than sending the full file.
 *
 * Framework-agnostic: works with any string content.
 */

const IMPORT_PATTERN = /^(import|require|from|#include|use |using )/;

/**
 * Selects relevant lines from a file for AI context.
 *
 * @param fileContent  Full text content of the file
 * @param errorLine    1-based line number of the error (0 if unknown)
 * @param radius       Number of lines to include above and below the error
 * @returns            Formatted string with line numbers, ready to include in a prompt
 */
export function selectRelevantLines(
  fileContent: string,
  errorLine: number,
  radius: number = 30,
): string {
  const lines = fileContent.split('\n');
  const totalLines = lines.length;

  // Extract import/require lines from the top of the file (first 50 lines)
  const importLines = lines
    .slice(0, Math.min(50, totalLines))
    .map((line, i) => ({ line, index: i + 1 }))
    .filter(({ line }) => IMPORT_PATTERN.test(line.trimStart()));

  const importsSection =
    importLines.length > 0
      ? '// --- Imports ---\n' +
        importLines.map(({ line, index }) => `${String(index).padStart(4)}: ${line}`).join('\n')
      : '';

  // If no specific error line, return just imports + first 60 lines
  if (errorLine <= 0) {
    const contextLines = lines.slice(0, Math.min(60, totalLines));
    const contextSection = contextLines
      .map((line, i) => `${String(i + 1).padStart(4)}: ${line}`)
      .join('\n');
    return importsSection
      ? `${importsSection}\n\n// --- File start ---\n${contextSection}`
      : contextSection;
  }

  // Calculate the window around the error line (1-based → 0-based index)
  const errorIndex = Math.max(0, errorLine - 1);
  const startIndex = Math.max(0, errorIndex - radius);
  const endIndex = Math.min(totalLines - 1, errorIndex + radius);

  const contextLines = lines.slice(startIndex, endIndex + 1);
  const contextSection = contextLines
    .map((line, i) => {
      const lineNum = startIndex + i + 1;
      const marker = lineNum === errorLine ? '>>>' : '   ';
      return `${marker} ${String(lineNum).padStart(4)}: ${line}`;
    })
    .join('\n');

  const parts: string[] = [];
  if (importsSection) parts.push(importsSection);
  parts.push(`// --- Context around line ${errorLine} (±${radius} lines) ---\n${contextSection}`);

  return parts.join('\n\n');
}
