import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'
import Login from 'src/components/Dashboard/Views/Pages/Login.vue'
import Home from 'src/components/ModuleComponents/Home.vue'
import Hotel from 'src/components/ModuleComponents/Hotels/Hotel.vue'
import HotelForm from 'src/components/ModuleComponents/Hotels/HotelForm.vue'
import AssingRoomTypeForm from 'src/components/ModuleComponents/Hotels/AssingRoomTypeForm.vue'

let loginPage = {
  path: '/login',
  name: 'login',
  component: Login
}

let loginPageReset = {
  path: '/login/:token',
  name: 'reset',
  component: Login
}

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/hotels',
        component: Hotel,
        name: 'hotels',
        meta: {
          requiresAuth: true,
          hasParams: false
        },
        props: true
      },
      {
        path: '/hotel/form',
        component: HotelForm,
        name: 'hotel',
        meta: {
          requiresAuth: true,
          hasParams: true,
          default: 'create'
        },
        props: true
      },
      {
        path: '/hotel/assing/form',
        component: AssingRoomTypeForm,
        name: 'assing_room_type',
        meta: {
          requiresAuth: true,
          hasParams: true,
          default: 'create'
        },
        props: true
      }
    ]
  },
  loginPage,
  loginPageReset,
  {path: '*', component: NotFound}
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
 function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
