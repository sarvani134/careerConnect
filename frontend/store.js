import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./actions/authAction/index"
import postsSlice from "./actions/postAction/postIndex"
import newPostSlice from "./actions/authAction/newPostSlice"

export const store=configureStore({
    reducer:{
        authReducer:authSlice,
        postReducer:postsSlice,
        newPostReducer:newPostSlice

    }
})
