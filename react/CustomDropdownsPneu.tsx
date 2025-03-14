// react/CustomDropdownsPneu.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Dropdown } from 'vtex.store-components'; // Importante!


// --- Query GraphQL (MESMA de antes - ADAPTAR!) ---
const GET_DROPDOWN_OPTIONS = gql`
  query GetDropdownOptions($specificationGroupName: String!) {
    facets(specificationGroupName: $specificationGroupName) {
      specifications {
        name
        values
      }
    }
  }
`;

interface DropdownProps {
    blockClass?: string
}

const CustomDropdownsPneu: React.FC<DropdownProps> = ({ blockClass }) => {
  const [largura, setLargura] = useState('');
  const [perfil, setPerfil] = useState('');
  const [aro, setAro] = useState('');

  const [larguras, setLarguras] = useState<{name: string, values: string[]}[]>([]);
  const [perfis, setPerfis] = useState<{name: string, values: string[]}[]>([]);
  const [aros, setAros] = useState<{name: string, values: string[]}[]>([]);

  // --- Busca as opções de Largura (no carregamento do componente) ---
    const { loading: loadingLargura, error: errorLargura, data: dataLargura } = useQuery(
    GET_DROPDOWN_OPTIONS,
    {
      variables: { specificationGroupName: 'Largura' },
      onCompleted: (data) => {
          if(data?.facets?.specifications){
            setLarguras(data.facets.specifications)
          }
      }
    }
  );

  // --- Busca as opções de Perfil (quando a largura for selecionada) ---
    const { loading: loadingPerfil, error: errorPerfil, data: dataPerfil } = useQuery(
    GET_DROPDOWN_OPTIONS,
    {
      variables: { specificationGroupName: 'Perfil' },
      skip: !largura, // Só executa se a largura estiver selecionada
      onCompleted: (data) => {
        if(data?.facets?.specifications){
            setPerfis(data.facets.specifications)
          }
      }
    }
  );

  // --- Busca as opções de Aro (quando o perfil for selecionado) ---
    const { loading: loadingAro, error: errorAro, data: dataAro } = useQuery(
    GET_DROPDOWN_OPTIONS,
    {
      variables: { specificationGroupName: 'Aro' },
      skip: !perfil, // Só executa se o perfil for selecionado
       onCompleted: (data) => {
        if(data?.facets?.specifications){
            setAros(data.facets.specifications)
          }
      }
    }
  );

    const handleLarguraChange = (value: string) => { // Agora recebe diretamente o valor
    setLargura(value);
    setPerfil('');
    setAro('');
  };

  const handlePerfilChange = (value: string) => {
    setPerfil(value);
    setAro('');
  };

  const handleAroChange = (value: string) => {
    setAro(value);
  };

    if (loadingLargura || loadingPerfil || loadingAro) {
        return <div>Carregando...</div>;
    }

    if (errorLargura || errorPerfil || errorAro) {
        return <div>Erro ao carregar opções.</div>;
    }

  // --- Opções para os Dropdowns (precisam do formato correto) ---
    const larguraOptions = Array.isArray(larguras) ? (
        larguras.flatMap(item => item.values.map(value => ({
            value: value,
            label: value
        })))
    ) : (
        larguras.values ? larguras.values.map(value => ({ value: value, label: value })) : []
    );

    const perfilOptions = Array.isArray(perfis) ? (
        perfis.flatMap(item => item.values.map(value => ({
            value: value,
            label: value
        })))
    ) : (
        perfis.values ? perfis.values.map(value => ({ value: value, label: value })) : []
    );

    const aroOptions = Array.isArray(aros) ? (
        aros.flatMap(item => item.values.map(value => ({
            value: value,
            label: value
        })))
    ) : (
        aros.values ? aros.values.map(value => ({ value: value, label: value })) : []
    );
  return (
    <div className={blockClass}>
      <div>
        <label htmlFor="largura">Largura:</label>
        <Dropdown
          id="largura"
          options={larguraOptions}
          value={largura}
          onChange={handleLarguraChange}
          disabled={larguraOptions.length === 0}
        />
      </div>

      <div>
        <label htmlFor="perfil">Perfil:</label>
        <Dropdown
          id="perfil"
          options={perfilOptions}
          value={perfil}
          onChange={handlePerfilChange}
          disabled={!largura || perfilOptions.length === 0}
        />
      </div>

      <div>
        <label htmlFor="aro">Aro:</label>
        <Dropdown
          id="aro"
          options={aroOptions}
          value={aro}
          onChange={handleAroChange}
          disabled={!perfil || aroOptions.length === 0}
        />
      </div>
    </div>
  );
};

export default CustomDropdownsPneu;