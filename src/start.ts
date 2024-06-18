const hardStartButton = document.getElementById('hardStartButton') as HTMLButtonElement;
const easyStartButton = document.getElementById('easyStartButton') as HTMLButtonElement;
const colorButton = document.getElementById('colorButton') as HTMLButtonElement;
const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
const colorList = document.getElementById('colorList');
const selectedColor: string[] = [];

hardStartButton?.addEventListener('click', function() {
    sessionStorage.setItem('selectedColors', JSON.stringify(selectedColor));
    sessionStorage.setItem('game', "hard");
    window.location.href = './index.html';
});

easyStartButton?.addEventListener('click', function() {
    sessionStorage.setItem('selectedColors', JSON.stringify(selectedColor));
    sessionStorage.setItem('game', "easy");
    window.location.href = './index.html';
});
colorButton?.addEventListener('click', function() {
    selectedColor.push(colorPicker.value);
    let color = document.createElement("span");
    color.textContent = "■";
    color.className = "col-1 text-center";
    color.style.color = colorPicker.value;
    color.style.backgroundColor = colorPicker.value;
    color.style.border = "0.1rem solid black";
    color.style.borderCollapse = "collapse";
    colorList?.appendChild(color);

    let colorRemoveButton = document.getElementById('colorRemoveButton');
    if(!colorRemoveButton) {
        let colorRemove = document.getElementById('colorRemove');
        let colorRemoveButton = document.createElement("button");
        colorRemoveButton.id = "colorRemoveButton";
        colorRemoveButton.className = "btn btn-danger justify-content-end col-3";
        colorRemoveButton.textContent = "削除"
        colorRemove?.appendChild(colorRemoveButton);
    }

    document.getElementById("colorRemoveButton")?.addEventListener("click", () => {
        selectedColor.length = 0;
        while (colorList?.firstChild) {
            colorList.firstChild.remove();
        }
        colorRemoveButton?.remove();
    })
});