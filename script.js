document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const btns = {
        yesterday: document.getElementById('btn-yesterday'),
        today: document.getElementById('btn-today'),
        tomorrow: document.getElementById('btn-tomorrow')
    };

    async function loadMatches(day) {
        contentArea.innerHTML = `<div style="text-align:center; color:#FACC15; padding:20px;">Loading matches...</div>`;
        
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Data file not found');
            
            const data = await response.json();
            const leagues = data.timeline[day];

            contentArea.innerHTML = ''; 

            if (!leagues || leagues.length === 0) {
                contentArea.innerHTML = `<div style="text-align:center; color:#666; padding:20px;">No matches found.</div>`;
                return;
            }

            leagues.forEach(league => {
                const leagueSection = document.createElement('div');
                leagueSection.className = 'league-section';

                let matchesHTML = '';
                league.matches.forEach(match => {
                    matchesHTML += `
                        <div class="match-card">
                            <div class="team">
                                <img src="${match.home_logo || 'https://via.placeholder.com/40'}" alt="">
                                <span>${match.home_team}</span>
                            </div>
                            <div class="match-info">
                                <span class="match-time">${match.time}</span>
                                <span class="match-date">${match.date}</span>
                            </div>
                            <div class="team">
                                <img src="${match.away_logo || 'https://via.placeholder.com/40'}" alt="">
                                <span>${match.away_team}</span>
                            </div>
                            <div class="prediction-tag">
                                <small>PREDICTION</small>
                                <strong>${match.prediction}</strong>
                            </div>
                        </div>
                    `;
                });

                // تعديل هنا: التأكد من استخدام الكلاس league-icon ليتطابق مع الـ CSS
                leagueSection.innerHTML = `
                    <div class="league-header">
                        <img src="${league.league_logo || 'https://via.placeholder.com/30'}" class="league-icon" alt="League Logo">
                        <span class="league-name">${league.league_name}</span>
                    </div>
                    <div class="matches-list">${matchesHTML}</div>
                `;
                contentArea.appendChild(leagueSection);
            });
        } catch (error) {
            contentArea.innerHTML = `<div style="text-align:center; color:red; padding:20px;">Error loading data.json</div>`;
        }
    }

    Object.keys(btns).forEach(day => {
        btns[day].addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btns[day].classList.add('active');
            loadMatches(day);
        });
    });

    loadMatches('today');
});

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-list');
    const overlay = document.getElementById('overlay');

    // دالة لتبديل حالة القائمة
    const toggleMenu = () => {
        menu.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    menu.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu); // إغلاق عند الضغط خارج القائمة

    // إغلاق القائمة عند الضغط على أي رابط
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
});