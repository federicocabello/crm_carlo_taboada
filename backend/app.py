from flask import Flask, request, jsonify, send_file
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mysqldb import MySQL
import bcrypt, os, io
from flask_cors import CORS
from config import config
from dotenv import load_dotenv

from werkzeug.utils import secure_filename

from datetime import datetime

load_dotenv()

backend_url = os.getenv("BACKEND_URL")

app = Flask(__name__)
app.secret_key = "B!1w8NAt1T^%kvhUI*S^"
CORS(app, supports_credentials=True, origins=backend_url)

mysql = MySQL(app)

# Configuración de Flask-Login
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
    cursor.execute("SELECT user, password, fullname, rol, id FROM auth WHERE user = %s", (username,))
    user = cursor.fetchone()
    cursor.close()

    #print(f"Datos en la base: username={user[0]}, password={user[1]}")
    #if user and bcrypt.checkpw(password.encode("utf-8"), user[1].encode("utf-8")):
    if user and password == user[1]:
        user_obj = User(username=user[0], password=user[1], fullname=user[2], rol=user[3], id=user[4])
        login_user(user_obj)
        return jsonify({"message": "Login exitoso", "user": {"username": user[0], "password": user[1], "fullname": user[2], "rol": user[3], "id": user[4]}}), 200

    return jsonify({"message": "Usuario o contraseña incorrectos"}), 401

@app.route("/api/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Logout exitoso"}), 200

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
    return jsonify({"message": "Mi usuario actualizado correctamente.", "user": {"username": username, "password": password, "fullname": fullname, "rol": rol}}), 200

