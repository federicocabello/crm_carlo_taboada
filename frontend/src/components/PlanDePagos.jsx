import React, {useState} from "react";
import axios from 'axios';
import FormatearNumero from '../components/FormatearNumero'

const PlanDePagos = ({idcaso, idcliente, nombrecaso, estados, onClose, tipos, metodos}) => {
    if (!idcaso) return null;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [estadoList, setEstadoList] = useState(estados);
    const today = new Date().toISOString().split('T')[0];

    const [valorServicio, setValorServicio] = useState(0);
    const [entregaInicial, setEntregaInicial] = useState(0);
    const [cuotas, setCuotas] = useState(-1);
    const valorCuota = (valorServicio - entregaInicial) / cuotas;
    const [vencimiento, setVencimiento] = useState(today);
    const [estado, setEstado] = useState(1);

    const [tipo, setTipo] = useState(0);
    const [metodo, setMetodo] = useState(0);
    const [nombreTarjeta, setNombreTarjeta] = useState("");
    const [numeroTarjeta, setNumeroTarjeta] = useState("");

    const handlePlanDePagos = () => {
        const datos = {
            idcaso: idcaso,
            idcliente: idcliente,
            valor_servicio: valorServicio,
            entrega_inicial: entregaInicial,
            cuotas: cuotas,
            valor_cuota: valorCuota,
            vencimiento: vencimiento,
            estado: estado,
            tipo: tipo,
            metodo: metodo,
            nombre_tarjeta: nombreTarjeta,
            numero_tarjeta: numeroTarjeta
        };
                    axios.post(`${backendUrl}/pagos/guardar-plan`, datos, { withCredentials: true })
                        .then((response) => {
                            console.log(response.data.mensaje);
                            alert(response.data.mensaje);
                            onClose();
                            window.open(`${backendUrl}/plandepagos/resumen/${response.data.idcontrol}`, '_blank');
                        })
                        .catch((error) => {
                            console.error("Error al guardar el plan de pagos: ", error);
                            alert("Error al guardar el plan de pagos. Revise los datos ingresados. Reintente.");
                        });
            };

            const redireccionarRecibos = (idcontrol, identrega) => {
                window.open(`${backendUrl}/plandepagos/resumen/${idcontrol}`, '_blank');
                            if (identrega) {
                                window.open(`${backendUrl}/reciboindependiente/${identrega}`, '_blank');
                            }
            }

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className="font-bold text-green-600 flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>PLAN DE PAGOS</span>
                    <button className="absolute top-0 right-0 p-2 text-gray-300 cursor-pointer hover:text-black hover:scale-110 transition-all" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    </button>
                </div>
                <div className="font-bold text-xs">CASO N°<span className="text-orange-600">{idcaso}</span> {nombrecaso}</div>
                <div className="mt-3 flex flex-col gap-5">
                    <div className="flex flex-col w-full">
                        <span>Estado</span>
                        <select className="border rounded p-1 ml-1 shadow-md cursor-pointer" value={estado} onChange={(e) => setEstado(e.target.value)}>
                            {estadoList.map((estado) => (
                                <option key={estado.id} value={estado.id}>{estado.estado}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col w-full">
                        <span>Valor del servicio</span>
                        <input type="number" className="border rounded p-1 ml-1 shadow-md" onChange={(e) => setValorServicio(parseFloat(e.target.value))} />
                    </div>
                    {cuotas != 0 && (
                    <div className="flex flex-col w-full">
                        <span>Entrega inicial</span>
                        <input type="number" className="border rounded p-1 ml-1 shadow-md" onChange={(e) => setEntregaInicial(parseFloat(e.target.value))} />
                    </div>
                    )}

                        <div>
                            <div>
                                <select className="p-1 border rounded w-full shadow-md cursor-pointer" onChange={(e) => setTipo(e.target.value)} value={tipo}>
                                    <option value="0" className="text-gray-300 italic">Seleccione el tipo de pago de entrega...</option>
                                    {tipos.map((tipo) => (
                                        <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>
                                    ))}
                                </select>
                            </div>
                            {tipo == 1 && (
                                <div className="flex flex-col w-full mt-5">
                                    <div>
                                        <span className="text-xs mr-1">Nombre que figura en la tarjeta</span>
                                        <input type="text" className="border rounded p-1" onChange={(e) => setNombreTarjeta(e.target.value.toUpperCase())} value={nombreTarjeta} />
                                    </div>
                                    <div className="mt-2">
                                        <span className="text-xs mr-1">Últimos 4 números de la tarjeta</span>
                                        <input type="number" className="border rounded p-1" onChange={(e) => setNumeroTarjeta(parseInt(e.target.value))} value={numeroTarjeta} />
                                    </div>
                                </div>
                            )}
                            <select className="p-1 border rounded w-full shadow-lg cursor-pointer mt-5" onChange={(e) => setMetodo(e.target.value)} value={metodo}>
                                <option value="0" className="text-gray-300 italic">Seleccione el método de pago de entrega..</option>
                                {metodos.map((metodo) => (
                                    <option key={metodo.id} value={metodo.id}>{metodo.metodo}</option>
                                ))}
                            </select>
                            {metodo == 1 && tipo != 1 && (
                                <div className="flex flex-col w-full mt-5">
                                    <div>
                                        <span className="text-xs mr-1">Nombre de la cuenta</span>
                                        <input type="text" className="border rounded p-1" onChange={(e) => setNombreTarjeta(e.target.value.toUpperCase())} value={nombreTarjeta} />
                                    </div>
                                </div>
                            )}
                        </div>

                    <div className="flex flex-col w-full">
                        <span>Cuotas mensuales</span>
                        <select className="border rounded p-1 ml-1 shadow-md cursor-pointer" onChange={(e) => setCuotas(e.target.value)} value={cuotas} disabled={cuotas == 0}>
                            <option value="-1" className="text-gray-300 italic">Seleccione la cantidad de cuotas</option>
                            <option value="0">PAGO ÚNICO</option>
                        {Array.from({ length: 12 }, (_, index) => (
                            <option key={index} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                        </select>
                    </div>
                    {cuotas > 0 && valorCuota > 0 && (
                        <div className="flex flex-col w-full">
                            <span>Valor de la cuota</span>
                            <div className="font-bold text-xl"><FormatearNumero numero={valorCuota} /></div>
                        </div>
                    )}
                    {cuotas > 0 && valorCuota > 0 && (
                            <div className="flex flex-col w-full">
                                <span>Vencimiento de la primer cuota</span>
                                <input type="date" className="border rounded p-1 ml-1 shadow-md" onChange={(e) => setVencimiento(new Date(e.target.value))} />
                            </div>
                    )}
                    {valorServicio > 0 && cuotas != -1 && tipo > 0 && metodo > 0 && (
                        <div className="flex flex-col w-full">
                            <button className="flex btn-guardar items-center justify-center" onClick={handlePlanDePagos}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                <span className="font-bold text-sm">Guardar</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        width: "20%",
        textAlign: "center",
        position: "relative",
    },
};

export default PlanDePagos;