document.addEventListener("DOMContentLoaded", function () {

  let SHEET_ID = "1q1iVjLgC1sILKSa7Sl1uQ5Qdl2G5ToJPPTEa0g3cNLY";
  let SHEET_TITLE = "Equations";
  let SHEET_RANGE = "E2:F4";

  let num1;
  let num2;
  let num3;
  let num4;
  let failString1;

  let FULL_URL = ('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?sheet=' + SHEET_TITLE +'&range=' + SHEET_RANGE);

  fetch(FULL_URL)
    .then(res => res.text()) // Convert the response to text
    .then(rep => {
      // Parse the JSON data from the response
      let data = JSON.parse(rep.slice(47, -2)); // Adjust the slice according to your response structure
      
      num1 = Number(data.table.rows[0].c[0].v);
      num2 = Number(data.table.rows[0].c[1].v);
      num3 = Number(data.table.rows[1].c[0].v);
      num4 = Number(data.table.rows[1].c[1].v);
      failString1 = String(data.table.rows[2].c[0].v);

      // Now you can access the equation data here
      console.log(num1, num2, num3, num4, failString1);

      // Listen for click events on the button with a data-form attribute containing "next-btn"
      document
        .querySelector('[data-form*="next-btn"]')
        .addEventListener("click", function () {
          // Get the value of the land size input
          const landSizeInput = document.getElementById("landSizeInput");
          const landSizeValue = landSizeInput.value.trim(); // Trim whitespace from the input value

          // Get the selected option from the select input
          const selectInput = document.getElementById("Type-of-Lease-Dachflache");
          const selectedOption = selectInput.value;

          // Check if the input values are not empty
          if (landSizeValue !== "" && selectedOption !== "") {
            // Store the values in sessionStorage
            sessionStorage.setItem("landSizeValue", landSizeValue);
            sessionStorage.setItem("selectedOption", selectedOption);
            console.log("Land size value stored:", landSizeValue);
            console.log("Selected option stored:", selectedOption);

            // Select the element where you want to display the data on the new page
            const estimateDisplayNum =
              document.getElementById("estimateDisplayNum");

            // Construct the appropriate template based on the selected option and land size value
            let template;
            switch (selectedOption) {
              case "1":
              case "2":
              case "3":
                if (landSizeValue < 1000) {
                  template = `${failString1}`;
                } else {
                  template = `Your estimate is valued /n ${
                    Math.trunc(landSizeValue / num1 * num2) / 10
                  }K€ - ${Math.trunc(landSizeValue / num3 * num4) / 10}K€`;
                }
                break;
              default:
                template = `No estimate available.`;
            }

            // Display the template
            estimateDisplayNum.textContent = template;
          } else {
            // If any input value is empty, log a message for debugging
            console.log("Input value(s) is empty");
          }
        });
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // Listen for the beforeunload event
  window.addEventListener("beforeunload", function () {
    // Clear sessionStorage
    sessionStorage.clear();
    console.log("Session storage cleared");
  });
});
