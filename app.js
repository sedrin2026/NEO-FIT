let currentLevelGlobal = 'BEGINNER';

// レベルガイド画面の表示
function showLevelGuide(level) {
    currentLevelGlobal = level;
    document.getElementById('guide-title').innerText = `${level} PROGRAM // パーソナル診断`;
    
    // 上級者以外は最高記録入力を隠すなどの調整も可能
    if(level === 'BEGINNER') {
        document.getElementById('max-weight-group').style.display = 'none';
    } else {
        document.getElementById('max-weight-group').style.display = 'block';
    }

    document.getElementById('main-content').style.display = 'none';
    document.getElementById('guide-section').style.display = 'block';
    
    // 初回自動計算を実行
    calculatePersonalMenu();
}

function hideGuide() {
    document.getElementById('guide-section').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

// 身体データからBMI・適正数値を算出し、レベル別に提案を行う
function calculatePersonalMenu() {
    const gender = document.getElementById('user-gender').value;
    const age = Number(document.getElementById('user-age').value);
    const height = Number(document.getElementById('user-height').value) / 100; // m変換
    const weight = Number(document.getElementById('user-weight').value);
    const bp = document.getElementById('user-bp').value;
    const maxWeight = Number(document.getElementById('user-max-weight').value) || 0;

    // BMI計算
    const bmi = (weight / (height * height)).toFixed(1);
    let bmiStatus = "標準";
    if (bmi < 18.5) bmiStatus = "低体重（痩せ型） - 栄養と筋肥大ボリュームが必要";
    else if (bmi >= 25) bmiStatus = "肥満気味 - 有酸素運動とカロリー管理を並行推奨";

    let contentHtml = `
        <div class="card" style="margin-top:15px; border-color:#00f2ff;">
            <h3 style="color:#00f2ff; font-size:0.9rem; margin-bottom:8px;">📊 パーソナル分析結果</h3>
            <p style="font-size:0.85rem; color:#e2e8f0;">BMI: <strong>${bmi}</strong> (${bmiStatus})</p>
            <p style="font-size:0.85rem; color:#e2e8f0;">血圧状態: <strong>${bp}</strong> (安定)</p>
    `;

    if (currentLevelGlobal === 'BEGINNER') {
        const estBench = (weight * 0.6).toFixed(1);
        contentHtml += `
            <hr style="border-color:#1e293b; margin:10px 0;">
            <p style="color:#38bdf8; font-weight:bold; font-size:0.85rem;">【初心者向け最適メニュー提案】</p>
            <p style="font-size:0.85rem; color:#cbd5e1; margin-top:5px;">あなたの体重(${weight}kg)に基づき、まずは安全に基礎筋力をつけるメニューです。</p>
            <ul style="font-size:0.85rem; color:#e2e8f0; padding-left:18px; margin-top:8px; line-height:1.5;">
                <li><strong>ベンチプレス(目安):</strong> 約 ${estBench} kg からフォーム固め (10回×3セット)</li>
                <li><strong>自重スクワット:</strong> 15回 × 3セット (膝がつま先より出ないよう意識)</li>
                <li><strong>アドバイス:</strong> 血圧に負荷をかけすぎないよう、呼吸を止めずに行いましょう。</li>
            </ul>
        `;
    } else if (currentLevelGlobal === 'INTERMEDIATE') {
        const targetBench = (maxWeight * 1.05).toFixed(1);
        contentHtml += `
            <hr style="border-color:#1e293b; margin:10px 0;">
            <p style="color:#38bdf8; font-weight:bold; font-size:0.85rem;">【中級者向け記録更新アドバイス】</p>
            <p style="font-size:0.85rem; color:#cbd5e1; margin-top:5px;">現在入力されたベンチプレス最高記録: <strong>${maxWeight}kg</strong></p>
            <ul style="font-size:0.85rem; color:#e2e8f0; padding-left:18px; margin-top:8px; line-height:1.5;">
                <li><strong>次回の目標重量:</strong> ${targetBench} kg （+2.5kgのオーバーロード）</li>
                <li><strong>推奨アプローチ:</strong> メインセットの前に背中（広背筋）の安定性を高めると、挙上重量が伸びやすくなります。</li>
                <li><strong>分割法提案:</strong> 胸と三頭筋のコンビネーションセッションを週2回に設定してください。</li>
            </ul>
        `;
    } else {
        const tonnageTarget = (maxWeight * 20).toFixed(0);
        contentHtml += `
            <hr style="border-color:#1e293b; margin:10px 0;">
            <p style="color:#38bdf8; font-weight:bold; font-size:0.85rem;">【上級者向け極限ボリューム・RPE管理】</p>
            <p style="font-size:0.85rem; color:#cbd5e1; margin-top:5px;">最高記録 ${maxWeight}kg をベースにした神経系・筋肥大の最適化プラン。</p>
            <ul style="font-size:0.85rem; color:#e2e8f0; padding-left:18px; margin-top:8px; line-height:1.5;">
                <li><strong>セッション目標トネイジ:</strong> ${tonnageTarget} kg 以上をターゲットに設定。</li>
                <li><strong>RPE 9 厳守:</strong> 失敗リスクを排除しつつ、ネガティブ動作を4秒かけるスロードリルを追加。</li>
                <li><strong>アドバイス:</strong> 神経疲労が溜まりやすいため、睡眠とクエン酸の摂取量を増やすことを推奨します。</li>
            </ul>
        `;
    }

    contentHtml += `</div>`;
    document.getElementById('guide-content').innerHTML = contentHtml;
}

// タイマー機能（白蛍光色）
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

// 記録保存とローカルストレージ
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

// グラフ描画
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

window.onload = function() {
    updateChart();
};
