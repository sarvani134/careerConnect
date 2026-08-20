import React, { useEffect, useRef, useState } from "react";
import "../public/createPost.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createPost } from "../actions/postAction";
import { toast } from "react-toastify";

function CreatePost() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [body, setBody] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const imageInputRef = useRef(null);

    const token = localStorage.getItem("token");

    useEffect(() => () => {
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    }, [imagePreviewUrl]);

    const handleImageChange = (event) => {
        const selectedImage = event.target.files?.[0];
        if (!selectedImage) return;

        setImage(selectedImage);
        setImagePreviewUrl(URL.createObjectURL(selectedImage));
    };

    const removeImage = () => {
        setImage(null);
        setImagePreviewUrl("");
        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    const handlePost = async (event) => {
        event.preventDefault();

        const formData = new FormData();

        formData.append("token", token);
        formData.append("body", body);

        if (image) {
            formData.append("media", image);
        }

        try {

            await dispatch(createPost(formData)).unwrap();

            toast.success("Post created successfully!");
            navigate("/users/displayProfile");

        } catch (err) {

            console.log("Create post error:", err);
            toast.error(
                typeof err === "string"
                    ? err
                    : err?.msg || "Could not create post. Please try again."
            );

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

                    {imagePreviewUrl && (
                        <div className="image-preview">
                            <div className="image-preview-actions">
                                <label className="replace-image-button">
                                    Replace photo
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleImageChange}
                                    />
                                </label>
                                <button
                                    type="button"
                                    className="remove-image-button"
                                    onClick={removeImage}
                                    aria-label="Remove selected photo"
                                >
                                    Remove
                                </button>
                            </div>
                            <img src={imagePreviewUrl} alt="Selected post preview" />
                        </div>
                    )}


                    {/* Image */}
                    <div className="post-tools">

                        <label title="Add image">

                            🖼️ Image

                            <input
                                ref={imageInputRef}
                                type="file"
                                name="postImage"
                                accept="image/*"
                                hidden
                                onChange={handleImageChange}
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
