<template>
<div class="container">


 
    <div class="row">
        <div  v-for='(item,index) in result' :key='index' class="col-md-6 mb-2"  >

    
        <div> 
   


         <div >
    <div class='card text-center' >
        <div class="card-header">
                {{item.name}} (price:{{item.quote.USD.price.toFixed(2)}}$)
        </div>
        <div   class="card-body" >
            <div v-if="niksa[index]" class='text-left' >{{(niksa[index]*item.quote.USD.price).toFixed(2)}}$</div>
                <input     class="mr-2" placeholder="Quantity"   type="number"  :id="index" v-model="niksa[index]">
                <a class="btn btn-danger mr-2"  @click="buy(item,niksa[index])" >BUY</a>
                <a class="btn btn-primary "  data-toggle="collapse" :data-target="'#info'+index">INFO</a>
            </div>
    </div>
     <div class="collapse mb-5" :id="'info'+index" >
      <div class="card">
        <div class="card-body text-center">
            <ul :key="index">
          <li>Market cap: {{item.quote.USD.market_cap.toFixed(2)}}$</li>
         <li> Total supply: {{item.total_supply}}</li>
          <li>Rank: {{item.cmc_rank}}</li>
          <li>Volume 24h: {{item.quote.USD.volume_24h.toFixed(2)}}</li>
         <li> Symbol: {{item.symbol}}</li>
          </ul>
        </div>
      </div>
    </div>
    </div>
            </div>
            </div> 
        </div>

        <div class="input-group mb-3">
            <input v-model="ninko" type="text" class="form-control" placeholder="Symbol of crypto you want to add (BTC-for bitcoin)">
            <div class="input-group-append">
                <span @click="start(ninko)" class="input-group-text">Add</span>
            </div>
        </div>

</div>


</template>
<script>

import axios from 'axios'
import db from '@/firebase/init'
import firebase from 'firebase'



export default {
    data:function(){
        return {
            niksa:[],
            ninko:null,
            ider:'',
            
            api:{mika:123},
            result:null,
            config:{
                params:{"symbol":"BTC,LTC,ETH,BNB,XLM"},
                headers:{'X-CMC_PRO_API_KEY':'6b4ffd33-58d1-42ff-8be6-11581c78c4a0'
                }
            },
            
        }
    },
    methods:{
        start(merko){
           var length=this.config.params['symbol'].length
            for(var item in this.result){
                if(this.result[item].symbol==merko.toUpperCase()){
                    this.$toasted.show("Desired Crypto Already added!",{
                            type:'error',
                            position:'top-center',
                            fullWidth:false,
                            duration:1000
                        })
                    return 
                }
                
            }
            this.config.params['symbol']+=','+merko.toUpperCase()
            
           axios.get('https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',this.config)
            .then(response=>{
                console.log(merko)
                this.result=response.data.data
                this.$toasted.show("Added "+response.data.data[merko.toUpperCase()].name+" to your Stocks.",{
                        theme:'outline',
                        position:'top-right',
                        duration:1200,
                         fullWidth:false,
                         type:'info'
                    })
                
            })
            .catch(err=>{
                this.config.params['symbol']=this.config.params['symbol'].slice(0,length)
                this.$toasted.show(err.message,{
                            type:'error',
                            position:'top-center',
                            fullWidth:false,
                            duration:1000
                        })
                         this.ninko=null
                
            })
            this.ninko=null
            
        },
        buy(response,quantity){
            
            this.niksa=[]
            var mika=firebase.auth().currentUser
            
            if((quantity*response.quote.USD.price)<=this.$store.getters.funds&&mika&&quantity>0)
            {

                var ref=db.collection('users').doc(mika.providerData[0].email).collection('stocks').doc(response.symbol)
             ref.get().then(doc=>{
                 if(doc.exists){
                     var dataj=doc.data()['increment']
                     dataj++
                     var ovde=doc.data()['total']
                     var tamo=doc.data()['total_value']
                    var neka= +quantity + +ovde
                     tamo+=quantity*response.quote.USD.price

                     ref.set({
                          [dataj]:{
                              action:'buy',
                             price:response.quote.USD.price,
                             amount:quantity,
                             symbol:response.symbol,
                             date:new Date().toISOString(),
                             value:quantity*response.quote.USD.price
                         },increment:dataj,total:neka,total_value:tamo
                         
                     }, { merge: true })
                     this.$toasted.show("You have purchased "+response.name+" at "+response.quote.USD.price+"$, quantity:"+quantity,{
                            theme:'outline',
                             position:'top-right',
                            duration:1200,
                            fullWidth:false,
                            type:'success'
                                        })
                     this.$store.dispatch('change',{response,quantity})
   
                 }else{
                        ref.set({
                            1:{
                                action:'buy',
                            price:response.quote.USD.price,
                             amount:quantity,
                             symbol:response.symbol,
                             date:new Date().toISOString(),
                             value:quantity*response.quote.USD.price
                            },increment:1,total:quantity,total_value:quantity*response.quote.USD.price
                        })
                        this.$store.dispatch('change',{response,quantity})
                         this.$toasted.show("You have purchased "+response.name+" at "+response.quote.USD.price+"$, quantity:"+quantity,{
                                    theme:'outline',
                                    position:'top-right',
                                     duration:1200,
                                    fullWidth:false,
                                    type:'success'
                                    })
                             }
             })

            }else{
                this.$toasted.show("You must login to buy crypto!",{
                            type:'error',
                            position:'top-center',
                            fullWidth:false,
                            duration:1000
                        })
            }
            this.$store.getters.funds

        }
        
    },
    async mounted(){
        var mika=firebase.auth().currentUser
         
    if(mika!=null){
             var ref=db.collection('users').doc(mika.email).collection('stocks')
            await ref.get()
             .then(query=>{
                 var kveko=query.docs.length
                 
                var increment=0
                var milan=query.docs.map(doc=>{
                    
                    increment++
                   if(increment==kveko){
                        this.ider+=doc.id
                        
                    }else{
                            this.ider+=doc.id+","
                    
                         }
                })
           
                if(kveko==0){
                    
                    this.config.params['symbol']="BTC,LTC,ETH,BNB,XLM"
                }else{
                    
                   this.config.params['symbol']=this.ider 
                }
                                
            axios.get('https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',this.config)
        .then(response=>{
                this.result=response.data.data
                
            })
        .catch(err=>{
                
            })
            this.$store.dispatch('andy')
                 
                                
                    })

            }else{
        axios.get('https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',this.config)
        .then(response=>{
                this.result=response.data.data
                
                
            })
        .catch(err=>{
                this.api="You must enter correct symbol exp:BTC,ETH...."
            })

        this.$store.dispatch('andy')

        }
    }
}

</script>
<style>
.box{
    width:300px;
    height:100px;
    background-color:lightblue;
    text-align:center;
    padding-top:2px;
    
    margin-top:20px;
    margin-left:10px;
    border-radius: 20px 20px 20px 20px;
    
}
.popravko{
    display:flex;
}
ul {
  list-style-type: none;
}



</style>


