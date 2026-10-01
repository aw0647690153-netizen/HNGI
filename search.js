const searchInput =
    document.getElementById("toolSearch");

const toolCards =
    document.querySelectorAll(".tool-card");

const noResult =
    document.getElementById("noResult");


searchInput.addEventListener(
    "input",
    function() {

        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();

        let found = false;


        toolCards.forEach(
            function(card) {

                const cardText =
                    card.textContent.toLowerCase();

                const keywords =
                    card.getAttribute(
                        "data-keywords"
                    ) || "";


                const searchData =
                    cardText +
                    " " +
                    keywords.toLowerCase();


                if (
                    searchText === "" ||
                    searchData.includes(searchText)
                ) {

                    card.style.display = "";

                    found = true;

                }

                else {

                    card.style.display = "none";

                }

            }
        );


        if (
            searchText !== "" &&
            found === false
        ) {

            noResult.style.display = "block";

        }

        else {

            noResult.style.display = "none";

        }

    }
);