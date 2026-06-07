"""
🚀 Multi-Modal Last-Mile Delivery Failure Predictor
====================================================
Full ML pipeline: EDA → Feature Engineering → Target Creation → Model Training → Evaluation → Export

Dataset: 25,000 delivery records with 14 features
Target: Engineered binary `delivery_failed` from domain-weighted scoring

Run: python delivery_model_notebook.py
"""

import pandas as pd
import numpy as np
import joblib
import json
import os
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)
from xgboost import XGBClassifier

print("=" * 60)
print("🚀 DELIVERY FAILURE PREDICTOR — MODEL TRAINING PIPELINE")
print("=" * 60)

# ============================================================
# 1. DATA LOADING
# ============================================================
print("\n📂 [1/7] Loading dataset...")
df = pd.read_excel("dataset/multiclasss model.xlsx")
print(f"   Shape: {df.shape}")
print(f"   Columns: {list(df.columns)}")

# ============================================================
# 2. EXPLORATORY DATA ANALYSIS
# ============================================================
print("\n🔍 [2/7] Exploratory Data Analysis...")

print("\n   📊 Numeric Feature Statistics:")
print(df.describe().round(3).to_string())

print("\n   📋 Categorical Value Counts:")
cat_cols = ['delivery_partner', 'package_type', 'vehicle_type', 'delivery_mode', 'region', 'weather_condition']
for col in cat_cols:
    print(f"\n   {col}: {dict(df[col].value_counts())}")

print(f"\n   ❓ Missing Values:")
missing = df.isnull().sum()
print(f"   {dict(missing[missing > 0])}")

# Handle missing values
df['time_buffer_hours'] = df['time_buffer_hours'].fillna(df['time_buffer_hours'].median())
print("   ✅ Filled time_buffer_hours nulls with median")

# ============================================================
# 3. TARGET VARIABLE ENGINEERING
# ============================================================
print("\n🎯 [3/7] Engineering target variable (delivery_failed)...")

def compute_failure_score(row):
    """
    Domain-weighted failure scoring based on logistics domain knowledge.
    High traffic + poor driver + bad weather + no time buffer = failure.
    """
    score = 0.0

    # Traffic congestion (strong indicator)
    if row['traffic_index'] > 0.75:
        score += 0.25
    elif row['traffic_index'] > 0.55:
        score += 0.10

    # Driver delay rate (strong indicator)
    if row['driver_delay_rate'] > 0.45:
        score += 0.25
    elif row['driver_delay_rate'] > 0.30:
        score += 0.10

    # Vehicle reliability (moderate indicator)
    if row['vehicle_reliability'] < 0.70:
        score += 0.20
    elif row['vehicle_reliability'] < 0.80:
        score += 0.08

    # Time buffer (moderate indicator)
    if row['time_buffer_hours'] < 0:
        score += 0.15
    elif row['time_buffer_hours'] < 0.5:
        score += 0.08

    # Weather impact (moderate indicator)
    if row['weather_condition'] in ['stormy']:
        score += 0.20
    elif row['weather_condition'] in ['rainy', 'foggy']:
        score += 0.12
    elif row['weather_condition'] in ['cold']:
        score += 0.05

    # Distance (mild indicator)
    if row['distance_km'] > 250:
        score += 0.08
    elif row['distance_km'] > 180:
        score += 0.04

    # Hub dwell time (mild indicator - congestion at hub)
    if row['hub_dwell_minutes'] > 40:
        score += 0.08
    elif row['hub_dwell_minutes'] > 25:
        score += 0.04

    # Add controlled randomness for realism
    score += np.random.normal(0, 0.05)

    return score

np.random.seed(42)
df['failure_score'] = df.apply(compute_failure_score, axis=1)
df['delivery_failed'] = (df['failure_score'] > 0.45).astype(int)

failure_rate = df['delivery_failed'].mean()
print(f"   Failure rate: {failure_rate:.1%} ({df['delivery_failed'].sum()} / {len(df)})")
print(f"   ✅ Target distribution: {dict(df['delivery_failed'].value_counts())}")

# ============================================================
# 4. FEATURE ENGINEERING
# ============================================================
print("\n⚙️ [4/7] Feature Engineering...")

# Synthetic delivery_time for time-based features
np.random.seed(42)
hours = np.random.choice(range(6, 23), size=len(df))
days = np.random.choice(range(7), size=len(df))
df['hour'] = hours
df['day_of_week'] = days
df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)

# Engineered features (matching predictor.py exactly)
df['sla_time_hours'] = abs(df['time_buffer_hours']) + df['distance_km'] / 40
df['order_density'] = df['order_volume'] / (df['distance_km'] + 1)
df['cost_intensity'] = df['delivery_cost'] / (df['order_volume'] + 1)
df['traffic_pressure'] = df['traffic_index'] * df['hub_dwell_minutes']
df['reliability_risk'] = df['driver_delay_rate'] * (1 - df['vehicle_reliability'])
df['distance_cost_interaction'] = df['distance_km'] * df['delivery_cost']

