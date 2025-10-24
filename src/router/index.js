import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'species',
      component: () => import('@/views/veterinary/SpeciesView.vue'),
    },
    {
      path: '/bones/:id',
      name: 'bone-details',
      component: () => import('@/views/veterinary/BonesView.vue'),
      props: true,
    },
  ],
})

export default router
