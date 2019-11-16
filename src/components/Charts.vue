<template>
    <div>
        <div class="h3">Choose time horizon!</div>
       <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" @change="radio('1DAY')" name="inlineRadioOptions" id="inlineRadio1" value='1' v-model="radios.value" :disabled='radios[1]'>
  <label class="form-check-label" for="inlineRadio1">Day</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" @change="radio('1HRS')" name="inlineRadioOptions" id="inlineRadio2" value='2' v-model="radios.value" :disabled='radios[2]'>
  <label class="form-check-label" for="inlineRadio2">Hour</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" @change="radio('1MIN')" name="inlineRadioOptions" id="inlineRadio3" value='3' v-model="radios.value" :disabled='radios[3]'>
  <label class="form-check-label" for="inlineRadio3">Minute</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" @change="radio('1SEC')" name="inlineRadioOptions" id="inlineRadio4" value='4' v-model="radios.value" :disabled='radios[4]'>
  <label class="form-check-label" for="inlineRadio4">Seconds</label>
</div>
<button class='btn btn primary' @click='sorter'>Use dummy data so charts can be demonstrated better</button>
<div class="h5">Api used doesen't give more than 100 data points with free version so:<br>day-100days,hour-100hours,minutes-100minutes,seconds-100seconds (from the first purchase)</div>


 <canvas id='planet-chart'></canvas>
 

    </div>
</template>

<script>
import axios from 'axios'
import firebase from 'firebase'
import db from '@/firebase/init'
import sortBy from 'array-sort-by'
import Chart from 'chart.js'
import planetChartData from '../chart-data.js'


