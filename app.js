let currentLevelGlobal = 'BEGINNER';

window.onload = function() {
    loadUserData();
    updateChart();
};

function loadUserData() {
    const savedUser = JSON.parse(localStorage.getItem('neo_fit_user_profile'));
    if (savedUser) {
        document.getElementById('user-gender').value = savedUser.gender || 'male';
        document.getElementById('user-age').value = savedUser.age || 25;
        document.getElementById('user-height').value = savedUser.height || 170;
        document.getElementById('user-weight').value = savedUser.weight || 65;
        document.getElementById('user-bp').value = savedUser.bp || '120/80';
        document.getElementById('user-max-weight').value = savedUser.maxWeight || 60;
    }
}

function saveUserDataToStorage() {
    const userProfile = {
        gender: document.getElementById('user-gender').value,
        age: document.getElementById('user-age').value,
        height: document.getElementById('user-height').value,
        weight: document.getElementById('user-weight').value,
        bp: document.getElementById('user-bp').value,
        maxWeight: document.getElementById('user-max-weight').value
    };
    localStorage.setItem('neo_fit_user_profile', JSON.stringify(userProfile));
}

function showLevelGuide(level) {
    currentLevelGlobal = level;
    document.getElementById('guide-title').innerText = `${level} PROGRAM // パーソナル診断`;
    
    if(level === 'BEGINNER') {
        document.getElementById('max-weight-group').style.display = 'none';
    } else {
        document.getElementById('max-weight-group').style.display = 'block';
    }

    document.getElementById('main-content').style.display = 'none';
    document.getElementById('guide-section').style.display = 'block';
    
    calculatePersonalMenu();
}

