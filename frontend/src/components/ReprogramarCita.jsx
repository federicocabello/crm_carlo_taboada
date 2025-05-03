import React, {useState, useEffect, useRef } from "react";
import '../pages/FullCalendar.css';
import '../pages/CapturaDeDatos.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import esLocale from '@fullcalendar/core/locales/es';

const ReprogramarCita = ({ showModal, setShowModal, selectedCita }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [events, setEvents] = useState([]);
        const [selectedDate, setSelectedDate] = useState('');
        const [freeHours, setFreeHours] = useState([]);
        const [rawData, setRawData] = useState([]);
        const [selectedHour, setSelectedHour] = useState('');
        const [fechasBloqueadas, setFechasBloqueadas] = useState([]);
    
    
        const schedule = [
            { hour: "09:30:00", maxAppointments: 3 },
            { hour: "10:00:00", maxAppointments: 3 },
            { hour: "11:00:00", maxAppointments: 3 },
            { hour: "12:00:00", maxAppointments: 3 },
            { hour: "13:00:00", maxAppointments: 3 },
            { hour: "14:00:00", maxAppointments: 3 },
            { hour: "15:00:00", maxAppointments: 3 },
            { hour: "16:00:00", maxAppointments: 3 },
            { hour: "17:00:00", maxAppointments: 3 },
            { hour: "18:00:00", maxAppointments: 1 },
        ];

        useEffect(() => {
            if (showModal && selectedCita) {
                setSelectedDate(selectedCita.fechaoriginal);
                setSelectedHour(selectedCita.horaoriginal);
                handleClickDate({ dateStr: selectedCita.fechaoriginal });
            }
        }, [showModal, selectedCita]);
    
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

        useEffect(() => {
                    axios.get(`${backendUrl}/captura-de-datos`, {withCredentials: true})
                    .then((response) => {
                        const citas = Array.isArray(response.data.citas_calendario) ? response.data.citas_calendario : [];
                        setRawData(citas);
                        const transformedEvents = citas.map((cita) => ({
                            title: `Horas: ${cita.hora}`,
                            start: cita.fecha,
                            color: "red",
                        }))
                        setEvents(transformedEvents);
                        setFechasBloqueadas(response.data.fechas_bloqueadas);
                    })
                    .catch ((error) => {
                    console.error("Error al obtener los datos:", error);
                });
                }, []);

        const handleReprogramar = () => {
                    axios.post(`${backendUrl}/agenda/reprogramar`, {"idcita": selectedCita.idcita, "fecha": selectedDate, "hora": selectedHour}, { withCredentials: true })
                                .then((response) => {
                                    console.log("Cita reprogramada correctamente:", response.data);
                                    alert("Cita reprogramada correctamente.");
                                    setShowModal(false);
                                })
                                .catch((error) => {
                                    console.error("Error al reprogramar la cita:", error);
                                    alert("Error al reprogramar la cita. Reintente.");
                        });
                };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-10 rounded-lg">
                <div className="flex font-bold items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Reprogramar cita de {selectedCita.nombrecliente}
                </div>
                <div className="flex">
                <span className="w-96">
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
                <span>
                        {selectedDate && (
                            freeHours.length > 0 ? (
                                <div className="px-4 text-base w-64 text-center">
                                    <div className="underline font-bold p-1 text-blue-400 text-center text-base">Horarios disponibles</div>
                                    <ul className="grid grid-cols-2 gap-2 mt-2">
                                        {freeHours.map((hour, index) => (
                                            <li className={`cursor-pointer border font-bold rounded border-blue-400 p-1 text-blue-400 text-center hover:bg-blue-400 hover:text-white transition-all duration-200 ${selectedHour === hour ? "bg-blue-400 text-white" : "bg-none"}`} key={index} onClick={() => handleClickHour(hour)}>{hour.split(":").slice(0, 2).join(":")}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="underline font-bold p-2 text-red-500 text-center text-base">No hay horarios libres para este día.</div>
                            )
                        )}
                    </span>
                <span>
                    <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    </button>
                </span>
                </div>
                <div className="w-full text-center my-4">
                    <input type="text" className="w-80 border-none text-cyan-500 font-bold uppercase text-center bg-transparent" value={selectedDate && selectedHour ? `${formatDate(selectedDate)} a las ${formatHour(selectedHour)}` : "Seleccione fecha y hora en el calendario..." } disabled />
                </div>
                <div className="flex justify-center">
                    <button className="btn-guardar" onClick={handleReprogramar}>Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default ReprogramarCita;