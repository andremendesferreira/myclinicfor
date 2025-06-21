/**
 *  Converte valor monetário recebido em Reais para Centavos (BRL).
 * @param {string} amount - o valor em Reais (BRL) a ser convertido.
 * @returns {number} o valor convertido em centavos.
 * 
 * @example
 * convertRealToCents("2.500,00"); // Retorna: 250000
 * Cálculo: 2500 * 100 = 250000
 */

export function convertRealToCents(amount: string){
    const numericPrice = parseFloat(amount.replace(/\./g,'').replace(',', '.'));
    const valueInCents = Math.round(numericPrice * 100);
    return valueInCents;
}

/**
 *  Converte valor monetário recebido em Centavos para Real (BRL).
 * @param {string} amount - o valor em Centavos (BRL) a ser convertido.
 * @returns {number} o valor convertido em Reais.
 * 
 * @example
 * convertCentsToReal("250000"); // Retorna: 2500
 * Cálculo: 250000 / 100 = 2500
 */
export function convertCentsToReal(amount: string){
    const numericPrice = parseFloat(amount);
    const valueInCents = (numericPrice / 100);
    return valueInCents;
}