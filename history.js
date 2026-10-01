const historyList =
    document.getElementById("historyList");

const clearHistoryButton =
    document.querySelector(".clear-history-button");


function loadHistory() {

    const history =
        JSON.parse(
            localStorage.getItem("engiHistory")
        ) || [];


    if (history.length === 0) {

        historyList.innerHTML = `
            <div class="empty-history">

                <div class="empty-icon">
                    🧮
                </div>

                <h3>
                    ยังไม่มีประวัติการคำนวณ
                </h3>

                <p>
                    เมื่อคุณใช้เครื่องมือคำนวณ
                    ประวัติการคำนวณจะแสดงที่นี่
                </p>

                <a href="index.html#tools"
                   class="history-button">

                    🛠 ไปที่ Engineering Tools →

                </a>

            </div>
        `;

        return;
    }


    historyList.innerHTML = "";


    history.forEach(function(item) {

        const historyItem =
            document.createElement("div");

        historyItem.className =
            "history-item";


        historyItem.innerHTML = `

            <div class="history-icon">
                ${item.icon}
            </div>

            <div class="history-content">

                <h3>
                    ${item.title}
                </h3>

                <p>
                    ${item.calculation}
                </p>

                <span>
                    ${item.time}
                </span>

            </div>

        `;


        historyList.appendChild(
            historyItem
        );

    });

}


if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
        "click",
        function() {

            const history =
                JSON.parse(
                    localStorage.getItem("engiHistory")
                ) || [];


            if (history.length === 0) {

                alert(
                    "ยังไม่มีประวัติการคำนวณ"
                );

                return;

            }


            const confirmClear =
                confirm(
                    "คุณต้องการลบประวัติทั้งหมดหรือไม่?"
                );


            if (confirmClear) {

                localStorage.removeItem(
                    "engiHistory"
                );

                loadHistory();

            }

        }
    );

}


loadHistory();