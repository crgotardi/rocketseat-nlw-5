import { useEffect } from "react"
import { GetStaticProps } from "next"
import { format, parseISO } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import Image from "next/image"
import Link from "next/link"
import { api } from "../services/api"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"

import styles from "./home.module.scss"

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  description: string
  members: string,
  duration: string,
  durationAsString: string,
  publishedAt: string,
  url: string,
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  //SPA
  /*useEffect(() => {
    fetch('http://localhost:3333/episodes')
    .then(response => response.json())
    .then(data => console.log(data));
  })*/

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                />
                <div className={styles.episodeDetails}>
                  <Link href={'episode/' + episode.id}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>outros episódios</h2>
        
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(ep => {
              return (
                <tr key={ep.id}>
                  <td style={{width: 75}}>
                    <Image
                      width={120}
                      height={120}
                      src={ep.thumbnail}
                      alt={ep.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${ep.id}`}>
                      <a>{ep.title}</a>
                    </Link>
                  </td>
                  <td>{ep.members}</td>
                  <td style={{ width: 100 }}>{ep.publishedAt}</td>
                  <td>{ep.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

//SSR
/*export async function getServerSideProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    }
  }
}*/

//SSG
export const getStaticProps:GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      ...episode,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration))
    }
  })
  
  const latestEpisodes = episodes.slice(0 ,2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 24
  }
}