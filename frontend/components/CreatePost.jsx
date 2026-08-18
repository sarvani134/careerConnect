import React, { useState } from "react";
import "../public/createPost.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createPost } from "../actions/postAction";

function CreatePost() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [body, setBody] = useState("");
    const [image, setImage] = useState(null);

    const token = localStorage.getItem("token");

    const handlePost = async (event) => {
        event.preventDefault();

        const formData = new FormData();

        formData.append("token", token);
        formData.append("body", body);

        if (image) {
            formData.append("postImage", image);
        }

        try {

            await dispatch(createPost(formData)).unwrap();

            navigate("/users/displayProfile");

        } catch (err) {

            console.log("Create post error:", err);

        }
    };


    const handleCancel = () => {
        navigate("/users/displayProfile");
    };


    return (
        <div className="create-post-overlay">

            <div className="create-post">

                {/* Header */}
                <div className="create-post-header">

                    <div className="profile-section">

                        <div className="profile-circle">
                            S
                        </div>

                    </div>

                    <button
                        type="button"
                        className="close-button"
                        onClick={handleCancel}
                    >
                        ×
                    </button>

                </div>


                {/* Post content */}
                <form
                    encType="multipart/form-data"
                    onSubmit={handlePost}
                >

                    <textarea
                        name="body"
                        placeholder="Add your post Content"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />


                    {/* Image */}
                    <div className="post-tools">

                        <label title="Add image">

                            🖼️ Image

                            <input
                                type="file"
                                name="postImage"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                    setImage(e.target.files[0])
                                }
                            />

                        </label>

                    </div>


                    {/* Footer */}
                    <div className="create-post-footer">

                        <button
                            type="submit"
                            className="post-button"
                        >
                            Post
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CreatePost;