/*home*/

import { useState, FormEvent, useEffect} from "react"
import styles from "./home.module.css"
import { BsSearch } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"


export interface CoinProps{
  id: string,
  name: string,
  symbol:string,
  priceUsd: string,
  vwap24Hr: string,
  changePercent24Hr: string,
  rank: string,
  suppy:string,
  maxSupply: string,
  marketCapUsd: string,
  volumeUsd24Hr: string,
  explorer: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProp{
  data: CoinProps[]
}

export function Home() {
  const [input, setInput] = useState("")
  const [coins, setCoins] = useState<CoinProps[]>([])
  const [offset, setOffset] = useState(0)

  const navigate = useNavigate()

  useEffect(()=>{
    getData()
  },[offset])

  async function getData(){
    fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}`, {
      headers: {
        Authorization: 'Bearer 874f4f71335b8ba0f50bf1b40b492e6f002b270f5ba1c0a447f1bf111f9952fc'
      }
    })
      .then(response => response.json())
      .then((data: DataProp)=>{
        const coinsData =data.data;
        
        const price =Intl.NumberFormat("en-US",{
          style: "currency",
          currency: "USD"
        })

        const priceCompact =Intl.NumberFormat("en-US",{
          style: "currency",
          currency: "USD",
          notation: "compact"
        })

        const formatedResult = coinsData.map((item)=>{
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
          }
          return formated;
        })
       // console.log(formatedResult)

       const listaCoins = [...coins, ...formatedResult]
       setCoins(listaCoins)
      });
  }

  function handleSubmit(e: FormEvent){
    e.preventDefault()

    if(input==="") return;

    navigate(`/detail/${input}`)
  }

  function heandleGetMore(){
   if(offset===0){
    setOffset(10)
    return;
   }
   setOffset(offset + 10)
  }

    return (
      <>
      <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input 
        type="text"
        placeholder="Digite o nome da moeda... Ex bitcoin" value={input}
        onChange={(e)=> setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#fff"/>
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor de mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança em 24hs</th>
           
          </tr>
        </thead>
        <tbody id="tbody">
        {coins.length > 0 && coins.map((item)=>(
            <tr className={styles.tr} key={item.id}>

            <td className={styles.tdLabel} data-label="moeda">
            <div className={styles.name}>
              <img 
              className={styles.logo}
              src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`} 
              alt="logo Cripto" />
            <Link to={`/detail/${item.id}`}>
              <span>{item.name}</span> | {item.symbol}
              </Link>
            </div>
            </td>
            
            <td className={styles.tdLabel} data-label="valor de mercado">
            {item.formatedMarket}
            </td>
            
            
            <td className={styles.tdLabel} data-label="Preço">
             {item.formatedPrice}
            </td>
            
            <td className={styles.tdLabel} data-label="Volume">
              {item.formatedVolume}
            </td>
            
            <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança em 24hs">
              <span>{Number(item.changePercent24Hr).toFixed(2)}</span>
            </td>
            
          </tr>
        ))}  
        </tbody>
      </table>

      <button className={styles.buttonMore} onClick={heandleGetMore}>
        Carregar mais...
      </button>

      </main>
      </>
    )
  }
  