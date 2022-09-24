

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

const width = 1000;
const height = 450;
const padding = 60;


const monthsArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];



const filterOut = (array) => {
    let product = [];
    array.map(el => {
      if(product.indexOf(el) === -1) {
        product.push(el)
      }
    })
    return product
  }


fetch(url)
        .then(response => response.json())
        .then(heatInfo => {
            

            let baseTemperature = heatInfo.baseTemperature;
            let monthlyVariance = heatInfo.monthlyVariance;
            // let tempVariance = monthlyVariance.variance;

            // console.log(baseTemperature, monthlyVariance)

            console.log(monthlyVariance.map(el => el.year))


            let canva = d3.select("#legend")
                        .attr("width", width)
                        .attr("height", height)



                    
            let xScale = d3.scaleLinear()
                           .domain([d3.min(monthlyVariance, el => el.year ), d3.max(monthlyVariance, el => el.year)])
                           .range([padding, width - padding])



            let yScale = d3.scaleBand()
                           .domain(monthsArr)
                           .range([padding, height - padding])



            let xAxis = d3.axisBottom(xScale)
                          .tickFormat(d3.format("d"))


            let yAxis = d3.axisLeft(yScale)
                          
            
            canva.append("g")
                 .call(xAxis)
                 .attr("id", "x-axis")
                 .attr("transform", `translate(0, ${height - padding})`)

            
            canva.append("g")
                 .call(yAxis)
                 .attr("id", "y-axis")
                 .attr("transform", `translate(${padding}, 0)`)


            let tooltip = d3.select("#tooltip");
            let temp = d3.select("#temp");
            let year = d3.select("#year");

            canva.selectAll("rect")
                 .data(monthlyVariance)
                 .enter()     
                 .append("rect")
                 .attr("class", "cell")
                 .attr("fill", (item) => {
                     
                    let variance = item.variance;

                    // console.log(variance)

                    if(variance <= -1) {
                        return "steelblue"
                    }
                    else if (variance <= 0) {
                        return "yellow"
                    }
                    else if (variance >= 0 && variance < 1) {
                        return "orange"
                    }
                    else if (variance >= 1) {
                        return "red"
                    }
                 })
                 .attr("data-month", item => item.month - 1)
                 .attr("data-year", item => item.year)
                 .attr("data-temp", item => item.variance + baseTemperature)
                 .attr("height", (height - (padding * 2)) / monthsArr.length)
                 .attr("width", (width - (padding * 2)) / filterOut(monthlyVariance.map(el => el.year)).length)
                 .attr("y", item => yScale(monthsArr[item.month - 1]))
                 .attr("x", item => xScale(item.year))
                 .on("mouseover", (event, item) => {
                    tooltip.style("visibility", "visible")
                           .attr("data-year", item.year)
                    temp.text(`Temperature: ${(item.variance + baseTemperature).toFixed(2)}`)
                    year.text(`Year: ${item.year}`)
                 })
                 .on("mouseout", (event, item) => {
                    tooltip.style("visibility", "hidden")
                    temp.text(``)
                    year.text(``)
                 })
                
                


           














        })