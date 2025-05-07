import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Caso.css';
import CapturaDeDatos from './CapturaDeDatos'
import FormatearNumero from '../components/FormatearNumero'
import PlanDePagos from '../components/PlanDePagos';
import RegistrarPago from '../components/RegistrarPago';
//import { options } from '@fullcalendar/core/preact.js';

const Caso = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [caso, setCaso] = useState([]);
    const [rol, setRol] = useState(null);
    const [citas, setCitas] = useState([]);
    const [actualizaciones, setActualizaciones] = useState([]);
    const [nuevaActualizacion, setNuevaActualizacion] = useState("");
    const [nuevaCita, setNuevaCita] = useState({idcaso: id, razon: '', status: 1, tipo: 0, asignado: 0, idcliente: null})
    useEffect(() => {
        if (caso.idcliente) {
            setNuevaCita((prevNuevaCita) => ({
                ...prevNuevaCita,
                idcliente: caso.idcliente
            }));
        }
    }, [caso]);

    const [asesores, setAsesores] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [status, setStatus] = useState([]);
    const [statusCita, setStatusCita] = useState([]);
    const [tipoCita, setTipoCita] = useState([]);
    const [califica, setCalifica] = useState([]);
    const [subclase, setSubclase] = useState([]);

    const [pagos, setPagos] = useState([]);
    const [pagosNotas, setPagosNotas] = useState([]);
    const [pagosControl, setPagosControl] = useState([]);
    const [pagosNo, setPagosNo] = useState([]);

    const [pagosEstados, setPagosEstados] = useState([]);
    const [deudaTotal, setDeudaTotal] = useState(0);

    const [saldoRestante, setSaldoRestante] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingBeneficiario, setIsEditingBeneficiario] = useState(false);
    const [mostrarNuevaActualizacion, setMostrarNuevaActualizacion] = useState(false);
    const [mostrarNuevaCita, setMostrarNuevaCita] = useState(false);
    const textareaRef = useRef(null);
    const [enabledSelects, setEnabledSelects] = useState({});

    const [expandedItems, setExpandedItems] = useState({});

    const [selectedTipoCaso, setSelectedTipoCaso] = useState(null);
    const [selectedSubclase, setSelectedSubclase] = useState(null);

    const [tiposdePago, setTiposDePago] = useState([]);

    const toggleExpand = (id) => {
        setExpandedItems({
            ...expandedItems,
            [id]: !expandedItems[id]
        });
    };
    
    const toogleEditMode = () => {
        setIsEditing(!isEditing);
    }

    const toogleEditModeBeneficiario = () => {
        setIsEditingBeneficiario(!isEditingBeneficiario);
    }

    const [editingCitas, setEditingCitas] = useState({});
    const toggleEditModeCita = (idcita) => {
        setEditingCitas((prev) => ({
            ...prev,
            [idcita]: !prev[idcita]
        }));
    };

    const handleNuevaCitaChange = (e) => {
        const { name, value } = e.target;
        setNuevaCita({
            ...nuevaCita,
            [name]: value
        });
    };

    const expandAll = () => {
        const newExpandedItems = {};
        actualizaciones.forEach((item) => {
            newExpandedItems[item.id] = true;
        });
        setExpandedItems(newExpandedItems);
    };

    const collapseAll = () => {
        setExpandedItems({});
    };

    const toogleNuevaActualizacion = () => {
        setMostrarNuevaActualizacion(!mostrarNuevaActualizacion);
    }

    const toogleNuevaCita = () => {
        setMostrarNuevaCita(!mostrarNuevaCita);
    }

    useEffect(() => {
        if (mostrarNuevaActualizacion && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [mostrarNuevaActualizacion]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCaso({
            ...caso,
            [name]: value.toUpperCase()
        });
    };

    const handleInputChangeCita = (idcita, e) => {
        const { name, value } = e.target;
        setCitas((prevCitas) =>
            prevCitas.map((cita) =>
                cita.idcita === idcita ? { ...cita, [name]: value } : cita
            )
        );
    };

    const handleInputChangeStatusCita = (idcita, oldStatus, newStatus, resultado, motivo) => {
    
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
    
        setCitas((prevCitas) =>
            prevCitas.map((cita) =>
                cita.idcita === idcita
                    ? { ...cita, idstatuscita: newStatus, motivo_cancelacion: motivo, resultado: resultado }
                    : cita
            )
        );
    };

    const [documentos, setDocumentos] = useState([]);
    const [documentosClasificaciones, setDocumentosClasificaciones] = useState([]);

    const cargarSitioCaso = () => {
        axios.get(`${backendUrl}/caso/${id}`, {withCredentials: true})
                .then((response) => {
                    setRol(response.data.rol[0]);
                    setCaso(response.data.caso);
                    setAsesores(response.data.asesores);
                    setTipos(response.data.tipos);
                    setStatus(response.data.status);
                    setActualizaciones(response.data.actualizaciones)
                    setDocumentos(response.data.documentos);
                    setDocumentosClasificaciones(response.data.documentos_clasificaciones);
                    setStatusCita(response.data.statuscita);
                    setTipoCita(response.data.tipocita);
                    setSelectedDate(response.data.caso.fechaoriginal);
                    setSelectedHour(response.data.caso.horaoriginal);
                    setCitas(response.data.citas);
                    setCalifica(response.data.califica);
                    setSubclase(response.data.subclase);

                    setSelectedTipoCaso(response.data.caso.idtipocaso);
                    setSelectedSubclase(response.data.caso.idsubclase);

                    setPagos(response.data.pagos);
                    setPagosNotas(response.data.pagos_notas);
                    setPagosControl(response.data.pagos_control);
                    setPagosEstados(response.data.pagos_estados);
                    setPagosNo(response.data.no_pagos);
                    setSaldoRestante(response.data.saldo_restante);
                    setTiposDePago(response.data.pagos_tipos);

                    setDeudaTotal(response.data.deudatotal)
                })
                .catch((error) => {
                    console.error("Error al obtener los datos del caso: ", error);
                    alert("Error al obtener los datos del caso.");
                });
            };

    useEffect(() => {
                cargarSitioCaso();
        }, [backendUrl, id]);

        const handleSave = () => {
                axios.post(`${backendUrl}/caso/guardar-datos`, caso, { withCredentials: true })
                    .then((response) => {
                        alert(response.data.mensaje);
                        setIsEditing(false);
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Error al guardar los datos del caso: ", error);
                        alert("Error al guardar los datos del caso. Reintente.");
                    });
        };

        const handleAddActualizacion = () => {
            axios.post(`${backendUrl}/caso/actualizacion/nueva`, {"actualizacion": nuevaActualizacion, "id": id}, { withCredentials: true })
                    .then((response) => {
                        alert(response.data.mensaje);
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error("Error al guardar una actualización:", error);
                        alert("Error al guardar una actualización. Reintente.");
                    });
        };

        const handleVerDocumento = (idcaso, iddoc) => {
            axios.get(`${backendUrl}/caso/${idcaso}/documento/${iddoc}`, { responseType: 'blob', withCredentials: true })
            .then((response) => {
                /*
                SCRIP PARA DESCARGARLO DIRECMTAMENTE
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                const contentDisposition = response.headers['content-disposition'];
                const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'documento.pdf';
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                */
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                window.open(url, '_blank');
            })
            .catch((error) => {
                console.error("Error al obtener el documento:", error);
                alert("Error al obtener el documento. Reintente.");
            });
        };

        const handleChangeClasificacion = (id, nuevaClasificacion, idcaso, nombredoc) => {
            axios.post(`${backendUrl}/documento/${id}/editar-clasificacion`, { "clasificacion": nuevaClasificacion, "idcaso": idcaso, "nombredoc": nombredoc }, { withCredentials: true })
                .then((response) => {
                    alert(response.data.mensaje);
                    setDocumentos((prevDocumentos) =>
                        prevDocumentos.map((doc) =>
                            doc.iddoc === id ? { ...doc, clasificacion: nuevaClasificacion } : doc
                        )
                    );
                })
                .catch((error) => {
                    console.error("Error al actualizar la clasificación:", error);
                    alert("Error al actualizar la clasificación. Reintente.");
                });
        };   

        const handleEditarNombre = (id, nombreActual, idcaso) => {
            nombreActual = nombreActual.replace(".pdf", "");
            const nuevoNombre = prompt("Ingrese el nuevo nombre del documento: ", nombreActual);
            if (nuevoNombre && nuevoNombre !== nombreActual) {
                axios.post(`${backendUrl}/documento/${id}/editar-nombre`, { "nombre": nuevoNombre, "idcaso": idcaso, "nombreviejo": nombreActual }, { withCredentials: true })
                    .then((response) => {
                        alert(response.data.mensaje);
                        setDocumentos((prevDocumentos) =>
                            prevDocumentos.map((doc) =>
                                doc.iddoc === id ? { ...doc, nombre: nuevoNombre.toUpperCase()+".pdf" } : doc
                            )
                        );
                    })
                    .catch((error) => {
                        console.error("Error al actualizar el nombre: ", error);
                        alert("Error al actualizar el nombre. Reintente.");
                    });
            }
        };

        const handleDocEliminar = (id, rol, idcaso, nombredoc) => {
            axios.post(`${backendUrl}/documento/${id}/eliminar`, { rol: rol, "idcaso": idcaso, "nombredoc": nombredoc }, { withCredentials: true })
                .then((response) => {
                    alert(response.data.mensaje);
                    setDocumentos((prevDocumentos) =>
                        prevDocumentos.filter((doc) => doc.iddoc !== id)
                    );
                })
                .catch((error) => {
                    console.error("Error al eliminar el documento: ", error);
                    alert("Error al eliminar el documento. No tiene permisos de Administrador.");
                });
        };   

        const handleEnableSelect = (id) => {
            setEnabledSelects({
                ...enabledSelects,
                [id]: true
            });
        };

        const handleFileUpload = (e) => {
            const files = e.target.files;
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
            formData.append('idcaso', caso.idcaso);
            formData.append("idcliente", caso.idcliente);
    
            axios.post(`${backendUrl}/documento/subir`, formData, { withCredentials: true })
                .then((response) => {
                    alert(response.data.mensaje);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error al subir los documentos: ", error);
                    alert("Error al subir los documentos. Reintente.");
                });
        };

        const handleSaveBeneficiario = () => {
            axios.post(`${backendUrl}/beneficiario/guardar-datos`, caso, { withCredentials: true })
                .then((response) => {
                    alert(response.data.mensaje);
                    setIsEditingBeneficiario(false);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error al guardar los datos del beneficiario: ", error);
                    alert("Error al guardar los datos del beneficiario. Reintente.");
                });
    };

    const handleSaveCita = (idcita) => {
        const cita = citas.find(c => c.idcita === idcita);
        const data = { ...cita, selectedDate, selectedHour };
        axios.post(`${backendUrl}/caso/guardar-cita`, data, { withCredentials: true })
            .then((response) => {
                alert(response.data.mensaje);
                setIsEditing(false);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error al actualizar la cita: ", error);
                alert("Error al actualizar la cita. Reintente.");
            });
};

    const handlePagoControl = (idpago, cartas, estado) => {
        setPagosControl((prevState) => ({
            ...prevState,
            cartasenviadas: cartas,
            estado: estado
        }));
        const data = { idpago: idpago, cartas: cartas, estado: estado, idcaso: caso.idcaso };
        axios.post(`${backendUrl}/caso/pago/control/actualizar`, data, { withCredentials: true })
            .then((response) => {
                console.log(response.data.mensaje)
                cargarSitioCaso();
            })
            .catch((error) => {
                console.error("Error al actualizar los datos del pago: ", error);
                alert("Error al actualizar los datos del pago. Reintente.");
            });
    }

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHour, setSelectedHour] = useState(null);

    const handleDateHourSelect = (date, hour, idcita) => {
        setSelectedDate(date);
        setSelectedHour(hour);
        setCitas((prevCitas) =>
            prevCitas.map((cita) =>
                cita.idcita === idcita
                    ? { ...cita, citafechaoriginal: date, citahoraoriginal: hour }
                    : cita
            )
        );
    };

    const handleSaveNuevaCita = () => {
        const data = {nuevaCita, selectedDateNuevaCita, selectedHourNuevaCita}
        axios.post(`${backendUrl}/caso/nueva-cita`, data, { withCredentials: true })
            .then((response) => {
                alert(response.data.mensaje);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error al guardar una nueva cita: ", error);
                alert("Error al guardar una nueva cita. Reintente.");
            });
    };

    const [selectedDateNuevaCita, setSelectedDateNuevaCita] = useState(null);
    const [selectedHourNuevaCita, setSelectedHourNuevaCita] = useState(null);

    const handleNuevaCitaFecha = (date, hour) => {
        setSelectedDateNuevaCita(date);
        setSelectedHourNuevaCita(hour);
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

    const [reprogramarCitas, setReprogramarCitas] = useState({});
    const toggleReprogramarCita = (idcita, date, hour) => {
        setReprogramarCitas((prev) => ({
            ...prev,
            [idcita]: !prev[idcita]
        }));
        setSelectedDate(date);
        setSelectedHour(hour);
    };

    const handleInputChangeCalifica = (idcaso, newCalifica) => {
                if (newCalifica == 0 || newCalifica == 2){
                    let motivo;
                    while (true) {
                        motivo = prompt("Ingrese el motivo:")
    
                        if (motivo === null) {
                            return;
                        }
                
                        if (motivo.trim() === "") {
                            alert("Debe ingresar un motivo para continuar.");
                        } else {
                            break;
                        }
                    };
                    setCaso({
                        ...caso,
                        ["idcalifica"]: newCalifica,
                        ["motivo_califica"]: motivo.trim().toUpperCase()
                    });
                } else if (newCalifica == 1){
                    const convertir = confirm("¿Desea convertir la consulta en un caso abierto? La página se recargará");
                    if (convertir == true){
                        axios.post(`${backendUrl}/caso/convertir`, {"idcaso": idcaso, "idcliente": caso.idcliente}, { withCredentials: true })
                            .then((response) => {
                                alert(response.data.mensaje);
                                window.location.reload();
                            })
                            .catch((error) => {
                                console.error("Error al convertir la consulta en un caso abierto:", error);
                                alert("Error al convertir la consulta en un caso abierto. Reintente.");
                            });
                    } else {
                        setCaso({
                            ...caso,
                            ["idcalifica"]: newCalifica
                        });
                    }
                };
                
            };
            
            const [registrarPagoVisible, setRegistrarPagoVisible] = useState(false);
            const [planDePagosVisible, setPlanDePagosVisible] = useState(false);

            const onClosePlanDePagos = () => {
                cargarSitioCaso();
                setPlanDePagosVisible(false);
            }

            const onCloseRegistrarPago = () => {
                cargarSitioCaso();
                setRegistrarPagoVisible(false);
            }
            
            const [pagoIdControl, setPagoIdControl] = useState(null);
            const [pagoMonto, setPagoMonto] = useState(null);
            const [esSaldo, setEsSaldo] = useState(false);
            const [fechaVencimiento, setFechaVencimiento] = useState(null);
            const abrirRegistrarPago = (idcontrol, monto, esSaldo, vencimiento) => {
                setEsSaldo(esSaldo);
                setPagoIdControl(idcontrol);
                setPagoMonto(monto);
                setFechaVencimiento(vencimiento);
                setRegistrarPagoVisible(true);
            }

    return (
        <div>
            <h1 className="flex text-3xl items-center font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>
                <span className="mr-1 text-orange-600">{caso.idcaso}</span>• {caso.caso}</h1>
            <div>
                <span className="font-bold text-blue-700 hover:underline cursor-pointer" onClick={() => navigate(`/perfil/${caso.idcliente}`)}>
                    {caso.nombrec}
                </span>
                {caso.nombreb && ( <span> • Beneficiario: <span className="font-bold text-green-700">{caso.nombreb}</span></span>)}
            </div>
            <div className="mb-5 text-sm text-gray-500 italic">{caso.tipocaso} - {caso.subclase} • Creado el {caso.fechacaso}</div>
            <Tabs>
                <TabList>
                    <Tab>
                    <div className="tab-div">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="tab-div-img">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                        <span>Información</span>
                    </div>
                    </Tab>
                    <Tab>
                    <div className="tab-div">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="tab-div-img">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                        <span>Documentos</span>
                    </div>
                    </Tab>
                    <Tab>
                    <div className="tab-div">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="tab-div-img">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                        <span>Pagos</span>
                    </div>
                    </Tab>
                    <Tab>
                    <div className="tab-div">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="tab-div-img">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                        <span>Beneficiario</span>
                    </div>
                    </Tab>
                    <Tab>
                    <div className="tab-div">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="tab-div-img">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                    </svg>
                        <span>Logs</span>
                    </div>
                    </Tab>
                </TabList>
                <TabPanel className="tab-caso-informacion">
                    <div className="flex">
                        <div className="tab-caso-informacion-div justify-between w-1/2 mr-5">
                            <div className="flex items-center font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                            </svg>
                            {caso.capturadedatos ? (
                              <span>Consulta</span>
                            ) : (
                              <span>Caso</span>  
                            )}
                            </div>
                            <hr className="my-3" />
                            <div className="flex items-end">
                                <input type="text" value={caso.caso} disabled={!isEditing} className="w-full mt-1 mr-2" onChange={handleInputChange} name="caso" />
                                {caso.capturadedatos == 1 && (
                                <span>
                                    <div>¿Califica?</div>
                                    <select value={caso.idcalifica} disabled={!isEditing} onChange={(e) => handleInputChangeCalifica(caso.idcaso, e.target.value)} name="idcalifica">
                                        {califica.map((item) => (
                                            <option key={item.idcalifica} value={item.idcalifica}>{item.califica}</option>
                                        ))}
                                    </select>
                                </span>
                                )}
                            </div>
                                {caso.idcalifica == 0 && caso.capturadedatos == 1 && (
                                    <div className="font-bold" style={{ color: '#'+caso.colorcalifica }}>NO CALIFICA: {caso.motivo_califica}</div>
                                )}
                                {caso.idcalifica == 2 && caso.capturadedatos == 1 && (
                                    <div className=" font-bold" style={{ color: '#'+caso.colorcalifica }}>INFO BACK: {caso.motivo_califica}</div>
                                )}
                        <div className="flex justify-between mt-1">
                            <span>
                                <div>Asignado </div>
                                <select value={caso.idasignado} disabled={!isEditing} onChange={handleInputChange} name="idasignado">
                                {asesores.map((item) => (
                                    <option key={item.idasesor} value={item.idasesor}>{item.asesor}</option>
                                ))}
                                </select>
                            </span>
                            {caso.capturadedatos == 1 && (
                            <span>
                                <div>Tipo de caso</div>
                                <select value={caso.idtipocaso} disabled={!isEditing} onChange={(e) => {handleInputChange(e); setSelectedTipoCaso(e.target.value)}} name="idtipocaso" className="mr-1">
                                {tipos.map((item) => (
                                    <option key={item.idtipo} value={item.idtipo}>{item.tipo}</option>
                                ))}
                                </select>
                                <select name="idsubclase" onChange={(e) => {handleInputChange(e); setSelectedSubclase(e.target.value)}} disabled={!isEditing} value={selectedSubclase} className="w-96">
                                    {subclase
                                        .filter((sub) => sub.idtipocaso == selectedTipoCaso)
                                        .map((sub) => (
                                            <option key={sub.idsubclase} value={sub.idsubclase}>{sub.subclase}</option>
                                        ))}
                                </select>
                            </span>
                            )}
                            {caso.capturadedatos == 0 && (
                            <span>
                                <div>Status</div>
                                <select value={caso.idstatuscaso} disabled={!isEditing} onChange={handleInputChange} name="idstatuscaso">
                                {status.map((item) => (
                                    <option key={item.idstatus} value={item.idstatus}>{item.status}</option>
                                ))}
                                </select>
                            </span>
                            )}
                        </div>
                        {isEditing && (
                        <div className="justify-center mt-5 text-center">
                            <button type="button" className="btn-guardar text-blue-500 border-blue-500 bg-transparent hover:bg-white" onClick={handleSave}>Guardar</button>
                        </div>
                        )}

                        {rol == "admin" && (
                        <div className="justify-center flex my-5">
                            <button className="flex items-center btn-guardar bg-yellow-400 rounded border p-1 text-gray-700 cursor-pointer hover:text-black hover:bg-yellow-500 transition-all" onClick={toogleEditMode}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg> Editar datos
                            </button>
                        </div>
                        )}

                        {!caso.capturadedatos && (
                                        <div>
                                            <div className="flex items-center font-bold">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z" />
                                            </svg>
                                                    <span>Actualizaciones</span>
                                            </div>
                                            <hr className="my-4"/>
                                            <div className="flex justify-center mt-3">
                                                <button type="button" className="btn-guardar bg-lime-500 text-lime-800 hover:bg-lime-600 hover:text-white flex items-center mr-2" onClick={expandAll}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                                    </svg>
                                                    Expandir todo
                                                </button>

                                                <button type="button" className="btn-guardar bg-lime-500 text-lime-800 hover:bg-lime-600 hover:text-white flex items-center mr-2" onClick={collapseAll}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
                                                </svg>
                                                    Colapsar todo
                                                </button>

                                                <button type="button" className="btn-guardar bg-emerald-500 text-white hover:bg-emerald-700 flex items-center mr-2" onClick={toogleNuevaActualizacion}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                </svg>
                                                    Nueva actualización
                                                </button>
                                                </div>
                                                {mostrarNuevaActualizacion && (
                                                <div className="flex items-center mt-5">
                                                    <button className="btn-guardar mr-2 bg-emerald-500 hover:bg-emerald-700" onClick={handleAddActualizacion}>Enviar</button>
                                                    <textarea className="text-sm border rounded w-full p-2 h-24" ref={textareaRef} onChange={(e) => setNuevaActualizacion(e.target.value)}></textarea>
                                                </div>
                                            )}
                                            {actualizaciones.map((item) => (
                                            <div key={item.id} className="my-3 rounded-xl border-2 bg-white">
                                                    <div className={`text-gray-700 p-2 text-sm flex items-center cursor-pointer ${
                                                            item.esresultado == 1
                                                            ? 'bg-cyan-200'
                                                            : item.esresultado == 0
                                                            ? 'bg-lime-200'
                                                            : item.esresultado == 2
                                                            ? 'bg-amber-200'
                                                            : ''
                                                        }`} onClick={() => toggleExpand(item.id)}>
                                                        {!expandedItems[item.id] ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                        </svg>
                                                        ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                        </svg>
                                                        )}
                                                        {item.creado} <span className="ml-1 font-bold">{item.agente}</span>
                                                        {item.esresultado == 1 && (
                                                            <span className="ml-1 font-bold text-white bg-orange-400 px-2 rounded-full border">RESULTADO DE LA CITA</span>
                                                        )}
                                                        {item.esresultado == 2 && (
                                                            <span className="ml-1 font-bold text-white bg-green-500 px-2 rounded-full border">PAGO</span>
                                                        )}
                                                    </div>
                                                    {expandedItems[item.id] && (
                                                        <div className="p-2 text-sm">
                                                            {item.actualizacion}
                                                        </div>
                                                    )}
                                            </div>
                                        ))}
                                    </div>
                            )}
                        </div>

                    <div className="w-1/2">
                        <div className="flex items-center font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span>Citas</span>
                        <button type="button" className="btn-guardar bg-emerald-500 text-white hover:bg-emerald-700 flex items-center ml-2 p-1" onClick={toogleNuevaCita}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                                Nueva cita
                            </button>
                        </div>
                        {mostrarNuevaCita && (
                            <div>
                                <hr className="my-2" />
                        <div className="tab-caso-informacion-div flex justify-between">
                        <div>
                            <CapturaDeDatos editarCitaCaso={true} onDateHourSelect={(date, hour) => handleNuevaCitaFecha(date, hour)} />
                            <input type="text" className="w-full border-none text-cyan-500 bg-transparent font-bold uppercase text-center mt-2" 
                                value={selectedDateNuevaCita && selectedHourNuevaCita ? `${formatDate(selectedDateNuevaCita)} a las ${formatHour(selectedHourNuevaCita)}` : "Seleccione fecha y hora en el calendario..." } 
                                disabled />
                        </div>
                        <div>
                            <div>
                                <div>Razón de la cita</div>
                                <textarea className="h-40 w-72 text-sm" name="razon" onChange={handleNuevaCitaChange}></textarea>
                            </div>
                            <div className="mb-2">
                                <div>Status de cita</div>
                                <select name="status" onChange={handleNuevaCitaChange} disabled>
                                    <option value="1" key="1">Programada</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <div>Tipo de cita</div>
                                <select name="tipo" onChange={handleNuevaCitaChange}>
                                    <option value="0" key="0" className="text-gray-500 italic" selected>Seleccione un tipo de cita...</option>
                                    {tipoCita.map((item) => (
                                    <option value={item.idtipocita} key={item.idtipocita}>{item.tipocita}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <div>Asignado a</div>
                                <select onChange={handleNuevaCitaChange} name="asignado">
                                <option value="0" key="0" className="text-gray-500 italic" selected>Seleccione un asesor...</option>
                                {asesores.map((item) => (
                                <option key={item.idasesor} value={item.idasesor}>{item.asesor}</option>
                                ))}
                                </select>
                            </div>
                            <div className="justify-center mt-5">
                                <button type="button" className="btn-guardar text-blue-500 border-blue-500 bg-transparent hover:bg-blue-500 hover:text-white hover:border-white" onClick={() => handleSaveNuevaCita()}>Guardar cita</button>
                            </div>
                        </div>
                        </div>
                        </div>
                        )}
                        <hr className="my-2" />
                    {citas.map((cita) => (
                    <div key={cita.idcita} className="my-3 bg-white rounded-xl border-2">
                        <div className="flex items-center p-2 bg-cyan-200 rounded-xl border-2 cursor-pointer" onClick={() => toggleExpand(cita.idcita)}>
                        {!expandedItems[cita.idcita] ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                        </svg>
                                                        ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                        </svg>
                            )}
                            {cita.fechacita}
                            <span className="relative group">
                            <span className="py-1 px-2 text-sm font-bold mx-2 text-white" style={{ backgroundColor: '#'+cita.colorstatuscita }}>{cita.statuscita}</span>

                            {cita.idstatuscita === 0 && (
                                            <div className="absolute left-24 top-0 text-white text-xs font-bold p-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: '#'+cita.colorstatuscita }}>
                                                {cita.motivo_cancelacion}
                                            </div>
                                        )}
                            </span>

                                {editingCitas[cita.idcita] && expandedItems[cita.idcita] && (
                                    <div className="flex items-center bg-orange-400 py-1 px-2 text-sm border rounded font-bold cursor-pointer hover:text-white hover:bg-orange-600 transition-all" onClick={(e) => {e.stopPropagation(); toggleReprogramarCita(cita.idcita, cita.citafechaoriginal, cita.citahoraoriginal);}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                                    </svg>
                                    <span>Reprogramar</span>
                                    </div>
                                )}
                        </div>
                        {expandedItems[cita.idcita] && (
                        <div className="p-4">
                        <div className="tab-caso-informacion-div justify-between flex">
                            <div>
                                <div>Razón de la cita</div>
                                <textarea className="h-40 w-80 text-sm" value={cita.razon} disabled={!editingCitas[cita.idcita]} onChange={(e) => handleInputChangeCita(cita.idcita, e)} name="razon"></textarea>
                            </div>
                            <div>
                                <div>Resultado de la cita</div>
                                <textarea className="h-40 w-80 text-sm" value={cita.resultado} disabled={!editingCitas[cita.idcita]} onChange={(e) => handleInputChangeCita(cita.idcita, e)} name="resultado"></textarea>
                            </div>
                            <div>
                                <div className="mb-2">
                                    <div>Status de cita</div>
                                    <select value={cita.idstatuscita} disabled={!editingCitas[cita.idcita]} onChange={(e) => handleInputChangeStatusCita(cita.idcita, cita.idstatuscita, e.target.value, cita.resultado, cita.motivo_cancelacion)} name="idstatuscita">
                                        {statusCita.map((item) => (
                                        <option value={item.idstatuscita} key={item.idstatuscita}>{item.statuscita}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <div>Tipo de cita</div>
                                    <select value={cita.idtipocita} disabled={!editingCitas[cita.idcita]} onChange={(e) => handleInputChangeCita(cita.idcita, e)} name="idtipocita">
                                        {tipoCita.map((item) => (
                                        <option value={item.idtipocita} key={item.idtipocita}>{item.tipocita}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <div>Asignado a</div>
                                    <select value={cita.idasignado} disabled={!editingCitas[cita.idcita]} onChange={(e) => handleInputChangeCita(cita.idcita, e)} name="idasignado">
                                    {asesores.map((item) => (
                                    <option key={item.idasesor} value={item.idasesor}>{item.asesor}</option>
                                    ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    <div>
                        {reprogramarCitas[cita.idcita] && editingCitas[cita.idcita] && (
                                <div className='grid justify-center mt-5'>
                                    <CapturaDeDatos editarCitaCaso={true} onDateHourSelect={(date, hour) => handleDateHourSelect(date, hour, cita.idcita)} />
                                    <input type="text" className="w-full border-none text-cyan-500 bg-transparent font-bold uppercase text-center mt-2" 
                                    value={selectedDate && selectedHour ? `${formatDate(selectedDate)} a las ${formatHour(selectedHour)}` : "Seleccione fecha y hora en el calendario..." } 
                                    disabled />
                                </div>
                        )}

                        {editingCitas[cita.idcita] && (
                        <div className="justify-center text-center mt-5">
                            <button type="button" className="btn-guardar text-blue-500 border-blue-500 bg-transparent hover:bg-blue-500 hover:text-white hover:border-white" onClick={() => handleSaveCita(cita.idcita)}>Guardar</button>
                        </div>
                        )}

                        {rol == "admin" && (
                        <div className="flex justify-center mt-5">
                            <button className="flex items-center btn-guardar bg-cyan-300 rounded border p-1 text-gray-700 cursor-pointer hover:text-black hover:bg-cyan-400 transition-all" onClick={() => toggleEditModeCita(cita.idcita)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg> Editar cita
                            </button>
                        </div>
                        )}
                    </div>
                </div>
                        )}
                </div>
                    ))}
                </div>
            </div>
                </TabPanel>
                <TabPanel>
                    {documentos.length > 0 ? (
                            <table className="w-full border rounded-xl">
                                <thead>
                                    <tr className="p-1 bg-amber-200">
                                        <th className="border" colSpan={2}>Documento</th>
                                        <th className="border">Clasificación</th>
                                        <th className="border">Subido por</th>
                                        {rol == "admin" && (
                                            <th className="border"></th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                {documentos.map((docq) => (
                                    <tr className="border hover:bg-white" key={docq.iddoc}>
                                        <td className="p-2 w-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer hover:size-6 hover:text-amber-700 transition-all" onClick={() => handleVerDocumento(id, docq.iddoc)}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                        </td>       
                                        <td className="p-2 font-bold text-amber-700">
                                            <div className="flex items-center">   
                                            {rol == "admin" && (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 hover:size-6 cursor-pointer mr-1 transition-all" onClick={() => handleEditarNombre(docq.iddoc, docq.nombre, caso.idcaso)}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                              </svg>
                                            )}             
                                            {docq.nombre}
                                            </div>
                                        </td>
                                        <td className="p-2 flex items-center w-64">
                                            <select value={docq.clasificacion}  disabled={!enabledSelects[docq.iddoc]} className="border rounded" onChange={(e) => handleChangeClasificacion(docq.iddoc, e.target.value, caso.idcaso, docq.nombre)}>
                                                {documentosClasificaciones.map((item) => (
                                                    <option key={item.id} value={item.id}>{item.clasificacion}</option>
                                                ))}
                                            </select>
                                            {rol == "admin" && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer hover:size-6 hover:text-black transition-all text-gray-600 ml-1" onClick={() => handleEnableSelect(docq.iddoc)}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                            )}
                                        </td>
                                        <td className="p-2 w-96">{docq.creador}{docq.fecha}</td>
                                        {rol == "admin" && (
                                            <td className="p-2 w-10">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 hover:size-6 hover:text-red-500 transition-all cursor-pointer" onClick={() => handleDocEliminar(docq.iddoc, rol, caso.idcaso, docq.nombre)} >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                    ) : (
                        <p className="p-rechazo">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                            Este caso no tiene documentos cargados.
                        </p>
                    )}

                    <div className="p-2 border rounded my-5 w-48 bg-green-500 font-bold text-white">
                        <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        Subir documentos
                        </div>
                        <input type="file" className="my-2 cursor-pointer" style={{ fontSize: '11px' }} onChange={handleFileUpload} multiple />
                        </div>
                </TabPanel>
                <TabPanel>
                    {pagosControl ? (
                        <div className="flex">
                            <div className="w-64">
                                    {deudaTotal > 0 ? (
                                        <div className="text-center text-white bg-red-500 p-2 border rounded border-white font-bold">¿Cuanto debe?<div className="text-3xl"><FormatearNumero numero={parseFloat(deudaTotal)} /></div></div>
                                    ) : (
                                        <div className="text-center text-green-500 bg-transparent p-2 border rounded-xl border-green-500 font-bold">Este caso no tiene deudas
                                            <div className="flex justify-center items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                <div className="my-2 text-center text-blue-500 p-2 border rounded border-blue-500 font-bold">Servicio<div><FormatearNumero numero={pagosControl.valor} /></div></div>
                                <div className="my-2 text-center text-green-500 p-2 border rounded border-green-500 font-bold">Entrega inicial<div><FormatearNumero numero={pagosControl.entrega} /></div></div>
                                <div className="mb-2 text-center text-violet-300 p-2 border rounded border-violet-300 font-bold">{pagosControl.ncuota} cuotas mensuales<div><FormatearNumero numero={parseFloat(pagosControl.cuota)} /></div></div>
                                <div className="mb-2">
                                    <span>Cartas enviadas</span>
                                    <input type="number" className="border rounded p-1 ml-1 w-16" value={pagosControl.cartasenviadas} onChange={(e) => handlePagoControl(pagosControl.id, e.target.value, pagosControl.idestado)} />
                                </div>
                                <div>
                                    <span>Estado</span>
                                    <select value={pagosControl.idestado} className="border rounded p-1 cursor-pointer ml-1" onChange={(e) => handlePagoControl(pagosControl.id, pagosControl.cartasenviadas, e.target.value)}>
                                        {pagosEstados.map((item) => (
                                            <option value={item.id} key={item.id}>{item.estado}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="ml-5 flex w-full">
                                {pagos.length > 0 && (
                                    <div className="w-1/3 mr-5">
                                        <table className="shadow-lg w-full">
                                            <thead>
                                                <tr hidden>
                                                    <th colSpan={3} className="py-2">
                                                        <div className="flex items-center justify-center text-green-600 hover:underline hover:scale-110 hover:text-emerald-600 cursor-pointer transition-all">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                                                            </svg>
                                                            <span className="text-xs">REGISTRAR PAGO</span>
                                                        </div>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th colSpan={3} className="text-green-500  border">PAGOS REGISTRADOS</th>
                                                </tr>
                                                <tr className="bg-green-500 text-white">
                                                    <th className="border">Fecha</th>
                                                    <th className="border">Tipo de pago</th>
                                                    <th className="border">Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pagos.map((item) => (
                                                    <tr key={item.id} className="border bg-white">
                                                        <td className="p-2 border text-center">{item.fecha}</td>
                                                        <td className="p-2 border">
                                                        {item.pagado == 3 && (
                                                                <div className="text-xs font-bold text-red-500 italic">Saldo que había quedado pendiente</div>
                                                            )}
                                                            {item.tipo}
                                                                <div>
                                                                    {item.numerotarjeta && (
                                                                    <div className="text-xs font-bold flex items-center">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                                                        </svg>
                                                                        <span>{item.numerotarjeta}</span>
                                                                    </div>
                                                                    )}
                                                                    {item.nombretipopago && (
                                                                    <div className="text-xs font-bold flex items-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                                    </svg>
                                                                        <span>{item.nombretipopago}</span>
                                                                    </div>
                                                                    )}
                                                                </div>
                                                        </td>
                                                        <td className="p-2 italic flex items-center justify-around w-48">
                                                            <span>
                                                                <FormatearNumero numero={parseFloat(item.monto)} />
                                                            </span>
                                                            <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer hover:text-green-500 hover:scale-110 transition-all">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                                </svg>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                
                                {pagosNo.length > 0 && (
                                    <div className="w-1/3 mr-5">
                                    <table className="shadow-lg w-full">
                                        <thead>
                                            <tr>
                                                <th className="text-amber-400 border" colSpan={2}>PRÓXIMOS PAGOS</th>
                                            </tr>
                                            <tr className="bg-amber-400 text-white">
                                                <th className='border'>Vencimiento</th>
                                                <th className="border">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {pagosNo.map((item) => (
                                                <tr key={item.id} className="border">
                                                    <td className="text-center border">{item.fecha}</td>
                                                    <td className="p-2 italic flex items-center justify-around">
                                                        <span>
                                                            <FormatearNumero numero={parseFloat(item.monto)} />
                                                        </span>
                                                        <span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer hover:text-amber-400 hover:scale-110 transition-all" onClick={(e) => abrirRegistrarPago(item.id, item.monto, false, item.fecha)}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                            </svg>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    </div>
                                )}
                                
                                {registrarPagoVisible && (
                                    <RegistrarPago idcaso={caso.idcaso} nombrecaso={caso.caso} idcliente={caso.idcliente} onClose={onCloseRegistrarPago} idpago={pagoIdControl} monto={pagoMonto} tipos={tiposdePago} idcontrol={pagosControl.id} esSaldo={esSaldo} vencimiento={fechaVencimiento} />
                                )}

                                {saldoRestante && (
                                    <div className="w-1/3">
                                        <table className="shadow-lg w-full">
                                            <thead>
                                                <tr>
                                                    <th className="text-orange-500 border" colSpan={2}>SALDO RESTANTE</th>
                                                </tr>
                                                <tr className="bg-orange-500 text-white">
                                                    <th className='border'>Vencimiento</th>
                                                    <th className="border">Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white">
                                                {saldoRestante.map((item) => (
                                                    <tr className="border">
                                                        <td className="p-2 text-center">{item.fecha}</td>
                                                        <td className="p-2 italic flex items-center justify-around">
                                                            <span>
                                                                <FormatearNumero numero={item.saldo} />
                                                            </span>
                                                            <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer hover:text-orange-500 hover:scale-110 transition-all" onClick={(e) => abrirRegistrarPago(item.id, item.saldo, true, item.fecha)}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                                </svg>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="flex justify-center items-center bg-green-500 p-2 border text-white cursor-pointer hover:bg-white hover:text-green-500 transition-all text-sm font-bold rounded-lg hover:border-green-500" onClick={() => setPlanDePagosVisible(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                AGREGAR PLAN DE PAGOS
                            </div>
                            {planDePagosVisible && (
                                <PlanDePagos idcaso={caso.idcaso} idcliente={caso.idcliente} nombrecaso={caso.caso} estados={pagosEstados} onClose={onClosePlanDePagos} />
                                )}
                        </div>
                    )}
                </TabPanel>
                <TabPanel className="tab-beneficiario">
                    <div>
                        <div>
                            <span>Nombre</span>
                            <input type="text" value={caso.nombreb} disabled={!isEditingBeneficiario} onChange={handleInputChange} name="nombreb" />
                        </div>
                        <div>
                            <span>Relación</span>
                            <input type="text" value={caso.relacion} disabled={!isEditingBeneficiario} onChange={handleInputChange} name="relacion" />
                        </div>
                        <div>
                            <span>Email</span>
                            <input type="text" value={caso.email} disabled={!isEditingBeneficiario} onChange={handleInputChange} name="email" />
                        </div>
                    </div>
                    <div className="flex justify-around">
                        <div>
                            <span>Teléfono 1</span>
                            <input type="text" value={caso.telefono1} disabled={!isEditingBeneficiario} onChange={handleInputChange} name="telefono1" />
                        </div>
                        <div>
                            <span>Otro teléfono</span>
                            <input type="text" value={caso.telefono2} disabled={!isEditingBeneficiario} onChange={handleInputChange} name="telefono2" />
                        </div>
                        <div>
                            <span>Pertenece a</span>
                            <input type="text" value={caso.pertenecetel2} disabled={!isEditingBeneficiario} onChange={handleInputChange} name="pertenecetel2" />
                        </div>
                    </div>
                    <div className="flex justify-around">
                        <div>
                            <span>Domicilio</span>
                            <input type="text" value={caso.domicilio} disabled={!isEditingBeneficiario} onChange={handleInputChange} name="domicilio" />
                        </div>
                        <div>
                            <span>Ciudad</span>
                            <input type="text" value={caso.ciudad} disabled={!isEditingBeneficiario} onChange={handleInputChange} name="ciudad" />
                        </div>
                        <div>
                            <span>CP</span>
                            <input type="text" value={caso.cp} disabled={!isEditingBeneficiario} onChange={handleInputChange} name="cp" />
                        </div>
                    </div>
                    {isEditingBeneficiario && (
                        <div className="tab-caso-informacion-div justify-center mt-4">
                            <button type="button" className="btn-guardar text-blue-500 border-blue-500 bg-transparent hover:bg-white" onClick={handleSaveBeneficiario}>Guardar datos</button>
                        </div>
                        )}
                    {rol == "admin" && (
                        <div className="tab-caso-informacion-div justify-center mt-4">
                            <button className="flex items-center btn-guardar bg-yellow-400 rounded border p-1 text-gray-700 cursor-pointer hover:text-black hover:bg-yellow-500 transition-all" onClick={toogleEditModeBeneficiario}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg> Editar
                            </button>
                        </div>
                        )}
                </TabPanel>
                <TabPanel>
                    <div>log</div>
                </TabPanel>
            </Tabs>
        </div>
    )
}

export default Caso