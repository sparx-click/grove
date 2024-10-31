//------------------------ CHART CREATION & INPUT FORMATTING ----------------------------

Webflow.push(function () {
  const input = document.getElementById("investment-amount");

  // Set default value
  input.value = "100000";

  // Handle input formatting
  input.addEventListener("input", function (e) {
    // Get the raw number value (remove all non-digits)
    let value = this.value.replace(/\D/g, "");

    // Format for display
    if (value) {
      this.value = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }

    // Store raw number value as a data attribute for calculations
    this.dataset.value = value;
  });

  // Initial trigger
  const event = new Event("input");
  input.dispatchEvent(event);
});

// Initialize chart
let myChart = null;

function createChart() {
  const amount = parseFloat(document.getElementById("investment-amount").dataset.value);
  const years = parseInt(document.getElementById("year-select").value);

  // Calculate data points
  const dataA = Array.from({ length: years + 1 }, (_, i) => amount * Math.pow(1.3, i));
  const dataB = Array.from({ length: years + 1 }, (_, i) => amount * Math.pow(1.18, i));
  const dataC = Array.from({ length: years + 1 }, (_, i) => amount * Math.pow(1.11, i));

  // Find maximum value for scale
  const maxValue = Math.max(...dataA);
  // You can adjust this multiplier to control spacing (currently set to 1.1)
  const scaledMax = maxValue * 1.1;

  // Destroy existing chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  // Create new chart
  const ctx = document.getElementById("chart-canvas").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: years + 1 }, (_, i) => i.toString()),
      datasets: [
        {
          data: dataA,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(249, 250, 251, 1)",
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
          fill: "+1",
        },
        {
          data: dataB,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(249, 250, 251, 1)",
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
          fill: "+1",
        },
        {
          data: dataC,
          borderColor: "rgb(153, 102, 255)",
          backgroundColor: "rgba(153, 102, 255, 0)",
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
          fill: "origin",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        filler: {
          propagate: true,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
          min: amount,
          max: scaledMax,
          beginAtZero: false,
        },
      },
      maintainAspectRatio: false,
    },
  });
}

// Event listeners
document.getElementById("investment-amount").addEventListener("input", createChart);
document.getElementById("year-select").addEventListener("change", createChart);

// Initial chart creation
document.addEventListener("DOMContentLoaded", createChart);




//------------------------ UPDATING NUMBERS ----------------------------

function formatNumber(num) {
  return "$" + Math.round(num).toLocaleString();
}

function animateNumber(element, endValue) {
  let startValue = parseFloat(element.textContent.replace(/[^0-9.-]+/g, "")) || 0;

  gsap.to(
    { val: startValue },
    {
      val: endValue,
      duration: 0.5,
      ease: "power1.out",
      onUpdate: function () {
        element.textContent = formatNumber(this.targets()[0].val);
      },
    }
  );
}

function updateValues() {
  const amount = parseFloat(document.getElementById("investment-amount").dataset.value) || 0;
  const years = parseInt(document.getElementById("year-select").value) || 0;

  // Calculate values
  const valueA = amount * Math.pow(1.3, years);
  const valueB = amount * Math.pow(1.18, years);
  const valueC = amount * Math.pow(1.11, years);

  // Calculate differences
  const diffAB = valueA - valueB;
  const diffAC = valueA - valueC;

  // Update elements
  const yearElement = document.getElementById("selected-years");
  const valueAElement = document.getElementById("value-a");
  const diffABElement = document.getElementById("diff-ab");
  const diffACElement = document.getElementById("diff-ac");

  // Update year without animation
  if (yearElement) yearElement.textContent = years;

  // Animate number updates
  if (valueAElement) animateNumber(valueAElement, valueA);
  if (diffABElement) animateNumber(diffABElement, diffAB);
  if (diffACElement) animateNumber(diffACElement, diffAC);
}

// Event listeners
document.getElementById("investment-amount").addEventListener("input", updateValues);
document.getElementById("year-select").addEventListener("change", updateValues);

// Initial update
Webflow.push(function () {
  updateValues();
});
