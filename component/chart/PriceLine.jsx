import { useEffect, useState } from "react"
import { Chart } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import Annotation from "chartjs-plugin-annotation";
import merge from 'deepmerge';
import styles from '$/Chart/Price.module.scss';
import dt from "@/module/dt";
import { Line } from "react-chartjs-2";
import colors from "@/module/colors";
import scss from '$/variables.module.scss';
import { maxPoint, minPoint } from "@/module/chart/annotations";
import { CheckBox, RadioSelect } from "#/base/InputSelector";
import { hairline } from "@/module/chart/plugins";
import { parseFix } from "@/module/ba";
import { Loading } from "#/base/base";
import '@/module/array'
Chart.register(Annotation);

/**
 * tooltip custom 하는 방법
 * 
 * interaction : hover에서 
 */
const defaultOptions = {
    plugins: {
        legend: { display: false },
        annotation: {
            drawTime: 'afterDatasetsDraw',
        },
    },
    animation: {
        x: { duration: 0 },
        duration: 100
    },
    interaction: { intersect: false, mode: 'index', },
    spanGaps: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: "time",
            time: {
                tooltipFormat: "yyyy-MM-dd"

            }
        }, y: {}
    }
}

const plugins = [hairline, Annotation];

/**
 * 주의할 부분
 * 
 * priceRaw를 slice할 때 i+1-num 부터 i+1까지 해야함
 * 이유는 start부터 end-1까지 데이터를 구하기 때문
 */
async function getData({
    price, isEarn, num, isMinMax, percentMa
}) {
    const dates = price?.map(e => e.d);
    const priceRaw = price?.map(e => e.c);
    const priceAvg = dates?.map((e, i) => Math.avg(priceRaw?.slice(i + 1 - num, i + 1)));
    const priceTop = dates?.map((e, i) => Math.std(priceRaw?.slice(i + 1 - num, i + 1), 2))
    const priceBot = dates?.map((e, i) => Math.std(priceRaw?.slice(i + 1 - num, i + 1), -2))

    var props = { dates, priceRaw, priceAvg, priceTop, priceBot };
    var ymin = 2e9, ymax = -1;

    if (percentMa) {
        const priceMa = dates?.map((e, i) => {
            // if (!priceTop[i]) return 50;
            // if (!priceBot[i]) return 50;
            return (priceRaw[i] - priceBot[i]) / (priceTop[i] - priceBot[i]) * 100;
        })
        props = { ...props, priceMa };
    }

    // 앞뒤 종가가 있을 때만 데이터 수정
    priceRaw?.forEach((e, i) => {
        if (!e) {
            if (priceRaw[i - 1] && priceRaw[i + 1]) {
                priceRaw[i] = priceRaw[i - 1];
            }
        }
    })
    if (isMinMax) {
        var mini = 0, maxi = 0, min = 2e9, max = -1;
        priceRaw?.forEach((e, i) => {
            if (e && e < min) mini = i, min = e;
            if (e && e > max) maxi = i, max = e;
        })
        ymin = min, ymax = max;
        props = { ...props, mini, maxi, min, max };
    }

    if (isEarn) {
        const stockEps = price?.map(e => {
            const v = e?.eps
            if (v && v < ymin) ymin = v;
            if (v && v > ymax) ymax = v;
            return v;
        });
        const stockBps = price?.map(e => {
            const v = e?.bps
            if (v && v < ymin) ymin = v;
            if (v && v > ymax) ymax = v;
            return v;
        });
        props = { ...props, stockEps, stockBps };
    }
    return { ...props, ymin, ymax };
}

/**
 * 계산된 차트 데이터를 정제하여 차트에 입힐 수 있도록 만드는 함수
 * 
 * 이평을 계산할 때 num보다 작은 데이터에서 이평 계산이 안되어 잘리는 걸 같이 잘라주었다가
 * 6개월 데이터 120이평에서 데이터가 너무 표시가 안돼서 slice를 2023.06.30 폐기
 */
