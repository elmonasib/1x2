// المتغير العام لتخزين البيانات
let allLeagues = [];

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initTabs();
    initTheme(); // تشغيل ميزة الوضع الليلي بالأيقونات المضمونة
});

// 1. جلب البيانات من ملف JSON
async function loadData() {
    const container = document.getElementById('leaguesList');
    try {
        const response = await fetch('leagues.json');
        allLeagues = await response.json();
        renderByDay('today');
    } catch (e) {
        console.error("خطأ في جلب البيانات:", e);
        container.innerHTML = "<p style='text-align:center; padding:20px;'>Erreur de chargement...</p>";
    }
}

// 2. منطق عرض المباريات مع إصلاح ظهور النتائج (Score)
function renderByDay(targetDay) {
    const container = document.getElementById('leaguesList');
    const todayDate = new Date();
    const targetDate = new Date(todayDate);
    
    if (targetDay === 'yesterday') {
        targetDate.setDate(todayDate.getDate() - 1);
    } else if (targetDay === 'tomorrow') {
        targetDate.setDate(todayDate.getDate() + 1);
    }

    const targetDateString = targetDate.toISOString().split('T')[0];
    let htmlContent = '';

    allLeagues.forEach(league => {
        const filteredMatches = league.matches.filter(match => match.date === targetDateString);

        if (filteredMatches.length > 0) {
            htmlContent += `
                <div class="league-card">
                    <div class="league-header" onclick="toggleLeague(this.parentElement)">
                        <div class="league-info">
                            <img src="${league.flag}" class="league-flag" style="width:20px; margin-right:8px;">
                            <span class="league-name">${league.name}</span>
                        </div>
                        <div class="league-status">
                            ${filteredMatches.some(m => m.isLive) ? '<span class="live-badge">LIVE</span>' : ''}
                            <span class="match-count">${filteredMatches.length}</span>
                            <span style="color:#ff8c00">❯</span>
                        </div>
                    </div>
                    
                    <div class="matches-list">
                        ${filteredMatches.map(match => {
                            // منطق عرض النتيجة لمباريات الأمس أو VS للمباريات القادمة
                            const middleContent = match.score 
                                ? `<div class="m-score" style="font-weight:bold; background:#eee; padding:2px 8px; border-radius:4px; color:#333;">${match.score}</div>` 
                                : `<span class="vs" style="color:#888;">VS</span>`;

                            // تحديد شكل التوقع (Gagné/Perdu أو التوقع العادي)
                            const rightContent = match.status 
                                ? `<div class="m-status ${match.status}" style="background:${match.status === 'win' ? '#28a745' : '#dc3545'}; color:white; padding:5px 10px; border-radius:6px; font-size:0.7rem; font-weight:bold; min-width:60px; text-align:center;">${match.status === 'win' ? 'Gagné' : 'Perdu'}</div>` 
                                : `<div class="m-prono" style="background:#ff8c00; color:white; padding:5px 10px; border-radius:6px; font-weight:bold; font-size:0.8rem; min-width:60px; text-align:center;">${match.prono}</div>`;

                            return `
                                <div class="match-item" style="display:flex; align-items:center; padding:12px 10px; border-top:1px solid #eee; gap:8px;">
                                    <div class="m-time" style="flex:0.5; font-size:0.8rem; color:#888;">${match.time}</div>
                                    <div class="m-teams" style="flex:3; display:flex; align-items:center; justify-content:center; gap:10px;">
                                        <div class="team" style="display:flex; flex-direction:column; align-items:center; flex:1;">
                                            <img src="${match.homeLogo}" style="width:20px; margin-bottom:4px;">
                                            <span style="font-size:0.7rem; text-align:center;">${match.home}</span>
                                        </div>
                                        ${middleContent}
                                        <div class="team" style="display:flex; flex-direction:column; align-items:center; flex:1;">
                                            <img src="${match.awayLogo}" style="width:20px; margin-bottom:4px;">
                                            <span style="font-size:0.7rem; text-align:center;">${match.away}</span>
                                        </div>
                                    </div>
                                    <div style="flex:1; text-align:right; display:flex; justify-content:flex-end;">
                                        ${rightContent}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
    });

    container.innerHTML = htmlContent || "<p style='text-align:center; padding:20px; color:#999;'>Aucun match disponible.</p>";
}

// 3. التبديل بين الأيام
function initTabs() {
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderByDay(this.id.replace('tab-', ''));
        });
    });
}

function toggleLeague(card) {
    card.classList.toggle('active');
}

// 4. ميزة الوضع الليلي بأيقونات SVG المضمونة 100%
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // تعريف أيقونات SVG الاحترافية
    const moonIcon = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const sunIcon = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if(themeToggle) {
        // وضع الأيقونة المناسبة عند التحميل
        themeToggle.innerHTML = savedTheme === 'dark' ? sunIcon : moonIcon;
        
        themeToggle.addEventListener('click', () => {
            let currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // تبديل الأيقونة عند الضغط
            themeToggle.innerHTML = newTheme === 'dark' ? sunIcon : moonIcon;
        });
    }
}