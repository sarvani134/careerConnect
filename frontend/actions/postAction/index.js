import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Login User
export const loginUser = createAsyncThunk(
    "users/login",
    async (user, thunkAPI) => {
        try {
            const response = await axios.post(
                "http://localhost:3000/users/login",
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
            await axios.post("http://localhost:3000/users/logout", { token });
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
            const response = await axios.post(
                "http://localhost:3000/users/register",
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

        const response=await axios.get("http://localhost:3000/posts/allPosts", {
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
            const response = await axios.post(
                "http://localhost:3000/users/getConnectionsSent",
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
            const response = await axios.post(
                "http://localhost:3000/posts/incrementLikes",
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
            const response = await axios.get(
                "http://localhost:3000/posts/getAllComments",
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
            const response = await axios.get(
                "http://localhost:3000/users/getUserById",
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

 export const createPost=createAsyncThunk("/posts/createPost",async(formData,thunkAPI)=>{
     try {
            const response = await axios.post(
                "http://localhost:3000/posts/createPost",
                
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

        let response=await axios.get("http://localhost:3000/users/getConnectionsAccepted",{params:{token}})

           

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

        let response=await axios.get("http://localhost:3000/users/getConnectionsReceived",{params:{token}})

           

            return response.data.connectionUsers ;

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
 })

 export const acceptConnectionRequest=createAsyncThunk("/users/acceptConnectionRequest",async(data,thunkAPI)=>{
     try {


        let response=await axios.post("http://localhost:3000/users/acceptConnectionRequest",data)

           

            return response.data.connectionUser ;

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
 })
