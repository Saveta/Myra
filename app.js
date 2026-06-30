// Navigation Bar
document.addEventListener('DOMContentLoaded', function () {
    var navLinks = document.querySelectorAll('.nav-link');
    var tabPanels = document.querySelectorAll('.tab-panel');
    var navToggle = document.getElementById('navToggle');
    var navbarLinks = document.querySelector('.navbar-links');

    function switchTab(targetTab) {
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        tabPanels.forEach(function (panel) { panel.classList.remove('active'); });

        var activeLink = document.querySelector('.nav-link[data-tab="' + targetTab + '"]');
        if (activeLink) activeLink.classList.add('active');
        document.getElementById(targetTab).classList.add('active');

        if (navbarLinks) navbarLinks.classList.remove('open');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            switchTab(this.getAttribute('data-tab'));
        });
    });

    // Quick link cards on Home page
    var quickLinks = document.querySelectorAll('.quick-link-card');
    quickLinks.forEach(function (card) {
        card.addEventListener('click', function () {
            var targetTab = this.getAttribute('data-tab');
            if (targetTab) switchTab(targetTab);
        });
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navbarLinks.classList.toggle('open');
        });
    }

    // Chart period buttons
    var chartButtons = document.querySelectorAll('.chart-btn');
    chartButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            chartButtons.forEach(function (btn) { btn.classList.remove('active'); });
            this.classList.add('active');
        });
    });

    // Daily Chess Story
    loadDailyStory();
});

