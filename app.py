from flask import Flask, render_template, request, jsonify
import random
import string
app = Flask(__name__)
# 🔐 Generate Password
def generate_password(length, use_upper, use_lower, use_digits, use_symbols):
    upper = string.ascii_uppercase if use_upper else ""
    lower = string.ascii_lowercase if use_lower else ""
    digits = string.digits if use_digits else ""
    symbols = string.punctuation if use_symbols else ""
    all_chars = upper + lower + digits + symbols
    if not all_chars:
        return "Select at least one option!"
    password = []
    # 🔥 guarantee at least one from each selected type
    if use_upper:
        password.append(random.choice(upper))
    if use_lower:
        password.append(random.choice(lower))
    if use_digits:
        password.append(random.choice(digits))
    if use_symbols:
        password.append(random.choice(symbols))
    # 🔥 fill remaining characters
    while len(password) < length:
        password.append(random.choice(all_chars))
    # 🔥 shuffle final result
    random.shuffle(password)
    return "".join(password)
# 📊 Strength Checker
def check_strength(password, use_upper, use_lower, use_digits, use_symbols):
    score = 0

    if len(password) >= 8:
        score += 1
    if len(password) >= 12:
        score += 1

    if use_upper:
        score += 1
    if use_lower:
        score += 1
    if use_digits:
        score += 1
    if use_symbols:
        score += 1

    if score <= 2:
        return "Weak 🔴", score
    elif score <= 4:
        return "Medium 🟠", score
    else:
        return "Strong 🟢", score


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()

    length = int(data.get("length", 12))
    use_upper = data.get("uppercase", False)
    use_lower = data.get("lowercase", False)
    use_digits = data.get("numbers", False)
    use_symbols = data.get("symbols", False)

    password = generate_password(length, use_upper, use_lower, use_digits, use_symbols)

    if password == "Select at least one option!":
        return jsonify({
            "password": password,
            "strength": "N/A",
            "score": 0
        })

    strength, score = check_strength(password, use_upper, use_lower, use_digits, use_symbols)

    return jsonify({
        "password": password,
        "strength": strength,
        "score": score
    })


if __name__ == "__main__":
    app.run(debug=True)