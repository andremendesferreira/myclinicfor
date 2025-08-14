/**
 * Função simples para capitalizar cada palavra
 * Transforma a primeira letra de cada palavra em maiúscula
 */
export function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Versão mais robusta que lida com múltiplos espaços e caracteres especiais
 */
export function capitalizeWordsAdvanced(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

/**
 * Versão que preserva espaços extras e formatação original
 */
export function capitalizeWordsPreserveSpaces(text: string): string {
  return text
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
}

/**
 * Versão para nomes próprios brasileiros (lida com preposições)
 */
export function capitalizeProperNames(text: string): string {
  const prepositions = ['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'na', 'no', 'para'];
  
  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Primeira palavra sempre maiúscula, preposições ficam minúsculas (exceto se for a primeira)
      if (index === 0 || !prepositions.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
}

// Exemplos de uso:
/*
console.log(capitalizeWords("joão silva santos"));
// Output: "João Silva Santos"

console.log(capitalizeWordsAdvanced("  maria   dos   santos  "));
// Output: "  Maria   Dos   Santos  "

console.log(capitalizeProperNames("joão de oliveira santos"));
// Output: "João de Oliveira Santos"
*/