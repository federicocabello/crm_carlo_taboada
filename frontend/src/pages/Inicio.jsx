import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo_inicio.png";

const Home = () => {
    return (
        <div className="min-h-screen" style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
        }}>
            <motion.img
                src={logo}
                alt="Logo"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ width: "35%" }}
            />

            <div style={{
                marginTop: "auto",
                padding: "20px",
                backgroundColor: "#f0f0f0",
                width: "100%",
                textAlign: "center",
                fontSize: "14px",
                color: "#555"
            }}>
                © {new Date().getFullYear()} Desarrollado por <strong>Los Andes</strong>. Todos los derechos reservados.  
                <br />
                Construyendo soluciones digitales con compromiso y calidad.
            </div>
        </div>
    );
};


export default Home;
