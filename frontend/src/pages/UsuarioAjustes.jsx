import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UsuarioAjustes = ({ usuario}) => {
    const usuarionativo = usuario.username;
    const rol = usuario.rol;
    const [password, setPassword] = useState(usuario.password);
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const [username, setUsername] = useState(usuario.username);
    const handleUsernameChange = (e) => {
        setUsername(e.target.value.toLowerCase());
    };
    const [name, setName] = useState(usuario.fullname);
    const handleNameChange = (e) => {
        setName(e.target.value.toUpperCase());
    };
    const rolesMap = {
        admin: "Administrador",
        user: "Usuario",
        superadmin: "Super Administrador",
    };

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate()
    const handlesave = async () => {
        try {
            const response = await axios.post(`${backendUrl}/update_myuser`, {
                usuarionativo,
                username,
                password,
                name,
                rol,
            }, {
                withCredentials: true,
            });

            if (response.status === 200) {
                alert(response.data.message);
                console.log(response.data.message);
                localStorage.setItem("user", JSON.stringify(response.data.user))
                navigate(`/${response.data.user.username}/ajustes`);
                window.location.reload();
            }
        } catch (error) {
            console.error("Error al actualizar mi usuario:", error.response?.data?.message || error.message);
            alert("Hubo un error al actualizar mi usuario.");
        }
    };
    return (
        <div>
            <div className="flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-1 text-cyan-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <h1 className="text-cyan-500 text-xl text-center">Mi usuario</h1>
            </div>
            <div className="my-3 flex justify-center">
                <div>
                    <div className="font-bold text-xs">Usuario</div>
                    <input type="text" value={username} onChange={handleUsernameChange} className="border rounded p-2 text-sm" />
                </div>
                <div className="px-4">
                    <div className="font-bold text-xs">Contraseña</div>
                    <span className="flex items-center">
                    <input type={showPassword ? "text": "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded p-2 text-sm" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray-400 cursor-pointer ml-2" onClick={togglePasswordVisibility}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    </span>
                </div>
                <div className="px-4">
                    <div className="font-bold text-xs">Nombre</div>
                    <input type="text" value={name} onChange={handleNameChange} className="border rounded p-2 text-sm" />
                </div>
                <div className="px-4">
                    <div className="font-bold text-xs">Rol</div>
                    <select className="border rounded p-2 text-sm bg-gray-100 cursor-not-allowed" disabled>
                        <option>{rolesMap[usuario.rol] || "Rol desconocido"}</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button type="button" className="btn-guardar" onClick={handlesave}>Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default UsuarioAjustes;