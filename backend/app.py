from flask import Flask, request, jsonify, send_file, Response, render_template, make_response, url_for, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mysqldb import MySQL
import bcrypt, os, io
from flask_cors import CORS
from config import config
from dotenv import load_dotenv
#from weasyprint import HTML
import pdfkit

##linea de abajo
#configurationwpdf = pdfkit.configuration(wkhtmltopdf=r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe')

from num2words import num2words
from datetime import datetime
from werkzeug.utils import secure_filename

from dateutil.relativedelta import relativedelta

import pandas as pd
import numpy as np
from io import BytesIO

load_dotenv()

backend_url = os.getenv("BACKEND_URL")

app = Flask(__name__, static_folder="static")
app.secret_key = "B!1w8NAt1T^%kvhUI*S^"
CORS(app, supports_credentials=True, origins=backend_url)

mysql = MySQL(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

# Modelo de usuario
class User(UserMixin):
    def __init__(self, username, password, fullname, rol, id):
        self.username = username
        self.password = password
        self.fullname = fullname
        self.rol = rol
        self.id = id
    
    def get_id(self):
        return self.username

@login_manager.user_loader
def load_user(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT user, password, fullname, rol, id FROM auth WHERE user = %s", (user_id,))
    user_data = cursor.fetchone()
    cursor.close()
    if user_data:
        return User(username=user_data[0], password=user_data[1], fullname=user_data[2], rol=user_data[3], id=user_data[4])
    return None

# Ruta para el inicio de sesión
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    #print(f"Datos ingresados: username={username}, password={password}")

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT user, password, fullname, rol, id, habilitado FROM auth WHERE user = %s", (username,))
    user = cursor.fetchone()
    cursor.close()

    #print(f"Datos en la base: username={user[0]}, password={user[1]}")
    #if user and bcrypt.checkpw(password.encode("utf-8"), user[1].encode("utf-8")):
    if user and user[5] and password == user[1]:
        user_obj = User(username=user[0], password=user[1], fullname=user[2], rol=user[3], id=user[4])
        login_user(user_obj)
        return jsonify({"message": "Login exitoso", "user": {"username": user[0], "password": user[1], "fullname": user[2], "rol": user[3], "id": user[4]}, "usuario": user[0]}), 200

    return jsonify({"message": "Usuario o contraseña incorrectos"}), 401

@app.route("/api/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "✅ Logout exitoso"}), 200

@app.route("/update_myuser", methods=["POST"])
@login_required
def update_myuser():
    data = request.json
    usuarionativo = data.get("usuarionativo")
    username = data.get("username").replace(' ','')
    password = data.get("password").replace(' ','')
    fullname = data.get("name").strip()
    rol = data.get("rol")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE auth SET user = %s, password = %s, fullname = %s, rol = %s WHERE user = %s", (username, password, fullname, rol, usuarionativo))
    mysql.connection.commit()
    cursor.close()
    logout_user()
    user = User(username=username, password=password, fullname=fullname, rol=rol)
    login_user(user, remember=True)
    return jsonify({"message": "✅ Mi usuario actualizado correctamente.", "user": {"username": username, "password": password, "fullname": fullname, "rol": rol}}), 200

@app.route("/usuario/nuevo", methods=["POST"])
@login_required
def nuevoUsuario():
    data = request.json
    nombre = data.get("nombre")
    user = data.get("user")
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO auth (user, password, fullname, rol, clasificacion, habilitado) VALUES (%s, 'ctaboada2025', %s, 'user', 'agente', 1)", (user, nombre))
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("USUARIOS", "Agregó un nuevo usuario al sistema: "+nombre+" | "+user, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/captura-de-datos", methods=["GET", "POST"])
@login_required
def capturaDeDatos():
    cursor = mysql.connection.cursor()
    
    cursor.execute("SELECT id, oficina from fk_oficina ORDER BY oficina;")
    oficina = cursor.fetchall()
    oficina = [{"id": r[0], "oficina": r[1]} for r in oficina]
    
    cursor.execute("SELECT id, referido from fk_referido ORDER BY referido;")
    referido = cursor.fetchall()
    referido = [{"id": r[0], "referido": r[1]} for r in referido]
    
    cursor.execute("SELECT id, tipocita from fk_tipo_cita ORDER BY tipocita;")
    tipo_cita = cursor.fetchall()
    tipo_cita = [{"id": r[0], "tipocita": r[1]} for r in tipo_cita]
    
    cursor.execute("SELECT fecha, GROUP_CONCAT(hora ORDER BY hora SEPARATOR ', ') AS horas FROM citas WHERE status != 0 GROUP BY fecha;")
    citas_calendario = cursor.fetchall()
    citas_calendario = [{"fecha": a[0].isoformat(), "hora": a[1]} for a in citas_calendario]
    
    cursor.execute("SELECT id, tipocaso FROM fk_tipo_caso WHERE id != 0 ORDER BY tipocaso")
    tipo_caso = cursor.fetchall()
    tipo_caso = [{"id": r[0], "tipocaso": r[1]} for r in tipo_caso]
    
    cursor.execute("SELECT tipo_caso_subclase.id AS idsubclase, idtipo AS idtipocaso, fk_tipo_caso.tipocaso AS tipocaso, subclase FROM tipo_caso_subclase JOIN fk_tipo_caso ON fk_tipo_caso.id=tipo_caso_subclase.idtipo WHERE tipo_caso_subclase.id != 0 ORDER BY subclase;")
    subclase = cursor.fetchall()
    subclase = [{"idsubclase": r[0], "idtipocaso": r[1], "tipocaso": r[2], "subclase": r[3]} for r in subclase]
    
    cursor.execute("SELECT id, fullname FROM auth WHERE clasificacion = 'asesor' ORDER BY fullname;")
    asesores = cursor.fetchall()
    asesores = [{"id": r[0], "asesor": r[1]} for r in asesores]
    
    cursor.execute("SELECT fecha FROM calendario_fechas_bloqueadas;")
    fechas_bloqueadas = cursor.fetchall()
    fechas_bloqueadas = [{"fecha": a[0]} for a in fechas_bloqueadas]
    
    cursor.execute("SELECT CONCAT(hora), cant from citas_calendario ORDER BY hora;")
    rows = cursor.fetchall()
    schedule = [{"hour": row[0], "maxAppointments": row[1]} for row in rows]
    
    cursor.close()
    resultados = {
        "oficina": oficina,
        "referido": referido,
        "tipocita": tipo_cita,
        "citas_calendario": citas_calendario,
        "tipo_caso": tipo_caso,
        "asesores": asesores,
        "fechas_bloqueadas": fechas_bloqueadas,
        "subclase": subclase,
        "schedule": schedule
    }
    
    
    
    return jsonify(resultados)

@app.route("/gestion-de-leads", methods=["GET"])
@login_required
def gestionDeLeads():
    cursor = mysql.connection.cursor()
    #cursor.execute("SELECT clientes.id AS id, nombre, telefono1 AS telefonoUno, telefono2 AS telefonoDos, fk_oficina.oficina AS oficina, fk_referido.referido AS referido, casos.id AS idcaso, fk_tipo_caso.tipocaso AS tipocaso, citas.id AS idcita, fk_status_cita.statuscita, citas.razon AS razoncita, auth_asignado.fullname AS asignado, califica, DATE_FORMAT(registrado, '%m/%d/%Y') AS fecha, auth_creador.fullname AS creador, clientes.pertenecetel2 AS pertenece FROM clientes LEFT JOIN (SELECT * FROM casos WHERE (idcliente, modificado) IN (SELECT idcliente, MAX(modificado) FROM casos GROUP BY idcliente)) AS casos ON clientes.id = casos.idcliente LEFT JOIN (SELECT * FROM citas WHERE id IN (SELECT MAX(id) FROM citas GROUP BY caso)) AS citas ON citas.caso = casos.id LEFT JOIN fk_status_cita ON citas.status=fk_status_cita.id LEFT JOIN auth AS auth_creador ON auth_creador.id=clientes.creador LEFT JOIN auth AS auth_asignado ON auth_asignado.id=casos.asignado LEFT JOIN fk_oficina ON fk_oficina.id=clientes.oficina LEFT JOIN fk_referido ON fk_referido.id=clientes.referido LEFT JOIN fk_tipo_caso ON casos.tipo=fk_tipo_caso.id WHERE clientes.clasificacion = 'LEAD' GROUP BY clientes.id ORDER BY clientes.registrado DESC, casos.id DESC, citas.id DESC;")
    cursor.execute("""
                   SELECT
                        clientes.id AS idcliente,
                        clientes.nombre AS nombrec,
                        clientes.telefono1 AS telefono1,
                        clientes.telefono2 AS telefono2,
                        clientes.pertenecetel2 AS pertenecetel2,
                        fk_oficina.oficina AS oficina,
                        fk_referido.referido AS referido,
                        casos.id AS idcaso,
                        fk_tipo_caso.tipocaso AS tipocaso,
                        citas.id AS idcita,
                        fk_status_cita.statuscita AS statuscita,
                        citas.razon AS razoncita,
                        auth_asignado.fullname AS asignado,
                        califica.califica AS califica,
                        DATE_FORMAT(casos.fecha, '%m/%d/%Y') AS fecha,
                        auth_creador.fullname AS creador,
                        tipo_caso_subclase.subclase AS subclase,
                        califica.colorcalifica,
                        casos.motivo_califica,
                        fk_status_cita.colorstatuscita AS colorstatuscita
                    FROM casos
                    LEFT JOIN clientes ON clientes.id = casos.idcliente 
                    LEFT JOIN citas ON citas.caso = casos.id 
                    LEFT JOIN fk_status_cita ON citas.status=fk_status_cita.id 
                    LEFT JOIN auth AS auth_creador ON auth_creador.id=clientes.creador 
                    LEFT JOIN auth AS auth_asignado ON auth_asignado.id=casos.asignado 
                    LEFT JOIN fk_oficina ON fk_oficina.id=clientes.oficina 
                    LEFT JOIN fk_referido ON fk_referido.id=clientes.referido 
                    LEFT JOIN fk_tipo_caso ON casos.tipo=fk_tipo_caso.id 
                    LEFT JOIN tipo_caso_subclase ON casos.subclase=tipo_caso_subclase.id
                    LEFT JOIN califica ON casos.califica=califica.id
                    WHERE casos.capturadedatos = 1
                    ORDER BY casos.fecha DESC, casos.id DESC, citas.id DESC;
                   """)
    leads = cursor.fetchall()
    leads = [{"idcliente": a[0], "nombrec": a[1], "telefonoUno": a[2], "telefonoDos": a[3], "pertenece": a[4], "oficina": a[5], "referido": a[6], "idcaso": a[7], "tipocaso": a[8], "idcita": a[9], "statuscita": a[10], "razoncita": a[11], "asignado": a[12], "califica": a[13], "fecha": a[14], "creador": a[15], "subclase": a[16], "colorcalifica": a[17], "motivo_califica": a[18], "colorstatuscita": a[19]} for a in leads]
    
    cursor.execute("SELECT * from fk_oficina ORDER BY oficina;")
    oficina = cursor.fetchall()
    oficina = [{"id": r[0], "oficina": r[1]} for r in oficina]
    
    cursor.execute("SELECT * from fk_referido ORDER BY referido;")
    referencia = cursor.fetchall()
    referencia = [{"id": r[0], "referencia": r[1]} for r in referencia]
    
    cursor.execute("SELECT id, tipocaso FROM fk_tipo_caso WHERE id != 0 ORDER BY tipocaso;")
    tipo_caso = cursor.fetchall()
    tipo_caso = [{"id": r[0], "tipocaso": r[1]} for r in tipo_caso]
    
    cursor.execute("SELECT * from fk_status_cita ORDER BY statuscita;")
    status_cita = cursor.fetchall()
    status_cita = [{"id": r[0], "statuscita": r[1]} for r in status_cita]
    
    cursor.execute("SELECT id, fullname FROM auth WHERE clasificacion = 'asesor' ORDER BY fullname;")
    asesores = cursor.fetchall()
    asesores = [{"id": r[0], "asesor": r[1]} for r in asesores]
    
    cursor.execute("SELECT id, fullname FROM auth ORDER BY fullname;")
    creadores = cursor.fetchall()
    creadores = [{"id": r[0], "creador": r[1]} for r in creadores]
    
    cursor.execute("SELECT id, califica, colorcalifica FROM califica;")
    califica = cursor.fetchall()
    califica = [{"id": r[0], "califica": r[1], "colorcalifica": r[2]} for r in califica]
    
    cursor.execute(f"SELECT rol FROM auth WHERE id = {current_user.id}")
    rol = cursor.fetchone()
    
    cursor.close()
    resultados = {
        "leads": leads
    }
    
    selects = {
        "oficina": oficina,
        "referencia": referencia,
        "tipo_caso": tipo_caso,
        "status_cita": status_cita,
        "asesores": asesores,
        "creadores": creadores,
        "califica": califica
    }
    return jsonify({"resultados": resultados, "selects": selects, "rol": rol})

@app.route("/gestion-de-leads/eliminar", methods=["POST"])
@login_required
def eliminarLead():
    data = request.json
    idlead = data.get("idlead")
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM citas WHERE cliente = %s", (idlead,))
    cursor.execute("DELETE FROM pagos_independientes WHERE cliente = %s", (idlead,))
    cursor.execute("DELETE FROM casos WHERE idcliente = %s", (idlead,))
    cursor.execute("DELETE FROM clientes WHERE id = %s", (idlead,))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Lead eliminado correctamente."})

@app.route("/gestion-de-clientes", methods=["GET"])
@login_required
def gestionDeClientes():
    cursor = mysql.connection.cursor()
    #cursor.execute("SELECT clientes.id AS id, clientes.nombre, clientes.telefono1 AS telefonoUno, clientes.telefono2 AS telefonoDos, clientes.pertenecetel2, TRIM(CONCAT(clientes.domicilio, ' ', clientes.ciudad, ' ', clientes.cp)) AS domicilio, fk_oficina.oficina AS oficina, fk_referido.referido AS referido, DATE_FORMAT(clientes.registrado, '%m/%d/%Y') AS fecha FROM clientes LEFT JOIN fk_oficina ON fk_oficina.id = clientes.oficina LEFT JOIN fk_referido ON fk_referido.id = clientes.referido WHERE clientes.clasificacion = 'CLIENTE' GROUP BY clientes.id ORDER BY clientes.registrado DESC;")
    cursor.execute("SELECT clientes.id AS id, clientes.nombre, clientes.telefono1 AS telefonoUno, clientes.telefono2 AS telefonoDos, clientes.pertenecetel2, TRIM(CONCAT(clientes.domicilio, ' ', clientes.ciudad, ' ', clientes.cp)) AS domicilio, fk_oficina.oficina AS oficina, fk_referido.referido AS referido, DATE_FORMAT(clientes.registrado, '%m/%d/%Y') AS fecha, (SELECT GROUP_CONCAT(fk_status_caso.statuscaso SEPARATOR ' ') FROM casos JOIN fk_status_caso ON casos.status = fk_status_caso.id WHERE casos.idcliente = clientes.id) AS status FROM clientes LEFT JOIN fk_oficina ON fk_oficina.id = clientes.oficina LEFT JOIN fk_referido ON fk_referido.id = clientes.referido WHERE clientes.clasificacion = 'CLIENTE' GROUP BY clientes.id ORDER BY clientes.registrado DESC;")
    leads = cursor.fetchall()
    leads = [{"id": a[0], "nombre": a[1], "telefonoUno": a[2], "telefonoDos": a[3], "pertenecetel2": a[4], "domicilio": a[5], "oficina": a[6], "referido": a[7], "fecha": a[8], "status": a[9]} for a in leads]
    
    #cursor.execute("SELECT casos.id AS idcaso, idcliente, fk_estado_caso.estadocaso AS estado FROM casos JOIN fk_estado_caso ON casos.estado=fk_estado_caso.id")
    #cursor.execute("SELECT casos.id AS idcaso, idcliente, fk_status_caso.statuscaso AS status, fk_status_caso.colorstatuscaso FROM citas JOIN casos ON citas.caso=casos.id JOIN fk_status_caso ON casos.status=fk_status_caso.id WHERE casos.capturadedatos = 0")
    cursor.execute("SELECT casos.id AS idcaso, idcliente, fk_status_caso.statuscaso AS status, fk_status_caso.colorstatuscaso FROM casos JOIN fk_status_caso ON casos.status=fk_status_caso.id WHERE casos.capturadedatos = 0 ORDER BY idcaso DESC;")
    casos = cursor.fetchall()
    casos = [{"idcaso": a[0], "idcliente": a[1], "status": a[2], "colorstatuscaso": a[3]} for a in casos]
    
    cursor.execute("SELECT * from fk_oficina ORDER BY oficina;")
    oficina = cursor.fetchall()
    oficina = [{"id": r[0], "oficina": r[1]} for r in oficina]
    
    cursor.execute("SELECT * from fk_referido ORDER BY referido;")
    referencia = cursor.fetchall()
    referencia = [{"id": r[0], "referencia": r[1]} for r in referencia]
    
    cursor.execute("SELECT * from fk_status_caso ORDER BY statuscaso;")
    statuscaso = cursor.fetchall()
    statuscaso = [{"id": r[0], "statuscaso": r[1]} for r in statuscaso]
    
    cursor.close()
    resultados = {
        "leads": leads,
        "casos": casos
    }
    
    selects = {
        "oficina": oficina,
        "referencia": referencia,
        "statuscaso": statuscaso,
    }
    return jsonify({"resultados": resultados, "selects": selects})

@app.route("/captura-de-datos/guardar", methods=["POST"])
@login_required
def opcionesAgregar():
    nombre = request.form.get("nombre").strip().upper()
    tel1 = request.form.get("telefonoUno")
    telefono1 = ''
    for n in tel1:
        if n.isdigit():
            telefono1 = telefono1+n
    tel2 = request.form.get("telefonoDos")
    telefono2 = ''
    for n in tel2:
        if n.isdigit():
            telefono2 = telefono2+n
    razonCita = request.form.get("razonCita")
    oficina = request.form.get("selectedOficina")
    tipoCaso = request.form.get("selectedTipoCaso")
    tipoCita = request.form.get("selectedTipoCita")
    referido = request.form.get("selectedReferido")
    fecha = request.form.get("selectedDate")
    hora = request.form.get("selectedHour")
    asignado = request.form.get("selectedAsesor")
    pertenece = request.form.get("pertenece")
    subclase = request.form.get("selectedSubclase")
    archivos = request.files.getlist("files")
    
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT now()")
    registrado = cursor.fetchone()[0]
    cursor.execute("INSERT INTO clientes (nombre, telefono1, telefono2, pertenecetel2, referido, oficina, clasificacion, registrado, creador) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (nombre, telefono1, telefono2, pertenece.strip().upper(), referido, oficina, "LEAD", registrado, current_user.id))
    cursor.execute("SELECT id FROM clientes WHERE registrado = %s", (registrado,))
    idcliente = cursor.fetchone()[0]
    
    n_caso = None
    if tipoCaso:
        cursor.execute("INSERT INTO beneficiarios (nombre, telefono1, telefono2, pertenecetel2, domicilio, ciudad, cp, email) VALUES ('','','','','','','','');")
        n_beneficiario = cursor.lastrowid
        cursor.execute("INSERT INTO casos (idcliente, idbeneficiario, fecha, tipo, status, creador, asignado, capturadedatos, califica, subclase) VALUES (%s, %s, %s, %s, 1, %s, %s, 1, 3, %s)", (idcliente, n_beneficiario, registrado, tipoCaso, current_user.id, asignado, subclase))
        cursor.execute("SELECT id FROM casos WHERE fecha = %s", (registrado,))
        n_caso = cursor.fetchone()[0]
        
    if fecha:
        cursor.execute("INSERT INTO citas (cliente, caso, fecha, hora, tipo, status, razon, creador, asignado) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (idcliente, n_caso, fecha, hora, tipoCita, 1, razonCita.strip().upper(), current_user.id, asignado))
        cursor.execute("SELECT id FROM citas WHERE cliente = %s AND caso = %s ORDER BY id DESC LIMIT 1", (idcliente, n_caso))
        idcita = cursor.fetchone()[0]
    
    for archivo in archivos:
        if archivo:
            #filename = secure_filename(archivo.filename)
            filename = archivo.filename
            mime_type = archivo.content_type
            archivo_blob = archivo.read()
            cursor.execute("INSERT INTO documentos (cliente, caso, nombre, documento, tipo, clasificacion, fecha, creador) VALUES (%s, %s, %s, %s, %s, 0, now(), %s)", (idcliente, n_caso, filename, archivo_blob, mime_type, current_user.id))
    cursor.execute("INSERT INTO log (cliente, caso, cita, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, %s, now())", (idcliente, n_caso, idcita, "Captura de datos de nuevo cliente.", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Datos de "+nombre+" registrados con éxito.", "status": 200})

@app.route("/consultas/nueva", methods=["POST"])
@login_required
def nuevaConsulta():
    idcliente = request.form.get("idcliente")
    nombre = request.form.get("nombre")
    razonCita = request.form.get("razonCita")
    tipoCaso = request.form.get("selectedTipoCaso")
    tipoCita = request.form.get("selectedTipoCita")
    fecha = request.form.get("selectedDate")
    hora = request.form.get("selectedHour")
    asignado = request.form.get("selectedAsesor")
    subclase = request.form.get("selectedSubclase")
    archivos = request.files.getlist("files")
    
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT now()")
    registrado = cursor.fetchone()[0]
    
    n_caso = None
    if tipoCaso:
        cursor.execute("INSERT INTO beneficiarios (nombre, telefono1, telefono2, pertenecetel2, domicilio, ciudad, cp, email) VALUES ('','','','','','','','');")
        n_beneficiario = cursor.lastrowid
        cursor.execute("INSERT INTO casos (idcliente, idbeneficiario, fecha, tipo, status, creador, asignado, capturadedatos, califica, subclase) VALUES (%s, %s, %s, %s, 1, %s, %s, 1, 3, %s)", (idcliente, n_beneficiario, registrado, tipoCaso, current_user.id, asignado, subclase))
        cursor.execute("SELECT id FROM casos WHERE fecha = %s", (registrado,))
        n_caso = cursor.fetchone()[0]
        
    if fecha:
        cursor.execute("INSERT INTO citas (cliente, caso, fecha, hora, tipo, status, razon, creador, asignado) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (idcliente, n_caso, fecha, hora, tipoCita, 1, razonCita.strip().upper(), current_user.id, asignado))
        cursor.execute("SELECT id FROM citas WHERE cliente = %s AND caso = %s ORDER BY id DESC LIMIT 1", (idcliente, n_caso))
        idcita = cursor.fetchone()[0]
        cursor.execute("INSERT INTO log (cliente, caso, cita, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, %s, now())", (idcliente, n_caso, idcita, "Registro de nueva consulta.", current_user.id))
    
    for archivo in archivos:
        if archivo:
            #filename = secure_filename(archivo.filename)
            filename = archivo.filename
            mime_type = archivo.content_type
            archivo_blob = archivo.read()
            cursor.execute("INSERT INTO documentos (cliente, caso, nombre, documento, tipo, clasificacion, fecha, creador) VALUES (%s, %s, %s, %s, %s, 0, now(), %s)", (idcliente, n_caso, filename, archivo_blob, mime_type, current_user.id))
    
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Datos de "+nombre+" registrados con éxito.", "status": 200})

@app.route("/busqueda/perfil", methods=["GET"])
@login_required
def busqueda():
    query = request.args.get('query').strip().upper()
    query_like = f"%{query}%"
    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT 
            clientes.id AS id,
            clientes.nombre AS nombre,
            clientes.telefono1 AS telefono,
            GROUP_CONCAT(DISTINCT CASE WHEN casos.capturadedatos = 0 THEN casos.id END ORDER BY casos.id SEPARATOR ', ') AS casos,
            GROUP_CONCAT(DISTINCT CASE WHEN casos.capturadedatos = 1 THEN casos.id END ORDER BY casos.id SEPARATOR ', ') AS consultas,
            GROUP_CONCAT(DISTINCT beneficiarios.nombre ORDER BY beneficiarios.nombre SEPARATOR ', ') AS beneficiarios,
            GROUP_CONCAT(DISTINCT beneficiarios.telefono1 ORDER BY beneficiarios.telefono1 SEPARATOR ', ') AS telefonos_beneficiarios,
            clientes.clasificacion
        FROM clientes
        LEFT JOIN casos ON casos.idcliente = clientes.id
        LEFT JOIN beneficiarios ON beneficiarios.id = casos.idbeneficiario
        GROUP BY clientes.id
        HAVING 
            clientes.nombre LIKE %s OR
            telefono LIKE %s OR
            beneficiarios LIKE %s
        ORDER BY clientes.nombre ASC
    """, (query_like, query_like, query_like))
    busqueda = cursor.fetchall()
    busqueda = [{"id": a[0], "nombre": a[1], "telefono": a[2], "casos": a[3], "consultas": a[4], "beneficiarios": a[5], "telefonos_beneficiarios": a[6],"clasificacion": a[7]} for a in busqueda]
    cursor.close()
    resultados = {
        "busqueda": busqueda
    }
    return jsonify(resultados)

@app.route("/busqueda/caso", methods=["GET"])
@login_required
def busquedaCaso():
    query = request.args.get('query', '').strip()
    if query:
        cursor = mysql.connection.cursor()
        cursor.execute("""
            SELECT 
                clientes.id AS id,
                clientes.nombre AS nombre,
                clientes.telefono1 AS telefono,
                GROUP_CONCAT(DISTINCT CASE WHEN casos.capturadedatos = 0 THEN casos.id END ORDER BY casos.id SEPARATOR ', ') AS casos,
                GROUP_CONCAT(DISTINCT CASE WHEN casos.capturadedatos = 1 THEN casos.id END ORDER BY casos.id SEPARATOR ', ') AS consultas,
                GROUP_CONCAT(DISTINCT beneficiarios.nombre ORDER BY beneficiarios.nombre SEPARATOR ', ') AS beneficiarios,
                GROUP_CONCAT(DISTINCT beneficiarios.telefono1 ORDER BY beneficiarios.telefono1 SEPARATOR ', ') AS telefonos_beneficiarios,
                clientes.clasificacion
            FROM clientes
            LEFT JOIN casos ON casos.idcliente = clientes.id
            LEFT JOIN beneficiarios ON beneficiarios.id = casos.idbeneficiario
            WHERE casos.id = %s
            GROUP BY clientes.id
            ORDER BY clientes.nombre ASC
        """, (query,))
        busqueda = cursor.fetchall()
        busqueda = [{"id": a[0], "nombre": a[1], "telefono": a[2], "casos": a[3], "consultas": a[4], "beneficiarios": a[5], "telefonos_beneficiarios": a[6],"clasificacion": a[7]} for a in busqueda]
        cursor.close()
        resultados = {
            "busqueda": busqueda
        }
    else:
        resultados = None
    return jsonify(resultados)

@app.route("/perfil/<int:id>", methods=["GET"])
@login_required
def perfil(id):
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT clientes.id, nombre, telefono1, telefono2, pertenecetel2, telefono3, pertenecetel3, domicilio, ciudad, cp, email, clientes.clasificacion, DATE_FORMAT(registrado, '%m/%d/%Y'), creador, auth.fullname AS fullname FROM clientes JOIN auth ON clientes.creador = auth.id WHERE clientes.id = {id};")
    datos = cursor.fetchall()
    datos = [{"id": a[0], "nombre": a[1], "telefono1": a[2], "telefono2": a[3], "pertenecetel2": a[4], "telefono3": a[5], "pertenecetel3": a[6], "domicilio": a[7], "ciudad": a[8], "cp": a[9], "email": a[10], "clasificacion": a[11], "registrado": a[12], "creador": a[13], "fullname": a[14]} for a in datos]
    
    #cursor.execute(f"SELECT casos.id, idbeneficiario, beneficiarios.nombre, beneficiarios.telefono1, beneficiarios.telefono2, beneficiarios.pertenecetel2, DATE_FORMAT(fecha, '%m/%d/%Y • %h:%i') AS fecha, caso, fk_tipo_caso.tipocaso, fk_status_caso.statuscaso, fk_estado_caso.estadocaso, auth.fullname AS asignado FROM casos JOIN beneficiarios ON casos.idbeneficiario=beneficiarios.id JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo JOIN fk_status_caso ON casos.status=fk_status_caso.id JOIN fk_estado_caso ON fk_estado_caso.id=casos.estado JOIN auth ON casos.asignado = auth.id WHERE casos.idcliente = {id} AND casos.capturadedatos = 0;")
    #cursor.execute(f"SELECT casos.id AS idcaso, beneficiarios.id AS idbeneficiario, beneficiarios.nombre AS nombreb, beneficiarios.telefono1, beneficiarios.telefono2, beneficiarios.pertenecetel2, DATE_FORMAT(casos.fecha, '%m/%d/%Y • %h:%i %p') AS fechacaso, casos.caso, fk_tipo_caso.tipocaso, fk_status_caso.statuscaso, fk_status_caso.colorstatuscaso, auth.fullname AS asignado, CONCAT(DATE_FORMAT(citas.fecha, '%m/%d/%Y'),' a las ', DATE_FORMAT(citas.hora, '%H:%i %p')) AS citasfecha, fk_tipo_cita.tipocita AS tipocita, fk_status_cita.statuscita AS statuscita, fk_status_cita.colorstatuscita AS colorstatuscita, tipo_caso_subclase.subclase AS subclase, fk_tipo_cita.colortipocita FROM citas JOIN casos ON casos.id=citas.caso JOIN beneficiarios ON beneficiarios.id=casos.idbeneficiario JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo JOIN fk_status_caso ON casos.status=fk_status_caso.id JOIN auth ON casos.asignado = auth.id JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo JOIN fk_status_cita ON fk_status_cita.id=citas.status JOIN tipo_caso_subclase ON tipo_caso_subclase.id=casos.subclase WHERE citas.cliente = {id} AND casos.capturadedatos = 0 GROUP BY casos.id ORDER BY casos.fecha DESC;")
    cursor.execute(f"SELECT casos.id, beneficiarios.nombre, DATE_FORMAT(casos.fecha, '%m/%d/%Y • %h:%i %p'), casos.caso, fk_tipo_caso.tipocaso, fk_status_caso.statuscaso, fk_status_caso.colorstatuscaso, CONCAT(DATE_FORMAT(citas.fecha, '%m/%d/%Y'),' a las ', DATE_FORMAT(citas.hora, '%H:%i %p')), fk_tipo_cita.tipocita, fk_status_cita.statuscita, fk_status_cita.colorstatuscita, tipo_caso_subclase.subclase, fk_tipo_cita.colortipocita FROM casos LEFT JOIN (SELECT * FROM citas c1 WHERE NOT EXISTS (SELECT 1 FROM citas c2 WHERE c2.caso = c1.caso AND CONCAT(c2.fecha, ' ', c2.hora) > CONCAT(c1.fecha, ' ', c1.hora))) AS citas ON casos.id = citas.caso LEFT JOIN beneficiarios ON beneficiarios.id=casos.idbeneficiario JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo JOIN fk_status_caso ON casos.status=fk_status_caso.id LEFT JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo LEFT JOIN fk_status_cita ON fk_status_cita.id=citas.status JOIN tipo_caso_subclase ON tipo_caso_subclase.id=casos.subclase WHERE casos.idcliente = {id} AND casos.capturadedatos = 0 GROUP BY casos.id ORDER BY casos.fecha DESC;")
    casos = cursor.fetchall()
    casos = [{"idcaso": a[0], "nombreb": a[1], "fechacaso": a[2], "caso": a[3], "tipocaso": a[4], "statuscaso": a[5], "colorstatuscaso": a[6], "citasfecha": a[7], "tipocita": a[8], "statuscita": a[9], "colorstatuscita": a[10], "subclase":a[11], "colortipocita": a[12]} for a in casos]
    
    #cursor.execute(f"SELECT casos.id AS idcaso, DATE_FORMAT(casos.fecha, '%m/%d/%Y • %h:%i %p') as fechacaso, fk_tipo_caso.tipocaso, auth.fullname AS asignado, CONCAT(DATE_FORMAT(citas.fecha, '%m/%d/%Y'),' a las ', DATE_FORMAT(citas.hora, '%h:%i %p')) AS citasfecha, fk_tipo_cita.tipocita AS tipocita, fk_status_cita.statuscita AS statuscita, casos.caso AS nombrecaso, tipo_caso_subclase.subclase AS subclase, califica.califica, califica.colorcalifica, fk_tipo_cita.colortipocita FROM citas JOIN casos ON citas.caso=casos.id JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo JOIN auth ON casos.asignado = auth.id JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo JOIN fk_status_cita ON fk_status_cita.id=citas.status JOIN tipo_caso_subclase ON tipo_caso_subclase.id=casos.subclase JOIN califica ON casos.califica = califica.id WHERE casos.idcliente = {id} AND casos.capturadedatos = 1 GROUP BY casos.id ORDER BY casos.fecha DESC;")
    cursor.execute(f"SELECT casos.id AS idcaso, DATE_FORMAT(casos.fecha, '%m/%d/%Y • %h:%i %p') as fechacaso, fk_tipo_caso.tipocaso, auth.fullname AS asignado, CONCAT(DATE_FORMAT(citas.fecha, '%m/%d/%Y'),' a las ', DATE_FORMAT(citas.hora, '%h:%i %p')) AS citasfecha, fk_tipo_cita.tipocita AS tipocita, fk_status_cita.statuscita AS statuscita, casos.caso AS nombrecaso, tipo_caso_subclase.subclase AS subclase, califica.califica, califica.colorcalifica, fk_tipo_cita.colortipocita FROM casos LEFT JOIN citas ON citas.caso=casos.id LEFT JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo LEFT JOIN auth ON casos.asignado = auth.id LEFT JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo LEFT JOIN fk_status_cita ON fk_status_cita.id=citas.status LEFT JOIN tipo_caso_subclase ON tipo_caso_subclase.id=casos.subclase LEFT JOIN califica ON casos.califica = califica.id WHERE casos.idcliente = {id} AND casos.capturadedatos = 1 GROUP BY casos.id ORDER BY casos.fecha DESC;")
    casos_sinabrir = cursor.fetchall()
    casos_sinabrir = [{"idcaso": a[0], "fechacaso": a[1], "tipocaso":a[2], "asignado": a[3], "citasfecha": a[4], "tipocita": a[5], "statuscita": a[6], "nombrecaso": a[7], "subclase": a[8], "califica": a[9], "colorcalifica": a[10], "colortipocita": a[11]} for a in casos_sinabrir]
    
    cursor.execute(f"SELECT rol FROM auth WHERE id = {current_user.id}")
    rol = cursor.fetchone()
    
    cursor.execute("SELECT clientes_notas.id, cliente, nota, DATE_FORMAT(fecha, '%%m/%%d/%%Y • %%h:%%i %%p'), auth.fullname, deleted FROM clientes_notas JOIN auth ON auth.id = clientes_notas.creador WHERE cliente = %s ORDER BY fecha DESC;", (id,))
    notas = cursor.fetchall()
    notas = [{"id": n[0], "cliente": n[1], "nota": n[2], "fecha": n[3], "creador": n[4], "deleted": n[5]} for n in notas]
    
    cursor.close()
    perfil = {
        "datos": datos,
        "casos": casos,
        "rol": rol,
        "casos_sinabrir": casos_sinabrir,
        "notas": notas
    }
    return jsonify(perfil);

@app.route("/caso/<int:id>", methods=["GET"])
@login_required
def obtener_caso(id):
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT casos.id AS idcaso, idbeneficiario, beneficiarios.nombre AS nombreb, beneficiarios.telefono1, beneficiarios.telefono2, beneficiarios.pertenecetel2, casos.idcliente, clientes.nombre AS nombrec, DATE_FORMAT(casos.fecha, '%m/%d/%Y') as fechacaso, casos.caso, fk_tipo_caso.tipocaso, fk_status_caso.statuscaso, casos.asignado AS idasignado, auth.fullname AS asignado, casos.tipo AS idtipocaso, casos.status AS idstatuscaso, beneficiarios.domicilio, beneficiarios.ciudad, beneficiarios.cp, beneficiarios.email, beneficiarios.relacion, casos.capturadedatos, casos.califica, casos.subclase AS idsubclase, tipo_caso_subclase.subclase AS subclase, casos.motivo_califica, califica.colorcalifica AS colorcalifica FROM casos JOIN beneficiarios ON casos.idbeneficiario=beneficiarios.id JOIN clientes ON casos.idcliente=clientes.id JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo JOIN fk_status_caso ON casos.status=fk_status_caso.id JOIN auth ON casos.asignado = auth.id JOIN tipo_caso_subclase ON tipo_caso_subclase.id=casos.subclase JOIN califica ON califica.id = casos.califica WHERE casos.id = {id};")
    caso = cursor.fetchone()
    caso = {"idcaso": caso[0], "idbeneficiario": caso[1], "nombreb": caso[2], "telefono1": caso[3], "telefono2": caso[4], "pertenecetel2": caso[5], "idcliente": caso[6], "nombrec": caso[7], "fechacaso": caso[8], "caso": caso[9], "tipocaso": caso[10], "statuscaso": caso[11], "idasignado": caso[12], "asignado": caso[13], "idtipocaso": caso[14], "idstatuscaso": caso[15], "domicilio": caso[16], "ciudad": caso[17], "cp": caso[18], "email": caso[19], "relacion": caso[20], "capturadedatos": caso[21], "idcalifica": caso[22], "idsubclase": caso[23], "subclase": caso[24], "motivo_califica": caso[25], "colorcalifica": caso[26]}
    
    cursor.execute(f"SELECT citas.id, CONCAT(DATE_FORMAT(citas.fecha, '%m/%d/%Y'), ' a las ',  DATE_FORMAT(citas.hora, '%h:%i %p')) AS fechacita, citas.razon, citas.resultado, auth.fullname AS asignado, auth.id AS idasignado, citas.tipo AS idtipocita, fk_tipo_cita.tipocita AS tipocita, citas.status AS idstatuscita, fk_status_cita.statuscita AS statuscita, fk_status_cita.colorstatuscita, citas.motivo_cancelacion, CONCAT(citas.fecha) AS citafechaoriginal, CONCAT(citas.hora) AS citahoraoriginal FROM citas JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo JOIN fk_status_cita ON fk_status_cita.id=citas.status JOIN auth ON citas.asignado=auth.id WHERE citas.caso = {id} ORDER BY citas.fecha DESC, citas.hora DESC;")
    citas = cursor.fetchall()
    citas = [{"idcita": a[0], "fechacita": a[1], "razon": a[2], "resultado": a[3], "asignado": a[4], "idasignado": a[5], "idtipocita": a[6], "tipocita": a[7], "idstatuscita": a[8], "statuscita": a[9], "colorstatuscita": a[10], "motivo_cancelacion": a[11], "citafechaoriginal": a[12], "citahoraoriginal": a[13]} for a in citas]
    
    cursor.execute(f"SELECT rol FROM auth WHERE id = {current_user.id}")
    rol = cursor.fetchone()
    
    cursor.execute("SELECT id AS idasesor, fullname AS asesor FROM auth WHERE clasificacion = 'asesor';")
    asesores = cursor.fetchall()
    asesores = [{"idasesor": a[0], "asesor": a[1]} for a in asesores]
    
    cursor.execute("SELECT id AS idstatus, statuscaso AS status FROM fk_status_caso;")
    status = cursor.fetchall()
    status = [{"idstatus": a[0], "status": a[1]} for a in status]
    
    cursor.execute("SELECT tipo_caso_subclase.id AS idsubclase, idtipo AS idtipocaso, fk_tipo_caso.tipocaso AS tipocaso, subclase FROM tipo_caso_subclase JOIN fk_tipo_caso ON fk_tipo_caso.id=tipo_caso_subclase.idtipo WHERE tipo_caso_subclase.id != 0 ORDER BY subclase;")
    subclase = cursor.fetchall()
    subclase = [{"idsubclase": r[0], "idtipocaso": r[1], "tipocaso": r[2], "subclase": r[3]} for r in subclase]
    
    cursor.execute("SELECT id AS idstatuscita, statuscita FROM fk_status_cita;")
    statuscita = cursor.fetchall()
    statuscita = [{"idstatuscita": a[0], "statuscita": a[1]} for a in statuscita]
    
    cursor.execute("SELECT id AS idtipocita, tipocita FROM fk_tipo_cita;")
    tipocita = cursor.fetchall()
    tipocita = [{"idtipocita": a[0], "tipocita": a[1]} for a in tipocita]
    
    cursor.execute("SELECT id, tipocaso FROM fk_tipo_caso WHERE id != 0;")
    tipos = cursor.fetchall()
    tipos = [{"idtipo": a[0], "tipo": a[1]} for a in tipos]
    
    cursor.execute("SELECT id AS idcalifica, califica FROM califica;")
    califica = cursor.fetchall()
    califica = [{"idcalifica": a[0], "califica": a[1]} for a in califica]
    
    #cursor.execute(f"SELECT casos_actualizaciones.id, DATE_FORMAT(creado, '%m/%d/%Y • %h:%i %p') AS creado, actualizacion, auth.fullname, esresultado FROM casos_actualizaciones JOIN auth ON casos_actualizaciones.agente=auth.id WHERE casos_actualizaciones.idcaso = {id} ORDER BY casos_actualizaciones.creado DESC;")
    cursor.execute(f"""
    SELECT id, creado_formateado, actualizacion, fullname, esresultado, deleted
FROM (
    SELECT * FROM (
        SELECT 
            ca.id, 
            ca.creado,
            DATE_FORMAT(ca.creado, '%m/%d/%Y • %h:%i %p') AS creado_formateado, 
            ca.actualizacion, 
            a.fullname, 
            ca.esresultado,
            ca.deleted
        FROM casos_actualizaciones ca
        JOIN auth a ON ca.agente = a.id 
        WHERE ca.idcaso = {id} AND ca.esresultado = 1
        ORDER BY ca.creado DESC
        LIMIT 1
    ) AS sub1

    UNION ALL

    SELECT 
        ca.id, 
        ca.creado,
        DATE_FORMAT(ca.creado, '%m/%d/%Y • %h:%i %p') AS creado_formateado, 
        ca.actualizacion, 
        a.fullname, 
        ca.esresultado,
        ca.deleted
    FROM casos_actualizaciones ca
    JOIN auth a ON ca.agente = a.id 
    WHERE ca.idcaso = {id} AND (ca.esresultado = 0 OR ca.esresultado = 2)
) AS final
ORDER BY creado DESC;
    """)
    actualizaciones = cursor.fetchall()
    actualizaciones = [{"id": a[0], "creado": a[1], "actualizacion": a[2], "agente": a[3], "esresultado": a[4], "deleted": a[5]} for a in actualizaciones]
    
    cursor.execute(f"SELECT documentos.id AS iddoc, nombre, CASE WHEN documentos.clasificacion IS NULL OR documentos.clasificacion = '' THEN '* Sin clasificación' ELSE documentos.clasificacion END AS clasificacion, DATE_FORMAT(fecha, ' el %m/%d/%Y a las %h:%i %p') AS fecha, auth.fullname AS creador FROM documentos JOIN auth ON documentos.creador = auth.id WHERE documentos.caso = {id} ORDER BY documentos.fecha DESC;")
    documentos = cursor.fetchall()
    documentos = [{"iddoc": a[0], "nombre": a[1], "clasificacion": a[2], "fecha": a[3], "creador": a[4]} for a in documentos]
    
    cursor.execute("SELECT id, clasificacion FROM documentos_clasificaciones ORDER BY id;")
    documentos_clasificaciones = cursor.fetchall()
    documentos_clasificaciones = [{"id": a[0], "clasificacion": a[1]} for a in documentos_clasificaciones]
    
    cursor.execute("SELECT pagos.id, DATE_FORMAT(pagos.fecha, '%%m/%%d/%%Y'), pagos.monto, pagos_tipo.tipo, pagos.nombretipopago, pagos.numerotarjeta, pagos.tipo, pagos.pagado, pagos.metodo, pagos_metodo.metodo FROM pagos_control JOIN pagos ON pagos.control=pagos_control.id JOIN pagos_tipo ON pagos_tipo.id=pagos.tipo JOIN pagos_metodo ON pagos_metodo.id = pagos.metodo WHERE pagos_control.caso = %s AND (pagos.pagado = 1 OR pagos.pagado = 3) ORDER BY pagos.fecha;", (id,))
    pagos = cursor.fetchall()
    pagos = [{"id": a[0], "fecha": a[1], "monto": a[2], "tipo": a[3], "nombretipopago": a[4], "numerotarjeta": a[5], "idtipo": a[6], "pagado": a[7], "idmetodo": a[8], "metodo": a[9]} for a in pagos]
    total_monto = sum(pago['monto'] for pago in pagos)
    
    cursor.execute("SELECT pagos_control.id, cartasenviadas, pagos_estados.estado, valor, entrega, ncuota, cuota, pagos_control.estado FROM pagos_control JOIN pagos_estados ON pagos_control.estado = pagos_estados.id WHERE pagos_control.caso = %s", (id,))
    pagos_control = cursor.fetchone()
    if pagos_control:
        pagos_control = {"id": pagos_control[0], "cartasenviadas": pagos_control[1], "estado": pagos_control[2], "valor": pagos_control[3], "entrega": pagos_control[4], "ncuota": pagos_control[5], "cuota": pagos_control[6], "idestado": pagos_control[7]}
        deudatotal = int(pagos_control['valor']) - int(pagos_control['entrega']) - total_monto
        cursor.execute("SELECT SUM(monto), DATE_FORMAT((SELECT DATE_ADD(fecha, INTERVAL 1 MONTH) FROM pagos WHERE control = %s ORDER BY fecha DESC LIMIT 1), '%%m/%%d/%%Y') FROM pagos WHERE control = %s;", (pagos_control['id'], pagos_control['id']))
        resto = cursor.fetchone()
        saldo = (float(pagos_control['valor']) - float(pagos_control['entrega'])) - float(resto[0])
        if saldo > 0:
            saldo_restante = [{"id": pagos_control["id"], "saldo": saldo, "fecha": resto[1]}]
        else:
            saldo_restante = None
    else:
        deudatotal = None
        saldo_restante = None
    cursor.execute("SELECT pagos.id, DATE_FORMAT(pagos.fecha, '%%m/%%d/%%Y'), pagos.monto, pagos_tipo.tipo, pagos.nombretipopago, pagos.numerotarjeta, pagos.tipo FROM pagos_control JOIN pagos ON pagos.control=pagos_control.id JOIN pagos_tipo ON pagos_tipo.id=pagos.tipo WHERE pagos_control.caso = %s AND pagos.pagado = 0 ORDER BY pagos.fecha ASC", (id,))
    no_pagos = cursor.fetchall()
    no_pagos = [{"id": a[0], "fecha": a[1], "monto": a[2], "tipo": a[3], "nombretipopago": a[4], "numerotarjeta": a[5], "idtipo": a[6]} for a in no_pagos]
    
    cursor.execute("SELECT pagos.id, DATE_FORMAT(pagos.fecha, '%%m/%%d/%%Y'), pagos.monto, pagos_tipo.tipo, pagos.nombretipopago, pagos.numerotarjeta, pagos.tipo FROM pagos_control JOIN pagos ON pagos.control=pagos_control.id JOIN pagos_tipo ON pagos_tipo.id=pagos.tipo WHERE pagos_control.caso = %s AND pagos.pagado = 2 ORDER BY pagos.fecha ASC", (id,))
    pagos_unicos = cursor.fetchall()
    pagos_unicos = [{"id": a[0], "fecha": a[1], "monto": a[2], "tipo": a[3], "nombretipopago": a[4], "numerotarjeta": a[5], "idtipo": a[6]} for a in pagos_unicos]
    
    cursor.execute("SELECT id, estado, colorestado FROM pagos_estados ORDER BY estado;")
    pagos_estados = cursor.fetchall()
    pagos_estados = [{"id": a[0], "estado": a[1], "colorestado": a[2]} for a in pagos_estados]
    
    cursor.execute("SELECT id, tipo FROM pagos_tipo ORDER BY tipo;")
    pagos_tipos = cursor.fetchall()
    pagos_tipos = [{"id": a[0], "tipo": a[1]} for a in pagos_tipos]
    
    cursor.execute("SELECT id, metodo FROM pagos_metodo ORDER BY metodo;")
    pagos_metodos = cursor.fetchall()
    pagos_metodos = [{"id": a[0], "metodo": a[1]} for a in pagos_metodos]
    
    cursor.execute("SELECT pagos_independientes.id, DATE_FORMAT(pagos_independientes.fecha, '%%m/%%d/%%Y'), montoprevio, monto, montoprevio-monto AS balance, pagos_tipo.tipo, pagos_metodo.metodo, nombretipopago, numerotarjeta, concepto FROM pagos_independientes JOIN pagos_tipo ON pagos_tipo.id = pagos_independientes.tipo JOIN pagos_metodo ON pagos_metodo.id = pagos_independientes.metodo WHERE caso = %s AND entrega = 0 ORDER BY fecha DESC", (id,))
    pagos_independientes = cursor.fetchall()
    pagos_independientes = [{"id": a[0], "fecha": a[1], "montoprevio": a[2], "monto": a[3], "balance": a[4], "tipo": a[5], "metodo": a[6], "nombretipopago": a[7], "numerotarjeta": a[8], "concepto": a[9]} for a in pagos_independientes]
    
    cursor.execute("SELECT id FROM pagos_independientes WHERE caso = %s AND entrega = 1", (id,))
    recibo_entrega = cursor.fetchone()
    if recibo_entrega:
        recibo_entrega = recibo_entrega[0]
    else:
        recibo_entrega = None
        
    cursor.execute("SELECT log.id, movimiento, DATE_FORMAT(fecha, '%%m/%%d/%%Y • %%h:%%m %%p'), otro, auth.fullname FROM log JOIN auth ON auth.id = log.agente WHERE caso = %s ORDER BY fecha DESC", (id,))
    log = cursor.fetchall()
    log = [{"id": a[0], "movimiento": a[1], "fecha": a[2], "otro": a[3], "agente": a[4]} for a in log]
    
    resultados = {
        "caso": caso,
        "rol": rol,
        "asesores": asesores,
        "status": status,
        "tipos": tipos,
        "actualizaciones": actualizaciones,
        "documentos": documentos,
        "documentos_clasificaciones": documentos_clasificaciones,
        "statuscita": statuscita,
        "tipocita": tipocita,
        "citas": citas,
        "califica": califica,
        "subclase": subclase,
        "pagos_control": pagos_control,
        "pagos": pagos,
        "pagos_estados": pagos_estados,
        "deudatotal": deudatotal,
        "no_pagos": no_pagos,
        "saldo_restante": saldo_restante,
        "pagos_tipos": pagos_tipos,
        "pagos_metodos": pagos_metodos,
        "pagos_unicos": pagos_unicos,
        "pagos_independientes": pagos_independientes,
        "recibo_entrega": recibo_entrega,
        "log": log
    }
    cursor.close()
    return jsonify(resultados)
    
@app.route("/perfil/guardar-datos", methods=["POST"])
@login_required
def perfil_guardar_datos():
    datos = request.json
    idcliente = datos.get("id")
    nombre = datos.get("nombre").strip().upper()
    tel1 = datos.get("telefono1")
    telefono1 = ''
    for n in tel1:
        if n.isdigit():
            telefono1 = telefono1+n
    tel2 = datos.get("telefono2")
    telefono2 = ''
    for n in tel2:
        if n.isdigit():
            telefono2 = telefono2+n
    tel3 = datos.get("telefono3")
    telefono3 = ''
    if tel3:
        for n in tel3:
            if n.isdigit():
                telefono3 = telefono3+n
    pertenecetel3 = datos.get("pertenecetel3")
    if not pertenecetel3:
        pertenecetel3 = ''
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE clientes SET nombre = %s, telefono1 = %s, telefono2 = %s, pertenecetel2 = %s, telefono3 = %s, pertenecetel3 = %s, domicilio = %s, ciudad = %s, cp = %s, email = %s WHERE id = %s", (nombre, telefono1, telefono2, datos.get("pertenecetel2").strip().upper(), telefono3, pertenecetel3.strip().upper() , datos.get("domicilio").strip().upper(), datos.get("ciudad").strip().upper(), datos.get("cp").strip().upper(), datos.get("email").strip().upper(), idcliente))
    cursor.execute("INSERT INTO log (cliente, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", (idcliente, "Actualizó los datos del cliente.", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Datos de "+nombre+" guardados correctamente."})

@app.route("/caso/guardar-datos", methods=["POST"])
@login_required
def caso_guardar_datos():
    datos = request.json
    ncaso = datos.get("idcaso")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE casos SET caso = %s, tipo = %s, status = %s, asignado = %s, califica = %s, subclase = %s, motivo_califica = %s WHERE id = %s", (datos.get("caso").strip().upper(), datos.get("idtipocaso"), datos.get("idstatuscaso"), datos.get("idasignado"), datos.get("idcalifica"), datos.get("idsubclase"), datos.get("motivo_califica"), ncaso))
    cursor.execute("INSERT INTO log (caso, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", (ncaso, "Actualizó los datos del caso.", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Datos del caso "+str(ncaso)+" guardados correctamente."})

@app.route("/caso/convertir", methods=["POST"])
@login_required
def caso_convertir():
    datos = request.json
    ncaso = datos.get("idcaso")
    ncliente = datos.get("idcliente")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE casos SET capturadedatos = 0 WHERE id = %s", (ncaso,))
    cursor.execute("UPDATE clientes SET clasificacion = 'CLIENTE' WHERE id = %s", (ncliente,))
    cursor.execute("INSERT INTO log (caso, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", (ncaso, "Convirtió la consulta a un caso abierto", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Caso N°"+str(ncaso)+" abierto correctamente."})

@app.route("/caso/guardar-cita", methods=["POST"])
@login_required
def caso_guardar_cita():
    data = request.json
    idcita = data.get("idcita")
    tipocita = data.get("idtipocita")
    statuscita = data.get("idstatuscita")
    razon = data.get("razon")
    resultado = data.get("resultado").strip().upper()
    asignado = data.get("idasignado")
    fecha = data.get("citafechaoriginal")
    hora = data.get("citahoraoriginal")
    motivo_cancelacion = data.get("motivo_cancelacion").strip().upper()
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT resultado, caso from citas WHERE id = %s", (idcita,))
    resultado_anterior = cursor.fetchone()
    if resultado_anterior[0] != resultado:
        cursor.execute("INSERT INTO casos_actualizaciones (idcaso, creado, actualizacion, agente, esresultado) VALUES (%s, now(), %s, %s, 1)", (resultado_anterior[1], resultado, current_user.id))
        cursor.execute("INSERT INTO log (cita, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", (idcita, "Agregó el resultado de la cita.", current_user.id))
    cursor.execute("UPDATE citas SET fecha = %s, hora = %s, tipo = %s, status = %s, razon = %s, resultado = %s, asignado = %s, motivo_cancelacion = %s WHERE id = %s", (fecha, hora, tipocita, statuscita, razon, resultado, asignado, motivo_cancelacion, idcita))
    cursor.execute("INSERT INTO log (cita, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", (idcita, "Actualizó los datos de la cita.", current_user.id))
    mysql.connection.commit()
    cursor.close()
    # Convertir fecha y hora a objetos datetime
    fecha_obj = datetime.strptime(fecha, "%Y-%m-%d")
    hora_obj = datetime.strptime(hora, "%H:%M:%S")

    # Formatear fecha y hora
    fecha_formateada = fecha_obj.strftime("%m/%d/%Y")
    hora_formateada = hora_obj.strftime("%I:%M %p")
    return jsonify({"mensaje": "✅ Cita actualizada correctamente para el "+fecha_formateada+" a las "+hora_formateada})

@app.route("/caso/nueva-cita", methods=["POST"])
@login_required
def caso_nueva_cita():
    data = request.json
    fecha = data["selectedDateNuevaCita"]
    hora = data["selectedHourNuevaCita"]
    nueva = data.get("nuevaCita")
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO citas (cliente, caso, fecha, hora, tipo, status, razon, creador, asignado) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (nueva["idcliente"], nueva["idcaso"], fecha, hora, nueva["tipo"], nueva["status"], nueva["razon"].upper().strip(), current_user.id, nueva["asignado"]))
    cursor.execute("SELECT id FROM citas WHERE cliente = %s AND caso = %s ORDER BY id DESC LIMIT 1", (nueva["idcliente"], nueva["idcaso"]))
    idcita = cursor.fetchone()[0]
    cursor.execute("INSERT INTO log (caso, cliente, cita, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, %s, now())", (nueva['idcaso'], nueva['idcliente'], idcita,"Agregó una nueva cita para el caso.", current_user.id))
    mysql.connection.commit()
    cursor.close()
    
    # Convertir fecha y hora a objetos datetime
    fecha_obj = datetime.strptime(fecha, "%Y-%m-%d")
    hora_obj = datetime.strptime(hora, "%H:%M:%S")

    # Formatear fecha y hora
    fecha_formateada = fecha_obj.strftime("%m/%d/%Y")
    hora_formateada = hora_obj.strftime("%I:%M %p")
    return jsonify({"mensaje": "✅ Cita agendada correctamente para el "+fecha_formateada+" a las "+hora_formateada})

@app.route("/caso/actualizacion/nueva", methods=["POST"])
@login_required
def nueva_actualizacion_caso():
    datos = request.json
    id = datos.get("id")
    actualizacion = datos.get("actualizacion").strip().upper()
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO casos_actualizaciones (idcaso, creado, actualizacion, agente) VALUES (%s, now(), %s, %s)", (id, actualizacion, current_user.id))
    cursor.execute("INSERT INTO log (caso, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", (id, "Agregó una actualización del caso.", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Actualización de "+current_user.fullname+" guardada correctamente."})

@app.route("/caso/actualizacion/eliminar", methods=["POST"])
@login_required
def eliminar_actualizacion_caso():
    datos = request.json
    idActualizacion = datos.get("idActualizacion")
    idcaso = datos.get("idcaso")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE casos_actualizaciones SET deleted = 1 WHERE id = %s", (idActualizacion,))
    cursor.execute("INSERT INTO log (caso, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", (idcaso, "Eliminó una actualización del caso.", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Actualización eliminada correctamente."})

@app.route("/caso/pago/control/actualizar", methods=["POST"])
@login_required
def caso_pago_control_actualizar():
    datos = request.json
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE pagos_control SET cartasenviadas = %s, estado = %s WHERE id = %s", (datos.get("cartas"), datos.get("estado"), datos.get("idpago")))
    cursor.execute("INSERT INTO log (caso, movimiento, agente, fecha, otro) VALUES (%s, %s, %s, now(), 'PAGOS')", (datos.get("idcaso"), "Actualizó los datos de control de pagos.", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Datos de control de pagos actualizados correctamente."})

def formatear(num):
    return "{:,.2f}".format(num).replace(",", "X").replace(".", ",").replace("X", ".")

@app.route("/caso/pago/registrar", methods=["POST"])
@login_required
def caso_pago_registrar():
    datos = request.json
    monto_formateado = formatear(datos.get("monto"))
    cursor = mysql.connection.cursor()
    esSaldo = datos.get("esSaldo")
    if esSaldo:
        cursor.execute("INSERT INTO pagos (control, fecha, monto, tipo, pagado, metodo, agente) VALUES (%s, current_date(), %s, %s, 3, %s, %s)", (datos.get("idcontrol"), datos.get("monto"), datos.get("tipo"), datos.get("metodo"), current_user.id))
        cursor.execute("INSERT INTO log (cliente, caso, movimiento, agente, fecha, otro) VALUES (%s, %s, %s, %s, now(), 'PAGOS')", (datos.get("idcliente"), datos.get("idcaso"), "Registró un pago de SALDO PENDIENTE de "+monto_formateado, current_user.id))
        cursor.execute("INSERT INTO casos_actualizaciones (idcaso, creado, actualizacion, agente, esresultado) VALUES (%s, now(), %s, %s, 2)", (datos.get("idcaso"), "PAGÓ UN SALDO PENDIENTE DE $ "+monto_formateado+".", current_user.id))
    else:
        cursor.execute("UPDATE pagos SET monto = %s, fecha = current_date(), pagado = 1, tipo = %s, nombretipopago = %s, numerotarjeta = %s, metodo = %s WHERE id = %s", (datos.get("monto"), datos.get("tipo"), datos.get("nombre_tarjeta").strip().upper(), datos.get("numero_tarjeta"), datos.get("metodo"), datos.get("idpago")))
        cursor.execute("SELECT valor-entrega, SUM(pagos.monto) FROM pagos_control JOIN pagos ON pagos.control=pagos_control.id WHERE pagos_control.id = %s and pagos.pagado = 1;", (datos.get("idcontrol"),))
        comprobar_deuda = cursor.fetchone()
        resta = float(comprobar_deuda[0]) - float(comprobar_deuda[1])
        if float(resta) < 1:
            cursor.execute("DELETE FROM pagos WHERE control = %s AND id > %s;", (datos.get("idcontrol"), datos.get("idpago")))
        cursor.execute("SELECT DATE_FORMAT(fecha, '%%m/%%d/%%Y'), monto FROM pagos WHERE pagado = 0 AND control = %s LIMIT 1;", (datos.get("idcontrol"),))
        proxima_cuota = cursor.fetchone()
        if datos.get("monto") == datos.get("monto_original"):
            cuota_o_abono = "CUOTA"
            cursor.execute("INSERT INTO log (cliente, caso, movimiento, agente, fecha, otro) VALUES (%s, %s, %s, %s, now(), 'PAGOS')", (datos.get("idcliente"), datos.get("idcaso"), "Registró un pago de CUOTA de "+monto_formateado, current_user.id))
        else:
            cuota_o_abono = "ABONO"
            cursor.execute("INSERT INTO log (cliente, caso, movimiento, agente, fecha, otro) VALUES (%s, %s, %s, %s, now(), 'PAGOS')", (datos.get("idcliente"), datos.get("idcaso"), "Registró un pago de ABONO diferente al valor de la cuota de "+monto_formateado, current_user.id))
        hoy = datetime.today()
        hoy_str = hoy.strftime('%m/%d/%Y')
        if proxima_cuota:
            #proximo_mes = hoy+ relativedelta(months=1)
            proximo_mes_str = proxima_cuota[0]
            #proximo_mes_str = proximo_mes.strftime('%m/%d/%Y')
            cursor.execute("INSERT INTO casos_actualizaciones (idcaso, creado, actualizacion, agente, esresultado) VALUES (%s, now(), %s, %s, 2)", (datos.get("idcaso"), "SE VALIDA PLAN DE PAGOS CL CUMPLE CON "+cuota_o_abono+" DE $ "+monto_formateado+" PARA EL DÍA "+hoy_str+". PRÓXIMO PAGO POR VALOR DE $ "+str(formatear(proxima_cuota[1]))+" PARA EL DÍA "+proximo_mes_str+".", current_user.id))
            cursor.execute("UPDATE pagos p JOIN (SELECT s.id, (@row := @row + 1) AS rn FROM (SELECT id FROM pagos WHERE control = %s AND pagado = 0 ORDER BY fecha, id) s CROSS JOIN (SELECT @row := 0) vars) t ON t.id = p.id SET p.fecha = DATE_ADD(CURDATE(), INTERVAL t.rn MONTH);", (datos.get("idcontrol"),))
        else:
            cursor.execute("SELECT valor-entrega FROM pagos_control WHERE id = %s;", (datos.get("idcontrol"),))
            servicio = cursor.fetchone()
            cursor.execute("SELECT SUM(monto) FROM pagos WHERE control = %s AND pagado = 1;", (datos.get("idcontrol"),))
            cuotas_pagadas = cursor.fetchone()
            queda_resto = float(servicio[0]) - float(cuotas_pagadas[0])
            if queda_resto > 0:
                cursor.execute("INSERT INTO casos_actualizaciones (idcaso, creado, actualizacion, agente, esresultado) VALUES (%s, now(), %s, %s, 2)", (datos.get("idcaso"), "SE VALIDA PLAN DE PAGOS CL CUMPLE CON "+cuota_o_abono+" DE $ "+monto_formateado+" PARA EL DÍA "+hoy_str+". QUEDA UN SALDO RESTANTE DE $ "+formatear(queda_resto), current_user.id))
            else:
                cursor.execute("INSERT INTO casos_actualizaciones (idcaso, creado, actualizacion, agente, esresultado) VALUES (%s, now(), %s, %s, 2)", (datos.get("idcaso"), "SE VALIDA PLAN DE PAGOS CL CUMPLE CON "+cuota_o_abono+" DE $ "+monto_formateado+" PARA EL DÍA "+hoy_str+".", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Pago registrado correctamente. Se redirigirá al recibo automaticamente."})

@app.route("/caso/pago-independiente", methods=["POST", "GET"])
@login_required
def caso_pago_independiente():
    datos = request.json
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO pagos_independientes (caso, cliente, fecha, montoprevio, monto, tipo, metodo, agente, concepto) VALUES (%s, %s, current_date(), %s, %s, %s, %s, %s, %s)", (datos.get("idcaso"), datos.get("idcliente"), datos.get("monto_previo"), datos.get("monto"), datos.get("tipo"), datos.get("metodo"), current_user.id, datos.get("concepto").strip().upper()))
    idreciboindependiente = cursor.lastrowid
    cursor.execute("INSERT INTO log (caso, cliente, movimiento, agente, fecha, otro) VALUES (%s, %s, %s, %s, now(), 'PAGOS INDEPENDIENTES')", (datos.get("idcaso"), datos.get("idcliente"), "Registró un pago independiente de $ "+str(datos.get("monto"))+" con concepto: "+datos.get("concepto").strip().upper(), current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Pago independiente registrado correctamente. Se redirigirá al recibo automaticamente.", "idreciboindependiente": idreciboindependiente})

def generar_fechas(fecha_inicio, num_meses):
    # Convertir la fecha de inicio a un objeto datetime
    fecha = datetime.strptime(fecha_inicio, "%Y-%m-%dT%H:%M:%S.%fZ")
    
    # Lista de fechas generadas
    fechas = []
    
    # Recorrer y sumar X meses a la fecha de inicio
    for _ in range(num_meses):
        # Sumar un mes
        fecha += relativedelta(months=1)
        
        # Formatear la fecha en formato YYYY-MM-DD (sin horas)
        fecha_formateada = fecha.strftime("%Y-%m-%d")
        
        # Agregar la fecha formateada a la lista
        fechas.append(fecha_formateada)
    
    return fechas

@app.route("/pagos/guardar-plan", methods=["POST"])
@login_required
def pagos_guardar_plan():
    datos = request.json
    ncuotas = int(datos.get("cuotas"))
    valor_servicio = int(datos.get("valor_servicio"))
    cursor = mysql.connection.cursor()
    if ncuotas:
        cursor.execute("INSERT INTO pagos_control (caso, cliente, cartasenviadas, estado, valor, entrega, ncuota, cuota, creador, fecha) VALUES (%s, %s, 0, %s, %s, %s, %s, %s, %s, now())", (datos.get("idcaso"), datos.get("idcliente"), datos.get("estado"), datos.get("valor_servicio"), datos.get("entrega_inicial"), ncuotas, datos.get("valor_cuota"), current_user.id))
        last_inserted_id = cursor.lastrowid
        fechas_generadas = generar_fechas(datos.get("vencimiento"), int(ncuotas)-1)
        cursor.execute("INSERT INTO pagos (control, fecha, monto, tipo, pagado, metodo, agente) VALUES (%s, %s, %s, 1, 0, 1, %s)", (last_inserted_id, datos.get("vencimiento"), datos.get("valor_cuota"), current_user.id))
        for a in fechas_generadas:
            cursor.execute("INSERT INTO pagos (control, fecha, monto, tipo, pagado, metodo, agente) VALUES (%s, %s, %s, 1, 0, 1, %s)", (last_inserted_id, a, datos.get("valor_cuota"), current_user.id))
        cursor.execute("INSERT INTO log (caso, cliente, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", (datos.get("idcaso"), datos.get("idcliente"), "Generó un plan de pagos del caso N°"+str(datos.get("idcaso"))+" de "+str(ncuotas)+" mensuales. Costo total del servicio $ "+str(valor_servicio), current_user.id))
        mensaje = "✅ Plan de pagos generado correctamente."
    else:
        cursor.execute("INSERT INTO pagos_control (caso, cliente, cartasenviadas, estado, valor, creador, fecha, entrega, cuota, ncuota) VALUES (%s, %s, 0, %s, %s, %s, now(), 0, 0, 0)", (datos.get("idcaso"), datos.get("idcliente"), datos.get("estado"), datos.get("valor_servicio"), current_user.id))
        last_id = cursor.lastrowid
        cursor.execute("INSERT INTO pagos (control, fecha, monto, tipo, pagado, metodo, agente, nombretipopago, numerotarjeta) VALUES (%s, current_date(), %s, %s, 1, %s, %s, %s, %s)", (last_id, datos.get("valor_servicio"), datos.get("tipo"), datos.get("metodo"), current_user.id, datos.get("nombre_tarjeta").strip().upper(), datos.get("numero_tarjeta")))
        cursor.execute("INSERT INTO log (caso, cliente, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", (datos.get("idcaso"), datos.get("idcliente"), "Generó un pago único. Costo total del servicio $ "+str(valor_servicio), current_user.id))
        mensaje = "✅ Pago único generado correctamente."
        last_inserted_id = last_id
    if int(datos.get("entrega_inicial")) > 0:
        cursor.execute("INSERT INTO pagos_independientes (caso, cliente, fecha, montoprevio, monto, tipo, metodo, nombretipopago, numerotarjeta, agente, concepto, entrega) VALUES (%s, %s, current_date(), %s, %s, 1, 1, %s, %s, %s, 'AMOUNT PAID', 1)", (datos.get("idcaso"), datos.get("idcliente"), datos.get("valor_servicio"), datos.get("entrega_inicial"), datos.get("nombre_tarjeta").upper().strip(), datos.get("numero_tarjeta"), current_user.id))
        identrega = cursor.lastrowid
    else:
        identrega = None
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": mensaje, "idcontrol": last_inserted_id, "identrega": identrega})

@app.route("/caso/<int:idcaso>/documento/<int:iddoc>", methods=["GET"])
@login_required
def obtener_documento(idcaso, iddoc):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT nombre, documento, tipo FROM documentos WHERE id = %s AND caso = %s", (iddoc, idcaso))
    documento = cursor.fetchone()
    cursor.close()

    if documento:
        nombre, contenido, tipo = documento
        
        return send_file(
            io.BytesIO(contenido),
            download_name=nombre,
            as_attachment=False,
            mimetype=tipo
        )
    else:
        return jsonify({"mensaje": "Documento no encontrado"}), 404

@app.route("/documento/<int:id>/editar-clasificacion", methods=["POST"])
@login_required
def doc_editar_clasificacion(id):
    nueva_clasificacion = request.json.get('clasificacion')
    idcaso = request.json.get('idcaso')
    nombredoc = request.json.get("nombredoc")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE documentos SET clasificacion = %s WHERE id = %s", (nueva_clasificacion, id))
    cursor.execute("INSERT INTO log (otro, caso, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", ("DOCUMENTOS", str(idcaso),"Editó la clasificación del documento "+nombredoc, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Clasificación actualizada correctamente."})

@app.route("/documento/<int:id>/editar-nombre", methods=["POST"])
@login_required
def doc_editar_nombre(id):
    nuevo_nombre = request.json.get('nombre').upper().strip()
    nuevo_nombre = nuevo_nombre+".pdf"
    nombreviejo = request.json.get('nombreviejo')
    idcaso = request.json.get('idcaso')
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE documentos SET nombre = %s WHERE id = %s", (nuevo_nombre, id))
    cursor.execute("INSERT INTO log (otro, caso, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", ("DOCUMENTOS", str(idcaso), "Cambió el nombre del documento "+nombreviejo+" a "+nuevo_nombre, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Nombre del documento actualizado correctamente."})

@app.route("/documento/<int:id>/eliminar", methods=["POST"])
@login_required
def doc_eliminar(id):
    rol = request.json.get('rol')
    if rol == current_user.rol:
        nombredoc = request.json.get('nombredoc')
        idcaso = request.json.get('idcaso')
        cursor = mysql.connection.cursor()
        cursor.execute(f"DELETE FROM documentos WHERE id = {id}")
        cursor.execute("INSERT INTO log (otro, caso, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", ("DOCUMENTOS", str(idcaso), "Eliminó el documento "+nombredoc, current_user.id))
        mysql.connection.commit()
        cursor.close()
        mensaje= "✅ Documento eliminado correctamente."
    else:
        mensaje = "Error al eliminar documento. No tiene permisos de Administrador."
    return jsonify({"mensaje": mensaje})
    
@app.route("/documento/subir", methods=["POST"])
@login_required
def doc_subir():
    archivos = request.files.getlist("files")
    idcaso = request.form.get("idcaso")
    idcliente = request.form.get("idcliente")
    cursor = mysql.connection.cursor()
    for archivo in archivos:
        if archivo:
            #filename = secure_filename(archivo.filename)
            filename = archivo.filename
            mime_type = archivo.content_type
            archivo_blob = archivo.read()
            cursor.execute("INSERT INTO documentos (cliente, caso, nombre, documento, tipo, clasificacion, fecha, creador) VALUES (%s, %s, %s, %s, %s, 0, now(), %s)", (idcliente, idcaso, filename, archivo_blob, mime_type, current_user.id))
            cursor.execute("INSERT INTO log (otro, caso, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", ("DOCUMENTOS", str(idcaso), "Subió un documento: "+filename, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Documentos cargados con éxito."})

@app.route("/beneficiario/guardar-datos", methods=["POST"])
@login_required
def beneficiario_guardar_datos():
    data = request.json
    idcaso = data.get("idcaso")
    nombreb = data.get('nombreb').strip().upper()
    tel1 = data.get("telefono1")
    telefono1 = ''
    if tel1:
        for n in tel1:
            if n.isdigit():
                telefono1 = telefono1+n
    tel2 = data.get("telefono2")
    telefono2 = ''
    if tel2:
        for n in tel2:
            if n.isdigit():
                telefono2 = telefono2+n
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE beneficiarios SET nombre = %s, telefono1 = %s, telefono2 = %s, pertenecetel2 = %s, domicilio = %s, ciudad = %s, cp = %s, email = %s, relacion = %s WHERE id = %s", (nombreb, telefono1, telefono2, data.get("pertenecetel2").strip().upper(), data.get("domicilio").upper().strip(), data.get("ciudad").upper().strip(), data.get("cp").upper().strip(), data.get("email").upper().strip(), data.get("relacion").upper().strip(), data.get("idbeneficiario")))
    cursor.execute("INSERT INTO log (otro, caso, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", ("BENEFICIARIO", str(idcaso), "Cambió el nombre del beneficiario a: "+nombreb, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Datos del beneficiario "+str(nombreb)+" guardados correctamente."})

@app.route("/agenda", methods=["GET"])
@login_required
def agenda():
    fecha = request.args.get('fecha', default=datetime.today().strftime('%Y-%m-%d'))
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT citas.id AS idcita, citas.cliente AS idcliente, clientes.nombre AS nombrecliente, clientes.telefono1, clientes.telefono2, clientes.pertenecetel2, clientes.clasificacion, citas.caso AS idcaso, casos.caso AS nombrecaso, fk_tipo_caso.tipocaso, DATE_FORMAT(citas.fecha, '%m/%d/%Y') AS fecha, DATE_FORMAT(citas.hora, '%h:%i %p') AS hora, fk_tipo_cita.tipocita, citas.status AS idstatuscita, fk_status_cita.statuscita, fk_status_cita.colorstatuscita, citas.razon, citas.resultado, citas.motivo_cancelacion, citas.asignado AS idasignado, auth.fullname AS asignado, fk_oficina.oficina AS oficina, tipo_caso_subclase.subclase AS subclase, CONCAT(citas.fecha) AS fechaoriginal, CONCAT(citas.hora) AS horaoriginal, fk_tipo_cita.colortipocita, creador_auth.fullname, COALESCE(pagos_control.valor - pagos_control.entrega - SUM(CASE WHEN pagos.pagado IN (1, 3) THEN pagos.monto ELSE 0 END), pagos_control.valor - pagos_control.entrega) AS deuda, (SELECT pagos.monto FROM pagos WHERE pagos.control = pagos_control.id AND pagos.pagado = 0 ORDER BY pagos.fecha ASC LIMIT 1) AS proximo_pago FROM citas JOIN clientes ON citas.cliente=clientes.id JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo JOIN fk_status_cita ON fk_status_cita.id=citas.status JOIN auth ON auth.id = citas.asignado JOIN casos ON citas.caso = casos.id JOIN fk_oficina ON fk_oficina.id=clientes.oficina JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo JOIN tipo_caso_subclase ON tipo_caso_subclase.id=casos.subclase JOIN auth AS creador_auth ON creador_auth.id = citas.creador LEFT JOIN pagos_control ON pagos_control.caso = casos.id LEFT JOIN pagos ON pagos.control = pagos_control.id WHERE citas.fecha = '{fecha}' GROUP BY idcita ORDER BY citas.hora ASC;")
    citas = cursor.fetchall()
    citas = [{"idcita": a[0], "idcliente": a[1], "nombrecliente": a[2], "telefono1": a[3], "telefono2": a[4], "pertenecetel2": a[5], "clasificacion": a[6], "idcaso": a[7], "nombrecaso": a[8], "tipocaso": a[9], "fecha": a[10], "hora": a[11], "tipocita": a[12], "idstatuscita": a[13], "statuscita": a[14], "colorstatuscita": a[15], "razon": a[16], "resultado": a[17], "motivo_cancelacion": a[18], "idasignado": a[19], "asignado": a[20], "oficina": a[21], "subclase": a[22], "fechaoriginal": a[23], "horaoriginal": a[24], "colortipocita": a[25], "creador": a[26], "deuda": a[27], "proximo": a[28]} for a in citas]
    cursor.execute(f"SELECT rol FROM auth WHERE id = {current_user.id}")
    rol = cursor.fetchone()
    cursor.execute("SELECT id, fullname FROM auth WHERE id != 1 ORDER BY fullname;")
    asesores = cursor.fetchall()
    asesores = [{"id": a[0], "fullname": a[1]} for a in asesores]
    
    cursor.execute("SELECT DATE_ADD(fecha, INTERVAL 1 DAY) FROM calendario_fechas_bloqueadas;")
    fechas_bloqueadas = cursor.fetchall()
    fechas_bloqueadas = [{"fecha": a[0]} for a in fechas_bloqueadas]
    
    cursor.execute("SELECT id, statuscita, colorstatuscita FROM fk_status_cita ORDER BY statuscita;")
    statuscita = cursor.fetchall()
    statuscita = [{"id": a[0], "statuscita": a[1], "colorstatuscita": a[2]} for a in statuscita]
    
    cursor.close()
    
    agenda = {
        "citas": citas,
        "rol": rol,
        "asesores": asesores,
        "fechasBloqueadas": fechas_bloqueadas,
        "statuscita": statuscita
    }
    return jsonify(agenda)

@app.route("/agenda/cambiar-status", methods=["POST"])
@login_required
def agenda_cambiar_status():
    data = request.json
    idcita = data.get("idcita")
    resultado = data.get("resultado").strip().upper()
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT fk_status_cita.statuscita FROM citas JOIN fk_status_cita ON fk_status_cita.id=citas.status WHERE citas.id = %s;", ( idcita,))
    statusviejo = cursor.fetchone()[0]
    cursor.execute("SELECT fk_status_cita.statuscita FROM fk_status_cita WHERE id = %s;", (data.get("newstatus"),))
    statusnuevo = cursor.fetchone()[0]
    cursor.execute("SELECT resultado, caso from citas WHERE id = %s", (idcita,))
    resultado_anterior = cursor.fetchone()
    if resultado_anterior[0] != resultado:
        cursor.execute("INSERT INTO casos_actualizaciones (idcaso, creado, actualizacion, agente, esresultado) VALUES (%s, now(), %s, %s, 1)", (resultado_anterior[1], resultado, current_user.id))
    cursor.execute("UPDATE citas SET status = %s, motivo_cancelacion = %s, resultado = %s WHERE id = %s", (data.get("newstatus"), data.get("motivo").strip().upper(), resultado, idcita))
    cursor.execute("INSERT INTO log (cita, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", (idcita, "Cambió el status de la cita de "+statusviejo+" a "+statusnuevo, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/agenda/reprogramar", methods=["POST"])
@login_required
def agenda_reprogramar():
    data = request.json
    cursor = mysql.connection.cursor()
    fecha = data.get("fecha")
    hora = data.get("hora")
    idcita = data.get("idcita")
    cursor.execute("UPDATE citas SET fecha = %s, hora = %s WHERE id = %s", (fecha, hora, idcita))
    cursor.execute("INSERT INTO log (cita, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", (idcita, "Reprogramó la cita para el día "+fecha+" a las "+hora+" h", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion", methods=["GET"])
@login_required
def configuracion():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT fecha AS fechaoriginal, DATE_FORMAT(fecha, '%m/%d/%Y') AS fecha, motivo FROM calendario_fechas_bloqueadas ORDER BY fecha;")
    fechasBloqueadas = cursor.fetchall()
    fechasBloqueadas = [{"fechaoriginal": a[0], "fecha": a[1],"motivo": a[2]} for a in fechasBloqueadas]
    
    cursor.execute("SELECT id, tipocaso FROM fk_tipo_caso WHERE id != 0;")
    tipoCaso = cursor.fetchall()
    tipoCaso = [{"id": a[0], "tipocaso": a[1]} for a in tipoCaso]
    
    cursor.execute("SELECT tipo_caso_subclase.id AS idsubclase, idtipo, fk_tipo_caso.tipocaso AS tipocaso, subclase FROM tipo_caso_subclase JOIN fk_tipo_caso ON fk_tipo_caso.id=tipo_caso_subclase.idtipo WHERE tipo_caso_subclase.id != 0 ORDER BY subclase;")
    subClase = cursor.fetchall()
    subClase = [{"id": a[0], "idtipo": a[1], "tipocaso": a[2], "subclase": a[3]} for a in subClase]
    
    cursor.execute("SELECT id, statuscaso, colorstatuscaso FROM fk_status_caso WHERE id != 0 ORDER BY statuscaso")
    statusCaso = cursor.fetchall()
    statusCaso = [{"id": a[0], "statuscaso": a[1], "colorstatuscaso": a[2]} for a in statusCaso]
    
    cursor.execute("SELECT id, user, password, fullname, rol, clasificacion, habilitado FROM auth WHERE id != 1 ORDER BY fullname;")
    usuarios = cursor.fetchall()
    usuarios = [{"id": a[0], "user": a[1], "password": a[2], "fullname": a[3], "rol": a[4], "clasificacion": a[5], "habilitado": a[6]} for a in usuarios]
    
    cursor.execute("SELECT id, tipocita, colortipocita FROM fk_tipo_cita ORDER BY tipocita;")
    tipoCita = cursor.fetchall()
    tipoCita = [{"id": a[0], "tipocita": a[1], "colortipocita": a[2]} for a in tipoCita]
    
    cursor.execute("SELECT id, statuscita, colorstatuscita FROM fk_status_cita ORDER BY statuscita;")
    statusCita = cursor.fetchall()
    statusCita = [{"id": a[0], "statuscita": a[1], "colorstatuscita": a[2]} for a in statusCita]
    
    cursor.execute("SELECT id, estado, colorestado FROM pagos_estados ORDER BY estado;")
    estadosPagos = cursor.fetchall()
    estadosPagos = [{"id": a[0], "estado": a[1], "colorestadopago": a[2]} for a in estadosPagos]
    
    cursor.execute("SELECT CONCAT(hora), TIME_FORMAT(hora, '%h:%i %p'), cant FROM citas_calendario ORDER BY hora;")
    horas = cursor.fetchall()
    horas = [{"idhora": a[0], "hora": a[1], "cant": a[2]} for a in horas]
    
    cursor.close()
    menuconfig = {
        "fechasBloqueadas": fechasBloqueadas,
        "tipoCaso": tipoCaso,
        "subClase": subClase,
        "statusCaso": statusCaso,
        "usuarios": usuarios,
        "tipoCita": tipoCita,
        "statusCita": statusCita,
        "estadosPagos": estadosPagos,
        "horas": horas
    }
    return jsonify(menuconfig)

@app.route("/configuracion/bloquear-fecha", methods=["POST"])
@login_required
def configuracion_bloquear_fecha():
    data = request.json
    fecha = data.get("fecha")
    fecha_formateada = datetime.strptime(fecha, "%m/%d/%Y").strftime("%Y-%m-%d")
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO calendario_fechas_bloqueadas VALUES (%s, %s)", (fecha_formateada, data.get("motivo")))
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("FECHAS BLOQUEADAS", "Bloqueó la fecha "+fecha_formateada, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/quitar-fecha-bloqueada", methods=["POST"])
@login_required
def quitar_flecha_bloqueada():
    data = request.json
    fecha = data.get("fecha")
    fecha_formateada = datetime.strptime(fecha, "%m/%d/%Y").strftime("%Y-%m-%d")
    cursor = mysql.connection.cursor()
    cursor.execute(f"DELETE FROM calendario_fechas_bloqueadas WHERE fecha = '{fecha_formateada}';")
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("FECHAS BLOQUEADAS", "Quitó la fecha bloqueada "+fecha_formateada, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/agregar-subclase", methods=["POST"])
@login_required
def agregarSubclase():
    data = request.json
    idtipo = data.get("id")
    subclase = data.get("subclase").strip().upper()
    cursor = mysql.connection.cursor()
    cursor.execute(f"INSERT INTO tipo_caso_subclase (idtipo, subclase) VALUES ({idtipo}, '{subclase}');")
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("SUBCLASES", "Agregó una subclase: "+subclase, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/agregar-tipo-caso", methods=["POST"])
@login_required
def agregarTipoCaso():
    data = request.json
    tipo = data.get("tipo").strip().upper()
    cursor = mysql.connection.cursor()
    cursor.execute(f"INSERT INTO fk_tipo_caso (tipocaso) VALUES ('{tipo}');")
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("TIPOS DE CASO", "Agregó un tipo de caso: "+tipo, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/agregar-tipo-cita", methods=["POST"])
@login_required
def agregarTipoCita():
    data = request.json
    tipo = data.get("tipo").strip().upper()
    cursor = mysql.connection.cursor()
    cursor.execute(f"INSERT INTO fk_tipo_cita (tipocita, colortipocita) VALUES ('{tipo}', '000000');")
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("TIPOS DE CCITAS", "Agregó un tipo de cita: "+tipo, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/cambiar-color-status-caso", methods=["POST"])
@login_required
def colorStatusCaso():
    data = request.json
    id = data.get("idstatuscaso")
    selected = next((item for item in data['statusCasos'] if item['id'] == data['idstatuscaso']), None)
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE fk_status_caso SET colorstatuscaso = %s WHERE id = %s;", (selected['colorstatuscaso'].upper(), id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/agregar-status-caso", methods=["POST"])
@login_required
def agregarStatusCaso():
    data = request.json
    status = data.get("status").strip().upper()
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO fk_status_caso (statuscaso, colorstatuscaso) VALUES (%s, '000000');", (status,))
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("STATUS DE CASO", "Agregó un status de caso: "+status, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/agregar-status-cita", methods=["POST"])
@login_required
def agregarStatusCita():
    data = request.json
    status = data.get("status").strip().upper()
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO fk_status_cita (statuscita, colorstatuscita) VALUES (%s, '000000');", (status,))
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("STATUS DE CITA", "Agregó un status de cita: "+status, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/agregar-estado-pago", methods=["POST"])
@login_required
def agregarEstadoPago():
    data = request.json
    estado = data.get("estado").strip().upper()
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO pagos_estados (estado, colorestado) VALUES (%s, '000000');", (estado,))
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("ESTADO DE PAGO", "Agregó un estado de pago: "+estado, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)
    
@app.route("/configuracion/usuarios/cambiar-rol-usuario", methods=["POST"])
@login_required
def cambiarRolUsuario():
    data = request.json
    id = data.get("id")
    rol = data.get("rol")
    nombre = data.get("nombre")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE auth SET rol = %s WHERE id = %s", (rol, id))
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("USUARIOS", "Cambió el rol de "+nombre+" a "+rol.upper(), current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/usuarios/cambiar-clasificacion-usuario", methods=["POST"])
@login_required
def cambiarClasificacionUsuario():
    data = request.json
    id = data.get("id")
    nombre = data.get("nombre")
    if data.get("clasificacion"):
        clasificacion = "asesor"
    else:
        clasificacion = "agente"
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE auth SET clasificacion = %s WHERE id = %s", (clasificacion, id))
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("USUARIOS", "Cambió la clasificación de "+nombre+" a "+clasificacion.upper(), current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/usuarios/cambiar-habilitacion-usuario", methods=["POST"])
@login_required
def cambiarHabilitacionUsuario():
    data = request.json
    id = data.get("id")
    habilitacion = data.get("habilitacion")
    nombre = data.get("nombre")
    cursor = mysql.connection.cursor()
    if habilitacion == 1:
        cursor.execute("UPDATE auth SET habilitado = 1 WHERE id = %s", (id,))
        cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("USUARIOS", "Habilitó a "+nombre+" del sistema.", current_user.id))
    else:
        cursor.execute("UPDATE auth SET habilitado = 0, rol = 'user', clasificacion = 'agente' WHERE id = %s", (id,))
        cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("USUARIOS", "Deshabilitó a "+nombre+" del sistema.", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/cambiar-color-tipo-cita", methods=["POST"])
@login_required
def colorTipoCita():
    data = request.json
    id = data.get("idtipocita")
    selected = next((item for item in data['tipoCita'] if item['id'] == data['idtipocita']), None)
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE fk_tipo_cita SET colortipocita = %s WHERE id = %s;", (selected['colortipocita'].upper(), id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/cambiar-color-status-cita", methods=["POST"])
@login_required
def colorStatusCita():
    data = request.json
    id = data.get("idstatuscita")
    selected = next((item for item in data['statusCita'] if item['id'] == data['idstatuscita']), None)
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE fk_status_cita SET colorstatuscita = %s WHERE id = %s;", (selected['colorstatuscita'].upper(), id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/cambiar-color-estado-pago", methods=["POST"])
@login_required
def colorEstadoPago():
    data = request.json
    id = data.get("idestadopago")
    selected = next((item for item in data['estadosPagos'] if item['id'] == data['idestadopago']), None)
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE pagos_estados SET colorestado = %s WHERE id = %s;", (selected['colorestadopago'].upper(), id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/editar-subclase", methods=["POST"])
@login_required
def editarSubclase():
    data = request.json
    idsubclase = data.get("idsubclase")
    subclase = data.get("subclase").strip().upper()
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE tipo_caso_subclase SET subclase = %s WHERE id = %s;", (subclase, idsubclase))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/cambiar-cantidad-citas", methods=["POST"])
@login_required
def editarCantidadCitasPorHora():
    data = request.json
    idhora = data.get("idhora")
    cant = data.get("cant")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE citas_calendario SET cant = %s WHERE hora = %s;", (cant, idhora))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/agregar-nuevo-horario", methods=["POST"])
@login_required
def agregarNuevoHorario():
    data = request.json
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO citas_calendario VALUES (%s, 1);", (data.get("nuevo"),))
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha) VALUES (%s, %s, %s, now())", ("HORARIOS", "Agregó un nuevo horario: "+data.get("nuevo"), current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/elminar-horario-citas", methods=["POST"])
@login_required
def eliminarHorarioPorCita():
    data = request.json
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM citas_calendario WHERE hora = %s;", (data.get("idhora"),))
    mysql.connection.commit()
    cursor.close()
    return jsonify(True)

@app.route("/configuracion/busqueda", methods=["POST"])
@login_required
def buscarEnBaseAntigua():
    data = request.json
    condicional = data.get("condicional")
    cursor = mysql.connection.cursor()
    #cursor.execute("DELETE FROM citas_calendario WHERE hora = %s;", (data.get("idhora"),))
    if condicional == "nombre":
        termino = data.get("dato", "")
        sql = """SELECT 
                cases.case_number AS ncaso,
                cases.name AS caso,
                IFNULL(cases.description, '') AS caso_descripcion,
                IFNULL(cases.type, '') AS caso_tipo,
                IFNULL(cases.status, '') AS caso_status,
                IFNULL(cases.state, '') AS caso_estado,
                IFNULL(CONCAT(contacts.first_name, ' ', contacts.last_name), '') AS nombre_cliente,
                IFNULL(contacts.description, '') AS contacto_descripcion,
                IFNULL(contacts.phone_home, '') AS tel1,
                IFNULL(contacts.phone_mobile, '') AS tel2,
                IFNULL(contacts.phone_work, '') AS tel3,
                IFNULL(contacts.phone_other, '') AS tel4,
                IFNULL(contacts.primary_address_city, '') AS direccion,
                IFNULL(contacts.primary_address_state, '') AS direccion_estado,
                IFNULL(contacts.primary_address_country, '') AS ciudad,
                IFNULL(contacts.lead_source, '') AS lead_source
            FROM suite_dotgital.contacts_cases_1_c LEFT JOIN suite_dotgital.cases ON suite_dotgital.contacts_cases_1_c.contacts_cases_1cases_idb = suite_dotgital.cases.id LEFT JOIN suite_dotgital.contacts ON suite_dotgital.contacts_cases_1_c.contacts_cases_1contacts_ida=suite_dotgital.contacts.id WHERE CONCAT(contacts.first_name, ' ', contacts.last_name) LIKE %s ORDER BY nombre_cliente, ncaso;"""
        cursor.execute(sql, ("%" + termino + "%",))
    if condicional == "ncaso":
        cursor.execute("""SELECT 
                cases.case_number AS ncaso,
                cases.name AS caso,
                IFNULL(cases.description, '') AS caso_descripcion,
                IFNULL(cases.type, '') AS caso_tipo,
                IFNULL(cases.status, '') AS caso_status,
                IFNULL(cases.state, '') AS caso_estado,
                IFNULL(CONCAT(contacts.first_name, ' ', contacts.last_name), '') AS nombre_cliente,
                IFNULL(contacts.description, '') AS contacto_descripcion,
                IFNULL(contacts.phone_home, '') AS tel1,
                IFNULL(contacts.phone_mobile, '') AS tel2,
                IFNULL(contacts.phone_work, '') AS tel3,
                IFNULL(contacts.phone_other, '') AS tel4,
                IFNULL(contacts.primary_address_city, '') AS direccion,
                IFNULL(contacts.primary_address_state, '') AS direccion_estado,
                IFNULL(contacts.primary_address_country, '') AS ciudad,
                IFNULL(contacts.lead_source, '') AS lead_source
            FROM suite_dotgital.contacts_cases_1_c LEFT JOIN suite_dotgital.cases ON suite_dotgital.contacts_cases_1_c.contacts_cases_1cases_idb = suite_dotgital.cases.id LEFT JOIN suite_dotgital.contacts ON suite_dotgital.contacts_cases_1_c.contacts_cases_1contacts_ida=suite_dotgital.contacts.id WHERE cases.case_number = %s ORDER BY nombre_cliente, ncaso;""", (data.get("dato", ""),))
    resultados = cursor.fetchall()
    resultados = [{
                "ncaso": r[0],
                "caso": r[1],
                "caso_descripcion": r[2],
                "caso_tipo": r[3],
                "caso_status": r[4],
                "caso_estado": r[5],
                "nombre_cliente": r[6],
                "contacto_descripcion": r[7],
                "tel1": r[8],
                "tel2": r[9],
                "tel3": r[10],
                "tel4": r[11],
                "direccion": r[12],
                "direccion_estado": r[13],
                "ciudad": r[14],
                "lead_source": r[15]
            } for r in resultados]
    mysql.connection.commit()
    cursor.close()
    return jsonify(resultados)

@app.route("/cobros", defaults={"estado": None, "desde": None, "hasta": None}, methods=["GET"])
@app.route("/cobros/<int:estado>", defaults={"desde": None, "hasta": None}, methods=["GET"])
@app.route("/cobros/<int:estado>/<string:desde>/<string:hasta>", methods=["GET", "POST"])
@login_required
def cobros(estado, desde, hasta):
    def norm(v):
        if v is None: return None
        v = str(v).strip().lower()
        return None if v in ("", "null", "none", "undefined") else v

    estado = norm(estado)
    desde  = norm(desde)
    hasta  = norm(hasta)

    if estado is not None:
        try: estado = int(estado)
        except ValueError: estado = None

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT rol FROM auth WHERE id = %s;", (current_user.id,))
    rol = cursor.fetchone()

    cursor.execute("SELECT id, estado FROM pagos_estados;")
    estados = [{"id": a[0], "estado": a[1]} for a in cursor.fetchall()]

    params, where = [], []
    if desde and hasta:
        where.append("pagos.fecha BETWEEN %s AND %s")
        params += [desde, hasta]
    if estado is not None:
        where.append("pagos_control.estado = %s")
        params.append(estado)

    where_sql = ("WHERE " + " AND ".join(where)) if where else ""

    sql = f"SELECT pagos_control.id, pagos_estados.estado, pagos_estados.id, pagos_estados.colorestado, pagos_control.cartasenviadas, casos.id, casos.caso, clientes.id, clientes.nombre, pagos_control.valor-pagos_control.entrega-(SELECT SUM(p.monto) FROM pagos p WHERE p.control = pagos_control.id AND p.pagado = 1) AS total_no_pagados FROM pagos LEFT JOIN pagos_control ON pagos_control.id = pagos.control JOIN casos ON casos.id = pagos_control.caso JOIN clientes ON clientes.id = pagos_control.cliente JOIN pagos_estados ON pagos_estados.id = pagos_control.estado {where_sql} GROUP BY pagos.control ORDER BY pagos_control.fecha DESC;"
    cursor.execute(sql, params)
    filas = cursor.fetchall()
    cobros = [{
            "idcontrol":      r[0],
            "estado":         r[1],
            "id_estado":      r[2],
            "colorestado":    r[3],
            "cartasenviadas": r[4],
            "id_caso":        r[5],
            "caso":           r[6],
            "id_cliente":     r[7],
            "cliente":        r[8],
            "total_no_pagados": float(r[9]) if r[9] is not None else 0.0,
        } for r in filas]
    cursor.close()
    data = {
        "rol": rol,
        "estados": estados,
        "cobros": cobros
    }
    return jsonify(data)

@app.route("/citas/borrar", methods=["POST"])
@login_required
def borrar_cita():
    data = request.json
    idcita = data.get("idcita")
    idcaso = data.get("idcaso")
    hora = data.get("hora")
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM log WHERE cita = %s", (idcita,))
    cursor.execute("DELETE FROM citas WHERE id = %s", (idcita,))
    cursor.execute("INSERT INTO log (caso, movimiento, agente, fecha, otro) VALUES (%s, %s, %s, now(), %s)", (idcaso, "Eliminó la cita del caso N°"+str(idcaso)+" agendada a las "+str(hora), current_user.id, "CITA BORRADA"))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Cita borrada correctamente."})

@app.route("/perfil/nota/nueva", methods=["POST"])
@login_required
def perfil_nueva_nota():
    data = request.json
    idcliente = data.get("datos")
    nota = data.get("nota").strip().upper()
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO clientes_notas (cliente, nota, fecha, creador) VALUES (%s, %s, now(), %s)", (idcliente, nota, current_user.id))
    cursor.execute("INSERT INTO log (otro, cliente, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", ("NOTAS", str(idcliente), "Agregó una nota al cliente N°"+str(idcliente)+": "+nota, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Nota guardada correctamente."})

@app.route("/perfil/nota/eliminar", methods=["POST"])
@login_required
def perfil_eliminar_nota():
    data = request.json
    idnota = data.get("idnota")
    idcliente = data.get("idcliente")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE clientes_notas SET deleted = 1 WHERE id = %s", (idnota,))
    cursor.execute("INSERT INTO log (otro, cliente, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", ("NOTAS", str(idcliente), "Eliminó una nota del cliente N°"+str(idcliente), current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Nota eliminada correctamente."})

@app.route("/perfil/nota/editar-nota-pago", methods=["POST"])
@login_required
def perfil_editar_nota_pago():
    data = request.json
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE casos_actualizaciones SET actualizacion = %s WHERE id = %s", (data.get("nota").strip().upper(), data.get("idnota")))
    cursor.execute("INSERT INTO log (otro, caso, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", ("NOTAS", data.get("idcaso"), "Editó una nota de pago.", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Nota de pago actualizada correctamente."})

@app.route("/pagos/actualizar-fecha", methods=["POST"])
@login_required
def actualizar_fecha_pago():
    data = request.json
    idpago = data.get("id")
    fecha = data.get("fecha")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE pagos SET fecha = %s WHERE id = %s", (fecha, idpago))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Fecha actualizada correctamente."})

@app.route("/pagos/actualizar-monto", methods=["POST"])
@login_required
def actualizar_monto_pago():
    data = request.json
    idpago = data.get("id")
    monto = data.get("monto")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE pagos SET monto = %s WHERE id = %s", (monto, idpago))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Monto actualizado correctamente."})

@app.route("/pagosindependientes/eliminar", methods=["POST"])
@login_required
def eliminar_pago_independiente():
    data = request.json
    idpago = data.get("idpago")
    idcaso = data.get("idcaso")
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM pagos_independientes WHERE id = %s", (idpago,))
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha, caso) VALUES (%s, %s, %s, now(), %s)", ("PAGOS INDEPENDIENTES", "Eliminó el pago independiente.", current_user.id, idcaso))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Pago independiente eliminado correctamente."})

@app.route("/pagos/eliminar", methods=["POST"])
@login_required
def eliminar_pago():
    data = request.json
    idpago = data.get("idpago")
    idcaso = data.get("idcaso")
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM pagos WHERE id = %s", (idpago,))
    cursor.execute("INSERT INTO log (otro, movimiento, agente, fecha, caso) VALUES (%s, %s, %s, now(), %s)", ("PAGOS REGISTRADOS", "Eliminó un pago/cuota del plan de pagos.", current_user.id, idcaso))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Pago eliminado correctamente."})

@app.route("/cobros/cambiar-estado", methods=["POST"])
@login_required
def cobros_cambiar_estado():
    data = request.json
    idpago = data.get("idpago")
    idestado = data.get("idestado")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE pagos_control SET estado = %s WHERE id = %s", (idestado, idpago))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "✅ Estado de pago actualizado correctamente."})

@app.route('/leer-docs')
def migrar_documentos():
    carpeta_pdfs = r"/home/flask/gestion_equipo_legal/Documents"
    limite = 50
    contador = 0
    salida = ""

    if not os.path.exists(carpeta_pdfs):
        return Response(f"La carpeta '{carpeta_pdfs}' no existe.", mimetype='text/plain')

    for archivo in os.listdir(carpeta_pdfs):
        ruta_completa = os.path.join(carpeta_pdfs, archivo)
        if os.path.isfile(ruta_completa):  # acepta archivos sin extensión
            salida += archivo + "\n"
            contador += 1
            if contador >= limite:
                break

    if contador == 0:
        salida = "No se encontraron archivos en la carpeta."

    #return Response(salida, mimetype='text/plain')
    return "Ruta temporalmente deshabilitada.", 403

@app.route('/migrar-docs')
def migrar_a_bd():
    #carpeta_pdfs = r"C:\Users\federico\Desktop\TaBoDa arch\Documents"
    carpeta_pdfs = r"/home/flask/gestion_equipo_legal/Documents"
    archivos = [f for f in os.listdir(carpeta_pdfs) if os.path.isfile(os.path.join(carpeta_pdfs, f))]
    total = len(archivos)

    archivos_insertados = 0
    errores = 0
    
    cursor = mysql.connection.cursor()

    for i, archivo in enumerate(archivos, start=1):
        ruta_completa = os.path.join(carpeta_pdfs, archivo)

        if os.path.isfile(ruta_completa):
            try:
                with open(ruta_completa, 'rb') as f:
                    binario = f.read()
                    cursor.execute(
                        "INSERT INTO documentos (cliente, caso, nombre, documento, clasificacion, fecha, creador) VALUES (1, 5, %s, %s, 0, now(), 1)",
                        (archivo, binario)
                    )
                    archivos_insertados += 1
            except Exception as e:
                errores += 1
                print(f"Error con archivo {archivo}: {e}")
            
            print(f"[{i}/{total}] Procesado: {archivo}")

    mysql.connection.commit()
    cursor.close()

    #return f"Archivos insertados: {archivos_insertados}, Errores: {errores}"
    return "Ruta temporalmente deshabilitada.", 403

@app.route("/recibos/<int:id_recibo>/<saldo>")
@login_required
def generar_pdf(id_recibo, saldo):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT pagos_control.caso, pagos_control.cliente, pagos.monto, DATE_FORMAT(pagos.fecha, '%%m/%%d/%%Y'), casos.caso, clientes.nombre, CONCAT(clientes.domicilio, ' ', clientes.ciudad, ' ', clientes.cp), pagos.nombretipopago, pagos.numerotarjeta, fk_oficina.oficina, auth.fullname, pagos_tipo.tipo, pagos_metodo.metodo FROM pagos JOIN pagos_control ON pagos.control = pagos_control.id JOIN casos ON casos.id = pagos_control.caso JOIN clientes ON clientes.id = casos.idcliente JOIN fk_oficina ON fk_oficina.id = clientes.oficina JOIN auth ON auth.id = pagos.agente JOIN pagos_tipo ON pagos_tipo.id=pagos.tipo JOIN pagos_metodo ON pagos_metodo.id = pagos.metodo WHERE pagos.id = %s", (id_recibo,))
    datos = cursor.fetchone()
    monto_texto = num2words(int(datos[2]), lang='en', to='cardinal') + " dollars"
    monto_formateado = formatear(datos[2])
    previo = float(saldo) + float(datos[2])
    previo = formatear(previo)
    balance = formatear(float(saldo))
    datos = {
        "ncaso": datos[0],
        "cliente": datos[1],
        "monto": monto_formateado,
        "fecha": datos[3],
        "caso" : datos[4],
        "ncliente": datos[5],
        "domicilio": datos[6],
        "monto_texto": monto_texto.upper(),
        "nombretipopago": datos[7],
        "numerotarjeta": datos[8],
        "oficina": datos[9],
        "agente": datos[10],
        "tipo": datos[11],
        "metodo": datos[12],
        "previo": previo,
        "balance": balance,
        "concepto": None,
        "idrecibo": id_recibo
    }

    ruta_logo = os.path.abspath('static/img/logo.jpg')
    html_render = render_template("recibo.html", datos=datos, ruta_logo=ruta_logo)

    base_url = os.path.abspath(os.path.dirname(__file__))
    #pdf = HTML(string=html_render, base_url=base_url).write_pdf()
    pdf = pdfkit.from_string(html_render, False, options={
    'enable-local-file-access': None,
    'quiet': '',
    'print-media-type': None,
    'margin-top': '20mm',
    'margin-bottom': '20mm',
    'margin-left': '20mm',
    'margin-right': '20mm',
}
    #linea de abajo
    #, configuration=configurationwpdf
    
    )
    

    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'inline; filename=recibo.pdf'
    return response

@app.route("/reciboindependiente/<int:id_recibo>")
@login_required
def generar_pdf_independiente(id_recibo):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT pagos_independientes.caso, pagos_independientes.cliente, pagos_independientes.monto, DATE_FORMAT(pagos_independientes.fecha, '%%m/%%d/%%Y'), casos.caso, clientes.nombre, CONCAT(clientes.domicilio, ' ', clientes.ciudad, ' ', clientes.cp), pagos_independientes.nombretipopago, pagos_independientes.numerotarjeta, fk_oficina.oficina, auth.fullname, pagos_tipo.tipo, pagos_metodo.metodo, pagos_independientes.montoprevio, montoprevio-monto AS balance, pagos_independientes.concepto FROM pagos_independientes JOIN casos ON casos.id = pagos_independientes.caso JOIN clientes ON clientes.id = casos.idcliente JOIN fk_oficina ON fk_oficina.id = clientes.oficina JOIN auth ON auth.id = pagos_independientes.agente JOIN pagos_tipo ON pagos_tipo.id=pagos_independientes.tipo JOIN pagos_metodo ON pagos_metodo.id = pagos_independientes.metodo WHERE pagos_independientes.id = %s", (id_recibo,))
    datos = cursor.fetchone()
    monto_texto = num2words(int(datos[2]), lang='en', to='cardinal') + " dollars"
    monto_formateado = formatear(datos[2])
    previo = formatear(float(datos[13]))
    balance = formatear(float(datos[14]))
    datos = {
        "ncaso": datos[0],
        "cliente": datos[1],
        "monto": monto_formateado,
        "fecha": datos[3],
        "caso" : datos[4],
        "ncliente": datos[5],
        "domicilio": datos[6],
        "monto_texto": monto_texto.upper(),
        "nombretipopago": datos[7],
        "numerotarjeta": datos[8],
        "oficina": datos[9],
        "agente": datos[10],
        "tipo": datos[11],
        "metodo": datos[12],
        "previo": previo,
        "balance": balance,
        "concepto": datos[15],
        "idrecibo": id_recibo
    }

    ruta_logo = os.path.abspath('static/img/logo.jpg')
    html_render = render_template("recibo.html", datos=datos, ruta_logo=ruta_logo)

    base_url = os.path.abspath(os.path.dirname(__file__))
    #pdf = HTML(string=html_render, base_url=base_url).write_pdf()
    pdf = pdfkit.from_string(html_render, False, options={
    'enable-local-file-access': None,
    'quiet': '',
    'print-media-type': None,
    'margin-top': '20mm',
    'margin-bottom': '20mm',
    'margin-left': '20mm',
    'margin-right': '20mm',
}
    #linea de abajo
    #, configuration=configurationwpdf
    
    )
    

    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'inline; filename=recibo.pdf'
    return response

@app.route("/plandepagos/resumen/<int:id>")
@login_required
def plandepagos_resumen(id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT pagos_control.caso, casos.caso, auth.fullname, DATE_FORMAT(pagos_control.fecha, '%%m/%%d/%%Y'), ncuota, valor, entrega, valor-entrega AS balance, cuota FROM pagos_control JOIN casos ON casos.id=pagos_control.caso JOIN auth ON pagos_control.creador = auth.id WHERE pagos_control.id = %s", (id,))
    datos = cursor.fetchone()
    valor = formatear(float(datos[5]))
    entrega = formatear(float(datos[6]))
    balance = formatear(float(datos[7]))
    cuota = formatear(float(datos[8]))
    cursor.execute("SELECT pagos_tipo.tipo FROM pagos_independientes JOIN pagos_tipo ON pagos_tipo.id = pagos_independientes.tipo WHERE pagos_independientes.caso = %s AND pagos_independientes.entrega = 1;", (datos[0],))
    payment_type = cursor.fetchone()
    if payment_type:
        payment_type = payment_type[0]
    else:
        payment_type = None
    
    datos = {
        "ncaso": datos[0],
        "caso": datos[1],
        "agente": datos[2],
        "fecha" : datos[3],
        "ncuota": datos[4],
        "valor": valor,
        "entrega": entrega,
        "balance": balance,
        "cuota": cuota,
        "id": id,
        "payment_type": payment_type
    }
    
    cursor.execute("SELECT DATE_FORMAT(fecha, '%%m/%%d/%%Y'), monto FROM pagos WHERE control = %s ORDER BY fecha", (id,))
    pagos = cursor.fetchall()
    pagos = [{"n": i + 1, "fecha": a[0], "monto": formatear(float(a[1]))} for i, a in enumerate(pagos)]

    ruta_logo = os.path.abspath('static/img/logo.jpg')
    html_render = render_template("resumen_plandepagos.html", datos=datos, ruta_logo=ruta_logo, pagos=pagos)

    base_url = os.path.abspath(os.path.dirname(__file__))
    #pdf = HTML(string=html_render, base_url=base_url).write_pdf()
    pdf = pdfkit.from_string(html_render, False, options={
    'enable-local-file-access': None,
    'quiet': '',
    'print-media-type': None,
    'margin-top': '20mm',
    'margin-bottom': '20mm',
    'margin-left': '20mm',
    'margin-right': '20mm',
}
    ##linea de abajo
    #, configuration=configurationwpdf
    
    )
    

    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'inline; filename=resumen_plandepagos.pdf'
    return response

@app.route("/reorganizar-beneficiarios", methods=["POST", "GET"])
def reorganizar_beneficiarios():
    cursor = mysql.connection.cursor()

    try:
        # Paso 1: Encontrar los beneficiarios que están asignados a más de un caso
        cursor.execute("""
            SELECT idbeneficiario
            FROM casos
            WHERE idbeneficiario IS NOT NULL
            GROUP BY idbeneficiario
            HAVING COUNT(*) > 1
        """)
        beneficiarios_duplicados = cursor.fetchall()

        for (idbeneficiario,) in beneficiarios_duplicados:
            # Obtener datos del beneficiario original
            cursor.execute("SELECT nombre, telefono1, telefono2, pertenecetel2, domicilio, ciudad, cp, email, relacion FROM beneficiarios WHERE id = %s", (idbeneficiario,))
            datos = cursor.fetchone()

            # Obtener los casos relacionados
            cursor.execute("SELECT id FROM casos WHERE idbeneficiario = %s", (idbeneficiario,))
            casos = cursor.fetchall()

            # Mantener el primer caso con el beneficiario actual, clonar para los demás
            for caso in casos[1:]:  # Salta el primero
                # Insertar nuevo beneficiario clonado
                cursor.execute("""
                    INSERT INTO beneficiarios (nombre, telefono1, telefono2, pertenecetel2, domicilio, ciudad, cp, email, relacion)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, datos)
                nuevo_id = cursor.lastrowid

                # Asignar nuevo idbeneficiario al caso
                cursor.execute("UPDATE casos SET idbeneficiario = %s WHERE id = %s", (nuevo_id, caso[0]))
        
        cursor.execute("DELETE FROM beneficiarios WHERE id NOT IN (SELECT DISTINCT idbeneficiario FROM casos WHERE idbeneficiario IS NOT NULL);")

        mysql.connection.commit()
        #return jsonify({"mensaje": "Beneficiarios reorganizados correctamente."}), 200
        return "Ruta temporalmente deshabilitada.", 403

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()

def limpiar(valor):
    if pd.isna(valor):
        return 0
    valor_str = str(valor)
    valor_str = valor_str.replace('$', '')
    valor_str = valor_str.replace(',', '')
    valor_str = valor_str.replace('.', '')
    valor_str = valor_str.replace(' ', '')
    if valor_str.isdigit() and len(valor_str) > 2:
        valor_entero = int(valor_str[:-2])
        return valor_entero
    else:
        return 0
    
def limpiar_decimal(valor):
    if pd.isna(valor):
        return 0
    valor_str = str(valor)
    valor_str = valor_str.replace('$', '')
    valor_str = valor_str.replace(',', '')
    valor_str = valor_str.replace('.', '')
    valor_str = valor_str.replace(' ', '')
    if valor_str.isdigit() and len(valor_str) > 2:
        valor_con_punto = valor_str[:-2] + '.' + valor_str[-2:]
        return float(valor_con_punto)
    else:
        return 0

@app.route("/leer-csv", methods=["POST", "GET"])
@login_required
def leer_csv():
    df = pd.read_csv('datos.csv', sep=None, engine='python')

    columnas_utiles = [
        'INGRESO',
        'CASO',
        'CARTAS ENVIADAS',
        'VALOR SERVICIO',
        'CUANTO PAGO AL ABRIR',
        'CUOTA MENSUAL',
        'CUANTO DEBE'
    ]

    df_filtrado = df[columnas_utiles]
    
    df_filtrado['CASO'] = df_filtrado['CASO'].astype('Int64')
    ingreso = pd.to_datetime(df_filtrado['INGRESO'], errors='coerce').dt.date
    df_filtrado['INGRESO'] = ingreso

    cartas_enviadas = pd.to_numeric(df_filtrado['CARTAS ENVIADAS'], errors='coerce').fillna(0).astype('Int64')
    df_filtrado['CARTAS ENVIADAS'] = cartas_enviadas

    valor_servicio = df_filtrado['VALOR SERVICIO'].apply(limpiar).astype('Int64')
    df_filtrado['VALOR SERVICIO'] = valor_servicio

    cuanto_pago = df_filtrado['CUANTO PAGO AL ABRIR'].apply(limpiar).astype('Int64')
    df_filtrado['CUANTO PAGO AL ABRIR'] = cuanto_pago

    cuota_mensual = df_filtrado['CUOTA MENSUAL'].apply(limpiar_decimal).astype(float)
    df_filtrado['CUOTA MENSUAL'] = cuota_mensual
    
    cuanto_debe = df_filtrado['CUANTO DEBE'].apply(limpiar_decimal).astype(float)
    df_filtrado['CUANTO DEBE'] = cuanto_debe
    
    cuotas_restantes = np.floor(cuanto_debe / cuota_mensual).replace([np.inf, -np.inf], np.nan)
    cuotas_restantes = cuotas_restantes.fillna(0).astype('Int64')
    df_filtrado['CUOTAS RESTANTES'] = cuotas_restantes
    
    saldo = cuanto_debe - (cuotas_restantes * cuota_mensual)
    df_filtrado['SALDO'] = saldo
    
    pagado = (valor_servicio - cuanto_pago) - cuanto_debe
    df_filtrado['PAGADO'] = pagado
    
    

    pd.set_option('display.max_rows', None)

    #print(df_filtrado.dtypes)
    #print(df_filtrado)
    cursor = mysql.connection.cursor()
    for index, fila in df_filtrado.iterrows():
        caso = fila['CASO']
        cursor.execute("SELECT 1 FROM casos WHERE id = %s", (caso,))
        existe = cursor.fetchone()
        
        if not existe:
            print(f"Salteando fila — CASO {caso} no existe.")
            continue
        
        cursor.execute("SELECT 1 FROM pagos_control WHERE caso = %s", (caso,))
        existe_control = cursor.fetchone()
        
        if existe_control:
            print(f"Salteando fila — CASO {caso} ya tiene control de pago.")
            continue
        
        ingreso = fila['INGRESO']
        cartas_enviadas = fila['CARTAS ENVIADAS']
        valor_servicio = fila['VALOR SERVICIO']
        cuota_mensual = fila['CUOTA MENSUAL']
        cuanto_pago = fila['CUANTO PAGO AL ABRIR']
        cuanto_debe = fila['CUANTO DEBE']
        cuotas_restantes = fila['CUOTAS RESTANTES']
        saldo = fila['SALDO']
        pagado = fila['PAGADO']
        cantidad_cuotas = int(cuotas_restantes)+1
        
        cursor.execute("INSERT INTO pagos_control (caso, cliente, cartasenviadas, estado, valor, entrega, ncuota, cuota, fecha, creador) VALUES (%s, 1, %s, 2, %s, %s, %s, %s, %s, 2)", (caso, cartas_enviadas, valor_servicio, cuanto_pago, cantidad_cuotas, cuota_mensual, ingreso))
        id_control = cursor.lastrowid
        cursor.execute("INSERT INTO pagos (control, fecha, monto, tipo, metodo, pagado, agente) VALUES (%s, %s, %s, 2, 2, 1, 2)", (id_control, ingreso, pagado))
        for cuota in range(int(cuotas_restantes)):
            fecha_pago = ingreso + relativedelta(months=cuota)
            cursor.execute("INSERT INTO pagos (control, fecha, monto, tipo, metodo, pagado, agente) VALUES (%s, %s, %s, 2, 2, 0, 2)", (id_control, fecha_pago, cuota_mensual))
    
    mysql.connection.commit()
    cursor.close()
    #return df_filtrado.to_html(index=False)
    return "Ruta temporalmente deshabilitada.", 403

@app.route('/generar-reporte-mes/<int:mes>')
@login_required
def generar_reporte(mes):
    cursor = mysql.connection.cursor()
    query = "select citas.fecha AS Fecha, CONCAT(citas.hora) AS Hora, clientes.clasificacion AS 'Tipo de cliente', citas.caso AS Caso, fk_oficina.oficina AS Oficina, clientes.nombre AS 'Nombre del cliente', fk_status_cita.statuscita AS Status, fk_tipo_caso.tipocaso AS 'Tipo caso', fk_tipo_cita.tipocita AS 'Tipo cita', clientes.telefono1 AS 'Telefono 1', clientes.telefono2 AS 'Telefono 2', fk_referido.referido AS 'Como llegó a nosotros', auth.fullname AS 'Quien agendó' FROM citas JOIN clientes ON clientes.id = citas.cliente JOIN fk_oficina ON fk_oficina.id=clientes.oficina JOIN fk_status_cita ON fk_status_cita.id = citas.status JOIN casos ON casos.idcliente = clientes.id JOIN fk_tipo_caso ON fk_tipo_caso.id = casos.tipo JOIN fk_tipo_cita ON fk_tipo_cita.id = citas.tipo JOIN fk_referido ON fk_referido.id = clientes.referido JOIN auth ON auth.id = citas.creador WHERE MONTH(citas.fecha) = %s GROUP BY citas.id ORDER BY citas.fecha, citas.hora;"
    cursor.execute(query, (mes,))
    df = pd.read_sql(query, mysql.connection, params=(mes,))

    output = BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Reporte')

    output.seek(0)

    nombre_archivo = f"reporte_pagos_mes_{mes}.xlsx"
    mysql.connection.commit()
    cursor.close()
    return send_file(output,
                     download_name=nombre_archivo,
                     as_attachment=True,
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

app.config.from_object(config['development'])

#if __name__ == "__main__":
    #app.run(port=5002, debug=True)