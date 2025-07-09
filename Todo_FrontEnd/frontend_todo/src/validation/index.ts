import * as yup from "yup";


export const registerSchema = yup.object({
    username: yup.string().required("Username is required").min(5, "Username must be at least 5 characters long"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
}).required();

export const loginSchema = yup.object({
    username: yup.string().required("Username is required").min(5, "Username must be at least 5 characters long"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
}).required();