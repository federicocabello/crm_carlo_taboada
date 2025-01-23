import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Caso.css';

const Caso = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [caso, setCaso] = useState([]);
    const [rol, setRol] = useState(null);
    const [actualizaciones, setActualizaciones] = useState([]);
    const [nuevaActualizacion, setNuevaActualizacion] = useState("");

    const [asesores, setAsesores] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [status, setStatus] = useState([]);
    const [estados, setEstados] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingBeneficiario, setIsEditingBeneficiario] = useState(false);
    const [mostrarNuevaActualizacion, setMostrarNuevaActualizacion] = useState(false);
    const textareaRef = useRef(null);
    const [enabledSelects, setEnabledSelects] = useState({});

    const [expandedItems, setExpandedItems] = useState({});

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

    useEffect(() => {
        if (mostrarNuevaActualizacion && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [mostrarNuevaActualizacion]);

    const handleClienteClick = (idcliente) => {
        navigate(`/perfil/${idcliente}`);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCaso({
            ...caso,
            [name]: value
        });
    };

    const [documentos, setDocumentos] = useState([]);
    const [documentosClasificaciones, setDocumentosClasificaciones] = useState([]);

    useEffect(() => {
                axios.get(`${backendUrl}/caso/${id}`, {withCredentials: true})
                .then((response) => {
                    setRol(response.data.rol[0]);
                    setCaso(response.data.caso);
                    setAsesores(response.data.asesores);
                    setTipos(response.data.tipos);
                    setStatus(response.data.status);
                    setEstados(response.data.estados);
                    setActualizaciones(response.data.actualizaciones)
                    setDocumentos(response.data.documentos);
                    setDocumentosClasificaciones(response.data.documentos_clasificaciones);
                })
                .catch((error) => {
                    console.error("Error al obtener los datos del caso: ", error);
                    alert("Error al obtener los datos del caso.");
                });
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

        const handleChangeClasificacion = (id, nuevaClasificacion) => {
            axios.post(`${backendUrl}/documento/${id}/editar-clasificacion`, { clasificacion: nuevaClasificacion }, { withCredentials: true })
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

        const handleEditarNombre = (id, nombreActual) => {
            nombreActual = nombreActual.replace(".pdf", "");
            const nuevoNombre = prompt("Ingrese el nuevo nombre del documento: ", nombreActual);
            if (nuevoNombre && nuevoNombre !== nombreActual) {
                axios.post(`${backendUrl}/documento/${id}/editar-nombre`, { nombre: nuevoNombre }, { withCredentials: true })
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

        const handleDocEliminar = (id, rol) => {
            axios.post(`${backendUrl}/documento/${id}/eliminar`, { rol: rol }, { withCredentials: true })
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

    return (
        <div>
            <h1 className="flex text-3xl items-center font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>
                <span className="mr-1 text-orange-600">{caso.idcaso}</span>• {caso.caso}</h1>
            <div className="text-sm">Cliente: <span className="font-bold text-blue-700">{caso.nombrec}</span>{caso.nombreb && ( <span> • Beneficiario: <span className="font-bold text-green-700">{caso.nombreb}</span></span>)}</div>
            <div className="mb-5 text-sm text-gray-500 italic">{caso.tipocaso} • Creado el {caso.fecha_formateada}</div>
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
                        <div className="tab-caso-informacion-div justify-between">
                            <span>
                                <div>Caso</div>
                                <input type="text" value={caso.caso} disabled={!isEditing} className="w-96" onChange={handleInputChange} name="caso" />
                            </span>
                            <span>
                                <div>Cliente</div>
                                <div className="p-1 font-bold text-blue-500 cursor-pointer hover:text-blue-700 underline" onClick={() => handleClienteClick(caso.idcliente)}>{caso.nombrec}</div>
                            </span>
                            <span>
                                <div>Asignado</div>
                                <select value={caso.idasignado} disabled={!isEditing} onChange={handleInputChange} name="idasignado">
                                {asesores.map((item) => (
                                    <option key={item.idasesor} value={item.idasesor}>{item.asesor}</option>
                                ))}
                                </select>
                            </span>
                            <span>
                                <div>Tipo de caso</div>
                                <select value={caso.idtipocaso} disabled={!isEditing} onChange={handleInputChange} name="idtipocaso">
                                {tipos.map((item) => (
                                    <option key={item.idtipo} value={item.idtipo}>{item.tipo}</option>
                                ))}
                                </select>
                            </span>
                            <span>
                                <div>Status</div>
                                <select value={caso.idstatuscaso} disabled={!isEditing} onChange={handleInputChange} name="idstatuscaso">
                                {status.map((item) => (
                                    <option key={item.idstatus} value={item.idstatus}>{item.status}</option>
                                ))}
                                </select>
                            </span>
                            <span>
                                <div>Estado</div>
                                <select value={caso.idestadocaso} disabled={!isEditing} onChange={handleInputChange} name="idestadocaso">
                                {estados.map((item) => (
                                    <option key={item.idestado} value={item.idestado}>{item.estado}</option>
                                ))}
                                </select>
                            </span>
                        </div>
                        <div className="tab-caso-informacion-div grid">
                            <div>Notas</div>
                            <textarea name="notas" onChange={handleInputChange} value={caso.notas} disabled={!isEditing} className="w-full h-32"></textarea>
                        </div>
                        {isEditing && (
                        <div className="tab-caso-informacion-div justify-center">
                            <button type="button" className="btn-guardar text-blue-500 border-blue-500 bg-transparent hover:bg-white" onClick={handleSave}>Guardar datos</button>
                        </div>
                        )}
                        {rol == "admin" && (
                        <div className="tab-caso-informacion-div justify-center">
                            <button className="flex items-center btn-guardar bg-yellow-400 rounded border p-1 text-gray-700 cursor-pointer hover:text-black hover:bg-yellow-500 transition-all" onClick={toogleEditMode}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg> Editar
                            </button>
                        </div>
                        )}
                        <hr className="mb-5" />
                    <div className="flex mb-5">
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
                        <div className="flex items-center">
                            <button className="btn-guardar mr-2 bg-emerald-500 hover:bg-emerald-700" onClick={handleAddActualizacion}>Enviar</button>
                            <textarea className="text-sm uppercase border rounded w-full p-2" ref={textareaRef} onChange={(e) => setNuevaActualizacion(e.target.value)}></textarea>
                        </div>
                    )}
                    {actualizaciones.map((item) => (
                    <div key={item.id} className="my-3 rounded-xl border-2">
                            <div className="bg-lime-200 text-gray-700 p-2 text-sm flex items-center cursor-pointer" onClick={() => toggleExpand(item.id)}>
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
                                
                            </div>
                            {expandedItems[item.id] && (
                                <div>
                                    <div className="bg-white p-2 text-sm">
                                        {item.actualizacion}
                                    </div>
                                </div>
                            )}
                    </div>
                ))}
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
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 hover:size-6 cursor-pointer mr-1 transition-all" onClick={() => handleEditarNombre(docq.iddoc, docq.nombre)}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                              </svg>
                                            )}             
                                            {docq.nombre}
                                            </div>
                                        </td>
                                        <td className="p-2 flex items-center w-64">
                                            <select value={docq.clasificacion}  disabled={!enabledSelects[docq.iddoc]} className="border rounded" onChange={(e) => handleChangeClasificacion(docq.iddoc, e.target.value)}>
                                                    <option value="0">* Sin clasificación</option>
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
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 hover:size-6 hover:text-red-500 transition-all cursor-pointer" onClick={() => handleDocEliminar(docq.iddoc, rol)} >
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
                    <div>pagos</div>
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