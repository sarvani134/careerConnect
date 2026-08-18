import React, { useEffect, useState } from "react";
import axios from "axios";
import "../public/Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
    let token=localStorage.getItem("token")
    const navigate=useNavigate()

    const [profile, setProfile] = useState({
        bio: "",
        currPost: "",
        pastWork: [],
        education: []
    });

    const [user, setUser] = useState({
        name: ""
    });

    // null, "about", "currentPost", "experience", "education"
    const [editingSection, setEditingSection] = useState(null);

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const [formData, setFormData] = useState({
        bio: "",
        currentPost: "",

        company: "",
        position: "",
        years: "",

        school: "",
        degree: "",
        fieldOfStudy: ""
    });


    /* =========================================================
       GET PROFILE
    ========================================================= */

    useEffect(() => {
        getProfile();
    }, []);


    const getProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.post(
                "http://localhost:3000/users/displayProfile",
                {
                    token
                }
            );

            const data = response.data;


            // User information
            if (data.user) {

                setUser({
                    name: data.user.name || ""
                });

            }


            // Profile information
            if (data.profile) {

                setProfile({

                    bio: data.profile.bio || "",

                    currPost:
                        data.profile.currPost || "",

                    pastWork:
                        data.profile.pastWork || [],

                    education:
                        data.profile.education || []

                });

            }

        } catch (err) {

            console.log(
                "Error getting profile:",
                err
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================================
       OPEN EDIT SECTION
    ========================================================= */

    const handleEdit = (section) => {

        const work =
            profile.pastWork.length > 0
                ? profile.pastWork[0]
                : {};

        const education =
            profile.education.length > 0
                ? profile.education[0]
                : {};


        setFormData({

            bio:
                profile.bio || "",

            currentPost:
                profile.currPost || "",

            company:
                work.company || "",

            position:
                work.position || "",

            years:
                work.years || "",

            school:
                education.school || "",

            degree:
                education.degree || "",

            fieldOfStudy:
                education.fieldOfStudy || ""

        });


        // Open only the selected section
        setEditingSection(section);

    };


    /* =========================================================
       HANDLE INPUT
    ========================================================= */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };


    /* =========================================================
       SAVE PROFILE
    ========================================================= */
    const handleCreatePost=async(token)=>{
        try{
            navigate("/posts/createPost")
            

        }
        catch(err){
            return res.json({err:err})
        }
    }

    const handleSave = async () => {

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {
                return;
            }


            const sectionFields = {
                about: ["bio"],
                currentPost: ["currentPost"],
                experience: ["company", "position", "years"],
                education: ["school", "degree", "fieldOfStudy"]
            };
            const updateData = sectionFields[editingSection].reduce(
                (data, field) => ({ ...data, [field]: formData[field] }),
                { token }
            );

            setIsSaving(true);
            setSaveError("");
            await axios.post(
                "http://localhost:3000/users/updateProfileData",
                updateData
            );


            // Get updated profile
            await getProfile();


            // Close only the current editor
            setEditingSection(null);

        } catch (err) {
            setSaveError(err.response?.data?.msg || "Unable to save your changes. Please try again.");
            console.log(
                "Error updating profile:",
                err
            );

        } finally {
            setIsSaving(false);
        }

    };


    /* =========================================================
       CANCEL EDIT
    ========================================================= */

    const handleCancel = () => {
        setSaveError("");
        setEditingSection(null);

    };


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (
            <div className="profile-loading">
                Loading profile...
            </div>
        );

    }


    return (

        <div className="profile-page">

            {saveError && (
                <p className="connections-message" role="alert">
                    {saveError}
                </p>
            )}


            {/* =====================================================
                PROFILE HEADER
            ===================================================== */}

            <div className="profile-header">

                <div className="cover-photo"></div>


                <div className="profile-header-content">


                    {/* Avatar */}
                    <button
    type="button"
    className="create-post-button"
    onClick={() => navigate("/users/createPost")}
>
    <span className="create-post-icon">＋</span>
    <span>Create Post</span>
</button>

                    <div
                        className="profile-avatar"
                        onClick={() =>
                            handleEdit("about")
                        }
                    >

                        {user.name
                            ? user.name
                                .charAt(0)
                                .toUpperCase()
                            : "+"}

                    </div>


                    {/* Main information */}

                    <div className="profile-main-info">

                        <h1>

                            {user.name ||
                                "Add your name"}

                        </h1>

                        <p className="current-position">

                            {profile.currPost ||
                                "Add your current position"}

                        </p>


                        <p className="profile-location">

                            Add your location

                            <span>
                                {" · "}
                                Add contact info
                            </span>

                        </p>


                        <div className="profile-actions">

                            <button
                                className="primary-btn"
                                onClick={() =>
                                    handleEdit("about")
                                }
                            >
                                Edit profile
                            </button>

                        </div>

                    </div>

                </div>

            </div>



            {/* =====================================================
                ABOUT
            ===================================================== */}

            <section className="profile-card">


                <div className="section-header">

                    <h2>
                        About
                    </h2>


                    {editingSection !== "about" && (

                        <button
                            className="edit-btn"
                            onClick={() =>
                                handleEdit("about")
                            }
                        >
                            ✎
                        </button>

                    )}

                </div>


                {editingSection === "about" ? (

                    /* ---------- ABOUT EDIT ---------- */

                    <div className="inline-edit">

                        <div className="form-group">

                            <label>
                                About
                            </label>

                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell people about yourself..."
                            />

                        </div>


                        <div className="edit-actions">

                            <button
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>


                            <button
                                className="save-btn"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>

                        </div>

                    </div>

                ) : (

                    /* ---------- ABOUT DISPLAY ---------- */

                    profile.bio ? (

                        <p className="about-text">
                            {profile.bio}
                        </p>

                    ) : (

                        <p className="empty-text">

                            Add a summary about yourself,
                            your skills, interests, career
                            goals, or what you are currently
                            working on.

                        </p>

                    )

                )}

            </section>



            {/* =====================================================
                CURRENT POSITION
            ===================================================== */}

            <section className="profile-card">


                <div className="section-header">

                    <h2>
                        Current position
                    </h2>


                    {editingSection !== "currentPost" && (

                        <button
                            className="edit-btn"
                            onClick={() =>
                                handleEdit("currentPost")
                            }
                        >
                            ✎
                        </button>

                    )}

                </div>


                {editingSection === "currentPost" ? (

                    /* ---------- CURRENT POSITION EDIT ---------- */

                    <div className="inline-edit">

                        <div className="form-group">

                            <label>
                                Current position
                            </label>

                            <input
                                type="text"
                                name="currentPost"
                                value={
                                    formData.currentPost
                                }
                                onChange={handleChange}
                                placeholder="e.g. Software Engineer"
                            />

                        </div>


                        <div className="edit-actions">

                            <button
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>


                            <button
                                className="save-btn"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>

                        </div>

                    </div>

                ) : (

                    /* ---------- CURRENT POSITION DISPLAY ---------- */

                    profile.currPost ? (

                        <div className="current-job">

                            <div className="company-logo">

                                {profile.currPost
                                    .charAt(0)
                                    .toUpperCase()}

                            </div>


                            <div>

                                <h3>
                                    {profile.currPost}
                                </h3>

                                <p>
                                    Current position
                                </p>

                            </div>

                        </div>

                    ) : (

                        <p className="empty-text">

                            Add your current job title,
                            position, or what you are
                            currently doing.

                        </p>

                    )

                )}

            </section>



            {/* =====================================================
                EXPERIENCE
            ===================================================== */}

            <section className="profile-card">


                <div className="section-header">

                    <h2>
                        Experience
                    </h2>


                    {editingSection !== "experience" && (

                        <button
                            className="add-btn"
                            onClick={() =>
                                handleEdit("experience")
                            }
                        >
                            +
                        </button>

                    )}

                </div>


                {editingSection === "experience" ? (

                    /* ---------- EXPERIENCE EDIT ---------- */

                    <div className="inline-edit">


                        <div className="form-group">

                            <label>
                                Company
                            </label>

                            <input
                                type="text"
                                name="company"
                                value={
                                    formData.company
                                }
                                onChange={handleChange}
                                placeholder="Company name"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Position
                            </label>

                            <input
                                type="text"
                                name="position"
                                value={
                                    formData.position
                                }
                                onChange={handleChange}
                                placeholder="Job position"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Duration
                            </label>

                            <input
                                type="text"
                                name="years"
                                value={
                                    formData.years
                                }
                                onChange={handleChange}
                                placeholder="e.g. 2025 - 2026"
                            />

                        </div>


                        <div className="edit-actions">

                            <button
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>


                            <button
                                className="save-btn"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>

                        </div>

                    </div>

                ) : (

                    /* ---------- EXPERIENCE DISPLAY ---------- */

                    profile.pastWork.length > 0 ? (

                        <div className="experience-list">

                            {profile.pastWork.map(
                                (work, index) => (

                                    <div
                                        className="experience-item"
                                        key={
                                            work._id ||
                                            index
                                        }
                                    >

                                        <div className="company-logo">

                                            {work.company
                                                ? work.company
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : "C"}

                                        </div>


                                        <div className="experience-info">

                                            <h3>
                                                {work.position}
                                            </h3>


                                            <p className="company-name">

                                                {work.company}

                                            </p>


                                            <p className="years">

                                                {work.years}

                                            </p>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        /* ---------- EMPTY EXPERIENCE ---------- */

                        <div className="empty-section">

                            <div className="empty-icon">
                                💼
                            </div>


                            <h3>
                                Add your experience
                            </h3>


                            <p>

                                Add your previous work
                                experience, internships,
                                positions, companies,
                                and the duration you
                                worked there.

                            </p>


                            <button
                                className="add-section-btn"
                                onClick={() =>
                                    handleEdit("experience")
                                }
                            >
                                + Add experience
                            </button>

                        </div>

                    )

                )}

            </section>



            {/* =====================================================
                EDUCATION
            ===================================================== */}

            <section className="profile-card">


                <div className="section-header">

                    <h2>
                        Education
                    </h2>


                    {editingSection !== "education" && (

                        <button
                            className="add-btn"
                            onClick={() =>
                                handleEdit("education")
                            }
                        >
                            +
                        </button>

                    )}

                </div>


                {editingSection === "education" ? (

                    /* ---------- EDUCATION EDIT ---------- */

                    <div className="inline-edit">


                        <div className="form-group">

                            <label>
                                School / University
                            </label>

                            <input
                                type="text"
                                name="school"
                                value={
                                    formData.school
                                }
                                onChange={handleChange}
                                placeholder="School or university"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Degree
                            </label>

                            <input
                                type="text"
                                name="degree"
                                value={
                                    formData.degree
                                }
                                onChange={handleChange}
                                placeholder="e.g. B.Tech"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Field of study
                            </label>

                            <input
                                type="text"
                                name="fieldOfStudy"
                                value={
                                    formData.fieldOfStudy
                                }
                                onChange={handleChange}
                                placeholder="e.g. Computer Science"
                            />

                        </div>


                        <div className="edit-actions">

                            <button
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>


                            <button
                                className="save-btn"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>

                        </div>

                    </div>

                ) : (

                    /* ---------- EDUCATION DISPLAY ---------- */

                    profile.education.length > 0 ? (

                        <div className="education-list">

                            {profile.education.map(
                                (edu, index) => (

                                    <div
                                        className="education-item"
                                        key={
                                            edu._id ||
                                            index
                                        }
                                    >

                                        <div className="school-logo">

                                            {edu.school
                                                ? edu.school
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : "S"}

                                        </div>


                                        <div className="education-info">

                                            <h3>
                                                {edu.school}
                                            </h3>


                                            <p>
                                                {edu.degree}
                                            </p>


                                            <p className="field">

                                                {edu.fieldOfStudy}

                                            </p>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        /* ---------- EMPTY EDUCATION ---------- */

                        <div className="empty-section">

                            <div className="empty-icon">
                                🎓
                            </div>


                            <h3>
                                Add your education
                            </h3>


                            <p>

                                Add your school or
                                university, degree,
                                and field of study.

                            </p>


                            <button
                                className="add-section-btn"
                                onClick={() =>
                                    handleEdit("education")
                                }
                            >
                                + Add education
                            </button>

                        </div>

                    )

                )}

            </section>

        </div>
    );
}

export default Profile;
