
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [formAberto, setFormAberto] = useState(false)
  const [detalhesAberto, setDetalhesAberto] = useState(false)
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null)
  const [statusEditado, setStatusEditado] = useState('')

  const [solicitacoes, setSolicitacoes] = useState(() => {
    try {
      const dadosSalvos = localStorage.getItem('solicitacoesInatel')
      return dadosSalvos ? JSON.parse(dadosSalvos) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(
      'solicitacoesInatel',
      JSON.stringify(solicitacoes)
    )
  }, [solicitacoes])

  const [categoria, setCategoria] = useState('')
  const [assunto, setAssunto] = useState('')
  const [descricao, setDescricao] = useState('')

  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('Todas')

  const totalAnalise = solicitacoes.filter(
    (solicitacao) => solicitacao.status === 'Em análise'
  ).length

  const totalAndamento = solicitacoes.filter(
    (solicitacao) => solicitacao.status === 'Em andamento'
  ).length

  const totalConcluidas = solicitacoes.filter(
    (solicitacao) => solicitacao.status === 'Concluída'
  ).length

  const textoRegistros =
    solicitacoes.length === 1
      ? '1 registro'
      : `${solicitacoes.length} registros`

  const solicitacoesFiltradas = solicitacoes.filter((solicitacao) => {
    const termoBusca = busca.toLowerCase().trim()

    const correspondeBusca =
      solicitacao.assunto.toLowerCase().includes(termoBusca) ||
      solicitacao.protocolo.toLowerCase().includes(termoBusca)

    const correspondeStatus =
      filtroStatus === 'Todas' ||
      solicitacao.status === filtroStatus

    return correspondeBusca && correspondeStatus
  })

  function abrirFormulario() {
    setFormAberto(true)
  }

  function fecharFormulario() {
    setFormAberto(false)
    setCategoria('')
    setAssunto('')
    setDescricao('')
  }

  function enviarSolicitacao(event) {
    event.preventDefault()

    const novaSolicitacao = {
      protocolo: 'SOL-' + String(Date.now()).slice(-6),
      categoria: categoria,
      assunto: assunto,
      descricao: descricao,
      status: 'Em análise',
      data: new Date().toLocaleDateString('pt-BR')
    }

    setSolicitacoes([novaSolicitacao, ...solicitacoes])
    fecharFormulario()
  }

  function abrirDetalhes(solicitacao) {
    setSolicitacaoSelecionada(solicitacao)
    setStatusEditado(solicitacao.status)
    setDetalhesAberto(true)
  }

  function fecharDetalhes() {
    setDetalhesAberto(false)
    setSolicitacaoSelecionada(null)
    setStatusEditado('')
  }

  function salvarStatus() {
    if (!solicitacaoSelecionada || !statusEditado) return

    const solicitacaoAtualizada = {
      ...solicitacaoSelecionada,
      status: statusEditado
    }

    setSolicitacoes((listaAtual) =>
      listaAtual.map((solicitacao) =>
        solicitacao.protocolo === solicitacaoSelecionada.protocolo
          ? solicitacaoAtualizada
          : solicitacao
      )
    )

    setSolicitacaoSelecionada(solicitacaoAtualizada)
  }

  function excluirSolicitacao() {
    if (!solicitacaoSelecionada) return

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a solicitação ${solicitacaoSelecionada.protocolo}?`
    )

    if (!confirmar) return

    setSolicitacoes((listaAtual) =>
      listaAtual.filter(
        (solicitacao) =>
          solicitacao.protocolo !== solicitacaoSelecionada.protocolo
      )
    )

    fecharDetalhes()
  }

  function classeStatus(status) {
    if (status === 'Em análise') return 'status-analysis'
    if (status === 'Em andamento') return 'status-progress'
    return 'status-complete'
  }

  return (
    <div className="app-shell">

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">I</div>

          <div className="brand-info">
            <strong>INATEL</strong>
            <span>Área do estudante</span>
          </div>
        </div>

        <div className="header-title">
          CENTRAL DE SOLICITAÇÕES
        </div>

        <div className="user-avatar">BM</div>
      </header>

      <main className="main-content">

        <section className="welcome-section">
          <div>
            <span className="eyebrow">SUPORTE ESTUDANTIL</span>

            <h1>Olá! Como podemos ajudar?</h1>

            <p>
              Acesse seus atendimentos ou abra uma nova
              solicitação para nossa equipe.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={abrirFormulario}
          >
            + Nova solicitação
          </button>
        </section>

        <section className="shortcut-grid">

          <button
            className="shortcut-card"
            onClick={abrirFormulario}
          >
            <div className="shortcut-icon">+</div>

            <div>
              <h3>Nova solicitação</h3>
              <p>Registre um novo atendimento.</p>
            </div>
          </button>

          <button
            className="shortcut-card"
            onClick={() => document.getElementById('lista-solicitacoes').scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="shortcut-icon">≡</div>

            <div>
              <h3>Minhas solicitações</h3>
              <p>Acompanhe seus protocolos.</p>
            </div>
          </button>

          <button
            className="shortcut-card"
            onClick={() => alert('Central de ajuda: entre em contato com o setor responsável do Inatel para obter orientações.')}
          >
            <div className="shortcut-icon">?</div>

            <div>
              <h3>Central de ajuda</h3>
              <p>Encontre orientações e informações.</p>
            </div>
          </button>

        </section>

        <section className="content-panel" id="lista-solicitacoes">

          <div className="panel-heading">
            <div>
              <h2>Minhas solicitações</h2>
              <p>Consulte o andamento dos seus atendimentos.</p>
            </div>

            <span className="panel-link">
              {textoRegistros}
            </span>
          </div>

          {solicitacoes.length > 0 && (

            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
                marginTop: '22px',
                marginBottom: '22px'
              }}>

                <div style={{
                  background: '#252832',
                  border: '1px solid #363d49',
                  borderRadius: '10px',
                  padding: '16px'
                }}>
                  <p style={{ color: '#a7adb8', fontSize: '12px' }}>
                    Em análise
                  </p>
                  <strong style={{
                    display: 'block',
                    color: '#69a7ff',
                    fontSize: '25px',
                    marginTop: '5px'
                  }}>
                    {totalAnalise}
                  </strong>
                </div>

                <div style={{
                  background: '#252832',
                  border: '1px solid #363d49',
                  borderRadius: '10px',
                  padding: '16px'
                }}>
                  <p style={{ color: '#a7adb8', fontSize: '12px' }}>
                    Em andamento
                  </p>
                  <strong style={{
                    display: 'block',
                    color: '#f0bd63',
                    fontSize: '25px',
                    marginTop: '5px'
                  }}>
                    {totalAndamento}
                  </strong>
                </div>

                <div style={{
                  background: '#252832',
                  border: '1px solid #363d49',
                  borderRadius: '10px',
                  padding: '16px'
                }}>
                  <p style={{ color: '#a7adb8', fontSize: '12px' }}>
                    Concluídas
                  </p>
                  <strong style={{
                    display: 'block',
                    color: '#68d6a0',
                    fontSize: '25px',
                    marginTop: '5px'
                  }}>
                    {totalConcluidas}
                  </strong>
                </div>

              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '22px'
              }}>

                <input
                  type="search"
                  placeholder="Pesquisar por assunto ou protocolo..."
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  style={{
                    flex: '1',
                    minWidth: '220px',
                    padding: '13px 15px',
                    background: '#11151c',
                    border: '1px solid #363d49',
                    borderRadius: '8px',
                    color: '#f1f3f6',
                    outline: 'none'
                  }}
                />

                <select
                  value={filtroStatus}
                  onChange={(event) => setFiltroStatus(event.target.value)}
                  style={{
                    minWidth: '180px',
                    padding: '13px 15px',
                    background: '#11151c',
                    border: '1px solid #363d49',
                    borderRadius: '8px',
                    color: '#f1f3f6',
                    outline: 'none'
                  }}
                >
                  <option value="Todas">Todos os status</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluída">Concluídas</option>
                </select>

              </div>
            </>

          )}

          {solicitacoes.length === 0 ? (

            <div className="empty-state">
              <div className="empty-icon">▤</div>

              <h3>Nenhuma solicitação por aqui</h3>

              <p>
                Quando você abrir um atendimento,
                ele aparecerá nesta área.
              </p>
            </div>

          ) : solicitacoesFiltradas.length === 0 ? (

            <div className="empty-state">
              <div className="empty-icon">⌕</div>

              <h3>Nenhuma solicitação encontrada</h3>

              <p>
                Tente mudar a pesquisa ou selecionar outro status.
              </p>

              <button
                className="cancel-button"
                style={{ marginTop: '15px' }}
                onClick={() => {
                  setBusca('')
                  setFiltroStatus('Todas')
                }}
              >
                Limpar filtros
              </button>
            </div>

          ) : (

            <div className="request-list">

              {solicitacoesFiltradas.map((solicitacao) => (

                <div
                  className="request-card"
                  key={solicitacao.protocolo}
                  onClick={() => abrirDetalhes(solicitacao)}
                  role="button"
                  tabIndex={0}
                  title="Clique para visualizar os detalhes"
                  style={{ cursor: 'pointer' }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      abrirDetalhes(solicitacao)
                    }
                  }}
                >

                  <div className="request-info">
                    <span className="request-protocol">
                      {solicitacao.protocolo}
                    </span>

                    <h3>{solicitacao.assunto}</h3>

                    <p>
                      {solicitacao.categoria} • {solicitacao.data}
                    </p>
                  </div>

                  <span className={`request-status ${classeStatus(solicitacao.status)}`}>
                    {solicitacao.status}
                  </span>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* Formulário de nova solicitação */}

      {formAberto && (

        <div className="modal-overlay">

          <div className="request-modal">

            <div className="modal-heading">
              <div>
                <span className="eyebrow">SUPORTE ESTUDANTIL</span>
                <h2>Nova solicitação</h2>
                <p>Preencha os dados para abrir um atendimento.</p>
              </div>

              <button
                className="close-button"
                onClick={fecharFormulario}
                type="button"
              >
                ×
              </button>
            </div>

            <form onSubmit={enviarSolicitacao}>

              <label htmlFor="categoria">
                Categoria do atendimento
              </label>

              <select
                id="categoria"
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="Acadêmico">Acadêmico</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Outros">Outros</option>
              </select>

              <label htmlFor="assunto">
                Assunto
              </label>

              <input
                id="assunto"
                type="text"
                placeholder="Ex.: Dúvida sobre matrícula"
                value={assunto}
                onChange={(event) => setAssunto(event.target.value)}
                required
              />

              <label htmlFor="descricao">
                Descrição da solicitação
              </label>

              <textarea
                id="descricao"
                placeholder="Descreva sua solicitação com detalhes..."
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
                rows="5"
                required
              />

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={fecharFormulario}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="submit-request-button"
                >
                  Enviar solicitação
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Detalhes da solicitação */}

      {detalhesAberto && solicitacaoSelecionada && (

        <div className="modal-overlay">

          <div className="request-modal">

            <div className="modal-heading">
              <div>
                <span className="eyebrow">ACOMPANHAMENTO</span>
                <h2>Detalhes da solicitação</h2>
                <p>Consulte as informações do seu atendimento.</p>
              </div>

              <button
                className="close-button"
                onClick={fecharDetalhes}
                type="button"
              >
                ×
              </button>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>

              <div>
                <label>Protocolo</label>
                <p style={{
                  color: '#69a7ff',
                  fontWeight: '700',
                  marginTop: '7px'
                }}>
                  {solicitacaoSelecionada.protocolo}
                </p>
              </div>

              <div>
                <label>Assunto</label>
                <p style={{
                  color: '#f1f3f6',
                  marginTop: '7px'
                }}>
                  {solicitacaoSelecionada.assunto}
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '35px',
                flexWrap: 'wrap'
              }}>
                <div>
                  <label>Categoria</label>
                  <p style={{
                    color: '#dce1e9',
                    marginTop: '7px'
                  }}>
                    {solicitacaoSelecionada.categoria}
                  </p>
                </div>

                <div>
                  <label>Data de abertura</label>
                  <p style={{
                    color: '#dce1e9',
                    marginTop: '7px'
                  }}>
                    {solicitacaoSelecionada.data}
                  </p>
                </div>
              </div>

              <div>
                <label>Status do atendimento</label>

                <div style={{ marginTop: '9px' }}>
                  <span className={`request-status ${classeStatus(solicitacaoSelecionada.status)}`}>
                    {solicitacaoSelecionada.status}
                  </span>
                </div>
              </div>

              {/* Alteração do status */}

              <div style={{
                padding: '16px',
                background: '#252832',
                border: '1px solid #363d49',
                borderRadius: '10px'
              }}>

                <label htmlFor="novo-status">
                  Atualizar status do atendimento
                </label>

                <select
                  id="novo-status"
                  value={statusEditado}
                  onChange={(event) => setStatusEditado(event.target.value)}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: '10px',
                    padding: '12px',
                    background: '#11151c',
                    border: '1px solid #363d49',
                    borderRadius: '8px',
                    color: '#f1f3f6'
                  }}
                >
                  <option value="Em análise">Em análise</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluída">Concluída</option>
                </select>

                <button
                  type="button"
                  className="submit-request-button"
                  onClick={salvarStatus}
                  disabled={statusEditado === solicitacaoSelecionada.status}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    opacity: statusEditado === solicitacaoSelecionada.status ? 0.5 : 1,
                    cursor: statusEditado === solicitacaoSelecionada.status ? 'not-allowed' : 'pointer'
                  }}
                >
                  Salvar alteração
                </button>

              </div>

              <div>
                <label>Descrição da solicitação</label>
                <p style={{
                  marginTop: '9px',
                  padding: '15px',
                  background: '#11151c',
                  border: '1px solid #363d49',
                  borderRadius: '8px',
                  color: '#dce1e9',
                  fontSize: '13px',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap'
                }}>
                  {solicitacaoSelecionada.descricao}
                </p>
              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={excluirSolicitacao}
                  style={{
                    marginRight: 'auto',
                    borderColor: '#a94444',
                    color: '#ff8585'
                  }}
                >
                  Excluir solicitação
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={fecharDetalhes}
                >
                  Fechar
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      <nav className="bottom-nav">

        <div className="nav-item active">
          <span>⌂</span>
          Início
        </div>

        <div
          className="nav-item"
          onClick={() => document.getElementById('lista-solicitacoes').scrollIntoView({ behavior: 'smooth' })}
        >
          <span>▤</span>
          Solicitações
        </div>

        <div className="nav-item">
          <span>⊞</span>
          Serviços
        </div>

        <div className="nav-item">
          <span>♧</span>
          Avisos
        </div>

        <div className="nav-item">
          <span>○</span>
          Perfil
        </div>

      </nav>

    </div>
  )
}

export default App
