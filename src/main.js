import Vue from 'vue'
import App from './App.vue'
import routers from "vue-router"
import {routes} from "./routes/router"
import VueRouter from 'vue-router';
import {store} from "./store"
import firebase from 'firebase'
import Toasted from 'vue-toasted';

 
Vue.use(Toasted)
Vue.use(routers)


const router=new VueRouter({
  routes,
  mode:'history',
})

let checker=null;

firebase.auth().onAuthStateChanged(()=>{
  
  if(!checker){
   checker= new Vue({
      el: '#app',
      router,
      
      store,
      render: h => h(App)
    })
  }
 


})


