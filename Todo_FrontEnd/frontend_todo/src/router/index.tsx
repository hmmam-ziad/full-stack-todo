import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import RootLayout from "../pages/Layout";
import Register from "../pages/Register";
import Login from "../pages/Login";
import HomePage from "../pages";
import ProtectedRoute from "../components/auth/ProtectedRout";
import ErrorHandler from "../components/error/ErrorHandler";
import TodosPage from "../pages/Todos";


const storgekey = "loggedInUser";
const userDataString = localStorage.getItem(storgekey);
const userData = userDataString ? JSON.parse(userDataString) : null;
const jwt = userData?.token?.token;


const router = createBrowserRouter(createRoutesFromElements(
    <>
        <Route path="/" element={<RootLayout />}  errorElement={<ErrorHandler />} >
            <Route index element={
                <ProtectedRoute isAllowed={jwt} redirectPath={"/login"}>
                    <HomePage />
                </ProtectedRoute>} />

            <Route path="todos" element={
                <ProtectedRoute isAllowed={jwt} redirectPath={"/login"} data={userData}>
                    <TodosPage />
                </ProtectedRoute>} />
                
                <Route path="profile" element={
                    <ProtectedRoute isAllowed={jwt} redirectPath={"/profile"} data={userData}>
                        <h2>Profile Page</h2>
                    </ProtectedRoute>} />
                

                <Route path="register" element={
                    <ProtectedRoute isAllowed={!jwt} redirectPath={"/login"}>
                        <Register />
                    </ProtectedRoute>} />

            <Route path="login" element={
                <ProtectedRoute isAllowed={!jwt} redirectPath={"/"} data={userData}>
                    <Login />
                </ProtectedRoute>} />
        </Route>
    </>
));

export default router;