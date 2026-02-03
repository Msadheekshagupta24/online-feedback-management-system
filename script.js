let feedbackData = JSON.parse(localStorage.getItem("feedbacks")) || [];
let selectedRating = 0;

displayFeedback(feedbackData);
updateStats();

function setRating(rating) {
    selectedRating = rating;
    let stars = document.querySelectorAll(".stars span");

    stars.forEach((star, index) => {
        star.classList.toggle("active", index < rating);
    });
}

function submitFeedback() {
    let name = document.getElementById("name").value;
    let comment = document.getElementById("comment").value;
    let rating = selectedRating;

    if (name === "" || comment === "" || rating === 0) {
        alert("Please fill all fields and select a rating");
        return;
    }

    let category = "";
    if (rating >= 4) category = "Positive";
    else if (rating === 3) category = "Neutral";
    else category = "Negative";

    let feedback = {
        name,
        rating,
        comment,
        category,
        date: new Date().toLocaleString()
    };

    feedbackData.push(feedback);
    localStorage.setItem("feedbacks", JSON.stringify(feedbackData));

    displayFeedback(feedbackData);
    updateStats();

    document.getElementById("name").value = "";
    document.getElementById("comment").value = "";
    selectedRating = 0;
    document.querySelectorAll(".stars span").forEach(star =>
        star.classList.remove("active")
    );
}

function displayFeedback(data) {
    let list = document.getElementById("feedbackList");
    list.innerHTML = "";

    data.forEach(fb => {
        let div = document.createElement("div");
        div.className = `feedback ${fb.category}`;
        div.innerHTML = `
            <strong>${fb.name}</strong><br>
            Rating: ${fb.rating} ⭐<br>
            Category: ${fb.category}<br>
            Date: ${fb.date}<br>
            "${fb.comment}"
        `;
        list.appendChild(div);
    });
}

function filterFeedback(type) {
    if (type === "All") {
        displayFeedback(feedbackData);
    } else {
        let filtered = feedbackData.filter(f => f.category === type);
        displayFeedback(filtered);
    }
}

function updateStats() {
    let total = feedbackData.length;
    let positive = feedbackData.filter(f => f.category === "Positive").length;
    let neutral = feedbackData.filter(f => f.category === "Neutral").length;
    let negative = feedbackData.filter(f => f.category === "Negative").length;

    document.getElementById("stats").innerText =
        `Total: ${total} | Positive: ${positive} | Neutral: ${neutral} | Negative: ${negative}`;
}

function exportCSV() {
    let csv = "Name,Rating,Category,Date,Comment\n";

    feedbackData.forEach(f => {
        csv += `${f.name},${f.rating},${f.category},${f.date},"${f.comment}"\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "feedback_data.csv";
    link.click();
}
