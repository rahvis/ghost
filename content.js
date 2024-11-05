// List of buzzwords for ghost job detection
const ghostJobBuzzwords = [
    "dynamic work environment", "self-starter", "fast-paced",
    "wear many hats", "flexible", "motivated", 
    "great company culture", "fun work environment", 
    "like a family", "results-oriented", "entry-level", 
    "competitive salary", "fast track", "uncapped commission",
    "immediate start", "reliable team player", 
    "passionate about excellence", "work hard, play hard", 
    "upbeat environment", "cutting-edge", "innovative solutions",
    "start-up atmosphere", "seeking superstars", "best-in-class", 
    "out-of-the-box thinker", "go-getter"
];

// List of vague terms
const vagueTerms = [
    "dynamic work environment", "self-starter", "team player", 
    "fast-paced", "wear many hats", "flexible", "motivated", 
    "relevant experience", "industry knowledge", "make an impact",
    "any relevant experience", "industry practices", "great company culture",
    "fun work environment", "like a family", "variety of responsibilities"
];

// Function to capture salary details from the button element
function captureSalaryDetails() {
    analyzeJobPostings();
}

// Function to check if the job contains a dollar sign ($)
function containsSalary(text) {
    return text.includes('$');
}

function analyzeJobPostings() {
    // Select the <p> tag that contains the job details
    let jobDetailsElement = document.querySelector('.jobs-description-content__text p');
    let jobDetailsText = jobDetailsElement ? (jobDetailsElement.innerText || jobDetailsElement.textContent) : '';

    // Select the job age information
    let jobAgeElement = document.querySelector('.job-details-jobs-unified-top-card__primary-description-container .t-black--light');
    let jobAgeText = jobAgeElement ? (jobAgeElement.innerText || jobAgeElement.textContent) : '';

    let salaryButtonElement = document.querySelector('.job-details-preferences-and-skills');
    let salaryText = salaryButtonElement ? salaryButtonElement.innerText || salaryButtonElement.textContent : "";
    console.log('salaryText: ', salaryText);

    // Check if job has a salary
    const hasSalary = containsSalary(jobDetailsText) || containsSalary(salaryText);

    // Check for "Reposted" in all <div> elements inside the primary description container
    let isReposted = false;
    const descriptionContainer = document.querySelector('.job-details-jobs-unified-top-card__primary-description-container');
    if (descriptionContainer) {
        const allDivs = descriptionContainer.querySelectorAll('div');
        allDivs.forEach(div => {
            const divText = div.innerText || div.textContent;
            if (divText && divText.includes('Reposted')) {
                isReposted = true;
            }
        });
    }

    // Check for vagueness in job description
    const isVague = checkForVagueness(jobDetailsText);
    
    // Add buzzword weight if applicable
    const buzzwordWeight = containsBuzzwords(jobDetailsText) ? 20 : 0;

    // Check job age and calculate final score
    const ageScore = evaluateJobAge(jobAgeText);
    const score = calculateScore(hasSalary, isReposted, ageScore, isVague, buzzwordWeight);
    addJobStatusButton(score);
}

// Function to evaluate job age
function evaluateJobAge(jobAgeText) {
    const regex = /(\d+)\s+(years?|months?|weeks?|days?)/;
    const match = jobAgeText.match(regex);

    if (match) {
        const num = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();

        // Check for years
        if (unit.startsWith('year') && num > 0) {
            return 30; // More than 1 year (considering any number of years as over 2 months)
        } else if (unit.startsWith('month') && num > 2) {
            return 30; // More than 2 months
        } else if (unit.startsWith('week') && num >= 8) {
            return 30; // 8 weeks is approximately 2 months
        }
    }
    return 0; // Not older than 2 months
}

// Function to check for vague job postings
function checkForVagueness(jobDescription) {
    let vaguenessScore = 0;
    vagueTerms.forEach(term => {
        if (jobDescription.toLowerCase().includes(term.toLowerCase())) {
            vaguenessScore++;
        }
    });
    return vaguenessScore > 3; // Adjust threshold as needed
}

// Function to check for buzzwords in job postings
function containsBuzzwords(jobDescription) {
    return ghostJobBuzzwords.some(term => jobDescription.toLowerCase().includes(term.toLowerCase()));
}

// Function to calculate the final score based on weighted conditions
function calculateScore(hasSalary, isReposted, ageScore, isVague, buzzwordWeight) {
    let score = 0;

    // Define weights
    const salaryWeight = 0.6;
    const repostedWeight = 0.3;
    const ageWeight = 0.1;

    // If no salary, assign a score between 55 and 69, then apply weight
    if (!hasSalary) {
        const noSalaryScore = Math.floor(Math.random() * (69 - 55 + 1)) + 55;
        score += noSalaryScore * salaryWeight;
    }

    // If reposted, assign a score between 15 and 19, then apply weight
    if (isReposted) {
        const repostedScore = Math.floor(Math.random() * (19 - 15 + 1)) + 15;
        score += repostedScore * repostedWeight;
    }

    // If job age is greater than 2 months, assign a score between 25 and 29, then apply weight
    if (ageScore > 0) {
        const ageScoreValue = Math.floor(Math.random() * (29 - 25 + 1)) + 25;
        score += ageScoreValue * ageWeight;
    }

    // Add buzzword weight
    score += buzzwordWeight;

    // If vague, assign a penalty score
    if (isVague) {
        score += 10; // Adjust this penalty as needed
    }

    // Round score to one decimal place
    return Math.round(score * 10) / 10;
}

// Add job status button function
function addJobStatusButton(score) {
    // Remove existing job status button if it exists
    const existingButton = document.querySelector('.job-status-button');
    if (existingButton) {
        existingButton.remove();
    }

    // Determine button text and color based on score
    let buttonText = '';
    let buttonColor = '';

    if (score < 10) {
        buttonText = 'Nice to Apply';
        buttonColor = 'green';
    } else if (score >= 20 && score <= 45) {
        buttonText = 'You can Apply';
        buttonColor = 'purple';
    } else if (score >= 46 && score <= 55) {
        buttonText = 'Think Before You Apply';
        buttonColor = 'orange';
    } else if (score > 55) {
        buttonText = 'It’s a Red Flag';
        buttonColor = 'red';
    }

    // Include ghost job percentage
    buttonText += ` (${score}% Ghost Job )`;

    // Create a new button element with score
    let jobStatusButton = document.createElement('button');
    jobStatusButton.textContent = buttonText;
    jobStatusButton.style.backgroundColor = buttonColor;
    jobStatusButton.style.color = 'white';
    jobStatusButton.style.marginLeft = '10px';
    jobStatusButton.className = 'job-status-button artdeco-button artdeco-button--primary';

    // Append button to the job details section
    const targetDiv = document.querySelector('.t-24.job-details-jobs-unified-top-card__job-title');
    if (targetDiv) {
        targetDiv.appendChild(jobStatusButton);
    }
}

// Listen for changes in the job details section
const jobDetailsContainer = document.querySelector('.job-details-jobs-unified-top-card__primary-description-container');
if (jobDetailsContainer) {
    const observer = new MutationObserver(() => {
        // Re-evaluate job posting when changes are detected
        analyzeJobPostings();
    });
    observer.observe(jobDetailsContainer, { childList: true, subtree: true });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "captureSalary") {
        captureSalaryDetails();
        sendResponse({ salary: true });
    }
});
