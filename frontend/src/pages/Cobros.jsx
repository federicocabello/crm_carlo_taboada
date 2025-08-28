import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FormatearNumero from '../components/FormatearNumero'

const Cobros = () => {
        const [rol, setRol] = useState(null);
        const navigate = useNavigate();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const [estados, setEstados] = useState ([]);
        const [cobros, setCobros] = useState ([]);

        const { estado, desde, hasta } = useParams();

        const [pagoEstado, setPagoEstado] = useState(estado ?? "");
        const [pagoDesde,  setPagoDesde]  = useState(desde  ?? "");
        const [pagoHasta,  setPagoHasta]  = useState(hasta  ?? "");

        const cargarSitioCobros = () => {
            const haveEstado = estado !== undefined && estado !== "null" && estado !== "";
    const haveFechas = (desde && desde !== "null" && hasta && hasta !== "null");

    let url = `${backendUrl}/cobros`;
    if (haveEstado && !haveFechas) {
      url = `${backendUrl}/cobros/${estado}`;
    } else if (haveFechas) {
      const e = haveEstado ? estado : "null";
      url = `${backendUrl}/cobros/${e}/${desde}/${hasta}`;
    }

            axios.get(url, { withCredentials: true })
            .then((res) => {
                setRol(res.data.rol);
                setEstados(res.data.estados);
                if (res.data.cobros) setCobros(res.data.cobros);
            })
            .catch((err) => {
                console.error("Error al obtener cobros:", err);
                alert("Error! Reintente.");
            });
        }
        
        const cambiarPagoEstado = (idpago, idestado) => {
            axios.post(`${backendUrl}/cobros/cambiar-estado`, { idpago: idpago, idestado: idestado }, { withCredentials: true })
                                    .then((response) => {
                                        //alert(response.data.mensaje);
                                        console.log(response.data.mensaje)
                                        cargarSitioCobros();
                                    })
                                    .catch((error) => {
                                        console.error("Error al actualizar estado de pago:", error);
                                        alert("Error al actualizar estado de pago. Reintente.");
                                    });
        }
        
        useEffect(() => {
            cargarSitioCobros();
        }, [backendUrl, estado, desde, hasta]);

        const aplicarFiltros = () => {
    const e = (pagoEstado === "" || pagoEstado === null) ? "null" : String(pagoEstado);
    const d = (pagoDesde  === "" || pagoDesde  === null) ? "null" : pagoDesde;
    const h = (pagoHasta  === "" || pagoHasta  === null) ? "null" : pagoHasta;

    if (e !== "null" && d === "null" && h === "null") {
      navigate(`/cobros/${e}`);
    } else if (d !== "null" && h !== "null") {
      // estado opcional: si no hay, mando "null"
      navigate(`/cobros/${e}/${d}/${h}`);
    } else {
      navigate(`/cobros`);
    }
  };

    return (
        <div className="flex justify-center flex-col items-center">
            <div className="bg-white shadow-lg rounded-lg w-1/2 mx-auto p-6 border flex justify-between items-center">
                <span>
                    <div className="font-bold text-gray-500 text-xs">Estado</div>
                    <select className="rounded p-1 cursor-pointer" onChange={(e) => setPagoEstado(e.target.value)} value={pagoEstado}>
                        <option value="" key={0} className="text-gray-300 italic">Seleccione un estado...</option>
                        {estados.map((estado) => (
                            <option key={estado.id} value={estado.id}>
                                {estado.estado}
                            </option>
                        ))}
                    </select>
                </span>

                <span>
                    <div className="font-bold text-gray-500 text-xs">Desde</div>
                    <input type="date" onChange={(e) => setPagoDesde(e.target.value)} value={pagoDesde} />
                </span>

                <span>
                    <div className="font-bold text-gray-500 text-xs">Hasta</div>
                    <input type="date" onChange={(e) => setPagoHasta(e.target.value)} value={pagoHasta} />
                </span>

                <span>
                    <button className="btn-guardar flex justify-center items-center" onClick={aplicarFiltros}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        Buscar</button>
                </span>
            </div>
            <table className="bg-white w-1/2 mt-10 shadow-lg">
                <thead>
                    <tr>
                        <th className="p-1 bg-cyan-100 border text-xs w-64">Estado</th>
                        <th className="p-1 bg-cyan-100 border text-xs">Datos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-xs italic border p-1" colSpan={2}>Registros: {cobros.length}</td>
                    </tr>
                    {cobros.map((cobro) => (
                        <tr>
                            <td className="border p-2">
                                <div>
                                    <select className="text-sm text-white border rounded-xl text-center cursor-pointer my-1 font-bold w-full" style={{ backgroundColor: '#'+cobro.colorestado }} value={cobro.id_estado} onChange={(e) => cambiarPagoEstado(cobro.idcontrol, e.target.value)} disabled={rol == "user"}>
                                            {estados.map((estado) => (
                                                <option key={estado.id} value={estado.id} className="bg-white text-black">
                                                    {estado.estado}
                                                </option>
                                            ))}
                                    </select>
                                    {cobro.total_no_pagados > 0 ? (
                                                    <div className="text-red-400 font-bold rounded-xl text-center border text-sm border-red-400 w-full">
                                                        ADEUDA <FormatearNumero numero={parseFloat(cobro.total_no_pagados)} />
                                                    </div>
                                                ) : (
                                                    <div className="text-green-500 font-bold rounded-xl text-center border text-sm border-green-500 w-full flex justify-center items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                        </svg>
                                                        <span>SIN DEUDA</span>
                                                    </div>
                                                )}
                                </div>
                            </td>
                            <td className="border p-2">
                                <div className="text-orange-500 font-bold hover:underline hover:text-orange-700 cursor-pointer transition-all" onClick={() => navigate(`/caso/${cobro.id_caso}`)}>
                                    {cobro.id_caso} • {cobro.caso}
                                </div>
                                <div className="text-blue-500 font-bold hover:underline hover:text-blue-700 cursor-pointer transition-all text-xs" onClick={() => navigate(`/cliente/${cobro.id_cliente}`)}>
                                    CLIENTE {cobro.cliente}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Cobros;