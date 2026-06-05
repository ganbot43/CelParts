// composables/useArigumi.ts
export function useArigumi() {
  const config = useBusinessConfig()
  
  const waLink = (msg = 'Hola Arigumi, deseo más información sobre sus productos.') => {
    let number = config.value?.whatsapp || '51996111303'
    number = number.replace(/\D/g, '')
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`
  }

  return { waLink }
}