import React, { useEffect, useState, useContext } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from './Button';
import { loginUser } from '../../auth/services/login'; 
import { registerUser } from '../../auth/services/register';
import { AuthContext } from '../../auth/context/AuthProvider';
import { jwtDecode } from "jwt-decode";

function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const [view, setView] = useState(initialView);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const { singin } = useContext(AuthContext);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      reset();
      setErrorMsg('');
    }
  }, [isOpen, initialView, reset]);

  if (!isOpen) return null;

  const onSubmit = async (formData) => {
    setErrorMsg('');
    try {
      if (view === 'login') {

        const { data, error } = await loginUser(formData.username, formData.password);
        if (error) throw new Error(error);

        localStorage.setItem('token', data); 

        await singin(formData.username, formData.password);

        const decoded = jwtDecode(data); 
        
        const userRole = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.tipo_usuario;

        if (userRole === 'Admin') {
            navigate('/admin/home');
        } else {
            onClose(); 
        }

      } else {

        await registerUser(formData.username, formData.password, formData.email);
        setView('login');
        setErrorMsg('Registro exitoso. Por favor inicia sesión.');
        return; 
      }
      

    } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
        setErrorMsg('Usuario o contraseña incorrectos.');
      }
      else {
        const msg = error.response?.data?.title || error.message || 'Error en la autenticación';
        setErrorMsg(msg);
      }
    }
  };

  const inputStyle = (hasError) => `w-full h-10 border rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors text-sm ${hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative p-6 sm:p-8 animate-fadeIn">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {view === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Usuario</label>
                <input 
                    type="text"
                    className={inputStyle(errors.username)}
                    {...register("username", { required: 'Usuario requerido' })} 
                />
                {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
            </div>

            {view === 'register' && (
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</label>
                    <input 
                        type="email"
                        className={inputStyle(errors.email)}
                        {...register("email", { 
                            required: 'Email requerido',
                            pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } 
                        })} 
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>
            )}

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contraseña</label>
                <input 
                    type="password"
                    className={inputStyle(errors.password)}
                    {...register("password", { 
                        required: 'Contraseña requerida', 
                        minLength: { value: 6, message: 'Mínimo 6 caracteres' } 
                    })} 
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            {view === 'register' && (
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Confirmar Contraseña</label>
                <input 
                    type="password"
                    className={inputStyle(errors.confirmPassword)}
                    {...register("confirmPassword", { 
                        required: 'Confirma tu contraseña',
                            validate: (val) => {
                            if (watch('password') !== val) {
                                return "Las contraseñas no coinciden";
                            }
                        }
                    })} 
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                </div>
            )}

            {errorMsg && (
                <div className={`text-sm text-center p-2 rounded ${errorMsg.includes('exitoso') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {errorMsg}
                </div>
            )}

            <Button type="submit" className="w-full mt-2">
                {view === 'login' ? 'Iniciar Sesión' : 'Registrar Usuario'}
            </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
            {view === 'login' ? (
                <p>
                    ¿No tienes cuenta?{' '}
                    <button onClick={() => setView('register')} className="text-purple-600 font-bold hover:underline">
                        Regístrate
                    </button>
                </p>
            ) : (
                <p>
                    ¿Ya tienes cuenta?{' '}
                    <button onClick={() => setView('login')} className="text-purple-600 font-bold hover:underline">
                        Inicia sesión
                    </button>
                </p>
            )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;