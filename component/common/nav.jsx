import styles from '@/styles/Nav.module.scss'
import Link from 'next/link';

export default function Nav({ mobAside, setAsideShow }) {
    return (
        <nav className={styles.nav}>
            <div className={styles.buttonList}>
                <Link href="/" className={styles.button}>Home</Link>
                <Link href="/rank" className={styles.button}>랭킹</Link>
                <Link href="/help" className={styles.button}>도움말</Link>
                <Link href="/idea" className={styles.button}>의견게시판</Link>
                {/* <Button href="/community">커뮤니티</Button> */}
            </div>
            <button
                className={`${styles.menuOpen} fa fa-bars`}
                onClick={e => { setAsideShow(!mobAside) }}
            >
            </button>
        </nav >
    )
}