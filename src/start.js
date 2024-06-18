var hardStartButton = document.getElementById('hardStartButton');
var easyStartButton = document.getElementById('easyStartButton');
var colorButton = document.getElementById('colorButton');
var colorPicker = document.getElementById('colorPicker');
var colorList = document.getElementById('colorList');
var selectedColor = [];
hardStartButton === null || hardStartButton === void 0 ? void 0 : hardStartButton.addEventListener('click', function () {
    sessionStorage.setItem('selectedColors', JSON.stringify(selectedColor));
    sessionStorage.setItem('game', "hard");
    window.location.href = './index.html';
});
easyStartButton === null || easyStartButton === void 0 ? void 0 : easyStartButton.addEventListener('click', function () {
    sessionStorage.setItem('selectedColors', JSON.stringify(selectedColor));
    sessionStorage.setItem('game', "easy");
    window.location.href = './index.html';
});
colorButton === null || colorButton === void 0 ? void 0 : colorButton.addEventListener('click', function () {
    var _a;
    selectedColor.push(colorPicker.value);
    var color = document.createElement("span");
    color.textContent = "■";
    color.className = "col-1 text-center";
    color.style.color = colorPicker.value;
    color.style.backgroundColor = colorPicker.value;
    color.style.border = "0.1rem solid black";
    color.style.borderCollapse = "collapse";
    colorList === null || colorList === void 0 ? void 0 : colorList.appendChild(color);
    var colorRemoveButton = document.getElementById('colorRemoveButton');
    if (!colorRemoveButton) {
        var colorRemove = document.getElementById('colorRemove');
        var colorRemoveButton_1 = document.createElement("button");
        colorRemoveButton_1.id = "colorRemoveButton";
        colorRemoveButton_1.className = "btn btn-danger justify-content-end col-3";
        colorRemoveButton_1.textContent = "削除";
        colorRemove === null || colorRemove === void 0 ? void 0 : colorRemove.appendChild(colorRemoveButton_1);
    }
    (_a = document.getElementById("colorRemoveButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        selectedColor.length = 0;
        while (colorList === null || colorList === void 0 ? void 0 : colorList.firstChild) {
            colorList.firstChild.remove();
        }
        colorRemoveButton === null || colorRemoveButton === void 0 ? void 0 : colorRemoveButton.remove();
    });
});
