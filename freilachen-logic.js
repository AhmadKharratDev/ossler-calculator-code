document.addEventListener("DOMContentLoaded", function () {

  let SHEET_ID = "1q1iVjLgC1sILKSa7Sl1uQ5Qdl2G5ToJPPTEa0g3cNLY";
  let SHEET_TITLE = "Equations";
  let SHEET_RANGE = "E13:F17";

  let num1;
  let num2;
  let num3;
  let num4;
  let estimateString;
  let failString1;
  let failString2;

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
      estimateString = String(data.table.rows[2].c[0].v);
      failString1 = String(data.table.rows[3].c[0].v);
      failString2 = String(data.table.rows[4].c[0].v);

      // Listen for click events on the button with a data-form attribute containing "next-btn"
      document
        .querySelector('[data-form*="next-btn"]')
        .addEventListener("click", function () {
          // Get the value of the land size input
          const landSizeInput = document.getElementById("landSizeInput");
          const landSizeValue = landSizeInput.value.trim(); // Trim whitespace from the input value

          // Get the selected option from the select input
          const selectInput = document.getElementById("artSelectFreiflache");
          const selectedOption = selectInput.value;

          // Check if the input values are not empty
          if (landSizeValue !== "" && selectedOption !== "") {
            // Store the values in sessionStorage
            sessionStorage.setItem("landSizeValue", landSizeValue);
            sessionStorage.setItem("selectedOption", selectedOption);

            // Select the element where you want to display the data on the new page
            const estimateDisplayNum = document.getElementById("estimateDisplayNum");

            // Construct the appropriate template based on the selected option and land size value
            let template;
            switch (selectedOption) {
              case "1":
                if (landSizeValue < 10) {
                  template = `${failString1}`;
                } else {
                  template = `${estimateString} ${
                    (landSizeValue * num1 * 1000).toLocaleString()
                  }€ - ${
                    (landSizeValue * num2 * 1000).toLocaleString()
                  }€ zzgl. Mehrwertsteuer pro Jahr.`;
                }
                break;
              case "2":
              case "3":
                if (landSizeValue < 5) {
                  template = `${failString2}`;
                } else {
                  template = `Ihre Einmalpacht wurde auf einen Betrag zwischen \n${
                    (landSizeValue * num3 * 1000).toLocaleString()
                  }€ - ${
                    (landSizeValue * num4 * 1000).toLocaleString()
                  }€ berechnet`;
                }
                break;
              default:
                template = `No estimate available.`;
            }

            // Display the template
            estimateDisplayNum.textContent = template;
          } else {
            return;
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
  });
});
