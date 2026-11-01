from flask import Flask, jsonify, request
from flask_cors import CORS
from database import Database

db = Database.connect("database.db")

app = Flask(__name__)
CORS(app)


@app.route("/api/test", methods=["GET"])
def test_endpoint():
    name = request.args.get("name")

    if not name:
        return jsonify({"status": "failure", "message": 'Missing parameter "name"'}), 400

    return jsonify({"status": "success", "message": f"Hello, {name}!"}), 200


@app.route("/api/reservation-create", methods=["POST"])
def add_reservation_endpoint():
    data = request.get_json()

    if not data or "room_number" not in data or "guest_name" not in data:
        return jsonify({"status": "failure", "message": "Missing room_number or guest_name"}), 400

    try:
        room_number = int(data["room_number"])
    except ValueError:
        return jsonify({"status": "failure", "message": "room_number must be an integer"}), 400

    guest_name = str(data["guest_name"]).strip()
    if not guest_name:
        return jsonify({"status": "failure", "message": "guest_name cannot be empty"}), 400

    db.add_reservation(room_number, guest_name)
    return jsonify({"status": "success", "message": f"Reserved room {room_number} for {guest_name}"}), 201


@app.route("/api/reservation-destroy", methods=["POST"])
def delete_reservation_endpoint():
    data = request.get_json()

    if not data or "room_number" not in data:
        return jsonify({"status": "failure", "message": "Missing room_number"}), 400

    try:
        room_number = int(data["room_number"])
    except ValueError:
        return jsonify({"status": "failure", "message": "room_number must be an integer"}), 400

    deleted = db.delete_reservation(room_number)

    if deleted:
        return jsonify({"status": "success", "message": f"Deleted reservation for room {room_number}"}), 200
    else:
        return jsonify({"status": "failure", "message": f"Room {room_number} not found"}), 404


@app.route("/api/reservations", methods=["GET"])
def list_reservations_endpoint():
    # Supports optional filtering, e.g.
    # /api/reservations?name=John or /api/reservations?room=101

    room_param = request.args.get("room")
    name_param = request.args.get("name", "")

    room_number = int(room_param) if room_param and room_param.isdigit() else None

    results = db.find_reservation(room_number=room_number, guest_name=name_param)
    return jsonify({"status": "success", "data": [r.to_dict() for r in results]}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
