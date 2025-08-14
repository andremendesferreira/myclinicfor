// ==============================================
// @/app/utils/timezone.utils.ts
// ==============================================
export function getBrazilTimeZones(): string[] {
  return Intl.supportedValuesOf("timeZone").filter((zone) =>
    zone.startsWith("America/Noronha") ||
    zone.startsWith("America/Araguaina") ||
    zone.startsWith("America/Bahia") ||
    zone.startsWith("America/Belem") ||
    zone.startsWith("America/Fortaleza") ||
    zone.startsWith("America/Maceio") ||
    zone.startsWith("America/Recife") ||
    zone.startsWith("America/Sao_Paulo") ||
    zone.startsWith("America/Boa_Vista") ||
    zone.startsWith("America/Cuiaba") ||
    zone.startsWith("America/Manaus") ||
    zone.startsWith("America/Porto_Velho") ||
    zone.startsWith("America/Eirunepe") ||
    zone.startsWith("America/Rio_Branco")
  );
}