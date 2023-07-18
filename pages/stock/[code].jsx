import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '$/Stock/Stock.module.scss';
import { Num, Price, Color, Per, Div } from '@/module/ba';
import { bpsHelp, epsHelp, prHelp, roeHelp } from '#/stockData/HelpDescription';
import StockHead from '#/stockData/stockHead';
import { ToggleQuery } from '#/base/ToggleTab';
import { LastUpdate } from '#/base/base';
import Help from '#/base/Help';
import api from '../api';
import json from '@/module/json';
import dir from '@/module/dir';
import dt from '@/module/dt';
import '@/module/array';

import GroupFold from '#/stockFold/GroupFold';
import IndutyFold from '#/stockFold/IndutyFold';
import PriceElement from '#/stockData/stockPrice';
import EarnElement from '#/stockData/stockEarn';
import ShareElement from '#/stockData/stockShare';
import PredElement from '#/stockData/stockPred';

import { filterIndex } from '@/module/filter/filter';
import NameDict from '#/stockData/NameDict';

/**
 * user가 존재하는 경우이거나 user의 페이지인 경우 유저 데이터를 불러와야함.
 * 
 * 그런데 유저데이터는 동적으로 수정이 가능해야하니까 object에 담아 보내면서
 * useState를 통해 실시간 수정되는 내용이 반영되도록 해야함
 * pred도 마찬가지이고 수정필요. 2023.07.04
 * 
 * 로그인된 유저가 존재할 때 구현방식 : api/auth에 담아 보낸다.
 * useSession을 통해 사용 가능
 * {@link './pages/api/auth/[...nextauth].jsx'}
 */
/**
 * Filter를 통해 사이즈 줄이기
 * * 줄이기 전 405kb
 * * group : 405 --> 389 (-16kb)
 * * meta : 389 --> 262 (-127kb)
 * * induty : 262 --> 222 (-40kb)
 * * price : 222 --> 150 (-72kb)
 * * meta.index : 149 --> 87 (-62kb)
 */
export async function getServerSideProps(ctx) {
    const Meta = json.read(dir.stock.meta);
    let code = ctx.query?.code;
    if (!parseInt(code)) code = Meta.index[code] || false;
    const tab = ctx.query?.tab || 'price';

    let earn = { data: [] }, share = { data: [] };
    let props = { code, tab };
    const stockMeta = Meta?.data[code] || false;
    props = { ...props, stockMeta, earn, share };
    if (tab == 'earn') {
        earn = json.read(dir.stock.light.earn(code));
        props = { ...props, earn };
    } else if (tab == 'share') {
        share = json.read(dir.stock.share(code))
        share.data = share.data?.filter(e => e.amount);
        props = { ...props, share };
    } else if (tab == 'pred') {
        const pred = json.read(dir.stock.pred(code));
        props = { ...props, pred };
    }

    const Group = json.read(dir.stock.light.group);
    const Index = json.read(dir.stock.light.index).data;
    const Induty = json.read(dir.stock.dart.induty).data;

    const gname = Group?.index[code];
    const iname = Induty[code];
    const index = await filterIndex(Index, iname);
    const group = Group.data[gname] || false;

    const Filter = (data) => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) => {
                if (k == code) return 1;
                if (iname && Induty[k] == iname) return 1;
                if (gname && Group?.index[k] == gname) return 1;
                if (share.data?.find(e => Meta.data[k]?.n == (NameDict[e.name] || e.name)))
                    return 1;
                return 0;
            }))
    }
    const FilterIndex = data => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) => {
                if (v == code) return 1;
                if (iname && Induty[v] == iname) return 1;
                if (gname && Group?.index[v] == gname) return 1;
                if (share.data?.find(e => Meta.data[v]?.n == (NameDict[e.name] || e.name)))
                    return 1;
                return 0;
            }))
    }

    const meta = json.read(dir.stock.meta);
    const induty = Filter(Induty);
    meta.data = Filter(meta.data);
    meta.index = FilterIndex(meta.index);

    const Price = json.read(dir.stock.all);
    const price = Filter(Price);
    const predict = json.read(dir.stock.predAll);
    const ids = json.read(dir.user.ids);

    const title = Meta.data[code] ? `${Meta.data[code]?.n} : 오떨` : null;
    props = {
        ...props,
        title, ids,
        price, meta, group, index, induty,
        predict,
    };
    return { props };
}

