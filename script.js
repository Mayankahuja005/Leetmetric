document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-button");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");

    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const cardStatsContainer = document.querySelector(".stats-cards");


    
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);

        if (!isMatching) {
            alert("Invalid Username");
        }

        return isMatching;
    }



    async function fetchUserdetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);

            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }

            const data = await response.json();
            console.log("Data:", data);

            displayUserData(data);

        } catch (error) {
            statsContainer.innerHTML = `<p>No data Found</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }


    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 360;
        circle.style.setProperty("--progress-degree", `${progressDegree}deg`);
        label.textContent = `${solved}/${total}`;
    }


    function displayUserData(data) {

        const totalEasyQues = data.totalEasy;
        const totalMediumQues = data.totalMedium;
        const totalHardQues = data.totalHard;

        const solvedEasy = data.easySolved;
        const solvedMedium = data.mediumSolved;
        const solvedHard = data.hardSolved;

        updateProgress(solvedEasy, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedMedium, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHard, totalHardQues, hardLabel, hardProgressCircle);

        const cardData = [
            { label: "Overall Solved", value: data.totalSolved },
            { label: "Easy Solved", value: data.easySolved },
            { label: "Medium Solved", value: data.mediumSolved },
            { label: "Hard Solved", value: data.hardSolved }
        ];

        cardStatsContainer.innerHTML = cardData.map(item => `
            <div class="card">
                <h4>${item.label}</h4>
                <p>${item.value}</p>
            </div>
        `).join("");
    }


    searchButton.addEventListener("click", function () {
        statsContainer.style.display = "block";

        const username = usernameInput.value;
        console.log("Username:", username);

        if (validateUsername(username)) {
            fetchUserdetails(username);
        }
    });

});
