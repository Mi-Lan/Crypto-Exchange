<template>
    <div>
        <h1 class="display-3">What does this do</h1>
        <hr>
        <p class='lead'>
        So basically this simulates crypto trading it uses most of but not everything i have done so far VueRouter,VueX, Components,Conditionals, Axios(vue reosurce)+Bootstrap...
            </p>
            
                <transition-group tag="ul"
                mode="out-in"
                appear
                enter-active-class="animated bounce"
                leave-active-class="animated shake"
                >

                <li key="1">Crypto:gives us view of all stocks and their prices and option to buy them and also option to add new crypto currencies which we can buy.</li>
                <li key="2">Portfolio: we can see all crypto we own and current price and option to sell them and transaction history. Next to the sell button we have info about stocks and next to info button is profit/loss indicator which red if we are in loss and green if we are in profit</li>
                
                
                <li key="3">Funds:We can see balance of our account</li>
                </transition-group>
    </div>
</template>
<script>
import firebase from 'firebase'
export default {
    mounted(){
        if(firebase.auth().currentUser){
this.$store.dispatch('andy')
        }else{
            return
        }
    }
}
</script>


