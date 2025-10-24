<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="header-left">

            <img class="icon-large" src="/dustnbones.jpeg" alt="">

          <div class="header-text">
            <h1 class="page-title">Listagem de Espécies</h1>
            <p class="page-subtitle">Laboratório de Medicina Veterinária - Unisociesc</p>
          </div>
        </div>

        <button @click="$emit('create')" class="btn btn-primary">
          <svg class="icon-small" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 4v16m8-8H4" />
          </svg>
          Nova Espécie
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.page-container {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(to bottom right, #22c55e, #16a34a);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #16a34a;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #15803d;
}

.btn-outline {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
}

.btn-outline:hover:not(:disabled) {
  background: #f1f5f9;
}

.btn-edit {
  flex: 1;
  justify-content: center;
  border-color: #cbd5e1;
  color: #475569;
}

.btn-edit:hover {
  background: #f1f5f9;
}

.btn-delete {
  flex: 1;
  justify-content: center;
  border-color: #fca5a5;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fef2f2;
}

/* Main Content */
.main-content {
  padding: 2rem 0;
}

/* Filters Section */
.filters-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .filters-section {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

.search-wrapper {
  width: 100%;
}

.input-with-icon {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #94a3b8;
  pointer-events: none;
}

.input-search {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  height: 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
}

.input-search:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.filter-wrapper {
  display: flex;
  gap: 0.5rem;
}

.select-filter {
  flex: 1;
  padding: 0.625rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  background: white;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
}

.select-filter:hover {
  border-color: #cbd5e1;
}

.select-filter:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

/* Results Info */
.results-info {
  margin-bottom: 1.5rem;
}

.info-text {
  font-size: 0.875rem;
  color: #475569;
  margin: 0;
}

.info-bold {
  font-weight: 600;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 1rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e2e8f0;
  border-top-color: #16a34a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Species Grid */
.species-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .species-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .species-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Species Card */
.species-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.species-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-header {
  background: linear-gradient(to right, #f0fdf4, #dcfce7);
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.card-title-section {
  flex: 1;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #475569;
  font-style: italic;
  margin: 0;
}

.card-status {
  display: flex;
  align-items: center;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.card-body {
  padding: 1.5rem;
}

.card-description {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.no-description {
  font-style: italic;
  color: #94a3b8;
}

.quantity-section {
  margin-bottom: 1rem;
}

.quantity-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.5rem;
}

.quantity-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #16a34a;
}

.quantity-number {
  font-size: 1.25rem;
  font-weight: 700;
}

.update-info {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.update-date {
  font-weight: 500;
}

.card-footer {
  background: #f8fafc;
  padding: 0.75rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.5rem;
}

/* Icons */
.icon-small {
  width: 1rem;
  height: 1rem;
}

.icon-large {
  width: 3em;
  height: 3rem;
  object-fit: cover;
}

/* Empty State */
.empty-state {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.empty-content {
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #cbd5e1;
  margin: 0 auto 1rem auto;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  color: #475569;
  margin: 0 0 1.5rem 0;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.pagination-btn {
  min-width: 100px;
}

.pagination-numbers {
  display: flex;
  gap: 0.25rem;
}

.pagination-number {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #cbd5e1;
  background: white;
  color: #475569;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-number:hover {
  background: #f1f5f9;
}

.pagination-number.active {
  background: #16a34a;
  color: white;
  border-color: #16a34a;
}

/* Footer */
.footer {
  background: white;
  border-top: 1px solid #e2e8f0;
  margin-top: 3rem;
}

.footer-content {
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.875rem;
  color: #475569;
}

.footer-content p {
  margin: 0;
}

.footer-copyright {
  margin-top: 0.5rem !important;
}
</style>
