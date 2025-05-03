import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Agenda.css';
import ReprogramarCita from '../components/ReprogramarCita';

const Agenda = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    /*
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthNamesEs = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const year = today.getFullYear();
    const weekday = today.toLocaleDateString('es-ES', { weekday: 'long' });
    */
    const [currentDate, setCurrentDate] = useState(new Date());

    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const weekday = currentDate.toLocaleDateString('es-ES', { weekday: 'long' });
    const monthNamesEs = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    const [asesorSeleccionado, setAsesorSeleccionado] = useState(0);
    const [citas, setCitas] = useState([]);
    const citasFiltradas = asesorSeleccionado === 0 ? citas : citas.filter(cita => cita.idasignado === asesorSeleccionado);
    const [rol, setRol] = useState('');
    const [asesores, setAsesores] = useState([]);
    const [statusCita, setStatusCita] = useState([]);


    const [fechasBloqueadas, setFechasBloqueadas] = useState([]);
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);
    
/*
    useEffect(() => {
                axios.get(`${backendUrl}/agenda`, {withCredentials: true})
                .then((response) => {
                    setCitas(response.data.citas);
                    setRol(response.data.rol[0])
                    setAsesores(response.data.asesores);
                })
                .catch((error) => {
                    console.error("Error al obtener los datos de la agenda: ", error);
                    alert("Error al obtener los datos de la agenda.\n"+error)
                });
        }, [backendUrl]);
*/

useEffect(() => {
    const interval = setInterval(() => {
        fetchCitas(currentDate);
    }, 5000); // 5000 ms = 5 segundos

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
}, [currentDate]);

const fetchCitas = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    axios.get(`${backendUrl}/agenda?fecha=${formattedDate}`, { withCredentials: true })
        .then((response) => {
            setCitas(response.data.citas);
            setRol(response.data.rol[0]);
            setAsesores(response.data.asesores);
            setFechasBloqueadas(response.data.fechasBloqueadas)
            const dates = response.data.fechasBloqueadas.map(fecha => new Date(fecha.fecha));
            setHighlightedDates(dates);
            setStatusCita(response.data.statuscita);
        })
        .catch((error) => {
            console.error("Error al obtener los datos de la agenda: ", error);
            alert("Error al obtener los datos de la agenda.\n" + error);
        });
};

useEffect(() => {
    fetchCitas(currentDate);
}, [currentDate]);

const handlePrevDay = () => {
    setCurrentDate(prevDate => {
        let newDate = new Date(prevDate);
        do {
            newDate.setDate(newDate.getDate() - 1);
        } while (fechasBloqueadas.some(fecha => new Date(fecha.fecha).toDateString() === newDate.toDateString()));
        return newDate;
    });
};

