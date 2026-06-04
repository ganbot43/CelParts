// composables/useJoymar.ts
export const WA_NUMBER = '51923821520'

export function useKite() {
  const waLink = (msg = 'Hola Kite, vi su web y quisiera consultar sobre sus productos') =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`

  return { waLink, WA_NUMBER }
}