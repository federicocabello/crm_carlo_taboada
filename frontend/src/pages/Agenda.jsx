import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Agenda.css';
import ReprogramarCita from '../components/ReprogramarCita';
import FormatearNumero from '../components/FormatearNumero'

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
    //const [currentDate, setCurrentDate] = useState(new Date());
    const [currentDate, setCurrentDate] = useState(() => {
        const now = new Date();
        now.setHours(now.getHours() - 3);  // Restar 4 horas
        return now;
    });

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
    const [loading, setLoading] = useState(false);

    const fetchCitas = (date) => {
    setLoading(true);
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
        })
        .finally(() => {
            setLoading(false);
        });
};

useEffect(() => {
    fetchCitas(currentDate);
    const interval = setInterval(() => {
        fetchCitas(currentDate);
        setLoading(false);
    }, 5000); // 5000 ms = 5 segundos

    return () => clearInterval(interval);
}, [currentDate]);

const esFinDeSemana = (fecha) => {
    const dia = fecha.getDay();
    return dia === 0 || dia === 6; // Domingo = 0, Sábado = 6
};

const estaBloqueada = (fecha) => {
    return fechasBloqueadas.some(f =>
        new Date(f.fecha).toDateString() === fecha.toDateString()
    );
};

const handlePrevDay = () => {
    setCurrentDate(prevDate => {
        let newDate = new Date(prevDate);
        do {
            newDate.setDate(newDate.getDate() - 1);
        } while (esFinDeSemana(newDate) || estaBloqueada(newDate));
        return newDate;
    });
};

