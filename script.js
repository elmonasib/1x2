// المتغير العام لتخزين البيانات
let allLeagues = [];

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initTabs();
});

// 1. جلب البيانات من ملف JSON
async function loadData() {
    const container = document.getElementById('leaguesList');
    try {
        const response = await fetch('leagues.json');
        allLeagues = await response.json();
        
        // عند التحميل لأول مرة، اعرض مباريات "اليوم"
        renderByDay('today');
    } catch (e) {
        console.error("خطأ في جلب البيانات:", e);
        container.innerHTML = "<p style='text-align:center; padding:20px;'>Erreur de chargement des données...</p>";
    }
}

// 2. منطق فرز المباريات حسب التاريخ
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
                            <img src="${league.flag}" class="league-flag">
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
                            // --- الفكرة الجديدة: تبديل VS بالنتيجة وتبديل التوقع بالحالة ---
                            const middleContent = match.score 
                                ? `<div class="m-score">${match.score}</div>` 
                                : `<span class="vs">VS</span>`;

                            const rightContent = match.status 
                                ? `<div class="m-status ${match.status}">${match.status === 'win' ? 'Gagné' : 'Perdu'}</div>` 
                                : `<div class="m-prono">${match.prono}</div>`;

                            return `
                                <div class="match-item">
                                    <div class="m-time">${match.time}</div>
                                    <div class="m-teams">
                                        <div class="team">
                                            <img src="${match.homeLogo}">
                                            <span>${match.home}</span>
                                        </div>
                                        ${middleContent}
                                        <div class="team">
                                            <img src="${match.awayLogo}">
                                            <span>${match.away}</span>
                                        </div>
                                    </div>
                                    ${rightContent}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
    });

    container.innerHTML = htmlContent || "<p style='text-align:center; padding:20px; color:#999;'>Aucun match disponible pour cette date.</p>";
}

// 3. التحكم في تبديل التبويبات (Tabs)
function initTabs() {
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const dayType = this.id.replace('tab-', ''); 
            renderByDay(dayType);
        });
    });
}

// 4. وظيفة فتح وإغلاق قائمة المباريات
function toggleLeague(card) {
    card.classList.toggle('active');
}