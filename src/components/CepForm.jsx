import { useState } from 'react';
import axios from 'axios';
{/* Estilização do formulario */}
import './CepForm.css'

const CepForm = () => {
  
  {/* Definição de constantes que mudam de estado CEP,ENDEREÇO e variavel de controle CONFIRMZIPCODE */}
  const [zipCode,setZipCode] = useState('')
  const [confirmZipCode,setConfirmZipCode] = useState(false)
  const [ address, setAddress] = useState({
            zipcode: '',
            street: '',
            city: '',
            state: '',
            district: ''
          })
    
    {/* função assicrona que procura o cep */}
    const searchZipCode = async (e) => {
      e.preventDefault();

      {/* Verificação do tamanho da entrada de dados */}
      if (zipCode.length !== 8 || ! /^\d{8}$/.test(zipCode)) {
      alert('Digite um CEP válido com 8 números');
      return;
    }

      {/* Fetch com a api Via Cep e tratamento de erros */}
      try {
        const res =  await axios.get( `https://viacep.com.br/ws/${zipCode}/json/`)
        const data = res.data;

        if(data.erro){
          alert('Cep não encontrado digite novamente!')
          return;
        }

        console.log(data)

        setAddress({
          zipcode: zipCode,
          street: data.logradouro,
          city: data.localidade,
          state: data.uf,
          district: data.bairro
      }) 
        setConfirmZipCode(true)
        
      } catch (error){
        console.error('Erro ao buscar o CEP:', error);
        alert('Erro na busca do CEP');
        setConfirmZipCode(false)
      }
      }

    {/* função que reseta as informações solicitadas anteriormente */}  
    function resetForm() {
      setZipCode('')
      setAddress({
            street: '',
            city: '',
            state: '',
            district: ''
      })
      setConfirmZipCode(false)
    }

  {/* Formulario HTML */}  
  return (
    <div className="form-card">
      <div className="form-card-head">
        <h2>Consulte seu CEP</h2>
      </div>
        <form  className='form-content'>
                {/* operação ternaria com a variavel de controle para exibição das variaveis restantes */}
                { !confirmZipCode ? (
                  <>
                  <label>Cep</label>
                  <input type="text" value={zipCode}
                    placeholder="Digite seu CEP"
                    onChange={(e) => setZipCode(e.target.value)}
                    maxLength={8}
                   />

                  <button type='submit'onClick={searchZipCode}>Consultar</button>
                  </>
                ):(
                  <>
                <label>Cep</label>
                <input type="text" value={zipCode} readOnly/>
                  
                <label>Rua</label>
                <input type="text" value={address.street} readOnly/>

                <label>Bairro</label>
                 <input type="text" value={address.district} readOnly/>

                <label>Cidade</label>
                <input type="text" value={address.city} readOnly/>

                <label>Estado</label>
                 <input type="text" value={address.state} readOnly/>

              {/*Botão que chama o reset e faz a nova consulta */}    
              <button type='submit'onClick={resetForm}> Nova Consulta</button>
              </>
                )}  
                </form>
    </div>
  )
}

export default CepForm