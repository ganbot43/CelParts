export const useApiError = () => {
  const parseError = (e: any): string => {
    if (!e) return "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.";

    let msg = e?.data?.message || e?.data?.error || e?.message || "";

    // Diccionario de traducciones técnicas a español
    const translations: Record<string, string> = {
      "Maximum upload size exceeded": "El archivo que intentas subir es demasiado pesado. El límite permitido es de 5MB.",
      "Bad credentials": "El correo electrónico o la contraseña son incorrectos.",
      "User already exists": "Ya existe una cuenta registrada con este correo electrónico.",
      "Access Denied": "No tienes permisos para realizar esta acción.",
      "Unauthorized": "Tu sesión ha expirado o no estás autorizado.",
      "Request method 'POST' is not supported": "Método no soportado en la API."
    };

    // Si es un error de validación de Spring Boot (ej: { "nombre": "no puede estar vacío" })
    if (e.data && typeof e.data === 'object' && !e.data.message && !e.data.error && !e.data.path) {
      const keys = Object.keys(e.data);
      if (keys.length > 0) {
        // Filtramos para evitar concatenar propiedades raras si es otro tipo de objeto
        const validations = keys.map(k => {
            if(typeof e.data[k] === 'string') return e.data[k];
            return "";
        }).filter(s => s).join(" ");
        if(validations) return validations;
      }
    }

    if (!msg) return "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.";

    // Busca si hay alguna traducción parcial
    for (const key in translations) {
      if (msg.includes(key)) {
        return translations[key];
      }
    }

    // Si el mensaje es muy técnico, poner uno genérico
    if (msg.includes("java.") || msg.includes("Exception")) {
      return "Ha ocurrido un error interno en el servidor.";
    }

    return msg;
  };

  return { parseError };
};
