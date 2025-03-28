import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Form from "./Form";

export default function CreateStudentProfile() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (data) => {
    try {

      const response = await fetch("http://localhost:4000/api/create-studentProfile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          courseId: data.courseId,
          specialization: data.specialization,
          software: data.software,
          portfolio: data.portfolio,
          linkedin: data.linkedin
        }),
      });

      if (response.ok) {
        const userData = response.status !== 204 ? await response.json() : null;
      }
      

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create student profile");
      }

      // Get the created user data with MongoDB _id
      const userData = await response.json();

      // Log the user in
      // @todo WE NEED TO HASH A PASSWORD DURING REGISTRATION
    //   login({
    //     userId: userData._id,
    //     email: userData.email,
    //     userType: userData.userType,
    //   });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      // @todo Better error handling for user?
      setError(error.message);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="studentProfile-container">
      <h2>Redigera studentprofil</h2>

      {error && <div className="error-message">{error}</div>}

      <Form
        fields={[
          {
            type: "text",
            name: "name",
            label: "Fullständigt namn",
            required: true,
            placeholder: "Namn",
          },
          {
            type: "radio",
            name: "courseId",
            required: true,
            options: [
                { value: "wu", label: "WU" },
                { value: "dd", label: "DD" },
              ],
          },
          {
            type: "select",
            name: "specialization",
            label: "Inriktning 1",
            required: true,
            options: [
                { value: "film", label: "Film" },
                { value: "frontend", label: "Frontend" },
                { value: "motiondesign", label: "Motiondesign" },
                { value: "servicedesign", label: "Servicedesign" },
                { value: "ui", label: "UI" },
                { value: "ux", label: "UX" },
              ],
            placeholder: "Välj från listan",
            
          },
        //   {
        //     type: "select",
        //     name: "specialization2",
        //     label: "Inriktning 2",
        //     required: true,
        //     options: [
        //         { value: "film", label: "Film" },
        //         { value: "frontend", label: "Frontend" },
        //         { value: "motiondesign", label: "Motiondesign" },
        //         { value: "servicedesign", label: "Servicedesign" },
        //         { value: "ui", label: "UI" },
        //         { value: "ux", label: "UX" },
        //       ],
        //     placeholder: "Välj från listan",
            
        //   },
        //   {
        //     type: "select",
        //     name: "specialization3",
        //     label: "Inriktning 3",
        //     required: true,
        //     options: [
        //         { value: "film", label: "Film" },
        //         { value: "frontend", label: "Frontend" },
        //         { value: "motiondesign", label: "Motiondesign" },
        //         { value: "servicedesign", label: "Servicedesign" },
        //         { value: "ui", label: "UI" },
        //         { value: "ux", label: "UX" },
        //       ],
        //     placeholder: "Välj från listan",
            
        //   },
          {
            type: "select",
            name: "software",
            label: "Designprogram 1",
            required: true,
            options: [
                { value: "3dstager", label: "3D stager" },
                { value: "aftereffects", label: "Aftereffects" },
                { value: "blender3d", label: "Blender 3D" },
                { value: "cavalry", label: "Cavalry" },
                { value: "figma", label: "Figma" },
                { value: "framer", label: "Framer" },
                { value: "illustrator", label: "Illustrator" },
                { value: "indesign", label: "InDesign" },
                { value: "photoshop", label: "Photoshop" },
                { value: "premierepro", label: "Premiere Pro" },
                { value: "vscode", label: "Visual studio code" },
                { value: "webflow", label: "Webflow" },
                { value: "wordpress", label: "Wordpress" },
              ],
            placeholder: "Välj från listan",
            
          },
        //   {
        //     type: "select",
        //     name: "software2",
        //     label: "Designprogram 2",
        //     required: true,
        //     options: [
        //         { value: "3dstager", label: "3D stager" },
        //         { value: "aftereffects", label: "Aftereffects" },
        //         { value: "blender3d", label: "Blender 3D" },
        //         { value: "cavalry", label: "Cavalry" },
        //         { value: "figma", label: "Figma" },
        //         { value: "framer", label: "Framer" },
        //         { value: "illustrator", label: "Illustrator" },
        //         { value: "indesign", label: "InDesign" },
        //         { value: "photoshop", label: "Photoshop" },
        //         { value: "premierepro", label: "Premiere Pro" },
        //         { value: "vscode", label: "Visual studio code" },
        //         { value: "webflow", label: "Webflow" },
        //         { value: "wordpress", label: "Wordpress" },
        //       ],
        //     placeholder: "Välj från listan",
            
        //   },
        //   {
        //     type: "select",
        //     name: "software3",
        //     label: "Designprogram 3",
        //     required: true,
        //     options: [
        //         { value: "3dstager", label: "3D stager" },
        //         { value: "aftereffects", label: "Aftereffects" },
        //         { value: "blender3d", label: "Blender 3D" },
        //         { value: "cavalry", label: "Cavalry" },
        //         { value: "figma", label: "Figma" },
        //         { value: "framer", label: "Framer" },
        //         { value: "illustrator", label: "Illustrator" },
        //         { value: "indesign", label: "InDesign" },
        //         { value: "photoshop", label: "Photoshop" },
        //         { value: "premierepro", label: "Premiere Pro" },
        //         { value: "vscode", label: "Visual studio code" },
        //         { value: "webflow", label: "Webflow" },
        //         { value: "wordpress", label: "Wordpress" },
        //       ],
        //     placeholder: "Välj från listan",
        //   },
          {
            type: "text",
            name: "portfolio",
            label: "Portfolio/GitHub",
            required: true,
            placeholder: "Länk",
          },
          {
            type: "text",
            name: "linkedin",
            label: "LinkedIn",
            required: true,
            placeholder: "Länk",
          },
          
        ]}
        onSubmit={handleSubmit}
        submitLabel="Register"
      />

      <div className="form-footer">
        <p>
          Already have an account?{" "}
          <button className="link-button" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </div>

    </div>
  );
}