function hideGuide() {
    document.getElementById('guide-section').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

function calculatePersonalMenu() {
    saveUserDataToStorage();

    const gender = document.getElementById('user-gender').value;
    const age = Number(document.getElementById('user-age').value);
    const height = Number(document.getElementById('user-height').value) / 100;
    const weight = Number(document.getElementById('user-weight').value);
    const bp = document.getElementById('user-bp').value;
    const maxWeight = Number(document.getElementById('user-max-weight').value) || 0;

    const bmi = (weight / (height * height)).toFixed(1);
    let bmiStatus = "標準";
    if (bmi < 18.5) bmiStatus = "低体重（痩せ型） - 栄養と筋肥大ボリュームが必要";
    else if (bmi >= 25) bmiStatus = "肥満気味 - 有酸素運動と代謝向上の併用推奨";

    let contentHtml = `
        <div class="card" style="margin-top:15px; border-color:#00f2ff;">
            <h3 style="color:#00f2ff; font-size:0.9rem; margin-bottom:8px;">📊 リアルタイム・パーソナル診断</h3>
            <p style="font-size:0.85rem; color:#e2e8f0;">BMI: <strong>${bmi}</strong> (${bmiStatus})</p>
            <p style="font-size:0.85rem; color:#e2e8f0;">血圧コンディション: <strong>${bp}</strong></p>
    `;

    if (currentLevelGlobal === 'BEGINNER') {
        const estBench = (weight * 0.6).toFixed(1);
        contentHtml += `
            <hr style="border-color:#1e293b; margin:10px 0;">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" alt="Beginner Form" style="width:100%; border-radius:8px; margin:10px 0; border:1px solid #00f2ff;">
            <p style="color:#38bdf8; font-weight:bold; font-size:0.85rem;">【初心者向け基礎メニュー提案】</p>
            <ul style="font-size:0.85rem; color:#e2e8f0; padding-left:18px; margin-top:8px; line-height:1.5;">
                <li><strong>ベンチプレス(目安):</strong> 約 ${estBench} kg からスタート (10回×3セット)</li>
                <li><strong>フォーム解説:</strong> 肘の角度を75度に保ち、胸のストレッチを意識。</li>
                <li><strong>アドバイス:</strong> 身体データを変更するとリアルタイムで数値が再計算されます。</li>
            </ul>
        `;
    } else if (currentLevelGlobal === 'INTERMEDIATE') {
        const targetBench = (maxWeight * 1.05).toFixed(1);
        const proteinGrams = (weight * 1.8).toFixed(0);
        contentHtml += `
            <hr style="border-color:#1e293b; margin:10px 0;">
            <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80" alt="Intermediate Training" style="width:100%; border-radius:8px; margin:10px 0; border:1px solid #00f2ff;">
            <p style="color:#38bdf8; font-weight:bold; font-size:0.85rem;">【中級者向け記録更新 & 栄養アドバイス】</p>
            <p style="font-size:0.85rem; color:#cbd5e1; margin-top:5px;">現在最高記録: <strong>${maxWeight}kg</strong> ➔ 次回目標: <strong>${targetBench}kg</strong></p>
            <ul style="font-size:0.85rem; color:#e2e8f0; padding-left:18px; margin-top:8px; line-height:1.5;">
                <li><strong>部位別アプローチ:</strong> 胸のトレーニングに加え、背中（広背筋）の安定性を高めると記録更新しやすいです。</li>
                <li><strong>推奨プロテイン:</strong> ホエイプロテイン（WPI製法） - 吸収が早く胃に負担がかかりにくい高品質タイプ。</li>
                <li><strong>摂取量・詳細:</strong> 1日あたり約 <strong>${proteinGrams}g</strong>（体重×1.8g）。トレーニング後45分以内と就寝前 30gずつに分けて摂取。</li>
            </ul>
        `;
    } else {
        const tonnageTarget = (maxWeight * 20).toFixed(0);
        const proteinGramsAdv = (weight * 2.2).toFixed(0);
        contentHtml += `
            <hr style="border-color:#1e293b; margin:10px 0;">
            <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" alt="Advanced Training" style="width:100%; border-radius:8px; margin:10px 0; border:1px solid #00f2ff;">
            <p style="color:#38bdf8; font-weight:bold; font-size:0.85rem;">【上級者向け極限ボリューム & 栄養管理】</p>
            <p style="font-size:0.85rem; color:#cbd5e1; margin-top:5px;">最高記録 ${maxWeight}kg ｜ セッション目標トネイジ: <strong>${tonnageTarget}kg</strong></p>
            <ul style="font-size:0.85rem; color:#e2e8f0; padding-left:18px; margin-top:8px; line-height:1.5;">
                <li><strong>部位別アドバイス:</strong> RPE 9の維持とネガティブ動作の徹底。マンネリ防止にアイソメトリック種目を追加。</li>
                <li><strong>推奨プロテイン:</strong> グルタミン配合ホエイアイソレート ＋ クレアチンモノハイドレート併用。</li>
                <li><strong>摂取量・詳細:</strong> 高強度セッションに対応するため 1日 <strong>${proteinGramsAdv}g</strong>（体重×2.2g）。BCAAをワークショップ中こまめに摂取し筋分解を完全抑制。</li>
            </ul>
        `;
    }

    contentHtml += `</div>`;
    document.getElementById('guide-content').innerHTML = contentHtml;
}

let timerInterval;
function startTimer(seconds) {
    clearInterval(timerInterval);
    let timeLeft = seconds;
    const display = document.getElementById('timer-display');
    
    timerInterval = setInterval(() => {
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        display.innerText = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            display.innerText = "FINISH!";
        }
        timeLeft--;
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer-display').innerText = "00:60";
}

let workoutData = JSON.parse(localStorage.getItem('neo_fit_logs')) || [];

function saveWorkout(e) {
    e.preventDefault();
    const newRecord = {
        date: new Date().toLocaleDateString(),
        part: document.getElementById('part-select').value,
        exercise: document.getElementById('exercise-select').value,
        weight: Number(document.getElementById('weight-slider').value),
        rep: Number(document.getElementById('rep-slider').value),
        memo: document.getElementById('memo-input').value
    };

    workoutData.push(newRecord);
    localStorage.setItem('neo_fit_logs', JSON.stringify(workoutData));
    alert('ワークアウトデータを記録しました！');
    updateChart();
}

let myChart;
function updateChart() {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const labels = workoutData.slice(-5).map(item => `${item.date} (${item.exercise})`);
    const weights = workoutData.slice(-5).map(item => item.weight);

    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length > 0 ? labels : ['データなし'],
            datasets: [{
                label: '挙上重量 (kg)',
                data: weights.length > 0 ? weights : [0],
                backgroundColor: 'rgba(0, 242, 255, 0.4)',
                borderColor: '#00f2ff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#1e293b' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8', font: { size: 10 } }
                }
            },
            plugins: {
                legend: { labels: { color: '#00f2ff' } }
            }
        }
    });
}
