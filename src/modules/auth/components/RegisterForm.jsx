import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/register";
import Button from "../../shared/components/Button";

function RegisterForm() {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const navigate = useNavigate();
    const passwordValue = watch('password', '');

    const onValid = async (formData) => {
        try {
            setErrorMessage('');
            setSuccessMessage('');
            
            const { username, password, email } = formData;
            const { data } = await registerUser(username, password, email);

            setSuccessMessage('Registro exitoso. Redirigiendo...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            const backendMessage = error.response?.data?.[0]?.description || error.response?.data?.message || 'Error al registrar usuario';
            setErrorMessage(backendMessage);
        }
    };

    const inputStyle = (hasError) => `w-full h-10 border rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors text-sm ${hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;
    
 return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white sm:bg-gray-100 sm:p-4">
            
            <h1 className="text-xl sm:text-xl font-medium text-gray-700 mb-6 mt-8 sm:mt-0 text-center">
                Formulario para crear una cuenta
            </h1>

            <form
                onSubmit={handleSubmit(onValid)}
                className="bg-white p-6 sm:p-8 w-full sm:max-w-sm flex flex-col gap-3 flex-1 sm:flex-none sm:rounded-xl sm:shadow-md justify-center sm:justify-start"
            >
                <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Registro</h2>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Usuario</label>
                    <input
                        type="text"
                        className={inputStyle(errors.username)}
                        {...register('username', { required: 'El usuario es obligatorio' })}
                    />
                    {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</label>
                    <input
                        type="email"
                        className={inputStyle(errors.email)}
                        {...register('email', {
                            required: 'El email es obligatorio',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Email inválido"
                            }
                        })}
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contraseña</label>
                    <input
                        type="password"
                        className={inputStyle(errors.password)}
                        {...register('password', {
                            required: 'La contraseña es obligatoria',
                            minLength: {
                                value: 8,
                                message: 'Mínimo 8 caracteres'
                            },
                        })}
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Confirmar contraseña</label>
                    <input
                        type="password"
                        className={inputStyle(errors.confirmPassword)}
                        {...register('confirmPassword', {
                            required: 'Debe confirmar la contraseña',
                            validate: (value) =>
                                value === passwordValue || 'Las contraseñas no coinciden',
                        })}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                </div>

                {errorMessage && (
                    <p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded border border-red-100">
                        {errorMessage}
                    </p>
                )}
                {successMessage && (
                    <p className="text-green-600 text-xs text-center bg-green-50 p-2 rounded border border-green-100">
                        {successMessage}
                    </p>
                )}

                <div className="mt-4 flex flex-col gap-3">
                    <Button 
                        type="submit" 
                        className="w-full h-10"
                    >
                        Registrar Usuario
                    </Button>

                    <Button 
                        type="button"
                        variant="secondary"
                        className="w-full h-10"
                        onClick={() => navigate('/login')}
                    >
                        Inicio de Sesión
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;