@app.route("/captura-de-datos", methods=["GET", "POST"])
@login_required
def capturaDeDatos():
    cursor = mysql.connection.cursor()
    
    cursor.execute("SELECT id, oficina from fk_oficina WHERE id != 0;")
    oficina = cursor.fetchall()
    oficina = [{"id": r[0], "oficina": r[1]} for r in oficina]
    
    cursor.execute("SELECT id, referido from fk_referido WHERE id != 0;")
    referido = cursor.fetchall()
    referido = [{"id": r[0], "referido": r[1]} for r in referido]
    
    cursor.execute("SELECT id, tipocita from fk_tipo_cita WHERE id != 0;")
    tipo_cita = cursor.fetchall()
    tipo_cita = [{"id": r[0], "tipocita": r[1]} for r in tipo_cita]
    
    cursor.execute("SELECT fecha, GROUP_CONCAT(hora ORDER BY hora SEPARATOR ', ') AS horas FROM citas GROUP BY fecha;")
    citas_calendario = cursor.fetchall()
    citas_calendario = [{"fecha": a[0].isoformat(), "hora": a[1]} for a in citas_calendario]
    
    cursor.execute("SELECT *, tipocaso FROM fk_tipo_caso WHERE id != 0;")
    tipo_caso = cursor.fetchall()
    tipo_caso = [{"id": r[0], "tipocaso": r[1]} for r in tipo_caso]
    
    cursor.execute("SELECT id, fullname FROM auth WHERE clasificacion = 'asesor';")
    asesores = cursor.fetchall()
    asesores = [{"id": r[0], "asesor": r[1]} for r in asesores]
    
    cursor.close()
    
    resultados = {
        "oficina": oficina,
        "referido": referido,
        "tipocita": tipo_cita,
        "citas_calendario": citas_calendario,
        "tipo_caso": tipo_caso,
        "asesores": asesores
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
                        casos.califica AS califica,
                        DATE_FORMAT(casos.fecha, '%m/%d/%Y') AS fecha,
                        auth_creador.fullname AS creador
                    FROM casos
                    LEFT JOIN clientes ON clientes.id = casos.idcliente 
                    LEFT JOIN citas ON citas.caso = casos.id 
                    LEFT JOIN fk_status_cita ON citas.status=fk_status_cita.id 
                    LEFT JOIN auth AS auth_creador ON auth_creador.id=clientes.creador 
                    LEFT JOIN auth AS auth_asignado ON auth_asignado.id=casos.asignado 
                    LEFT JOIN fk_oficina ON fk_oficina.id=clientes.oficina 
                    LEFT JOIN fk_referido ON fk_referido.id=clientes.referido 
                    LEFT JOIN fk_tipo_caso ON casos.tipo=fk_tipo_caso.id 
                    WHERE clientes.clasificacion = 'LEAD' 
                    ORDER BY casos.fecha DESC, casos.id DESC, citas.id DESC;
                   """)
    leads = cursor.fetchall()
    leads = [{"idcliente": a[0], "nombrec": a[1], "telefonoUno": a[2], "telefonoDos": a[3], "pertenece": a[4], "oficina": a[5], "referido": a[6], "idcaso": a[7], "tipocaso": a[8], "idcita": a[9], "statuscita": a[10], "razoncita": a[11], "asignado": a[12], "califica": a[13], "fecha": a[14], "creador": a[15]} for a in leads]
    
    cursor.execute("SELECT * from fk_oficina WHERE id != 0;")
    oficina = cursor.fetchall()
    oficina = [{"id": r[0], "oficina": r[1]} for r in oficina]
    
    cursor.execute("SELECT * from fk_referido WHERE id != 0;")
    referencia = cursor.fetchall()
    referencia = [{"id": r[0], "referencia": r[1]} for r in referencia]
    
    cursor.execute("SELECT * from fk_tipo_caso WHERE id != 0;")
    tipo_caso = cursor.fetchall()
    tipo_caso = [{"id": r[0], "tipocaso": r[1]} for r in tipo_caso]
    
    cursor.execute("SELECT * from fk_status_cita WHERE id != 0;")
    status_cita = cursor.fetchall()
    status_cita = [{"id": r[0], "statuscita": r[1]} for r in status_cita]
    
    cursor.execute("SELECT id, fullname FROM auth WHERE clasificacion = 'asesor';")
    asesores = cursor.fetchall()
    asesores = [{"id": r[0], "asesor": r[1]} for r in asesores]
    
    cursor.execute("SELECT id, fullname FROM auth;")
    creadores = cursor.fetchall()
    creadores = [{"id": r[0], "creador": r[1]} for r in creadores]
    
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
        "creadores": creadores
    }
    return jsonify({"resultados": resultados, "selects": selects})

@app.route("/gestion-de-clientes", methods=["GET"])
@login_required
def gestionDeClientes():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT clientes.id AS id, clientes.nombre, clientes.telefono1 AS telefonoUno, clientes.telefono2 AS telefonoDos, clientes.pertenecetel2, TRIM(CONCAT(clientes.domicilio, ' ', clientes.ciudad, ' ', clientes.cp)) AS domicilio, fk_oficina.oficina AS oficina, fk_referido.referido AS referido, DATE_FORMAT(clientes.registrado, '%m/%d/%Y') AS fecha FROM clientes LEFT JOIN fk_oficina ON fk_oficina.id = clientes.oficina LEFT JOIN fk_referido ON fk_referido.id = clientes.referido WHERE clientes.clasificacion = 'CLIENTE' GROUP BY clientes.id ORDER BY clientes.registrado DESC;")
    leads = cursor.fetchall()
    leads = [{"id": a[0], "nombre": a[1], "telefonoUno": a[2], "telefonoDos": a[3], "pertenecetel2": a[4], "domicilio": a[5], "oficina": a[6], "referido": a[7], "fecha": a[8]} for a in leads]
    
    #cursor.execute("SELECT casos.id AS idcaso, idcliente, fk_estado_caso.estadocaso AS estado FROM casos JOIN fk_estado_caso ON casos.estado=fk_estado_caso.id")
    cursor.execute("SELECT casos.id AS idcaso, idcliente, fk_status_caso.statuscaso AS status, fk_status_caso.colorstatuscaso FROM citas JOIN casos ON citas.caso=casos.id JOIN fk_status_caso ON casos.status=fk_status_caso.id")
    casos = cursor.fetchall()
    casos = [{"idcaso": a[0], "idcliente": a[1], "status": a[2], "colorstatuscaso": a[3]} for a in casos]
    
    cursor.execute("SELECT * from fk_oficina WHERE id != 0;")
    oficina = cursor.fetchall()
    oficina = [{"id": r[0], "oficina": r[1]} for r in oficina]
    
    cursor.execute("SELECT * from fk_referido WHERE id != 0;")
    referencia = cursor.fetchall()
    referencia = [{"id": r[0], "referencia": r[1]} for r in referencia]
    
    cursor.execute("SELECT * from fk_status_caso WHERE id != 0;")
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
    razonCita = request.form.get("razonCita").strip().upper()
    oficina = request.form.get("selectedOficina")
    tipoCaso = request.form.get("selectedTipoCaso")
    tipoCita = request.form.get("selectedTipoCita")
    referido = request.form.get("selectedReferido")
    fecha = request.form.get("selectedDate")
    hora = request.form.get("selectedHour")
    asignado = request.form.get("selectedAsesor")
    pertenece = request.form.get("pertenece").strip().upper()
    archivos = request.files.getlist("files")
    
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT now()")
    registrado = cursor.fetchone()[0]
    cursor.execute("INSERT INTO clientes (nombre, telefono1, telefono2, pertenecetel2, referido, oficina, clasificacion, registrado, creador) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (nombre, telefono1, telefono2, pertenece, referido, oficina, "LEAD", registrado, current_user.id))
    cursor.execute("SELECT id FROM clientes WHERE registrado = %s", (registrado,))
    idcliente = cursor.fetchone()[0]
    
    n_caso = None
    if tipoCaso:
        cursor.execute(f"INSERT INTO beneficiarios (nombre, telefono1, telefono2, pertenecetel2, domicilio, ciudad, cp, email, cliente) VALUES ('','','','','','','','', {idcliente})")
        cursor.execute(f"SELECT id FROM beneficiarios WHERE cliente = {idcliente} ORDER BY id DESC LIMIT 1")
        n_beneficiario = cursor.fetchone()[0]
        cursor.execute("INSERT INTO casos (idcliente, idbeneficiario, fecha, modificado, tipo, status, creador, asignado, capturadedatos, califica) VALUES (%s, %s, %s, %s, %s, 0, %s, %s, 1, 3)", (idcliente, n_beneficiario, registrado, registrado, tipoCaso, current_user.id, asignado))
        cursor.execute("SELECT id FROM casos WHERE fecha = %s", (registrado,))
        n_caso = cursor.fetchone()[0]
        
    if fecha:
        cursor.execute("INSERT INTO citas (cliente, caso, fecha, hora, tipo, status, razon, creador, asignado) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (idcliente, n_caso, fecha, hora, tipoCita, 1, razonCita, current_user.id, asignado))
    
    for archivo in archivos:
        if archivo:
            filename = secure_filename(archivo.filename)
            mime_type = archivo.content_type
            archivo_blob = archivo.read()
            cursor.execute("INSERT INTO documentos (cliente, caso, nombre, documento, tipo, clasificacion, fecha, creador) VALUES (%s, %s, %s, %s, %s, 0, now(), %s)", (idcliente, n_caso, filename, archivo_blob, mime_type, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Datos de "+nombre+" registrados con éxito.", "status": 200})

@app.route("/consultas/nueva", methods=["POST"])
@login_required
def nuevaConsulta():
    idcliente = request.form.get("idcliente")
    nombre = request.form.get("nombre")
    razonCita = request.form.get("razonCita").strip().upper()
    tipoCaso = request.form.get("selectedTipoCaso")
    tipoCita = request.form.get("selectedTipoCita")
    fecha = request.form.get("selectedDate")
    hora = request.form.get("selectedHour")
    asignado = request.form.get("selectedAsesor")
    archivos = request.files.getlist("files")
    
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT now()")
    registrado = cursor.fetchone()[0]
    
    n_caso = None
    if tipoCaso:
        cursor.execute(f"INSERT INTO beneficiarios (nombre, telefono1, telefono2, pertenecetel2, domicilio, ciudad, cp, email, cliente) VALUES ('','','','','','','','', {idcliente})")
        cursor.execute(f"SELECT id FROM beneficiarios WHERE cliente = {idcliente} ORDER BY id DESC LIMIT 1")
        n_beneficiario = cursor.fetchone()[0]
        cursor.execute("INSERT INTO casos (idcliente, idbeneficiario, fecha, modificado, tipo, status, creador, asignado, capturadedatos, califica) VALUES (%s, %s, %s, %s, %s, 0, %s, %s, 1, 3)", (idcliente, n_beneficiario, registrado, registrado, tipoCaso, current_user.id, asignado))
        cursor.execute("SELECT id FROM casos WHERE fecha = %s", (registrado,))
        n_caso = cursor.fetchone()[0]
        
    if fecha:
        cursor.execute("INSERT INTO citas (cliente, caso, fecha, hora, tipo, status, razon, creador, asignado) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (idcliente, n_caso, fecha, hora, tipoCita, 1, razonCita, current_user.id, asignado))
    
    for archivo in archivos:
        if archivo:
            filename = secure_filename(archivo.filename)
            mime_type = archivo.content_type
            archivo_blob = archivo.read()
            cursor.execute("INSERT INTO documentos (cliente, caso, nombre, documento, tipo, clasificacion, fecha, creador) VALUES (%s, %s, %s, %s, %s, 0, now(), %s)", (idcliente, n_caso, filename, archivo_blob, mime_type, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Datos de "+nombre+" registrados con éxito.", "status": 200})

@app.route("/busqueda", methods=["GET"])
@login_required
def busqueda():
    query = request.args.get('query').strip()
    if query:
        cursor = mysql.connection.cursor()
        if query.isdigit():
            #cursor.execute(f"SELECT clientes.id AS idcliente, clientes.nombre, GROUP_CONCAT(casos.id ORDER BY casos.id SEPARATOR ', ') AS n_casos FROM clientes LEFT JOIN casos ON casos.idcliente = clientes.id GROUP BY clientes.id HAVING clientes.id = {query} OR n_casos LIKE '%{query}%' ORDER BY `clientes`.`nombre` ASC;")
            cursor.execute(f"SELECT clientes.id AS id, clientes.nombre AS nombre, GROUP_CONCAT(DISTINCT casos.id ORDER BY casos.id SEPARATOR ', ') AS casos, GROUP_CONCAT(DISTINCT beneficiarios.nombre ORDER BY beneficiarios.nombre SEPARATOR ', ') AS beneficiarios, clasificacion FROM clientes LEFT JOIN casos ON casos.idcliente = clientes.id LEFT JOIN beneficiarios ON beneficiarios.cliente = clientes.id GROUP BY clientes.id HAVING casos = {query} ORDER BY clientes.nombre ASC;")
        else:
            #cursor.execute(f"SELECT clientes.id AS idcliente, clientes.nombre, GROUP_CONCAT(casos.id ORDER BY casos.id SEPARATOR ', ') AS n_casos FROM clientes LEFT JOIN casos ON casos.idcliente = clientes.id GROUP BY clientes.id HAVING clientes.nombre LIKE '%{query}%' ORDER BY `clientes`.`nombre` ASC;")
            cursor.execute(f"SELECT clientes.id AS id, clientes.nombre AS nombre, GROUP_CONCAT(DISTINCT casos.id ORDER BY casos.id SEPARATOR ', ') AS casos, GROUP_CONCAT(DISTINCT beneficiarios.nombre ORDER BY beneficiarios.nombre SEPARATOR ', ') AS beneficiarios, clasificacion FROM clientes LEFT JOIN casos ON casos.idcliente = clientes.id LEFT JOIN beneficiarios ON beneficiarios.cliente = clientes.id GROUP BY clientes.id HAVING clientes.nombre LIKE '%{query}%' OR beneficiarios LIKE '%{query}%' OR casos LIKE '%{query}%' ORDER BY clientes.nombre ASC;")
        busqueda = cursor.fetchall()
        busqueda = [{"id": a[0], "nombre": a[1], "casos": a[2], "beneficiarios": a[3], "clasificacion": a[4]} for a in busqueda]
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
    cursor.execute(f"SELECT casos.id AS idcaso, beneficiarios.id AS idbeneficiario, beneficiarios.nombre AS nombreb, beneficiarios.telefono1, beneficiarios.telefono2, beneficiarios.pertenecetel2, DATE_FORMAT(casos.fecha, '%m/%d/%Y • %h:%i %p') AS fechacaso, casos.caso, fk_tipo_caso.tipocaso, fk_status_caso.statuscaso, fk_status_caso.colorstatuscaso, auth.fullname AS asignado, CONCAT(DATE_FORMAT(citas.fecha, '%m/%d/%Y'),' a las ', DATE_FORMAT(citas.hora, '%H:%i %p')) AS citasfecha, fk_tipo_cita.tipocita AS tipocita, fk_status_cita.statuscita AS statuscita FROM citas JOIN casos ON casos.id=citas.caso JOIN beneficiarios ON beneficiarios.id=casos.idbeneficiario JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo JOIN fk_status_caso ON casos.status=fk_status_caso.id JOIN auth ON casos.asignado = auth.id JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo JOIN fk_status_cita ON fk_status_cita.id=citas.status WHERE citas.cliente = {id} AND casos.capturadedatos = 0 ORDER BY casos.fecha DESC;")
    casos = cursor.fetchall()
    casos = [{"idcaso": a[0], "idbeneficiario": a[1], "nombreb": a[2], "telefono1": a[3], "telefono2": a[4], "pertenecetel2": a[5], "fechacaso": a[6], "caso": a[7], "tipocaso": a[8], "statuscaso": a[9], "colorstatuscaso": a[10], "asignado": a[11], "citasfecha": a[12], "tipocita": a[13], "statuscita": a[14]} for a in casos]
    
    cursor.execute(f"SELECT casos.id AS idcaso, DATE_FORMAT(casos.fecha, '%m/%d/%Y • %h:%i %p') as fechacaso, fk_tipo_caso.tipocaso, auth.fullname AS asignado, CONCAT(DATE_FORMAT(citas.fecha, '%m/%d/%Y'),' a las ', DATE_FORMAT(citas.hora, '%h:%i %p')) AS citasfecha, fk_tipo_cita.tipocita AS tipocita, fk_status_cita.statuscita AS statuscita, casos.califica FROM citas JOIN casos ON citas.caso=casos.id JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo JOIN auth ON casos.asignado = auth.id JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo JOIN fk_status_cita ON fk_status_cita.id=citas.status WHERE casos.idcliente = {id} AND casos.capturadedatos = 1 ORDER BY casos.fecha DESC;")
    casos_sinabrir = cursor.fetchall()
    casos_sinabrir = [{"idcaso": a[0], "fechacaso": a[1], "tipocaso":a[2], "asignado": a[3], "citasfecha": a[4], "tipocita": a[5], "statuscita": a[6], "califica": a[7]} for a in casos_sinabrir]
    
    cursor.execute(f"SELECT rol FROM auth WHERE id = {current_user.id}")
    rol = cursor.fetchone()
    
    cursor.close()
    perfil = {
        "datos": datos,
        "casos": casos,
        "rol": rol,
        "casos_sinabrir": casos_sinabrir
    }
    return jsonify(perfil);

@app.route("/caso/<int:id>", methods=["GET"])
@login_required
def obtener_caso(id):
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT casos.id AS idcaso, idbeneficiario, beneficiarios.nombre AS nombreb, beneficiarios.telefono1, beneficiarios.telefono2, beneficiarios.pertenecetel2, casos.idcliente, clientes.nombre AS nombrec, DATE_FORMAT(casos.fecha, '%m/%d/%Y') as fechacaso, casos.caso, fk_tipo_caso.tipocaso, fk_status_caso.statuscaso, casos.asignado AS idasignado, auth.fullname AS asignado, casos.tipo AS idtipocaso, casos.status AS idstatuscaso, beneficiarios.domicilio, beneficiarios.ciudad, beneficiarios.cp, beneficiarios.email, beneficiarios.relacion, casos.capturadedatos, casos.califica FROM casos JOIN beneficiarios ON casos.idbeneficiario=beneficiarios.id JOIN clientes ON casos.idcliente=clientes.id JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo JOIN fk_status_caso ON casos.status=fk_status_caso.id JOIN auth ON casos.asignado = auth.id WHERE casos.id = {id};")
    caso = cursor.fetchone()
    caso = {"idcaso": caso[0], "idbeneficiario": caso[1], "nombreb": caso[2], "telefono1": caso[3], "telefono2": caso[4], "pertenecetel2": caso[5], "idcliente": caso[6], "nombrec": caso[7], "fechacaso": caso[8], "caso": caso[9], "tipocaso": caso[10], "statuscaso": caso[11], "idasignado": caso[12], "asignado": caso[13], "idtipocaso": caso[14], "idstatuscaso": caso[15], "domicilio": caso[16], "ciudad": caso[17], "cp": caso[18], "email": caso[19], "relacion": caso[20], "capturadedatos": caso[21], "idcalifica": caso[22]}
    
    cursor.execute(f"SELECT citas.id, CONCAT(DATE_FORMAT(citas.fecha, '%m/%d/%Y'), ' a las ',  DATE_FORMAT(citas.hora, '%h:%i %p')) AS fechacita, citas.razon, citas.resultado, auth.fullname AS asignado, auth.id AS idasignado, citas.tipo AS idtipocita, fk_tipo_cita.tipocita AS tipocita, citas.status AS idstatuscita, fk_status_cita.statuscita AS statuscita, fk_status_cita.colorstatuscita, citas.done, CONCAT(citas.fecha) AS citafechaoriginal, CONCAT(citas.hora) AS citahoraoriginal FROM citas JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo JOIN fk_status_cita ON fk_status_cita.id=citas.status JOIN auth ON citas.asignado=auth.id WHERE citas.caso = {id} ORDER BY citas.fecha DESC, citas.hora DESC;")
    citas = cursor.fetchall()
    citas = [{"idcita": a[0], "fechacita": a[1], "razon": a[2], "resultado": a[3], "asignado": a[4], "idasignado": a[5], "idtipocita": a[6], "tipocita": a[7], "idstatuscita": a[8], "statuscita": a[9], "colorstatuscita": a[10], "done": a[11], "citafechaoriginal": a[12], "citahoraoriginal": a[13]} for a in citas]
    
    cursor.execute(f"SELECT rol FROM auth WHERE id = {current_user.id}")
    rol = cursor.fetchone()
    
    cursor.execute("SELECT id AS idasesor, fullname AS asesor FROM auth WHERE clasificacion = 'asesor';")
    asesores = cursor.fetchall()
    asesores = [{"idasesor": a[0], "asesor": a[1]} for a in asesores]
    
    cursor.execute("SELECT id AS idstatus, statuscaso AS status FROM fk_status_caso WHERE id != 0;")
    status = cursor.fetchall()
    status = [{"idstatus": a[0], "status": a[1]} for a in status]
    
    cursor.execute("SELECT id AS idstatuscita, statuscita FROM fk_status_cita WHERE id != 0;")
    statuscita = cursor.fetchall()
    statuscita = [{"idstatuscita": a[0], "statuscita": a[1]} for a in statuscita]
    
    cursor.execute("SELECT id AS idtipocita, tipocita FROM fk_tipo_cita WHERE id != 0;")
    tipocita = cursor.fetchall()
    tipocita = [{"idtipocita": a[0], "tipocita": a[1]} for a in tipocita]
    
    cursor.execute("SELECT id AS idtipo, tipocaso AS tipo FROM fk_tipo_caso WHERE id != 0;")
    tipos = cursor.fetchall()
    tipos = [{"idtipo": a[0], "tipo": a[1]} for a in tipos]
    
    cursor.execute("SELECT id AS idcalifica, califica FROM califica;")
    califica = cursor.fetchall()
    califica = [{"idcalifica": a[0], "califica": a[1]} for a in califica]
    
    cursor.execute(f"SELECT casos_actualizaciones.id, DATE_FORMAT(creado, '%m/%d/%Y • %h:%i %p') AS creado, actualizacion, auth.fullname AS agente FROM casos_actualizaciones JOIN auth ON casos_actualizaciones.agente=auth.id WHERE casos_actualizaciones.idcaso = {id} ORDER BY casos_actualizaciones.creado DESC;")
    actualizaciones = cursor.fetchall()
    actualizaciones = [{"id": a[0], "creado": a[1], "actualizacion": a[2], "agente": a[3]} for a in actualizaciones]
    
    cursor.execute(f"SELECT documentos.id AS iddoc, nombre, CASE WHEN documentos.clasificacion IS NULL OR documentos.clasificacion = '' THEN '* Sin clasificación' ELSE documentos.clasificacion END AS clasificacion, DATE_FORMAT(fecha, ' el %m/%d/%Y a las %h:%i %p') AS fecha, auth.fullname AS creador FROM documentos JOIN auth ON documentos.creador = auth.id WHERE documentos.caso = {id} ORDER BY documentos.fecha DESC;")
    documentos = cursor.fetchall()
    documentos = [{"iddoc": a[0], "nombre": a[1], "clasificacion": a[2], "fecha": a[3], "creador": a[4]} for a in documentos]
    
    cursor.execute("SELECT id, clasificacion FROM documentos_clasificaciones WHERE id != 0 ORDER BY id;")
    documentos_clasificaciones = cursor.fetchall()
    documentos_clasificaciones = [{"id": a[0], "clasificacion": a[1]} for a in documentos_clasificaciones]
    
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
        "califica": califica
    }
    cursor.close()
    return jsonify(resultados)
    
@app.route("/perfil/guardar-datos", methods=["POST"])
@login_required
def perfil_guardar_datos():
    datos = request.json
    print(datos)
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
    cursor.execute("UPDATE clientes SET nombre = %s, telefono1 = %s, telefono2 = %s, pertenecetel2 = %s, telefono3 = %s, pertenecetel3 = %s, domicilio = %s, ciudad = %s, cp = %s, email = %s WHERE id = %s", (nombre, telefono1, telefono2, datos["pertenecetel2"].strip().upper(), telefono3, pertenecetel3.strip().upper() , datos["domicilio"].strip().upper(), datos["ciudad"].strip().upper(), datos["cp"].strip().upper(), datos["email"].strip().upper(), datos["id"]))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Datos de "+nombre+" guardados correctamente."})

@app.route("/caso/guardar-datos", methods=["POST"])
@login_required
def caso_guardar_datos():
    datos = request.json
    ncaso = datos.get("idcaso")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE casos SET caso = %s, tipo = %s, status = %s, asignado = %s, califica = %s WHERE id = %s", (datos.get("caso").strip().upper(), datos.get("idtipocaso"), datos.get("idstatuscaso"), datos.get("idasignado"), datos.get("idcalifica"), ncaso))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Datos del caso "+str(ncaso)+" guardados correctamente."})

@app.route("/caso/guardar-cita", methods=["POST"])
@login_required
def caso_guardar_cita():
    data = request.json
    idcita = data.get("idcita")
    tipocita = data.get("idtipocita")
    statuscita = data.get("idstatuscita")
    razon = data.get("razon")
    resultado = data.get("resultado")
    asignado = data.get("idasignado")
    done = data.get("done")
    fecha = data.get("citafechaoriginal")
    hora = data.get("citahoraoriginal")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE citas SET fecha = %s, hora = %s, tipo = %s, status = %s, razon = %s, resultado = %s, asignado = %s, done = %s WHERE id = %s", (fecha, hora, tipocita, statuscita, razon, resultado, asignado, done, idcita))
    mysql.connection.commit()
    cursor.close()
    # Convertir fecha y hora a objetos datetime
    fecha_obj = datetime.strptime(fecha, "%Y-%m-%d")
    hora_obj = datetime.strptime(hora, "%H:%M:%S")

    # Formatear fecha y hora
    fecha_formateada = fecha_obj.strftime("%m/%d/%Y")
    hora_formateada = hora_obj.strftime("%I:%M %p")
    return jsonify({"mensaje": "Cita actualizada correctamente para el "+fecha_formateada+" a las "+hora_formateada})

@app.route("/caso/nueva-cita", methods=["POST"])
@login_required
def caso_nueva_cita():
    data = request.json
    fecha = data["selectedDateNuevaCita"]
    hora = data["selectedHourNuevaCita"]
    nueva = data.get("nuevaCita")
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO citas (cliente, caso, fecha, hora, tipo, status, razon, creador, asignado, done) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 0)", (nueva["idcliente"], nueva["idcaso"], fecha, hora, nueva["tipo"], nueva["status"], nueva["razon"].upper().strip(), current_user.id, nueva["asignado"]))
    mysql.connection.commit()
    cursor.close()
    
    # Convertir fecha y hora a objetos datetime
    fecha_obj = datetime.strptime(fecha, "%Y-%m-%d")
    hora_obj = datetime.strptime(hora, "%H:%M:%S")

    # Formatear fecha y hora
    fecha_formateada = fecha_obj.strftime("%m/%d/%Y")
    hora_formateada = hora_obj.strftime("%I:%M %p")
    return jsonify({"mensaje": "Cita agendada correctamente para el "+fecha_formateada+" a las "+hora_formateada})

@app.route("/caso/actualizacion/nueva", methods=["POST"])
@login_required
def nueva_actualizacion_caso():
    datos = request.json
    id = datos.get("id")
    actualizacion = datos.get("actualizacion").strip().upper()
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO casos_actualizaciones (idcaso, creado, actualizacion, agente) VALUES (%s, now(), %s, %s)", (id, actualizacion, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Actualización de "+current_user.fullname+" guardada correctamente."})

@app.route("/caso/<int:idcaso>/documento/<int:iddoc>", methods=["GET"])
@login_required
def obtener_documento(idcaso, iddoc):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT nombre, documento FROM documentos WHERE id = %s AND caso = %s", (iddoc, idcaso))
    documento = cursor.fetchone()
    cursor.close()

    if documento:
        nombre, contenido = documento
        return send_file(
            io.BytesIO(contenido),
            download_name=nombre,
            as_attachment=True
        )
    else:
        return jsonify({"mensaje": "Documento no encontrado"}), 404

@app.route("/documento/<int:id>/editar-clasificacion", methods=["POST"])
@login_required
def doc_editar_clasificacion(id):
    nueva_clasificacion = request.json.get('clasificacion')
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE documentos SET clasificacion = %s WHERE id = %s", (nueva_clasificacion, id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Clasificación actualizada correctamente."})

@app.route("/documento/<int:id>/editar-nombre", methods=["POST"])
@login_required
def doc_editar_nombre(id):
    nuevo_nombre = request.json.get('nombre').upper().strip()
    nuevo_nombre = nuevo_nombre+".pdf"
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE documentos SET nombre = %s WHERE id = %s", (nuevo_nombre, id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Nombre del documento actualizado correctamente."})

@app.route("/documento/<int:id>/eliminar", methods=["POST"])
@login_required
def doc_eliminar(id):
    rol = request.json.get('rol')
    if rol == current_user.rol:
        cursor = mysql.connection.cursor()
        cursor.execute(f"DELETE FROM documentos WHERE id = {id}")
        mysql.connection.commit()
        cursor.close()
        mensaje= "Documento eliminador correctamente."
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
            filename = secure_filename(archivo.filename)
            mime_type = archivo.content_type
            archivo_blob = archivo.read()
            cursor.execute("INSERT INTO documentos (cliente, caso, nombre, documento, tipo, clasificacion, fecha, creador) VALUES (%s, %s, %s, %s, %s, 0, now(), %s)", (idcliente, idcaso, filename, archivo_blob, mime_type, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Documentos cargados con éxito."})

@app.route("/beneficiario/guardar-datos", methods=["POST"])
@login_required
def beneficiario_guardar_datos():
    data = request.json
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
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Datos del beneficiario "+str(nombreb)+" guardados correctamente."})

@app.route("/agenda", methods=["GET"])
@login_required
def agenda():
    fecha = request.args.get('fecha', default=datetime.today().strftime('%Y-%m-%d'))
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT citas.id AS idcita, citas.cliente AS idcliente, clientes.nombre AS nombrecliente, clientes.telefono1, clientes.telefono2, clientes.pertenecetel2, clientes.clasificacion, citas.caso AS idcaso, casos.caso AS nombrecaso, fk_tipo_caso.tipocaso, DATE_FORMAT(citas.fecha, '%m/%d/%Y') AS fecha, DATE_FORMAT(citas.hora, '%h:%i %p') AS hora, fk_tipo_cita.tipocita, citas.status, fk_status_cita.statuscita, fk_status_cita.colorstatuscita, citas.razon, citas.resultado, citas.done, citas.asignado AS idasignado, auth.fullname AS asignado, fk_oficina.oficina AS oficina FROM citas JOIN clientes ON citas.cliente=clientes.id JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo JOIN fk_status_cita ON fk_status_cita.id=citas.status JOIN auth ON auth.id = citas.asignado JOIN casos ON citas.caso = casos.id JOIN fk_oficina ON fk_oficina.id=clientes.oficina JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo WHERE citas.fecha = '{fecha}' ORDER BY citas.hora ASC;")
    citas = cursor.fetchall()
    citas = [{"idcita": a[0], "idcliente": a[1], "nombrecliente": a[2], "telefono1": a[3], "telefono2": a[4], "pertenecetel2": a[5], "clasificacion": a[6], "idcaso": a[7], "nombrecaso": a[8], "tipocaso": a[9], "fecha": a[10], "hora": a[11], "tipocita": a[12], "status": a[13], "statuscita": a[14], "colorstatuscita": a[15], "razon": a[16], "resultado": a[17], "done": a[18], "idasignado": a[19], "asignado": a[20], "oficina": a[21]} for a in citas]
    cursor.execute(f"SELECT rol FROM auth WHERE id = {current_user.id}")
    rol = cursor.fetchone()
    cursor.execute("SELECT id, fullname FROM auth WHERE id != 0 ORDER BY fullname;")
    asesores = cursor.fetchall()
    asesores = [{"id": a[0], "fullname": a[1]} for a in asesores]
    
    cursor.close()
    
    agenda = {
        "citas": citas,
        "rol": rol,
        "asesores": asesores
    }
    return jsonify(agenda)
    
app.config.from_object(config['development'])

if __name__ == "__main__":
    app.run(port=5002, debug=True)
