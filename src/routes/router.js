
import Stocks from "../components/Stocks"
import Home from "../components/Home"
import Account from "../components/myAccount"
import Charts from "../components/Charts"

export const routes=[
    
    {path:'',component:Home,name:"home"},
    {path:'/stocks',component:Stocks},
    {path:'/account',component:Account,name:"account"},
    {path:'/charts',component:Charts,name:'charts'}
]