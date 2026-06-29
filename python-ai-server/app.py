from flask import Flask, jsonify, request
from flask_cors import CORS
from flask import request, jsonify
from model import train_admission_model, predict_admission
model = train_admission_model("students_records.csv")


app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return "Smart Admit Python AI Server is running"

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "success": True,
        "message": "Python Flask AI server is healthy"
    })

@app.route("/api/predict", methods=["POST"])
def predict():

    data = request.get_json()

    result = predict_admission(model, data)

    return jsonify({
        "success": True,
        "prediction": result
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)