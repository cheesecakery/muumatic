// Finds chart & data
const ctx = document.getElementById('chart');
let tracks = JSON.parse(ctx.getAttribute('data-anim'));

// Gets the index, name and artist of each track
let names = tracks.map((x, ind) => `${ind + 1}: ${x['name']}, ${x['artist']}`);
// Gets the loudness of each track
let loudnessP = tracks.map(x => x['loudness']);

// Create the chart
let chart = new Chart(ctx, {
type: 'bar',
data: {
    labels: names,
    datasets: [{
        label: 'loudness',
        data: loudnessP
    }]
},
options: {
    scales:{
        x: {
            display: false,
            gridLines: false
        }
    },
    animation: {
        duration: 0
    }
}
});

// Change chart data on clicking a dropdown link
document.querySelectorAll('.feature').forEach(item => {
    item.addEventListener('click', _ => {
        // Gets new feature to chart + corresponding values
        let featLabel = item.textContent;
        let values = tracks.map(x => x[featLabel]);

        // Update dataset
        chart.data.datasets[0].label = featLabel;
        chart.data.datasets[0].data = values;
        chart.update();
    });
})