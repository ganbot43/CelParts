-- Consulta para traer productos marcados como nuevo_lanzamiento
SELECT
  p.id,
  p.name,
  p.slug,
  p.description,
  p.price,
  p.stock,
  p.is_featured,
  p.created_at,
  pi.url AS image_url
FROM products p
LEFT JOIN product_images pi
  ON pi.product_id = p.id AND pi.is_primary = 1
WHERE p.nuevo_lanzamiento = 1
  AND p.is_active = 1
ORDER BY p.created_at DESC
LIMIT 100;
