//------------------------ CHART CREATION & INPUT FORMATTING ----------------------------

Webflow.push(function () {
  const input = document.getElementById("investment-amount");

  // Set default value
  input.value = "100000";

  // Handle input formatting
  input.addEventListener("input", function (e) {
    // Get the raw number value (remove all non-digits)
    let value = this.value.replace(/\D/g, "");

    // Allow zero and format numbers
    if (value !== "") {
      this.value = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);

      // Store raw number value
      this.dataset.value = value;

      // Update chart and values
      createChart();
      updateValues();
    } else {
      // If empty, allow it
      this.value = "";
      this.dataset.value = "0";
    }
  });

  // Handle up/down arrows
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();

      let currentValue = parseInt(this.dataset.value) || 0;
      let increment = e.shiftKey ? 10000 : 1000; // Bigger increment if shift is held

      if (e.key === "ArrowUp") {
        currentValue += increment;
      } else {
        currentValue = Math.max(0, currentValue - increment);
      }

      // Update value and trigger input event
      this.dataset.value = currentValue.toString();
      this.value = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(currentValue);

      // Trigger updates
      createChart();
      updateValues();
    }
  });

  // Initial trigger
  const event = new Event("input");
  input.dispatchEvent(event);
});

// Initialize chart
let myChart = null;

function createChart() {
  const input = document.getElementById("investment-amount");
  const amount = parseFloat(input.dataset.value) || 0;
  const years = parseInt(document.getElementById("year-select").value);

  // Only create/update chart if there's a valid amount
  if (amount >= 0) {
    // Changed from > to >= to include zero
    // Calculate data points
    const dataA = Array.from({ length: years + 1 }, (_, i) => amount * Math.pow(1.25, i));
    const dataB = Array.from({ length: years + 1 }, (_, i) => amount * Math.pow(1.18, i));
    const dataC = Array.from({ length: years + 1 }, (_, i) => amount * Math.pow(1.12, i));

    // Find maximum value for scale
    const maxValue = Math.max(...dataA);
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
            borderColor: "rgb(0, 67, 160)",
            backgroundColor: "rgba(38, 153, 73, 0.25)",
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
            fill: "+1",
          },
          {
            data: dataB,
            borderColor: "rgb(0, 67, 160)",
            backgroundColor: "rgba(124, 176, 78, 0.25)",
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
            borderDash: [6, 3],
            fill: "+1",
          },
          {
            data: dataC,
            borderColor: "rgb(0, 67, 160)",
            backgroundColor: "rgba(153, 102, 255, 0)",
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
            borderDash: [2, 3],
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
  const input = document.getElementById("investment-amount");
  const amount = parseFloat(input.dataset.value) || 0;
  const years = parseInt(document.getElementById("year-select").value) || 0;

  if (amount >= 0) {
    // Changed from > to >= to include zero
    // Calculate values
    const valueA = amount * Math.pow(1.25, years);
    const valueB = amount * Math.pow(1.18, years);
    const valueC = amount * Math.pow(1.12, years);

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
}

// Event listeners
document.getElementById("investment-amount").addEventListener("input", updateValues);
document.getElementById("year-select").addEventListener("change", updateValues);

// Initial update
Webflow.push(function () {
  updateValues();
});