num_cols = [
    'distance_km', 'order_volume', 'delivery_cost', 'traffic_index',
    'hub_dwell_minutes', 'driver_delay_rate', 'vehicle_reliability',
    'hour', 'day_of_week', 'is_weekend', 'sla_time_hours',
    'order_density', 'cost_intensity', 'traffic_pressure',
    'reliability_risk', 'distance_cost_interaction'
]

print(f"   Numeric features ({len(num_cols)}): {num_cols}")
print(f"   Categorical features ({len(cat_cols)}): {cat_cols}")

# Encode categoricals
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
X_cat = encoder.fit_transform(df[cat_cols])
X_num = df[num_cols].values
X = np.hstack([X_num, X_cat])
y = df['delivery_failed'].values

print(f"   Final feature matrix: {X.shape}")

# ============================================================
# 5. MODEL TRAINING
# ============================================================
print("\n🤖 [5/7] Training Models...")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f"   Train: {X_train.shape[0]} | Test: {X_test.shape[0]}")

# --- XGBoost (Primary) ---
print("\n   🔹 Training XGBoost...")
xgb_model = XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=len(y_train[y_train == 0]) / max(len(y_train[y_train == 1]), 1),
    random_state=42,
    eval_metric='logloss',
    use_label_encoder=False
)
xgb_model.fit(X_train, y_train)
xgb_pred = xgb_model.predict(X_test)
xgb_prob = xgb_model.predict_proba(X_test)[:, 1]

print(f"      Accuracy:  {accuracy_score(y_test, xgb_pred):.4f}")
print(f"      Precision: {precision_score(y_test, xgb_pred):.4f}")
print(f"      Recall:    {recall_score(y_test, xgb_pred):.4f}")
print(f"      F1 Score:  {f1_score(y_test, xgb_pred):.4f}")
print(f"      AUC-ROC:   {roc_auc_score(y_test, xgb_prob):.4f}")

# --- Cross-validation ---
print("\n   📊 Cross-Validation (5-fold)...")
cv_scores = cross_val_score(xgb_model, X, y, cv=5, scoring='f1')
print(f"      F1 scores: {cv_scores.round(4)}")
print(f"      Mean F1:   {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# ============================================================
# 6. MODEL EVALUATION
# ============================================================
print("\n📈 [6/7] Model Evaluation...")

print("\n   Confusion Matrix:")
cm = confusion_matrix(y_test, xgb_pred)
print(f"      TN={cm[0][0]}  FP={cm[0][1]}")
print(f"      FN={cm[1][0]}  TP={cm[1][1]}")

print("\n   Classification Report:")
print(classification_report(y_test, xgb_pred, target_names=['Success', 'Failed']))

# Feature importance
feature_names = num_cols + list(encoder.get_feature_names_out(cat_cols))
importance = xgb_model.feature_importances_
feat_imp = sorted(zip(feature_names, importance), key=lambda x: x[1], reverse=True)

print("\n   🏆 Top 15 Feature Importances:")
for i, (feat, imp) in enumerate(feat_imp[:15]):
    bar = '█' * int(imp * 100)
    print(f"      {i+1:2d}. {feat:30s} {imp:.4f} {bar}")

# ============================================================
# 7. EXPORT
# ============================================================
print("\n💾 [7/7] Exporting model artifacts...")

os.makedirs("model", exist_ok=True)

joblib.dump(xgb_model, "model/failure_model.pkl")
print("   ✅ Saved: model/failure_model.pkl")

joblib.dump(encoder, "model/encoder.pkl")
print("   ✅ Saved: model/encoder.pkl")

# Save feature importance as JSON
feat_imp_data = [{"feature": f, "importance": float(v)} for f, v in feat_imp]
with open("model/feature_importance.json", "w") as f:
    json.dump(feat_imp_data, f, indent=2)
print("   ✅ Saved: model/feature_importance.json")

# Save model metadata
metadata = {
    "model_type": "XGBClassifier",
    "n_estimators": 300,
    "max_depth": 6,
    "features_count": X.shape[1],
    "training_samples": X_train.shape[0],
    "test_samples": X_test.shape[0],
    "accuracy": float(accuracy_score(y_test, xgb_pred)),
    "precision": float(precision_score(y_test, xgb_pred)),
    "recall": float(recall_score(y_test, xgb_pred)),
    "f1_score": float(f1_score(y_test, xgb_pred)),
    "auc_roc": float(roc_auc_score(y_test, xgb_prob)),
    "cv_mean_f1": float(cv_scores.mean()),
    "failure_rate": float(failure_rate),
    "num_cols": num_cols,
    "cat_cols": cat_cols
}
with open("model/model_metadata.json", "w") as f:
    json.dump(metadata, f, indent=2)
print("   ✅ Saved: model/model_metadata.json")

print("\n" + "=" * 60)
print("✅ PIPELINE COMPLETE — Model ready for production!")
print("=" * 60)
