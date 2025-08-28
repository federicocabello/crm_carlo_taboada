import React from 'react';

function FormatearNumero({ numero }) {
    const formatear = (num) => {
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    return (
        <span>$ {formatear(numero)}</span>
    );
}

export default FormatearNumero;
