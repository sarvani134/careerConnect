import { createSlice } from "@reduxjs/toolkit"
import { addMessage, getConnectionsAccepted, getConnectionsReceived, getConnectionsSent, getCurrentUserId, getMessages, loginUser, logoutUser, registerUser } from "../postAction"


const initialState={
    user:[],
    isError:false,
    isLoggedIn:Boolean(localStorage.getItem("token")),
    isLoading:false,
    isSuccess:false,
    message:"",
    profileFetched:false,
    connections:[],
    connectionRequest:[],
    username:"",
    token:localStorage.getItem("token"),
    connections:[],
    acceptedConnections:[],
    sentConnections:[],
    messages:[],
    userId:null,
    messageLoading:true,
    messageError:true

}

 const authSlice=createSlice({
    name:"authSlice",
    initialState,
    reducers:{
        reset:()=>initialState,
        handleLoginUser:(state)=>{
            state.message="hello"

        }

    },
    extraReducers:(builder)=>{
        builder.addCase(loginUser.pending,(state)=>{
            state.isLoading=true
            state.isError=false
            state.message="logging..."

        })
        builder.addCase(loginUser.fulfilled,(state,action)=>{
            state.token=action.payload.token
            state.isLoggedIn=true
            state.isLoading=false
            state.isSuccess=true
            state.message="logged in"
            state.profileFetched=true
            localStorage.setItem("token", action.payload.token)

        })
        builder.addCase(loginUser.rejected,(state,action)=>{
            state.isError=true
            state.isLoading=false
            state.isLoggedIn=false
            state.message=action.payload?.message || "Login failed"

        })
        builder.addCase(registerUser.pending,(state)=>{
            state.isLoading=true
            state.isError=false
            state.message="loading.."

        })
        builder.addCase(registerUser.fulfilled,(state)=>{
            state.isLoading=false
            state.isSuccess=true
            state.message="registered"
            state.profileFetched=true
        })
        builder.addCase(registerUser.rejected,(state)=>{
            state.isError=true
            state.isLoading=false

        })

        builder.addCase(logoutUser.pending,(state)=>{
            state.isLoading=true
        })
        builder.addCase(logoutUser.fulfilled,(state)=>{
            state.token=null
            state.isLoggedIn=false
            state.isLoading=false
            state.isSuccess=false
            state.message="Logged out"
            localStorage.removeItem("token")
        })
        builder.addCase(logoutUser.rejected,(state)=>{
            // A client logout must still succeed if the server session has expired.
            state.token=null
            state.isLoggedIn=false
            state.isLoading=false
            state.isSuccess=false
            localStorage.removeItem("token")
        })
     
         builder
    .addCase(getConnectionsReceived.pending, (state) => {
      state.loading = true;
    })

    .addCase(getConnectionsReceived.fulfilled, (state, action) => {
      state.loading = false;
      state.connections = action.payload;
    })

    .addCase(getConnectionsReceived.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
         builder
    .addCase(getConnectionsAccepted.pending, (state) => {
      state.loading = true;
    })

    .addCase(getConnectionsAccepted.fulfilled, (state, action) => {
      state.loading = false;
      state.acceptedConnections = action.payload;
    })

    .addCase(getConnectionsAccepted.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
     builder
    .addCase(getConnectionsSent.pending, (state) => {
      state.loading = true;
    })

    .addCase(getConnectionsSent.fulfilled, (state, action) => {
      state.loading = false;
      state.sentConnections = action.payload;
    })

    .addCase(getConnectionsSent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
     builder
    .addCase(getCurrentUserId.fulfilled, (state, action) => {
      state.userId = action.payload;
    })
    .addCase(getCurrentUserId.rejected, (state, action) => {
      state.messageError = action.payload;
    })
    .addCase(getMessages.pending, (state) => {
      state.messageLoading = true;
    })

    .addCase(getMessages.fulfilled, (state, action) => {
      state.messageLoading = false;
      state.messages = action.payload;
    })

    .addCase(getMessages.rejected, (state, action) => {
     state.messageLoading = false;
      state.messageError= action.payload;
    })
    .addCase(addMessage.fulfilled,(state,action)=>{
     state.messageLoading = false;

     state.messages.push(action.payload)


    })
       

    }
})

export default authSlice.reducer
