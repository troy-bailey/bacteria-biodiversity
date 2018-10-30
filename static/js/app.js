function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var defaultURL = `/metadata/${sample}`;
  // var mdata = []
  var panel = d3.select(`#sample-metadata`)
  // Use `.html("") to clear any existing metadata
  panel.html("")
  panel.append("ul")
  panelist = panel.select("ul")

  d3.json(defaultURL).then(function(data) {
    var mdata = [data];
    console.log(mdata);
    Object.entries(mdata[0]).forEach(([key, value]) => {
      // Log the key and value
      console.log(`Key: ${key} and Value ${value}`);
      panelist.append("li").html(`${key}: ${value}`);
    });
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var defaultURL = `/samples/${sample}`;
  d3.json(defaultURL).then(function(data) {

    var data = [data];
    console.log(data);

    var ids = data[0].otu_ids
    var labels = data[0].otu_labels
    var values = data[0].sample_values

    console.log(ids);
    numb = ids[0]
    console.log(numb+numb)

    console.log(labels);
    console.log(values);

        // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: ids,
      y: values,
      mode: 'markers',
      marker: {
        size: values,
        color: ids,
        colorscale:"Earth",
        }
      };
    var data = [trace1]
    var layout = {
    };
    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    var sortable = []
    // console.log(ids.length)
    for (var i = 0; i < ids.length; i++) {
      // console.log("Iteration #", i);
      sortable.push({id: ids[i], label: labels[i], sampleValue: values[i]})
    }
    // console.log(sortable)
    // console.log(sortable[0])
    // console.log(sortable[0].sampleValue)

    function compare(a, b) {

      const sampleValueA = parseInt(a.sampleValue);
      const sampleValueB = parseInt(b.sampleValue);
      // console.log(a.sampleValue)
      // console.log(parseInt(a.sampleValue))
      let comparison = 0;
      if (sampleValueA > sampleValueB) {
        comparison = -1;
      } else if (sampleValueA < sampleValueB) {
        comparison = 1;
      }
      // console.log(comparison)
      return comparison;
    }
    sortable.sort(compare);

    console.log(sortable)
    topTen = sortable.slice(0, 10)
    console.log(topTen)
    var pieValues= []
    var pieLabels=[]
    for (var i = 0; i < 10; i++) {
      // console.log("Iteration #", i);
      pieValues.push(sortable[i].sampleValue)
      pieLabels.push(sortable[i].id)
    }
    console.log(pieValues)
    console.log(pieLabels)
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data = [{
      values: pieValues,
      labels: pieLabels,
      type: 'pie'
    }];
    
    var layout = {
      height: 500,
      width: 500,
    };
    
    Plotly.newPlot('pie', data, layout);
  });
  

}

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