async function refineData({
    prices, num, isEarn, isBollinger, isMinMax, percentMa, from
}) {
    let mainData = [], date, options = {};
    let subData = [];
    const k = prices?.length;
    for await (let i of Array(k).keys()) {
        const price = prices[i];
        const last = price?.find(() => true);
        const {
            dates,
            priceRaw, priceAvg,
            priceTop, priceBot,
            stockEps, stockBps,
            priceMa,
            min, mini, max, maxi,
            ymin, ymax,
        } = await getData({
            price,
            isEarn, isBollinger,
            num, isMinMax, percentMa
        });
        date = dates//?.slice(num);
        mainData = [...mainData, {
            data: priceRaw,//?.slice(num),
            label: '종가',
            borderColor: 'gray',
            borderWidth: 1,
            pointRadius: 0
        }, {
            data: priceAvg,//?.slice(num),
            label: `${num}일 이평`,
            fill: false,
            borderColor: colors[i],
            backgroundColor: colors[i],
            borderWidth: 1.5,
            pointRadius: 0
        }];
        if (isEarn) {
            const def = { borderWidth: 2, pointRadius: 0 }
            mainData = [...mainData, {
                data: stockEps,//?.slice(num),
                label: "EPS",
                borderColor: scss?.red,
                backgroundColor: scss?.red,
                ...def
            }, {
                data: stockBps,//?.slice(num),
                label: "BPS",
                borderColor: scss?.blue,
                backgroundColor: scss?.blue,
                ...def
            }];
        }
        if (isBollinger) {
            const def = { borderWidth: 1, pointRadius: 0 }
            mainData = [...mainData, {
                data: priceTop,//?.slice(num),
                label: "BB상단",
                borderColor: scss?.red,
                backgroundColor: scss?.red,
                ...def
            }, {
                data: priceBot,//?.slice(num),
                label: "BB하단",
                borderColor: scss?.blue,
                backgroundColor: scss?.blue,
                ...def
            }]
        }
        if (isMinMax) {
            options.plugins = {
                annotation: {
                    annotations: [
                        {
                            type: 'line',
                            yMin: max, yMax: max,
                            borderColor: scss?.redDark,
                            borderWidth: .5,
                        }, {
                            type: 'line',
                            yMin: min, yMax: min,
                            borderColor: scss?.blueDark,
                            borderWidth: .5,
                        },
                        maxPoint({ i: maxi, d: dates[maxi], max, last: last?.c, len: price?.length }),
                        minPoint({ i: mini, d: dates[mini], min, last: last?.c, len: price?.length }),
                    ]
                }
            }
            options.scales = {
                x: { min: dt.num() - from },
                y: {
                    min: ymin > 0 ? ymin * 0.8 : ymin * 1.2,
                    max: ymax * 1.1
                }
            };
        }
        if (percentMa) {
            subData = [{
                data: priceMa,
                label: '%B',
                borderColor: scss?.bgBrighter,
                backgroundColor: scss?.bgBrighter,
                borderWidth: 1, pointRadius: 0
            }]
        }
    }
    return [
        { labels: date, datasets: mainData },
        { labels: date, datasets: subData },
        options
    ];
}

function ButtonGroup({
    isBollinger, setBollinger,
    isEarn, setEarn,
    isMinMax, setMinMax,
    from, setFrom, num, setNum,
    bollingerBtn, timeBtn,
    view, setView,
}) {
    if (!timeBtn && !bollingerBtn) return;
    return <>
        <div className={`${styles.navWrap} ${view ? styles.view : ''}`}>
            <div className={`${styles.nav}`}>
                {(timeBtn || bollingerBtn) &&
                    <>
                        <div className={styles.checkGroup}>
                            <p><CheckBox
                                name={'BB추가'}
                                onChange={setBollinger}
                                defaultChecked={isBollinger}
                            /></p>
                            <p><CheckBox
                                name={'실적차트'}
                                onChange={setEarn}
                                defaultChecked={isEarn}
                            /></p>
                        </div>
                        <div className={styles.checkGroup}>
                            <p><CheckBox
                                name={'최대최소'}
                                onChange={setMinMax}
                                defaultChecked={isMinMax}
                            /></p>
                        </div>
                    </>
                }
                {timeBtn && <RadioSelect
                    title={'기간'}
                    names={['6M', '1Y', '5Y']}
                    values={[dt.YEAR / 2, dt.YEAR, dt.YEAR * 5]}
                    onChange={setFrom}
                    defaultValue={from}
                />}
                {bollingerBtn && <RadioSelect
                    title={'이평'}
                    names={['20', '60', '120']}
                    values={[20, 60, 120]}
                    onChange={setNum}
                    defaultValue={num}
                />}
            </div>
            <button
                onClick={() => setView(e => !e)}
                className={`fa fa-chevron-down ${styles.toggleBtn} ${view ? styles.view : ''}`}
            />
        </div>
    </>
}

