// Se llama DESPUÉS de insertar el pedido, pasando el ID retornado por lastInsertRowid
export function generateOrderCode(id: number): string {
  return `PED-${id.toString().padStart(4, '0')}`
}
