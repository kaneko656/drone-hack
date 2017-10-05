
// PI制御ゲイン
let gain_p = 0.5 // 比例ｹﾞｲﾝ 5.0
let gain_i = 0.2 // 積分ｹﾞｲﾝ 1.0
// 運動モデル
let k_pos = 1.0 // バネ力
let k_vel = 2.0 // ダンピング
let mass = 1.0 // 質量
let intervalTime = 0.1 // 時間ｽﾃｯﾌ

//PI制御
let PIctrl = exports.get = (targetPosition, position, interval) => {
    let diffIntegral = 0
    interval = interval || intervalTime

    // 誤差
    let diff = targetPosition- position

    // 誤差積分
    diffIntegral += diff * interval

    // 制御入力
    let dRet = gain_p * diff + gain_i * diffIntegral

    return (dRet)
}
//ここまで

// 検証用プログラム
let main = () => {
    let dF, dFctrl;
    let dAcc, dVel, dPos, dTime;
    let i;

    // 初期値
    dVel = 0; // 速度
    dPos = 0; // 位置
    dTime = 0; // 時刻

    for (i = 0; i < 500; i++) {
        // コントローラ
        dFctrl = PIctrl(10, dPos)

        // 外力
        dF = dFctrl - (k_pos * dPos + k_vel * dVel)

        // 加速度
        dAcc = dF / mass

        // 速度
        dVel += dAcc * intervalTime

        // 位置
        dPos += dVel * intervalTime

        // 時刻
        dTime += intervalTime

        console.log('time', dTime, 'pos', dPos)
    }
}
