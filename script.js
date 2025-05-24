
function saveData() {
    const files = document.getElementById("fileInput").files;
    const text = document.getElementById("textInput").value;
    const timestamp = Date.now();
    const unlockDate = timestamp + 365 * 24 * 60 * 60 * 1000; // rok

    const data = {
        text: text,
        files: [],
        unlockDate: unlockDate
    };

    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            data.files.push({
                name: files[i].name,
                content: e.target.result
            });
            if (data.files.length === files.length) {
                localStorage.setItem("kapsula", JSON.stringify(data));
                document.getElementById("status").innerText = "Dane zapisane!";
            }
        };
        reader.readAsDataURL(files[i]);
    }

    if (files.length === 0) {
        localStorage.setItem("kapsula", JSON.stringify(data));
        document.getElementById("status").innerText = "Dane zapisane!";
    }
}

window.onload = function() {
    const kapsula = JSON.parse(localStorage.getItem("kapsula"));
    if (kapsula) {
        const now = Date.now();
        if (now >= kapsula.unlockDate) {
            alert("Twoje wspomnienia zostały odblokowane!");
            console.log(kapsula);
        } else {
            const timeLeft = Math.ceil((kapsula.unlockDate - now) / (1000 * 60 * 60 * 24));
            document.getElementById("status").innerText = `Odblokowanie za ${timeLeft} dni`;
        }
    }
};
