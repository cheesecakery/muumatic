// Script to toggle whether animation or graph is displaed
function displayContent() {
    let button = document.getElementById("graphB");
    let graph = document.getElementById("graphDiv");
    let animation = document.getElementById("animation");

    // On first toggle - set the graphs' display to the one set in CSS
    if (graph.style.display === "") {
        graph.style.display = getComputedStyle(graph).display;
    }

    // Toggle which content is visible
    if (graph.style.display === "none") {
        button.innerHTML = 'animation';
        graph.style.display = 'block';
        animation.style.display = 'none';
    } else {
        button.innerHTML = 'graph';
        graph.style.display = 'none';
        animation.style.display = 'block';
    }
}
