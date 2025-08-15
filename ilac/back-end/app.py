import os
import base64
import traceback
import json
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") or "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"

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def openrouter_chat_completion(messages, model="gpt-3.5-turbo"):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": 600,
        "temperature": 0.7,
    }
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()

def extract_drug_name_from_image_vlm(image_path):
    with open(image_path, "rb") as img_file:
        img_base64 = base64.b64encode(img_file.read()).decode()

    messages = [
        {
            "role": "system",
            "content": "Bir eczacı gibi davran. İlaç kutusu görselindeki ilacın adını ve dozajını sadece yaz."
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Bu kutudaki ilacın adı ve dozu nedir?"},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}}
            ]
        }
    ]

    res_json = openrouter_chat_completion(messages, model="gpt-4o-mini")
    return res_json["choices"][0]["message"]["content"].strip()

def query_drug_info(drug_name):
    prompt = f"""
'{drug_name}' adlı ilacın:
- kullanım alanları
- yaygın yan etkileri
- dikkat edilmesi gereken etkileşimleri
kısa, madde madde ve sade şekilde JSON formatında yanıtla.

JSON formatı şöyle olmalı:
{{
  "usage": ["..."],
  "side_effects": ["..."],
  "warnings": ["..."]
}}
"""
    messages = [
        {"role": "system", "content": "Bir eczacı gibi kısa ve sade anlat."},
        {"role": "user", "content": prompt}
    ]
    res_json = openrouter_chat_completion(messages, model="gpt-4o-mini")  # gpt-4o-mini kullanıyoruz
    raw_text = res_json["choices"][0]["message"]["content"].strip()

    try:
        # JSON parse etmeye çalış
        parsed = json.loads(raw_text)
    except json.JSONDecodeError:
        # Parse edilemezse boş JSON dön
        parsed = {"usage": [], "side_effects": [], "warnings": []}

    # Ham metni de ekleyelim frontend için
    parsed["raw_text"] = raw_text
    return parsed


@app.route("/get-drug-info", methods=["POST"])
def process_input():
    try:
        # JSON formatında sadece ilaç ismi geldiğinde
        if request.is_json:
            data = request.get_json()
            drug_name = data.get("drug_name", "").strip()
            if drug_name:
                info = query_drug_info(drug_name)
                return jsonify({"drug_name": drug_name, "drug_info": info})

        # Görsel yüklendiğinde
        if 'image' in request.files:
            file = request.files['image']
            if file.filename == '':
                return jsonify({"error": "Görsel seçilmedi"}), 400

            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            # VLM ile ilaç adını çıkar
            drug_name = extract_drug_name_from_image_vlm(filepath)
            if not drug_name:
                return jsonify({"error": "Görselden ilaç adı çıkarılamadı"}), 500

            # LLM ile ilaç bilgilerini getir
            info = query_drug_info(drug_name)
            return jsonify({"drug_name": drug_name, "drug_info": info})

        return jsonify({"error": "Geçerli ilaç ismi veya görsel gönderilmedi"}), 400

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Sunucu hatası oluştu: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=5000)
