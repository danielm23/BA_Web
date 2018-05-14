import Vue from 'vue'
import Router from 'vue-router'

import GlobalMenu from '@/components/GlobalMenu';
import EventMenu from '@/components/EventMenu';

import Home from '@/components/Home';
import Geolocations from '@/components/Geolocations';
import Geoinformations from '@/components/Geoinformations';

import Events from '@/components/Events';
import Agenda from '@/components/Agenda';
import Messages from '@/components/Messages';
import EventSettings from '@/components/EventSettings';


Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      name: 'Geolocations',
      path: '/geolocations',
      components:{
        default:Geolocations,
        menu:GlobalMenu
      } 
    },
    {
      name: 'Geoinformations',
      path: '/geoinformations',
      components:{
        default:Geoinformations,
        menu:GlobalMenu
      } 
    },
    {  
     name:'home',
     path:'/',
     components:{  
        default:Home,
        menu:GlobalMenu
        }
    },
    {  
       name:'events',
       path:'/agenda/:scheduleId/events',
       components:{  
          default:Events,
          menu:EventMenu
       }
    },
    {  
       name:'agenda',
       path:'/agenda/:scheduleId',
       components:{  
          default:Agenda,
          menu:EventMenu
       }
    },
    {  
       name:'eventsettings',
       path:'/agenda/:scheduleId/eventsettings',
       components:{  
          default:EventSettings,
          menu:EventMenu
       }
    },
    {  
       name:'messages',
       path:'/agenda/:scheduleId/messages',
       components:{  
          default:Messages,
          menu:EventMenu
       }
    }
  ]
})


