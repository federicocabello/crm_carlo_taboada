import React, { useState, useEffect } from "react"
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Configuracion.css';

const Configuracion = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [activeTab, setActiveTab] = useState("calendario");
    const [highlightedDates, setHighlightedDates] = useState([]);

    const [fechasBloqueadas, setFechasBloqueadas] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tipoCaso, setTipoCaso] = useState([]);
    const [subClase, setSubClase] = useState([]);
    const [statusCasos, setStatusCasos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [tipoCita, setTipoCita] = useState([]);
    const [statusCita, setStatusCita] = useState([]);

    const cargarSitioConfiguracion = () => {
        axios.get(`${backendUrl}/configuracion`, {withCredentials: true})
                            .then((response) => {
                                setFechasBloqueadas(response.data.fechasBloqueadas)
                                const dates = response.data.fechasBloqueadas.map(fecha => new Date(fecha.fecha));
                                setHighlightedDates(dates);
                                setTipoCaso(response.data.tipoCaso);
                                setSubClase(response.data.subClase);
                                setStatusCasos(response.data.statusCaso);
                                setUsuarios(response.data.usuarios);
                                setTipoCita(response.data.tipoCita);
                                setStatusCita(response.data.statusCita);
                            })
                            .catch((error) => {
                                console.error("Error al obtener los datos de configuración: ", error);
                                alert("Error al obtener los datos de configuración.");
                            });
    };

    useEffect(() => {
                    cargarSitioConfiguracion();
            }, [backendUrl]);
    
            const nuevaFechaBloqueada = () => {
                let motivo = prompt("Ingrese el motivo para bloquear esta fecha:");
                if (motivo) {
                    motivo = motivo.toUpperCase().trim()
                    const formattedDate = selectedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });
                    const nuevaFecha = {
                        fecha: formattedDate,
                        motivo: motivo
                    };
                    axios.post(`${backendUrl}/configuracion/bloquear-fecha`, nuevaFecha, { withCredentials: true })
                        .then((response) => {
                            setFechasBloqueadas([...fechasBloqueadas, nuevaFecha]);
                            setHighlightedDates([...highlightedDates, new Date(nuevaFecha.fecha)]);
                        })
                        .catch((error) => {
                            console.error("Error al bloquear la fecha: ", error);
                            alert("Error al bloquear la fecha. Reintente.");
                        });
                }
            };

            const agregarSubclase = (tipocaso, id) => {
                const subclase = prompt(`Ingrese la subclase para el tipo de caso ${tipocaso.toUpperCase()}:`);
                if (subclase) {
                    axios.post(`${backendUrl}/configuracion/agregar-subclase`, {"subclase": subclase, "id": id}, { withCredentials: true })
                        .then((response) => {
                            cargarSitioConfiguracion();
                        })
                        .catch((error) => {
                            console.error("Error al agregar subclase: ", error);
                            alert("Error al agregar subclase. Reintente.");
                        });
                }
            };

            const eliminarFechaBloqueada = (fecha) => {
                axios.post(`${backendUrl}/configuracion/quitar-fecha-bloqueada`, {"fecha": fecha}, { withCredentials: true })
                        .then((response) => {
                            cargarSitioConfiguracion();
                        })
                        .catch((error) => {
                            console.error("Error al quitar la fecha: ", error);
                            alert("Error al quitar la fecha. Reintente.");
                        });
            };

            const agregarTipoCaso = () => {
                const tipoCaso = prompt("Ingrese el tipo de caso:");
                if (tipoCaso) {
                    axios.post(`${backendUrl}/configuracion/agregar-tipo-caso`, {"tipo": tipoCaso}, { withCredentials: true })
                            .then((response) => {
                                cargarSitioConfiguracion();
                            })
                            .catch((error) => {
                                console.error("Error al agregar tipo de caso: ", error);
                                alert("Error al agregar tipo de caso. Reintente.");
                            });
                };
            };

            const colorStatusCaso = (id) => {
                axios.post(`${backendUrl}/configuracion/cambiar-color-status-caso`, {"statusCasos": statusCasos, "idstatuscaso": id}, { withCredentials: true })
                        .then((response) => {
                            console.log("Color de status de caso actualizado correctamente.");
                        })
                        .catch((error) => {
                            console.error("Error al cambiar el color del status de caso: ", error);
                            alert("Error al cambiar el color del status de caso. Reintente.");
                        });
            };

            const agregarStatusCaso = () => {
                const statusCaso = prompt("Ingrese el status de caso:");
                if (statusCaso) {
                    axios.post(`${backendUrl}/configuracion/agregar-status-caso`, {"status": statusCaso}, { withCredentials: true })
                            .then((response) => {
                                cargarSitioConfiguracion();
                            })
                            .catch((error) => {
                                console.error("Error al agregar status de caso: ", error);
                                alert("Error al agregar status de caso. Reintente.");
                            });
                };
            };

            const agregarTipoCita = () => {
                const tipoCita = prompt("Ingrese el tipo de cita:");
                if (tipoCita) {
                    axios.post(`${backendUrl}/configuracion/agregar-tipo-cita`, {"tipo": tipoCita}, { withCredentials: true })
                            .then((response) => {
                                cargarSitioConfiguracion();
                            })
                            .catch((error) => {
                                console.error("Error al agregar tipo de cita: ", error);
                                alert("Error al agregar tipo de cita. Reintente.");
                            });
                };
            };

            const cambiarRolUsuario = (id, rol, nombre) => {
                axios.post(`${backendUrl}/configuracion/usuarios/cambiar-rol-usuario`, {"id": id, "rol": rol, "nombre": nombre}, { withCredentials: true })
                        .then((response) => {
                            cargarSitioConfiguracion();
                        })
                        .catch((error) => {
                            console.error("Error al cambiar el rol del usuario: ", error);
                            alert("Error al cambiar el rol del usuario. Reintente.");
                        });
            };

            const cambiarClasificacionUsuario = (id, clasificacion, nombre) => {
                axios.post(`${backendUrl}/configuracion/usuarios/cambiar-clasificacion-usuario`, {"id": id, "clasificacion": clasificacion, "nombre": nombre}, { withCredentials: true })
                        .then((response) => {
                            cargarSitioConfiguracion();
                        })
                        .catch((error) => {
                            console.error("Error al cambiar la clasificacion del usuario: ", error);
                            alert("Error al cambiar la clasificacion del usuario. Reintente.");
                        });
            };

            const agregarUsuario = () => {
                const nombre = prompt("Ingrese el nombre completo del usuario:").toUpperCase().trim();

                function sugerirUsername(nombreCompleto) {
                    const normalizado = nombreCompleto
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toUpperCase()
                      .trim();
                  
                    const partes = normalizado.split(" ");
                    if (partes.length < 2) return "";
                  
                    const inicial = partes[0][0];
                    const apellido = partes[1];
                  
                    return (inicial + apellido).toLowerCase();
                  }

                const user = prompt("Ingrese el usuario para "+nombre+" sin espacios.\nSugerencia: "+sugerirUsername(nombre), sugerirUsername(nombre)).toLowerCase().replace(" ", "");
                if (nombre && user) {
                    axios.post(`${backendUrl}/usuario/nuevo`, {"nombre": nombre, "user": user}, { withCredentials: true })
                            .then((response) => {
                                alert("Usuario agregado correctamente.\n\nNombre: "+nombre+"\nUsuario: "+user+"\nContraseña: ctaboada2025");
                                cargarSitioConfiguracion();
                            })
                            .catch((error) => {
                                console.error("Error al agregar usuario nuevo: ", error);
                                alert("Error al agregar usuario nuevo. Reintente.");
                            });
                };
            };

            const cambiarHabilitacionUsuario = (id, habilitacion, nombre) => {
                axios.post(`${backendUrl}/configuracion/usuarios/cambiar-habilitacion-usuario`, {"id": id, "nombre": nombre, "habilitacion": habilitacion}, { withCredentials: true })
                        .then((response) => {
                            cargarSitioConfiguracion();
                        })
                        .catch((error) => {
                            console.error("Error al cambiar la habilitación del usuario: ", error);
                            alert("Error al cambiar la habilitación del usuario. Reintente.");
                        });
            };

            const colorTipoCita = (id) => {
                axios.post(`${backendUrl}/configuracion/cambiar-color-tipo-cita`, {"tipoCita": tipoCita, "idtipocita": id}, { withCredentials: true })
                        .then((response) => {
                            console.log("Color de tipo de cita actualizado correctamente.");
                        })
                        .catch((error) => {
                            console.error("Error al cambiar el color del tipo de cita: ", error);
                            alert("Error al cambiar el color del tipo de cita. Reintente.");
                        });
            };

    return (
        <div className="flex">
            <div>
                <ul className="menu-izquierdo bg-white border rounded-md w-64 mr-5">
                    <li className={`${activeTab === "calendario" ? "lista-activada" : ""}`} onClick={() => setActiveTab("calendario")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                        Calendario
                    </li>
                    <li className={`${activeTab === "casos" ? "lista-activada" : ""}`} onClick={() => setActiveTab("casos")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                    </svg>
                        Casos
                    </li>
                    <li className={`${activeTab === "citas" ? "lista-activada" : ""}`} onClick={() => setActiveTab("citas")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                        Citas
                    </li>
                    <li className={`${activeTab === "usuarios" ? "lista-activada" : ""}`} onClick={() => setActiveTab("usuarios")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                        Usuarios
                    </li>
                    <li className={`${activeTab === "captura-de-datos" ? "lista-activada" : ""}`} onClick={() => setActiveTab("captura-de-datos")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                    </svg>
                        Captura de datos
                    </li>
                </ul>
                </div>
            <div className="w-full">
                {activeTab == "calendario" && (
                    <div className="div-config-calendario">
                        <div className="font-bold text-xl">Fechas bloqueadas</div>
                        <hr className="my-2" />
                        <div className="flex justify-around">
                            {fechasBloqueadas.length > 0 ? (
                            <div className="w-1/2 mr-5">
                            <table className="border-2 rounded w-full">
                                <thead>
                                    <tr className="bg-orange-200 text-orange-700">
                                        <th className="w-40">Fecha</th>
                                        <th colSpan={2}>Motivo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fechasBloqueadas.map((fechaBloqueada) => (
                                        <tr className="border hover:bg-white">
                                            <td className="text-center font-bold border">{fechaBloqueada.fecha}</td>
                                            <td className="p-2">{fechaBloqueada.motivo}</td>
                                            <td className="w-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer hover:text-red-700 transition-all" onClick={() => eliminarFechaBloqueada(fechaBloqueada.fecha)}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" />
                                            </svg>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                            ) : (
                            <div className="p-rechazo">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                                No hay fechas bloqueadas este año.
                            </div>
                            )}
                            <div className="flex items-center">
                                <DatePicker
                                    inline
                                    highlightDates={[{ "react-datepicker__day--highlighted-custom-1": highlightedDates }]}
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 ml-5 cursor-pointer hover:text-green-600 transition-all" onClick={nuevaFechaBloqueada}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab == "casos" && (
                    <div>
                        <div className="font-bold text-xl">
                            Tipos de caso
                            <button className="btn-guardar ml-2 text-xs p-1 rounded-full px-2" onClick={agregarTipoCaso}>+ Agregar tipo de caso</button>
                        </div>
                        <hr className="my-2" />
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-orange-400 text-white">
                                    <th className="border">Tipo</th>
                                    <th className="border">Subclases</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tipoCaso.map((tipo) => (
                                    <tr key={tipo.id}>
                                        <td className="border font-bold p-2">
                                            <div>{tipo.tipocaso}</div>
                                            <button className="btn-guardar text-xs h-8 bg-transparent border-none text-green-500 hover:bg-transparent hover:text-green-700 hover:underline" onClick={() => agregarSubclase(tipo.tipocaso, tipo.id)}>+ Agregar subclase</button>
                                        </td>
                                        <td className="border p-2">
                                            {subClase
                                                .filter((sub) => sub.idtipo === tipo.id)
                                                .map((sub) => (
                                                    <div key={sub.id}>
                                                        • {sub.subclase}
                                                    </div>
                                                ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="font-bold text-xl mt-5">
                            Status de casos
                            <button className="btn-guardar ml-2 text-xs p-1 rounded-full px-2" onClick={agregarStatusCaso}>+ Agregar status de caso</button>
                        </div>
                        <hr className="my-2" />
                        <table>
                            <thead>
                                <tr className="bg-blue-400 text-white">
                                    <th className="font-bold border w-48">Status</th>
                                    <th className="font-bold border w-24">Color</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statusCasos.map((status) => (
                                    <tr key={status.id}>
                                        <td className="border p-2">
                                            <div className="text-sm text-white border rounded-xl text-center w-full font-bold" style={{ backgroundColor: '#'+status.colorstatuscaso }}>{status.statuscaso}</div>
                                        </td>
                                        <td className="border p-2">
                                            <div className="items-center flex justify-center">
                                            <input type="color" className="rounded-full" value={`#${status.colorstatuscaso}`} onChange={(e) => {const newColor = e.target.value.replace('#', ''); setStatusCasos((prevStatusCasos) => prevStatusCasos.map((item) => item.id === status.id ? { ...item, colorstatuscaso: newColor } : item));}} onBlur={() => colorStatusCaso(status.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab == "citas" && (
                    <div>
                    <div className="font-bold text-xl">
                        Tipos de citas
                        <button className="btn-guardar ml-2 text-xs p-1 rounded-full px-2" onClick={agregarTipoCita}>+ Agregar tipo de cita</button>
                    </div>
                    <hr className="my-2" />
                    <table>
                            <thead>
                                <tr className="bg-orange-400 text-white">
                                    <th className="font-bold border w-48">Tipo</th>
                                    <th className="font-bold border w-24">Color</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tipoCita.map((cita) => (
                                    <tr key={cita.id}>
                                        <td className="border p-2">
                                            <div className="text-sm text-white border rounded-xl text-center w-full font-bold" style={{ backgroundColor: '#'+cita.colortipocita }}>{cita.tipocita}</div>
                                        </td>
                                        <td className="border p-2">
                                            <div className="items-center flex justify-center">
                                            <input type="color" className="rounded-full" value={`#${cita.colortipocita}`} onChange={(e) => {const newColor = e.target.value.replace('#', ''); setTipoCita((prevTipoCita) => prevTipoCita.map((item) => item.id === cita.id ? { ...item, colortipocita: newColor } : item));}} onBlur={() => colorTipoCita(cita.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab == "usuarios" && (
                    <div>
                    <div className="font-bold text-xl">
                        Gestión de usuarios
                        <button className="btn-guardar ml-2 text-xs p-1 rounded-full px-2" onClick={agregarUsuario}>+ Agregar usuario nuevo</button>
                    </div>
                    <hr className="my-2" />
                    <table>
                        <thead>
                            <tr className="bg-gray-200 text-black">
                                <th className="font-bold border">Nombre</th>
                                <th className="font-bold border">Usuario</th>
                                <th className="font-bold border">Rol</th>
                                <th className="font-bold border w-24">Asesor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-gray-200">
                                    <td className="border p-2">{usuario.fullname}
                                        {usuario.habilitado == 0 && (
                                            <div className="font-bold text-white text-xs bg-red-500 px-1 border rounded-full text-center">INHABILITADO</div>
                                        )}
                                    </td>
                                    <td className="border p-2 font-bold">{usuario.user}</td>
                                    <td className="border p-2">
                                        <select value={usuario.rol} className="border rounded p-1 cursor-pointer" onChange={(e) => cambiarRolUsuario(usuario.id, e.target.value, usuario.fullname)} disabled={usuario.habilitado == 0}>
                                            <option value="admin">Administrador</option>
                                            <option value="user">Usuario</option>
                                        </select>
                                    </td>
                                    <td className="border p-2 text-center">
                                        <input type="checkbox" checked={usuario.clasificacion === "asesor"} onChange={(e) => cambiarClasificacionUsuario(usuario.id, e.target.checked ? true : false, usuario.fullname)} className="cursor-pointer" disabled={usuario.habilitado == 0} />
                                    </td>
                                    <td className="hover:bg-gray-100">
                                        {usuario.habilitado == 1 ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mx-2 cursor-pointer text-gray-400 hover:text-red-500 transition-all hover:scale-110" onClick={() => cambiarHabilitacionUsuario(usuario.id, 0, usuario.fullname)}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
                                        </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mx-2 cursor-pointer text-gray-400 hover:text-green-500 transition-all hover:scale-110" onClick={() => cambiarHabilitacionUsuario(usuario.id, 1, usuario.fullname)}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                            </svg>
                                        )}
                                    </td>
                                </tr>
                                ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Configuracion;