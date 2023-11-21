import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import SerieDetail from '../views/SerieDetail.vue'
import PublisherDetail from '../views/PublisherDetail.vue'

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/serie/:slug',
      name: 'SerieDetail',
      component: SerieDetail
    },
    {
      path: '/publisher/:slug',
      name: 'PublisherDetail',
      component: PublisherDetail
    },
  ]
})

export default router