function loadDailyStory() {
    var stories = [
        {
            title: "The Immortal Game (1851)",
            text: "In London 1851, Adolf Anderssen played one of the most famous games in chess history against Lionel Kieseritzky. Anderssen sacrificed both rooks, a bishop, and his queen — yet delivered a beautiful checkmate with just three minor pieces! This game showed that bravery and creativity can triumph over material advantage.",
            moral: "Chess lesson: Sometimes the best move is the one that looks impossible. Don't be afraid to sacrifice for a greater goal!"
        },
        {
            title: "Magnus Carlsen's First Tournament",
            text: "Did you know that Magnus Carlsen, the greatest chess player of our era, lost his first serious tournament? At age 8, young Magnus didn't win a single game in his first rated event. But he didn't give up. He kept practicing, kept learning, and just four years later became a Grandmaster at age 13!",
            moral: "Chess lesson: Every champion started as a beginner. What matters is not how you start, but that you never stop improving!"
        },
        {
            title: "The Queen's Power 👑",
            text: "The Queen is the most powerful piece on the board — she can move in any direction, any number of squares. But did you know that in the original version of chess (around 600 AD), the Queen could only move ONE square diagonally? She was the weakest piece! It wasn't until the 15th century in Europe that the Queen became the powerhouse we know today.",
            moral: "Chess lesson: Even the mightiest started small. With time and growth, anyone can become powerful! 👸"
        },
        {
            title: "Garry Kasparov vs. Deep Blue",
            text: "In 1997, World Champion Garry Kasparov played against a computer called Deep Blue. It was the first time a computer beat the world's best human player in a match. Kasparov was shocked! But this moment inspired humans to use computers to become even BETTER at chess. Today, young players like you use computers to learn and improve faster than ever before.",
            moral: "Chess lesson: Technology is a tool for learning. Use it to grow stronger, not to replace your own thinking!"
        },
        {
            title: "The Shortest Possible Checkmate",
            text: "The fastest possible checkmate in chess takes only TWO moves! It's called 'Fool's Mate': if White moves the f-pawn and g-pawn forward, Black can deliver instant checkmate with the Queen on h4. While this almost never happens in real games, it teaches us an important lesson about protecting our King from the very first move.",
            moral: "Chess lesson: Always think about King safety! Even one careless move can end the game."
        },
        {
            title: "Bobby Fischer's Perfect Game",
            text: "American champion Bobby Fischer once played a game so perfect that chess experts couldn't find a single better move for him. Against Robert Byrne in 1963, Fischer was only 20 years old when he played what many call 'The Game of the Century.' He sacrificed his Queen in a stunning combination that left everyone amazed!",
            moral: "Chess lesson: Study hard, calculate carefully, and one day you might play a perfect game too!"
        },
        {
            title: "Chess in Space! 🚀",
            text: "In 1970, Soviet cosmonauts aboard Soyuz 9 played a chess game against mission control on Earth! It was the first chess game ever played in outer space. The game ended in a draw after 35 moves. This showed that chess is truly a universal game — played not just across countries, but even across the cosmos!",
            moral: "Chess lesson: Chess connects people everywhere — across cities, countries, and even in space! Every game you play connects you to millions of players worldwide."
        },
        {
            title: "The Knight's Tour 🐴",
            text: "Can a knight visit every single square on the chessboard exactly once? Yes! This puzzle is called 'The Knight's Tour' and mathematicians have studied it for over 1,000 years. The first known solution was found by an Arab chess player in the 9th century. There are over 26 trillion different knight's tours possible on a standard board!",
            moral: "Chess lesson: The knight moves in a funny L-shape, but it can reach every corner of the board. Don't underestimate the little pieces!"
        },
        {
            title: "Youngest Chess Grandmaster",
            text: "Abhimanyu Mishra from the USA became the world's youngest Grandmaster at age 12 years, 4 months and 25 days in 2021. He worked incredibly hard, studying chess 8-10 hours every day! His father drove him to tournaments all over the country. Abhimanyu showed that with dedication and family support, incredible achievements are possible.",
            moral: "Chess lesson: Big dreams need big effort. Practice every day, even when it's hard — that's what champions do!"
        },
        {
            title: "The Stalemate Trap",
            text: "Imagine you're winning a game — you have a Queen and King against a lone King. Easy win, right? But be careful! If you accidentally leave your opponent with NO legal moves while they're NOT in check, the game is a DRAW! This is called stalemate, and it has saved many games for the losing side. Even Grandmasters fall into this trap!",
            moral: "Chess lesson: Stay focused until the very end. A game isn't won until checkmate is on the board!"
        },
        {
            title: "Judit Polgár — The Greatest Female Chess Player 👑",
            text: "Judit Polgár from Hungary became the strongest female chess player in history. She earned the Grandmaster title at age 15 — the youngest person at the time! She defeated 11 world champions, including Garry Kasparov. Judit proved that girls can play chess just as brilliantly as anyone. She's an inspiration to young chess queens everywhere!",
            moral: "Chess lesson: There are no limits to what girls can achieve in chess. Dream big, play boldly, and write your own story! 🌟"
        },
        {
            title: "Why Pawns Are Special ♟️",
            text: "Pawns are the smallest pieces on the board, but they have a superpower: when a pawn reaches the other side of the board, it can become a Queen, Rook, Bishop, or Knight! This is called 'promotion.' In many games, a single pawn reaching the last rank decides who wins. That's why Grandmasters say: 'Pawns are the soul of chess.'",
            moral: "Chess lesson: Never underestimate the pawns. Small steps forward can lead to the greatest transformations! Every queen was once a pawn! 👸"
        },
        {
            title: "Chess in India — Where It All Began! 🇮🇳",
            text: "Did you know that chess was invented in India? The ancient game was called 'Chaturanga' and was played in India around 600 AD. The word means 'four divisions' — referring to infantry, cavalry, elephants, and chariots, which became the pawn, knight, bishop, and rook we know today! From India, the game spread to Persia, the Arab world, and then to Europe.",
            moral: "Chess lesson: When you play chess, you're playing a game that started in your homeland 1,500 years ago. You're carrying forward an incredible Indian tradition! 🌟"
        },
        {
            title: "Koneru Humpy — India's Chess Queen 🇮🇳👑",
            text: "Koneru Humpy from Andhra Pradesh became a Grandmaster at age 15 and has been the Women's World Rapid Champion! She's one of the strongest female players in history. Humpy showed the world that Indian girls can reach the very top of chess. She started learning chess from her father at a young age, just like many young champions do.",
            moral: "Chess lesson: India has produced some of the world's greatest chess players. With hard work and passion, the next champion could be YOU!"
        },
        {
            title: "The Origin of 'Checkmate'",
            text: "The word 'checkmate' comes from the Persian phrase 'shāh māt' which means 'the king is helpless.' Chess originated in India around 600 AD as Chaturanga, then traveled to Persia, the Arab world, and finally to Europe. The game has been played for nearly 1,500 years — and you're part of this amazing tradition every time you sit down to play!",
            moral: "Chess lesson: When you play chess, you're playing a game with 1,500 years of history. You're part of something much bigger than one game!"
        }
    ];

    // Pick story based on day of year (rotates through all stories)
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var dayOfYear = Math.floor(diff / oneDay);
    var storyIndex = dayOfYear % stories.length;
    var story = stories[storyIndex];

    // Set date
    var dateEl = document.getElementById('storyDate');
    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Set story content
    var contentEl = document.getElementById('storyContent');
    if (contentEl) {
        contentEl.innerHTML = '<h3>' + story.title + '</h3>' +
            '<p>' + story.text + '</p>' +
            '<div class="story-moral"><strong>💡 </strong>' + story.moral + '</div>';
    }
}

// Lightbox functions
function openLightbox(element) {
    var img = element.querySelector('img');
    var caption = element.querySelector('.gallery-caption h4');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}
