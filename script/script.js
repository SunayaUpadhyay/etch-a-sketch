// Constants//

const mainDiv = document.querySelector("#main");
const slider = document.getElementById("grid-num");
const clearButton = document.getElementById("clear");
const colorfulButton = document.getElementById("colorful");
const sliderLabel = document.getElementById("slider-label")
const CONTAINER_SIZE = 600;

//================================//

//Variable//

let colorPick = "black";

//================================// 

//Functions//

function createDiv(gridNum) {
    let counter = 0;
    let container = document.createElement("div");
    container.setAttribute("id", "div-container");
    container.setAttribute("ondragstart", "return false;");
    container.style.cssText = `grid-template-columns: repeat(${gridNum}, ${CONTAINER_SIZE/gridNum}px);
                               grid-template-rows: repeat(${gridNum}, ${CONTAINER_SIZE/gridNum}px);
                               width: ${CONTAINER_SIZE + 4.5}px;
                               height: ${CONTAINER_SIZE + 4.5}px;`
    for (let j = 0; j < gridNum; j++) {
        for (let i = 0; i < gridNum; i++) {
            let div = document.createElement("div")
            div.setAttribute("class", "div-block")
            div.setAttribute("id", `d${counter}`);
            div.setAttribute("data-color", "hsl(0, 0%, 100%)");
            div.setAttribute("ondragstart", "return false;")
            container.appendChild(div);
            counter++;
        }
    }
    return container;
}

function putCanvas(gridNum) {
    let clickedDiv = "";
    mainDiv.appendChild(createDiv(gridNum));
    let divBlockList = document.querySelectorAll(".div-block");

    let clicked = false;
    document.addEventListener("mousedown", (e) => {
        clicked = true
    })
    document.addEventListener("mouseup", () => {
        clicked = false;
    })
    divBlockList.forEach((div) => {
        div.addEventListener("mousemove", (e) => {
            if (clicked && e.target.id != clickedDiv) {
                clickedDiv = e.target.id;
                let activeDiv = document.querySelector(`#${e.target.id}`)
                let inputColor = getColor(e.target.getAttribute("data-color"));
                e.target.dataset.color = inputColor;
                activeDiv.style.backgroundColor = inputColor;   
            }
        })
    } )
}


function getColor(currentColor) {
    let color = ""
    if (colorPick == "black") {
        color = "hsl(0, 0%, 0%)";  
    } else if (colorPick == "colorful") {
        let h = Math.floor(Math.random() * 361);
        let s = Math.floor(30 + Math.random() * 61);
        let l = Math.floor(30 + Math.random() * 41);

        color = `hsl(${h}, ${s}%, ${l}%)`;
    } else if (colorPick == "erase") {
        color = "hsl(0, 0%, 100%)";
    } else if (colorPick == "darken" || colorPick == "lighten") {
        let regex = /\d{1,3}(?=%|,)/g;
        let hsl = currentColor.match(regex);
        let lightness = parseInt(hsl[2]);
        if (colorPick == "darken") {
            lightness -= 10
            if (lightness < 0) {
                lightness = 0;
            }
        } else {
            lightness += 10
            if (lightness > 100) {
                lightness = 100;
            }
        }
        color = `hsl(${hsl[0]}, ${hsl[1]}%, ${lightness}%)`;
    }
    return color;
}


//==================================//


//Program//

// Initial canvas
putCanvas(24);

// Change canvas when grid value changes
slider.addEventListener("input", (e) => {
    mainDiv.removeChild(mainDiv.lastElementChild); // remove previous canvas
    let gridValue = e.target.value;
    putCanvas(gridValue);               // add new canvas with different grid
    sliderLabel.innerText = `${gridValue} X ${gridValue} Grid`
})

//Clear the canvas
clearButton.addEventListener("click", (e) => {
    mainDiv.removeChild(mainDiv.lastElementChild); // remove previous canvas
    putCanvas(slider.value);               // add new canvas 
})

//Eventlistener to listen for which color to use
colorList = document.querySelectorAll(".color-btn");
colorList.forEach((color) => {
    color.addEventListener("click", (e) => {
        let coloredButton = document.getElementsByClassName("button-selected")[0];
        if (coloredButton) {
            coloredButton.classList.remove("button-selected");
        }
        color.classList.add("button-selected");
        colorPick = color.value;
    })
})
