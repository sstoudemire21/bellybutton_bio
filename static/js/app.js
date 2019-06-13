function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  
  d3.json(`/metadata/${sample}`).then(function (data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var Panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    Panel.html("");


    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(function ([key, value]) {
      Panel.append("p").text(`${key} : ${value}`);

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

    var layout = {
      margin: { t: 0 },
      xaxis: { title: "Belly Button Sample" },
      hovermode: "closest"
    };
    var bubble = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Picnic"
      }
      }
    ];
    Plotly.plot("bubble", data, layout);

    

    // @TODO: Build a Pie Chart
    d3.json(`/samples/${sample}`).then(function (data) {
      var pieData = [{
              values: data.sample_values.slice(0, 10),
              labels: data.otu_ids.slice(0, 10),
              hovertext: data.otu_labels.slice(0, 10),
              type: 'pie',
            }];
            var layout = {
              showlegend: true,
            };

           
            Plotly.newPlot('pie', pieData, layout);
      
          });
          

    });
  

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
}
