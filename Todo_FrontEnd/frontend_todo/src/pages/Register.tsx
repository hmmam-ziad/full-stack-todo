import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/ui/Button";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { REGISTER_FORM } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation";
import axiosInstance from "../config/axios.config";
import { useState } from "react";
import Swal from 'sweetalert2';
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: {errors} } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema),
  });

  // Handler for form submission
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    // Sending data to the server
    try {
      const {status} = await axiosInstance.post("/Account/Register", data);
      if(status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "You will navigate to login page after 2 seconds to login!",
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      const errorObj = error as AxiosError;
      console.log(errorObj.response?.data);
      
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorObj.response?.data as string,
        showConfirmButton: false,
        timer: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // rendering the form
  const renderRegisterForm = REGISTER_FORM.map(({name, placeholder, type, validation}, idx) => {
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
          Register to get access!
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {renderRegisterForm}
          <Button fullWidth isLoading={isLoading}>
            Register
          </Button>
        </form>
      </div>
    );
}

export default Register