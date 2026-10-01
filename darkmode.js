/* ========================================
   ENGI HUB - Dark Mode System
======================================== */

const darkModeBtn =
    document.getElementById("darkModeBtn");


/* ========================================
   Load Saved Mode
======================================== */

if (localStorage.getItem("darkMode") === "enabled") {

    document.body.classList.add("dark-mode");

    if (darkModeBtn) {
        darkModeBtn.textContent = "☀️";
    }

}


/* ========================================
   Dark Mode Button
======================================== */

if (darkModeBtn) {

    darkModeBtn.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );


            if (
                document.body.classList.contains(
                    "dark-mode"
                )
            ) {

                localStorage.setItem(
                    "darkMode",
                    "enabled"
                );

                darkModeBtn.textContent = "☀️";

            }
            else {

                localStorage.setItem(
                    "darkMode",
                    "disabled"
                );

                darkModeBtn.textContent = "🌙";

            }

        }
    );

}