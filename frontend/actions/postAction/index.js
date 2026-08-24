import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../../src/config";

// Login User
export const loginUser = createAsyncThunk(
    "users/login",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post(
                "/users/login",
                {
                    email: user.email,
                    password: user.password,
                }
            );

            if (response.data.token) return response.data;

            return thunkAPI.rejectWithValue({
                message: "Token not provided",
            });
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || "Login Failed"
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    "users/logout",
    async (token, thunkAPI) => {
        try {
            await clientServer.post("/users/logout", { token });
            return token;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || "Logout Failed"
            );
        }
    }
);

// Register User
export const registerUser = createAsyncThunk(
    "users/register",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post(
                "/users/register",
                user
            );

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || "Registration Failed"
            );
        }
    }
);

export const getAllPosts=createAsyncThunk("/posts/allPosts",async(_,thunkAPI)=>{
    try{

        const response=await clientServer.get("/posts/allPosts", {
            params: { token: localStorage.getItem("token") }
        })

        return response.data
    }
    catch(err){
        return thunkAPI.rejectWithValue(err.response.data)
    }
})
export const getConnectionsSent = createAsyncThunk(
    "/users/getSentRequests",
    async (data, thunkAPI) => {
        try {
            const response = await clientServer.post(
                "/users/getConnectionsSent",
                data
            );

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);
export const incrementLikes = createAsyncThunk(
    "/posts/incrementLikes",
    async (postId, thunkAPI) => {
        try {
            const response = await clientServer.post(
                "/posts/incrementLikes",
                {
                    postId,
                    token: localStorage.getItem("token")
                }
            );

            return { postId, ...response.data };

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
   
);
 export const  getAllComments=createAsyncThunk("/posts/getAllComments",
    async (postId, thunkAPI) => {
        try {
            const response = await clientServer.get(
                "/posts/getAllComments",
                {
                  params: {
                        postId:postId
                    }
                }
            );

            return { postId, ...response.data };

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
 )
export const getUserById=createAsyncThunk("/users/getUserById",async(userId,thunkAPI)=>{
      try {
            const response = await clientServer.get(
                "/users/getUserById",
                {
                  params: {
                        userId:userId
                    }
                }
            );
           

            return { userId, ...response.data };

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    
 })

 export const getCurrentUserId=createAsyncThunk("/users/getUserId",async(_,thunkAPI)=>{
    try {
      const token=localStorage.getItem("token")
      const response=await clientServer.get("/users/getUserId",{
        params:{token}
      })

      return response.data.userId
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message)
    }
 })

 export const createPost=createAsyncThunk("/posts/createPost",async(formData,thunkAPI)=>{
     try {
            const response = await clientServer.post(
                "/posts/createPost",
                
                  formData
                
            );
           

            return response.data.post ;

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    
 })

 export const getConnectionsAccepted=createAsyncThunk("/users/getConnectionsAccepted",async(_,thunkAPI)=>{
     try {
        let token=localStorage.getItem("token")

        let response=await clientServer.get("/users/getConnectionsAccepted",{params:{token}})

           

            return response.data.connections ;

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
 })

 export const getConnectionsReceived=createAsyncThunk("/users/getConnectionsReceived",async(_,thunkAPI)=>{
     try {
        let token=localStorage.getItem("token")

        let response=await clientServer.get("/users/getConnectionsReceived",{params:{token}})

           

            return response.data.connectionUsers ;

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
 })

 export const acceptConnectionRequest=createAsyncThunk("/users/acceptConnectionRequest",async(data,thunkAPI)=>{
     try {


        let response=await clientServer.post("/users/acceptConnectionRequest",data)

           

            return response.data.connectionUser ;

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
 })

 export const getMessages = createAsyncThunk(
  "messages/getMessages",

  async ({ senderId, receiverId }, thunkAPI) => {

    try {

      const response = await clientServer.get(
        "/messages/getMessages",
        {
          params: {
            senderId,
            receiverId,
            token: localStorage.getItem("token")
          }
        }
      );

      return response.data.messages;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }

  }
);
export const addMessage = createAsyncThunk(
  "messages/addMessage",

  async (
    data,
    thunkAPI
  ) => {

    try {

      const response = await clientServer.post(
        "/messages/addMessage",
        {
          ...data,
          token: localStorage.getItem("token")
        }
      );

      return response.data.newMessage;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }

  }
);
