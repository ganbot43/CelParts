<template>
  <div class="contact-page">
    <section class="hero-simple">
      <div class="container">
        <h1>Contacto</h1>
        <p>Estamos aquí para ayudarte. Ponte en contacto con nosotros.</p>
      </div>
    </section>

    <section class="contact-details">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-info">
            <h2>Información de contacto</h2>
            <div class="info-item">
              <span class="icon">📍</span>
              <div>
                <h3>Dirección</h3>
                <p>Villa El Salvador, Lima, Perú</p>
              </div>
            </div>
            <div class="info-item">
              <span class="icon">📞</span>
              <div>
                <h3>Teléfono / WhatsApp</h3>
                <p>+51 996 111 303</p>
              </div>
            </div>
            <div class="info-item">
              <span class="icon">✉️</span>
              <div>
                <h3>Correo electrónico</h3>
                <p>info@joymarperu.com</p>
              </div>
            </div>
          </div>

          <div class="contact-form-wrap">
            <h2>Envíanos un mensaje</h2>
            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>Nombre completo</label>
                <input v-model="form.name" type="text" placeholder="Tu nombre" required />
              </div>
              <div class="form-group">
                <label>Correo electrónico</label>
                <input v-model="form.email" type="email" placeholder="tu@email.com" required />
              </div>
              <div class="form-group">
                <label>Mensaje</label>
                <textarea v-model="form.message" rows="5" placeholder="¿En qué podemos ayudarte?" required></textarea>
              </div>
              <button type="submit" class="btn-submit" :disabled="sending">
                {{ sending ? 'Enviando...' : 'Enviar mensaje' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  message: ''
})
const sending = ref(false)

const handleSubmit = async () => {
  sending.value = true
  // Simulación de envío
  await new Promise(resolve => setTimeout(resolve, 1500))
  alert('Mensaje enviado con éxito. Nos pondremos en contacto contigo pronto.')
  form.name = ''
  form.email = ''
  form.message = ''
  sending.value = false
}
</script>

<style scoped>
.contact-page {
  padding-bottom: 80px;
}

.hero-simple {
  background: var(--cp-navy);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero-simple h1 {
  font-family: var(--font-display);
  font-size: 3rem;
  margin-bottom: 10px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-top: 60px;
}

.contact-info h2, .contact-form-wrap h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.info-item .icon {
  font-size: 1.5rem;
  background: var(--cp-frost);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.info-item h3 {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input, .form-group textarea {
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-family: inherit;
}

.btn-submit {
  background: var(--cp-electric);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-submit:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
