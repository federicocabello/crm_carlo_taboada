import React, {useState} from "react";
import axios from 'axios';
import FormatearNumero from '../components/FormatearNumero'

const RegistrarPago = ({idcaso, nombrecaso, idcliente, onClose, idpago, monto, tipos, esSaldo, idcontrol}) => {
    if (!idcaso) return null;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [montoDos, setMontoDos] = useState(monto);
    const [tipo, setTipo] = useState(0);
    const [nombreTarjeta, setNombreTarjeta] = useState("");
    const [numeroTarjeta, setNumeroTarjeta] = useState("");

    const registrarPago = () => {
        const datos = {
            idcaso: idcaso,
            idcliente: idcliente,
            idpago: idpago,
            monto: montoDos,
            tipo: tipo,
            nombre_tarjeta: nombreTarjeta,
            numero_tarjeta: numeroTarjeta,
            esSaldo: esSaldo,
            idcontrol: idcontrol
        };
        axios.post(`${backendUrl}/caso/pago/registrar`, datos, { withCredentials: true })
            .then((response) => {
                console.log(response.data.mensaje);
                alert(response.data.mensaje);
                onClose();
            })
            .catch((error) => {
                console.error("Error al registrar el pago: ", error);
                alert("Error al registrar el pago. Revise los datos ingresados. Reintente.");
            });
    }

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className="font-bold text-green-600 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span>REGISTRAR PAGO</span>
                        <button className="absolute top-0 right-0 p-2 text-gray-300 cursor-pointer hover:text-black hover:scale-110 transition-all" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        </button>
                </div>
                <div className="font-bold text-xs">CASO N°<span className="text-orange-600">{idcaso}</span> {nombrecaso}</div>
                <div>
                    <input type="number" value={montoDos} className="border shadow-lg text-4xl p-2 w-full text-center rounded mt-5" onChange={(e) => setMontoDos(parseFloat(e.target.value))} readOnly={esSaldo} />
                    <select className="p-1 border rounded w-full shadow-lg cursor-pointer mt-5" onChange={(e) => setTipo(e.target.value)} value={tipo}>
                        <option value="0" className="text-gray-300 italic">Seleccione el tipo de pago...</option>
                        {tipos.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>
                        ))}
                    </select>
                    {tipo == 1 && (
                        <div className="flex flex-col w-full mt-5">
                            <div>
                                <span className="text-xs">Nombre que figura en la tarjeta</span>
                                <input type="text" className="border rounded p-1" onChange={(e) => setNombreTarjeta(e.target.value.toUpperCase())} value={nombreTarjeta} />
                            </div>
                            <div className="mt-2">
                                <span className="text-xs">Últimos 4 números de la tarjeta</span>
                                <input type="number" className="border rounded p-1" onChange={(e) => setNumeroTarjeta(parseInt(e.target.value))} value={numeroTarjeta} />
                            </div>
                        </div>
                    )}
                    {tipo == 2 && (
                        <div className="flex flex-col w-full mt-5">
                            <div>
                                <span className="text-xs">Nombre de la cuenta</span>
                                <input type="text" className="border rounded p-1" onChange={(e) => setNombreTarjeta(e.target.value.toUpperCase())} value={nombreTarjeta} />
                            </div>
                        </div>
                    )}
                    {tipo > 0 && montoDos > 0 && (
                        <button className="btn-guardar w-full flex justify-center items-center mt-5" onClick={registrarPago}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            <span className="font-bold text-sm">Guardar</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
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
            width: "15%",
            textAlign: "center",
            position: "relative",
        },
    };

export default RegistrarPago;