const handleNextDay = () => {
    setCurrentDate(prevDate => {
        let newDate = new Date(prevDate);
        do {
            newDate.setDate(newDate.getDate() + 1);
        } while (fechasBloqueadas.some(fecha => new Date(fecha.fecha).toDateString() === newDate.toDateString()));
        return newDate;
    });
};

        const handleAsesorChange = (e) => {
            setAsesorSeleccionado(Number(e.target.value));
        };

        const [showDatePicker, setShowDatePicker] = useState(false);

        const handleDateChange = (date) => {
            setCurrentDate(date);
            setShowDatePicker(false);
        };
        
        const handleStatusChange = (id, oldStatus, newStatus, resultado, motivo) => {
            if (newStatus == 0){
                while (true) {
                    motivo = prompt("Ingrese el motivo de cancelación de la cita:")

                    if (motivo === null) {
                        return;
                    }
            
                    if (motivo.trim() === "") {
                        alert("Debe ingresar un motivo de cancelación de la cita para continuar.");
                    } else {
                        break;
                    }
                }
            } else if (newStatus > 1 && oldStatus < 2){
                while (true) {
                    resultado = prompt("Ingrese el resultado de la cita:")

                    if (resultado === null) {
                        return;
                    }
            
                    if (resultado.trim() === "") {
                        alert("Debe ingresar un resultado de cita para continuar.");
                    } else {
                        break;
                    }
                }
            }
            axios.post(`${backendUrl}/agenda/cambiar-status`, {"idcita": id, "newstatus": newStatus, "motivo": motivo, "resultado": resultado}, { withCredentials: true })
                        .then((response) => {
                            console.log("Datos guardados correctamente:", response.data);
                            fetchCitas(currentDate);
                        })
                        .catch((error) => {
                            console.error("Error al cambiar el status:", error);
                            alert("Error al cambiar el status. Reintente.");
                });
        };
    return (
        
        <div className="flex justify-center">
            <div>
                <div className="w-56 text-center p-2 rounded-xl flex items-center justify-center h-48 border-2 border-black shadow-lg">
                    <div onClick={handlePrevDay}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 cursor-pointer hover:size-8 transition-all">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </div>
                    <div>
                        <div className="capitalize font-bold">
                            {weekday}
                            {fechasBloqueadas.some(fecha => new Date(fecha.fecha).toDateString() === currentDate.toDateString()) && (
                                <div className="bg-red-500 rounded-xl text-xs text-white py-1 flex justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                    Bloqueada
                                </div>
                            )}
                        </div>
                        <div className="text-8xl font-bold mb-2 cursor-pointer hover:text-cyan-500 hover:scale-105 transition-all" onClick={ () => setShowDatePicker(!showDatePicker)}>{day}</div>
                        <div>{monthNamesEs[month]} {year}</div>
                    </div>
                    <div onClick={handleNextDay}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 cursor-pointer hover:size-8 transition-all">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                    </div>
                </div>

                {showDatePicker && (
                <div className="mt-5">
                <DatePicker
                    selected={currentDate}
                    onChange={handleDateChange}
                    inline
                    highlightDates={[{ "react-datepicker__day--highlighted-custom-1": highlightedDates }]}
                />
                </div>
            )}

                <div className="my-5">
                    <select className="w-full border rounded p-1 text-sm italic" value={asesorSeleccionado} onChange={handleAsesorChange}>
                        <option value="0" key="0">Ver todas las citas</option>
                        {asesores.map((asesor) => (
                        <option value={asesor.id} key={asesor.id}>Citas de {asesor.fullname}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-center">
                    <button className="btn-guardar flex items-center w-full justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    Ver calendario completo</button>
                </div>
            </div>
            <div className="w-full px-4">
                <div>
                    <table className="tabla-agenda-citas">
                        <thead>
                            <tr className="bg-cyan-500 text-white">
                                <th>Hora</th>
                                <th>Cliente</th>
                                <th>Tipo y razón de cita</th>
                                <th>Caso</th>
                                <th>Oficina</th>
                            </tr>
                        </thead>
                        <tbody>
                        {citasFiltradas.length > 0 ? (
                                citasFiltradas.map((cita) => (
                                    <tr key={cita.idcita}>
                                        {/*
                                        <td className="w-8 text-center">
                                            {cita.done ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 text-green-700 cursor-pointer hover:text-gray-300 transition-all">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 text-gray-300 cursor-pointer hover:text-green-700 transition-all">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            )}
                                        </td>
                                        */}
                                        <td className="font-bold text-center w-40">
                                            <div className="flex items-center justify-center hover:underline transition-all cursor-pointer" onClick={() => { setSelectedCita(cita); setShowModal(true); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            {cita.hora}
                                            </div>
                                            <div className="relative group">
                                        <select className="text-sm text-white border rounded-xl text-center cursor-pointer w-full" style={{ backgroundColor: '#'+cita.colorstatuscita }} value={cita.idstatuscita} onChange={(e) => handleStatusChange(cita.idcita, cita.idstatuscita, e.target.value, cita.resultado, cita.motivo_cancelacion)}>
                                            {statusCita.map((status) => (
                                                <option key={status.id} value={status.id} className="bg-white text-black">
                                                    {status.statuscita}
                                                </option>
                                            ))}
                                        </select>
                                        {cita.idstatuscita === 0 && (
                                            <div className="absolute text-white text-xs font-bold p-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: '#'+cita.colorstatuscita }}>
                                                {cita.motivo_cancelacion}
                                            </div>
                                        )}
                                        </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center">
                                            <div className="hover:underline cursor-pointer transition-all hover:font-bold hover:text-gray-700 flex items-center" onClick={() => navigate(`/perfil/${cita.idcliente}`)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                                {cita.nombrecliente}
                                            </div>
                                                {cita.clasificacion == "LEAD" ? (<span className="text-xs italic text-blue-500 ml-2 font-bold">{cita.clasificacion}</span>) : (<span className="text-xs italic text-green-500 ml-2 font-bold">{cita.clasificacion}</span>)}
                                            </div>
                                            {cita.telefono1 && (
                                            <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                            </svg>
                                                {cita.telefono1}
                                            </div>
                                            )}
                                            {cita.telefono2 && (
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                                    </svg>
                                                    {cita.telefono2}{cita.pertenecetel && (<span>- {cita.pertenecetel2}</span>)}</div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="text-white border rounded-xl text-center font-bold w-32 text-sm" style={{ backgroundColor: '#'+cita.colortipocita }}>{cita.tipocita}</div>
                                            {cita.razon && (
                                            <div className="flex">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 self-top">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                </svg>
                                                <span>{cita.razon}</span>
                                            </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="hover:underline cursor-pointer transition-all hover:font-bold hover:text-orange-600 flex items-center" onClick={() => navigate(`/caso/${cita.idcaso}`)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                                </svg>
                                                {cita.idcaso} • {cita.nombrecaso}</div>
                                            <div className="text-red-500 text-xs font-bold">
                                                {cita.tipocaso} - {cita.subclase}
                                            </div>
                                            <div className="text-xs italic">
                                                Asignado a <span className="font-bold">{cita.asignado}</span>
                                            </div>
                                        </td>
                                        <td className="w-32 text-sm">{cita.oficina}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="p-rechazo text-green-600 justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                        </svg>
                                        No tiene citas para hoy
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                </div>
                
            </div>
            <ReprogramarCita showModal={showModal} setShowModal={setShowModal} selectedCita={selectedCita} />
        </div>
    );
};

export default Agenda;