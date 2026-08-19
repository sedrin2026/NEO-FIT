// レベル別ガイドのデータ（画像、推奨メニュー）
const levelGuides = {
    'BEGINNER': {
        title: 'BEGINNER PROGRAM // 初心者向け基礎構築',
        content: `
            <div class="guide-card-inner">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" alt="Beginner Fitness" style="width:100%; border-radius:4px; margin-bottom:10px; border:1px solid #00f2ff;">
                <p style="color:#00f2ff; font-weight:bold; margin-bottom:5px;">【目標】正しいフォームの習得と習慣化</p>
                <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:8px;">まずは無理のない負荷で、関節や筋肉を動かす感覚を掴みましょう。</p>
                <ul style="color:#e2e8f0; font-size:0.9rem; padding-left:20px; line-height:1.6;">
                    <li><strong>自重スクワット:</strong> 15回 × 3セット (股関節の動きを意識)</li>
                    <li><strong>膝つきプッシュアップ:</strong> 10回 × 3セット (胸の筋肉を意識)</li>
                    <li><strong>プランク:</strong> 30秒 × 2セット (体幹の強化)</li>
                </ul>
            </div>
        `
    },
    'INTERMEDIATE': {
        title: 'INTERMEDIATE PROGRAM // 中級者向けボリューム最適化',
        content: `
            <div class="guide-card-inner">
                <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80" alt="Intermediate Fitness" style="width:100%; border-radius:4px; margin-bottom:10px; border:1px solid #00f2ff;">
                <p style="color:#00f2ff; font-weight:bold; margin-bottom:5px;">【目標】オーバーロード（重量・回数の漸進性）の追求</p>
                <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:8px;">前回の記録を少しずつ超えることで、効率的な筋肥大を狙います。</p>
                <ul style="color:#e2e8f0; font-size:0.9rem; padding-left:20px; line-height:1.6;">
                    <li><strong>ベンチプレス:</strong> 8回〜10回 × 3〜4セット (漸進的過負荷)</li>
                    <li><strong>デッドリフト:</strong> 5回〜8回 × 3セット</li>
                    <li><strong>ラットプルダウン:</strong> 10回 × 3セット</li>
                </ul>
            </div>
        `
    },
    'ADVANCED': {
        title: 'ADVANCED PROGRAM // 上級者向け高強度・極限管理',
        content: `
            <div class="guide-card-inner">
                <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" alt="Advanced Fitness" style="width:100%; border-radius:4px; margin-bottom:10px; border:1px solid #00f2ff;">
                <p style="color:#00f2ff; font-weight:bold; margin-bottom:5px;">【目標】RPE管理と細かなボリューム（Tonnage）の最大化</p>
                <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:8px;">神経系と筋群を極限まで追い込み、停滞期を打破するフェーズです。</p>
                <ul style="color:#e2e8f0; font-size:0.9rem; padding-left:20px; line-height:1.6;">
                    <li><strong>高強度分割法:</strong> プッシュ・プル・レッグス等による徹底した部位管理</li>
                    <li><strong>RPE 8〜10:</strong> 限界手前〜完全限界のセットを厳密に記録</li>
                    <li><strong>ピーキング:</strong> 1RMの更新に向けた重量調整</li>
                </ul>
            </div>
        `
    }
};

// レベルガイド画面の表示
function showLevelGuide(level) {
    const guide = levelGuides[level];
    document.getElementById('guide-title').innerText = guide.title;
    document.getElementById('guide-content').innerHTML = guide.content;
    
    // ホーム側のメインコンテンツを隠し、ガイド画面を表示
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('guide-section').style.display = 'block';
}

// ホーム画面に戻る
function hideGuide() {
    document.getElementById('guide-section').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

// タイマー機能
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

// 記録保存とローカルストレージ連携
let workoutData = JSON.parse(localStorage.getItem('neo_fit_logs')) || [];

function saveWorkout(e) {
    e.preventDefault();
    const newRecord = {
        date: new Date().toLocaleDateString(),
        part: document.getElementById('part-select').value,
        exercise: document.getElementById('exercise-select').value,
        weight: Number(document.getElementById('weight-select').value),
        rep: Number(document.getElementById('rep-select').value),
        memo: document.getElementById('memo-input').value
    };

    workoutData.push(newRecord);
    localStorage.setItem('neo_fit_logs', JSON.stringify(workoutData));
    alert('ワークアウトデータを記録しました！');
    
    updateChart();
}

// グラフ描画（Chart.js）
let myChart;
function updateChart() {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const labels = workoutData.slice(-5).map(item => `${item.date} (${item.exercise})`);
    const weights = workoutData.slice(-5).map(item => item.weight);

    if (myChart) {
        myChart.destroy();
    }

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

// 初期化時にグラフをロード
window.onload = function() {
    updateChart();
};
