<script setup lang="ts">
const { waLink } = useJoymar();

const channels = [
  {
    icon: "💬",
    label: "WhatsApp",
    handle: "+51 XXX XXX XXX · Respuesta inmediata",
    href: "https://wa.me/51996111303",
    type: "wa",
  },
  {
    icon: "📸",
    label: "Instagram",
    handle: "@joymar.utensilios",
    href: "https://instagram.com/joymar",
    type: "ig",
  },
  {
    icon: "👍",
    label: "Facebook",
    handle: "Joymar Utensilios de Cocina",
    href: "https://facebook.com/joymar",
    type: "fb",
  },
  {
    icon: "✉️",
    label: "Correo electrónico",
    handle: "joymar.peru@gmail.com",
    href: "mailto:joymar.peru@gmail.com",
    type: "mail",
  },
];

const topics = [
  { value: "", label: "Selecciona una opción" },
  { value: "consulta", label: "Consulta de producto" },
  { value: "pedido", label: "Hacer un pedido" },
  { value: "precio", label: "Consultar precio" },
  { value: "otro", label: "Otro" },
];

const form = reactive({
  nombre: "",
  telefono: "",
  email: "",
  asunto: "",
  mensaje: "",
});

function handleSubmit() {
  const msg = `Hola Joymar! Mi nombre es ${form.nombre}. ${form.asunto ? `Asunto: ${form.asunto}. ` : ""}${form.mensaje}`;
  window.open(waLink(msg), "_blank", "noopener");
}
</script>

<template>
  <section class="contact" id="contacto">
    <div class="contact-container">
      <div class="section-intro">
        <span class="section-label">Contacto</span>
        <h2 class="section-title">
          Estamos para ayudarte<span class="accent-dot" />
        </h2>
        <p class="section-subtitle">
          ¿Tienes alguna consulta? Escríbenos por el canal que prefieras.
        </p>
      </div>

      <div class="contact-grid">
        <!-- Channels -->
        <div class="contact-info">
          <p class="contact-intro">
            La forma más rápida de contactarnos es por
            <strong>WhatsApp</strong>. También puedes encontrarnos en redes
            sociales o enviarnos un mensaje.
          </p>

          <a
            v-for="ch in channels"
            :key="ch.label"
            :href="ch.href"
            class="contact-channel"
            target="_blank"
            rel="noopener"
          >
            <div class="contact-channel-icon" :class="ch.type">
              {{ ch.icon }}
            </div>
            <div class="contact-channel-text">
              <strong>{{ ch.label }}</strong>
              <span>{{ ch.handle }}</span>
            </div>
            <span class="contact-channel-arrow">→</span>
          </a>
        </div>

        <!-- Form -->
        <div class="contact-form">
          <h3>Envíanos un mensaje</h3>

          <div class="form-row">
            <div class="form-group">
              <label>Nombre</label>
              <input
                v-model="form.nombre"
                type="text"
                placeholder="Tu nombre"
              />
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input
                v-model="form.telefono"
                type="text"
                placeholder="+51 XXX XXX XXX"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Correo electrónico</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="joymar.peru@gmail.com"
            />
          </div>

          <div class="form-group">
            <label>¿Qué necesitas?</label>
            <select v-model="form.asunto">
              <option v-for="t in topics" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Mensaje</label>
            <textarea
              v-model="form.mensaje"
              placeholder="Cuéntanos cómo podemos ayudarte..."
            />
          </div>

          <LandingAppButton
            variant="primary"
            class="submit-btn"
            @click="handleSubmit"
          >
            <LandingWaIcon /> Enviar mensaje
          </LandingAppButton>

          <p class="form-note">
            También puedes contactarnos directamente por WhatsApp para una
            respuesta más rápida.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  --magenta: #b01883;
  --magenta-dark: #7a0f5c;
  --magenta-tint: rgba(176, 24, 131, 0.08);
  --yellow: #f7d21e;

  --bg: #ffffff;
  --bg-alt: #fafafa;

  --text-title: #2b2b2b;
  --text-muted: #6b6b6b;

  --border: #e8e8e8;

  --radius: 16px;
  --radius-lg: 26px;

  --shadow-sm: 0 10px 25px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 25px 60px rgba(0, 0, 0, 0.08);

  padding: 120px 0;
  background: linear-gradient(180deg, var(--bg-alt), var(--bg));
}

/* CONTENEDOR */
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(24px, 6vw, 80px);
}

/* HEADER */
.section-intro {
  text-align: center;
  margin-bottom: 70px;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--magenta);
  margin-bottom: 14px;
}

.section-label::before,
.section-label::after {
  content: "";
  width: 26px;
  height: 2px;
  background: var(--magenta);
}

.section-title {
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  font-weight: 800;
  color: var(--text-title);
}

.accent-dot {
  width: 6px;
  height: 6px;
  background: var(--yellow);
  border-radius: 50%;
  display: inline-block;
  margin-left: 4px;
}

.section-subtitle {
  margin-top: 12px;
  color: var(--text-muted);
}

/* GRID */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 60px;
}

/* CHANNELS */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.contact-intro {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.contact-channel {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-decoration: none;
  transition: all 0.25s ease;
}

.contact-channel:hover {
  transform: translateX(6px);
  border-color: var(--magenta);
  box-shadow: var(--shadow-sm);
}

.contact-channel-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.contact-channel-icon.wa {
  background: #dcf8e8;
}
.contact-channel-icon.ig {
  background: #fde8f0;
}
.contact-channel-icon.fb {
  background: #e7f0ff;
}
.contact-channel-icon.mail {
  background: var(--magenta-tint);
}

.contact-channel-text strong {
  display: block;
  font-size: 0.9rem;
  color: var(--text-title);
}

.contact-channel-text span {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.contact-channel-arrow {
  margin-left: auto;
  color: var(--text-muted);
}

/* FORM */
.contact-form {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 42px;
  box-shadow: var(--shadow-md);
}

.contact-form h3 {
  margin-bottom: 24px;
  font-size: 1.3rem;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-title);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  margin-top: 6px;
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: var(--magenta);
  box-shadow: 0 0 0 3px rgba(176, 24, 131, 0.1);
}

textarea {
  min-height: 110px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.submit-btn {
  width: 100%;
  justify-content: center;
  margin-top: 10px;
}

.form-note {
  margin-top: 14px;
  font-size: 0.75rem;
  text-align: center;
  color: var(--text-muted);
}

/* RESPONSIVE */
@media (max-width: 860px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 480px) {
  .contact-container {
    padding: 0 18px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .contact-form {
    padding: 28px 20px;
  }
}
</style>
