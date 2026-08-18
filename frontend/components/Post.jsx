import React from 'react'
import { useSelector } from 'react-redux'

function Post() {

    const posts=useSelector((state)=>state.postReducer)
  return (
    <div>

        {
            posts.map((post)=>{
                
            })

        }


      
    </div>
  )
}

export default Post
