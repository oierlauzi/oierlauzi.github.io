import Home from '@/views/Home.vue'
import AboutMe from '@/views/AboutMe.vue'
import CurriculumVitae from '@/views/CurriculumVitae.vue'
import Contact from '@/views/Contact.vue'
import NotFound from '@/views/NotFound.vue'
import ProjectZuazo from '@/views/projects/Zuazo.vue'
import ProjectCenital from '@/views/projects/Cenital.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'home'
    }
  },
  {
    path: '/about',
    name: 'AboutMe',
    component: AboutMe,
    meta: {
      title: 'about'
    }
    
  },
  {
    path: '/cv',
    name: 'CurriculumVitae',
    component: CurriculumVitae,
    meta: {
      title: 'cv'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      title: 'contact'
    }
  },
  {
    path: '/projects/zuazo',
    name: 'ProjectZuazo',
    component: ProjectZuazo,
    meta: {
      title: 'zuazo'
    }
  },
  {
    path: '/projects/cenital',
    name: 'ProjectCenital',
    component: ProjectCenital,
    meta: {
      title: 'cenital'
    }
  },
  {
    path: '/*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'not_found'
    }
  },
]

export default routes