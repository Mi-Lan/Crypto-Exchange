<template>
    <div class="container">
        
        <Header>
            
        </Header>
        <transition 
        mode="out-in"
       appear 
       name="slide"
        
        >
        
        <router-view :key="$route.fullPath"></router-view>
        </transition>


    </div>
</template>

<script>
import Header from "./components/Header"
//import stocks from './components/Stocks'

    export default {
        components:{
            Header
            //stocks
        }
    }
</script>

<style>
 .slide-enter-active {
        animation: slide-in 200ms ease-out forwards;
    }

    .slide-leave-active {
        animation: slide-out 200ms ease-out forwards;
    }

    @keyframes slide-in {
        from {
            transform: translateY(-30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

</style>