function PriceLine({
    prices = [{}], load,
    addEarn = true, addBollinger = false, minMax = true,
    N = 60, L = dt.YEAR * 5,
    percentMa = true,
    bollingerBtn = true, timeBtn = true,
    x = false, y = false,
}) {
    defaultOptions.scales.x.display = x;
    defaultOptions.scales.y.display = y;

    const [num, setNum] = useState(N);
    const [from, setFrom] = useState(L);
    const [isEarn, setEarn] = useState(addEarn);
    const [isMinMax, setMinMax] = useState(minMax);
    const [isBollinger, setBollinger] = useState(addBollinger);
    const [options, setOptions] = useState(defaultOptions);
    const Prices = prices.map(price => price
        ?.qsort(dt.lsort));

    const [view, setView] = useState(false);
    const [data, setData] = useState({ labels: [], datasets: [] });
    const [subData, setSubData] = useState({ labels: [], datasets: [] });
    useEffect(() => {
        setView(false);
    }, [prices])
    // 20, 60, 120을 async로 미리 만들어 놓고, 그때그때 minmax만 따로 구해줘야함
    useEffect(() => {
        if (!load?.price) {
            console.time('price');
            refineData({
                prices: Prices, num, isEarn, isBollinger, isMinMax, percentMa, from
            }).then(([data, sub, option]) => {
                setData(data);
                setSubData(sub);
                setOptions(merge(defaultOptions, option))
                console.timeEnd('price');
            })
        }
    }, [load?.price, isEarn, isBollinger, isMinMax, num, from])

    const props = {
        isBollinger, setBollinger,
        isEarn, setEarn,
        isMinMax, setMinMax,
        from, setFrom, num, setNum,
        bollingerBtn, timeBtn,
        view, setView
    }


    const suboption = {
        scales: {
            x: { min: dt.num() - from },
            y: { min: -20, max: 120, display: true }
        },
        plugins: {
            annotation: {
                annotations: [{
                    type: 'line',
                    yMin: 50, yMax: 50,
                    borderColor: scss.bgBrighter,
                    borderWidth: 1,
                }, {
                    type: 'box',
                    yMin: 0, yMax: 100,
                    borderColor: scss.bgBrighter,
                    backgroundColor: scss.bgOpacity,
                    borderDash: [5, 5],
                    borderWidth: 1,
                }]
            },
            tooltip: {
                callbacks: {
                    label: function (ctx) {
                        return `${ctx?.dataset?.label} ${parseFix(ctx?.raw)}%`;
                    },
                }
            }
        }
    }
    return (<>
        <div className={`${styles.wrap} ${percentMa && styles.withSub}`}>
            <ButtonGroup {...props} />
            <div className={styles.chart}>
                {load?.price
                    ? <Loading left={"auto"} right={"auto"} />
                    : <Line
                        options={options}
                        plugins={plugins}
                        data={data}
                    />}
            </div>
            {percentMa &&
                <div className={`${styles.chart} ${styles.sub}`}>
                    {load?.price
                        ? <Loading left={"auto"} right={"auto"} />
                        : <Line
                            plugins={plugins}
                            data={subData}
                            options={merge(defaultOptions, suboption)}
                        />}
                </div>
            }
        </div >
    </>)
}

export default PriceLine;