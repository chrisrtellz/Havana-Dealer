import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ShieldCheck,
  UserRound,
  CreditCard,
  Phone,
  Upload,
  Camera,
  CheckCircle2,
  X,
} from "lucide-react"

import "./Verification.css"

function Verification() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState("")
  const [identityNumber, setIdentityNumber] = useState("")
  const [phone, setPhone] = useState("")

  const [identityFront, setIdentityFront] = useState<File | null>(null)
  const [identityBack, setIdentityBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)

  const [message, setMessage] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(
      "El formulario está preparado. El envío real requiere conectar Supabase."
    )
  }

  function FileUpload({
    title,
    description,
    file,
    onChange,
    id,
    icon,
  }: {
    title: string
    description: string
    file: File | null
    onChange: (file: File | null) => void
    id: string
    icon: React.ReactNode
  }) {
    return (
      <div className="verification-upload">
        <input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0] ?? null

            if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
              setMessage("Cada imagen debe pesar menos de 5 MB.")
              event.target.value = ""
              onChange(null)
              return
            }

            setMessage("")
            onChange(selectedFile)
          }}
        />

        <label htmlFor={id} className="verification-upload-label">
          <span className="verification-upload-icon">
            {icon}
          </span>

          <span className="verification-upload-copy">
            <strong>{title}</strong>
            <small>
              {file ? file.name : description}
            </small>
          </span>

          {file ? (
            <CheckCircle2
              className="verification-file-success"
              size={21}
            />
          ) : (
            <Upload size={20} />
          )}
        </label>

        {file && (
          <button
            type="button"
            className="verification-remove-file"
            onClick={() => onChange(null)}
          >
            <X size={14} />
            Quitar archivo
          </button>
        )}
      </div>
    )
  }

  return (
    <main className="verification-page">
      <header className="verification-header">
        <button
          type="button"
          className="verification-back"
          onClick={() => navigate("/user-panel")}
        >
          <ArrowLeft size={19} />
          Volver al panel
        </button>

        <div className="verification-brand">
          <ShieldCheck size={27} />
          <span>
            <strong>Havana</strong>Dealer
          </span>
        </div>
      </header>

      <div className="verification-container">
        <section className="verification-intro">
          <div className="verification-main-icon">
            <ShieldCheck size={34} />
          </div>

          <span className="verification-eyebrow">
            SEGURIDAD DE LA COMUNIDAD
          </span>

          <h1>Verifica tu cuenta</h1>

          <p>
            Confirma tu identidad para poder publicar vehículos
            y generar confianza entre los compradores de HavanaDealer.
          </p>

          <div className="verification-status">
            <span className="verification-status-dot" />
            Verificación pendiente
          </div>
        </section>

        <form
          className="verification-form"
          onSubmit={handleSubmit}
        >
          <div className="verification-section-heading">
            <span className="verification-step">01</span>

            <div>
              <h2>Tus datos personales</h2>
              <p>Introduce los datos que aparecen en tu documento.</p>
            </div>
          </div>

          <div className="verification-field">
            <label htmlFor="verification-name">
              Nombre y apellidos completos
            </label>

            <div className="verification-input-wrap">
              <UserRound size={19} />

              <input
                id="verification-name"
                type="text"
                placeholder="Nombre y apellidos"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="verification-field">
            <label htmlFor="verification-id">
              Número de identidad
            </label>

            <div className="verification-input-wrap">
              <CreditCard size={19} />

              <input
                id="verification-id"
                type="text"
                placeholder="Número de tu documento"
                value={identityNumber}
                onChange={(event) =>
                  setIdentityNumber(event.target.value)
                }
                autoComplete="off"
                required
              />
            </div>

            <small>
              Escribe el número tal como aparece en tu documento.
            </small>
          </div>

          <div className="verification-field">
            <label htmlFor="verification-phone">
              Número de teléfono
            </label>

            <div className="verification-input-wrap">
              <Phone size={19} />

              <input
                id="verification-phone"
                type="tel"
                placeholder="Tu teléfono de contacto"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div className="verification-divider" />

          <div className="verification-section-heading">
            <span className="verification-step">02</span>

            <div>
              <h2>Documentos de identidad</h2>
              <p>
                Sube imágenes claras, legibles y sin recortar.
              </p>
            </div>
          </div>

          <div className="verification-uploads">
            <FileUpload
              id="identity-front"
              title="Documento por delante"
              description="JPG, PNG o WEBP · Máximo 5 MB"
              file={identityFront}
              onChange={setIdentityFront}
              icon={<CreditCard size={22} />}
            />

            <FileUpload
              id="identity-back"
              title="Documento por detrás"
              description="JPG, PNG o WEBP · Máximo 5 MB"
              file={identityBack}
              onChange={setIdentityBack}
              icon={<CreditCard size={22} />}
            />

            <FileUpload
              id="identity-selfie"
              title="Foto de tu rostro"
              description="Una foto clara de tu rostro"
              file={selfie}
              onChange={setSelfie}
              icon={<Camera size={22} />}
            />
          </div>

          <div className="verification-privacy">
            <ShieldCheck size={22} />

            <div>
              <strong>Tu información debe estar protegida</strong>
              <p>
                Los documentos se utilizarán exclusivamente para
                revisar tu solicitud de verificación. Antes de
                habilitar el envío, configuraremos el almacenamiento
                privado y los permisos de acceso.
              </p>
            </div>
          </div>

          {message && (
            <div className="verification-message" role="alert">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="verification-submit"
          >
            <ShieldCheck size={19} />
            Enviar solicitud de verificación
          </button>

          <p className="verification-disclaimer">
            Tu cuenta no se considerará verificada hasta que la
            solicitud haya sido revisada y aprobada.
          </p>
        </form>
      </div>
    </main>
  )
}

export default Verification