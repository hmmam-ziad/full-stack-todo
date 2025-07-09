import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/ui/Button";
import { LOGIN_FORM } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { useState } from "react";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import axiosInstance from "../config/axios.config";
interface IFormInput {
  username: string;
  password: string;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: {errors} } = useForm<IFormInput>({
      resolver: yupResolver(loginSchema),
    });
  
    
  // Handler for form submission
  const onSubmit: SubmitHandler<IFormInput> = async (dataForm) => {
    setIsLoading(true);
    
    
    // Sending data to the server
    try {
      const {status, data} = await axiosInstance.post("/Account/Login", dataForm);
      if(status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "You will navigate to home page after 2 seconds to login!",
          showConfirmButton: false,
          timer: 1500
        });
        console.log(data);

        localStorage.setItem("loggedInUser", JSON.stringify(data));
        
        setTimeout(() => {
          location.replace("/");
        }, 2000);
      }
    } catch (error) {
      const errorObj = error as AxiosError;
      
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: (errorObj.response?.data as any).title,
        showConfirmButton: false,
        timer: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  //render login form
  const renderLoginForm = LOGIN_FORM.map(({name, placeholder, type, validation}, idx) => {
        return (
          <div key={idx}>
            <Input placeholder={placeholder} type={type} {...register(name, validation)} />
            {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
          </div>
        );
  });
    return(
        <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginForm}
        <Button fullWidth isLoading={isLoading}>
            Login
          </Button>
      </form>
    </div>
    );
}

export default Login