import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPosts,
  getConnectionsAccepted,
  getConnectionsSent,
  incrementLikes,
} from "../actions/postAction";
import { getAllComments } from "../actions/postAction";
import { toggleLikeOptimistic } from "../actions/postAction/postIndex";
import "../public/AllPosts.css";
import { clientServer } from "../src/config";
import { toast } from "react-toastify";

function AllPosts() {
  const dispatch = useDispatch();
  const commentsByPost = useSelector(
    (state) => state.newPostReducer.commentsByPost
  );
  const commentsLoading = useSelector(
    (state) => state.newPostReducer.commentsLoading
  );
  const commentsError = useSelector(
    (state) => state.newPostReducer.commentsError
  );

  const [userId, setUserId] = useState("");
  const [openCommentPostId, setOpenCommentPostId] = useState([]);
  const [commentDraftByPost, setCommentDraftByPost] = useState({});
  const [submittingCommentPostId, setSubmittingCommentPostId] = useState(null);
  const [commentSubmitErrorByPost, setCommentSubmitErrorByPost] = useState({});

  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editBody, setEditBody] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [likingPostId, setLikingPostId] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);

  const { posts, loading, error } = useSelector((state) => state.postReducer);

  // Load posts + connection data
  useEffect(() => {
    dispatch(getAllPosts());

    const token = localStorage.getItem("token");

    dispatch(getConnectionsSent({ token }))
      .unwrap()
      .then((connections) => {
        const ids = connections.map((connection) =>
          connection.connectionId._id.toString()
        );
        setSentRequests(ids);
      })
      .catch((err) => {
        console.log("Error getting sent connections:", err);
      });

    dispatch(getConnectionsAccepted())
      .unwrap()
      .then((connections) => {
        setConnectedUsers(
          connections.map((connection) => connection.userId._id.toString())
        );
      })
      .catch((err) => {
        console.log("Error getting accepted connections:", err);
      });
  }, [dispatch]);

  // Get logged-in user id
  useEffect(() => {
    findUserId();
  }, []);

  async function findUserId() {
    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.get(
        "/users/getUserId",
        { params: { token } }
      );

      if (response.data.userId == null) return;
      setUserId(response.data.userId.toString());
    } catch (err) {
      console.log("Error finding user:", err.response?.data || err.message);
    }
  }

  // Delete post
  async function handleDelete(post) {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmed) return;

      const token = localStorage.getItem("token");
      await clientServer.post("/posts/deletePost", {
        token,
        postId: post._id,
      });

      setOpenMenuId(null);
      dispatch(getAllPosts());
      toast.success("Post deleted successfully!");
    } catch (err) {
      console.log("Delete error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.msg || "Could not delete post. Please try again."
      );
    }
  }

  // Start editing
  function handleEdit(post) {
    setEditingPost(post);
    setEditBody(post.body);
    setOpenMenuId(null);
  }

  // Save edit
  async function saveEdit() {
    try {
      const token = localStorage.getItem("token");
      await clientServer.post("/posts/editPost", {
        token,
        body: editBody,
        postId: editingPost._id,
      });

      setEditingPost(null);
      setEditBody("");
      dispatch(getAllPosts());
      toast.success("Post updated successfully!");
    } catch (err) {
      console.log("Edit error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.msg || "Could not update post. Please try again."
      );
    }
  }

  // Send connection request
  async function handleConnect(toId) {
    if (!toId || !userId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await clientServer.post(
        "/users/sendConnectionRequest",
        { connectionId: toId, token }
      );

      if (response.data?.msg === "connection sent successfully") {
        setSentRequests((prev) => [...prev, toId.toString()]);
      }
    } catch (err) {
      console.log("Connection error:", err.response?.data || err.message);
    }
  }

  // Toggle comment section
  const handleComment = async (postId) => {
    if (openCommentPostId.includes(postId)) {
      setOpenCommentPostId((prev) => prev.filter((id) => id !== postId));
    } else {
      setOpenCommentPostId((prev) => [...prev, postId]);
      await dispatch(getAllComments(postId));
    }
  };

  // Submit a comment
  const handleSubmitComment = async (event, postId) => {
    event.preventDefault();

    const commentBody = (commentDraftByPost[postId] || "").trim();
    if (!commentBody || submittingCommentPostId) return;

    setSubmittingCommentPostId(postId);
    setCommentSubmitErrorByPost((prev) => ({ ...prev, [postId]: null }));

    try {
      await clientServer.post("/posts/commentPost", {
        token: localStorage.getItem("token"),
        postId,
        commentBody,
      });

      setCommentDraftByPost((prev) => ({ ...prev, [postId]: "" }));
      await dispatch(getAllComments(postId)).unwrap();
    } catch (err) {
      setCommentSubmitErrorByPost((prev) => ({
        ...prev,
        [postId]:
          err.response?.data?.msg ||
          err.response?.data ||
          "Could not post comment.",
      }));
    } finally {
      setSubmittingCommentPostId(null);
    }
  };

  // Like (optimistic)
  const handleLike = async (postId) => {
    if (likingPostId) return;

    setLikingPostId(postId);
    dispatch(toggleLikeOptimistic(postId));

    try {
      await dispatch(incrementLikes(postId)).unwrap();
    } catch (err) {
      dispatch(toggleLikeOptimistic(postId)); // revert
      console.log("Like error:", err);
    } finally {
      setLikingPostId(null);
    }
  };

  // ---------- Early returns ----------
  if (loading) {
    return <div className="loading">Loading Posts...</div>;
  }

  if (error) {
    return (
      <div className="loading">
        {typeof error === "string" ? error : JSON.stringify(error)}
      </div>
    );
  }

  // ---------- Render ----------
  return (
    <div className="feed">
      {posts.map((post) => {
        const alreadyLiked = post.likedByCurrentUser;
        const postComments = commentsByPost[post._id] || [];
        const commentDraft = commentDraftByPost[post._id] || "";
        const isSubmittingComment = submittingCommentPostId === post._id;
        const commentSubmitError = commentSubmitErrorByPost[post._id];

        const profileImage = post.userId?.profilePicture?.url
          ? post.userId.profilePicture.url
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
              post.userId?.name || "User"
            )}`;

        const mediaUrl = post.media?.url;

        const isMyPost = userId === post.userId?._id?.toString();
        const isConnected = connectedUsers.includes(
          post.userId?._id?.toString()
        );
        const hasSentRequest = sentRequests.includes(
          post.userId?._id?.toString()
        );

        return (
          <div className="post" key={post._id}>
            {/* ================= HEADER ================= */}
            <div className="post-header">
              <div className="user">
                <img
                  src={profileImage}
                  alt={post.userId?.name || "User"}
                  className="avatar"
                />
                <div className="user-info">
                  <h4>{post.userId?.name}</h4>
                  <p>@{post.userId?.username}</p>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* ================= POST OPTIONS ================= */}
              <div className="post-menu">
                {isMyPost ? (
                  <>
                    <button
                      className="more"
                      type="button"
                      aria-label="Post options"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === post._id ? null : post._id
                        )
                      }
                    >
                      ⋯
                    </button>

                    {openMenuId === post._id && (
                      <div className="post-menu-options">
                        <button type="button" onClick={() => handleEdit(post)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(post)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  !isConnected && (
                    <button
                      className={
                        hasSentRequest
                          ? "connect-button request-sent"
                          : "connect-button"
                      }
                      type="button"
                      disabled={hasSentRequest}
                      onClick={() => handleConnect(post.userId?._id)}
                    >
                      {hasSentRequest ? "Request Sent" : "Connect"}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* ================= POST BODY ================= */}
            {editingPost?._id === post._id ? (
              <div className="edit-box">
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  aria-label="Edit post content"
                />
                <div className="edit-actions">
                  <button
                    type="button"
                    className="save-button"
                    onClick={saveEdit}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setEditingPost(null);
                      setEditBody("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="post-body">{post.body}</div>
            )}

            {/* ================= IMAGE ================= */}
            {mediaUrl && (
              <img src={mediaUrl} alt="Post" className="post-image" />
            )}

            {/* ================= FOOTER ================= */}
            <div className="post-footer">
              <button
                type="button"
                className={alreadyLiked ? "liked" : ""}
                onClick={() => handleLike(post._id)}
                aria-pressed={alreadyLiked}
              >
                👍 Like {post.likes}
              </button>

              <button type="button" onClick={() => handleComment(post._id)}>
                💬 Comment
              </button>
            </div>

            {/* ================= COMMENTS ================= */}
            {openCommentPostId.includes(post._id) && (
              <div className="comments-section">
                <form
                  onSubmit={(event) => handleSubmitComment(event, post._id)}
                >
                  <input
                    type="text"
                    value={commentDraft}
                    onChange={(event) =>
                      setCommentDraftByPost((prev) => ({
                        ...prev,
                        [post._id]: event.target.value,
                      }))
                    }
                    placeholder="Write a comment..."
                    aria-label="Write a comment"
                    disabled={isSubmittingComment}
                  />
                  <button
                    type="submit"
                    disabled={!commentDraft.trim() || isSubmittingComment}
                  >
                    {isSubmittingComment ? "Posting..." : "Post"}
                  </button>
                </form>

                {commentSubmitError && (
                  <p>
                    {typeof commentSubmitError === "string"
                      ? commentSubmitError
                      : "Could not post comment."}
                  </p>
                )}

                {commentsLoading && <p>Loading comments...</p>}

                {!commentsLoading && commentsError && (
                  <p>
                    {typeof commentsError === "string"
                      ? commentsError
                      : "Could not load comments."}
                  </p>
                )}

                {!commentsLoading &&
                  !commentsError &&
                  postComments.length === 0 && <p>No comments yet.</p>}

                {!commentsLoading &&
                  !commentsError &&
                  postComments.length > 0 && (
                    <div>
                      {postComments.map((comment) => {
                        const commentProfileImage = comment.userId
                          ?.profilePicture?.url
                          ? comment.userId.profilePicture.url
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              comment.userId?.name || "User"
                            )}`;

                        return (
                          <div className="comment" key={comment._id}>
                            <img
                              src={commentProfileImage}
                              alt={comment.userId?.name || "User"}
                              className="comment-avatar"
                            />
                            <div className="comment-content">
                              <p className="comment-username">
                                {comment.userId?.username ||
                                  comment.userId?.name}
                              </p>
                              <p className="comment-body">{comment.body}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AllPosts;
