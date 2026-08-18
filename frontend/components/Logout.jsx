import React, { useEffect, useState } from 'react'

function Logout() {
    let [token,setToken]=useState(null)
    useEffect(()=>{
        if(localStorage.getItem("token")!=null){
            setToken(localStorage.getItem("token"))
        }

    },[])
  return (
    <div>
      
    </div>
  )
}

export default Logout
