from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# MySQL configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'adminadmin',
    'database': 'crud_app'
}

# Connect to MySQL
def get_db_connection():
    return mysql.connector.connect(**db_config)

# Routes

# Read all users
@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

# Create a new user
@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (name, email) VALUES (%s, %s)", (data['name'], data['email']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'User created'}), 201

# Update a user
@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET name = %s, email = %s WHERE id = %s", (data['name'], data['email'], id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'User updated'})

# Delete a user
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'User deleted'})

if __name__ == '__main__':
    app.run(debug=True)
