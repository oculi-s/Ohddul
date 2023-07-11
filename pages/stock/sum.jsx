/**
 * 이걸로 Pagination을 연습하고 게시판에 적용
 */

import styles from '$/Stock/Sum.module.scss'
import Pagination from "#/base/Pagination";
import FavStar from "#/baseStock/FavStar";
import { Color, Num, Price } from "@/module/ba";
import { stock as dir } from "@/module/dir";
import json from "@/module/json";
import GroupImg from "@/public/group/Default";
import Link from "next/link";
import Help from '#/base/Help';

export async function getServerSideProps(ctx) {
    const Meta = json.read(dir.meta).data;
    const Hist = json.read(dir.hist);
    const Price = json.read(dir.all);
    const group = json.read(dir.group);

    const p = parseInt(ctx?.query?.p || 1);
    const N = 20;
    const T = Object.keys(Meta)?.length || 0;
    const keys = Object.keys(Meta)
        ?.filter(e => Meta[e]?.a && Price[e]?.c)
        ?.sort((b, a) =>
            Meta[a].a * Price[a].c - Meta[b].a * Price[b].c
        )
        ?.slice((p - 1) * N, p * N)
    const KeyMap = Object.fromEntries(keys.map(e => [e, 1]));
    const Filter = (data) => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) => KeyMap[k]))
    }
    const meta = Filter(Meta);
    const price = Filter(Price);
    const hist = Object.fromEntries(Object.keys(Hist)
        ?.filter(e => Meta[e]?.a && Hist[e]?.h)
        ?.sort((b, a) => Meta[a].a * Hist[a].h - Meta[b].a * Hist[b].h)
        ?.map((e, i) => [e, { h: Hist[e], i }])
        ?.filter(([k, v]) => KeyMap[k])
    )
    group.index = Filter(group.index);

    const props = { p, N, T, keys, meta, price, group, hist };
    return { props };
}

export default function Sum({ p, N, T, keys, meta, price, group, hist }) {
    const body = keys?.map((e, i) => {
        const gname = group?.index[e];
        const d = hist[e]?.i - (i + (p - 1) * N);
        return <tr key={i}>
            <th align='center'>{(p - 1) * N + i + 1}</th>
            <th className={styles.stockTh}>
                <FavStar code={e} />
                <Link href={`/stock/${meta[e]?.n}`}>{meta[e]?.n}{meta[e]?.t == 'Q' ? '*' : ''}</Link>

            </th>
            <td>{Price(meta[e]?.a * price[e]?.c)}</td>
            <td>
                {hist[e]?.i >= 0 ?
                    <>
                        {hist[e]?.i + 1}&nbsp;
                        {d ? <span className={Color(d)}>
                            (<span className={`fa fa-caret-${d > 0 ? 'up' : 'down'}`} />{Math.abs(d)})
                        </span> : '(-)'}
                    </>
                    : '-'}

            </td>
            <td>
                <Link href={`/group/${gname}`}>
                    <GroupImg name={gname} />
                </Link>
            </td>
        </tr>
    })
    const data = <table className={`${styles.stockSum} fixed`}>
        <colgroup>
            <col width={'10%'} />
            <col width={'40%'} />
            <col width={'15%'} />
            <col width={'15%'} />
            <col width={'20%'} />
        </colgroup>
        <thead>
            <tr>
                <th>#</th>
                <th>종목명</th>
                <th><span className='ph'>시총</span><span className='mh'>시가총액</span></th>
                <th>변화<Help span={<>
                    <p>1년전과 변화를 비교하며, 신규상장주는 "-"로 표시됩니다.</p>
                </>} /></th>
                <th>그룹</th>
            </tr>
        </thead>
        <tbody>{body}</tbody>
    </table>

    return <>
        <h2>시가총액 순위</h2>
        <p className='des'>* : 코스닥 종목</p>
        <Pagination {...{ p, N, T, data }} />
    </>
}