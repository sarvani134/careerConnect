import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts, incrementLikes } from "./index.js";

const initialState = {
    posts: [],
    loading: false,
    error: null,
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        toggleLikeOptimistic: (state, action) => {
            const post = state.posts.find(
                (item) => item._id === action.payload
            );

            if (!post) return;

            const wasLiked = Boolean(post.likedByCurrentUser);
            post.likedByCurrentUser = !wasLiked;
            post.likes = Math.max(0, post.likes + (wasLiked ? -1 : 1));
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(getAllPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload.posts;
            })

            .addCase(getAllPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(incrementLikes.fulfilled, (state, action) => {
                const post = state.posts.find(
                    (item) => item._id === action.payload.postId
                );

                if (post) {
                    post.likes = action.payload.likesCount;
                    post.likedByCurrentUser = action.payload.likedByCurrentUser;
                }
            });
    },
});

export const { toggleLikeOptimistic } = postsSlice.actions;
export default postsSlice.reducer;
