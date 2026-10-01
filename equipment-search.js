document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // Elements
    // ========================================

    const equipmentSearch =
        document.getElementById("equipmentSearch");

    const equipmentResults =
        document.getElementById("equipmentResults");

    const equipmentCategories =
        document.querySelectorAll(".equipment-category");


    // ========================================
    // Database
    // ========================================

    let equipmentDatabase = [];

    let currentCategory = "all";

    let searchTimer = null;


    // ========================================
    // Thai → English
    // ========================================

    const equipmentAliases = {

        "มัลติมิเตอร์": [
            "multimeter",
            "digital multimeter"
        ],

        "มิเตอร์": [
            "multimeter"
        ],

        "วัดไฟ": [
            "multimeter",
            "voltmeter",
            "ammeter"
        ],

        "วัดแรงดัน": [
            "voltmeter",
            "multimeter"
        ],

        "วัดกระแส": [
            "ammeter",
            "clamp meter"
        ],

        "แคลมป์มิเตอร์": [
            "clamp meter"
        ],

        "ออสซิลโลสโคป": [
            "oscilloscope"
        ],

        "สโคป": [
            "oscilloscope"
        ],

        "หัวแร้ง": [
            "soldering iron"
        ],

        "เครื่องบัดกรี": [
            "soldering iron",
            "soldering station"
        ],

        "เวอร์เนียร์": [
            "vernier caliper"
        ],

        "คาลิปเปอร์": [
            "caliper",
            "vernier caliper"
        ],

        "ไมโครมิเตอร์": [
            "micrometer"
        ],

        "วัดความหนา": [
            "micrometer",
            "vernier caliper"
        ],

        "กล้องสำรวจ": [
            "total station",
            "theodolite",
            "automatic level"
        ],

        "กล้องวัดระดับ": [
            "automatic level"
        ],

        "วัดระดับ": [
            "automatic level",
            "laser level"
        ],

        "เครื่องวัดอุณหภูมิ": [
            "thermometer"
        ],

        "วัดอุณหภูมิ": [
            "thermometer"
        ],

        "เครื่องวัดความดัน": [
            "pressure gauge"
        ],

        "วัดความดัน": [
            "pressure gauge"
        ],

        "เครื่องวัดความเร็วรอบ": [
            "tachometer"
        ],

        "วัดรอบ": [
            "tachometer"
        ],

        "เครื่องวัดอัตราการไหล": [
            "flow meter"
        ],

        "วัดอัตราการไหล": [
            "flow meter"
        ],

        "เซ็นเซอร์": [
            "sensor"
        ],

        "เครื่องมือวัด": [
            "measuring instrument"
        ]

    };


    // ========================================
    // Spelling Corrections
    // ========================================

    const spellingCorrections = {

        "multimter": "multimeter",

        "multmeter": "multimeter",

        "multimetter": "multimeter",

        "oscilloscopee": "oscilloscope",

        "osciloscope": "oscilloscope",

        "calipper": "caliper",

        "micromter": "micrometer",

        "micrometre": "micrometer",

        "thermometor": "thermometer",

        "tachometor": "tachometer",

        "presssure": "pressure",

        "presure": "pressure",

        "flowmeter": "flow meter"

    };


    // ========================================
    // Load JSON Database
    // ========================================

    async function loadEquipmentDatabase() {

        try {

            const response =
                await fetch("data/equipment.json");


            if (!response.ok) {

                throw new Error(
                    "ไม่สามารถโหลด equipment.json ได้"
                );

            }


            equipmentDatabase =
                await response.json();


            console.log(
                "Equipment Database Loaded:",
                equipmentDatabase.length
            );


            // แสดงข้อความเริ่มต้น

            equipmentResults.innerHTML = `

                <div class="equipment-empty">

                    🔎 พิมพ์ชื่ออุปกรณ์
                    เพื่อเริ่มค้นหา

                    <br><br>

                    <small>
                        มีอุปกรณ์ในฐานข้อมูล
                        ${equipmentDatabase.length} รายการ
                    </small>

                </div>

            `;


        }

        catch (error) {

            console.error(
                "Equipment Database Error:",
                error
            );


            equipmentResults.innerHTML = `

                <div class="equipment-empty">

                    ❌ ไม่สามารถโหลดฐานข้อมูลอุปกรณ์ได้

                    <br><br>

                    <small>
                        กรุณาตรวจสอบว่าไฟล์
                        data/equipment.json
                        อยู่ในตำแหน่งที่ถูกต้อง
                    </small>

                </div>

            `;

        }

    }


    // ========================================
    // Normalize Text
    // ========================================

    function normalizeText(text) {

        return String(text || "")
            .toLowerCase()
            .trim();

    }


    // ========================================
    // Get Search Words
    // ========================================

    function getSearchWords(query) {

        const normalized =
            normalizeText(query);


        const words = [
            normalized
        ];


        // ตรวจคำแก้ไข

        if (
            spellingCorrections[
                normalized
            ]
        ) {

            words.push(
                spellingCorrections[
                    normalized
                ]
            );

        }


        // ตรวจ Alias ภาษาไทย

        if (
            equipmentAliases[
                normalized
            ]
        ) {

            equipmentAliases[
                normalized
            ].forEach(function (alias) {

                words.push(alias);

            });

        }


        return words;

    }


    // ========================================
    // Search Database
    // ========================================

    function searchEquipment(query) {

        const searchWords =
            getSearchWords(query);


        return equipmentDatabase.filter(
            function (equipment) {


                // ถ้าเลือก Category

                if (
                    currentCategory !== "all" &&
                    equipment.category !==
                    currentCategory
                ) {

                    return false;

                }


                // ข้อมูลทั้งหมดของอุปกรณ์

                const searchableText = [

                    equipment.name,

                    equipment.thaiName,

                    equipment.category,

                    ...(equipment.keywords || [])

                ]

                .join(" ")
                .toLowerCase();


                // ตรวจว่าตรงกับคำค้นหรือไม่

                return searchWords.some(
                    function (word) {

                        return searchableText
                            .includes(
                                normalizeText(word)
                            );

                    }
                );

            }
        );

    }


    // ========================================
    // Display Equipment
    // ========================================

    function displayEquipment(results) {

    // ========================================
    // ไม่พบข้อมูล
    // ========================================

    if (
        !results ||
        results.length === 0
    ) {

        equipmentResults.innerHTML = `

            <div class="equipment-empty">

                😢 ไม่พบอุปกรณ์

                <br><br>

                <small>
                    ลองค้นหา เช่น
                    Multimeter,
                    มัลติมิเตอร์,
                    Oscilloscope,
                    เครื่องกลึง
                </small>

            </div>

        `;

        return;
    }


    // ========================================
    // แสดงข้อมูลอุปกรณ์
    // ========================================

    equipmentResults.innerHTML =
        results.map(
            function (equipment) {


                // ========================================
                // ข้อมูลพื้นฐาน
                // ========================================

                const name =
                    equipment.name ||
                    "ไม่ระบุชื่ออุปกรณ์";


                const thaiName =
                    equipment.thaiName ||
                    "ไม่ระบุชื่อภาษาไทย";


                const image =
                    equipment.image ||
                    "images/equipment/placeholder.jpg";


                const description =
                    equipment.description ||
                    "ยังไม่มีรายละเอียดของอุปกรณ์";


                const functionText =
                    equipment.function ||
                    "ยังไม่มีข้อมูลการใช้งาน";


                const workingPrinciple =
                    equipment.workingPrinciple ||
                    "ยังไม่มีข้อมูลหลักการทำงาน";


                // ========================================
                // ค่าที่วัดได้
                // ========================================

                let measurementHTML = "";


                if (
                    Array.isArray(
                        equipment.measurement
                    ) &&
                    equipment.measurement.length > 0
                ) {

                    measurementHTML =

                        equipment.measurement
                            .map(
                                function (item) {

                                    return `
                                        <li>
                                            ${escapeHTML(item)}
                                        </li>
                                    `;

                                }
                            )
                            .join("");

                }

                else {

                    measurementHTML = `
                        <li>
                            ยังไม่มีข้อมูลค่าที่วัดได้
                        </li>
                    `;

                }


                // ========================================
                // สร้าง Card
                // ========================================

                return `

                    <div class="equipment-card">


                        <!-- Image -->

                        <img

                            class="equipment-image"

                            src="${escapeAttribute(
                                image
                            )}"

                            alt="${escapeAttribute(
                                name
                            )}"

                            loading="lazy"

                            onerror="
                                this.src='images/equipment/placeholder.jpg'
                            "

                        >


                        <!-- Information -->

                        <div class="equipment-info">


                            <!-- Category -->

                            <span
                                class="equipment-category-label"
                            >

                                ${getCategoryName(
                                    equipment.category
                                )}

                            </span>


                            <!-- English Name -->

                            <h3>

                                ${escapeHTML(
                                    name
                                )}

                            </h3>


                            <!-- Thai Name -->

                            <p
                                class="equipment-thai-name"
                            >

                                ${escapeHTML(
                                    thaiName
                                )}

                            </p>


                            <!-- Description -->

                            <p
                                class="equipment-description"
                            >

                                ${escapeHTML(
                                    description
                                )}

                            </p>


                            <!-- Details -->

                            <div
                                class="equipment-details"
                            >


                                <!-- Function -->

                                <p>

                                    <strong>
                                        🔧 การใช้งาน:
                                    </strong>

                                    <br>

                                    ${escapeHTML(
                                        functionText
                                    )}

                                </p>


                                <!-- Working Principle -->

                                <p>

                                    <strong>
                                        ⚙️ หลักการทำงาน:
                                    </strong>

                                    <br>

                                    ${escapeHTML(
                                        workingPrinciple
                                    )}

                                </p>


                            </div>


                            <!-- Measurement -->

                            <div
                                class="equipment-measurement"
                            >

                                <strong>
                                    📏 ค่าที่วัดได้:
                                </strong>


                                <ul>

                                    ${measurementHTML}

                                </ul>

                            </div>


                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


    // ========================================
    // Category Name
    // ========================================

    function getCategoryName(category) {

        const categories = {

            electrical:
                "⚡ Electrical",

            mechanical:
                "⚙ Mechanical",

            civil:
                "🏗 Civil",

            electronics:
                "💻 Electronics",

            instrumentation:
                "📐 Instrumentation"

        };


        return categories[category]
            || "🛠 Engineering Equipment";

    }


    // ========================================
    // Perform Search
    // ========================================

    function performSearch() {

        const query =
            equipmentSearch
                ? equipmentSearch.value.trim()
                : "";


        // ถ้าไม่มีคำค้น

        if (!query) {

            if (
                currentCategory === "all"
            ) {

                equipmentResults.innerHTML = `

                    <div class="equipment-empty">

                        🔎 พิมพ์ชื่ออุปกรณ์
                        เพื่อเริ่มค้นหา

                    </div>

                `;

            }

            else {

                const results =
                    equipmentDatabase.filter(
                        function (equipment) {

                            return (
                                equipment.category ===
                                currentCategory
                            );

                        }
                    );


                displayEquipment(results);

            }

            return;

        }


        // Search

        const results =
            searchEquipment(query);


        console.log(
            "Search:",
            query,
            "Results:",
            results
        );


        displayEquipment(results);

    }


    // ========================================
    // Search Input
    // ========================================

    if (equipmentSearch) {

        equipmentSearch.addEventListener(
            "input",
            function () {

                clearTimeout(
                    searchTimer
                );


                searchTimer =
                    setTimeout(
                        function () {

                            performSearch();

                        },
                        200
                    );

            }
        );

    }


    // ========================================
    // Category Buttons
    // ========================================

    equipmentCategories.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {


                    // ลบ active ทุกปุ่ม

                    equipmentCategories.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    // เพิ่ม active ให้ปุ่มที่กด

                    this.classList.add(
                        "active"
                    );


                    // อ่าน Category

                    currentCategory =
                        this.dataset.category;


                    // ค้นหาใหม่

                    performSearch();

                }
            );

        }
    );


    // ========================================
    // Security
    // ========================================

    function escapeHTML(text) {

        return String(text || "")

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    function escapeAttribute(text) {

        return escapeHTML(text);

    }


    // ========================================
    // Start
    // ========================================

    loadEquipmentDatabase();

});