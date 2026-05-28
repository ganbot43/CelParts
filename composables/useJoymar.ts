// composables/useJoymar.ts
export const WA_NUMBER = '51996111303'

export function useJoymar() {
  const waLink = (msg = 'Hola Joymar, vi su web y quisiera consultar sobre sus productos') =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`

  return { waLink, WA_NUMBER }
}