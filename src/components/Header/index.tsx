import styles from './styles.module.scss';
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link';

export function Header() {
  const date = format (new Date(), 'EEEEEE, d, MMMM', {locale: ptBR})
  
  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <img src="/logo.svg" alt="Podcastr"/>
      </Link>
      <p>O melhor para você ouvir, sempre</p>
      <span>{date}</span>
    </header>
  )
}