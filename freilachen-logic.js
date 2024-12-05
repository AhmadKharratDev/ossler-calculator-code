document.addEventListener("DOMContentLoaded", function () {
  const SHEET_ID = "1q1iVjLgC1sILKSa7Sl1uQ5Qdl2G5ToJPPTEa0g3cNLY";
  const SHEET_TITLE = "Equations";
  const SHEET_RANGE = "E2:F4";

  let num1, num2, num3, num4, failString1;

  const FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;

  // Fetch data from the Google Sheets URL
  fetch(FULL_URL)
    .then((res) => res.text())
    .then((rep) => {
      const data = JSON.parse(rep.slice(47, -2)); // Parse the response, trimming extra characters
      num1 = Number(data.table.rows[0].c[0].v);
      num2 = Number(data.table.rows[0].c[1].v);
      num3 = Number(data.table.rows[1].c[0].v);
      num4 = Number(data.table.rows[1].c[1].v);
      failString1 = String(data.table.rows[2].c[0].v);

      console.log("Loaded values:", { num1, num2, num3, num4, failString1 });

      // Add event listener to the button
      document
        .querySelector('[data-form*="next-btn"]')
        .addEventListener("click", function () {
          const landSizeInput = document.getElementById("landSizeInput");
          const selectInput = document.getElementById("Type-of-Lease-Dachflache");

          const landSizeValue = landSizeInput.value.trim();
          const selectedOption = selectInput.value;

          if (landSizeValue !== "" && selectedOption !== "") {
            sessionStorage.setItem("landSizeValue", landSizeValue);
            sessionStorage.setItem("selectedOption", selectedOption);

            const estimateDisplayNum = document.getElementById("estimateDisplayNum");

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

                  const lowerEstimateFormatted = lowerEstimate.toLocaleString();
                  const upperEstimateFormatted = upperEstimate.toLocaleString();

                  template = `Ihre voraussichtliche Pacht beträgt \n ${lowerEstimateFormatted}€ - ${upperEstimateFormatted}€ zzgl. Mehrwertsteuer pro Jahr.`;
                }
                break;

              default:
                template = `No estimate available.`;
            }

            estimateDisplayNum.textContent = template;
          } else {
            console.log("Input values are missing");
          }
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Clear session storage on page unload
  window.addEventListener("beforeunload", function () {
    sessionStorage.clear();
    console.log("Session storage cleared");
  });
});
