import '@/module/array';
import styles from '$/Chart/Share.module.scss';
import colors from '@/module/colors';
import { Div, Fix } from '@/module/ba';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import scss from '$/variables.module.scss';

const options = {
    spanGaps: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
        datalabels: {
            useHTML: true,
            color: '#fff',
            textAlign: 'center',
            font: {
                size: 16,
            },
            display: 'auto'
        },
        legend: false,
    }
}

const ShareDonut = ({ stockShare, stockMeta }) => {
    stockShare = stockShare?.data;
    if (!stockShare?.length) {
        return (
            <div style={{ textAlign: "center" }}>
                <div className={styles.wrap}>
                    <p>openDart에서 제공된<br />지분 데이터가 없습니다.</p>
                </div>
            </div>
        )
    }
    const amount = stockMeta?.a;
    let res = amount - stockShare.map(e => e.amount).sum();
    res = Math.max(0, res);
    // const shareData = share.map(e => e.amount);
    // shareData.push(res);
    const shareData = stockShare.map(e => Fix(e.amount / amount * 100, 1));
    shareData.push(Fix(res / amount * 100, 1));
    const labels = stockShare.map(e => e.name);
    labels.push('데이터없음');
    colors[shareData.length - 1] = scss.bgDark;

    options.plugins.datalabels.formatter = function (value, ctx) {
        const i = ctx?.dataIndex;
        const data = ctx?.chart?.data;
        const sum = data?.datasets[0].data?.sum();
        var label = data?.labels[i];
        return `${label}\n${Div(value, sum, 1)}`;
    };

    const data = {
        labels,
        datasets: [{
            data: shareData,
            backgroundColor: colors,
            borderWidth: 0
        }]
    }

    return (
        <div className={styles.wrap}>
            <Doughnut
                data={data}
                options={options}
                plugins={[ChartDataLabels]}
            />
        </div>
    )
}

export default ShareDonut;