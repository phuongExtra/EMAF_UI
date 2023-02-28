import { createWebHistory, createRouter } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import AllEvents from '@/views/ManageEvent/AllEvents.vue'
import CreateEvent from '@/views/ManageEvent/CreateEvent.vue'
import EventDetail from '@/views/ManageEvent/EventDetail.vue'
import UpdateEvent from '@/views/ManageEvent/UpdateEvent.vue'
import MyEvent from '@/views/ManageEvent/MyEvent.vue' 

import AllAccounts from '@/views/ManageAccount/AllAccounts.vue'
import CreateAccount from '@/views/ManageAccount/CreateAccount.vue'
import UpdateAccount from  '@/views/ManageAccount/UpdateAccount.vue'
import CheckIn from '@/views/CheckIn.vue'
import CheckOut from '@/views/Checkout.vue'
import Profile from '@/views/Profile.vue'
import Login from '@/Login.vue'
import Redirect from '@/views/Redirect.vue'
import ListEventForUser from '@/views/ManageEvent/ListEventForUser.vue'
// import EventSchedule from '@/views/EventSchedule.vue'
import Home from '@/views/Home.vue'
import Statistical from '@/views/Statistical.vue'

//equipment
import AllEquipment from '@/views/ManageEquipment/AllEquipment.vue'
import CreateEquipment from '@/views/ManageEquipment/CreateEquipment.vue'
import UpdateEquipment from '@/views/ManageEquipment/UpdateEquipment.vue'

// import Utils from '../utils/utils'
import InvitationAndRequest from '@/views/InvitationAndRequest.vue'

import Notifications from '@/views/AllNotifications.vue'

//config event 
import ConfigEvent from '@/views/ManageEvent/ConfigEvent.vue'

const routes = [
  {
    path: '/statistical',
    name: 'Statistical',
    component: Statistical,
  },
  {
    path: '/my-events',
    name: 'MyEvent',
    component: MyEvent,
  },
  {
    path: '/config-event',
    name: 'ConfigEvent',
    component: ConfigEvent,
  },
  {
    path: '/invitation-and-request',
    name: 'InvitationAndRequest',
    component: InvitationAndRequest,
  },
  {
    path: '/create-equipment',
    name: 'CreateEquipment',
    component: CreateEquipment,
  },
  {
    path: '/update-equipment/:equipmentId',
    name: 'UpdateEquipment',
    component: UpdateEquipment,
  },
  {
    path: '/all-equipments',
    alias: ['/all-equipments'],
    name: 'AllEquipment',
    component: AllEquipment,
  },
  {
    path: '/list-events',
    alias: ['/list-events'],
    name: 'ListEventForUser',
    component: ListEventForUser,
  },
  {
    path: '/redirect',
    alias: ['/redirect'],
    name: 'Redirect',
    component: Redirect,
  },
  {
    path: '/home',
    alias: ['/home'],
    name: 'Home',
    component: Home,
  },
  {
    path: '/dashboard',
    alias: ['/dashboard'],
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/',
    alias: ['/login'],
    name: 'login',
    component: Login,
  },
  {
    path: '/profile',
    alias: ['/profile'],
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/notifications',
 
    name: 'Notifications',
    component: Notifications,
  },
  {
    path: '/checkin/:eventId',
    alias: ['/checkin/:eventId'],
    name: 'CheckIn',
    component: CheckIn,
  },
  {
    path: '/checkout/:eventId',
    name: 'CheckOut',
    component: CheckOut,
  },
  {
    path: '/all-events',
    name: 'AllEvents',
    component: AllEvents
  },
  {
    path: '/create-event',
    alias: ['/create-event-request'],
    name: 'CreateEvent',
    component: CreateEvent
  },
  {
    path: '/event/:eventId',
    name: 'EventDetail',
    component: EventDetail
  },
  {
    path: '/event-update/:eventId',
    name: 'UpdateEvent',
    component: UpdateEvent
  },
  {
    path: '/all-accounts',
    name: 'AllAccounts',
    component: AllAccounts
  },
  {
    path: '/create-account',
    name: 'CreateAccount',
    component: CreateAccount
  },
  // {
  //   path: '/event-schedule',
  //   name: 'EventSchedule',
  //   component: EventSchedule
  // },
  {
    path: '/account-update/:accountId',
    name: 'UpdateAccount',
    component: UpdateAccount
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes :routes
})

router.beforeEach(async (to, from, next) => {
  // console.log(Utils.isAuthenticated())
  // if (!Utils.isAuthenticated() && (to.path !== '/login' || to.path !== '/redirect')) {
  //   next({ name: 'login' })
  // } 
  // next()
  if (to.path === '/' || to.path === '/login' ) {
    localStorage.removeItem("auth");
  }
  next()
});

export default router
