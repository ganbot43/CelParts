<template>
  <div class="timeline">
    <div v-if="!logs.length" class="timeline-empty">
      <div class="timeline-empty__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            stroke-width="1.4"
          />
          <path
            d="M12 8v4m0 4h.01"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <span>Sin eventos registrados</span>
    </div>

    <div
      v-for="(log, idx) in sortedLogs"
      :key="log.id ?? idx"
      class="tl-item"
      :class="{ 'tl-item--last': idx === sortedLogs.length - 1 }"
    >
      <!-- Track -->
      <div class="tl-track">
        <div class="tl-dot" :class="`tl-dot--${log.status}`">
          <component :is="statusIcon(log.status)" />
        </div>
        <div v-if="idx < sortedLogs.length - 1" class="tl-line" />
      </div>

      <!-- Card de contenido -->
      <div
        class="tl-card"
        :class="{ 'tl-card--first': idx === sortedLogs.length - 1 }"
      >
        <!-- Fila superior: badge + tiempo relativo -->
        <div class="tl-card__header">
          <AdminEtiquetaEstadoPedido :status="log.status" />
          <span
            class="tl-relative"
            :class="idx === sortedLogs.length - 1 ? 'tl-relative--recent' : ''"
          >
            {{ formatRelativeTime(log.createdAt) }}
          </span>
        </div>

        <!-- Timestamp completo -->
        <div class="tl-timestamp">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M12 7v5l3 3"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ formatDateTimeCompact(log.createdAt) }}
        </div>

        <!-- Autor -->
        <!-- <div v-if="log.changedBy" class="tl-author">
          <div class="tl-author__avatar">{{ initials(log.changedBy) }}</div>
          <span>{{ log.changedBy }}</span>
        </div> -->

        <!-- Nota -->
        <div v-if="log.note" class="tl-note">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            style="flex-shrink: 0; margin-top: 1px"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              stroke="currentColor"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          <span>{{ log.note }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  logs: Array<{
    id?: number;
    status: string;
    note?: string;
    createdAt: string;
    changedBy?: string;
  }>;
}>();

const { getTimeValue, formatRelativeTime, formatDateTimeCompact } =
  useFormatDateTime();

const sortedLogs = computed(() =>
  [...props.logs].sort(
    (a, b) => getTimeValue(a.createdAt) - getTimeValue(b.createdAt),
  ),
);

function initials(name: unknown) {
  if (!name || typeof name !== "string") return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const iconPaths: Record<string, string> = {
  pending: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  voucher_sent:
    "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
  payment_validated:
    "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  in_preparation:
    "M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z",
  delivered: "m4.5 12.75 6 6 9-13.5",
  cancelled: "M6 18 18 6M6 6l12 12",
};

function statusIcon(status: string) {
  const d = iconPaths[status] ?? iconPaths.pending;
  return defineComponent({
    render() {
      return h(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": "2",
          stroke: "currentColor",
          width: "12",
          height: "12",
        },
        [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            d,
          }),
        ],
      );
    },
  });
}
</script>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
}

/* ── Empty ── */
.timeline-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 2rem 0;
  color: var(--sp-text-muted);
  font-size: var(--sp-text-xs);
  font-weight: 500;
}

.timeline-empty__icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--sp-surface-subtle);
  border: 1px solid var(--sp-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sp-text-soft);
}

/* ── Item row ── */
.tl-item {
  display: flex;
  gap: 10px;
  padding-bottom: 10px;
}
.tl-item--last {
  padding-bottom: 0;
}

/* ── Track ── */
.tl-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 26px;
}

.tl-dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1.5px solid transparent;
  box-shadow: 0 0 0 3px var(--sp-surface-solid);
}

.tl-dot--pending {
  background: #fefce8;
  color: #92400e;
  border-color: #fde68a;
}
.tl-dot--voucher_sent {
  background: #eff6ff;
  color: #1e40af;
  border-color: #bfdbfe;
}
.tl-dot--payment_validated {
  background: #f0fdf4;
  color: #166534;
  border-color: #bbf7d0;
}
.tl-dot--in_preparation {
  background: #fff7ed;
  color: #9a3412;
  border-color: #fed7aa;
}
.tl-dot--delivered {
  background: #f0fdf4;
  color: #14532d;
  border-color: #86efac;
}
.tl-dot--cancelled {
  background: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
}

.tl-line {
  width: 1px;
  flex: 1;
  min-height: 10px;
  margin-top: 4px;
  background: var(--sp-border);
}

/* ── Card ── */
.tl-card {
  flex: 1;
  min-width: 0;
  background: var(--sp-surface-muted);
  border: 1px solid var(--sp-border);
  border-radius: var(--sp-radius-md);
  padding: 9px 11px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 2px;
}

.tl-card--first {
  border-color: var(--sp-border-strong);
  background: var(--sp-surface-solid);
  box-shadow: var(--sp-shadow-xs);
}

/* Header: badge + tiempo relativo */
.tl-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  flex-wrap: wrap;
}

/* Tiempo relativo */
.tl-relative {
  font-size: 10px;
  font-weight: 600;
  color: var(--sp-text-soft);
  white-space: nowrap;
  background: var(--sp-surface-subtle);
  border: 1px solid var(--sp-border);
  border-radius: var(--sp-radius-pill);
  padding: 1px 7px;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.tl-relative--recent {
  background: var(
    --sp-primary-soft,
    color-mix(in srgb, var(--sp-primary) 10%, transparent)
  );
  border-color: var(
    --sp-primary-border,
    color-mix(in srgb, var(--sp-primary) 25%, transparent)
  );
  color: var(--sp-primary);
}

/* Timestamp completo */
.tl-timestamp {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--sp-text-muted);
  font-variant-numeric: tabular-nums;
}

/* Autor con avatar de iniciales */
.tl-author {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 1px;
}

.tl-author__avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--sp-surface-subtle);
  border: 1px solid var(--sp-border);
  font-size: 8px;
  font-weight: 700;
  color: var(--sp-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: -0.02em;
}

.tl-author span {
  font-size: 10px;
  color: var(--sp-text-muted);
  font-weight: 500;
}

/* Nota interna */
.tl-note {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  font-size: 10px;
  color: var(--sp-text-muted);
  background: var(--sp-surface-subtle);
  border-left: 2px solid var(--sp-border-strong);
  border-radius: 0;
  padding: 5px 8px;
  line-height: 1.5;
}
</style>
