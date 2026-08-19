
// レベル切り替え処理
function setLevel(level) {
    document.querySelectorAll('.lvl-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('current-level-text').innerText = `現在のモード: ${level}`;
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
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    // 最近の記録から最大5件の重量データを抽出
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
                backgroundColor: 'rgba(0, 242, 255, 0.5)',
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