/**
 * earnonPrice를 통해 bps와 eps가 들어가있음
 *  
*/
function MetaTable({
    stockMeta: meta, pred, last, earn = [],
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
                {EPS ? <tr>
                    <th>EPS<Help {...epsHelp} /></th>
                    <td>{Num(EPS)}&nbsp;
                        <span className={styles.percent}>
                            (<span className={Color(EPS - last?.c)}>
                                {Per(EPS, last?.c)}
                            </span>)
                        </span>
                    </td>
                </tr> : ''}
                {BPS ? <tr>
                    <th>BPS<Help {...bpsHelp} /></th>
                    <td>{Num(BPS)}&nbsp;
                        <span className={styles.percent}>
                            (<span className={Color(BPS - last?.c)}>
                                {Per(BPS, last?.c)}
                            </span>)
                        </span>
                    </td>
                </tr> : ''}
                {ROE ? <tr>
                    <th>ROE<Help {...roeHelp} /></th>
                    <td>{ROE}</td>
                </tr> : ''}
                {revenueSum && profitSum ? <tr>
                    <th>이익률<Help {...prHelp} /></th>
                    <td>{Div(profitSum, revenueSum)}</td>
                </tr> : ''}
                <tr><th>총 예측 수</th><td>{dataLen + queueLen}</td></tr>
                <tr><th>정답률</th><td>{Div(right, dataLen, 1)} ({right}/{dataLen})</td></tr>
            </tbody></table>
        </div>
    );
}

function Index(props) {
    const { meta, price, ban, code, stockMeta, earn, share, tab } = props;
    const router = useRouter();
    const nums = [20, 60, 120];

    const prices = {};
    const [userPred, setPred] = useState();
    const [stockPrice, setPrice] = useState({});
    const [loadUser, setLoadUser] = useState({ pred: true });
    const [loadStock, setLoadStock] = useState({ price: true });
    const uid = props?.session?.user?.uid;
    useEffect(() => {
        console.time('predBar');
        async function fetch() {
            if (uid && !userPred) {
                api.json.read({
                    url: dir.user.pred(uid),
                    def: { queue: [], data: [] }
                }).then(pred => {
                    setPred(pred);
                    setLoadUser({ pred: false });
                })
            } else {
                setLoadUser({ pred: false });
            }
            setLoadStock({ price: true });
            if (prices[code]) {
                setPrice(prices[code]);
                setLoadStock({ price: false });
            } else {
                await api.json.read({ url: dir.stock.light.price(code) })
                    .then(price => {
                        stockPrice.priceRaw = price;
                    })
                for await (let num of nums) {
                    await api.json.read({ url: dir.stock.chart.price(code, num) })
                        .then(price => {
                            stockPrice[num] = price;
                        })
                }
                prices[code] = stockPrice;
                setPrice(stockPrice);
                setLoadStock({ price: false });
            }
            console.timeEnd('predBar');
        }
        fetch();
    }, [code])


    const priceRaw = stockPrice?.priceRaw;
    if (!meta?.data) return;
    if (!stockMeta) {
        return <div>종목 정보가 없습니다.</div>;
    }
    const last = price[code];
    props = {
        ...props,
        uid,
        last, router, share: share.data, earn: earn.data, ban: ban[code],
        userPred, loadUser, setPred,
        stockPrice, loadStock,
    };

    const tabContents = {
        query: ['price', 'earn', 'share', 'pred'],
        names: ['가격변화', '실적추이', '지분정보', '예측모음'],
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
            <ToggleQuery {...tabContents} />
            {tab == 'price' ? <div>
                <PriceElement {...props} />
                <LastUpdate last={priceRaw?.last} />
            </div> : tab == 'earn' ? <div>
                <EarnElement {...props} />
                <LastUpdate last={earn.last} />
            </div> : tab == 'share' ? <div>
                <ShareElement {...props} />
                <LastUpdate last={share.last} />
            </div> : <div>
                <PredElement {...props} />
            </div>}
        </>
    );
}

export default Index;