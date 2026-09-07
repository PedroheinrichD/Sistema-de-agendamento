// ElixirLanding.tsx
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ImageCarousel from "./painel/ImageCarousel";
import { getServicos } from "@/lib/queries";

// Revalidar a página a cada 5 segundos (ISR - Incremental Static Regeneration)
export const revalidate = 10;

// ─── Icons (inline SVGs) ─────────────────────────────────────────
const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="15" y2="18" />
  </svg>
);

const LeafIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.6C13.4 5.4 17.8 7.2 19 10.8c.4 1.2.4 2.6 0 3.8" />
    <path d="M11 20c-1.5-1.5-2-3.5-1.5-5.5" />
    <path d="M20 20c-2.5 0-4.5-1.5-5.5-3.5" />
  </svg>
);

const MassageIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10" />
    <path d="M12 12c-2 0-3.5 1.5-3.5 3.5S10 19 12 19s3.5-1.5 3.5-3.5" />
    <path d="M12 12V2" />
    <path d="M15.5 8.5L12 12l-3.5-3.5" />
  </svg>
);

const AcupunctureIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const HolisticIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 0v20" />
    <path d="M2 12h20" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2c2.5 4 2.5 16 0 20" />
    <path d="M12 2c-2.5 4-2.5 16 0 20" />
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────
interface ServiceCardProps {
  serviceId: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
  images?: string;
  animationDelay?: number;
}

// ─── Sub-components ──────────────────────────────────────────────
const ServiceCard: React.FC<ServiceCardProps> = ({
  serviceId,
  icon,
  title,
  description,
  price,
  images,
  animationDelay = 0,
}) => {
  const imageList = images
    ? images
        .split(",")
        .map((image) => image.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      style={{ animationDelay: `${animationDelay}ms` }}
      className="home-service-card overflow-hidden bg-surface-container rounded-lg"
    >
      {imageList.length > 1 ? (
        <ImageCarousel
          images={imageList}
          alt={title}
          intervalMs={4000}
          heightClassName="h-64"
        />
      ) : imageList.length === 1 ? (
        <img
          src={imageList[0]}
          alt={title}
          className="h-64 w-full bg-surface-container-high object-cover"
        />
      ) : null}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="text-on-surface">{icon}</div>
        </div>

        <h3 className="font-serif text-[22px] text-on-surface mb-3 leading-[1.2]">
          {title}
        </h3>

        <p className="font-body text-[14px] leading-[1.6] text-on-surface-variant mb-6">
          {description}
        </p>

        <div className="flex items-center justify-between mb-5">
          <span className="font-label text-outline text-[12px]">
            A partir de
          </span>
          <span className="font-body font-semibold text-[16px] text-on-surface">
            {price}
          </span>
        </div>

        <Link href={`/agendamento?servicoId=${serviceId}`}>
          <button className="w-full py-3.5 border border-on-surface font-button text-[11px] text-on-surface bg-transparent hover:bg-[#785e3e] hover:text-surface transition-colors duration-300">
            Agendar este serviço
          </button>
        </Link>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────
async function Page() {
  const services = await getServicos();

  const serviceIcons = [
    <MassageIcon key="massage" />,
    <AcupunctureIcon key="acupuncture" />,
    <HolisticIcon key="holistic" />,
  ];

  return (
    <div className="home-page min-h-screen bg-surface text-on-surface font-body relative">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="home-header flex items-center justify-between px-5 py-4 bg-surface">
        <button className="text-on-surface p-1">
          <MenuIcon />
        </button>

        <h1 className="font-serif text-[18px] tracking-[0.15em] uppercase text-on-surface lg:text-[30px]">
          Studio Bella
        </h1>

        <Link
          className="font-label text-[11px] text-on-surface"
          href={"/admin"}
        >
          Admin
        </Link>
      </header>

      {/* ─── Hero Image ─────────────────────────────────────────── */}
      <section className="home-hero px-5 pt-2 pb-8 md:absolute md:top-0 md:left-0 md:w-full md:z-[-1]">
        <div className="w-full aspect-[3/4] bg-surface-container-high overflow-hidden">
          <Image
            src="/caroline-image.png"
            width={600}
            height={600}
            alt="caroline_image"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ─── Profile ────────────────────────────────────────────── */}
      <section className="home-profile px-5 pb-10">
        <span className="block font-label text-secondary mb-3">
          Especialista em Beleza e Cuidados
        </span>

        <h2 className="font-serif text-[36px] text-on-surface leading-[1.1] mb-5 ">
          Studio Bella
          <br />
          Beleza & Estética
        </h2>

        <p className="font-body text-[15px] leading-[1.7] text-on-surface-variant mb-6">
          Com experiência em cuidados com unhas, cabelos e depilação, ofereço um
          atendimento personalizado para valorizar sua beleza e proporcionar
          mais confiança e bem-estar. Cada serviço é realizado com atenção aos
          detalhes, buscando entregar um resultado bonito, cuidadoso e de
          qualidade.
        </p>
      </section>

      {/* ─── Divider ────────────────────────────────────────────── */}
      <div className="px-5">
        <div className="w-full h-px bg-[#d9cdb8]" />
      </div>

      {/* ─── CTA Section ────────────────────────────────────────── */}
      <section className="home-cta px-5 py-12 text-center">
        <h2 className="font-serif text-[28px] text-on-surface leading-[1.2] mb-4">
          Agende seu momento de
          <br />
          cuidado
        </h2>

        <p className="font-body text-[14px] leading-[1.7] text-on-surface-variant mb-8 max-w-[280px] mx-auto">
          Agende seu horário e cuide de você.
        </p>

        <Link href={"/agendamento"}>
          <button className="home-action-button w-full py-4 bg-primary-container font-button text-[12px] text-on-primary hover:bg-primary transition-colors duration-300">
            Agendar Agora
          </button>
        </Link>
      </section>

      {/* ─── Services ───────────────────────────────────────────── */}
      <section className="home-services px-5 pb-16">
        <h2 className="font-serif text-[28px] text-on-surface text-center mb-10 leading-[1.2]">
          Nossos Serviços
        </h2>

        <div className="flex flex-col gap-6">
          {services.map((service, index) => (
            <React.Fragment key={service.id}>
              <ServiceCard
                serviceId={service.id}
                icon={serviceIcons[index % serviceIcons.length]}
                title={service.nome}
                description={service.descricao}
                price={`R$ ${service.valor}`}
                images={service.lista_url}
                animationDelay={index * 80}
              />
              {index < services.length - 1 && (
                <div
                  className="mx-auto h-px w-16 bg-[#d9cdb8] md:hidden"
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-surface-container px-5 py-12 text-center">
        <h3 className="font-serif text-[20px] tracking-[0.12em] uppercase text-on-surface mb-6">
          Studio Bella
        </h3>

        <p className="font-label text-[11px] text-outline">
          © 2026 todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default Page;
