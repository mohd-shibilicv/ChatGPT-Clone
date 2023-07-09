const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeBtn = document.querySelector("#theme-btn");
const deleteBtn = document.querySelector("#delete-btn");
const scrollBtn = document.querySelector("#scroll-btn");

let userText = null;
const API_KEY = "OPENAI_API_KEY";
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalStorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeBtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    // const defaultText = `<div class="default-text">
    //                         <h1>ChatGPT Clone</h1>
    //                         <p>Start a conversation and explore the power of AI.<br />Your chat history will be displayed here.</p>
    //                     </div>`;

    const defaultText = `<div class="default-main-div">
                            <div class="default-text">
                                <h1>ChatGPT</h1>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: center; ">
                                <div class="row py-4" style="display: flex; align-items: center; width: 80vw; justify-content: center;">
                                    <div class="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center" style="color: #fff;">
                                        <svg stroke="currentColor" fill="none" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round"
                                            stroke-linejoin="round" class="h-6 w-6" height="2em" width="2em"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="5"></circle>
                                            <line x1="12" y1="1" x2="12" y2="3"></line>
                                            <line x1="12" y1="21" x2="12" y2="23"></line>
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                            <line x1="1" y1="12" x2="3" y2="12"></line>
                                            <line x1="21" y1="12" x2="23" y2="12"></line>
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                        </svg>
                                        <div class="py-4" style="font-size: 20px; margin-top: -10px;">Examples</div>
                                        <button class="btn btn-secondary btn-sm my-2">"Explain quantum computing in simple terms" →</button>
                                        <button class="btn btn-secondary btn-sm my-2">"Got any creative ideas for a 10 year old’s birthday?" →</button>
                                        <button class="btn btn-secondary btn-sm my-2">"How do I make an HTTP request in Javascript?" →</button>
                                    </div>
                                    <div class="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center" style="color: #fff;">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6" height="2em" width="2em">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z">
                                            </path>
                                        </svg>
                                        <div class="py-4" style="font-size: 20px; margin-top: -10px;">Capabilities</div>
                                        <button class="btn btn-secondary btn-sm my-2 no-hover">Remembers what user said earlier in the conversation</button>
                                        <button class="btn btn-secondary btn-sm my-2 no-hover">Allows user to provide follow-up corrections</button>
                                        <button class="btn btn-secondary btn-sm my-2 no-hover">Trained to decline inappropriate requests</button>
                                    </div>
                                    <div class="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center" style="color: #fff;">
                                        <svg stroke="currentColor" fill="none" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round"
                                            stroke-linejoin="round" class="h-6 w-6" height="2em" width="2em"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
                                            </path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                        <div class="py-4" style="font-size: 20px; margin-top: -10px;">Limitations</div>
                                        <button class="btn btn-secondary btn-sm my-2 no-hover">May occasionally generate incorrect information</button>
                                        <button class="btn btn-secondary btn-sm my-2 no-hover">May occasionally produce harmful instructions or biased content</button>
                                        <button class="btn btn-secondary btn-sm my-2 no-hover">Limited knowledge of world and events after 2021</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadDataFromLocalStorage();

const createElement = (html, className) => {
    // Create new div and apply chat, specify class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; // Return the created chat div
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");
    
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "text-davinci-003",
            "prompt": userText,
            "max_tokens": 2048,
            "temperature": 0.2,
            "top_p": 1,
            "n": 1,
            "stream": false,
            "logprobs": null,
            "stop": null
        })
    }

    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();
    } catch(error) {
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while generating the response. Please try again.";
    }

    // Remove the typing animation, append the paragraph and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response the clipboard
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";

    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="assets/images/chatbot.jpg" alt="chatbot-img" />
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                            <div class="typing-dot" style="--delay: 0.6s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;

    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get Chat Input and Remove Extra Spaces
    if(!userText) return; // If the Input is empty, return

    chatInput.value = ""
    chatInput.style.height = `${initialHeight}px`;
    
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="assets/images/user.jpg" alt="user-img" />
                        <p></p>
                    </div>
                </div>`;
    
    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-main-div")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

themeBtn.addEventListener("click", () => {
    // Toggle body's class for light theme mode
    document.body.classList.toggle("light-mode");

    // Update the setting on localStorage so that it won't get reset eace time you reload
    localStorage.setItem("theme-color", themeBtn.innerText);

    themeBtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

deleteBtn.addEventListener("click", () => {
    // Remove the chats from localstorage and call localdatafromlocalstorage function
    if (confirm("Are you sure that you want to delete all the chats ?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalStorage();
    }
});

chatInput.addEventListener("input", () => {
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If the Enter key is pressed without shift and the window width is larger than 800px, handle the outgoing chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

// Scroll Button Script
chatContainer.addEventListener('scroll', function() {
    const scrollPosition = chatContainer.scrollHeight - chatContainer.clientHeight - chatContainer.scrollTop;

    if (scrollPosition >= 200) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
});

sendButton.addEventListener("click", handleOutgoingChat);