from flask import Flask, request, jsonify, send_file
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mysqldb import MySQL
import bcrypt, os, io
from flask_cors import CORS
from config import config
from dotenv import load_dotenv

from werkzeug.utils import secure_filename

from datetime import datetime
from dateutil.relativedelta import relativedelta

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

@app.route("/usuario/nuevo", methods=["POST"])
@login_required
def nuevoUsuario():
    data = request.json
    print(data)
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
    
    cursor.execute("SELECT id, tipocaso FROM fk_tipo_caso ORDER BY tipocaso")
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
    
    cursor.close()
    
    resultados = {
        "oficina": oficina,
        "referido": referido,
        "tipocita": tipo_cita,
        "citas_calendario": citas_calendario,
        "tipo_caso": tipo_caso,
        "asesores": asesores,
        "fechas_bloqueadas": fechas_bloqueadas,
        "subclase": subclase
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
    
    cursor.execute("SELECT * from fk_tipo_caso ORDER BY tipocaso;")
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
    return jsonify({"resultados": resultados, "selects": selects})

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
    razonCita = request.form.get("razonCita").strip().upper()
    oficina = request.form.get("selectedOficina")
    tipoCaso = request.form.get("selectedTipoCaso")
    tipoCita = request.form.get("selectedTipoCita")
    referido = request.form.get("selectedReferido")
    fecha = request.form.get("selectedDate")
    hora = request.form.get("selectedHour")
    asignado = request.form.get("selectedAsesor")
    pertenece = request.form.get("pertenece").strip().upper()
    subclase = request.form.get("selectedSubclase")
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
        cursor.execute("INSERT INTO casos (idcliente, idbeneficiario, fecha, tipo, status, creador, asignado, capturadedatos, califica, subclase) VALUES (%s, %s, %s, %s, 1, %s, %s, 1, 3, %s)", (idcliente, n_beneficiario, registrado, tipoCaso, current_user.id, asignado, subclase))
        cursor.execute("SELECT id FROM casos WHERE fecha = %s", (registrado,))
        n_caso = cursor.fetchone()[0]
        
    if fecha:
        cursor.execute("INSERT INTO citas (cliente, caso, fecha, hora, tipo, status, razon, creador, asignado) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (idcliente, n_caso, fecha, hora, tipoCita, 1, razonCita, current_user.id, asignado))
        cursor.execute("SELECT id FROM citas WHERE cliente = %s AND caso = %s ORDER BY id DESC LIMIT 1", (idcliente, n_caso))
        idcita = cursor.fetchone()[0]
    
    for archivo in archivos:
        if archivo:
            filename = secure_filename(archivo.filename)
            mime_type = archivo.content_type
            archivo_blob = archivo.read()
            cursor.execute("INSERT INTO documentos (cliente, caso, nombre, documento, tipo, clasificacion, fecha, creador) VALUES (%s, %s, %s, %s, %s, 0, now(), %s)", (idcliente, n_caso, filename, archivo_blob, mime_type, current_user.id))
    cursor.execute("INSERT INTO log (cliente, caso, cita, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, %s, now())", (idcliente, n_caso, idcita, "Captura de datos de nuevo cliente.", current_user.id))
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
    subclase = request.form.get("selectedSubclase")
    archivos = request.files.getlist("files")
    
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT now()")
    registrado = cursor.fetchone()[0]
    
    n_caso = None
    if tipoCaso:
        cursor.execute(f"INSERT INTO beneficiarios (nombre, telefono1, telefono2, pertenecetel2, domicilio, ciudad, cp, email, cliente) VALUES ('','','','','','','','', {idcliente})")
        cursor.execute(f"SELECT id FROM beneficiarios WHERE cliente = {idcliente} ORDER BY id DESC LIMIT 1")
        n_beneficiario = cursor.fetchone()[0]
        cursor.execute("INSERT INTO casos (idcliente, idbeneficiario, fecha, tipo, status, creador, asignado, capturadedatos, califica, subclase) VALUES (%s, %s, %s, %s, %s, 1, %s, %s, 1, 3, %s)", (idcliente, n_beneficiario, registrado, tipoCaso, current_user.id, asignado, subclase))
        cursor.execute("SELECT id FROM casos WHERE fecha = %s", (registrado,))
        n_caso = cursor.fetchone()[0]
        
    if fecha:
        cursor.execute("INSERT INTO citas (cliente, caso, fecha, hora, tipo, status, razon, creador, asignado) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (idcliente, n_caso, fecha, hora, tipoCita, 1, razonCita, current_user.id, asignado))
        cursor.execute("SELECT id FROM citas WHERE cliente = %s AND caso = %s ORDER BY id DESC LIMIT 1", (idcliente, n_caso))
        idcita = cursor.fetchone()[0]
    
    for archivo in archivos:
        if archivo:
            filename = secure_filename(archivo.filename)
            mime_type = archivo.content_type
            archivo_blob = archivo.read()
            cursor.execute("INSERT INTO documentos (cliente, caso, nombre, documento, tipo, clasificacion, fecha, creador) VALUES (%s, %s, %s, %s, %s, 0, now(), %s)", (idcliente, n_caso, filename, archivo_blob, mime_type, current_user.id))
    cursor.execute("INSERT INTO log (cliente, caso, cita, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, %s, now())", (idcliente, n_caso, idcita, "Registro de nueva consulta.", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Datos de "+nombre+" registrados con éxito.", "status": 200})

@app.route("/busqueda", methods=["GET"])
@login_required
def busqueda():
    query = request.args.get('query').strip()
    if query:
        cursor = mysql.connection.cursor()
        ##if query.isdigit():
            #cursor.execute(f"SELECT clientes.id AS id, clientes.nombre AS nombre, GROUP_CONCAT(DISTINCT casos.id ORDER BY casos.id SEPARATOR ', ') AS casos, GROUP_CONCAT(DISTINCT beneficiarios.nombre ORDER BY beneficiarios.nombre SEPARATOR ', ') AS beneficiarios, clasificacion FROM clientes LEFT JOIN casos ON casos.idcliente = clientes.id LEFT JOIN beneficiarios ON beneficiarios.cliente = clientes.id GROUP BY clientes.id HAVING casos = {query} ORDER BY clientes.nombre ASC;")
            ##cursor.execute(f"SELECT clientes.id AS id, clientes.nombre AS nombre,clientes.telefono1 AS telefono, GROUP_CONCAT(DISTINCT CASE WHEN casos.capturadedatos = 0 THEN casos.id END ORDER BY casos.id SEPARATOR ', ') AS casos, GROUP_CONCAT(DISTINCT CASE WHEN casos.capturadedatos = 1 THEN casos.id END ORDER BY casos.id SEPARATOR ', ') AS consultas, GROUP_CONCAT(DISTINCT beneficiarios.nombre ORDER BY beneficiarios.nombre SEPARATOR ', ') AS beneficiarios, clasificacion FROM clientes LEFT JOIN casos ON casos.idcliente = clientes.id LEFT JOIN beneficiarios ON beneficiarios.cliente = clientes.id GROUP BY clientes.id HAVING casos = {query} OR consultas = {query} OR telefono = {query} ORDER BY clientes.nombre ASC;")
        ##else:
            #cursor.execute(f"SELECT clientes.id AS id, clientes.nombre AS nombre, GROUP_CONCAT(DISTINCT casos.id ORDER BY casos.id SEPARATOR ', ') AS casos, GROUP_CONCAT(DISTINCT beneficiarios.nombre ORDER BY beneficiarios.nombre SEPARATOR ', ') AS beneficiarios, clasificacion FROM clientes LEFT JOIN casos ON casos.idcliente = clientes.id LEFT JOIN beneficiarios ON beneficiarios.cliente = clientes.id GROUP BY clientes.id HAVING clientes.nombre LIKE '%{query}%' OR beneficiarios LIKE '%{query}%' OR casos LIKE '%{query}%' ORDER BY clientes.nombre ASC;")
            ##cursor.execute(f"SELECT clientes.id AS id, clientes.nombre AS nombre, clientes.telefono1 AS telefono, GROUP_CONCAT(DISTINCT CASE WHEN casos.capturadedatos = 0 THEN casos.id END ORDER BY casos.id SEPARATOR ', ') AS casos, GROUP_CONCAT(DISTINCT CASE WHEN casos.capturadedatos = 1 THEN casos.id END ORDER BY casos.id SEPARATOR ', ') AS consultas, GROUP_CONCAT(DISTINCT beneficiarios.nombre ORDER BY beneficiarios.nombre SEPARATOR ', ') AS beneficiarios, clasificacion FROM clientes LEFT JOIN casos ON casos.idcliente = clientes.id LEFT JOIN beneficiarios ON beneficiarios.cliente = clientes.id GROUP BY clientes.id HAVING clientes.nombre LIKE '%{query}%' OR beneficiarios LIKE '%{query}%' OR casos LIKE '%{query}%' OR consultas LIKE '%{query}%' OR telefono LIKE '%{query}%' ORDER BY clientes.nombre ASC;")
        cursor.execute(f"SELECT clientes.id AS id, clientes.nombre AS nombre, clientes.telefono1 AS telefono, GROUP_CONCAT(DISTINCT CASE WHEN casos.capturadedatos = 0 THEN casos.id END ORDER BY casos.id SEPARATOR ', ') AS casos, GROUP_CONCAT(DISTINCT CASE WHEN casos.capturadedatos = 1 THEN casos.id END ORDER BY casos.id SEPARATOR ', ') AS consultas, GROUP_CONCAT(DISTINCT beneficiarios.nombre ORDER BY beneficiarios.nombre SEPARATOR ', ') AS beneficiarios, clasificacion FROM clientes LEFT JOIN casos ON casos.idcliente = clientes.id LEFT JOIN beneficiarios ON beneficiarios.cliente = clientes.id GROUP BY clientes.id HAVING clientes.nombre LIKE '%{query}%' OR beneficiarios LIKE '%{query}%' OR casos LIKE '%{query}%' OR consultas LIKE '%{query}%' OR telefono LIKE '%{query}%' ORDER BY clientes.nombre ASC;")
        busqueda = cursor.fetchall()
        busqueda = [{"id": a[0], "nombre": a[1], "telefono": a[2], "casos": a[3], "consultas": a[4], "beneficiarios": a[5], "clasificacion": a[6]} for a in busqueda]
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
    cursor.execute(f"SELECT casos.id AS idcaso, beneficiarios.id AS idbeneficiario, beneficiarios.nombre AS nombreb, beneficiarios.telefono1, beneficiarios.telefono2, beneficiarios.pertenecetel2, DATE_FORMAT(casos.fecha, '%m/%d/%Y • %h:%i %p') AS fechacaso, casos.caso, fk_tipo_caso.tipocaso, fk_status_caso.statuscaso, fk_status_caso.colorstatuscaso, auth.fullname AS asignado, CONCAT(DATE_FORMAT(citas.fecha, '%m/%d/%Y'),' a las ', DATE_FORMAT(citas.hora, '%H:%i %p')) AS citasfecha, fk_tipo_cita.tipocita AS tipocita, fk_status_cita.statuscita AS statuscita, fk_status_cita.colorstatuscita AS colorstatuscita, tipo_caso_subclase.subclase AS subclase, fk_tipo_cita.colortipocita FROM citas JOIN casos ON casos.id=citas.caso JOIN beneficiarios ON beneficiarios.id=casos.idbeneficiario JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo JOIN fk_status_caso ON casos.status=fk_status_caso.id JOIN auth ON casos.asignado = auth.id JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo JOIN fk_status_cita ON fk_status_cita.id=citas.status JOIN tipo_caso_subclase ON tipo_caso_subclase.id=casos.tipo WHERE citas.cliente = {id} AND casos.capturadedatos = 0 GROUP BY casos.id ORDER BY casos.fecha DESC;")
    casos = cursor.fetchall()
    casos = [{"idcaso": a[0], "idbeneficiario": a[1], "nombreb": a[2], "telefono1": a[3], "telefono2": a[4], "pertenecetel2": a[5], "fechacaso": a[6], "caso": a[7], "tipocaso": a[8], "statuscaso": a[9], "colorstatuscaso": a[10], "asignado": a[11], "citasfecha": a[12], "tipocita": a[13], "statuscita": a[14], "colorstatuscita": a[15], "subclase":a[16], "colortipocita": a[17]} for a in casos]
    
    cursor.execute(f"SELECT casos.id AS idcaso, DATE_FORMAT(casos.fecha, '%m/%d/%Y • %h:%i %p') as fechacaso, fk_tipo_caso.tipocaso, auth.fullname AS asignado, CONCAT(DATE_FORMAT(citas.fecha, '%m/%d/%Y'),' a las ', DATE_FORMAT(citas.hora, '%h:%i %p')) AS citasfecha, fk_tipo_cita.tipocita AS tipocita, fk_status_cita.statuscita AS statuscita, casos.caso AS nombrecaso, tipo_caso_subclase.subclase AS subclase, califica.califica, califica.colorcalifica, fk_tipo_cita.colortipocita FROM citas JOIN casos ON citas.caso=casos.id JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo JOIN auth ON casos.asignado = auth.id JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo JOIN fk_status_cita ON fk_status_cita.id=citas.status JOIN tipo_caso_subclase ON tipo_caso_subclase.id=casos.tipo JOIN califica ON casos.califica = califica.id WHERE casos.idcliente = {id} AND casos.capturadedatos = 1 GROUP BY casos.id ORDER BY casos.fecha DESC;")
    casos_sinabrir = cursor.fetchall()
    casos_sinabrir = [{"idcaso": a[0], "fechacaso": a[1], "tipocaso":a[2], "asignado": a[3], "citasfecha": a[4], "tipocita": a[5], "statuscita": a[6], "nombrecaso": a[7], "subclase": a[8], "califica": a[9], "colorcalifica": a[10], "colortipocita": a[11]} for a in casos_sinabrir]
    
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
    
    cursor.execute("SELECT id AS idtipo, tipocaso AS tipo FROM fk_tipo_caso;")
    tipos = cursor.fetchall()
    tipos = [{"idtipo": a[0], "tipo": a[1]} for a in tipos]
    
    cursor.execute("SELECT id AS idcalifica, califica FROM califica;")
    califica = cursor.fetchall()
    califica = [{"idcalifica": a[0], "califica": a[1]} for a in califica]
    
    cursor.execute(f"SELECT casos_actualizaciones.id, DATE_FORMAT(creado, '%m/%d/%Y • %h:%i %p') AS creado, actualizacion, auth.fullname, esresultado AS agente FROM casos_actualizaciones JOIN auth ON casos_actualizaciones.agente=auth.id WHERE casos_actualizaciones.idcaso = {id} ORDER BY casos_actualizaciones.creado DESC;")
    actualizaciones = cursor.fetchall()
    actualizaciones = [{"id": a[0], "creado": a[1], "actualizacion": a[2], "agente": a[3], "esresultado": a[4]} for a in actualizaciones]
    
    cursor.execute(f"SELECT documentos.id AS iddoc, nombre, CASE WHEN documentos.clasificacion IS NULL OR documentos.clasificacion = '' THEN '* Sin clasificación' ELSE documentos.clasificacion END AS clasificacion, DATE_FORMAT(fecha, ' el %m/%d/%Y a las %h:%i %p') AS fecha, auth.fullname AS creador FROM documentos JOIN auth ON documentos.creador = auth.id WHERE documentos.caso = {id} ORDER BY documentos.fecha DESC;")
    documentos = cursor.fetchall()
    documentos = [{"iddoc": a[0], "nombre": a[1], "clasificacion": a[2], "fecha": a[3], "creador": a[4]} for a in documentos]
    
    cursor.execute("SELECT id, clasificacion FROM documentos_clasificaciones ORDER BY id;")
    documentos_clasificaciones = cursor.fetchall()
    documentos_clasificaciones = [{"id": a[0], "clasificacion": a[1]} for a in documentos_clasificaciones]
    
    cursor.execute("SELECT pagos.id, DATE_FORMAT(pagos.fecha, '%%m/%%d/%%Y'), pagos.monto, pagos_tipo.tipo, pagos.nombretipopago, pagos.numerotarjeta, pagos.tipo, pagos.pagado FROM pagos_control JOIN pagos ON pagos.control=pagos_control.id JOIN pagos_tipo ON pagos_tipo.id=pagos.tipo WHERE pagos_control.caso = %s AND pagos.pagado = 1 OR pagos.pagado = 3", (id,))
    pagos = cursor.fetchall()
    pagos = [{"id": a[0], "fecha": a[1], "monto": a[2], "tipo": a[3], "nombretipopago": a[4], "numerotarjeta": a[5], "idtipo": a[6], "pagado": a[7]} for a in pagos]
    total_monto = sum(pago['monto'] for pago in pagos)
    
    cursor.execute("SELECT pagos_control.id, cartasenviadas, pagos_estados.estado, valor, entrega, ncuota, cuota, pagos_control.estado FROM pagos_control JOIN pagos_estados ON pagos_control.estado = pagos_estados.id WHERE pagos_control.caso = %s", (id,))
    pagos_control = cursor.fetchone()
    if pagos_control:
        pagos_control = {"id": pagos_control[0], "cartasenviadas": pagos_control[1], "estado": pagos_control[2], "valor": pagos_control[3], "entrega": pagos_control[4], "ncuota": pagos_control[5], "cuota": pagos_control[6], "idestado": pagos_control[7]}
        deudatotal = int(pagos_control['valor']) - int(pagos_control['entrega']) - total_monto
        cursor.execute("SELECT SUM(monto), DATE_FORMAT((SELECT DATE_ADD(fecha, INTERVAL 1 MONTH) FROM pagos ORDER BY fecha DESC LIMIT 1), '%%m/%%d/%%Y') FROM pagos WHERE control = %s;", (pagos_control['id'],))
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
    
    cursor.execute("SELECT pagos_notas.id, pagos_notas.fecha, pagos_notas.nota FROM pagos_control JOIN pagos_notas ON pagos_notas.control=pagos_control.id WHERE pagos_control.caso = %s", (id,))
    pagos_notas = cursor.fetchall()
    pagos_notas = [{"id": a[0], "fecha": a[1], "nota": a[2]} for a in pagos_notas]
    
    cursor.execute("SELECT id, estado, colorestado FROM pagos_estados ORDER BY estado;")
    pagos_estados = cursor.fetchall()
    pagos_estados = [{"id": a[0], "estado": a[1], "colorestado": a[2]} for a in pagos_estados]
    
    cursor.execute("SELECT id, tipo FROM pagos_tipo ORDER BY tipo;")
    pagos_tipos = cursor.fetchall()
    pagos_tipos = [{"id": a[0], "tipo": a[1]} for a in pagos_tipos]
    
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
        "pagos_notas": pagos_notas,
        "pagos_estados": pagos_estados,
        "deudatotal": deudatotal,
        "no_pagos": no_pagos,
        "saldo_restante": saldo_restante,
        "pagos_tipos": pagos_tipos
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
    return jsonify({"mensaje": "Datos de "+nombre+" guardados correctamente."})

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
    return jsonify({"mensaje": "Datos del caso "+str(ncaso)+" guardados correctamente."})

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
    return jsonify({"mensaje": "Caso N°"+str(ncaso)+" abierto correctamente."})

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
    return jsonify({"mensaje": "Cita actualizada correctamente para el "+fecha_formateada+" a las "+hora_formateada})

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
    return jsonify({"mensaje": "Cita agendada correctamente para el "+fecha_formateada+" a las "+hora_formateada})

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
    return jsonify({"mensaje": "Actualización de "+current_user.fullname+" guardada correctamente."})

@app.route("/caso/pago/control/actualizar", methods=["POST"])
@login_required
def caso_pago_control_actualizar():
    datos = request.json
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE pagos_control SET cartasenviadas = %s, estado = %s WHERE id = %s", (datos.get("cartas"), datos.get("estado"), datos.get("idpago")))
    cursor.execute("INSERT INTO log (caso, movimiento, agente, fecha, otro) VALUES (%s, %s, %s, now(), 'PAGOS')", (datos.get("idcaso"), "Actualizó los datos de control de pagos.", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Datos de control de pagos actualizados correctamente."})

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
        cursor.execute("INSERT INTO pagos (control, fecha, monto, tipo, pagado) VALUES (%s, current_date(), %s, 1, 3)", (datos.get("idcontrol"), datos.get("monto")))
        cursor.execute("INSERT INTO log (cliente, caso, movimiento, agente, fecha, otro) VALUES (%s, %s, %s, %s, now(), 'PAGOS')", (datos.get("idcliente"), datos.get("idcaso"), "Registró un pago de SALDO PENDIENTE de "+monto_formateado, current_user.id))
        cursor.execute("INSERT INTO casos_actualizaciones (idcaso, creado, actualizacion, agente, esresultado) VALUES (%s, now(), %s, %s, 2)", (datos.get("idcaso"), "PAGÓ UN SALDO PENDIENTE DE $ "+monto_formateado+".", current_user.id))
    else:
        cursor.execute("UPDATE pagos SET monto = %s, fecha = current_date(), pagado = 1, tipo = %s, nombretipopago = %s, numerotarjeta = %s WHERE id = %s", (datos.get("monto"), datos.get("tipo"), datos.get("nombre_tarjeta"), datos.get("numero_tarjeta"), datos.get("idpago")))
        cursor.execute("SELECT DATE_FORMAT(fecha, '%%m/%%d/%%Y'), monto FROM pagos WHERE pagado = 0 AND control = %s LIMIT 1;", (datos.get("idcontrol"),))
        proxima_cuota = cursor.fetchone()
        if datos.get("monto") == datos.get("monto_original"):
            cuota_o_abono = "CUOTA"
            cursor.execute("INSERT INTO log (cliente, caso, movimiento, agente, fecha, otro) VALUES (%s, %s, %s, %s, now(), 'PAGOS')", (datos.get("idcliente"), datos.get("idcaso"), "Registró un pago de CUOTA de "+monto_formateado, current_user.id))
        else:
            cuota_o_abono = "ABONO"
            cursor.execute("INSERT INTO log (cliente, caso, movimiento, agente, fecha, otro) VALUES (%s, %s, %s, %s, now(), 'PAGOS')", (datos.get("idcliente"), datos.get("idcaso"), "Registró un pago de ABONO diferente al valor de la cuota de "+monto_formateado, current_user.id))
        if proxima_cuota:
                #Se valida Plan de Pagos Cl cumple con cuota de $375 para el dia 05/01/2025- Próximo Pago por valor de $375 para el dia 06/01/2025
                cursor.execute("INSERT INTO casos_actualizaciones (idcaso, creado, actualizacion, agente, esresultado) VALUES (%s, now(), %s, %s, 2)", (datos.get("idcaso"), "SE VALIDA PLAN DE PAGOS CL CUMPLE CON "+cuota_o_abono+" DE $ "+monto_formateado+" PARA EL DÍA "+datos.get("fecha_vencimiento")+". PRÓXIMO PAGO POR VALOR DE $ "+str(formatear(proxima_cuota[1]))+" PARA EL DÍA "+proxima_cuota[0]+".", current_user.id))
        else:
                cursor.execute("INSERT INTO casos_actualizaciones (idcaso, creado, actualizacion, agente, esresultado) VALUES (%s, now(), %s, %s, 2)", (datos.get("idcaso"), "SE VALIDA PLAN DE PAGOS CL CUMPLE CON "+cuota_o_abono+" DE $ "+monto_formateado+" PARA EL DÍA "+datos.get("fecha_vencimiento")+".", current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Pago registrado correctamente."})

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
    ncuotas = datos.get("cuotas")
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO pagos_control (caso, cliente, cartasenviadas, estado, valor, entrega, ncuota, cuota) VALUES (%s, %s, 0, %s, %s, %s, %s, %s)", (datos.get("idcaso"), datos.get("idcliente"), datos.get("estado"), datos.get("valor_servicio"), datos.get("entrega_inicial"), ncuotas, datos.get("valor_cuota")))
    last_inserted_id = cursor.lastrowid
    fechas_generadas = generar_fechas(datos.get("vencimiento"), int(ncuotas)-1)
    cursor.execute("INSERT INTO pagos (control, fecha, monto, tipo, pagado) VALUES (%s, %s, %s, 1, 0)", (last_inserted_id, datos.get("vencimiento"), datos.get("valor_cuota")))
    for a in fechas_generadas:
        cursor.execute("INSERT INTO pagos (control, fecha, monto, tipo, pagado) VALUES (%s, %s, %s, 1, 0)", (last_inserted_id, a, datos.get("valor_cuota")))
    cursor.execute("INSERT INTO log (caso, cliente, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", (datos.get("idcaso"), datos.get("idcliente"), "Generó un plan de pagos del caso N°"+datos.get("idcaso")+" de "+str(ncuotas)+" mensuales. Costo total del servicio $"+int(datos.get("valor_servicio")), current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Plan de pagos generado correctamente."})

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
    idcaso = request.json.get('idcaso')
    nombredoc = request.json.get("nombredoc")
    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE documentos SET clasificacion = %s WHERE id = %s", (nueva_clasificacion, id))
    cursor.execute("INSERT INTO log (otro, caso, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", ("DOCUMENTOS", str(idcaso),"Editó la clasificación del documento "+nombredoc, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Clasificación actualizada correctamente."})

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
    return jsonify({"mensaje": "Nombre del documento actualizado correctamente."})

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
        mensaje= "Documento eliminado correctamente."
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
            cursor.execute("INSERT INTO log (otro, caso, movimiento, agente, fecha) VALUES (%s, %s, %s, %s, now())", ("DOCUMENTOS", str(idcaso), "Subió un documento: "+filename, current_user.id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"mensaje": "Documentos cargados con éxito."})

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
    return jsonify({"mensaje": "Datos del beneficiario "+str(nombreb)+" guardados correctamente."})

@app.route("/agenda", methods=["GET"])
@login_required
def agenda():
    fecha = request.args.get('fecha', default=datetime.today().strftime('%Y-%m-%d'))
    cursor = mysql.connection.cursor()
    cursor.execute(f"SELECT citas.id AS idcita, citas.cliente AS idcliente, clientes.nombre AS nombrecliente, clientes.telefono1, clientes.telefono2, clientes.pertenecetel2, clientes.clasificacion, citas.caso AS idcaso, casos.caso AS nombrecaso, fk_tipo_caso.tipocaso, DATE_FORMAT(citas.fecha, '%m/%d/%Y') AS fecha, DATE_FORMAT(citas.hora, '%h:%i %p') AS hora, fk_tipo_cita.tipocita, citas.status AS idstatuscita, fk_status_cita.statuscita, fk_status_cita.colorstatuscita, citas.razon, citas.resultado, citas.motivo_cancelacion, citas.asignado AS idasignado, auth.fullname AS asignado, fk_oficina.oficina AS oficina, tipo_caso_subclase.subclase AS subclase, CONCAT(citas.fecha) AS fechaoriginal, CONCAT(citas.hora) AS horaoriginal, fk_tipo_cita.colortipocita FROM citas JOIN clientes ON citas.cliente=clientes.id JOIN fk_tipo_cita ON fk_tipo_cita.id=citas.tipo JOIN fk_status_cita ON fk_status_cita.id=citas.status JOIN auth ON auth.id = citas.asignado JOIN casos ON citas.caso = casos.id JOIN fk_oficina ON fk_oficina.id=clientes.oficina JOIN fk_tipo_caso ON fk_tipo_caso.id=casos.tipo JOIN tipo_caso_subclase ON tipo_caso_subclase.id=casos.tipo WHERE citas.fecha = '{fecha}' ORDER BY citas.hora ASC;")
    citas = cursor.fetchall()
    citas = [{"idcita": a[0], "idcliente": a[1], "nombrecliente": a[2], "telefono1": a[3], "telefono2": a[4], "pertenecetel2": a[5], "clasificacion": a[6], "idcaso": a[7], "nombrecaso": a[8], "tipocaso": a[9], "fecha": a[10], "hora": a[11], "tipocita": a[12], "idstatuscita": a[13], "statuscita": a[14], "colorstatuscita": a[15], "razon": a[16], "resultado": a[17], "motivo_cancelacion": a[18], "idasignado": a[19], "asignado": a[20], "oficina": a[21], "subclase": a[22], "fechaoriginal": a[23], "horaoriginal": a[24], "colortipocita": a[25]} for a in citas]
    cursor.execute(f"SELECT rol FROM auth WHERE id = {current_user.id}")
    rol = cursor.fetchone()
    cursor.execute("SELECT id, fullname FROM auth WHERE id != 1 ORDER BY fullname;")
    asesores = cursor.fetchall()
    asesores = [{"id": a[0], "fullname": a[1]} for a in asesores]
    
    cursor.execute("SELECT fecha FROM calendario_fechas_bloqueadas;")
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
    
    cursor.execute("SELECT id, tipocaso FROM fk_tipo_caso;")
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
    
    cursor.execute("SELECT id, statuscita, colorstatuscita FROM fk_status_cita;")
    statusCita = cursor.fetchall()
    statusCita = [{"id": a[0], "statuscita": a[1], "colorstatuscita": a[2]} for a in statusCita]
    
    cursor.close()
    menuconfig = {
        "fechasBloqueadas": fechasBloqueadas,
        "tipoCaso": tipoCaso,
        "subClase": subClase,
        "statusCaso": statusCaso,
        "usuarios": usuarios,
        "tipoCita": tipoCita,
        "statusCita": statusCita
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

app.config.from_object(config['development'])

if __name__ == "__main__":
    app.run(port=5002, debug=True)