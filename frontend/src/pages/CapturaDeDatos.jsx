import React, {useState, useEffect, useRef } from "react";
import './FullCalendar.css';
import './CapturaDeDatos.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import esLocale from '@fullcalendar/core/locales/es';

const CapturaDeDatos = ({nuevaConsulta, idCliente, nombreCliente, editarCitaCaso, onDateHourSelect}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(false);
    const nombreInputRef = useRef(null);
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [telefonoUno, setTelefonoUno] = useState("");
    const [telefonoDos, setTelefonoDos] = useState("");
    const [razonCita, setRazonCita] = useState("");
    const [pertenece, setPertenece] = useState("")

    const [oficina, setOficina] = useState([]);
    const [referido, setReferido] = useState([]);
    const [tipoCita, setTipoCita] = useState([]);
    const [asesor, setAsesor] = useState([]);
    const [tipoCaso, setTipoCaso] = useState([]);
    const [subClase, setSubClase] = useState([]);
    
    const [selectedOficina, setSelectedOficina] = useState('');
    const [selectedTipoCita, setSelectedTipoCita] = useState('');
    const [selectedReferido, setSelectedReferido] = useState('');
    const [selectedAsesor, setSelectedAsesor] = useState('');
    const [selectedTipoCaso, setSelectedTipoCaso] = useState('');
    const [selectedSubclase, setSelectedSubclase] = useState('');

    const [files, setFiles] = useState([]);
    
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [freeHours, setFreeHours] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [selectedHour, setSelectedHour] = useState('');
    const [fechasBloqueadas, setFechasBloqueadas] = useState([]);

    const [schedule, setSchedule] = useState([])

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    useEffect(() => {
            axios.get(`${backendUrl}/captura-de-datos`, {withCredentials: true})
            .then((response) => {
                setOficina(response.data.oficina);
                setReferido(response.data.referido);
                setTipoCita(response.data.tipocita);
                setAsesor(response.data.asesores);
                setTipoCaso(response.data.tipo_caso);
                setSubClase(response.data.subclase);
                const citas = Array.isArray(response.data.citas_calendario) ? response.data.citas_calendario : [];
                setRawData(citas);
                const transformedEvents = citas.map((cita) => ({
                    title: `Horas: ${cita.hora}`,
                    start: cita.fecha,
                    color: "red",
                }))
                setEvents(transformedEvents);
                setFechasBloqueadas(response.data.fechas_bloqueadas);
                setSchedule(Array.isArray(response.data.schedule) ? response.data.schedule : []);
            })
            .catch ((error) => {
            console.error("Error al obtener los datos:", error);
        });
        }, [backendUrl]);

const handleClickDate = (dateInfo) => {
    const clickedDate = dateInfo.dateStr;

    // Verificar si la fecha está bloqueada
    const isBlocked = fechasBloqueadas.some(
        (blockedDate) => new Date(blockedDate.fecha).toISOString().split("T")[0] === clickedDate
    );

    // Si la fecha está bloqueada, no hacer nada
    if (isBlocked) {
        return;
    }

    const dayEvents = rawData.filter((cita) => cita.fecha === clickedDate);
    const occupiedSlots = {};
    dayEvents.forEach((cita) => {
        const hours = cita.hora.split(", ");
        hours.forEach((hour) => {
            occupiedSlots[hour] = (occupiedSlots[hour] || 0) + 1;
        });
    });

    const free = schedule.filter((slot) => (occupiedSlots[slot.hour] || 0) < slot.maxAppointments).map((slot) => slot.hour);

    setFreeHours(free);
    setSelectedDate(clickedDate);
};

const handleClickHour = (hour) => {
    setSelectedHour(hour);
}

const handleClickHourCita = (hour) => {
    setSelectedHour(hour);
    if (selectedDate) {
        onDateHourSelect(selectedDate, hour);
    }
};

    const handleEnviar =  (e) => {
            setLoading(true);
            e.preventDefault();

            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('telefonoUno', telefonoUno);
            formData.append('telefonoDos', telefonoDos);
            formData.append('razonCita', razonCita);
            formData.append('selectedHour', selectedHour);
            formData.append('selectedDate', selectedDate);
            formData.append('selectedOficina', selectedOficina);
            formData.append('selectedReferido', selectedReferido);
            formData.append('selectedTipoCita', selectedTipoCita);
            formData.append('selectedAsesor', selectedAsesor);
            formData.append('selectedTipoCaso', selectedTipoCaso);
            formData.append('selectedSubclase', selectedSubclase);
            formData.append('pertenece', pertenece)

            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
            
            axios.post(`${backendUrl}/captura-de-datos/guardar`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                if (response.data.status === 200){
                console.log(response.data.mensaje);
                alert(response.data.mensaje);
                navigate('/gestion-de-leads');
                }
            })
            .catch ((error) => {
            console.error("Error al capturar datos. Reintente.", error.response?.data?.message || error.message);
            alert("Error al capturar los datos. Hay faltantes o erróneos. Reintente.");
        });
    };

    const handleEnviarNuevaConsulta =  (e) => {
        setLoading(true);
        e.preventDefault();

        const formData = new FormData();
        formData.append('idcliente', idCliente);
        formData.append('nombre', nombreCliente);
        formData.append('razonCita', razonCita);
        formData.append('selectedHour', selectedHour);
        formData.append('selectedDate', selectedDate);
        formData.append('selectedTipoCita', selectedTipoCita);
        formData.append('selectedAsesor', selectedAsesor);
        formData.append('selectedTipoCaso', selectedTipoCaso);
        formData.append('selectedSubclase', selectedSubclase);

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        
        axios.post(`${backendUrl}/consultas/nueva`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            if (response.data.status === 200){
            console.log(response.data.mensaje);
            alert(response.data.mensaje);
            navigate('/gestion-de-leads');
            }
        })
        .catch ((error) => {
        console.error("Error al guardar nueva consulta. Reintente.", error.response?.data?.message || error.message);
        alert("Error al guardar nueva consulta. Hay faltantes o erróneos. Reintente.");
    });
};

    const formatDate = (dateString) => {
        const date = new Date(dateString + "T00:00:00");
        //console.log(dateString)
        //console.log(date)
        return new Intl.DateTimeFormat('es-ES', {
            timeZone: "America/New_York",
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    }

    const formatHour = (hourString) => {
        const [hour, minute] = hourString.split(":").map(Number);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
    };

    const [isFormValid, setIsFormValid] = useState(false);

    const validateForm = () => {
        const isValid = nombre.trim() !== "" &&
                        telefonoUno.trim() !== "" &&
                        razonCita.trim() !== "" &&
                        selectedOficina !== "" &&
                        selectedReferido !== "" &&
                        selectedTipoCaso !== "" &&
                        selectedAsesor !== "" &&
                        selectedTipoCita !== "" &&
                        selectedDate !== "" &&
                        selectedHour !== "";
        setIsFormValid(isValid);
    };

    useEffect(() => {
        if (nuevaConsulta) {
            validateFormConsulta()
        } else {
            validateForm();
        }
    }, [nombre, telefonoUno, razonCita, selectedOficina, selectedReferido, selectedTipoCaso, selectedAsesor, selectedTipoCita, selectedDate, selectedHour]);

    const [isFormValidConsulta, setIsFormValidConsulta] = useState(false);

    const validateFormConsulta = () => {
        const isValid = razonCita.trim() !== "" &&
                        selectedTipoCaso !== "" &&
                        selectedAsesor !== "" &&
                        selectedTipoCita !== "";
                        //&&
                        //selectedDate !== "" &&
                        //selectedHour !== "";
        setIsFormValidConsulta(isValid);
    };

return (
    <div>
        {!editarCitaCaso ? (
        <div className="contenedor-grande">

            <div className="mr-4 grid">
                {!nuevaConsulta && (
                <div className="mb-2">
                <div>Nombre<span className="ml-1 text-red-500">(*)</span></div>
                <input className="input-cap" type="text" ref={nombreInputRef} onChange={(e) => setNombre(e.target.value)} />
                </div>
                )}

                {!nuevaConsulta && (
                <div className="mb-2">
                <div>Teléfono 1<span className="ml-1 text-red-500">(*)</span></div>
                <input className="input-cap" type="text" onChange={(e) => setTelefonoUno(e.target.value)} />
                </div>
                )}

                {!nuevaConsulta && (
                <div className="mb-2">
                        <div>Teléfono 2</div>
                        <input className="input-cap" type="text" onChange={(e) => setTelefonoDos(e.target.value)} />
                        <div>
                            <input className="input-cap" type="text" placeholder="Pertenece a..." onChange={(e) => setPertenece(e.target.value)} />
                        </div>
                </div>
                )}
                <div className="mb-2">
                <div>Razón de la cita<span className="ml-1 text-red-500">(*)</span></div>
                {!nuevaConsulta ? (
                    <textarea className="w-96 h-32 p-2 border rounded resize-none uppercase" onChange={(e) => setRazonCita(e.target.value)}></textarea>
                ) : (
                    <textarea className="w-96 h-80 p-2 border rounded resize-none uppercase" onChange={(e) => setRazonCita(e.target.value)}></textarea>
                )}
                </div>

                <div className="flex items-end">
                    <div>
                        <div>Cargar documentos</div>
                        <input type="file" className="w-full" style={{ fontSize: '11px' }} multiple onChange={handleFileChange} />
                    </div>
                    <div className="w-1/2 ml-2">
                    {!nuevaConsulta ? (
                        <button type="button" className={`btn-guardar w-full ${!isFormValid && 'bg-gray-300 cursor-not-allowed hover:bg-gray-300 text-gray-100'}`} onClick={handleEnviar} disabled={!isFormValid || loading}>{loading ? 'Cargando...' : 'Guardar'}</button>
                    ) : (
                        <button type="button" className={`btn-guardar w-full ${!isFormValidConsulta && 'bg-gray-300 cursor-not-allowed hover:bg-gray-300 text-gray-100'}`} onClick={handleEnviarNuevaConsulta} disabled={!isFormValidConsulta || loading}>{loading ? 'Cargando...' : 'Guardar'}</button>
                    )}
                    </div>
                </div>
            </div>

            <div className="mr-4 grid">
                {!nuevaConsulta && (
                <div className="mb-2">
                    <div>Oficina<span className="ml-1 text-red-500">(*)</span></div>
                    <select className="select-cap" onChange={(e) => setSelectedOficina(e.target.value)}>
                    <option value="" key="" className="text-gray-400 italic">Seleccione una oficina...</option>
                    {oficina.map((item) => (
                            <option key={item.id} value={item.id}>{item.oficina}</option>
                        ))}
                    </select>
                </div>
                )}

                {!nuevaConsulta && (
                <div className="mb-2">
                    <div>Fuente<span className="ml-1 text-red-500">(*)</span></div>
                    <select className="select-cap" onChange={(e) => setSelectedReferido(e.target.value)}>
                    <option value="" key="" className="text-gray-400 italic">Seleccione una fuente...</option>
                    {referido.map((item) => (
                            <option key={item.id} value={item.id}>{item.referido}</option>
                        ))}
                    </select>
                </div>
                )}

                <div className="mb-2">
                    <div>Tipo de caso<span className="ml-1 text-red-500">(*)</span></div>
                    <select className="select-cap" onChange={(e) => setSelectedTipoCaso(e.target.value)}>
                        <option value="0" key="0" className="text-gray-400 italic">Seleccione un tipo de caso...</option>
                        {tipoCaso.map((item) => (
                            <option key={item.id} value={item.id}>{item.tipocaso}</option>
                        ))}
                    </select>
                    {selectedTipoCaso && (
                    <div>
                        <select className="select-cap" onChange={(e) => setSelectedSubclase(e.target.value)}>
                            <option value="0" key="0" className="text-gray-400 italic">Seleccione una subclase...</option>
                            {subClase
                                .filter((sub) => sub.idtipocaso == selectedTipoCaso)
                                .map((sub) => (
                                    <option key={sub.idsubclase} value={sub.idsubclase}>{sub.subclase}</option>
                                ))}
                        </select>
                    </div>
                    )}
                </div>

                <div className="mb-2">
                    <div>Asignar a<span className="ml-1 text-red-500">(*)</span></div>
                    <select className="select-cap" onChange={(e) => setSelectedAsesor(e.target.value)}>
                        <option value="" key="" className="text-gray-400 italic">Seleccione un asesor...</option>
                        {asesor.map((item) => (
                            <option key={item.id} value={item.id}>{item.asesor}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <div>Tipo de cita<span className="ml-1 text-red-500">(*)</span></div>
                    <select className="select-cap" onChange={(e) => setSelectedTipoCita(e.target.value)}>
                    <option value="" key="" className="text-gray-400 italic">Seleccione un tipo de cita...</option>
                    {tipoCita.map((item) => (
                            <option key={item.id} value={item.id}>{item.tipocita}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <div>Cita<span className="ml-1 text-red-500">(*)</span></div>
                    <input type="text" className="w-80 border-none text-cyan-500 bg-gray-100 font-bold uppercase" value={selectedDate && selectedHour ? `${formatDate(selectedDate)} a las ${formatHour(selectedHour)}` : "Seleccione fecha y hora en el calendario..." } disabled />
                </div>
            </div>

            <div>
                <div>Agenda</div>
                <div className="flex">
                <span className="w-80">
                <FullCalendar 
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
                initialView="dayGridMonth" 
                dateClick={handleClickDate} 
                headerToolbar={{
                    left: 'prev,next', 
                    center: 'title', 
                    right: 'today',
                }} 
                dayCellClassNames={(date) => {
                    const isOccupied = rawData.some(
                        (event) => event.fecha === date.date.toISOString().split("T")[0]
                    );
                
                    const isSelected = selectedDate === date.date.toISOString().split("T")[0];
                
                    const isBlocked = fechasBloqueadas.some(
                        (blockedDate) => new Date(blockedDate.fecha).toISOString().split("T")[0] === date.date.toISOString().split("T")[0]
                    );
                
                    return `${isOccupied ? "day-with-event" : ""} ${isSelected ? "selected-day" : ""} ${isBlocked ? "blocked-day" : ""}`.trim();
                }}
                locale={esLocale} 
                height={400} />
                </span>
                <span className="w-80">
                    {selectedDate ? (
                        freeHours.length > 0 ? (
                            <div className="px-4 text-base w-64 text-center">
                                <div className="underline font-bold p-1 text-blue-400 text-center text-base">Horarios disponibles</div>
                                    <ul className="grid grid-cols-2 gap-2 mt-2">
                                    {freeHours.map((hour, index) => (
                                        <li className={`cursor-pointer border font-bold rounded border-blue-400 p-1 text-blue-400 text-center hover:bg-blue-400 hover:text-white transition-all duration-200 ${selectedHour === hour ? "bg-blue-400 text-white" : "bg-none"}`} key={index} onClick={() => handleClickHour(hour)}>{formatHour(hour)}</li>
                                    ))}
                                    </ul>
                            </div>
                        
                    ) : (
                        <div className="underline font-bold p-2 text-red-500 text-center text-base">No hay horarios libres para este día.</div>
                    ) 
                    ) : (
                        <div hidden></div>
                    )}
                    </span>
                </div>
            </div>
        </div>
        ) : (
                    <div>
                        <div className="flex">
                        <span className="w-80">
                        <FullCalendar 
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
                        initialView="dayGridMonth" 
                        dateClick={handleClickDate} 
                        headerToolbar={{
                            left: 'prev,next', 
                            center: 'title', 
                            right: 'today',
                        }} 
                        dayCellClassNames={(date) => {
                            const isOccupied = rawData.some(
                                (event) => event.fecha === date.date.toISOString().split("T")[0]
                            );
                        
                            const isSelected = selectedDate === date.date.toISOString().split("T")[0];
                        
                            const isBlocked = fechasBloqueadas.some(
                                (blockedDate) => new Date(blockedDate.fecha).toISOString().split("T")[0] === date.date.toISOString().split("T")[0]
                            );
                        
                            return `${isOccupied ? "day-with-event" : ""} ${isSelected ? "selected-day" : ""} ${isBlocked ? "blocked-day" : ""}`.trim();
                        }}
                        locale={esLocale} 
                        height={400} />
                        </span>
                        <span className="w-80">
                            {selectedDate ? (
                                freeHours.length > 0 ? (
                                    <div className="px-4 text-base w-64 text-center">
                                        <div className="underline font-bold p-1 text-blue-400 text-center text-base">Horarios disponibles</div>
                                            <ul className="grid grid-cols-2 gap-2 mt-2">
                                            {freeHours.map((hour, index) => (
                                                <li className={`cursor-pointer border font-bold rounded border-blue-400 p-1 text-blue-400 text-center hover:bg-blue-400 hover:text-white transition-all duration-200 ${selectedHour === hour ? "bg-blue-400 text-white" : "bg-none"}`} key={index} onClick={() => handleClickHourCita(hour)}>{formatHour(hour)}
                                                </li>
                                            ))}
                                            </ul>
                                    </div>
                                
                            ) : (
                                <div className="underline font-bold p-2 text-red-500 text-center text-base">No hay horarios libres para este día.</div>
                            ) 
                            ) : (
                                <div hidden></div>
                            )}
                            </span>
                        </div>
                    </div>
        )}
    </div>
    );
};

export default CapturaDeDatos;