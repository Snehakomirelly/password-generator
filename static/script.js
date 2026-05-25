//  GENERATE PASSWORD
function generatePassword() {
    const length = document.getElementById("length").value;
    const uppercase = document.getElementById("uppercase").checked;
    const lowercase = document.getElementById("lowercase").checked;
    const numbers = document.getElementById("numbers").checked;
    const symbols = document.getElementById("symbols").checked;

    fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            length,
            uppercase,
            lowercase,
            numbers,
            symbols
        })
    })
    .then(res => res.json())
    .then(data => {

        document.getElementById("result").innerText = data.password;
        document.getElementById("strengthText").innerText = data.strength;

        const bar = document.getElementById("strengthBar");

        if (data.strength.includes("Weak")) {
            bar.style.width = "33%";
            bar.style.background = "#ef4444";
        } else if (data.strength.includes("Medium")) {
            bar.style.width = "66%";
            bar.style.background = "#f59e0b";
        } else {
            bar.style.width = "100%";
            bar.style.background = "#22c55e";
        }
    });
}


//  COPY PASSWORD
function copyPassword() {
    const text = document.getElementById("result").innerText;

    if (!text || text === "Your password will appear here") return;

    navigator.clipboard.writeText(text).then(() => {
        showToast("Copied ✔️");
    });
}


//  SHOW / HIDE PASSWORD
let isHidden = false;

function togglePassword() {
    const result = document.getElementById("result");

    if (!result.innerText || result.innerText === "Your password will appear here") return;

    if (!isHidden) {
        result.dataset.realText = result.innerText;
        result.innerText = "••••••••••••";
        isHidden = true;
    } else {
        result.innerText = result.dataset.realText;
        isHidden = false;
    }
}


//  TOAST
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => toast.classList.remove("show"), 2000);
}


// THEME TOGGLE
window.onload = function () {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light");
        document.getElementById("themeToggle").innerText = "☀️ Light Mode";
    }
};

document.getElementById("themeToggle").addEventListener("click", function () {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        this.innerText = "☀️ Light Mode";
        localStorage.setItem("theme", "light");
    } else {
        this.innerText = "🌙 Dark Mode";
        localStorage.setItem("theme", "dark");
    }
});
