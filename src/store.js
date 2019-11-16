import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import db from '@/firebase/init'

Vue.use(Vuex)

export const store= new Vuex.Store({
    state:{
        funds:0
    },
    getters:{
       save:state=>{
            return state
        },funds:state=>{
            return state.funds
        }
    },
    mutations:{
        andy:(state,payload)=>{
            
           state.funds=payload

            
        },buy:(state,payload)=>{
            
              state.funds=payload
              
          }
    },actions:{
        buy:({commit},payload)=>{
            commit('buy',payload)
        },change:({commit,getters,dispatch},payload)=>{
    
            var mika=firebase.auth().currentUser
            var fundsko=0
            var refko=db.collection('users').doc(mika.providerData[0].email).collection('stocks')
            refko.get()
            .then(query=>{
                var milan=query.docs.map(doc=>{
                    
                   fundsko= +fundsko + +doc.data()['total_value']
                   if(payload.bitnica){
                    fundsko=+getters.funds + +payload.bitnica
                   }else{
                    fundsko=+getters.funds -(+payload.quantity*payload.response.quote.USD.price)
                   }
                   
                   var refko2=db.collection('users').doc(mika.providerData[0].email)
                   refko2.set({
                       funds:fundsko   
                   },{ merge: true })
               dispatch('andy')

                })

                
            })
          
            
                
        },
       andy:context=>{
           
        var mika=firebase.auth().currentUser
        if(mika){
        var ref=db.collection('users').doc(mika.email)
        ref.get().then(doc=>{
            
        
            context.commit('andy',doc.data()['funds'])
        
            
            

            
        })
    }

            
        }}

})