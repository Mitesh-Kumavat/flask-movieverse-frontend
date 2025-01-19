import { API_BASE_URL } from "../scripts/util.js";

const signupForm = document.querySelector("form");


signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = signupForm.querySelector('#username').value.trim();
    const email = signupForm.querySelector('#email').value.trim();
    const password = signupForm.querySelector('#password').value;
    const confirmPassword = signupForm.querySelector('#password2').value;

    if (!username || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });

        const result = await response.json();


        if (response.ok) {
            alert("Signup successful! You can now log in.");
            window.location.href = "/login";
        } else {
            alert(result.error || "Signup failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during signup:", error);
        alert("An error occurred. Please try again later.");
    }
});
