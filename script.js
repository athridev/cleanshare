// Islamic Knowledge Quiz Questions
const quizQuestions = [
    {
        question: "What is the first pillar of Islam?",
        options: ["Salah (Prayer)", "Shahada (Declaration of Faith)", "Zakat (Charity)", "Hajj (Pilgrimage)"],
        correct: 1,
        explanation: "The Shahada is the declaration: 'There is no god worthy of worship except Allah, and Muhammad is the Messenger of Allah.'"
    },
    {
        question: "How many times do Muslims pray daily?",
        options: ["3 times", "4 times", "5 times", "6 times"],
        correct: 2,
        explanation: "Muslims pray five times daily: Fajr, Dhuhr, Asr, Maghrib, and Isha."
    },
    {
        question: "What percentage of wealth is given as Zakat?",
        options: ["1.5%", "2.5%", "3.5%", "5%"],
        correct: 1,
        explanation: "Zakat is 2.5% of savings given annually to purify wealth and help the needy."
    },
    {
        question: "In which month do Muslims fast?",
        options: ["Rajab", "Sha'ban", "Ramadan", "Dhul-Hijjah"],
        correct: 2,
        explanation: "Muslims fast during the month of Ramadan from dawn to sunset."
    },
    {
        question: "What are the three categories of Tawheed?",
        options: ["Belief, Prayer, Charity", "Rububiyyah, Uluhiyyah, Asma wa Sifat", "Faith, Hope, Love", "Past, Present, Future"],
        correct: 1,
        explanation: "Tawheed has three categories: Rububiyyah (Lordship), Uluhiyyah (Worship), and Asma wa Sifat (Names and Attributes)."
    },
    {
        question: "How many articles of faith are there in Islam?",
        options: ["4", "5", "6", "7"],
        correct: 2,
        explanation: "There are six articles of faith: belief in Allah, Angels, Books, Messengers, Last Day, and Divine Decree."
    },
    {
        question: "Which book is the most authentic hadith collection?",
        options: ["Sahih Muslim", "Sahih Bukhari", "Sunan Abu Dawud", "Jami' at-Tirmidhi"],
        correct: 1,
        explanation: "Sahih Bukhari is considered the most authentic hadith collection after the Quran."
    },
    {
        question: "What does 'Salaf as-Salih' mean?",
        options: ["The righteous predecessors", "The learned scholars", "The faithful believers", "The devoted worshippers"],
        correct: 0,
        explanation: "Salaf as-Salih means 'the righteous predecessors' - the first three generations of Muslims."
    },
    {
        question: "Which city do Muslims face during prayer?",
        options: ["Medina", "Jerusalem", "Mecca", "Cairo"],
        correct: 2,
        explanation: "Muslims face the Kaaba in Mecca (Qibla direction) during their prayers."
    },
    {
        question: "What is the last revelation sent by Allah?",
        options: ["Torah", "Gospel", "Psalms", "Quran"],
        correct: 3,
        explanation: "The Quran is the final revelation from Allah, preserved in its original Arabic form."
    }
];

// Theme Manager
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.applyTheme();
        this.initializeToggle();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateToggleIcon();
    }

    updateToggleIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    initializeToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Quiz Game Manager
