import React from 'react';

function FormatearNumero({ numero }) {
    // Función que formatea el número
    const formatear = (num) => {
        // Usamos toLocaleString con 'de-DE' para formato con punto para miles y coma para decimales
        return num.toLocaleString('de-DE');
    }

    return (
        <span>$ {formatear(numero)}</span>
    );
}

export default FormatearNumero;
