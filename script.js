
function saveMemory() {
    const files = document.getElementById("fileInput").files;
    const text = document.getElementById("textInput").value;
    const years = parseInt(document.getElementById("yearsSelect").value);
    const timestamp = Date.now();
    const unlockDate = timestamp + years * 365 * 24 * 60 * 60 * 1000;
    const id = 'memory_' + timestamp;

    const data = {
        id: id,
        text: text,
        files: [],
        unlockDate: unlockDate,
        created: timestamp
    };

    let processedFiles = 0;
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function(e) {
                data.files.push({
                    name: files[i].name,
                    content: e.target.result
                });
                processedFiles++;
                if (processedFiles === files.length) {
                    saveToLocalStorage(data);
                }
            };
            reader.readAsDataURL(files[i]);
        }
    } else {
        saveToLocalStorage(data);
    }
}

function saveToLocalStorage(memory) {
    let memories = JSON.parse(localStorage.getItem("kapsula_memories")) || [];
    memories.push(memory);
    localStorage.setItem("kapsula_memories", JSON.stringify(memories));
    document.getElementById("status").innerText = "Wspomnienie zapisane!";
    renderLibrary();
}

function renderLibrary() {
    const container = document.getElementById("memoryLibrary");
    container.innerHTML = "";
    const memories = JSON.parse(localStorage.getItem("kapsula_memories")) || [];

    memories.forEach(memory => {
        const now = Date.now();
        const isUnlocked = now >= memory.unlockDate;
        const timeLeft = Math.ceil((memory.unlockDate - now) / (1000 * 60 * 60 * 24));
        const div = document.createElement("div");
        div.className = "memoryItem";
        div.innerHTML = `<strong>${new Date(memory.created).toLocaleDateString()}</strong>: ` +
                        (isUnlocked ? `<span style="color:green;">ODBLOCKOWANE</span>` :
                         `Odblokowanie za ${timeLeft} dni`) +
                        `<br>Treść: ${memory.text.substring(0,20)}...`;
        container.appendChild(div);
    });
}

window.onload = renderLibrary;
