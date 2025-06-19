/**
 * Formata o padrão numérico de telefone (BRL) com mascara (99) 99999-9999 ou (99) 9999-9999
 */
export function formatPhone(value: string){
    const removeValues = value.replace(/\D/g, '');
    
    if(removeValues.length > 11){
        return value.slice(0, 15)
    }

    const formattedValues = removeValues
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2');

    return formattedValues;
}

/**
 * Remove todo a mascara do telefone para inserir na base de dados
 */
export function extractFormatPhone(value: string){
    const phoneValue = value.replace(/[\(\)\s-]/g,"");
    return phoneValue;
}