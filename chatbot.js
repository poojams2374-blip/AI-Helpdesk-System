const API_KEY = "AQ.Ab8RN6LSvu0hjFm48c0TnCGFhz6dlgYXdhxCrQfbO8NrlSnc_g";

const askBtn = document.getElementById("askAI");
const questionBox = document.getElementById("question");
const answerBox = document.getElementById("answer");

askBtn.addEventListener("click", async () => {

    const question = questionBox.value;

    if (question === "") {
        alert("Please enter your question.");
        return;
    }

    answerBox.innerHTML = "Thinking...";

    try {

        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
            {
                method: "POST",
                headers: {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY
},
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: question
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log(data);

if (!response.ok) {
    answerBox.innerHTML = JSON.stringify(data, null, 2);
    return;
}

if (!data.candidates || data.candidates.length === 0) {
    answerBox.innerHTML = "No response received from Gemini.";
    console.log(data);
    return;
}

answerBox.innerHTML = data.candidates[0].content.parts[0].text;

    } catch (error) {

        answerBox.innerHTML = "Something went wrong.";

        console.error(error);

        alert(error.message);

    }

});