// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../AuthProvider/indexAuthProvider";

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const { userInfo, handleLogout } = useAuth();

//   useEffect(() => {
//     if (!userInfo) {
//       navigate("/");
//     }
//   }, [userInfo, navigate]);

//   if (!userInfo) {
//     return <div>Redirecting...</div>;
//   }

//   return (
//     <>
//       <header>
//         <nav>
//           <button type="button" onClick={handleLogout}>Logout</button>
//         </nav>
//       </header>

//       <main>
//         <div className="user">
//           <h2>Welcome, {userInfo.profile.name}!</h2>
//           <p className="description">Your ZITADEL Profile Information</p>
//           <p>Name: {userInfo.profile.name}</p>
//           <p>Email: {userInfo.profile.email}</p>
//           <p>Email Verified: {userInfo.profile.email_verified ? "Yes" : "No"}</p>
//           <p>
//             Roles:{" "}
//             {JSON.stringify(
//               userInfo.profile[
//               "urn:zitadel:iam:org:project:roles"
//               ]
//             )}
//           </p>
//         </div>
//       </main>
//     </>
//   );
// }
