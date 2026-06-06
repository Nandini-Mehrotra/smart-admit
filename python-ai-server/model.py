import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score


def train_admission_model(csv_path="students_records.csv"):
    # Load cleaned applicant data
    df = pd.read_csv(csv_path)

    # We do not use applicant name because it has no predictive value
    X = df[
        [
            "stream",
            "skills",
            "internships",
            "majorProjects",
            "targetCountry",
            "targetState",
            "maxBudget_USD",
        ]
    ]

    # Target column: 1 = admitted, 0 = not admitted
    y = df["admissionStatus"]

    # Text columns need one-hot encoding
    categorical_features = [
        "stream",
        "skills",
        "targetCountry",
        "targetState",
    ]

    # Numeric columns need scaling
    numeric_features = [
        "internships",
        "majorProjects",
        "maxBudget_USD",
    ]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
            ("num", StandardScaler(), numeric_features),
        ]
    )

    # Pipeline = preprocessing + model training
    model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", LogisticRegression(max_iter=1000)),
        ]
    )

    # Split data to test if model is learning
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    print(f"Model trained successfully. Accuracy: {accuracy:.2f}")

    return model


def predict_admission(model, applicant_data):
    # Convert one applicant dictionary into dataframe
    applicant_df = pd.DataFrame([applicant_data])

    # predict_proba returns probabilities for [class 0, class 1]
    probability = model.predict_proba(applicant_df)[0][1]

    percentage = round(probability * 100, 2)

    if percentage >= 80:
        tier = "Safe"
    elif percentage >= 60:
        tier = "Target"
    else:
        tier = "Dream"

    return {
        "admissionProbability": percentage,
        "tier": tier,
    }


if __name__ == "__main__":
    model = train_admission_model("students_records.csv")

    sample_applicant = {
        "stream": "Engineering",
        "skills": "React;Node",
        "internships": 2,
        "majorProjects": 4,
        "targetCountry": "India",
        "targetState": "Telangana",
        "maxBudget_USD": 60000,
    }

    result = predict_admission(model, sample_applicant)
    print(result)