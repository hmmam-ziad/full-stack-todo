

export interface IRegisterForm {
    name: 'email' | 'username' | 'password';
    placeholder: string;
    type: string;
    validation: {
        required: boolean;
        minLength?: number;
        pattern?: RegExp;
    };
}

export interface ILoginForm {
    name: 'username' | 'password';
    placeholder: string;
    type: string;
    validation: {
        required: boolean;
        minLength?: number;
        pattern?: RegExp;
    };
}

export interface IErrorResponse {
    error: {
        details?:{
            errors: {
                message: string;
            }[];
        };
        message?: string;
    };
}

export interface ITodo {
    id: number;
    title: string;
    description: string;
}
  