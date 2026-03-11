/**
 * School FAQ Chatbot System
 * Provides interactive FAQ support for school pages
 */

class SchoolFAQBot {
    constructor(schoolName = 'Bharathi Vidhyaa Kendhra') {
        this.schoolName = schoolName;
        this.isOpen = false;
        this.messages = [];
        this.faqData = this.getFAQData(schoolName);
        this.init();
    }

    getFAQData(schoolName) {
        const faqDatabase = {
            'Bharathi Vidhyaa Kendhra': {
                general: [
                    {
                        question: "What are the school timings?",
                        answer: "Pre K.G: 9.30 am - 12.30 pm<br>LKG & UKG: 9.00 am - 3.20 pm<br>I to X: 9.00 am - 4.20 pm"
                    },
                    {
                        question: "What is the admission process?",
                        answer: "1. Visit school campus at Mangalam to Avinashi main road, Avinashi - 641 654<br>2. Fill admission form<br>3. Submit birth certificate and photos"
                    },
                    {
                        question: "What facilities are available?",
                        answer: "We have spacious classrooms with smart boards, interactive digital boards, high-speed connectivity, biology lab, computer lab, chemistry lab, physics lab, library, and safe transport."
                    },
                    {
                        question: "What is the fee structure?",
                        answer: "Please contact the school office at +91 87540 91999 or email bvkicse@gmail.com for detailed fee information."
                    },
                    {
                        question: "Do you provide transport?",
                        answer: "Yes, we have safe, reliable school transport with trained drivers and GPS-enabled buses."
                    }
                ],
                academics: [
                    {
                        question: "What curriculum do you follow?",
                        answer: "Recognized by the Government of Tamil Nadu, BVK offers classes from Pre-KG to Grade X following the ICSE curriculum."
                    },
                    {
                        question: "What are the subject combinations?",
                        answer: "We offer comprehensive ICSE curriculum with all core subjects and optional subjects as per ICSE guidelines for Grade X."
                    },
                    {
                        question: "Do you have coaching classes?",
                        answer: "Yes, we provide special coaching for competitive exams and additional support for students who need extra help."
                    }
                ],
                activities: [
                    {
                        question: "What extracurricular activities are available?",
                        answer: "We offer sports, music, dance, art, debate, quiz competitions, and various clubs for holistic development."
                    },
                    {
                        question: "Do you organize competitions?",
                        answer: "Yes, we regularly organize inter-school competitions in sports, academics, and cultural activities."
                    }
                ]
            },
            'Bharathi kids Kshethralaya': {
                general: [
                    {
                        question: "What are the school timings?",
                        answer: "Pre K.G: 9.30 am - 12.30 pm<br>LKG - Grade V: 8.50 am - 3.30 pm<br>Grade VI onwards: 8.50 am - 4.20 pm"
                    },
                    {
                        question: "What is the admission process?",
                        answer: "1. Visit school campus at No.7, College Road, Konganagiri Bus Stop, Tiruppur - 641602<br>2. Fill admission form<br>3. Submit birth certificate and photos"
                    },
                    {
                        question: "What facilities are available?",
                        answer: "We have colorful classrooms, play area, activity room, nap room, biology lab, computer lab, chemistry lab, and safe transport facilities."
                    },
                    {
                        question: "What is the fee structure?",
                        answer: "Please contact the school office at 0421-2208573, 0421-2239299 or email bharathikidskshethralaya@gmail.com for detailed fee information."
                    },
                    {
                        question: "Do you provide transport?",
                        answer: "Yes, we have safe, reliable school transport with trained drivers and GPS-enabled buses."
                    }
                ],
                academics: [
                    {
                        question: "What teaching method do you use?",
                        answer: "We use play-based education and holistic development methods to nurture young minds to grow, learn, and explore."
                    },
                    {
                        question: "What subjects are taught?",
                        answer: "Our school is recognized by the Government of Tamilnadu from Pre KG to Grade XII. We are following CBSE syllabus."
                    },
                    {
                        question: "How do you assess children?",
                        answer: "Through continuous observation, activities, and parent feedback rather than formal exams, focusing on holistic development."
                    }
                ],
                activities: [
                    {
                        question: "What activities are included?",
                        answer: "Indoor games, outdoor play, storytelling, puppet shows, drawing, celebration activities, and various educational field trips."
                    },
                    {
                        question: "Do you have field trips?",
                        answer: "Yes, we organize educational field trips to parks, museums, and child-friendly places to enhance learning experiences."
                    }
                ]
            }
        };
        
        return faqDatabase[schoolName] || faqDatabase['Bharathi Vidhyaa Kendhra'];
    }

