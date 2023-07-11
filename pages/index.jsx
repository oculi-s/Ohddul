import Market from '#/subIndex/MarketInfo';
import GroupInduty from '#/subIndex/GroupInduty'

import json from '@/module/json';
import dir from '@/module/dir';
import { getSession } from 'next-auth/react';
import MajorShare from '#/subIndex/MajorShare';

/**
 * 2023.07.04 데이터 380kb, treemap을 만드는 시간이 오래걸리므로 squrify된 데이터를 미리 저장할 것
 */
const N = 252;
export async function getServerSideProps(ctx) {
    const predict = json.read(dir.stock.predAll);
    const tree = json.read(dir.stock.light.tree);
    const count = json.read(dir.stock.light.updown);

    const market = json.read(dir.stock.light.market, { kospi: [], kosdaq: [] });
    market.kospi = market?.kospi?.slice(0, N);
    market.kosdaq = market?.kosdaq?.slice(0, N);
    const props = { tree, predict, market, count };
    return { props };
}

function Column() {
    return <>
        - 칼럼 500자 이상<br />
        - 최신칼럼 / 인기칼럼<br />
        - 랭커들의 칼럼만 보기<br />
        - 좋아요 / 댓글 / 공유<br />
    </>;
}

function Index(props) {
    return (
        <div>
            <Market {...props} />
            <GroupInduty {...props} />
            <MajorShare {...props} />
        </div>
    );
}

export default Index;