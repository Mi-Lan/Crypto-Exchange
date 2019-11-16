<template>

 

    <nav class="navbar navbar-expand-md navbar-dark bg-success mb-3">
        <div class="container">
            <router-link tag='a' to='/' class="navbar-brand" >Stock Trader</router-link>
          
                
            <button class="navbar-toggler" data-toggle="collapse" data-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mr-auto ">
                    
                    <li class="nav-item">
                    <router-link to="/stocks" tag="a" class="nav-link">Crypto</router-link>
                    </li>
                    <li v-if="auth" class="nav-item">
                        <router-link class="nav-link" to="/account" tag="a">Account</router-link>
                    </li>
                  
                   
                        
                       
                       <li v-if="!auth" class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">Login/Signup</a>
                        <div class="dropdown-menu">
                            <a tag="button" class="dropdown-item" data-toggle="modal" data-target="#loginModal">Login</a>
                            <a tag="button" class="dropdown-item" data-toggle="modal" data-target="#signupModal">Signup</a>
                            
                        </div>
                    </li>
                     <li  v-else-if="auth" class="nav-item" >
                        <a class="nav-link " @click="logout()" >Logout</a>
                    </li>
                    <li v-if="auth" class='nav-item'>
                      <router-link class="nav-link" to="/charts" tag="a">Charts</router-link>
                    </li>
                        

                    
                    <li v-if="auth" class="nav-item">
                       <div class="milka nav-link font-weight-bold"> Funds:{{fond}}$</div>
                    </li>
                </ul>
    
    
    
   <!-- Modal ONE--> 
    <div class="modal fade" id="signupModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Signup</h5>
            <button class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="signup()">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="text" placeholder="Email" class="form-control" v-model="email">
              </div>
               <div class="form-group">
                <label for="username">Username</label>
                <input type="username" placeholder="Username" class="form-control" v-model="username">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" placeholder="Password" class="form-control" v-model="password">
              </div>
              <p class="text-danger center" v-if="feedback">{{feedback}}</p>
              <hr>
             <button class="btn btn-primary" @click="hide('signup')" id="signup" type="submit" >Submit form</button>
            </form>
          </div>
        
        </div>
      </div>
    </div>
   <!-- MODAL TWO --> 
    <div class="modal fade" id="loginModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Login</h5>
            <button class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="login()">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="text" placeholder="Email" class="form-control" v-model="email">
              </div>
              
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" placeholder="Password" class="form-control" v-model="password">
              </div>
              <p class="text-danger center" v-if="feedback">{{feedback}}</p>
             <hr>
              <button  id='login' class="btn btn-primary" >Login</button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  </div>
                
            </div>
        
    </nav>
   
</template>
<script>
import slugify from "slugify"
import axios from "axios"
import db from "@/firebase/init"
import firebase from 'firebase'

export default {
  data:function(){
    return {
      auth:false,
      email:null,
      password:null,
      username:null,
      feedback:null,
      slug:null
    }
  },
    methods:{
      
      login(){
       if(this.email && this.password){
         this.feedback=null
          firebase.auth().signInWithEmailAndPassword(this.email,this.password)
          .then(cred=>{
            this.feedback="Succesful!"
            $('#loginModal').modal('hide')
            this.auth=true
            this.$router.push({name:'account'})
            
            
          }).catch(err=>{
            this.feedback=err.message
          })

       }else{
         this.feedback="Please enter all fields!"
       }
      },
      logout(){
        firebase.auth().signOut()
        .then(()=>{
          this.auth=false
          this.$router.push({name:'home'})
          
        })
      },
       signup(){
        if(this.email && this.username && this.password){
          this.feedback=null
          if(this.username){
            this.slug=slugify(this.username,{
              replacement:'-',
              remove:/[$*_+~.()"'!<>\-:@]/g,
              lower:true
            })
            var ref=db.collection('users').doc(this.email)
    
            ref.get().then(doc =>{
              if(doc.exists){
                this.feedback="This username already exists"
              }else{
                firebase.auth().createUserWithEmailAndPassword(this.email,this.password)
                .then(cred=>{
                  console.log(cred)
                  console.log(this.email)
                  //ovde stoje sve informacije vezane za jednog user-a(akcije koje poseduje,vreme kupovine...)
                     ref.set({
                      alias:this.username,
                      user_id:cred.user.uid,
                      funds:10000,
              
                    })
                    
                    .catch(err=>{
                      alert(err.message)
                    })
                    console.log('crash')
              this.$store.dispatch('andy')
                   
                   .then(()=>{
                     $('#signupModal').modal('hide')
                     this.auth=true
                     //this.$router.go()
                     //$('#myModal').modal('hide')
                     this.$router.push({name:"account"})
                     
                   }) 
                })
                .catch(err=>{
                  console.log(err)
                  this.feedback=err.message
                })
                this.feedback="Logging in..."
              }
            })
            
          }else{
            this.feedback="You must enter username!"
          }
        }else{
          this.feedback="You must enter all fields"
        }
      },
       
    },computed:{
        fond(){
            return this.$store.getters.funds
        }
    },
    mounted(){
        if(firebase.auth().currentUser){
          this.auth=true
        }else{
          this.auth=false
        }
    }
}
</script>
<style scoped>

a{
  cursor:pointer;
}
.milka{
  cursor:none;
}

 

</style>


