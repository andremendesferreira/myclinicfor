
export function isToday(date: Date) {
  const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
}


/**
 * Verificar se determinado slot já passou.
 */
export function isSlotInThePast(slotTime: string) {
  const [slotHour, slotMinute] = slotTime.split(":").map(Number)
  const now = new Date()
  //const nowWithOutTimeZone = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes()))
  const nowWithOutTimeZone = new Date(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes())
  const currentHour = nowWithOutTimeZone.getHours();
  const currentMinute = nowWithOutTimeZone.getMinutes();

  // console.log('VerificarSlots: ', currentHour, ' | ', slotHour, ' | ', currentMinute, ' | ', slotMinute);

  if (slotHour < currentHour) {
    // console.log('slothour menor que hora atual', slotHour, currentHour)
    return true; // true quer dize que a hora já passou
  } else if (slotHour === currentHour && slotMinute <= currentMinute) {
    // console.log('slothour igual que hora atual e slotminute menor que minuto atual.', slotHour, currentHour, slotMinute, currentMinute)
    return true;
  }

  return false;

}

export function isSlotSequenceAvailable(
  startSlot: string, //> Primeiro horario disponivel
  requiredSlots: number, //> Quantidade de slots necessários
  allSlots: string[], //> Todos horarios da clinica
  blockedSlots: string[] //> Horarios bloqueados
) {

  //console.log(`teste`, blockedSlots)
  const startIndex = allSlots.indexOf(startSlot)
  if (startIndex === -1 || startIndex + requiredSlots > allSlots.length) {
    return false;
  }


  for (let i = startIndex; i < startIndex + requiredSlots; i++) {
    const slotTime = allSlots[i]

    if (blockedSlots.includes(slotTime)) {
      return false;
    }
  }

  return true;
}