class QuizGame {
    constructor() {
        this.questions = [...quizQuestions];
        this.currentQuestion = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameFinished = false;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const startBtn = document.getElementById('startGameBtn');
        const nextBtn = document.getElementById('nextCardBtn');
        const resetBtn = document.getElementById('resetGameBtn');

        if (startBtn) startBtn.addEventListener('click', () => this.startGame());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetGame());
    }

    startGame() {
        this.gameStarted = true;
        this.gameFinished = false;
        this.currentQuestion = 0;
        this.score = 0;
        this.shuffleQuestions();
        this.updateUI();
        this.showQuestion();
        
        document.getElementById('startGameBtn').style.display = 'none';
        document.getElementById('gameResult').style.display = 'none';
    }

    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        const questionText = document.getElementById('questionText');
        const cardOptions = document.getElementById('cardOptions');

        if (questionText) questionText.textContent = question.question;
        
        if (cardOptions) {
            cardOptions.innerHTML = '';
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.textContent = option;
                button.addEventListener('click', () => this.selectAnswer(index));
                cardOptions.appendChild(button);
            });
        }

        this.updateUI();
    }

    selectAnswer(selectedIndex) {
        const question = this.questions[this.currentQuestion];
        const options = document.querySelectorAll('.option-btn');
        
        options.forEach((btn, index) => {
            btn.classList.add('disabled');
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && index !== question.correct) {
                btn.classList.add('incorrect');
            }
        });

        if (selectedIndex === question.correct) {
            this.score++;
        }

        // Show explanation
        const questionText = document.getElementById('questionText');
        if (questionText) {
            questionText.innerHTML = `
                <div style="margin-bottom: 15px;">${question.question}</div>
                <div style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">
                    <strong>Explanation:</strong> ${question.explanation}
                </div>
            `;
        }

        setTimeout(() => {
            if (this.currentQuestion < this.questions.length - 1) {
                document.getElementById('nextCardBtn').style.display = 'block';
            } else {
                this.finishGame();
            }
        }, 1500);

        this.updateUI();
    }

    nextQuestion() {
        this.currentQuestion++;
        this.showQuestion();
        document.getElementById('nextCardBtn').style.display = 'none';
    }

    finishGame() {
        this.gameFinished = true;
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const resultTitle = document.getElementById('resultTitle');
        const resultMessage = document.getElementById('resultMessage');
        const gameResult = document.getElementById('gameResult');

        let title, message;
        
        if (percentage >= 90) {
            title = "🌟 Excellent! MashaAllah!";
            message = `You scored ${this.score}/${this.questions.length} (${percentage}%). Your knowledge of Islam is outstanding!`;
        } else if (percentage >= 70) {
            title = "👍 Great Job! Alhamdulillah!";
            message = `You scored ${this.score}/${this.questions.length} (${percentage}%). Keep learning and growing in Islamic knowledge.`;
        } else if (percentage >= 50) {
            title = "📚 Good Start!";
            message = `You scored ${this.score}/${this.questions.length} (${percentage}%). Continue studying to strengthen your Islamic knowledge.`;
        } else {
            title = "🤲 Keep Learning!";
            message = `You scored ${this.score}/${this.questions.length} (${percentage}%). There's always more to learn about Islam. May Allah guide you!`;
        }

        if (resultTitle) resultTitle.textContent = title;
        if (resultMessage) resultMessage.textContent = message;
        if (gameResult) gameResult.style.display = 'block';
        
        document.getElementById('resetGameBtn').style.display = 'block';
        this.updateUI();
    }

    resetGame() {
        this.gameStarted = false;
        this.gameFinished = false;
        this.currentQuestion = 0;
        this.score = 0;
        
        document.getElementById('startGameBtn').style.display = 'block';
        document.getElementById('nextCardBtn').style.display = 'none';
        document.getElementById('resetGameBtn').style.display = 'none';
        document.getElementById('gameResult').style.display = 'none';
        
        const questionText = document.getElementById('questionText');
        const cardOptions = document.getElementById('cardOptions');
        
        if (questionText) questionText.textContent = 'Click "Start Game" to begin the Islamic Knowledge Quiz!';
        if (cardOptions) cardOptions.innerHTML = '';
        
        this.updateUI();
    }

    updateUI() {
        const scoreElement = document.getElementById('score');
        const cardCounterElement = document.getElementById('cardCounter');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (cardCounterElement) {
            if (this.gameStarted && !this.gameFinished) {
                cardCounterElement.textContent = `${this.currentQuestion + 1}/${this.questions.length}`;
            } else {
                cardCounterElement.textContent = `0/${this.questions.length}`;
            }
        }
    }
}

// URL Cleaner for Social Media Platforms
class URLCleaner {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const cleanBtn = document.getElementById('cleanBtn');
        const copyBtn = document.getElementById('copyBtn');
        const originalUrlInput = document.getElementById('originalUrl');

        cleanBtn.addEventListener('click', () => this.cleanURL());
        copyBtn.addEventListener('click', () => this.copyToClipboard());
        
