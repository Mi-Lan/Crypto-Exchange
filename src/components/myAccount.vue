<template>
<div class="container">
    
 <div class="display-4">Portfolio:</div>

    <div v-if="disco" class="text-info">Purchased stocks will be displayed here!</div>
    
    <div class="row" >
        <div  v-for='(item,index) in result' v-show='quantity[item.symbol]>0' :key='index' class="col-md-6 mb-2"  >

         <div v-if="quantity[item.symbol]>0" >
    <div class='card text-center' >
        <div class="card-header">
                {{item.name}} (price:{{item.quote.USD.price.toFixed(2)}}$; Quantity:{{quantity[item.symbol]}})
        </div>
        <div   class="card-body" >
            <div v-show="niksa[index]" id='body' class='text-left' >{{(niksa[index]*item.quote.USD.price).toFixed(2)}}$</div>
                <input     class="mr-2" placeholder="Quantity"   type="number"  :id="index" v-model="niksa[index]">
                <a class="btn btn-warning mr-2"  @click="buy(item,niksa[index],quantity[item.symbol])" >Sell</a>
                <a class="btn btn-primary "  data-toggle="collapse" :data-target="'#info'+index">INFO</a>
               <a  class="btn" @click='start(index)'  :id='index' data-toggle="popover" data-placement="top" data-content="Profit/Loss"    :class="[{'btn-danger':(value[item.symbol]-api[item.symbol])>0,'btn-success':(value[item.symbol]-api[item.symbol])<=0},index]">
               {{Math.abs((value[item.symbol]-api[item.symbol]).toFixed(2))}}
               
               </a>

            </div>
    </div>
     <div class="collapse mb-5" :id="'info'+index" >
      <div class="card">
        <div class="card-body text-center">
            <ul :key="index">

                <li>Bought at price: {{value[item.symbol].toFixed(2)}}
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
        <hr>
        <!--chart-->
        <canvas id='piechart'></canvas>

        <hr>
        <div class="display-4">Transaction History:</div>

        <ul class="list-group list-group-flush mb-5 w-100">
         <div class='w-auto'   >
            <li  v-for="(item,index) in transactions" :key="index" class="list-group-item w-auto" :class="{'list-group-item-success':item.action=='buy','list-group-item-danger':item.action=='sell'}">Symbol:{{item.symbol}},Price:{{item.price.toFixed(2)}};Quantity:{{item.amount}};Value:{{item.value.toFixed(2)}};Action:{{item.action}}</li>
            
        </div>
        </ul>
        
</div>

</template>

<script>
import axios from 'axios'
import firebase from 'firebase'
import db from '@/firebase/init'
import sortBy from 'array-sort-by'
import Chart from 'chart.js'