export default {
    
    data:function(){
        return {
            params:[
                '1SEC','1MIN','1HRS','1DAY'
            ],
            planetChartData,
            transactions:[],
            debelko:[],
            graph:[],
            funds:10000,
            radios:{
                1:false,
                2:false,
                3:false,
                4:false,
                value:null
            },
            chart:[],
            symbe:[],
            helper:{},
            api:{},
            value:null,
            config:{
                
                headers:{
                   // Apikey:'2ec79514d0ea1c121342fc27e6f6fe1979d92bfb0ae5244618c919751c7db079' cryptocompare key
                  'X-CoinAPI-Key':'F93363E5-CA1F-499E-95B2-0A0ECFF13E68'//'4ECE5EEF-099E-418B-929D-D76B0D4B2160'//'77451DDA-438D-4D02-80A9-C6C4E5261644'//'C78E08AA-A3C7-434C-BD74-80594DAFA495'//'4ECE5EEF-099E-418B-929D-D76B0D4B2160'////'082FA6D9-CDC1-456B-AD1E-0BB98A699CCC'////
                }
            }
        }
    },
    methods:{
        sorter(){
            for(var item in this.params ){
               console.log( this.planetChartData[item])
            }
        },
    
        createChart(chartId,chartData){
            if (window.myChart != undefined)
                    {
                        window.myChart.destroy();
                    }

            const ctx=document.getElementById(chartId)
            
            window.myChart=new Chart(ctx,{
                type:chartData.type,
                data:{
    labels: this.debelko,
    datasets: [
      { // one line graph
        label: 'Portfolio Value',
        data:this.graph,
        backgroundColor: [
          '#DEB887'
        ],
        borderColor: [
          '#36495d',
          '#36495d',
          '#36495d',
          '#36495d',
          '#36495d',
          '#36495d',
          '#36495d',
          '#36495d',
        ],
        borderWidth: 1
      }
    ]
  },
                options:chartData.options,
            })
    
        },
        parameterMaker(){
            
            var counter=0
            var number

            for(var item in this.helper[this.symbe[0]].api){

                var date1=new Date(this.helper[this.symbe[0]].api[item]['time_period_start'])
             
                for (number=counter ; number < this.transactions.length; number++){
                    
                    var date2=new Date(this.transactions[number].date)
                   
                if(+date1<=+date2){
                    
                    let summo=0
                    for(var koji in this.helper){
                        
                        if(this.helper[koji].quantity!==0){
                            
                            summo+=this.helper[koji].quantity*this.helper[koji].api[item]['price_open']
                            
                        }
                        
                    }
                    
                    this.debelko.push(item)
                    let wholeness=summo+this.funds
                    this.graph.push({
                        t:date1,
                        y:wholeness})
                    
                    counter=number
                    
                    break;
                }
               
               if(number>=counter){
                 
               if(this.transactions[number].action=="buy"){
                   
                   this.funds-=this.transactions[number]['amount']*this.transactions[number].price
                this.helper[this.transactions[number]['symbol']].quantity= +this.transactions[number]['amount'] + +this.helper[this.transactions[number]['symbol']].quantity
               
               }else if(this.transactions[number].action='sell'){
                   
                   this.funds+= +this.transactions[number]['amount']* +this.transactions[number].price
                 this.helper[this.transactions[number]['symbol']].quantity=    +this.helper[this.transactions[number]['symbol']].quantity  - +this.transactions[number]['amount']
                 
                 }
               }

                }
            }
            for(var vitez in this.helper){
                this.helper[vitez].quantity=0
            }
            
        },
        async apiLooper(num){
        
            var dt=new Date(this.transactions[0]['date'])
           
          if(!sessionStorage.getItem(num)){
            for(var item in this.symbe){
                 await axios.get("https://rest.coinapi.io/v1/ohlcv/"+this.symbe[item]+"/USD/history?period_id="+num+"&time_start="+dt.toISOString(),this.config)
                .then(response=>{
                    console.log('api sent!')
                    
                    this.helper[this.symbe[item]].api=response.data
                  
                })
                .catch(err=>{console.log(err.message)})
                    }
                  let parsed=JSON.stringify(this.helper)
                  sessionStorage.setItem(num,parsed)  
          }else{
              this.helper=JSON.parse(sessionStorage.getItem(num))
         }

        },
       async radio(num){
           
           this.funds=10000
           this.graph=[]
           this.debelko=[]
          
            if(num=='1DAY'){
                
                this.radios[2]=true
                this.radios[3]=true
                this.radios[4]=true
                await this.apiLooper(num)
                this.parameterMaker()
                this.createChart('planet-chart',this.planetChartData)
                
            }else if(num=='1HRS'){
                this.radios[1]=true
                this.radios[3]=true
                this.radios[4]=true
                await this.apiLooper(num)
                this.parameterMaker()
                this.createChart('planet-chart',this.planetChartData)
                
            }else if(num=='1MIN'){
                
                this.radios[1]=true
                this.radios[2]=true
                this.radios[4]=true
               
                await this.apiLooper(num)
                this.parameterMaker()
                this.createChart('planet-chart',this.planetChartData)
                   
            }else if(num=='1SEC'){
                this.radios[1]=true
                this.radios[2]=true
                this.radios[3]=true
                await this.apiLooper(num)
                this.parameterMaker()
                this.createChart('planet-chart',this.planetChartData)

            }
                this.radios[1]=false
                this.radios[2]=false
                this.radios[3]=false
                this.radios[4]=false
            
           
        }
},
  async  mounted(){

      var mika=firebase.auth().currentUser
         
    if(mika!=null){
             
            this.transactions=[]
            var mika=firebase.auth().currentUser
            var fundsko=0
            this.$store.dispatch('andy')
            var refko=db.collection('users').doc(mika.providerData[0].email).collection('stocks')
          await  refko.get()
            .then(query=>{
             
                var kveko=query.docs.length
                var increment=0
                var milan=query.docs.map(doc=>{
                   
                    this.helper[doc.id]={
                        name:doc.id,
                        api:[],
                        quantity:0
                       
                    }
                   
                    this.symbe.push(doc.id)
                    
                    increment++
                    
                    for(var i=1;i<=doc.data()['increment'];i++){
                        this.transactions.push(doc.data()[i])    
                    }
                   
                    if(increment==kveko){
                        
                        sortBy(this.transactions, (s) => -new Date(s.date));
    
                    }
                })
            })
        }
     this.transactions.reverse()
                  
              }
}
</script>

<style lang="stylus" scoped>

</style>