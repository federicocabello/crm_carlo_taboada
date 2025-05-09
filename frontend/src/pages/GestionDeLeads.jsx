import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Gestiones.css';

const GestionDeLeads = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageRange, setPageRange] = useState([1, 10]);
    const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
    const [filterDate, setFilterDate] = useState('');
    const [filterName, setFilterName] = useState('');
    const leadsPerPage = 20;

    const [oficina, setOficina] = useState([]);
    const [referencia, setReferencia] = useState([]);
    const [tipocaso, setTipocaso] = useState([]);
    const [statuscita, setStatuscita] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const [creador, setCreador] = useState([]);
    const [califica, setCalifica] = useState([]);

    const [filterOficina, setFilterOficina] = useState('');
    const [filterReferencia, setFilterReferencia] = useState('');
    const [filterTipocaso, setFilterTipocaso] = useState('');
    const [filterStatuscita, setFilterStatuscita] = useState('');
    const [filterAsesores, setFilterAsesores] = useState('');
    const [filterCreador, setFilterCreador] = useState('');
    const [filterCalifica, setFilterCalifica] = useState('');


    useEffect(() => {
        axios.get(`${backendUrl}/gestion-de-leads`, {withCredentials: true})
        .then((response) => {
            setLeads(response.data.resultados.leads);
            setOficina(response.data.selects.oficina);
            setReferencia(response.data.selects.referencia);
            setTipocaso(response.data.selects.tipo_caso);
            setStatuscita(response.data.selects.status_cita);
            setAsesores(response.data.selects.asesores);
            setCreador(response.data.selects.creadores);
            setCalifica(response.data.selects.califica)
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
                return leadDate.toDateString() == selectedDate.toDateString();
            });
        }

        if (filterName) {
            filtered = filtered.filter(lead => 
                lead.nombrec.toLowerCase().includes(filterName.toLowerCase())
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

        if (filterTipocaso) {
            filtered = filtered.filter(lead => 
                lead.tipocaso == filterTipocaso
            );
        }

        if (filterStatuscita) {
            filtered = filtered.filter(lead =>
                lead.statuscita == filterStatuscita
            );
        }

        if (filterAsesores) {
            filtered = filtered.filter(lead =>
                lead.asignado == filterAsesores
            );
        }

        if (filterCreador) {
            filtered = filtered.filter(lead =>
                lead.creador == filterCreador
            );
        }

        if (filterCalifica) {
            filtered = filtered.filter(lead =>
                lead.califica == filterCalifica
            );
        }

        setFilteredLeads(filtered);
    }, [leads, filterDate, filterName, filterOficina, filterReferencia, filterTipocaso, filterStatuscita, filterAsesores, filterCreador, filterCalifica]);

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
            <table className='table-gestion-de-leads'>
                <thead>
                    <tr className="filtros-leads">
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
                            onChange={(e) => setFilterName(e.target.value)} />
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
                        <th>
                            <select onChange={(e) => setFilterTipocaso(e.target.value)}>
                                <option value="" key="" className='text-gray-400'>Filtrar tipos de consulta...</option>
                                {tipocaso.map((item) => (
                                    <option key={item.id} value={item.tipocaso}>{item.tipocaso}</option>
                                ))}
                            </select>
                        </th>
                        <th>
                            <select onChange={(e) => setFilterStatuscita(e.target.value)}>
                                <option value="" key="" className='text-gray-400'>Filtrar status de cita...</option>
                                {statuscita.map((item) => (
                                    <option key={item.id} value={item.statuscita}>{item.statuscita}</option>
                                ))}
                            </select>
                        </th>
                        <th>
                            <select onChange={(e) => setFilterAsesores(e.target.value)}>
                                <option value="" key="" className='text-gray-400'>Filtrar asesores...</option>
                                {asesores.map((item) => (
                                    <option key={item.id} value={item.asesor}>{item.asesor}</option>
                                ))}
                            </select>
                        </th>
                        <th>
                            <select onChange={(e) => setFilterCalifica(e.target.value)}>
                                <option value="" key="" className="text-gray-400">Filtrar calificados...</option>
                                {califica.map((item) => (
                                    <option key={item.id} value={item.califica}>{item.califica}</option>
                                ))}
                            </select>
                        </th>
                        <th>
                            <select onChange={(e) => setFilterCreador(e.target.value)}>
                                <option value="" key="" className='text-gray-400'>Filtrar creadores...</option>
                                {creador.map((item) => (
                                    <option key={item.id} value={item.creador}>{item.creador}</option>
                                ))}
                            </select>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <div className="flex justify-center items-center">
                                Registrado
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
                        <th>Oficina</th>
                        <th>Fuente</th>
                        <th>Tipo de consulta</th>
                        <th>Status y razón de cita</th>
                        <th>Asignado a</th>
                        <th>¿Califica?</th>
                        <th>Creado por</th>
                    </tr>
                </thead>
                <tbody>
                {currentLeads.map((lead) => (
                    <tr key={lead.idcita}>
                        <td className='text-xs text-center'>{lead.fecha}</td>
                        <td>
                            <div className="text-blue-800 font-bold cursor-pointer hover:underline" onClick={() => navigate(`/perfil/${lead.idcliente}`)}>
                                {lead.nombrec}
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
                                    {lead.telefonoDos}{lead.pertenece && (<span> - {lead.pertenece}</span>)}
                                </div>
                            </div>
                            }
                        </td>
                        <td>{lead.oficina}</td>
                        <td>{lead.referido}</td>
                        <td className="w-64">
                            <div className="font-bold bg-gray-600 cursor-pointer hover:bg-gray-300 hover:text-gray-600 text-center w-full border rounded-xl text-white transition-all hover:border-gray-600" onClick={() => navigate(`/caso/${lead.idcaso}`)}>{lead.tipocaso}</div>
                            <div className="text-xs text-center font-bold text-gray-600 mt-1">{lead.subclase}</div>
                        </td>
                        <td className='w-96'>
                            <div className="p-1 text-white text-xs font-bold text-center border rounded-full w-32" style={{ backgroundColor: '#'+lead.colorstatuscita }}>
                                {lead.statuscita}
                            </div>
                            {lead.razoncita &&
                            <div className='flex'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 self-top">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                <span>{lead.razoncita}</span>
                            </div>
                    }
                        </td>
                        <td>{lead.asignado}</td>
                        <td className="w-32">
                            <div className="relative group">
                                <div style={{ backgroundColor: '#'+lead.colorcalifica }} className="p-1 text-white text-xs font-bold text-center border rounded-full">{lead.califica}</div>
                                {lead.motivo_califica && (
                                    <div className="absolute left-0 top-full mt-1 w-48 p-2 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity font-bold z-10" style={{ backgroundColor: '#'+lead.colorcalifica }}>
                                    {lead.motivo_califica}
                                    </div>
                                )}
                            </div>
                        </td>
                        <td>{lead.creador}</td>
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

    export default GestionDeLeads;