import { createSlice } from "@reduxjs/toolkit";
import { getAllComments } from "../postAction";



const initialState = {
    commentsByPost: {},
    commentsLoading: false,
    commentsError: null
};

const newPostSlice = createSlice({
    name: "posts",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(getAllComments.pending, (state, action) => {
            state.commentsLoading = true;
            state.commentsError = null;
        });
        builder.addCase(getAllComments.fulfilled,                                                                                                                          (state, action) => {
            const { postId, comments } = action.payload;
            state.commentsLoading = false;
           
            state.commentsByPost[postId] = comments || [];

        });
        builder.addCase(getAllComments.rejected, (state, action) => {
            state.commentsLoading = false;
            state.commentsError = action.payload || "Could not load comments.";
        });

        
    }
});

export default newPostSlice.reducer;
