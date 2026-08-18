import React from 'react'
import { useSelector } from 'react-redux'
import Home from './Home'
import AllPosts from './AllPosts'

function HomeDirect() {
    const user=useSelector(state=>state.authReducer.user)

 
        if(user){
            return <AllPosts/>
        }
        else{
            return <Home/>
            

        }
      
  
}

export default HomeDirect
