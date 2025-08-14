/**
 * Formata o padrão numérico de CPF (BRL) com máscara 999.999.999-99
 */
export function formatCPF(value: string): string {
    const removeValues = value.replace(/\D/g, '');
    
    if (removeValues.length > 11) {
        return value.slice(0, 14); // Mantém no máximo 14 caracteres (com máscara)
    }

    const formattedValues = removeValues
        .replace(/^(\d{3})(\d)/g, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3')
        .replace(/\.(\d{3})(\d{2})$/g, '.$1-$2');

    return formattedValues;
}

/**
 * Remove toda a máscara do CPF para inserir na base de dados
 */
export function extractFormatCPF(value: string): string {
    return value.replace(/[.\-]/g, "");
}

/**
 * Valida se um CPF é válido usando o algoritmo de verificação dos dígitos
 */
export function validateCPF(value: string): boolean {
    const cpf = extractFormatCPF(value);
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }
    
    // Verifica se não é uma sequência de números iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
    }
    let remainder = sum % 11;
    let firstDigit = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cpf[9]) !== firstDigit) {
        return false;
    }
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
    }
    remainder = sum % 11;
    let secondDigit = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cpf[10]) !== secondDigit) {
        return false;
    }
    
    return true;
}

/**
 * Formata CPF com validação automática
 */
export function formatCPFWithValidation(value: string): { 
    formatted: string; 
    isValid: boolean 
} {
    const formatted = formatCPF(value);
    const isValid = validateCPF(formatted);
    
    return {
        formatted,
        isValid
    };
}