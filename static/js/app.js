// Initialize the dashboard
function init() {
    // Use D3 to read the JSON file
    d3.json("samples.json").then((data) => {
        // Populate dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        data.names.forEach((name) => {
            dropdownMenu.append("option")
                        .text(name)
                        .property("value", name);
        });

        // Call update functions
        var firstSample = data.names[0];
        updateCharts(firstSample);
        updateMetadata(firstSample);
    });
}

// Update the charts based on the selected sample
function updateCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var result = samples.find(s => s.id === sample);

        var sample_values = result.sample_values.slice(0, 10).reverse();
        var otu_ids = result.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var otu_labels = result.otu_labels.slice(0, 10).reverse();

// Bar Chart        
        var bar_trace = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            type: "bar",
            orientation: "h"
        };

        var bar_layout = {
            title: "Top 10 OTUs Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", [bar_trace], bar_layout);

// Bubble Chart        
        var bubble_trace = {
            x: result.otu_ids,
            y: result.sample_values,
            text: result.otu_labels,
            mode: 'markers',
            marker: {
                size: result.sample_values,
                color: result.otu_ids,
                colorscale: 'Earth'
            }
        };

        var bubble_layout = {
            title: 'Bacteria Cultures Per Sample',
            showlegend: false,
            height: 600,
            width: 1200
        };

        Plotly.newPlot("bubble", [bubble_trace], bubble_layout);

// Frequency Chart
        var washFreq = data.metadata.find(m => m.id.toString() === sample).wfreq;
        var gauge_trace = {
            domain: { x: [0, 1], y: [0, 1] },
            value: washFreq,
            title: { text: "Belly Button Washing Frequency per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                bar: { color: "darkblue" },
                steps: [
                    { range: [0, 1], color: "lightcyan" },
                    { range: [1, 2], color: "cyan" },
                    // ... (additional steps if desired)
                ]
            }
        };

        var gauge_layout = {
            width: 600,
            height: 450,
            margin: { t: 0, b: 0 }
        };

        Plotly.newPlot('gauge', [gauge_trace], gauge_layout);
    });
}

// Update the metadata information
function updateMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var result = metadata.find(m => m.id.toString() === sample);

        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");

        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Dropdown selection event code 
function optionChanged(newSample) {
    updateCharts(newSample);
    updateMetadata(newSample);
}

// Initialize the dashboard
init();
