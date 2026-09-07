"use client"
import { Button } from "@/components/button";
import { serviceType } from "@/types/serviceType";
import { api } from "@/utils/api";
import { ArrowLeft, Check, LayoutDashboard, Pencil, Trash2, UsersRound, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { addService } from "./functions/addService";
import { cleanFields } from "./functions/cleanFields";
import { fileInput } from "./functions/fileInput";
import { deleteService } from "./functions/deleteService";
import ServiceDetailsModal from "./ServiceDetailsModal";
import { editService } from "./functions/editService";
import { useKeyboard } from "@/hooks/useKeyboard";

export default function Painel() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<string[]>([]);
  const [nomeArquivo, setNomeArquivo] = useState<string[]>([])

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')

  const [message, setMessage] = useState('')
  const [messageImages, setMessageImages] = useState('')

  const [services, setServices] = useState<serviceType[]>([])
  const [servicesDetails, setServicedetails] = useState<serviceType[]>([])
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null)

  const [successful, setSuccessful] = useState(false)
  const [isModal, setIsModal] = useState(false)

  const isKeyboardOpen = useKeyboard();  // hook

  const hora = new Date().getHours();

  const saudacao =
    hora >= 5 && hora < 12
      ? "Bom dia"
      : hora >= 12 && hora < 18
        ? "Boa tarde"
        : "Boa noite";

  async function handleDelete(id: number) {
    setIsModal(false)
    await deleteService({ id })
    setServices((currentServices) =>
      currentServices.filter(item => item.id !== id)
    )
  }

  function showEdit(id: number) {
    setIsModal(false)
    const service = services.find((item) => item.id === id)

    if (!service) return


    //exibição das propriedades aos campos para editar
    setEditingServiceId(service.id)
    setNome(service.nome)
    setDescricao(service.descricao)
    setValor(service.valor.toString())
    setImages([])
    setNomeArquivo([])
    const qtd_imagens = service.quantidade_imagens

    setMessageImages('')
    if (qtd_imagens === 0) {
      setMessageImages('Nenhuma imagem selecionada')
    } else if (qtd_imagens === 1) {
      setMessageImages('1 imagem selecionada')
    } else {
      setMessageImages(`${qtd_imagens} imagens selecionadas`)
    }

  }



  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    setMessageImages('')
    fileInput({ event, setNomeArquivo, setImages });
  }

  async function handleServiceSubmit() {
    if (editingServiceId === null) {
      await addService({ nome, descricao, valor, setMessage, setSuccessful, images })
      return
    }

    if (nome === '' || descricao === '' || valor === '') {
      setMessage('Campo vazio! Por favor preencha')
      return
    }

    try {
      await editService({ id: editingServiceId, nome, descricao, valor, images })

      // map de atualização
      setServices((currentServices) => currentServices.map((service) =>
        service.id === editingServiceId
          ? {
            ...service,
            nome,
            descricao,
            valor: Number(valor),
            quantidade_imagens: images.length,
            lista_url: images.join(',')
          }
          : service
      ))

      setEditingServiceId(null)
      setMessage('')
      setSuccessful(true)
      setTimeout(() => setSuccessful(false), 2000)
    } catch (error) {
      console.log(error)
      setMessage('Não foi possível editar o serviço')
    }
  }

  function closeDetails() {
    setIsModal(false)
  }

  function openDetails(id: number) {
    setIsModal(true)
    const Resultfilter = services.filter((item) => item.id === id)
    setServicedetails(Resultfilter)
  }

  useEffect(() => {
    if (successful) {
      cleanFields({ setNome, setDescricao, setValor, setImages, setNomeArquivo })
    }
  }, [successful])

  useEffect(() => {
    async function handleGetService() {
      try {
        const req = await api.get('/api/servico');
        const result = await req.data;
        setServices(result)
      } catch (error) {
        console.log(error);
      }
    }
    handleGetService()
  }, [])


  return (
    <main className="painel-page min-h-screen bg-[#faf9f7] text-[#1c1917] relative">

      {/* Modal de sucesso */}
      {successful && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
          <div
            role="alert"
            className="relative z-10 flex items-center gap-4 rounded-2xl border border-green-100 bg-white px-8 py-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <Check className="h-6 w-6 text-green-600" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-lg font-semibold text-green-800">Sucesso</p>
              <p className="text-sm text-green-600">Serviço adicionado com sucesso</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalhes */}
      {isModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
          <ServiceDetailsModal
            handleDelete={handleDelete}
            handleEdit={showEdit}
            closeDetails={closeDetails}
            servicedetails={servicesDetails}
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-12">

        {/* Header */}
        <div className="painel-header mb-12 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-textTitle">
              {saudacao},
            </p>
            <h1 className="mt-1 font-serif text-4xl font-light text-[#1c1917]">
              Seu Nome
            </h1>
          </div>
          <Link
            href="/"
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#e7e5e4] bg-white text-[#78716c] transition-all hover:border-[#d6d3d1] hover:text-[#1c1917] hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>
        </div>

        {/* Visão Geral */}
        <div className="painel-overview mb-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#a8a29e]">
              Visão Geral
            </h2>
            <div className="h-px flex-1 bg-[#e7e5e4]" />
          </div>
        </div>

        {/* Formulário */}
        <section id="gerenciar_Serviços" className="painel-form mb-16 overflow-hidden rounded-3xl border border-[#e7e5e4] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_0.02),0_1px_2px_-1px_rgb(0_0_0_/_0.02)]">
          <div className="border-b border-[#f5f5f4] bg-[#fafaf9] px-8 py-6">
            <h3 className="font-serif text-2xl font-light text-[#1c1917]">
              Gerenciar serviços
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#a8a29e]">
              Adicione, edite ou remova os serviços disponíveis no catálogo.
            </p>
          </div>

          <div className="space-y-6 px-8 py-8">

            {/* Nome */}
            <div className="space-y-2">
              <label
                htmlFor="nomeServico"
                className="block text-xs font-semibold uppercase tracking-wider text-[#78716c]"
              >
                Nome do serviço
              </label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                type="text"
                name="nomeServico"
                id="nomeServico"
                placeholder="Ex.: Pacote de unhas em gel"
                className="w-full rounded-xl border border-[#e7e5e4] bg-[#fafaf9] px-5 py-3.5 text-[#1c1917] placeholder:text-[#d6d3d1] transition-all focus:border-[#c9a87c] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#c9a87c]/10"
              />
              {nome === '' && message && (
                <p className="errorMessage flex items-center gap-1.5 text-xs font-medium text-red-500 animate-pulse">
                  <span className="h-1 w-1 rounded-full bg-red-500" />
                  {message}
                </p>
              )}
            </div>

            {/* Preço */}
            <div className="space-y-2">
              <label
                htmlFor="precoServico"
                className="block text-xs font-semibold uppercase tracking-wider text-[#78716c]"
              >
                Preço (R$)
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a8a29e]">R$</span>
                <input
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  type="number"
                  name="precoServico"
                  id="precoServico"
                  placeholder="0,00"
                  className="w-full rounded-xl border border-[#e7e5e4] bg-[#fafaf9] py-3.5 pl-12 pr-5 text-[#1c1917] placeholder:text-[#d6d3d1] transition-all focus:border-[#c9a87c] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#c9a87c]/10"
                />
              </div>
              {valor === '' && message && (
                <p className="errorMessage flex items-center gap-1.5 text-xs font-medium text-red-500 animate-pulse">
                  <span className="h-1 w-1 rounded-full bg-red-500" />
                  {message}
                </p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label
                htmlFor="descricaoServico"
                className="block text-xs font-semibold uppercase tracking-wider text-[#78716c]"
              >
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                name="descricaoServico"
                id="descricaoServico"
                placeholder="Descreva o que está incluso neste serviço..."
                className="h-32 w-full resize-none rounded-xl border border-[#e7e5e4] bg-[#fafaf9] px-5 py-3.5 text-[#1c1917] placeholder:text-[#d6d3d1] transition-all focus:border-[#c9a87c] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#c9a87c]/10"
              />
              {descricao === '' && message && (
                <p className="errorMessage flex items-center gap-1.5 text-xs font-medium text-red-500 animate-pulse">
                  <span className="h-1 w-1 rounded-full bg-red-500" />
                  {message}
                </p>
              )}
            </div>

            {/* Upload de imagem */}
            <div className="space-y-2">
              <label
                htmlFor="file"
                className="block text-xs font-semibold uppercase tracking-wider text-[#78716c]"
              >
                Imagens do serviço
              </label>
              <div className="rounded-xl border border-dashed border-[#d6d3d1] bg-[#fafaf9] p-6 transition-colors hover:border-[#c9a87c] hover:bg-[#f5f5f4]">
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => inputRef.current?.click()}
                    type="button"
                    className="rounded-full bg-[#1c1917] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#292524] hover:shadow-lg active:scale-95"
                  >
                    Escolher arquivo
                  </button>

                  {messageImages
                    ? <span className="text-sm text-[#a8a29e]">{messageImages}</span>
                    : <span className="text-sm text-[#a8a29e]">
                      {nomeArquivo.length === 0
                        ? 'Nenhuma imagem selecionada'
                        : nomeArquivo.length === 1
                          ? nomeArquivo[0]
                          : `${nomeArquivo.length} imagens selecionadas`
                      }
                    </span>}

                  <input
                    ref={inputRef}
                    onChange={handleFile}
                    multiple
                    type="file"
                    name="file"
                    id="file"
                    className="sr-only"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">

              <Button
                onclick={handleServiceSubmit}
                name={editingServiceId === null ? 'Adicionar Serviço' : 'Editar Serviço'}
              />
            </div>
          </div>
        </section>

        {/* Lista de Serviços */}
        <div className="painel-services-heading mb-6 flex items-center gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#a8a29e]">
            Serviços cadastrados
          </h2>
          <div className="h-px flex-1 bg-[#e7e5e4]" />
          <span className="rounded-full bg-[#f5f5f4] px-3 py-1 text-xs font-medium text-[#78716c]">
            {services.length}
          </span>
        </div>

        <section className="space-y-4 mb-10">
          {services.map((s, index) => (
            <div
              key={s.id}
              style={{ animationDelay: `${index * 70}ms` }}
              className="painel-service-card group relative overflow-hidden rounded-2xl border border-[#e7e5e4] bg-white p-6 transition-all hover:border-[#d6d3d1] hover:shadow-lg hover:shadow-black/5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-light text-[#1c1917]">
                    {s.nome}
                  </h3>
                  <p className="text-sm text-[#a8a29e]">
                    {s.quantidade_imagens === 1
                      ? "1 imagem anexada"
                      : `${s.quantidade_imagens} imagens anexadas`}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(s.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#a8a29e] transition-all hover:bg-red-50 hover:text-red-500"
                  title="Excluir serviço"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#a8a29e]">Preço</p>
                  <p className="mt-0.5 font-serif text-2xl font-light text-[#1c1917]">
                    R$ {s.valor}
                  </p>
                </div>

                <button
                  onClick={() => openDetails(s.id)}
                  className="group/btn flex items-center gap-2 border-b border-[#c9a87c] pb-0.5 text-sm font-medium text-[#78716c] transition-all hover:text-[#1c1917]"
                >
                  Ver detalhes
                  <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
                </button>
              </div>
            </div>
          ))}

          {services.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e7e5e4] bg-[#fafaf9] py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f4]">
                <Pencil className="h-5 w-5 text-[#d6d3d1]" />
              </div>
              <p className="text-sm font-medium text-[#a8a29e]">Nenhum serviço cadastrado</p>
              <p className="mt-1 text-xs text-[#d6d3d1]">Adicione seu primeiro serviço acima</p>
            </div>
          )}
        </section>
      </div>

      {/* nav */}
      <footer className={`w-full flex fixed bottom-0 ${isKeyboardOpen ? 'hidden' : 'block'}`}>
        <div className="flex flex-1 flex-col items-center justify-center py-2 bg-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_-4px_12px_rgba(0,0,0,0.08)] active:scale-[0.98]">
          <LayoutDashboard width={25} height={25} id="painel" />
          <label className="text-[0.8rem] mt-2" htmlFor="painel">
            Painel
          </label>
        </div>

        <Link href={'/clientes'} className="flex flex-1 flex-col items-center justify-center bg-footer-NAV transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_-4px_12px_rgba(0,0,0,0.08)] active:scale-[0.98]">
          <UsersRound width={25} height={25} id="clientes" />
          <label className="text-[0.8rem] mt-2" htmlFor="clientes">
            Clientes
          </label>
        </Link>
      </footer>
    </main>
  );
}