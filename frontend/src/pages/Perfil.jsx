import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Perfil.css';

const Perfil = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [datos, setDatos] = useState([]);
    const [casos, setCasos] = useState([]);
    const [casosSinAbrir, setCasosSinAbrir] = useState([]);
    const [rol, setRol] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    const toogleEditMode = () => {
        setIsEditing(!isEditing);
    }

    useEffect(() => {
            axios.get(`${backendUrl}/perfil/${id}`, {withCredentials: true})
            .then((response) => {
                setDatos(response.data.datos[0]);
                setCasos(response.data.casos)
                setRol(response.data.rol[0])
                setCasosSinAbrir(response.data.casos_sinabrir);
            })
            .catch((error) => {
                console.error("Error al obtener los datos del cliente:", error);
                alert("Error al obtener los datos del clientes.\n"+error)
            });
    }, [backendUrl, id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDatos({
            ...datos,
            [name]: value
        });
    };

    const handleSave = () => {
        axios.post(`${backendUrl}/perfil/guardar-datos`, datos, { withCredentials: true })
            .then((response) => {
                alert(response.data.mensaje);
                setIsEditing(false);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error al guardar los datos:", error);
                alert("Error al guardar los datos. Reintente.");
            });
    };

    const handleCaseClick = (caso) => {
        navigate(`/caso/${caso}`);
    };

    return (
        <div>
            <h1 className="flex text-3xl items-center font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                    <span>{datos.nombre}</span>
                    {rol == "admin" && (
                    <span onClick={toogleEditMode} className="text-xs flex items-center ml-1 bg-yellow-400 rounded border p-1 text-gray-700 cursor-pointer hover:text-black hover:bg-yellow-500 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>Editar
                    </span>
                    )}
            </h1>
            <div className="mb-5 text-sm text-gray-500 italic">{datos.clasificacion} • Creado por {datos.fullname} el {datos.registrado}</div>
            <Tabs>
                <TabList>
                    <Tab>
                        <div className="tab-div">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="tab-div-img">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                            </svg>
                            <span>Datos</span>
                        </div>
                    </Tab>
                    <Tab>
                        <div className="tab-div">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="tab-div-img">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                            </svg>
                            <span>Casos</span>
                        </div>
                    </Tab>
                    <Tab>
                        <div className="tab-div">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="tab-div-img">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                        </svg>
                        <span>Intakes</span>
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
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                            </svg>
                            <span>Logs</span>
                        </div>
                    </Tab>
                </TabList>
                <TabPanel className="tab-panel-perfil">
                <div className="flex">
                    <div className="w-full section-datos">
                        <p><span>Nombre:</span><input type="text" name="nombre" value={datos.nombre} onChange={handleInputChange} disabled={!isEditing} className={!isEditing ? 'bg-transparent' : ''} /></p>
                        <p><span>Teléfono 1:</span><input type="text" name="telefono1" value={datos.telefono1} disabled={!isEditing} className={!isEditing ? 'bg-transparent' : ''} /></p>
                        <p className="flex items-center">
                            <div>
                                <span>Téléfono 2:</span><input type="text" name="telefono2" value={datos.telefono2} onChange={handleInputChange} disabled={!isEditing} className={!isEditing ? 'bg-transparent' : ''} />
                            </div>
                            <div>
                                <span>Pertenece a:</span><input type="text" name="pertenecetel2" value={datos.pertenecetel2} onChange={handleInputChange} disabled={!isEditing} className={!isEditing ? 'bg-transparent' : ''} />
                            </div>
                        </p>
                        <p className="flex items-center">
                            <div>
                                <span>Otro teléfono:</span><input type="text" name="telefono3" value={datos.telefono3} onChange={handleInputChange} disabled={!isEditing} className={!isEditing ? 'bg-transparent' : ''} />
                            </div>
                            <div>
                                <span>Pertenece a:</span><input type="text" name="pertenecetel3" value={datos.pertenecetel3} onChange={handleInputChange} disabled={!isEditing} className={!isEditing ? 'bg-transparent' : ''} />
                            </div>
                        </p>
                        <p>
                            <span>Domicilio:</span><input type="text" name="domicilio" value={datos.domicilio} onChange={handleInputChange} disabled={!isEditing} className={!isEditing ? 'bg-transparent' : ''} />
                        </p>
                        <p className="flex items-center">
                            <div>
                                <span>Ciudad:</span><input type="text" name="ciudad" value={datos.ciudad} onChange={handleInputChange} disabled={!isEditing} className={!isEditing ? 'bg-transparent' : ''} />
                            </div>
                            <div>
                                <span>CP:</span><input type="text" name="cp" value={datos.cp} onChange={handleInputChange} disabled={!isEditing} className={!isEditing ? 'bg-transparent' : ''} />
                            </div>
                        </p>
                        <p>
                            <span>Email:</span><input type="email" name="email" value={datos.email} onChange={handleInputChange} disabled={!isEditing} className={!isEditing ? 'bg-transparent' : ''} />
                        </p>
                        {datos.clasificacion == "LEAD" && (
                        <p>
                            <span>¿Califica?:</span>
                            <select value={datos.califica} onChange={handleInputChange} name="califica" disabled={!isEditing} className={!isEditing ? 'bg-transparent' : ''}>
                                <option value="3">Sin clasificar</option>
                                <option value="1">Si</option>
                                <option value="0">No</option>
                                <option value="2">Info Back</option>
                            </select>
                        </p>
                        )}
                        {isEditing && (
                        <p className="text-center"><button className="btn-guardar text-blue-500 border-blue-500 bg-transparent hover:bg-white" onClick={handleSave}>Guardar datos</button></p>
                        )}
                    </div>
                    <div className="w-1/2 border rounded p-2">
                        Deudas: 
                    </div>
                </div>
                </TabPanel>
                <TabPanel>
                    {casosSinAbrir.length > 0 && (
                        <table className="mb-5 w-full rounded">
                            <thead>
                                <tr>
                                    <th className="text-left text-red-500 py-1 p-rechazo" colSpan={3}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                                        </svg>
                                        Tiene casos sin abrir con captura de datos
                                    </th>
                                </tr>
                                <tr className="bg-gray-400 text-white py-1">
                                    <th className="border">Fecha de creación</th>
                                    <th className="border">Caso</th>
                                    <th className="border">Asignado a</th>
                                </tr>
                            </thead>
                            <tbody>
                                {casosSinAbrir.map((caso) => (
                                    <tr className="border cursor-pointer hover:bg-gray-300" onClick={() => handleCaseClick(caso.id)}>
                                        <td className="w-1/4">{caso.fecha}</td>
                                        <td className="font-bold">{caso.id} • {caso.tipocaso}</td>
                                        <td>{caso.asignado}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {casos.length > 0 ? (
                    <table className="table-perfil-casos">
                        <thead>
                            <tr>
                                <th>Caso</th>
                                <th>Beneficiario</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {casos.map((caso) => (
                            <tr onClick={() => handleCaseClick(caso.id)}>
                                <th className="th-caso-id">{caso.id} - {caso.caso}</th>
                                <th>{caso.nombre}</th>
                                <th>{caso.tipocaso}</th>
                                <th>{caso.statuscaso}</th>
                                <th>{caso.estadocaso}</th>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="p-rechazo"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  Este {datos.clasificacion} no tiene casos abiertos.</p>
                )}
                </TabPanel>
            </Tabs>
        </div>
    )
}

export default Perfil;