import { ILoginForm, IRegisterForm } from "../interfaces";

export const REGISTER_FORM: IRegisterForm[] = [
    {
        name: "username",
        placeholder: "Enter your Username",
        type: "text",
        validation: {
            required: true,
            minLength: 5,
        },
    },
    {
        name: "email",
        placeholder: "Enter your Email",
        type: "email",
        validation: {
            required: true,
            pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
        },
    },
    {
        name: "password",
        placeholder: "Enter your Password",
        type: "password",
        validation: {
            required: true,
            minLength: 6,
        },
    }
];

export const LOGIN_FORM: ILoginForm[] = [
    {
        name: "username",
        placeholder: "Enter your Username",
        type: "text",
        validation: {
            required: true,
            minLength: 5,
        },
    },
    {
        name: "password",
        placeholder: "Enter your Password",
        type: "password",
        validation: {
            required: true,
            minLength: 6,
        },
    }
];