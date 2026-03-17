document.addEventListener("DOMContentLoaded",function(){
    const searchButton=document.getElementById("search-button");
    const usernameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer=document.querySelector(".stats-cards");
    
    function validateUsername(username){
        if(username.trim()===""){
            alert("Username should not be empty");
            return false;
        }
        const regex=/^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserdetails(username){
        try{
            searchButton.textContent="Searching...";
            searchButton.disabled=true;
        
            const response = await fetch(`https://corsproxy.io/?https://leetcode-stats-api.herokuapp.com/${username}`);
            const data = await response.json();

            if(!response.ok || data.status==="error"){
                throw new Error("unable to fetch the user details");
            }

            displayUserData(data);
        }
        catch(error){
            statsContainer.innerHTML=`<p>No data Found</p>`
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }

    function updateProgress(solved,total,label,circle){
        if(total===0) total=1;
        const progressDegree=(solved/total)*360;
        circle.style.setProperty("--progress-degree",`${progressDegree}deg`);
        label.textContent=`${solved}/${total}`;
    }

    function displayUserData(data){
        const totalEasyQues=data.totalEasy || 0;
        const totalMediumQues=data.totalMedium || 0;
        const totalHardQues=data.totalHard || 0;

        const solvedTotalEasyQues=data.easySolved || 0;
        const solvedTotalMediumQues=data.mediumSolved || 0;
        const solvedTotalHardQues=data.hardSolved || 0;
        
        updateProgress(solvedTotalEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);
        updateProgress(solvedTotalHardQues,totalHardQues,hardLabel,hardProgressCircle);

        const cardData=[
            {label:"Total Solved",value:data.totalSolved || 0},
            {label:"Easy Solved",value:solvedTotalEasyQues},
            {label:"Medium Solved",value:solvedTotalMediumQues},
            {label:"Hard Solved",value:solvedTotalHardQues},
        ];

        cardStatsContainer.innerHTML=cardData.map(item=>{
            return `
                <div class="card">
                <h4>${item.label}</h4>
                <p>${item.value}</p>
                </div>
            `
        }).join("");
    }

    searchButton.addEventListener("click",function(){
        statsContainer.style.display="block";
        const username=usernameInput.value;
        if(validateUsername(username)){
            fetchUserdetails(username);
        }
    });
});
