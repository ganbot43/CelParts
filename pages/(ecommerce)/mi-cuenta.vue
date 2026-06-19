<template>
  <div class="cp-portal">
    <div class="cp-container">
      <div class="cp-portal-grid">
        <!-- Sidebar -->
        <aside class="cp-portal-sidebar">
          <div class="cp-portal-user">
            <div class="cp-portal-avatar">
              {{ userInitials }}
            </div>
            <div>
              <p class="cp-portal-name">{{ user?.name }}</p>
              <p class="cp-portal-email">{{ user?.email }}</p>
            </div>
          </div>

          <nav class="cp-portal-nav">
            <NuxtLink to="/mi-cuenta" class="cp-portal-link" exact-active-class="cp-portal-link-active">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
              Resumen
            </NuxtLink>
            <NuxtLink to="/mi-cuenta/pedidos" class="cp-portal-link" active-class="cp-portal-link-active">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Mis Pedidos
            </NuxtLink>
            <button @click="logout" class="cp-portal-link cp-portal-link-logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              Cerrar Sesión
            </button>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="cp-portal-content">
          <NuxtPage />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'landing', middleware: 'auth-customer' });
const { user, clear } = useUserSession();

const userInitials = computed(() => {
  if (!user.value?.name) return 'C';
  return user.value.name.substring(0, 1).toUpperCase();
});

async function logout() {
  await clear();
  await navigateTo('/login');
}
</script>

<style scoped>
.cp-portal {
  padding: var(--space-8) 0;
  min-height: calc(100vh - 80px);
  background: var(--bg-body);
}

.cp-portal-grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--space-6);
  align-items: start;
}

@media (max-width: 768px) {
  .cp-portal-grid {
    grid-template-columns: 1fr;
  }
}

/* Sidebar */
.cp-portal-sidebar {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--card-shadow-sm);
}

.cp-portal-user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: rgba(0, 174, 239, 0.04);
  border-bottom: 1px solid var(--border-light);
}

.cp-portal-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--cp-electric);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.25rem;
}

.cp-portal-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 2px;
}

.cp-portal-email {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.cp-portal-nav {
  display: flex;
  flex-direction: column;
  padding: var(--space-2);
}

.cp-portal-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  color: var(--text-body);
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--r-md);
  transition: all var(--t-fast) var(--ease-smooth);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.95rem;
  width: 100%;
}

.cp-portal-link svg {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  transition: color var(--t-fast);
}

.cp-portal-link:hover {
  background: rgba(0, 174, 239, 0.04);
  color: var(--cp-electric);
}

.cp-portal-link:hover svg {
  color: var(--cp-electric);
}

.cp-portal-link-active {
  background: rgba(0, 174, 239, 0.08);
  color: var(--cp-electric);
  font-weight: 700;
}

.cp-portal-link-active svg {
  color: var(--cp-electric);
}

.cp-portal-link-logout {
  color: #ef4444;
  margin-top: var(--space-2);
  border-top: 1px solid var(--border-light);
  border-radius: 0 0 var(--r-md) var(--r-md);
}

.cp-portal-link-logout:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
}

.cp-portal-link-logout svg {
  color: #ef4444;
}

/* Content */
.cp-portal-content {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--r-lg);
  padding: var(--space-6);
  min-height: 400px;
  box-shadow: var(--card-shadow-sm);
}
</style>
