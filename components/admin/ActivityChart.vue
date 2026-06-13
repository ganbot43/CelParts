<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  recentComplaints: {
    type: Array,
    default: () => []
  },
  newUsers: {
    type: Array,
    default: () => []
  }
})

// Procesar datos para agrupar por los últimos 7 días
const chartData = computed(() => {
  const labels = []
  const complaintsData = []
  const usersData = []
  
  // Calcular los últimos 7 días
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    labels.push(d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }))
    
    // Conteo Reclamaciones
    const cCount = props.recentComplaints.filter((c: any) => {
      if(!c.createdAt) return false
      const cd = new Date(c.createdAt)
      return cd.getDate() === d.getDate() && cd.getMonth() === d.getMonth()
    }).length
    complaintsData.push(cCount)

    // Conteo Usuarios
    const uCount = props.newUsers.filter((u: any) => {
      if(!u.createdAt) return false
      const ud = new Date(u.createdAt)
      return ud.getDate() === d.getDate() && ud.getMonth() === d.getMonth()
    }).length
    usersData.push(uCount)
  }

  return {
    labels,
    datasets: [
      {
        label: 'Reclamaciones',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: '#ef4444',
        data: complaintsData,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ef4444'
      },
      {
        label: 'Nuevos Usuarios',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        data: usersData,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6'
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'end' as const,
      labels: {
        font: { family: 'DM Sans', size: 12, weight: 'bold' },
        usePointStyle: true,
        boxWidth: 8,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1f2937',
      bodyColor: '#4b5563',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      boxPadding: 4,
      usePointStyle: true,
      titleFont: { family: 'DM Sans', size: 13 },
      bodyFont: { family: 'DM Sans', size: 12 }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0, font: { family: 'DM Sans', size: 11 } },
      grid: { color: '#f3f4f6' },
      border: { dash: [4, 4], display: false }
    },
    x: {
      ticks: { font: { family: 'DM Sans', size: 11 } },
      grid: { display: false },
      border: { display: false }
    }
  },
  interaction: {
    mode: 'index',
    intersect: false,
  }
} as any
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 320px;
  width: 100%;
}
</style>
