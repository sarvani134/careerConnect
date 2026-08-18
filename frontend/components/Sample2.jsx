import React from 'react'

 
function Sample2() {
    const navigate=useNavigate()
    const handleClick=()=>{
        navigate("/users/profilePage")

    }
  return (
    <div>
        <h1>Home page</h1>
        <button onClick={handleClick}>Profile page</button>
      
    </div>
  )
}

export default Sample2
