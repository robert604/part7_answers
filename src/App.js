import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}



const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(async () => {
    try {
      const resp = await axios.get(`https://restcountries.com/v2/name/${name}?fullText=true`)
      const d = resp.data[0]
      const c = d ? {
        data:{
          capital:d.capital[0],
          name:d.name.common,
          population:d.population,
          flag:d.flags.svg
        },
        found:true
      } : {
        found:false
      }
      setCountry(c)
    } catch(error){
      setCountry(null)
    }

  },[name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
