import sqlite3
from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
from database import Database

try:
    db = Database.connect("api/database.db")

except sqlite3.OperationalError:
    db = Database.connect("database.db")

app = Flask(__name__)
CORS(app)


def parse_iso_datetime(value) -> datetime | None:
    if not isinstance(value, str):
        return None

    cleaned = value.strip()
    if not cleaned:
        return None

    try:
        dt = datetime.fromisoformat(cleaned)

        if dt.tzinfo is not None:
            dt = dt.replace(tzinfo=None)
        return dt

    except ValueError:
        return None


@app.route("/api/test", methods=["GET"])
def test_endpoint():
    name = request.args.get("name")

    if not name:
        return jsonify({"status": "failure", "message": 'Missing parameter "name"'}), 400

    return jsonify({"status": "success", "message": f"Hello, {name}!"}), 200


@app.route("/api/reservation-create", methods=["POST"])
def add_reservation_endpoint():
    data = request.get_json(silent=True)

    required_fields = ("room_number", "guest_name", "check_in", "check_out")
    if not data or any(field not in data for field in required_fields):
        return jsonify(
            {
                "status": "failure",
                "message": "Missing room_number, guest_name, check_in, or check_out",
            }
        ), 400

    try:
        room_number = int(data["room_number"])
    except (ValueError, TypeError):
        return jsonify({"status": "failure", "message": "room_number must be an integer"}), 400

    guest_name = str(data["guest_name"]).strip()
    if not guest_name:
        return jsonify({"status": "failure", "message": "guest_name cannot be empty"}), 400

    check_in_dt = parse_iso_datetime(data["check_in"])
    check_out_dt = parse_iso_datetime(data["check_out"])

    if not check_in_dt or not check_out_dt:
        return jsonify(
            {
                "status": "failure",
                "message": "check_in and check_out must be valid ISO datetimes (e.g. 2026-11-10T14:00)",
            }
        ), 400

    if check_out_dt <= check_in_dt:
        return jsonify(
            {
                "status": "failure",
                "message": "check_out must be after check_in",
            }
        ), 400

    check_in_str  =  check_in_dt.isoformat(timespec="seconds")
    check_out_str = check_out_dt.isoformat(timespec="seconds")

    if not db.is_room_available(room_number, check_in_str, check_out_str):
        return jsonify(
            {
                "status": "failure",
                "message": f"Room {room_number} is already booked during {check_in_str} – {check_out_str}",
            }
        ), 409

    reservation = db.add_reservation(room_number, guest_name, check_in_str, check_out_str)
    return jsonify(
        {
            "status": "success",
            "message": f"Reserved room {room_number} for {guest_name} ({check_in_str} to {check_out_str})",
            "data": reservation.to_dict(),
        }
    ), 201


@app.route("/api/reservation-destroy", methods=["POST"])
def delete_reservation_endpoint():
    data = request.get_json(silent=True)

    if not data or ("id" not in data and "room_number" not in data):
        return jsonify({"status": "failure", "message": "Missing id or room_number"}), 400

    if "id" in data and data["id"] is not None:
        try:
            reservation_id = int(data["id"])
        except (ValueError, TypeError):
            return jsonify({"status": "failure", "message": "id must be an integer"}), 400

        deleted = db.delete_reservation(reservation_id=reservation_id)
        target_label = f"Reservation #{reservation_id}"

    else:
        try:
            room_number = int(data["room_number"])
        except (ValueError, TypeError):
            return jsonify({"status": "failure", "message": "room_number must be an integer"}), 400

        deleted = db.delete_reservation(room_number=room_number)
        target_label = f"Room {room_number}"

    if deleted:
        return jsonify({"status": "success", "message": f"Deleted {target_label}"}), 200
    else:
        return jsonify({"status": "failure", "message": f"{target_label} not found"}), 404


@app.route("/api/reservations", methods=["GET"])
def list_reservations_endpoint():
    # Supports optional filtering, e.g.
    # /api/reservations?name=John or /api/reservations?room=101
    room_param = request.args.get("room")
    name_param = request.args.get("name", "")

    room_number = int(room_param) if room_param and room_param.isdigit() else None

    results = db.find_reservation(room_number=room_number, guest_name=name_param)
    return jsonify({"status": "success", "data": [r.to_dict() for r in results]}), 200


@app.route("/api/user-create", methods=["POST"])
def add_account_endpoint():
    data = request.get_json(silent=True)

    if not data or "id" not in data or "acc_login" not in data or "acc_password" not in data:
        return jsonify({"status": "failure", "message": "Missing id, login or password"}), 400

    try:
        id = int(data["id"])
    except (ValueError, TypeError):
        return jsonify({"status": "failure", "message": "id must be an integer"}), 400

    acc_login = str(data["acc_login"]).strip()
    if not acc_login:
        return jsonify({"status": "failure", "message": "login cannot be empty"}), 400

    acc_password = str(data["acc_password"]).strip()
    if not acc_password:
        return jsonify({"status": "failure", "message": "password cannot be empty"}), 400

    db.add_account(id, acc_login, acc_password)
    return jsonify({"status": "success", "message": f"Added account for {acc_login}, id: {id}"}), 201


@app.route("/api/user-destroy", methods=["POST"])
def delete_account_endpoint():
    data = request.get_json(silent=True)
    if not data or "id" not in data:
        return jsonify({"status": "failure", "message": "Missing id"}), 400

    try:
        id = int(data["id"])
    except (ValueError, TypeError):
        return jsonify({"status": "failure", "message": "id must be an integer"}), 400

    deleted = db.delete_account(id)

    if deleted:
        return jsonify({"status": "success", "message": f"Account with id {id} has been deleted"}), 200
    else:
        return jsonify({"status": "failure", "message": f"Account with id {id} cannot be found"}), 404


@app.route("/api/users", methods=["GET"])
def list_accounts_endpoint():
    accounts = db.get_accounts()
    return jsonify({"status": "success", "data": [a.to_dict() for a in accounts]}), 200


@app.route("/api/user-login", methods=["POST"])
def authentification_endpoint():
    data = request.get_json(silent=True)

    if not data or "acc_login" not in data or "acc_password" not in data:
        return jsonify({"status": "failure", "message": "Missing login or password"}), 400

    acc_login    = str(data["acc_login"]).strip()
    acc_password = str(data["acc_password"]).strip()

    user = db.authentification(acc_login, acc_password)

    if user:
        return jsonify(
            {"status": "success", "message": f"User: {user.login} logged in", "data": user.to_dict()}
        ), 200
    else:
        return jsonify({"status": "failure", "message": "Invalid login or password"}), 401


@app.route("/api/user-logout", methods=["POST"])
def logout_endpoint():
    return jsonify({"status": "success", "message": "User logged out"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
