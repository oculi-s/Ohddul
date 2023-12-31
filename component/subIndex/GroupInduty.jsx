import styles from '$/Index.module.scss';
import TotalGroupTree from '#/chart/TotalGroupTreeMap';
import TotalIndutyTree from '#/chart/TotalIndutyTreeMap';
import { ToggleTab } from '#/base/ToggleTab';
import Link from 'next/link';

export default function GroupInduty(props) {
    return <article className={`${styles.area} ${styles.groupArea}`}>
        <h3><Link href={'/stock/sum'}>오늘의 시가총액 <span className='fa fa-chevron-right'></span></Link></h3>
        <ToggleTab
            names={['그룹', '업종']}
            datas={[
                <div key={1} className={styles.chart}>
                    <TotalGroupTree {...props} />
                </div>,
                <div key={2} className={styles.chart}>
                    <TotalIndutyTree {...props} />
                </div>
            ]}
        />
        <p className='des'>클릭하시면 종목/전체가 전환됩니다.</p>
    </article>
}