    init() {
        console.log('SchoolFAQBot init() called for:', this.schoolName);
        this.createChatbotHTML();
        this.attachEventListeners();
        this.loadDefaultQuestions();
        
        // Test if chatbot elements exist
        setTimeout(() => {
            const chatbot = document.getElementById('faq-chatbot');
            const fab = document.getElementById('chatbotFab');
            console.log('Chatbot elements found:');
            console.log('- Chatbot container:', !!chatbot);
            console.log('- FAB button:', !!fab);
            
            if (!chatbot) {
                console.error('Chatbot container not found!');
            }
            if (!fab) {
                console.error('FAB button not found!');
            }
        }, 1000);
    }

    createChatbotHTML() {
        // Create chatbot container
        const chatbotHTML = `
            <div id="faq-chatbot" class="faq-chatbot">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <i class="fa fa-comments"></i>
                        <span>Chat</span>
                    </div>
                    <button class="chatbot-toggle" id="chatbotToggle">
                        <i class="fa fa-chevron-down"></i>
                    </button>
                </div>
                
                <div class="chatbot-body" id="chatbotBody">
                    <div class="chatbot-messages" id="chatbotMessages">
                        <div class="welcome-message">
                            <i class="fa fa-info-circle"></i>
                            <span>Welcome to ${this.schoolName}! Type "hi" to see Frequently Asked Questions.</span>
                        </div>
                    </div>
                    
                    <div class="chatbot-input-container">
                        <input type="text" id="chatbotInput" placeholder="Type your message..." />
                        <button id="chatbotSendBtn">
                            <i class="fa fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="chatbot-fab" id="chatbotFab">
                <i class="fa fa-comments"></i>
            </div>
        `;

        // Add to page
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const chatbot = document.getElementById('faq-chatbot');
        const toggle = document.getElementById('chatbotToggle');
        const fab = document.getElementById('chatbotFab');
        const body = document.getElementById('chatbotBody');
        const input = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSendBtn');
        const messagesContainer = document.getElementById('chatbotMessages');

        // Toggle chatbot
        toggle.addEventListener('click', () => this.toggleChatbot());
        fab.addEventListener('click', () => this.openChatbot());

        // Send message
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Enhanced smooth scrolling for desktop
        this.setupSmoothScrolling();

        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            if (!chatbot.contains(e.target) && !fab.contains(e.target)) {
                this.closeChatbot();
            }
        });
    }

    setupSmoothScrolling() {
        // Add smooth scrolling to all scrollable elements
        const scrollableElements = document.querySelectorAll('.chatbot-messages, .questions-container');
        
        scrollableElements.forEach(element => {
            // Mouse wheel scrolling - prevent page scroll
            element.addEventListener('wheel', (e) => {
                // Only handle if the mouse is over the chatbot
                const chatbot = document.getElementById('faq-chatbot');
                const rect = chatbot.getBoundingClientRect();
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                // Check if mouse is within chatbot bounds
                if (mouseX >= rect.left && mouseX <= rect.right && 
                    mouseY >= rect.top && mouseY <= rect.bottom) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    const scrollAmount = e.deltaY;
                    element.scrollTop += scrollAmount;
                }
            }, { passive: false });
            
            // Enhanced touch scrolling for mobile
            let isScrolling = false;
            element.addEventListener('touchstart', (e) => {
                isScrolling = true;
            });
            
            element.addEventListener('touchmove', (e) => {
                if (!isScrolling) return;
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                const touch = e.touches[0];
                const elementAtTop = element.scrollTop;
                const elementAtBottom = element.scrollTop + element.offsetHeight;
                
                if (elementAtTop <= 0 && touch.clientY > elementAtTop) {
                    element.scrollTop = 1;
                } else if (elementAtBottom >= element.scrollHeight && touch.clientY < elementAtBottom) {
                    element.scrollTop = element.scrollHeight - element.offsetHeight - 1;
                }
            });
            
            element.addEventListener('touchend', () => {
                isScrolling = false;
            });
        });
    }

    loadDefaultQuestions() {
        // Initialize with welcome message - questions shown when user types "hi"
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (message === '') return;
        
        // Add user message (use the actual message text, not the input element)
        this.addUserMessage(message);
        input.value = '';
        
        // Handle message
        this.handleUserMessage(message.toLowerCase());
    }

    handleUserMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        
        // Remove welcome message if it exists
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        if (message === 'hi' || message === 'hello' || message === 'hey') {
            // Show typing indicator (user message already added by sendMessage)
            this.showTypingIndicator();
            
            setTimeout(() => {
                this.removeTypingIndicator();
                this.showCategories();
            }, 1500);
        } else {
            // Handle other messages
            this.showTypingIndicator();
            
            setTimeout(() => {
                this.removeTypingIndicator();
                this.addBotMessage('Please type "hi" to see Frequently Asked Questions.');
            }, 1500);
        }
    }

    showCategories() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const faqData = this.getFAQData(this.schoolName);
        
        // Add bot message with categories
        const categoriesMessage = document.createElement('div');
        categoriesMessage.className = 'chat-message bot';
        categoriesMessage.innerHTML = `
            <div class="message-content">
                <i class="fa fa-robot"></i>
                <span>Please select a category:</span>
            </div>
        `;
        messagesContainer.appendChild(categoriesMessage);
        
        // Add category buttons
        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'categories-container';
        categoriesContainer.innerHTML = `
            <button class="category-option" data-category="general">General</button>
            <button class="category-option" data-category="academics">Academics</button>
            <button class="category-option" data-category="activities">Activities</button>
        `;
        messagesContainer.appendChild(categoriesContainer);
        
        // Add event listeners to category buttons
        categoriesContainer.querySelectorAll('.category-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showQuestions(btn.dataset.category);
            });
        });
        
        this.scrollToBottom();
    }

    showQuestions(category) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const faqData = this.getFAQData(this.schoolName);
        const questions = faqData[category] || [];
        
        // Add bot message
        const questionsMessage = document.createElement('div');
        questionsMessage.className = 'chat-message bot';
        questionsMessage.innerHTML = `
            <div class="message-content">
                <i class="fa fa-robot"></i>
                <span>Here are some ${category} questions:</span>
            </div>
        `;
        messagesContainer.appendChild(questionsMessage);
        
        // Add questions as clickable buttons
        const questionsContainer = document.createElement('div');
        questionsContainer.className = 'questions-container';
        questionsContainer.innerHTML = questions.map((item, index) => `
            <button class="question-option" data-question="${item.question}" data-answer="${item.answer}">
                ${item.question}
            </button>
        `).join('');
        messagesContainer.appendChild(questionsContainer);
        
        // Add event listeners to question buttons
        questionsContainer.querySelectorAll('.question-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleQuestionClick(btn.dataset.question, btn.dataset.answer);
            });
        });
        
        this.scrollToBottom();
    }

    handleQuestionClick(question, answer) {
        // Add user question as message
        this.addUserMessage(question);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Send answer after 3 seconds
        setTimeout(() => {
            this.removeTypingIndicator();
            this.addBotMessage(answer);
        }, 3000);
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.innerHTML = `
            <div class="message-content">
                <i class="fa fa-user"></i>
                <span>${message}</span>
            </div>
        `;
        messagesContainer.appendChild(userMessage);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot';
        botMessage.innerHTML = `
            <div class="message-content">
                <i class="fa fa-robot"></i>
                <span>${message}</span>
            </div>
        `;
        messagesContainer.appendChild(botMessage);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-message bot typing-indicator';
        typingIndicator.id = 'typingIndicator';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <i class="fa fa-robot"></i>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingIndicator);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    switchCategory(category) {
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Display questions for category
        this.displayQuestions(category);
    }

    displayQuestions(category) {
        const questionsContainer = document.getElementById('chatbotQuestions');
        const questions = this.faqData[category] || [];
        
        questionsContainer.innerHTML = questions.map((item, index) => `
            <div class="faq-question" data-index="${index}" data-question="${item.question}" data-answer="${item.answer}">
                <div class="question-text">
                    <i class="fa fa-question-circle"></i>
                    ${item.question}
                </div>
            </div>
        `).join('');

        // Add click listeners to questions
        questionsContainer.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const questionText = question.dataset.question;
                const answerText = question.dataset.answer;
                this.sendQuestionMessage(questionText, answerText);
            });
        });
    }

    sendQuestionMessage(question, answer) {
        const messagesContainer = document.getElementById('chatbotMessages');
        
        // Add user question message
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.innerHTML = `
            <div class="message-content">
                <i class="fa fa-user"></i>
                <span>${question}</span>
            </div>
        `;
        messagesContainer.appendChild(userMessage);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-message bot typing';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <i class="fa fa-robot"></i>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Send answer after 3 seconds
        setTimeout(() => {
            // Remove typing indicator
            typingIndicator.remove();
            
            // Add bot answer message
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot';
            botMessage.innerHTML = `
                <div class="message-content">
                    <i class="fa fa-robot"></i>
                    <span>${answer}</span>
                </div>
            `;
            messagesContainer.appendChild(botMessage);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 3000);
    }

    toggleAnswer(questionElement) {
        const answer = questionElement.querySelector('.answer-text');
        const allAnswers = document.querySelectorAll('.answer-text');
        const allQuestions = document.querySelectorAll('.faq-question');
        
        // Close all other answers
        allAnswers.forEach(a => a.style.display = 'none');
        allQuestions.forEach(q => q.classList.remove('active'));
        
        // Open clicked answer
        answer.style.display = 'block';
        questionElement.classList.add('active');
        
        // Add to messages
        this.addMessage(questionElement.querySelector('.question-text').textContent.trim(), 
                      answer.textContent.trim(), 'user');
    }

    addMessage(question, answer, type = 'bot') {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageHTML = `
            <div class="chat-message ${type}">
                ${type === 'user' ? 
                    `<div class="message-content">
                        <i class="fa fa-user"></i>
                        <span>${question}</span>
                    </div>` :
                    `<div class="message-content">
                        <i class="fa fa-robot"></i>
                        <span>${answer}</span>
                    </div>`
                }
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    toggleChatbot() {
        const chatbot = document.getElementById('faq-chatbot');
        const toggle = document.getElementById('chatbotToggle');
        const icon = toggle.querySelector('i');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatbot.classList.remove('open');
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            chatbot.classList.add('open');
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    }

    openChatbot() {
        const chatbot = document.getElementById('faq-chatbot');
        const toggle = document.getElementById('chatbotToggle');
        const icon = toggle.querySelector('i');
        
        chatbot.classList.add('open');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
        this.isOpen = true;
    }

    closeChatbot() {
        const chatbot = document.getElementById('faq-chatbot');
        const toggle = document.getElementById('chatbotToggle');
        const icon = toggle.querySelector('i');
        
        chatbot.classList.remove('open');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
        this.isOpen = false;
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Detect school based on page
    const isSchool1 = window.location.pathname.includes('school1');
    const isSchool2 = window.location.pathname.includes('school2');
    const isMainPage = window.location.pathname.endsWith('index.html') || 
                     window.location.pathname.endsWith('/') ||
                     window.location.pathname === '' ||
                     window.location.pathname === '/index.html';
    
    let schoolName = 'Bharathi Vidhyaa Kendhra';
    if (isSchool2) {
        schoolName = 'Bharathi kids Kshethralaya';
    }
    
    // Debug logging
    console.log('Chatbot Debug Info:');
    console.log('- Path:', window.location.pathname);
    console.log('- Is School1:', isSchool1);
    console.log('- Is School2:', isSchool2);
    console.log('- Is Main Page:', isMainPage);
    console.log('- School Name:', schoolName);
    console.log('- Should Initialize:', isSchool1 || isSchool2);
    
    // Initialize on school pages ONLY (exclude main page)
    if (isSchool1 || isSchool2) {
        console.log('Initializing chatbot for:', schoolName);
        new SchoolFAQBot(schoolName);
    } else {
        console.log('Chatbot not initialized - not on school page (main page excluded)');
    }
});
