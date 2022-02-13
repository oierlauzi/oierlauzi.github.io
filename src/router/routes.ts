import Home from '@/views/Home.vue'
import AboutMe from '@/views/AboutMe.vue'
import CurriculumVitae from '@/views/CurriculumVitae.vue'
import Contact from '@/views/Contact.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'AboutMe',
    component: AboutMe
  },
  {
    path: '/cv',
    name: 'CurriculumVitae',
    component: CurriculumVitae
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/*',
    name: 'NotFound',
    component: NotFound
  },
]

export default routes