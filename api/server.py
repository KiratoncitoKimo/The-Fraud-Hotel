from flask import Flask, jsonify, request


app = Flask(__name__)


@app.route("/api/test", methods=["GET"])
def handle_endpoint():
    result_code = 000
    result_data = {"status": "", "message": ""}

    name = request.args.get("name")

    if not name:
        result_code = 400
        result_data["status"] = "failure"
        result_data["message"] = "Missing parameter \"name\""

        return jsonify(result_data), result_code

    result_code = 200
    result_data["status"] = "success"
    result_data["message"] = f"Hello {name}"

    return jsonify(result_data), result_code


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
