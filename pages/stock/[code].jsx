import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '$/Stock/Stock.module.scss';
import { Num, Price, Color, Per, Div } from '@/module/ba';
import { bpsHelp, epsHelp, prHelp, roeHelp } from '#/stockData/HelpDescription';
import StockHead from '#/stockData/stockHead';
import ToggleTab from '#/base/ToggleTab';
import { LastUpdate } from '#/base/base';
import Help from '#/base/Help';
import api from '../api';
import dir from '@/module/dir';
import dt from '@/module/dt';
import '@/module/array';

import GroupFold from '#/stockFold/GroupFold';
import IndutyFold from '#/stockFold/IndutyFold';
import PriceElement from '#/stockData/stockPrice';
import EarnElement from '#/stockData/stockEarn';
import ShareElement from '#/stockData/stockShare';
import PredElement from '#/stockData/stockPred';

/**
 * earnonPrice를 통해 bps와 eps가 들어가있음
 *  
*/
function MetaTable({
    stockMeta: meta, stockPred: pred, last, earn = [],
}) {
    earn?.qsort(dt.lsort);

    const amount = meta?.a;
    const total = amount * last?.c;
    const EPS = (last?.eps || 0);
    const BPS = (last?.bps || 0);
    const ROE = Div(earn?.slice(0, 4)?.map(e => e?.profit).sum(), earn[0]?.equity);
    const revenueSum = Object.values(earn)?.map(e => e?.revenue)?.sum();
    const profitSum = Object.values(earn)?.map(e => e?.profit)?.sum();

    const dataLen = pred?.data?.length || 0;
    const queueLen = pred?.queue?.length || 0;
    const right = pred?.data?.filter(e => e.v >= 0).length || 0;

    return (
        <div className={`${styles.meta} clear`}>
            <table><tbody>
                <tr><th>시가총액</th><td>{Price(total)}</td></tr>
                <tr>
                    <th>최근종가</th><td>{Num(last?.c)}&nbsp;
                        <span className={styles.percent}>
                            (<span className={Color(last?.c - last?.p)}>
                                {Per(last?.c, last?.p)}
                            </span>)
                        </span>
                    </td>
                </tr>
                {EPS && <tr>
                    <th>EPS<Help {...epsHelp} /></th>
                    <td>{Num(EPS)}&nbsp;
                        <span className={styles.percent}>
                            (<span className={Color(EPS - last?.c)}>
                                {Per(EPS, last?.c)}
                            </span>)
                        </span>
                    </td>
                </tr> || ''}
                {BPS && <tr>
                    <th>BPS<Help {...bpsHelp} /></th>
                    <td>{Num(BPS)}&nbsp;
                        <span className={styles.percent}>
                            (<span className={Color(BPS - last?.c)}>
                                {Per(BPS, last?.c)}
                            </span>)
                        </span>
                    </td>
                </tr> || ''}
                {ROE && <tr>
                    <th>ROE<Help {...roeHelp} /></th>
                    <td>{ROE}</td>
                </tr> || ''}
                {revenueSum && profitSum && <tr>
                    <th>이익률<Help {...prHelp} /></th>
                    <td>{Div(profitSum, revenueSum)}</td>
                </tr> || ''}
                <tr><th>총 예측 수</th><td>{dataLen + queueLen}</td></tr>
                <tr><th>정답률</th><td>{Div(right, dataLen, 1)} ({right}/{dataLen})</td></tr>
            </tbody></table>
        </div>
    );
}

function Index(props) {
    const { meta, price, ban, code, stockMeta, earn, share } = props;
    const router = useRouter();

    const prices = {};
    const [userPred, setPred] = useState();
    const [stockPrice, setPrice] = useState();
    const [loadUser, setLoadUser] = useState({ pred: true });
    const [loadStock, setLoadStock] = useState({ price: true });
    const uid = props?.session?.user?.uid;
    useEffect(() => {
        console.log('predBar 렌더링중');
        async function fetch() {
            if (uid && !userPred) {
                api.json.read({
                    url: dir.user.pred(uid),
                    def: { queue: [], data: [] }
                }).then(pred => {
                    setPred(pred);
                    setLoadUser(e => { e.pred = false; return e });
                })
            }
            setLoadStock({ price: true });
            if (prices[code]) {
                setPrice(prices[code]);
                setLoadStock({ price: false });
            } else {
                api.json.read({ url: dir.stock.light.price(code) }).then(price => {
                    setPrice(price);
                    prices[code] = price;
                    setLoadStock({ price: false });
                })
            }
        }
        fetch();
    }, [code])


    if (!meta?.data) return;
    if (!stockMeta) {
        return <div>종목 정보가 없습니다.</div>;
    }
    stockPrice?.data?.qsort(dt.lsort);
    const last = price[code];
    props = {
        ...props,
        last, router, share: share.data, earn: earn.data, ban: ban[code],
        userPred, loadUser, setPred,
        stockPrice, loadStock,
    };

    const tabContents = {
        names: ['가격변화', '실적추이', '지분정보', '예측모음'],
        datas: [
            <div key={0}>
                <PriceElement {...props} />
                <LastUpdate last={stockPrice?.last} />
            </div>,
            <div key={1}>
                <EarnElement {...props} />
                <LastUpdate last={earn.last} />
            </div>,
            <div key={2}>
                <ShareElement {...props} />
                <LastUpdate last={share.last} />
            </div>,
            <div key={3}>
                <PredElement {...props} />
            </div>
        ]
    };
    if (ban[code]) tabContents.names.pop()
    return (
        <>
            <StockHead {...props} />
            <hr />
            <GroupFold {...props} />
            <IndutyFold {...props} />
            <MetaTable {...props} />
            <hr />
            <ToggleTab {...tabContents} />
        </>
    );
}

import { getServerSideProps } from "@/container/stock";
export { getServerSideProps };
export default Index;