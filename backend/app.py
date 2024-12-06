from flask import Flask, request, jsonify, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mysqldb import MySQL
import bcrypt, os
from flask_cors import CORS
from config import config
from dotenv import load_dotenv

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
    def __init__(self, id, username, fullname, rol):
        self.id = id
        self.username = username
        self.fullname = fullname
        self.rol = rol

@login_manager.user_loader
def load_user(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT user, fullname, rol FROM auth WHERE user = %s", (user_id,))
    user_data = cursor.fetchone()
    cursor.close()
    if user_data:
        return User(id=user_data[0], username=user_data[0], fullname=user_data[1], rol=user_data[2])
    return None

# Ruta para el inicio de sesión
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    #print(f"Datos ingresados: username={username}, password={password}")

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT user, password, fullname, rol FROM auth WHERE user = %s", (username,))
    user = cursor.fetchone()
    cursor.close()

    #print(f"Datos en la base: username={user[0]}, password={user[1]}")
    #if user and bcrypt.checkpw(password.encode("utf-8"), user[1].encode("utf-8")):
    if user and password == user[1]:
        user_obj = User(id=user[0], username=user[0], fullname=user[2], rol=user[3])
        login_user(user_obj)
        return jsonify({"message": "Login exitoso", "user": {"username": user[0], "fullname": user[2], "rol": user[3]}}), 200

    return jsonify({"message": "Usuario o contraseña incorrectos"}), 401

@app.route("/api/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Logout exitoso"}), 200

app.config.from_object(config['development'])

if __name__ == "__main__":
    app.run(port=5002, debug=True)
