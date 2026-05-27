from flask import Flask, jsonify, request
from flask_cors import CORS

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

    return jsonify({
        "success": True,
        "message": "Prediction endpoint working",
        "receivedData": data,
        "samplePrediction": {
            "collegeName": "Sample College",
            "admissionProbability": 82,
            "category": "Safe"
        }
    })

if __name__ == "__main__":
    app.run(debug=True, port=8000)