        // Allow Enter key to trigger cleaning
        originalUrlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.cleanURL();
            }
        });

        // Auto-clean on paste (with a small delay)
        originalUrlInput.addEventListener('paste', () => {
            setTimeout(() => {
                if (originalUrlInput.value.trim()) {
                    this.cleanURL();
                }
            }, 100);
        });
    }

    cleanURL() {
        const originalUrl = document.getElementById('originalUrl').value.trim();
        const cleanedUrlInput = document.getElementById('cleanedUrl');
        const outputGroup = document.getElementById('outputGroup');
        const statusMessage = document.getElementById('statusMessage');

        // Clear previous status
        statusMessage.className = 'status-message';
        statusMessage.textContent = '';

        if (!originalUrl) {
            this.showStatus('Please enter a URL to clean.', 'error');
            return;
        }

        try {
            const cleanedUrl = this.processURL(originalUrl);
            
            if (cleanedUrl === originalUrl) {
                this.showStatus('No tracking parameters found to remove.', 'success');
            } else {
                this.showStatus('URL cleaned successfully! Tracking parameters removed.', 'success');
            }

            cleanedUrlInput.value = cleanedUrl;
            outputGroup.style.display = 'block';

        } catch (error) {
            this.showStatus('Error: Invalid URL format. Please check your URL and try again.', 'error');
            outputGroup.style.display = 'none';
        }
    }

    processURL(urlString) {
        let url;
        
        try {
            // Handle URLs without protocol
            if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
                urlString = 'https://' + urlString;
            }
            
            url = new URL(urlString);
        } catch (error) {
            throw new Error('Invalid URL');
        }

        const hostname = url.hostname.toLowerCase();
        
        // Platform-specific cleaning
        if (this.isInstagram(hostname)) {
            return this.cleanInstagramURL(url);
        } else if (this.isFacebook(hostname)) {
            return this.cleanFacebookURL(url);
        } else if (this.isTikTok(hostname)) {
            return this.cleanTikTokURL(url);
        } else if (this.isTwitter(hostname)) {
            return this.cleanTwitterURL(url);
        } else if (this.isYouTube(hostname)) {
            return this.cleanYouTubeURL(url);
        } else {
            // Generic cleaning for other platforms
            return this.cleanGenericURL(url);
        }
    }

    isInstagram(hostname) {
        return hostname.includes('instagram.com');
    }

    isFacebook(hostname) {
        return hostname.includes('facebook.com') || hostname.includes('fb.com') || hostname.includes('m.facebook.com');
    }

    isTikTok(hostname) {
        return hostname.includes('tiktok.com') || hostname.includes('vm.tiktok.com');
    }

    isTwitter(hostname) {
        return hostname.includes('twitter.com') || hostname.includes('x.com') || hostname.includes('t.co');
    }

    isYouTube(hostname) {
        return hostname.includes('youtube.com') || hostname.includes('youtu.be');
    }

    cleanInstagramURL(url) {
        // Instagram tracking parameters to remove
        const paramsToRemove = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
            'igshid', 'igsh', 'ig_rid', 'ig_web_copy_link', 'ig_web_button_share',
            'fbclid', 'source', '_branch_match_id', '_branch_referrer',
            'hl', 'taken-by', 'tagged', 'share_id'
        ];

        paramsToRemove.forEach(param => {
            url.searchParams.delete(param);
        });

        // Remove hash fragments that contain tracking
        if (url.hash && (url.hash.includes('igshid') || url.hash.includes('utm_'))) {
            url.hash = '';
        }

        return url.toString();
    }

    cleanFacebookURL(url) {
        // Facebook tracking parameters to remove
        const paramsToRemove = [
            'fbclid', 'fb_source', 'fb_ref', 'ref', 'refsrc', 'refid',
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
            '__cft__', '__tn__', 'source', '_fb_noscript', 'comment_tracking',
            'hc_ref', 'hc_location', 'fref', 'pnref', 'story_fbid', 'substory_index',
            '_rdc', '_rdr', 'eh', 'extid', 'pnref', 'refid', 'ref_type',
            'theater', 'set', 'type', 'l', 'u', 'h', 'enc', 'app', 'scm'
        ];

        paramsToRemove.forEach(param => {
            url.searchParams.delete(param);
        });

        // Clean Facebook mobile redirects
        if (url.hostname.includes('l.facebook.com') || url.hostname.includes('lm.facebook.com')) {
            const redirectUrl = url.searchParams.get('u');
            if (redirectUrl) {
                try {
                    return decodeURIComponent(redirectUrl);
                } catch (e) {
                    // If decoding fails, return original
                }
            }
        }

        return url.toString();
    }

    cleanTikTokURL(url) {
        // TikTok tracking parameters to remove
        const paramsToRemove = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
            'sender_device', 'sender_web_id', 'is_from_webapp', 'is_copy_url',
            'checksum', 'user_id', 'timestamp', '_r', 'u_code', 'preview_pb',
            'language', 'source', 'sec_user_id', 'share_app_id', 'share_link_id',
            'tt_from', 'u_code', '_d', 'share_iid', 'ugbiz_name'
        ];

        paramsToRemove.forEach(param => {
            url.searchParams.delete(param);
        });

        // Handle TikTok short URLs (vm.tiktok.com)
        if (url.hostname.includes('vm.tiktok.com')) {
            // Keep the short URL as is, just remove query params
            return url.protocol + '//' + url.hostname + url.pathname;
        }

        return url.toString();
    }

    cleanTwitterURL(url) {
        // Twitter/X tracking parameters to remove
        const paramsToRemove = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
            's', 't', 'ref_src', 'ref_url', 'src', 'cn', 'refsrc', 'twclid'
        ];

        paramsToRemove.forEach(param => {
            url.searchParams.delete(param);
        });

        return url.toString();
    }

    cleanYouTubeURL(url) {
        // YouTube tracking parameters to remove
        const paramsToRemove = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
            'feature', 'gclid', 'kw', 'si', 'pp', 'pb', 'pbj', 'pbjreload'
        ];

        // Keep important YouTube parameters
        const keepParams = ['v', 't', 'list', 'index', 'start', 'end'];
        
        const newSearchParams = new URLSearchParams();
        
        // Only keep essential parameters
        keepParams.forEach(param => {
            if (url.searchParams.has(param)) {
                newSearchParams.set(param, url.searchParams.get(param));
            }
        });

        url.search = newSearchParams.toString();
        
        return url.toString();
    }

    cleanGenericURL(url) {
        // Generic tracking parameters found across platforms
        const genericParamsToRemove = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
            'fbclid', 'gclid', 'msclkid', 'twclid', 'igshid',
            'ref', 'source', 'campaign', 'medium', 'content', 'term',
            '_ga', '_gl', '_ke', 'mc_cid', 'mc_eid', 'pk_campaign', 'pk_kwd',
            'pk_medium', 'pk_source', 'piwik_campaign', 'piwik_kwd', 'piwik_keyword'
        ];

        genericParamsToRemove.forEach(param => {
            url.searchParams.delete(param);
        });

        return url.toString();
    }

    async copyToClipboard() {
        const cleanedUrl = document.getElementById('cleanedUrl').value;
        const statusMessage = document.getElementById('statusMessage');

        if (!cleanedUrl) {
            this.showStatus('No cleaned URL to copy.', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(cleanedUrl);
            this.showStatus('✅ Copied to clipboard!', 'success');
            
            // Change button text temporarily
            const copyBtn = document.getElementById('copyBtn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ Copied!';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);

        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(cleanedUrl);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showStatus('✅ Copied to clipboard!', 'success');
        } catch (err) {
            this.showStatus('Failed to copy. Please copy manually.', 'error');
        }

        document.body.removeChild(textArea);
    }

    showStatus(message, type) {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.textContent = '';
                statusMessage.className = 'status-message';
            }, 3000);
        }
    }
}

