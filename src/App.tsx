
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const WHATSAPP_URL =
  "https://wa.me/5519995499000?text=" +
  encodeURIComponent(
    "Olá! Conheci a Unique pelo site e gostaria de saber mais sobre os treinamentos."
  );

const MAPS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent("Av. Dr. Heitor Nascimento, 809, Paulínia, SP");

const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Treinamentos", href: "#treinamentos" },
  { label: "Localização", href: "#localizacao" },
  { label: "Contato", href: "#contato" },
];

const trainings = [
  {
    number: "01",
    title: "Velocidade",
    description:
      "Desenvolva aceleração, explosão e capacidade de resposta para superar seus limites dentro e fora do esporte.",
    image: "/velocidade.png",
    imagePosition: "center 45%",
  },
  {
    number: "02",
    title: "Agilidade",
    description:
      "Aprimore mudanças de direção, coordenação e controle corporal para reagir com mais eficiência.",
    image: "/agilidade.png",
    imagePosition: "center 25%",
  },
  {
    number: "03",
    title: "Preparação física",
    description:
      "Construa uma base física consistente com treinos voltados ao desempenho, à evolução e à disciplina.",
    image: "/preparacao-fisica.png",
    imagePosition: "center 30%",
  },
];

function App() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [rolouPagina, setRolouPagina] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState("#inicio");

  const barraCabecalhoRef = useRef<HTMLDivElement | null>(null);
  const prefereMovimentoReduzido = useReducedMotion();

  useEffect(() => {
    const atualizarCabecalho = () => {
      setRolouPagina(window.scrollY > 30);
    };

    atualizarCabecalho();

    window.addEventListener("scroll", atualizarCabecalho, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", atualizarCabecalho);
    };
  }, []);

  // Mantém o destaque do menu sincronizado com a seção visível.
  useEffect(() => {
    const elementos = navigation
      .map(({ href }) => document.getElementById(href.slice(1)))
      .filter((elemento): elemento is HTMLElement => elemento !== null);

    if (!elementos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visiveis = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visiveis.length > 0) {
          setSecaoAtiva(`#${visiveis[0].target.id}`);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    elementos.forEach((elemento) => observer.observe(elemento));

    return () => observer.disconnect();
  }, []);

  // Navegação corrigida para o menu mobile e desktop.
  const navegar = (href: string) => {
    const id = href.startsWith("#") ? href.slice(1) : href;
    const secao = document.getElementById(id);

    if (!secao) {
      console.error(`Não foi encontrada a seção com id="${id}".`);
      return;
    }

    // Guarda o estado antes de fechar o menu.
    const menuEstavaAberto = menuAberto;

    // Atualiza a seção ativa e fecha o menu.
    setSecaoAtiva(`#${id}`);
    setMenuAberto(false);

    // Atualiza a URL sem recarregar a página.
    window.history.replaceState(null, "", `#${id}`);

    // Aguarda o fechamento do menu antes de calcular a posição.
    window.setTimeout(() => {
      const secaoAtual = document.getElementById(id);

      if (!secaoAtual) return;

      const alturaCabecalho =
        barraCabecalhoRef.current?.getBoundingClientRect().height ?? 96;

      const posicao =
        secaoAtual.getBoundingClientRect().top +
        window.scrollY -
        alturaCabecalho -
        16;

      // Rola até a seção sem esconder seu título atrás do cabeçalho.
      window.scrollTo({
        top: Math.max(0, posicao),
        behavior: prefereMovimentoReduzido ? "auto" : "smooth",
      });
    }, menuEstavaAberto ? 300 : 0);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#080d0f] text-white selection:bg-teal-300 selection:text-[#080d0f]">
      {/* Cabeçalho */}
      <motion.header
        initial={false}
        animate={{
          backgroundColor: rolouPagina
            ? "rgba(8, 13, 15, 0.97)"
            : "rgba(8, 13, 15, 0.65)",
          boxShadow: rolouPagina
            ? "0 10px 35px rgba(0,0,0,0.22)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.25 }}
        className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] backdrop-blur-xl"
      >
        <div
          ref={barraCabecalhoRef}
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-300 sm:gap-6 sm:px-8 ${
            rolouPagina ? "h-[96px]" : "h-[112px]"
          }`}
        >
          <button
            type="button"
            onClick={() => navegar("#inicio")}
            aria-label="Voltar ao início"
            className="flex shrink-0 items-center"
          >
            <img
              src="/unique-logo-completa.png"
              alt="Unique Treinamento Esportivo"
              className={`w-auto object-contain transition-all duration-300 ${
                rolouPagina
                  ? "h-[68px] sm:h-[76px]"
                  : "h-[82px] sm:h-[94px]"
              }`}
            />
          </button>

          {/* Menu desktop */}
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-3 lg:flex xl:gap-5"
          >
            {navigation.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navegar(item.href)}
                className={`group relative whitespace-nowrap py-3 text-sm transition-colors ${
                  secaoAtiva === item.href
                    ? "text-teal-300"
                    : "text-white/65 hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 -bottom-px h-0.5 origin-left rounded-full bg-gradient-to-r from-teal-300 to-cyan-400 transition-transform duration-300 ${
                    secaoAtiva === item.href
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>
            ))}
          </nav>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full border border-teal-300/30 bg-teal-300/[0.08] px-4 py-3 text-sm font-semibold text-teal-200 transition-all hover:border-teal-300/60 hover:bg-teal-300/[0.15] xl:inline-flex"
          >
            Fale conosco
            <ArrowUpRight size={16} />
          </a>

          {/* Botão mobile */}
          <button
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-colors hover:bg-white/[0.09] lg:hidden"
          >
            {menuAberto ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {/* Menu mobile */}
        <AnimatePresence initial={false}>
          {menuAberto && (
            <motion.nav
              id="menu-mobile"
              aria-label="Navegação mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-white/[0.07] bg-[#080d0f]/[0.99] backdrop-blur-2xl lg:hidden"
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">
                {navigation.map((item, index) => (
                  <motion.button
                    key={item.href}
                    type="button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.035 }}
                    onClick={() => navegar(item.href)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm transition-colors ${
                      secaoAtiva === item.href
                        ? "bg-teal-300/[0.09] text-teal-200"
                        : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {item.label}
                    <ArrowUpRight size={16} className="opacity-60" />
                  </motion.button>
                ))}

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuAberto(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-300 to-cyan-400 px-5 py-3.5 text-sm font-bold text-[#071012]"
                >
                  <MessageCircle size={17} />
                  Fale conosco
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      <main>
        {/* Início */}
        <section
          id="inicio"
          className="relative flex min-h-[760px] scroll-mt-32 items-center overflow-hidden pb-20 pt-36 sm:min-h-[800px] sm:pb-24 sm:pt-40"
        >
          <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-teal-400/[0.08] blur-[120px]" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.08] blur-[140px]" />

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative z-10"
            >
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/[0.06] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(94,234,212,0.7)]" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
                  Unique Treinamento Esportivo
                </span>
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-6xl xl:text-7xl">
                Preparação para ir{" "}
                <span className="bg-gradient-to-r from-teal-200 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  além dos seus limites.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
                Evolua sua performance com treinamento, dedicação e uma
                preparação física voltada para transformar seu potencial em
                resultados.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navegar("#treinamentos")}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-teal-300 to-cyan-400 px-7 py-4 text-sm font-bold text-[#071012] transition-all duration-300 hover:-translate-y-1"
                >
                  Conheça os treinamentos
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => navegar("#sobre")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-4 text-sm font-semibold text-white transition-all hover:border-white/30 hover:bg-white/[0.07]"
                >
                  Conheça a Unique
                </button>
              </div>

              <div className="mt-10 flex items-center gap-3 text-sm text-white/45">
                <CheckCircle2 size={17} className="text-teal-300" />
                <span>Consistência, evolução e desempenho.</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.12 }}
              className="relative mx-auto w-full max-w-[570px] lg:max-w-none"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-300/15 via-transparent to-cyan-500/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#101719] p-2 shadow-2xl shadow-black/30">
                <img
                  src="/unique-hero.png"
                  alt="Treinamento esportivo na Unique"
                  className="h-[360px] w-full rounded-[1.25rem] object-cover sm:h-[460px] lg:h-[510px]"
                />
                <div className="absolute inset-x-2 bottom-2 rounded-b-[1.25rem] bg-gradient-to-t from-[#071012]/95 via-[#071012]/65 to-transparent px-6 pb-6 pt-24 sm:px-8 sm:pb-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">
                    Performance em evolução
                  </p>
                  <p className="mt-2 max-w-sm text-xl font-semibold leading-snug text-white sm:text-2xl">
                    Seu próximo nível começa com a preparação certa.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <button
            type="button"
            onClick={() => navegar("#sobre")}
            aria-label="Rolar para conhecer a Unique"
            className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs text-white/40 transition-colors hover:text-teal-200 md:flex"
          >
            Explore a Unique
            <ArrowDown size={14} />
          </button>
        </section>

        {/* Sobre */}
        <section
          id="sobre"
          className="relative scroll-mt-32 border-t border-white/[0.06] py-24 sm:py-32"
        >
          <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-teal-300/[0.05] blur-[110px]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">
                Sobre a Unique
              </p>
              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                Mais do que treinar.
                <span className="mt-2 block text-white/45">
                  Evoluir a cada etapa.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <p className="text-base leading-8 text-white/60 sm:text-lg">
                A Unique Treinamento Esportivo tem como proposta contribuir
                para o desenvolvimento físico e esportivo, valorizando a
                disciplina, a dedicação e a busca constante por evolução.
              </p>
              <p className="text-base leading-8 text-white/60 sm:text-lg">
                Cada etapa da preparação é uma oportunidade para desenvolver
                capacidades, fortalecer a confiança e trabalhar em direção
                aos seus objetivos.
              </p>

              <div className="grid gap-4 pt-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <CheckCircle2 size={23} className="mb-4 text-teal-300" />
                  <h3 className="font-semibold text-white">Desenvolvimento</h3>
                  <p className="mt-2 text-sm leading-6 text-white/50">
                    Trabalho contínuo para aprimorar suas capacidades.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <ArrowUpRight size={23} className="mb-4 text-teal-300" />
                  <h3 className="font-semibold text-white">Alta dedicação</h3>
                  <p className="mt-2 text-sm leading-6 text-white/50">
                    Compromisso com a evolução e os objetivos esportivos.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Faixa visual */}
        <section
          aria-label="Performance esportiva"
          className="overflow-hidden border-y border-white/[0.06] bg-[#0b1214] py-8 sm:py-10"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <p className="text-center text-[clamp(2.8rem,10.5vw,9rem)] font-semibold leading-none tracking-[-0.055em] text-white/[0.07]">
              PERFORMANCE
            </p>
          </div>
        </section>

        {/* Treinamentos */}
        <section
          id="treinamentos"
          className="scroll-mt-32 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="mb-12 flex flex-col justify-between gap-5 sm:mb-16 lg:flex-row lg:items-end"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">
                  O que desenvolvemos
                </p>
                <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                  Preparação para o seu próximo nível.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-white/50 sm:text-base">
                Conheça algumas das áreas de treinamento para desenvolver
                capacidades físicas e melhorar seu desempenho.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trainings.map((training, index) => (
                <motion.article
                  key={training.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: index * 0.1 }}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#0d1416] transition-all duration-300 hover:-translate-y-1 hover:border-teal-300/30"
                >
                  <div className="relative h-64 overflow-hidden sm:h-72 lg:h-80">
                    <img
                      src={training.image}
                      alt={`Treinamento de ${training.title.toLowerCase()} na Unique`}
                      loading="lazy"
                      style={{ objectPosition: training.imagePosition }}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080d0f] via-[#080d0f]/10 to-transparent" />
                    <span className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#080d0f]/60 text-xs font-semibold text-teal-200 backdrop-blur-md">
                      {training.number}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                      <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        {training.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <p className="min-h-[84px] text-sm leading-7 text-white/55">
                      {training.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => navegar("#contato")}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-200 transition-colors hover:text-teal-100"
                    >
                      Saiba mais
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Localização */}
        <section
          id="localizacao"
          className="scroll-mt-32 border-t border-white/[0.06] bg-[#0a1012] py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">
                Onde estamos
              </p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                Encontre a Unique.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/55">
                Estamos em Paulínia, SP. Consulte o mapa e trace sua rota para
                conhecer o espaço de treinamento.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]"
            >
              <div className="flex flex-col justify-between rounded-[1.5rem] border border-white/[0.08] bg-[#101719] p-6 sm:p-8">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-300/15 bg-teal-300/[0.08] text-teal-200">
                    <MapPin size={23} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">
                    Unique Treinamento Esportivo
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/55">
                    Av. Dr. Heitor Nascimento, 809
                    <br />
                    Paulínia, São Paulo
                  </p>
                </div>

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-all hover:border-teal-300/40 hover:bg-teal-300/[0.06] hover:text-teal-200"
                >
                  Como chegar
                  <ArrowUpRight size={16} />
                </a>
              </div>

              <div className="min-h-[320px] overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#101719] sm:min-h-[400px]">
                <iframe
                  title="Mapa da Unique Treinamento Esportivo em Paulínia"
                  src="https://maps.google.com/maps?q=Av.%20Dr.%20Heitor%20Nascimento%2C%20809%2C%20Paulinia%2C%20SP&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "inherit", display: "block" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contato */}
        <section
          id="contato"
          className="relative scroll-mt-32 overflow-hidden py-24 sm:py-32"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080d0f] via-[#0b1718] to-[#080d0f]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/[0.07] blur-[130px]" />

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-4xl px-5 text-center sm:px-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">
              O próximo passo é seu
            </p>
            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Sua evolução começa com uma{" "}
              <span className="bg-gradient-to-r from-teal-200 to-cyan-400 bg-clip-text text-transparent">
                decisão.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
              Entre em contato com a Unique para conhecer os treinamentos e
              descobrir como dar o próximo passo na sua preparação esportiva.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="group mt-9 inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-teal-300 to-cyan-400 px-7 py-4 text-sm font-bold text-[#071012] transition-all duration-300 hover:-translate-y-1 sm:px-9 sm:text-base"
            >
              <MessageCircle size={19} />
              Fale com a Unique pelo WhatsApp
              <ArrowUpRight size={18} />
            </a>
          </motion.div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="border-t border-white/[0.07] bg-[#070b0d]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-8 sm:px-8 md:flex-row">
          <button
            type="button"
            onClick={() => navegar("#inicio")}
            aria-label="Voltar ao início"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src="/unique-logo-completa.png"
              alt="Unique Treinamento Esportivo"
              className="h-10 w-auto object-contain"
            />
          </button>

          <p className="text-center text-xs leading-6 text-white/40">
            © {new Date().getFullYear()} Unique Treinamento Esportivo. Todos os
            direitos reservados.
          </p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-teal-200"
          >
            <MessageCircle size={16} />
            Entre em contato
          </a>
        </div>

        <div className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-5 py-6 sm:flex-row sm:gap-4 sm:px-8">
            <span className="text-xs tracking-wide text-white/40">
              Desenvolvido por
            </span>
            <a
              href="https://eleva-studio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conheça a Eleva Studio"
              className="group inline-flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <img
                src="/logo-eleva.png"
                alt="Logo da Eleva Studio"
                loading="lazy"
                className="h-8 w-auto max-w-[140px] object-contain"
              />
              <span className="text-sm font-semibold text-white/75 transition-colors group-hover:text-teal-200">
                Eleva Studio
              </span>
              <ArrowUpRight
                size={14}
                className="text-teal-300/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
