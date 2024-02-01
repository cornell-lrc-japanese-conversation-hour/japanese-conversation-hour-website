// Scrolling content
const content = document.getElementById("content");
const contentBlocks = document.getElementsByClassName("content-block-content");

// Menu/nav content
const menu = document.getElementsByTagName("nav")[0];
const menuLine = document.getElementById("nav-line");

// Menu colors for each block
const menuColors = [
    "var(--navy)",
    "var(--yellow)",
    "var(--navy)",
    "var(--green)"
];

// Newsletter content
const selector = document.getElementById("newsletter-date-selector");
const newsletterViewer = document.getElementById("newsletter-viewer");
let newsletterData = {}

// Scroll vars
let lastLoadedBlock = -1;
let activeMenuBlock = 0;

let prevScroll = 0;
let goingDown = true;

// SCROLL FUNCTIONS ===============================================================================

function onScroll() {
    goingDown = prevScroll < content.scrollTop; // Scrolling up/down
    prevScroll = content.scrollTop;

    if (lastLoadedBlock < contentBlocks.length - 1) { // Load newly scrolled block IFF not loaded
        const halfwayPoint = content.scrollTop + document.documentElement.clientHeight / 2;
        if (halfwayPoint >= contentBlocks[lastLoadedBlock + 1].offsetTop) {
            showBlock(lastLoadedBlock + 1);
        }
    }

    // Change menu color based on current scroll position & menu offset
    const menuBottomPoint = menu.offsetTop + menu.offsetHeight / 2;
    const localOffset = content.scrollTop - contentBlocks[activeMenuBlock].offsetTop;
    if (goingDown && activeMenuBlock < contentBlocks.length - 1 
        && contentBlocks[activeMenuBlock + 1].offsetHeight - localOffset <= menuBottomPoint) {
        menu.style.color = menuColors[activeMenuBlock + 1];
        menuLine.style.backgroundColor = menuColors[activeMenuBlock + 1];
        activeMenuBlock++;
    }
    else if (!goingDown && activeMenuBlock > 0
            && content.scrollTop + menuBottomPoint <= contentBlocks[activeMenuBlock].offsetTop) {
        menu.style.color = menuColors[activeMenuBlock - 1];
        menuLine.style.backgroundColor = menuColors[activeMenuBlock - 1];
        activeMenuBlock--;
    }
}

function showBlock(index) { // Animate in content block at index
    if (index >= 0 && index < contentBlocks.length && index > lastLoadedBlock) {
        const block = contentBlocks[index];
        block.style.opacity = "100%";
        block.style.transform = "none";
        lastLoadedBlock = index;

        if (lastLoadedBlock == 2) {
            setTimeout(() => { newsletterViewer.style.overflow = "scroll"; }, 500);
        }
    }
}

function scrollToBlock(index) { // Scroll down to content block at index
    const topLeftY = contentBlocks[index].offsetTop - 40;
    content.scroll({
        top: topLeftY,
        left: 0,
        behavior: "smooth",
    });
}

// NEWSLETTER QUERY ===============================================================================

function queryNewsletter() {
    if (selector.value in newsletterData) {
        newsletterViewer.innerHTML = newsletterData[selector.value];
    }
    else {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    newsletterData[selector.value] = httpRequest.responseText;
                    newsletterViewer.innerHTML = newsletterData[selector.value];
                } 
                else { 
                    // error
                 }
            } 
            else { 
                // loading
            }
        }
        httpRequest.open("GET", `/${selector.value}`, true);
        httpRequest.send();
    }
}

// ON LOAD =======================================================================================

showBlock(0);
content.addEventListener("scroll", onScroll);
