document.addEventListener("DOMContentLoaded", function () {
  const SHEET_ID = "1q1iVjLgC1sILKSa7Sl1uQ5Qdl2G5ToJPPTEa0g3cNLY";
  const SHEET_TITLE = "Equations";
  const SHEET_RANGE = "E2:F4";

  let num1, num2, num3, num4, failString1;

  const FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;

  // Fetch data from the Google Sheet
  fetch(FULL_URL)
    .then((res) => res.text())
    .then((rep) => {
      try {
        const data = JSON.parse(rep.slice(47, -2)); // Parse the JSON response
        console.log("Fetched data:", data);

        // Extract values from the response
        num1 = Number(data.table.rows[0].c[0].v);
        num2 = Number(data.table.rows[0].c[1].v);
        num3 = Number(data.table.rows[1].c[0].v);
        num4 = Number(data.table.rows[1].c[1].v);
        failString1 = String(data.table.rows[2].c[0].v);

        console.log("Loaded values:", { num1, num2, num3, num4, failString1 });

        // Add event listener to the button
        const button = document.querySelector('[data-form*="next-btn"]');
        if (!button) {
          console.error("Button with [data-form*='next-btn'] not found!");
          return;
        }

        button.addEventListener("click", function () {
          // Get input values
          const landSizeInput = document.getElementById("landSizeInput");
          const selectInput = document.getElementById("Type-of-Lease-Dachflache");

          if (!landSizeInput || !selectInput) {
            console.error("Required input elements not found!");
            return;
          }

          const landSizeValue = Number(landSizeInput.value.trim());
          const selectedOption = selectInput.value;

          console.log("Inputs:", { landSizeValue, selectedOption });

          if (landSizeValue && selectedOption) {
            // Store values in sessionStorage
            sessionStorage.setItem("landSizeValue", landSizeValue);
            sessionStorage.setItem("selectedOption", selectedOption);

            const estimateDisplayNum = document.getElementById("estimateDisplayNum");
            if (!estimateDisplayNum) {
              console.error("Element with id 'estimateDisplayNum' not found!");
              return;
            }

            // Calculate the estimate
            let template;
            switch (selectedOption) {
              case "1":
              case "2":
              case "3":
                if (landSizeValue < 1000) {
                  template = failString1;
                } else {
                  const lowerEstimate = Math.trunc((landSizeValue / num2) * num1) * 2000;
                  const upperEstimate = Math.trunc((landSizeValue / num4) * num3) * 2000;

                  // Format numbers with toLocaleString
                  const lowerEstimateFormatted = lowerEstimate.toLocaleString();
                  const upperEstimateFormatted = upperEstimate.toLocaleString();

                  template = `Ihre voraussichtliche Pacht beträgt \n ${lowerEstimateFormatted}€ - ${upperEstimateFormatted}€ zzgl. Mehrwertsteuer pro Jahr.`;
                }
                break;
              default:
                template = `No estimate available.`;
            }

            // Display the result
            estimateDisplayNum.textContent = template;
            console.log("Displayed template:", template);
          } else {
            console.log("Missing or invalid input values!");
          }
        });
      } catch (error) {
        console.error("Error processing data:", error);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  // Clear session storage on page unload
  window.addEventListener("beforeunload", function () {
    sessionStorage.clear();
    console.log("Session storage cleared");
  });
});