export default {
    data:function(){
        return {
            niksa:[],
            api:{},
            result:{},
            quantity:[],
            ider:'',
            toast:false,
            value:[],
            memingen:null,
            symbe:[],
            transactions:[],
            chart:[],
            colors:["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
            sorted:[],
            symbols:[],
            
            config:{
                params:{'symbol':null},
                headers:{'X-CMC_PRO_API_KEY':'6b4ffd33-58d1-42ff-8be6-11581c78c4a0'
                }
            }
        }
    },
    methods:{
        chartMaker(api){
            
            if (window.myPieChart != undefined)
                    {
                        window.myPieChart.destroy();
                        
                    }
            
            var counter=0
           for(var items in this.value){
                
                this.chart[counter]=api[items].quote['USD'].price*this.quantity[items]
                this.sorted[counter]=this.colors[counter]
                this.symbols[counter]=items
                counter++
                
            }
           
            const ctx=document.getElementById('piechart')
            window.myPieChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                          datasets: [{
        data: this.chart,
        backgroundColor: this.sorted
    }],

    labels:this.symbols
                    },
                    
});
        },
        async initializer(){
            this.transactions=[]
            this.ider=''
            var mika=firebase.auth().currentUser
            var fundsko=0
            
            var refko=db.collection('users').doc(mika.providerData[0].email).collection('stocks')
            await refko.get()
            .then(query=>{
               
                    var kveko=query.docs.length
                    var increment=0
                    var milan=query.docs.map(doc=>{
                    this.symbe.push(doc.id)
                    
                    increment++ 
                   
                    for(var i=1;i<=doc.data()['increment'];i++){
                        this.transactions.push(doc.data()[i])
                        
                    }
                   
                    if(increment==kveko){
                        this.ider+=doc.id
                        sortBy(this.transactions, (s) => -new Date(s.date));
                        
                    }else{
                            this.ider+=doc.id+","
                    
                    }
                    this.quantity[doc.id]=doc.data()['total']
                    this.value[doc.id]=doc.data()['total_value']
                    
                })
                
                 this.config.params['symbol']=this.ider
                axios.get('https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',this.config)
            .then(response=>{
                this.result=response.data.data
                this.chartMaker(response.data.data)
                 for (var item in this.symbe){
                        this.api[this.symbe[item]]=response.data.data[this.symbe[item]].quote['USD'].price*this.quantity[this.symbe[item]]
                        
                    }
                })
            .catch(err=>{
            
                this.api=err.message
                })
                     
                })
                
             }
      ,start(id){
        
        var cerko="."+id
        
       $(cerko).popover('toggle');
                }
      ,buy(response,Tquantity,realQ){
            
            this.niksa=[]
            var mika=firebase.auth().currentUser
            
            if(Tquantity<=realQ&&mika&&Tquantity>0)
            {

                
                var ref=db.collection('users').doc(mika.providerData[0].email).collection('stocks').doc(response.symbol)
             ref.get().then(doc=>{
                 if(doc.exists){
                     var dataj=doc.data()['increment']
                     dataj++
                     var ovde=doc.data()['total']
                     var tamo=doc.data()['total_value']
                    var neka= +ovde - +Tquantity
                    var bitnica=Tquantity*response.quote.USD.price
                     tamo-=bitnica


                     ref.set({
                          [dataj]:{
                            action:'sell',
                             price:response.quote.USD.price,
                             amount:Tquantity,
                             symbol:response.symbol,
                             date:new Date().toISOString(),
                             value:Tquantity*response.quote.USD.price
                         },increment:dataj,total:neka,total_value:tamo
                         
                     }, { merge: true })
                     this.$toasted.show("You have sold "+response.name+" at "+response.quote.USD.price+"$, quantity:"+Tquantity,{
                                    theme:'outline',
                                    position:'top-right',
                                    duration:1200,
                                    fullWidth:false,
                                    type:'info'
                                        })
                     this.$store.dispatch('change',{bitnica})
                        
                   
                     this.initializer()
                     
                 }else{
                        this.$toasted.show("Impossibile!",{
                            type:'error',
                            position:'top-center',
                            fullWidth:false,
                            duration:1000
                        })
                 }
             })
             
            }else{
                this.$toasted.show("Error Invalid action!",{
                            type:'error',
                            position:'top-center',
                            fullWidth:false,
                            duration:1000
                        })
            }
            this.$store.getters.funds
            
        }
  
    },
    computed:{
        disco(){
            
            var counter=0
           
           var counterkk=0
           var nuller=0
           for (var key in this.symbe){
              
              if(parseInt(this.quantity[this.symbe[key]])==0){
                  this.nuller++
                  this.counterkk++
              }else{
                  this.counterkk++
              }
           }
          
           if(this.counterkk==this.nuller){
               return true
           }else{
                return false
           }
           
        }
    },
  async mounted(){
      
        
        this.$store.dispatch('andy')
          await this.initializer()
          this.start()
          
          
               }
}
</script>

<style>
.list-group-item{
   word-break: break-all;
}

ul {
  list-style-type: none;
}


</style>

