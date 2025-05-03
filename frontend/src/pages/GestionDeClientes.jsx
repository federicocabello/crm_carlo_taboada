import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Gestiones.css';

const GestionDeClientes = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [leads, setLeads] = useState([]);
    const [casos, setCasos] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageRange, setPageRange] = useState([1, 10]);
    const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
    const [filterDate, setFilterDate] = useState('');
    const [filterName, setFilterName] = useState('');
    const leadsPerPage = 20;

    const [oficina, setOficina] = useState([]);
    const [referencia, setReferencia] = useState([]);
    const [statusCaso, setStatusCaso] = useState([]);

    const [filterOficina, setFilterOficina] = useState('');
    const [filterReferencia, setFilterReferencia] = useState('');
    const [filterStatusCaso, setFilterStatusCaso] = useState('');


    useEffect(() => {
        axios.get(`${backendUrl}/gestion-de-clientes`, {withCredentials: true})
        .then((response) => {
            setLeads(response.data.resultados.leads);
            setCasos(response.data.resultados.casos);
            setOficina(response.data.selects.oficina);
            setReferencia(response.data.selects.referencia);
            setStatusCaso(response.data.selects.statuscaso);
        })
        .catch((error) => {
            console.error("Error al obtener los leads:", error);
        });
    }, [backendUrl]);

    useEffect(() => {
        let filtered = leads;

        if (filterDate) {
            filtered = filtered.filter(lead => {
                const [month, day, year] = lead.fecha.split('/');
                const leadDate = new Date(`${year}-${month}-${day}`);
                const selectedDate = new Date(filterDate);
                return leadDate.toDateString() === selectedDate.toDateString();
            });
        }

        if (filterName) {
            filtered = filtered.filter(lead => 
                lead.nombre.toLowerCase().includes(filterName.toLowerCase())
            );
        }

        if (filterOficina) {
            filtered = filtered.filter(lead => 
                lead.oficina == filterOficina
            );
        }

        if (filterReferencia) {
            filtered = filtered.filter(lead => 
                lead.referido == filterReferencia
            );
        }

        if (filterStatusCaso) {
            filtered = filtered.filter(lead =>
                lead.status.toLowerCase().includes(filterStatusCaso.toLowerCase())
            );
        }        

        setFilteredLeads(filtered);
    }, [filterDate, filterName, filterOficina, filterReferencia, filterStatusCaso, leads]);


    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPageRange = () => {
        const totalPages = Math.ceil(leads.length / leadsPerPage);
        if (pageRange[1] < totalPages) {
            setPageRange([pageRange[0] + 10, pageRange[1] + 10]);
        }
    };

    const prevPageRange = () => {
        if (pageRange[0] > 1) {
            setPageRange([pageRange[0] - 10, pageRange[1] - 10]);
        }
    };

    const sortLeads = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        const sortedLeads = [...filteredLeads].sort((a, b) => {
            if (key === 'fecha') {
                const [monthA, dayA, yearA] = a[key].split('/');
                const [monthB, dayB, yearB] = b[key].split('/');
                const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
                const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
                return direction === 'asc' ? dateA - dateB : dateB - dateA;
            } else {
                if (a[key] < b[key]) {
                    return direction === 'asc' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return direction === 'asc' ? 1 : -1;
                }
                return 0;
            }
        });
        setFilteredLeads(sortedLeads);
    };
    
    return (
        <div>
            <table className='table-gestion-de-clientes'>
                <thead>
                    <tr className="filtros-clientes">
                        <th className="w-10">
                            <input type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </th>
                        <th>
                            <input type="text" 
                            placeholder='Filtrar...'
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            />
                        </th>
                        <th>
                            <select onChange={(e) => setFilterStatusCaso(e.target.value)}>
                                <option value="" key="" className="text-gray-400">Filtrar casos...</option>
                                {statusCaso.map((item) => (
                                <option key={item.id} value={item.statuscaso}>{item.statuscaso}</option>
                                ))}
                            </select>
                        </th>
                        <th>
                            <select onChange={(e) => setFilterOficina(e.target.value)}>
                                <option value="" key="" className='text-gray-400'>Filtrar oficinas...</option>
                                {oficina.map((item) => (
                                <option key={item.id} value={item.oficina}>{item.oficina}</option>
                                ))}
                            </select>
                        </th>
                        <th>
                            <select onChange={(e) => setFilterReferencia(e.target.value)}>
                                <option value="" key="" className='text-gray-400'>Filtrar fuentes...</option>
                                {referencia.map((item) => (
                                    <option key={item.id} value={item.referencia}>{item.referencia}</option>
                                ))}
                            </select>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <div className="flex justify-center items-center">
                                Fecha
                                <i onClick={() => sortLeads('fecha')} className="cursor-pointer hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                    </svg>
                                </i>
                            </div>
                        </th>
                        <th>
                            <div className="flex justify-center items-center">
                                Nombre
                                <i onClick={() => sortLeads('nombre')} className="cursor-pointer hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                    </svg>
                                </i>
                            </div>
                        </th>
                        <th>Casos</th>
                        <th>Oficina</th>
                        <th>Fuente</th>
                    </tr>
                </thead>
                <tbody>
                {currentLeads.map((lead) => (
                    <tr key={lead.id}>
                        <td className='text-xs text-center'>{lead.fecha}</td>
                        <td>
                            <div className="text-green-800 font-bold cursor-pointer hover:underline" onClick={() => navigate(`/perfil/${lead.id}`)}>
                                {lead.nombre}
                            </div>
                            {lead.telefonoUno &&
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                                <div className='ml-1'>
                                    {lead.telefonoUno}
                                </div>
                            </div>
                            }
                            {lead.telefonoDos &&
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                                <div className='ml-1'>
                                    {lead.telefonoDos}{lead.pertenecetel2 && <span> - {lead.pertenecetel2}</span>}
                                </div>
                            </div>
                            }
                            {lead.domicilio && 
                                <div className='flex items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg>{lead.domicilio}
                                </div>
                            }
                        </td>
                        <td>
                            <div>
                            {casos.filter(caso => caso.idcliente === lead.id).map((caso) => (
                            <div key={caso.idcaso} className="font-bold my-1">
                                <span className="w-10 inline-block hover:underline cursor-pointer mr-2" onClick={() => navigate(`/caso/${caso.idcaso}`)}>{caso.idcaso}</span>
                                <span className="text-white border rounded px-2" style={{ backgroundColor: '#'+caso.colorstatuscaso }}>{caso.status}</span>
                            </div>
                            ))}
                            </div>
                        </td>
                        <td>{lead.oficina}</td>
                        <td>{lead.referido}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination flex justify-center items-center mt-4">
                <button
                    onClick={prevPageRange}
                    className="px-4 py-2 mx-1 bg-gray-200"
                    disabled={pageRange[0] === 1}
                >
                    &laquo;
                </button>
                {Array.from({ length: Math.min(10, Math.ceil(leads.length / leadsPerPage) - pageRange[0] + 1) }, (_, index) => (
                    <button
                        key={pageRange[0] + index}
                        onClick={() => paginate(pageRange[0] + index)}
                        className={`px-4 py-2 mx-1 ${currentPage === pageRange[0] + index ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200'}`}
                    >
                        {pageRange[0] + index}
                    </button>
                ))}
                <button
                    onClick={nextPageRange}
                    className="px-4 py-2 mx-1 bg-gray-200"
                    disabled={pageRange[1] >= Math.ceil(leads.length / leadsPerPage)}
                >
                    &raquo;
                </button>
            </div>
        </div>
    );
    };

    export default GestionDeClientes;