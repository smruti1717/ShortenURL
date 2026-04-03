async function shortenUrl() {
    const longUrl = document.getElementById("longUrl").value;
    const result = document.getElementById("result");

    if (!longUrl) {
        result.innerHTML = "Please enter a URL";
        return;
    }

    try {
        const response = await fetch("/shorten", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ longUrl })
        });

        const data = await response.json();

        if (data.shortUrl) {
            result.innerHTML = `Short URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
        } else {
            result.innerHTML = "Error creating short URL";
        }
    } catch (error) {
        result.innerHTML = "Server error";
    }
}