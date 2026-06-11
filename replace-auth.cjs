const fs = require('fs');
const glob = require('glob'); // npm install glob
const path = require('path');

const dir = '/Users/ginobarrena/Documents/ProyectoEF3';

const files = [
  'components/admin/BarraSuperior.vue',
  'pages/(auth)/registro.vue',
  'pages/mi-cuenta/detalles.vue',
  'pages/mi-cuenta/productos/[id].vue',
  'pages/(auth)/login.vue',
  'components/admin/BarraLateral.vue',
  'pages/admin/productos/[id].vue',
  'pages/mi-cuenta/index.vue',
  'components/landing/Encabezado.vue',
  'components/ecommerce/ModalDetalleTejido.vue',
  'app.vue',
  'middleware/superadmin.ts',
  'middleware/auth.ts',
  'middleware/guest.ts',
  'middleware/auth-customer.ts'
];

files.forEach(file => {
  const fullPath = path.join(dir, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Reemplazar diferentes formas de useUserSession
  content = content.replace(/const\s*{\s*session\s*,\s*clear:\s*clearSession\s*}\s*=\s*useUserSession\(\);?/g, 
    "const authStore = useAuthStore();\nconst { user: session } = storeToRefs(authStore);\nconst clearSession = authStore.clearAuth;");
    
  content = content.replace(/const\s*{\s*fetch:\s*fetchUserSession\s*}\s*=\s*useUserSession\(\);?/g, 
    "const authStore = useAuthStore();");
    
  content = content.replace(/const\s*{\s*user\s*}\s*=\s*useUserSession\(\);?/g, 
    "const authStore = useAuthStore();\nconst { user } = storeToRefs(authStore);");
    
  content = content.replace(/const\s*{\s*loggedIn,\s*user,\s*clear\s*}\s*=\s*useUserSession\(\);?/g, 
    "const authStore = useAuthStore();\nconst { user, isLoggedIn: loggedIn } = storeToRefs(authStore);\nconst clear = authStore.clearAuth;");
    
  content = content.replace(/const\s*{\s*loggedIn\s*}\s*=\s*useUserSession\(\);?/g, 
    "const authStore = useAuthStore();\nconst { isLoggedIn: loggedIn } = storeToRefs(authStore);");
    
  content = content.replace(/const\s*{\s*loggedIn,\s*user\s*}\s*=\s*useUserSession\(\);?/g, 
    "const authStore = useAuthStore();\nconst { user, isLoggedIn: loggedIn } = storeToRefs(authStore);");
    
  content = content.replace(/const\s*{\s*loggedIn,\s*fetch\s*}\s*=\s*useUserSession\(\);?/g, 
    "const authStore = useAuthStore();\nconst { isLoggedIn: loggedIn } = storeToRefs(authStore);");
    
  // En login.vue, ya no se llama a fetchUserSession
  content = content.replace(/await fetchUserSession\(\)/g, "");
  
  // Remover imports sueltos de useUserSession si los hubiera
  // content = content.replace(/import.*useUserSession.*\n/g, "");

  fs.writeFileSync(fullPath, content);
  console.log('Updated ' + file);
});
