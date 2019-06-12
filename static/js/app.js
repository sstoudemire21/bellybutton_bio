function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  
  d3.json(`/metadata/${sample}`).then(function (sample) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var Panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    Panel.html("");


    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      Panel.append("p");
      row.text(`${key}: ${value}`);

    });
  }
  )
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function (data) {

    // @TODO: Build a Bubble Chart using the sample data
    const otu_ids = data.otu_ids;
    const sample_values = data.sample_values;
    const otu_labels = data.otu_labels;

    var bubble = {
      margin: { t: 0 }, xaxis: { title: "Belly Button Sample" }, hovermode: "closest"
    };
    var bubbleData = {
      x: otu_ids, y: sample_values, text: otu_labels, mode: "markers", marker: {
        size: sample_values,
        color: otu_ids, colorscale: "Pinic"
      }
    };


    Plotly.plot(bubble, bubbleData, layout);

    // @TODO: Build a Pie Chart
    d3.json(url).then(function (data) {
      var data = [{
              values: data.sample_values.slice(0, 10),
              labels: data.otu_ids.slice(0, 10),
              hovertext: data.otu_labels.slice(0, 10),
              type: 'pie',
            }];
            var layout = {
              showlegend: true,
            };
            Plotly.newPlot('pie', data, layout);
      
          });

    });
  };



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