// Initialize all components when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    new ThemeManager();
    
    // Initialize URL cleaner
    new URLCleaner();
    
    // Initialize quiz game
    new QuizGame();
    
    // Add some example URLs for demonstration
    const examples = [
        'Instagram: https://www.instagram.com/p/ABC123/?utm_source=ig_web_copy_link&igshid=1234567890',
        'Facebook: https://www.facebook.com/user/posts/123456789?ref=share&fbclid=abc123',
        'TikTok: https://www.tiktok.com/@user/video/1234567890?utm_source=copy&utm_medium=share',
    ];
    
    console.log('URL Cleaner Examples:', examples);
    console.log('Islamic Knowledge Quiz initialized with', quizQuestions.length, 'questions');
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to clean URL
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const cleanBtn = document.getElementById('cleanBtn');
        cleanBtn.click();
    }
    
    // Ctrl/Cmd + C when focused on cleaned URL to copy
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const cleanedUrl = document.getElementById('cleanedUrl');
        if (document.activeElement === cleanedUrl && cleanedUrl.value) {
            // Let the default copy behavior work, but also show our status
            setTimeout(() => {
                const urlCleaner = new URLCleaner();
                urlCleaner.showStatus('✅ Copied to clipboard!', 'success');
            }, 10);
        }
    }
});