const handleNextDay = () => {
    setCurrentDate(prevDate => {
        let newDate = new Date(prevDate);
        do {
            newDate.setDate(newDate.getDate() + 1);
        } while (esFinDeSemana(newDate) || estaBloqueada(newDate));
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
            if (newStatus == 0 || newStatus == 3 || newStatus == 5 || newStatus == 6 || newStatus == 9 || newStatus == 10 || newStatus == 11) {
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
            }
            axios.post(`${backendUrl}/agenda/cambiar-status`, {"idcita": id, "newstatus": newStatus, "motivo": motivo, "resultado": resultado}, { withCredentials: true })
                        .then((response) => {
                            console.log("Datos guardados correctamente:", response.data);
                            fetchCitas(currentDate);
                        })
                        .catch((error) => {
                            console.error("Error al cambiar el status:", error);
                            alert("❌ Error al cambiar el status. Reintente.");
                });
        };

        const handleDeleteCita = (idcita, hora, idcaso) => {
            const confirmacion = window.confirm("¿Estás seguro de que deseas borrar la cita de las "+hora+"?");
            if (!confirmacion) return;

            axios.post(`${backendUrl}/citas/borrar`, {"idcita": idcita, "hora": hora}, { withCredentials: true })
                        .then((response) => {
                            console.log(response.data.mensaje);
                            alert(response.data.mensaje);
                            //fetchCitas(currentDate);
                        })
                        .catch((error) => {
                            console.error("Error al borrar la cita:", error);
                            alert("❌ Error al borrar la cita. Reintente.");
                });
        }
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
                                <div className="bg-red-500 rounded-xl text-xs text-white py-1 flex justify-center items-center w-24 border-white">
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
                    <select className="w-56 justify-center border rounded p-1 text-sm italic" value={asesorSeleccionado} onChange={handleAsesorChange}>
                        <option value="0" key="0">Ver todas las citas</option>
                        {asesores.map((asesor) => (
                        <option value={asesor.id} key={asesor.id}>Citas de {asesor.fullname}</option>
                        ))}
                    </select>
                </div>
{/*
                <div className="flex justify-center">
                    <button className="btn-guardar flex items-center w-full justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    Ver calendario completo</button>
                </div>
*/}
            </div>
            <div className="w-full px-4">
                <div>
                    <table className="tabla-agenda-citas">
                        <thead>
                            <tr className="bg-cyan-500 text-white text-xs">
                                <th>Hora</th>
                                <th>Cliente</th>
                                <th>Tipo y razón de cita</th>
                                <th>Caso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className="hover:cursor-wait">
                                    <td colSpan={4}>
                                    <div className="flex items-center justify-center text-green-600 p-1 animate-pulse font-bold">
                                        <svg
                                        className="animate-spin h-5 w-5 mr-2 text-green-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        />
                                        </svg>
                                        Buscando...
                                    </div>
                                    </td>
                                </tr>
                            ) :
                        citasFiltradas.length > 0 ? (
                                citasFiltradas.map((cita) => (
                                    <tr key={cita.idcita}>
                                        <td className="font-bold text-center w-56">
                                            <div className="flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                                <span title="Reprogramar cita" className="hover:underline transition-all cursor-pointer" onClick={() => { setSelectedCita(cita); setShowModal(true); }}>{cita.hora}</span>
                                                {rol == 'superadmin' && (
                                                <span title="Borrar cita" className="bg-red-500 ml-1 rounded-full p-1 hover:bg-red-600 transition-all cursor-pointer" onClick={() => handleDeleteCita(cita.idcita, cita.hora, cita.idcaso)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-white">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </span>
                                                )}
                                            </div>
                                            
                                            <div className="relative group">
                                        <select className="text-sm text-white border rounded-xl text-center cursor-pointer w-full my-1" style={{ backgroundColor: '#'+cita.colorstatuscita }} value={cita.idstatuscita} onChange={(e) => handleStatusChange(cita.idcita, cita.idstatuscita, e.target.value, cita.resultado, cita.motivo_cancelacion)}>
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
                                        <div className="text-xs italic font-normal">Agendado por <span className="text-red-500 font-bold">{cita.creador}</span></div>
                                        </div>
                                        </td>
                                        <td>
                                            <div>{cita.clasificacion == "LEAD" ? (<span className="text-xs italic text-blue-500 font-bold">{cita.clasificacion}</span>) : (<span className="text-xs italic text-green-500 font-bold">{cita.clasificacion}</span>)}</div>
                                            <div className="flex items-center text-xs">
                                            <div className="hover:underline cursor-pointer transition-all hover:font-bold hover:text-gray-700 flex items-center" onClick={() => navigate(`/perfil/${cita.idcliente}`)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 self-top mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                                {cita.nombrecliente}
                                            </div>
                                            </div>
                                            {cita.telefono1 && (
                                            <div className="flex items-center text-xs">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 self-top mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                            </svg>
                                                {cita.telefono1}
                                            </div>
                                            )}
                                            {cita.telefono2 && (
                                                <div className="flex items-center text-xs">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 self-top mr-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                                    </svg>
                                                    {cita.telefono2}{cita.pertenecetel && (<span>- {cita.pertenecetel2}</span>)}</div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-between">
                                                <div className="text-white border rounded-xl text-center font-bold w-48 text-sm" style={{ backgroundColor: '#'+cita.colortipocita }}>{cita.tipocita}</div>
                                                {cita.deuda > 0 ? (
                                                    <div className="text-slate-400 font-bold rounded-xl text-center border text-sm border-slate-400 w-48">
                                                        ADEUDA <FormatearNumero numero={parseFloat(cita.deuda)} />
                                                    </div>
                                                ) : (
                                                    <div className="text-green-500 font-bold rounded-xl text-center border text-sm border-green-500 w-40 flex justify-center items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                        </svg>
                                                        <span>SIN DEUDA</span>
                                                    </div>
                                                )}
                                                {cita.proximo > 0 && (
                                                    <div className="flex justify-center items-center text-red-500 border text-sm font-bold rounded-xl w-56 border-red-500">
                                                        <span className="mr-1">PRÓXIMO PAGO</span>
                                                        <div><FormatearNumero numero={parseFloat(cita.proximo)} /></div>
                                                    </div>
                                                )}
                                                {!cita.proximo && cita.deuda > 0 && (
                                                    <div className="flex justify-center items-center text-red-500 border text-sm font-bold rounded-xl w-56 border-red-500">
                                                        <span className="mr-1">PRÓXIMO PAGO</span>
                                                        <div><FormatearNumero numero={parseFloat(cita.deuda)} /></div>
                                                    </div>
                                                )}
                                                <div className="text-gray-500 border border-gray-500 rounded-xl text-center font-bold w-32 text-sm">{cita.oficina}</div>
                                            </div>
                                            {cita.razon && (
                                            <div className="flex text-xs mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 self-top">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                </svg>
                                                {cita.razon}
                                            </div>
                                            )}
                                            {!cita.resultado.trim() && (cita.idstatuscita == 7 || cita.idstatuscita == 8 || cita.idstatuscita == 2) && (
                                                <div className="text-red-500 font-bold text-xs mt-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                                    </svg>
                                                    FALTA RESULTADO DE LA CITA
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="hover:underline cursor-pointer transition-all hover:font-bold hover:text-orange-600 flex items-center text-xs" onClick={() => navigate(`/caso/${cita.idcaso}`)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 self-top mr-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                                </svg>
                                                {cita.idcaso}{cita.nombrecaso.trim() != "" && (" • "+cita.nombrecaso)}
                                            </div>
                                            <div className="text-red-500 text-xs font-bold">
                                                {cita.tipocaso} - {cita.subclase}
                                            </div>
                                            <div className="text-xs italic">
                                                Asignado a <span className="font-bold">{cita.asignado}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="flex items-center justify-center text-gray-500 p-1 animate-pulse font-bold">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002" />
                                            </svg>
                                            No se encontraron citas</div>
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