import { Link } from 'react-router-dom'

/* ───────────────── Reusable styled primitives ───────────────── */

function SectionTitle({ id, number, children }: { id: string; number?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-gray-900">
        {number && <span className="text-blue-600">{number}. </span>}
        {children}
      </h2>
      <div className="mt-2 h-1 w-16 rounded bg-blue-600" />
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  )
}

function SubSubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
      {children}
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-700 leading-relaxed">{children}</p>
}

function Bold({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-gray-900">{children}</strong>
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
      <p className="text-sm text-blue-800 leading-relaxed">{children}</p>
    </div>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-blue-600 text-white">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, ci) => (
                <td key={ci} className="border-t border-gray-200 px-4 py-3 text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-6 text-gray-700">
      {items.map((item, i) => (
        <li key={i} className="leading-relaxed">{item}</li>
      ))}
    </ul>
  )
}

function OL({ items, start }: { items: React.ReactNode[]; start?: number }) {
  return (
    <ol start={start} className="list-decimal space-y-1.5 pl-6 text-gray-700">
      {items.map((item, i) => (
        <li key={i} className="leading-relaxed">{item}</li>
      ))}
    </ol>
  )
}

function LetterList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="list-[lower-alpha] space-y-2 pl-6 text-gray-700">
      {items.map((item, i) => (
        <li key={i} className="leading-relaxed">{item}</li>
      ))}
    </ol>
  )
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>
}

function Divider() {
  return <hr className="border-gray-200" />
}

/* ────────────────────── Main page ────────────────────── */

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Nav ── */}
      <nav className="fixed top-0 z-50 w-full bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="AcaInfo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-blue-600">AcaInfo</span>
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              &larr; Volver al inicio
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 pt-16">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center text-white sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Términos y Condiciones de Uso, Política de Privacidad y Política de Cookies
          </h1>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-blue-100 text-sm">
            <span><Bold>Plataforma:</Bold> AcaInfo</span>
            <span><Bold>Dominio:</Bold> acadeinfo.com</span>
            <span><Bold>Versión:</Bold> 1.0</span>
            <span><Bold>Última actualización:</Bold> 11 de febrero de 2026</span>
          </div>
        </div>
      </section>

      {/* ── Content wrapper ── */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">

        {/* ── Índice ── */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Índice</h2>
          <nav>
            <ol className="list-decimal space-y-2 pl-6 text-blue-600">
              <li><a href="#sec-1" className="hover:underline">Información del Responsable</a></li>
              <li><a href="#sec-2" className="hover:underline">Objeto y Ámbito de Aplicación</a></li>
              <li><a href="#sec-3" className="hover:underline">Definiciones</a></li>
              <li><a href="#sec-4" className="hover:underline">Términos y Condiciones de Uso</a></li>
              <li><a href="#sec-5" className="hover:underline">Política de Privacidad</a></li>
              <li><a href="#sec-6" className="hover:underline">Política de Cookies</a></li>
              <li><a href="#sec-7" className="hover:underline">Seguridad de la Información</a></li>
              <li><a href="#sec-8" className="hover:underline">Derechos de los Usuarios (ARCO-POL)</a></li>
              <li><a href="#sec-9" className="hover:underline">Condiciones Económicas y de Pago</a></li>
              <li><a href="#sec-10" className="hover:underline">Propiedad Intelectual e Industrial</a></li>
              <li><a href="#sec-11" className="hover:underline">Limitación de Responsabilidad</a></li>
              <li><a href="#sec-12" className="hover:underline">Modificación de las Condiciones</a></li>
              <li><a href="#sec-13" className="hover:underline">Legislación Aplicable y Jurisdicción</a></li>
              <li><a href="#sec-14" className="hover:underline">Aceptación y Consentimiento</a></li>
            </ol>
            <div className="mt-3 space-y-1 pl-6 text-blue-600 text-sm">
              <div><a href="#anexo-1" className="hover:underline">Anexo I: Tratamientos Automatizados</a></div>
              <div><a href="#anexo-2" className="hover:underline">Anexo II: Registro de Actividades de Tratamiento</a></div>
            </div>
          </nav>
        </div>

        {/* ═══════ SECCIÓN 1 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-1" number="1">Información del Responsable</SectionTitle>

            <Table
              headers={['Campo', 'Dato']}
              rows={[
                ['Razón social / Titular', '[NOMBRE_EMPRESA_O_TITULAR]'],
                ['CIF / NIF', '[CIF_NIF]'],
                ['Domicilio social', '[DIRECCIÓN_FISCAL]'],
                ['Email de contacto', '[EMAIL_CONTACTO]'],
                ['Email del Delegado / Responsable de Protección de Datos', '[EMAIL_DPD]'],
                ['Teléfono de contacto', '[TELÉFONO_CONTACTO]'],
                ['Registro mercantil / actividad', '[DATOS_REGISTRO_MERCANTIL]'],
                ['Dominio web', 'https://acadeinfo.com'],
              ]}
            />

            <Note>
              <Bold>Nota:</Bold> En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se ponen a disposición del usuario los datos identificativos del prestador de servicios.
            </Note>
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 2 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-2" number="2">Objeto y Ámbito de Aplicación</SectionTitle>

            <SubSection title="2.1 Objeto">
              <P>
                El presente documento regula las condiciones de acceso y uso de la plataforma <Bold>AcaInfo</Bold> (en adelante, &ldquo;la Plataforma&rdquo;), accesible a través del dominio <Bold>acadeinfo.com</Bold>, así como la política de privacidad y el tratamiento de datos personales de los usuarios.
              </P>
              <P>La Plataforma es un sistema de gestión académica diseñado para un centro de formación privado, que permite:</P>
              <UL items={[
                'El registro y gestión de cuentas de usuario (estudiantes, profesores, administradores).',
                'La gestión de matrículas en asignaturas y grupos.',
                'La programación y reserva de sesiones formativas (presenciales y online).',
                'El control de asistencia.',
                'La gestión de pagos y facturación.',
                'La subida y descarga de materiales didácticos.',
                'La gestión de solicitudes de grupo y listas de espera.',
              ]} />
            </SubSection>

            <SubSection title="2.2 Ámbito de aplicación">
              <P>
                Estas condiciones se aplican a <Bold>todos los usuarios</Bold> que accedan o utilicen la Plataforma, independientemente de su rol (estudiante, profesor o administrador). El acceso y uso de la Plataforma implica la lectura, comprensión y aceptación íntegra de las presentes condiciones.
              </P>
            </SubSection>

            <SubSection title="2.3 Requisitos del usuario">
              <UL items={[
                <>Ser <Bold>mayor de 18 años</Bold> o tener la edad legal suficiente para prestar consentimiento en su país de residencia.</>,
                'Disponer de una cuenta de correo electrónico válida dentro de los dominios autorizados por la Plataforma.',
                'Proporcionar datos veraces y actualizados en el proceso de registro.',
              ]} />
            </SubSection>
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 3 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-3" number="3">Definiciones</SectionTitle>

            <P>A los efectos del presente documento:</P>
            <UL items={[
              <><Bold>Plataforma</Bold>: El sistema web AcaInfo accesible en acadeinfo.com y todos sus servicios asociados.</>,
              <><Bold>Responsable del tratamiento</Bold>: La persona física o jurídica titular del servicio identificada en la sección 1.</>,
              <><Bold>Usuario</Bold>: Toda persona física que accede a la Plataforma y/o se registra en ella.</>,
              <><Bold>Estudiante</Bold>: Usuario con rol de alumno matriculado en una o más asignaturas.</>,
              <><Bold>Profesor</Bold>: Usuario con rol docente asignado a uno o más grupos.</>,
              <><Bold>Administrador</Bold>: Usuario con permisos de gestión integral de la Plataforma.</>,
              <><Bold>Datos personales</Bold>: Cualquier información relativa a una persona física identificada o identificable, conforme al art. 4.1 del RGPD.</>,
              <><Bold>Tratamiento</Bold>: Cualquier operación realizada sobre datos personales (recogida, registro, almacenamiento, consulta, comunicación, supresión, etc.).</>,
              <><Bold>RGPD</Bold>: Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales.</>,
              <><Bold>LOPDGDD</Bold>: Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y Garantía de los Derechos Digitales.</>,
              <><Bold>LSSI-CE</Bold>: Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico.</>,
            ]} />
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 4 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-4" number="4">Términos y Condiciones de Uso</SectionTitle>

            {/* 4.1 */}
            <SubSection title="4.1 Registro y cuenta de usuario">
              <P>4.1.1 Para acceder a los servicios de la Plataforma, el usuario debe crear una cuenta proporcionando los siguientes datos obligatorios:</P>
              <UL items={[
                'Nombre y apellidos.',
                'Dirección de correo electrónico (restringida a dominios autorizados).',
                'Contraseña (mínimo 6 caracteres).',
              ]} />

              <P>4.1.2 Datos opcionales solicitados durante el registro:</P>
              <UL items={['Número de teléfono.', 'Grado académico.']} />

              <P>4.1.3 El usuario es responsable de:</P>
              <UL items={[
                'La veracidad y actualización de los datos proporcionados.',
                'La custodia de sus credenciales de acceso (email y contraseña).',
                'Todas las acciones realizadas desde su cuenta.',
                'Notificar inmediatamente al Responsable cualquier uso no autorizado de su cuenta.',
              ]} />

              <P>
                4.1.4 El proceso de registro requiere <Bold>verificación del correo electrónico</Bold> mediante un enlace de validación con una vigencia de 24 horas. Las cuentas no verificadas en un plazo de 7 días serán eliminadas automáticamente del sistema.
              </P>
            </SubSection>

            {/* 4.2 */}
            <SubSection title="4.2 Roles y permisos">
              <P>4.2.1 La Plataforma establece tres niveles de acceso:</P>
              <Table
                headers={['Rol', 'Descripción', 'Asignación']}
                rows={[
                  ['Estudiante', 'Acceso a sus matrículas, sesiones, reservas, materiales y pagos', 'Asignado automáticamente al registrarse'],
                  ['Profesor', 'Gestión de sus grupos, sesiones, asistencia y materiales', 'Asignado por un administrador'],
                  ['Administrador', 'Gestión integral de la Plataforma', 'Asignado por otro administrador'],
                ]}
              />
              <P>4.2.2 Los roles pueden ser asignados o revocados por los administradores de la Plataforma. Un usuario puede tener más de un rol simultáneamente.</P>
            </SubSection>

            {/* 4.3 */}
            <SubSection title="4.3 Obligaciones del usuario">
              <P>El usuario se compromete a:</P>
              <LetterList items={[
                'Utilizar la Plataforma de forma diligente, conforme a la ley, la moral y el orden público.',
                'No realizar acciones que puedan dañar, inutilizar, sobrecargar o deteriorar la Plataforma o impedir su normal utilización.',
                'No intentar acceder a áreas restringidas, cuentas de otros usuarios o sistemas internos de la Plataforma sin autorización.',
                'No utilizar la Plataforma para transmitir, distribuir o almacenar material que infrinja derechos de propiedad intelectual o industrial de terceros.',
                'No utilizar mecanismos automatizados (bots, scrapers, crawlers) para acceder a la Plataforma sin autorización expresa.',
                'No compartir sus credenciales de acceso con terceros.',
                'Mantener actualizados sus datos de contacto.',
              ]} />
            </SubSection>

            {/* 4.4 */}
            <SubSection title="4.4 Suspensión y bloqueo de cuentas">
              <P>4.4.1 El Responsable se reserva el derecho de suspender, bloquear o desactivar cuentas de usuario en los siguientes supuestos:</P>
              <UL items={[
                'Incumplimiento de las presentes condiciones de uso.',
                'Uso fraudulento o abusivo de la Plataforma.',
                'Impago de las cuotas correspondientes (la cuenta se desactivará automáticamente transcurridos 5 días desde la fecha de vencimiento del pago).',
                'Inactividad prolongada, previo aviso al usuario.',
                'Solicitud del propio usuario.',
              ]} />

              <P>4.4.2 Los estados posibles de una cuenta son:</P>
              <Table
                headers={['Estado', 'Descripción']}
                rows={[
                  ['Activa', 'Funcionamiento normal con acceso completo'],
                  ['Inactiva', 'Acceso limitado; el usuario puede iniciar sesión pero ve un aviso de estado'],
                  ['Bloqueada', 'Acceso restringido con aviso de bloqueo al iniciar sesión'],
                  ['Pendiente de activación', 'Cuenta creada pero email no verificado; no permite el acceso'],
                ]}
              />

              <P>4.4.3 La reactivación de cuentas desactivadas por impago se producirá automáticamente una vez regularizados todos los pagos pendientes, siempre que el usuario mantenga al menos una matrícula activa.</P>
            </SubSection>

            {/* 4.5 */}
            <SubSection title="4.5 Materiales didácticos">
              <P>4.5.1 Los materiales subidos a la Plataforma (apuntes, ejercicios, documentos, presentaciones, etc.) son proporcionados como apoyo a la formación y su descarga está sujeta a las siguientes condiciones:</P>
              <UL items={[
                'Solo los estudiantes con matrícula activa y pagos al corriente podrán descargar materiales.',
                'Los materiales están protegidos por derechos de propiedad intelectual y su redistribución está prohibida.',
                'El tamaño máximo de archivo es de 10 MB por fichero.',
              ]} />
              <P>4.5.2 Los profesores y administradores son responsables de que los materiales subidos no infrinjan derechos de terceros.</P>
            </SubSection>

            {/* 4.6 */}
            <SubSection title="4.6 Reservas y asistencia">
              <P>4.6.1 El sistema de reservas permite a los estudiantes matriculados confirmar su asistencia a las sesiones programadas. Las reservas pueden realizarse en dos modalidades:</P>
              <UL items={[
                <><Bold>Presencial</Bold>: Asistencia física al centro.</>,
                <><Bold>Online</Bold>: Asistencia remota (sujeta a aprobación del profesor).</>,
              ]} />
              <P>4.6.2 Las reservas son nominativas y no transferibles. Cada estudiante puede tener una única reserva por sesión.</P>
              <P>4.6.3 El registro de asistencia lo realizan los profesores o administradores y queda vinculado al historial académico del estudiante.</P>
            </SubSection>

            {/* 4.7 */}
            <SubSection title="4.7 Matrículas y listas de espera">
              <P>4.7.1 Las solicitudes de matrícula están sujetas a aprobación por parte del profesorado o la administración del centro.</P>
              <P>4.7.2 Cuando un grupo alcanza su capacidad máxima, los estudiantes pueden ser incluidos en una lista de espera. La promoción desde la lista de espera se gestiona por orden de solicitud.</P>
              <P>4.7.3 Las solicitudes de matrícula pendientes de aprobación expirarán automáticamente transcurridas 48 horas sin respuesta.</P>
            </SubSection>

            {/* 4.8 */}
            <SubSection title="4.8 Disponibilidad del servicio">
              <P>4.8.1 El Responsable hará esfuerzos razonables para mantener la Plataforma disponible de forma continuada, pero no garantiza su disponibilidad ininterrumpida.</P>
              <P>4.8.2 El servicio podrá verse interrumpido temporalmente por razones de mantenimiento, actualización, seguridad o causas de fuerza mayor. Siempre que sea posible, se informará previamente a los usuarios.</P>
            </SubSection>
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 5 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-5" number="5">Política de Privacidad</SectionTitle>

            <P>
              En cumplimiento del <Bold>Reglamento (UE) 2016/679</Bold> (RGPD) y la <Bold>Ley Orgánica 3/2018</Bold> (LOPDGDD), se informa al usuario de lo siguiente:
            </P>

            {/* 5.1 */}
            <SubSection title="5.1 Responsable del tratamiento">
              <P>El responsable del tratamiento de los datos personales es la entidad identificada en la sección 1 del presente documento.</P>
            </SubSection>

            {/* 5.2 */}
            <SubSection title="5.2 Datos personales recogidos">
              <P>La Plataforma recoge y trata las siguientes categorías de datos personales:</P>

              <SubSubSection title="5.2.1 Datos identificativos (proporcionados por el usuario)">
                <Table
                  headers={['Dato', 'Obligatorio', 'Finalidad']}
                  rows={[
                    ['Nombre y apellidos', 'Sí', 'Identificación del usuario en la Plataforma'],
                    ['Correo electrónico', 'Sí', 'Identificación, autenticación, comunicaciones del servicio'],
                    ['Contraseña', 'Sí', 'Autenticación (almacenada cifrada con BCrypt, nunca en texto plano)'],
                    ['Número de teléfono', 'No', 'Contacto alternativo'],
                    ['Grado académico', 'No', 'Organización académica y visibilidad de asignaturas'],
                  ]}
                />
              </SubSubSection>

              <SubSubSection title="5.2.2 Datos generados por el uso del servicio">
                <Table
                  headers={['Dato', 'Descripción', 'Finalidad']}
                  rows={[
                    ['Historial de matrículas', 'Asignaturas, grupos, fechas, estado', 'Gestión académica'],
                    ['Reservas de sesiones', 'Sesiones reservadas, modalidad, estado', 'Organización de sesiones'],
                    ['Registro de asistencia', 'Asistencia/ausencia a sesiones', 'Control académico'],
                    ['Historial de pagos', 'Importes, fechas, estado de pago', 'Gestión económica'],
                    ['Solicitudes de grupo', 'Solicitudes, apoyos, estado', 'Gestión de demanda académica'],
                    ['Posición en lista de espera', 'Orden en la cola de espera', 'Gestión de matrículas'],
                    ['Materiales descargados', 'Registro de acceso a materiales', 'Control de acceso'],
                  ]}
                />
              </SubSubSection>

              <SubSubSection title="5.2.3 Datos técnicos y de auditoría">
                <Table
                  headers={['Dato', 'Descripción', 'Finalidad']}
                  rows={[
                    ['Fecha de creación de cuenta', 'Timestamp automático', 'Auditoría y gestión de cuentas'],
                    ['Fecha de última modificación', 'Timestamp automático', 'Auditoría'],
                    ['Tokens de autenticación', 'JWT cifrados, tokens de refresco', 'Seguridad de la sesión'],
                    ['Tokens de verificación', 'Email y recuperación de contraseña', 'Verificación de identidad'],
                    ['Dirección IP', 'Registrada en logs del servidor', 'Seguridad y prevención de fraude'],
                    ['Agente de usuario (User-Agent)', 'Registrado en logs del servidor', 'Seguridad y compatibilidad'],
                  ]}
                />
              </SubSubSection>

              <SubSubSection title="5.2.4 Datos financieros">
                <Table
                  headers={['Dato', 'Descripción', 'Finalidad']}
                  rows={[
                    ['Importes de pago', 'Cantidad, precio por hora, horas totales', 'Facturación'],
                    ['Fechas de vencimiento', 'Fecha límite de pago', 'Gestión de cobros'],
                    ['Estado de pago', 'Pendiente, pagado, cancelado', 'Control financiero'],
                    ['Identificador de pago externo', 'Referencia del procesador de pagos (cuando se active)', 'Conciliación de pagos'],
                  ]}
                />
                <Note>
                  <Bold>Nota importante sobre pagos:</Bold> La Plataforma <Bold>no almacena ni procesa datos de tarjetas de crédito/débito ni datos bancarios directamente</Bold>. Cuando se active la integración con procesador de pagos externo (Stripe), los datos de tarjeta serán gestionados íntegramente por dicho procesador conforme a la normativa PCI-DSS. La Plataforma únicamente almacenará identificadores de referencia de la transacción.
                </Note>
              </SubSubSection>
            </SubSection>

            {/* 5.3 */}
            <SubSection title="5.3 Bases legales del tratamiento">
              <Table
                headers={['Finalidad', 'Base legal (art. 6 RGPD)']}
                rows={[
                  ['Registro y gestión de la cuenta', 'Ejecución de contrato (art. 6.1.b) — Necesario para la prestación del servicio contratado'],
                  ['Gestión de matrículas y sesiones', 'Ejecución de contrato (art. 6.1.b)'],
                  ['Facturación y gestión de pagos', 'Ejecución de contrato (art. 6.1.b) y Obligación legal (art. 6.1.c) — Normativa fiscal y tributaria'],
                  ['Control de asistencia', 'Ejecución de contrato (art. 6.1.b) — Inherente al servicio formativo'],
                  ['Envío de comunicaciones del servicio', 'Ejecución de contrato (art. 6.1.b) — Comunicaciones necesarias para el funcionamiento del servicio'],
                  ['Seguridad de la Plataforma (logs, tokens, prevención de fraude)', 'Interés legítimo (art. 6.1.f) — Garantizar la seguridad e integridad del servicio'],
                  ['Registro de actividad y auditoría', 'Interés legítimo (art. 6.1.f) y Obligación legal (art. 6.1.c)'],
                  ['Analíticas web (cuando se active)', 'Consentimiento (art. 6.1.a) — Previo consentimiento informado del usuario'],
                  ['Comunicaciones comerciales o promocionales', 'Consentimiento (art. 6.1.a) — Requiere consentimiento expreso y separado'],
                ]}
              />
            </SubSection>

            {/* 5.4 */}
            <SubSection title="5.4 Destinatarios de los datos">
              <P>Los datos personales podrán ser comunicados a los siguientes destinatarios:</P>

              <SubSubSection title="5.4.1 Encargados del tratamiento (proveedores de servicios)">
                <Table
                  headers={['Proveedor', 'Servicio', 'Datos tratados', 'Ubicación', 'Garantías']}
                  rows={[
                    ['Hetzner Online GmbH', 'Alojamiento del servidor (VPS)', 'Todos los datos almacenados en la Plataforma', 'Núremberg, Alemania (UE)', 'Dentro del EEE; sujeto al RGPD directamente'],
                    ['Cloudflare, Inc.', 'DNS, CDN y protección contra amenazas', 'Dirección IP, cabeceras HTTP, tráfico web', 'Red global (principal en UE/EEUU)', 'Cláusulas Contractuales Tipo (CCT); EU-US Data Privacy Framework'],
                    ['Google LLC (Gmail SMTP)', 'Envío de correos electrónicos transaccionales', 'Dirección de email del destinatario, contenido del email', 'EEUU/Global', 'Cláusulas Contractuales Tipo (CCT); EU-US Data Privacy Framework'],
                    ['Google LLC (Google Fonts)', 'Tipografías web', 'Dirección IP del usuario (al cargar las fuentes)', 'EEUU/Global', 'Cláusulas Contractuales Tipo (CCT); EU-US Data Privacy Framework'],
                    ['Stripe, Inc. (cuando se active)', 'Procesamiento de pagos', 'Datos de pago gestionados por Stripe directamente', 'EEUU/Irlanda', 'PCI-DSS Level 1; CCT; EU-US Data Privacy Framework'],
                    ['Proveedor de analíticas (cuando se active)', 'Analítica web', 'Datos de navegación anonimizados o seudonimizados', 'Por determinar', 'Se informará en la actualización de esta política'],
                  ]}
                />
              </SubSubSection>

              <SubSubSection title="5.4.2 Transferencias internacionales de datos">
                <P>Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo (EEE). En todos los casos, se garantiza un nivel de protección adecuado mediante:</P>
                <UL items={[
                  <><Bold>Decisiones de adecuación</Bold> de la Comisión Europea (cuando aplique).</>,
                  <><Bold>Cláusulas Contractuales Tipo (CCT)</Bold> aprobadas por la Comisión Europea (Decisión 2021/914).</>,
                  <><Bold>EU-US Data Privacy Framework</Bold> para proveedores certificados con sede en EEUU.</>,
                  <><Bold>Medidas técnicas complementarias</Bold> (cifrado en tránsito y en reposo).</>,
                ]} />
              </SubSubSection>

              <SubSubSection title="5.4.3 Visibilidad de datos entre usuarios de la Plataforma">
                <Table
                  headers={['Contexto', 'Datos visibles', 'Quién puede verlos']}
                  rows={[
                    ['Matrículas de un grupo', 'Nombre del estudiante', 'Profesores del grupo, administradores'],
                    ['Reservas de una sesión', 'Nombre del estudiante, modalidad', 'Profesores, administradores'],
                    ['Registro de asistencia', 'Nombre, estado de asistencia', 'Profesores, administradores'],
                    ['Solicitudes de grupo', 'Nombre del solicitante y apoyos', 'Otros estudiantes de la asignatura, administradores'],
                    ['Listas de espera', 'Nombre del estudiante, posición', 'Administradores'],
                    ['Datos de pago', 'Importes, estado, fechas', 'El propio estudiante, administradores'],
                    ['Perfil del profesor', 'Nombre', 'Estudiantes matriculados en sus grupos'],
                  ]}
                />
              </SubSubSection>
            </SubSection>

            {/* 5.5 */}
            <SubSection title="5.5 Plazos de conservación de datos">
              <Table
                headers={['Categoría de datos', 'Plazo de conservación', 'Fundamento']}
                rows={[
                  ['Cuenta de usuario y datos identificativos', 'Mientras la cuenta esté activa + 5 años tras la baja', 'Obligaciones legales y prescripción de acciones'],
                  ['Datos de matrículas y asistencia', 'Duración de la relación formativa + 5 años', 'Acreditación del servicio y obligaciones legales'],
                  ['Datos de pago y facturación', '5 años desde la fecha del último pago', 'Art. 30 del Código de Comercio; Ley General Tributaria'],
                  ['Tokens de verificación de email', '24 horas (caducidad automática)', 'Estrictamente necesarios para la verificación'],
                  ['Tokens de recuperación de contraseña', '1 hora (caducidad automática)', 'Estrictamente necesarios para la recuperación'],
                  ['Tokens de refresco de sesión', 'Duración de la sesión (revocados al cerrar sesión)', 'Seguridad del servicio'],
                  ['Cuentas no verificadas', '7 días (eliminación automática)', 'Limpieza de datos innecesarios'],
                  ['Solicitudes de matrícula pendientes', '48 horas (expiración automática)', 'Gestión operativa'],
                  ['Logs del servidor', '90 días', 'Seguridad e investigación de incidentes'],
                  ['Materiales didácticos', 'Mientras la asignatura esté activa', 'Prestación del servicio'],
                  ['Datos de analíticas (cuando se active)', 'Máximo 26 meses o según configuración del proveedor', 'Consentimiento del usuario'],
                ]}
              />
            </SubSection>

            {/* 5.6 */}
            <SubSection title="5.6 Medidas de minimización de datos">
              <P>En aplicación del principio de minimización (art. 5.1.c RGPD):</P>
              <UL items={[
                'Solo se solicitan los datos estrictamente necesarios para cada finalidad.',
                'El número de teléfono y el grado académico son opcionales.',
                'Las contraseñas se almacenan cifradas y nunca son accesibles ni recuperables.',
                'Los tokens de seguridad tienen caducidad automática y son de un solo uso.',
                'Los datos de navegación no se recogen salvo consentimiento expreso (analíticas).',
                'No se recogen datos de categorías especiales (art. 9 RGPD): origen étnico, opiniones políticas, datos de salud, orientación sexual, etc.',
              ]} />
            </SubSection>
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 6 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-6" number="6">Política de Cookies</SectionTitle>

            <SubSection title="6.1 Información general">
              <P>En cumplimiento del artículo 22.2 de la LSSI-CE y la Directiva 2002/58/CE (Directiva ePrivacy), se informa al usuario sobre el uso de cookies y mecanismos de almacenamiento local en la Plataforma.</P>
            </SubSection>

            <SubSection title="6.2 Tecnologías de almacenamiento local utilizadas">
              <P>
                La Plataforma utiliza <Bold>almacenamiento local del navegador (localStorage)</Bold> en lugar de cookies HTTP tradicionales. La información almacenada es:
              </P>

              <SubSubSection title="6.2.1 Almacenamiento técnico estrictamente necesario">
                <Table
                  headers={['Clave', 'Contenido', 'Finalidad', 'Tipo', 'Duración']}
                  rows={[
                    ['auth-storage', 'Token de acceso (JWT), token de refresco, datos básicos del usuario (nombre, email, roles)', 'Mantener la sesión del usuario autenticado', 'Técnica / Necesaria', 'Hasta cierre de sesión o expiración del token'],
                  ]}
                />
                <Note>
                  Este almacenamiento es <Bold>estrictamente necesario</Bold> para el funcionamiento de la Plataforma y no requiere consentimiento previo conforme al art. 22.2 de la LSSI-CE, al ser imprescindible para la prestación del servicio solicitado por el usuario.
                </Note>
              </SubSubSection>

              <SubSubSection title="6.2.2 Cookies de terceros">
                <Table
                  headers={['Proveedor', 'Cookie/Mecanismo', 'Finalidad', 'Tipo', 'Consentimiento']}
                  rows={[
                    ['Google Fonts', 'Conexión a fonts.googleapis.com y fonts.gstatic.com', 'Carga de tipografías web', 'Técnica / Funcional', 'No requerido (estrictamente funcional)'],
                    ['Cloudflare', '__cf_bm, cf_clearance (si aplica)', 'Protección contra bots y amenazas', 'Técnica / Seguridad', 'No requerido (seguridad)'],
                    ['Stripe (cuando se active)', 'Cookies propias de Stripe', 'Procesamiento seguro de pagos, prevención de fraude', 'Técnica / Necesaria', 'No requerido (necesaria para el pago)'],
                    ['Proveedor de analíticas (cuando se active)', 'Por determinar', 'Análisis de uso de la Plataforma', 'Analítica', 'Sí — Consentimiento previo requerido'],
                  ]}
                />
              </SubSubSection>
            </SubSection>

            <SubSection title="6.3 Gestión de cookies y almacenamiento">
              <P>6.3.1 El usuario puede gestionar o eliminar el almacenamiento local de la Plataforma en cualquier momento a través de:</P>
              <UL items={[
                <><Bold>Cerrar sesión</Bold> en la Plataforma (elimina automáticamente los datos de autenticación).</>,
                <><Bold>Configuración del navegador</Bold>: Herramientas de desarrollador {'>'} Application {'>'} Local Storage {'>'} Borrar datos del sitio.</>,
                <><Bold>Configuración de privacidad del navegador</Bold>: Borrar datos de navegación.</>,
              ]} />
              <P>6.3.2 La eliminación del almacenamiento de autenticación provocará el cierre automático de la sesión y será necesario volver a iniciar sesión.</P>
              <P>6.3.3 Cuando se active el servicio de analíticas, se implementará un <Bold>banner de consentimiento de cookies</Bold> que permitirá al usuario:</P>
              <UL items={[
                'Aceptar o rechazar las cookies analíticas.',
                'Modificar sus preferencias en cualquier momento.',
                'Obtener información detallada sobre cada cookie.',
              ]} />
            </SubSection>

            <SubSection title="6.4 Base legal">
              <UL items={[
                <><Bold>Almacenamiento técnico necesario</Bold>: Exento de consentimiento (art. 22.2 LSSI-CE, considerando 66 Directiva ePrivacy).</>,
                <><Bold>Cookies analíticas (futuro)</Bold>: Consentimiento previo e informado (art. 6.1.a RGPD, art. 22.2 LSSI-CE).</>,
              ]} />
            </SubSection>
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 7 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-7" number="7">Seguridad de la Información</SectionTitle>

            <SubSection title="7.1 Compromiso de seguridad">
              <P>El Responsable se compromete a adoptar las medidas técnicas y organizativas apropiadas para garantizar un nivel de seguridad adecuado al riesgo, conforme al artículo 32 del RGPD y alineadas con los estándares de la <Bold>ISO/IEC 27001:2022</Bold> en materia de gestión de la seguridad de la información.</P>
            </SubSection>

            <SubSection title="7.2 Medidas técnicas implementadas">

              <SubSubSection title="7.2.1 Autenticación y control de acceso">
                <UL items={[
                  <><Bold>Cifrado de contraseñas</Bold>: Las contraseñas se almacenan utilizando el algoritmo BCrypt con factor de coste 10 (hashing con sal aleatoria). En ningún caso se almacenan contraseñas en texto plano.</>,
                  <><Bold>Autenticación basada en tokens JWT</Bold>: Los tokens de acceso se firman con HMAC-SHA256 y tienen una vigencia limitada. La clave de firma se gestiona mediante variables de entorno en producción.</>,
                  <><Bold>Tokens de refresco</Bold>: Almacenados en base de datos con capacidad de revocación individual o masiva (cierre de sesión en todos los dispositivos).</>,
                  <><Bold>Verificación de email obligatoria</Bold>: Todo usuario debe verificar su dirección de correo electrónico antes de poder acceder a la Plataforma.</>,
                  <><Bold>Recuperación de contraseña segura</Bold>: Los tokens de recuperación son de un solo uso, tienen caducidad de 1 hora, y su uso provoca la revocación de todas las sesiones activas del usuario.</>,
                  <><Bold>Control de acceso por roles (RBAC)</Bold>: Cada endpoint de la API está protegido con verificaciones de rol (estudiante, profesor, administrador) a nivel de método.</>,
                  <><Bold>Autorización a nivel de recurso</Bold>: Los estudiantes solo pueden acceder a datos de sus propias matrículas, sesiones y pagos. Existen verificaciones de propiedad adicionales a las de rol.</>,
                ]} />
              </SubSubSection>

              <SubSubSection title="7.2.2 Cifrado y comunicaciones">
                <UL items={[
                  <><Bold>HTTPS/TLS obligatorio</Bold>: Todas las comunicaciones entre el navegador del usuario y el servidor se realizan a través de HTTPS con certificado TLS válido, gestionado mediante Cloudflare.</>,
                  <><Bold>Cifrado en tránsito de emails</Bold>: La comunicación con el servidor SMTP se realiza mediante STARTTLS obligatorio.</>,
                  <><Bold>API REST sin estado</Bold>: La arquitectura no utiliza cookies de sesión del servidor, eliminando vectores de ataque como el Session Fixation.</>,
                ]} />
              </SubSubSection>

              <SubSubSection title="7.2.3 Infraestructura y alojamiento">
                <UL items={[
                  <><Bold>Servidor</Bold>: Alojado en Hetzner Online GmbH, centro de datos de Núremberg (Alemania), dentro del Espacio Económico Europeo (EEE).</>,
                  <><Bold>Protección perimetral</Bold>: Cloudflare proporciona protección DNS, CDN y mitigación de amenazas (DDoS, bots maliciosos).</>,
                  <><Bold>Base de datos</Bold>: PostgreSQL con conexiones autenticadas y pool de conexiones configurado (HikariCP con límites de conexiones, timeouts e idle management).</>,
                  <><Bold>Almacenamiento de archivos</Bold>: Sistema de ficheros local del servidor con rutas controladas y validación de nombres de archivo para prevenir ataques de path traversal.</>,
                ]} />
              </SubSubSection>

              <SubSubSection title="7.2.4 Gestión de vulnerabilidades y desarrollo seguro">
                <UL items={[
                  <><Bold>Validación de entradas</Bold>: Todas las solicitudes a la API se validan tanto en el cliente como en el servidor para prevenir inyección de datos maliciosos.</>,
                  <><Bold>Protección contra inyección SQL</Bold>: Uso exclusivo de consultas parametrizadas a través de JPA/Hibernate.</>,
                  <><Bold>Gestión centralizada de errores</Bold>: Los mensajes de error no revelan información sensible del sistema al usuario (stack traces, rutas de servidor, etc.).</>,
                  <><Bold>Credenciales en variables de entorno</Bold>: Las contraseñas de base de datos, claves JWT y credenciales de servicios externos se gestionan mediante variables de entorno, nunca almacenadas en el código fuente en producción.</>,
                  <><Bold>Separación de entornos</Bold>: Entornos de desarrollo, pruebas y producción completamente separados con configuraciones independientes.</>,
                ]} />
              </SubSubSection>

              <SubSubSection title="7.2.5 Procesos automatizados de mantenimiento">
                <UL items={[
                  <><Bold>Limpieza de cuentas no verificadas</Bold>: Eliminación automática cada 24 horas de cuentas pendientes de activación con más de 7 días de antigüedad (minimización de datos).</>,
                  <><Bold>Expiración de solicitudes</Bold>: Las solicitudes de matrícula no procesadas expiran automáticamente a las 48 horas.</>,
                  <><Bold>Caducidad de tokens</Bold>: Todos los tokens de seguridad (verificación de email, recuperación de contraseña, refresco de sesión) tienen caducidades estrictas y son de un solo uso.</>,
                  <><Bold>Gestión automática de morosos</Bold>: Desactivación y reactivación automática de cuentas según el estado de los pagos, con notificación por email al usuario.</>,
                ]} />
              </SubSubSection>
            </SubSection>

            <SubSection title="7.3 Medidas organizativas">
              <UL items={[
                <><Bold>Principio de mínimo privilegio</Bold>: Cada usuario solo tiene acceso a los datos y funcionalidades necesarios para su rol.</>,
                <><Bold>Segregación de responsabilidades</Bold>: Los roles de estudiante, profesor y administrador tienen permisos diferenciados y no intercambiables por defecto.</>,
                <><Bold>Registro de acciones sensibles</Bold>: Se registran las acciones administrativas relevantes (cambios de rol, aprobaciones de matrículas, gestión de pagos) con identificación del usuario que las realiza y marca temporal.</>,
                <><Bold>Política de contraseñas</Bold>: Requisito mínimo de 6 caracteres. Se recomienda encarecidamente el uso de contraseñas robustas con combinación de mayúsculas, minúsculas, números y caracteres especiales.</>,
              ]} />
            </SubSection>

            <SubSection title="7.4 Gestión de incidentes de seguridad">
              <P>7.4.1 En caso de brecha de seguridad que afecte a datos personales, el Responsable:</P>
              <UL items={[
                <>Notificará a la <Bold>Agencia Española de Protección de Datos (AEPD)</Bold> en un plazo máximo de <Bold>72 horas</Bold> desde que tenga conocimiento de la brecha, conforme al art. 33 del RGPD.</>,
                <>Notificará a los usuarios afectados <Bold>sin dilación indebida</Bold> cuando la brecha suponga un alto riesgo para sus derechos y libertades, conforme al art. 34 del RGPD.</>,
                'Documentará internamente todas las brechas de seguridad, sus efectos y las medidas correctoras adoptadas.',
              ]} />
              <P>7.4.2 El usuario puede comunicar vulnerabilidades o incidentes de seguridad detectados a la dirección: <Bold>[EMAIL_DPD]</Bold>.</P>
            </SubSection>
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 8 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-8" number="8">Derechos de los Usuarios (ARCO-POL)</SectionTitle>

            <SubSection title="8.1 Derechos reconocidos">
              <P>En virtud de los artículos 15 a 22 del RGPD y los artículos 13 a 18 de la LOPDGDD, el usuario tiene los siguientes derechos:</P>
              <Table
                headers={['Derecho', 'Descripción', 'Artículo RGPD']}
                rows={[
                  ['Acceso', 'Conocer si se tratan sus datos y obtener copia de los mismos', 'Art. 15'],
                  ['Rectificación', 'Corregir datos inexactos o completar datos incompletos', 'Art. 16'],
                  ['Supresión ("derecho al olvido")', 'Solicitar la eliminación de sus datos cuando ya no sean necesarios, retire el consentimiento o se opongan al tratamiento', 'Art. 17'],
                  ['Oposición', 'Oponerse al tratamiento de sus datos en determinadas circunstancias', 'Art. 21'],
                  ['Limitación del tratamiento', 'Solicitar la limitación del tratamiento en los supuestos previstos legalmente', 'Art. 18'],
                  ['Portabilidad', 'Recibir sus datos en formato estructurado, de uso común y lectura mecánica, y transmitirlos a otro responsable', 'Art. 20'],
                ]}
              />
            </SubSection>

            <SubSection title="8.2 Ejercicio de derechos">
              <P>8.2.1 El usuario puede ejercer sus derechos de las siguientes formas:</P>
              <UL items={[
                <><Bold>Por correo electrónico</Bold>: Enviando una solicitud a <Bold>[EMAIL_DPD]</Bold> con el asunto &ldquo;Ejercicio de derechos - [Derecho solicitado]&rdquo;.</>,
                <><Bold>Desde la Plataforma</Bold>: Mediante las opciones de gestión de perfil disponibles en la cuenta del usuario (modificación de datos, cierre de sesión en todos los dispositivos).</>,
              ]} />

              <P>8.2.2 La solicitud deberá incluir:</P>
              <UL items={[
                'Nombre y apellidos del solicitante.',
                'Dirección de correo electrónico asociada a la cuenta.',
                'Derecho que se desea ejercer.',
                'Motivo de la solicitud (en caso de oposición o supresión).',
                'Copia del DNI, NIE o documento identificativo equivalente (para verificar la identidad).',
              ]} />

              <P>
                8.2.3 El Responsable atenderá las solicitudes en un plazo máximo de <Bold>un mes</Bold> desde la recepción. Este plazo podrá prorrogarse dos meses más en caso de complejidad o volumen de solicitudes, informando al usuario.
              </P>
            </SubSection>

            <SubSection title="8.3 Derecho de reclamación ante la autoridad de control">
              <P>8.3.1 Si el usuario considera que el tratamiento de sus datos personales vulnera la normativa vigente, tiene derecho a presentar una reclamación ante la <Bold>Agencia Española de Protección de Datos (AEPD)</Bold>:</P>
              <UL items={[
                <><Bold>Web</Bold>: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">https://www.aepd.es</a></>,
                <><Bold>Dirección postal</Bold>: C/ Jorge Juan, 6 — 28001 Madrid</>,
                <><Bold>Teléfono</Bold>: 901 100 099 / 91 266 35 17</>,
              ]} />
            </SubSection>

            <SubSection title="8.4 Funcionalidades de autogestión en la Plataforma">
              <P>El usuario puede ejercer directamente desde su cuenta las siguientes acciones sin necesidad de solicitud formal:</P>
              <Table
                headers={['Acción', 'Cómo realizarla']}
                rows={[
                  ['Modificar nombre, apellidos y teléfono', 'Sección "Perfil" > "Editar perfil"'],
                  ['Cambiar contraseña', 'Sección "Perfil" > "Cambiar contraseña"'],
                  ['Cerrar sesión en todos los dispositivos', 'Sección "Perfil" > "Cerrar todas las sesiones"'],
                  ['Cancelar reservas', 'Desde el listado de reservas activas'],
                  ['Retirarse de una matrícula', 'Desde el detalle de la matrícula'],
                  ['Recuperar contraseña', 'Desde la pantalla de inicio de sesión > "He olvidado mi contraseña"'],
                ]}
              />
            </SubSection>
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 9 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-9" number="9">Condiciones Económicas y de Pago</SectionTitle>

            <SubSection title="9.1 Tarifas y facturación">
              <P>
                9.1.1 Las tarifas de los servicios formativos se determinan por el <Bold>precio por hora</Bold> establecido para cada grupo en el momento de la matrícula del estudiante.
              </P>
              <P>9.1.2 Los pagos pueden ser de los siguientes tipos:</P>
              <Table
                headers={['Tipo', 'Descripción']}
                rows={[
                  ['Pago inicial', 'Generado al formalizar la matrícula'],
                  ['Pago mensual', 'Generado periódicamente según las horas impartidas'],
                  ['Pago completo (intensivo)', 'Pago único por la totalidad del curso intensivo'],
                ]}
              />
              <P>9.1.3 Los pagos se generan con una <Bold>fecha de vencimiento</Bold> definida. El usuario será informado de los pagos pendientes a través de la Plataforma.</P>
            </SubSection>

            <SubSection title="9.2 Impago y consecuencias">
              <P>
                9.2.1 Transcurridos <Bold>5 días</Bold> desde la fecha de vencimiento sin que el pago haya sido registrado, la cuenta del usuario será <Bold>desactivada automáticamente</Bold>, lo que implica:
              </P>
              <UL items={[
                'Restricción de acceso a la descarga de materiales.',
                'Notificación por email de la desactivación.',
                'Visualización de un aviso de estado en la Plataforma.',
              ]} />
              <P>9.2.2 La reactivación será automática una vez regularizados todos los pagos pendientes y siempre que el usuario mantenga al menos una matrícula activa.</P>
            </SubSection>

            <SubSection title="9.3 Procesamiento de pagos">
              <P>9.3.1 Actualmente, el registro de pagos se realiza de forma manual por la administración del centro.</P>
              <P>9.3.2 Está prevista la integración futura con la pasarela de pagos <Bold>Stripe</Bold> para permitir el pago online con tarjeta. Cuando se active:</P>
              <UL items={[
                <>Los datos de tarjeta serán procesados <Bold>exclusivamente por Stripe</Bold>, conforme a la normativa <Bold>PCI-DSS Level 1</Bold>.</>,
                <>La Plataforma <Bold>nunca almacenará datos de tarjeta de crédito o débito</Bold>.</>,
                'Solo se almacenará un identificador de referencia de la transacción.',
                'Se informará al usuario del cambio mediante actualización de esta política.',
              ]} />
            </SubSection>
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 10 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-10" number="10">Propiedad Intelectual e Industrial</SectionTitle>

            <SubSection title="10.1 Titularidad">
              <P>10.1.1 Todos los elementos que componen la Plataforma (código fuente, diseño gráfico, logotipos, textos, estructura, software) están protegidos por la legislación de propiedad intelectual e industrial y son titularidad del Responsable o de sus legítimos licenciantes.</P>
              <P>10.1.2 Los materiales didácticos subidos por los profesores son propiedad intelectual de sus respectivos autores. El centro cuenta con licencia de uso para su distribución dentro de la Plataforma con fines formativos.</P>
            </SubSection>

            <SubSection title="10.2 Licencia de uso">
              <P>
                10.2.1 El Responsable concede al usuario registrado una licencia de uso <Bold>personal, no exclusiva, intransferible y revocable</Bold> para acceder a la Plataforma y a los materiales didácticos, exclusivamente para fines formativos.
              </P>
              <P>10.2.2 Queda expresamente prohibido:</P>
              <UL items={[
                'Reproducir, distribuir o comunicar públicamente los materiales fuera del ámbito de la Plataforma.',
                'Descompilar, desensamblar o realizar ingeniería inversa del software de la Plataforma.',
                'Utilizar los contenidos con fines comerciales sin autorización.',
                'Eliminar o alterar los avisos de propiedad intelectual.',
              ]} />
            </SubSection>

            <SubSection title="10.3 Contenidos del usuario">
              <P>10.3.1 Cualquier contenido subido por el usuario (solicitudes de grupo, justificaciones, etc.) seguirá siendo propiedad del usuario. Al subirlo, el usuario concede al Responsable una licencia limitada para almacenar y mostrar dicho contenido dentro de la Plataforma según sea necesario para la prestación del servicio.</P>
            </SubSection>
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 11 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-11" number="11">Limitación de Responsabilidad</SectionTitle>

            <SubSection title="11.1 Exención de responsabilidad">
              <P>El Responsable no será responsable de:</P>
              <LetterList items={[
                'Interrupciones del servicio por causas de fuerza mayor, fallos de terceros proveedores de servicios o mantenimiento programado.',
                'Daños derivados del uso indebido de la Plataforma por parte del usuario o del incumplimiento de estas condiciones.',
                'La veracidad de los datos proporcionados por los usuarios.',
                'Contenidos subidos por profesores o usuarios que infrinjan derechos de terceros.',
                'Pérdidas derivadas del acceso no autorizado a la cuenta del usuario por custodia negligente de sus credenciales.',
                'Decisiones académicas o económicas tomadas por el usuario basándose en la información de la Plataforma.',
              ]} />
            </SubSection>

            <SubSection title="11.2 Limitación cuantitativa">
              <P>En todo caso, la responsabilidad total del Responsable frente al usuario por cualquier concepto estará limitada al importe total abonado por el usuario en los últimos 12 meses de servicio.</P>
            </SubSection>
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 12 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-12" number="12">Modificación de las Condiciones</SectionTitle>

            <SubSection title="12.1 Derecho de modificación">
              <P>12.1.1 El Responsable se reserva el derecho de modificar las presentes condiciones en cualquier momento, con el fin de adaptarlas a novedades legislativas, técnicas o cambios en los servicios ofrecidos.</P>
              <P>12.1.2 Las modificaciones serán notificadas a los usuarios mediante:</P>
              <UL items={[
                'Aviso visible en la Plataforma al iniciar sesión.',
                'Comunicación por correo electrónico a la dirección registrada (para cambios sustanciales).',
                'Actualización de la fecha de "Última actualización" del presente documento.',
              ]} />
            </SubSection>

            <SubSection title="12.2 Aceptación de las modificaciones">
              <P>
                12.2.1 Para <Bold>modificaciones sustanciales</Bold> (que afecten a las bases legales del tratamiento, nuevas categorías de datos, nuevos destinatarios o cambios significativos en los servicios), se requerirá la <Bold>aceptación expresa</Bold> del usuario en su próximo acceso a la Plataforma.
              </P>
              <P>12.2.2 El uso continuado de la Plataforma tras la notificación de modificaciones no sustanciales implicará la aceptación tácita de las mismas.</P>
              <P>12.2.3 Si el usuario no acepta las nuevas condiciones, podrá ejercer su derecho de supresión y solicitar la baja del servicio.</P>
            </SubSection>
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 13 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-13" number="13">Legislación Aplicable y Jurisdicción</SectionTitle>

            <SubSection title="13.1 Legislación aplicable">
              <P>Las presentes condiciones se rigen por la legislación española y europea, en particular:</P>
              <UL items={[
                <><Bold>Reglamento (UE) 2016/679</Bold> (RGPD) — Protección de datos personales.</>,
                <><Bold>Ley Orgánica 3/2018</Bold> (LOPDGDD) — Protección de datos y garantía de derechos digitales.</>,
                <><Bold>Ley 34/2002</Bold> (LSSI-CE) — Servicios de la sociedad de la información.</>,
                <><Bold>Real Decreto Legislativo 1/2007</Bold> — Texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios (en lo que resulte aplicable).</>,
                <><Bold>Directiva 2002/58/CE</Bold> (ePrivacy) — Privacidad en las comunicaciones electrónicas.</>,
              ]} />
            </SubSection>

            <SubSection title="13.2 Resolución de conflictos">
              <P>13.2.1 Las partes intentarán resolver de buena fe cualquier discrepancia derivada de estas condiciones.</P>
              <P>
                13.2.2 Para cualquier controversia que no pueda resolverse amistosamente, las partes se someten a los Juzgados y Tribunales de <Bold>[CIUDAD_JURISDICCIÓN]</Bold>, salvo que la normativa de consumidores otorgue al usuario el derecho a acudir a los tribunales de su domicilio.
              </P>
              <P>
                13.2.3 El usuario puede recurrir a la plataforma de resolución de litigios en línea de la UE:{' '}
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                  https://ec.europa.eu/consumers/odr
                </a>
              </P>
            </SubSection>
          </SectionCard>
        </div>

        {/* ═══════ SECCIÓN 14 ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="sec-14" number="14">Aceptación y Consentimiento</SectionTitle>

            <SubSection title="14.1 Declaración de aceptación">
              <P>Al registrarse en la Plataforma o al aceptar las presentes condiciones en su próximo acceso, el usuario declara que:</P>
              <UL items={[
                'Es mayor de 18 años.',
                'Ha leído íntegramente y comprende las presentes condiciones, la política de privacidad y la política de cookies.',
                'Acepta de forma libre, específica, informada e inequívoca el tratamiento de sus datos personales conforme a lo descrito en este documento.',
                'Se compromete a cumplir las obligaciones de uso establecidas en la sección 4.',
              ]} />
            </SubSection>

            <SubSection title="14.2 Mecanismo de aceptación">
              <P>14.2.1 <Bold>Nuevos usuarios</Bold>: Se requerirá marcar una casilla de aceptación explícita durante el proceso de registro con el texto:</P>
              <Note>
                &ldquo;He leído y acepto los Términos y Condiciones de Uso, Política de Privacidad y Política de Cookies. Entiendo que mis datos serán tratados conforme a lo descrito en dicho documento.&rdquo;
              </Note>

              <P>14.2.2 <Bold>Usuarios existentes</Bold>: En el próximo acceso tras la entrada en vigor de este documento, se mostrará una pantalla de aceptación obligatoria con el texto:</P>
              <Note>
                &ldquo;Hemos actualizado nuestros Términos y Condiciones, Política de Privacidad y Política de Cookies. Por favor, revísalos y confirma tu aceptación para continuar utilizando la Plataforma.&rdquo;
              </Note>

              <P>14.2.3 La aceptación se registrará en el sistema con la siguiente información:</P>
              <UL items={[
                'Identificador del usuario.',
                'Versión del documento aceptada.',
                'Fecha y hora de la aceptación.',
                'Dirección IP desde la que se realizó la aceptación.',
              ]} />

              <P>14.2.4 No será posible acceder a los servicios de la Plataforma sin haber aceptado expresamente las presentes condiciones.</P>
            </SubSection>

            <SubSection title="14.3 Revocación del consentimiento">
              <P>El usuario puede revocar su consentimiento en cualquier momento, lo que implicará la imposibilidad de seguir utilizando los servicios de la Plataforma. La revocación no afectará a la licitud del tratamiento realizado con anterioridad.</P>
            </SubSection>
          </SectionCard>
        </div>

        {/* ═══════ ANEXO I ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="anexo-1">Anexo I: Información Adicional sobre Tratamientos Automatizados</SectionTitle>

            <P>La Plataforma realiza los siguientes tratamientos automatizados de datos:</P>
            <Table
              headers={['Proceso', 'Descripción', 'Frecuencia', 'Impacto']}
              rows={[
                ['Generación automática de reservas', 'Al crear sesiones para un grupo, se crean reservas para todos los estudiantes matriculados', 'Por evento', 'Reserva de sesión automática'],
                ['Gestión automática de lista de espera', 'Al retirarse un estudiante, se promociona al siguiente en la cola', 'Por evento', 'Cambio de estado de matrícula'],
                ['Desactivación por impago', 'Cuentas con pagos vencidos más de 5 días se desactivan', 'Diariamente (03:00h)', 'Restricción de acceso'],
                ['Reactivación por pago', 'Cuentas que regularizan pagos se reactivan automáticamente', 'Por evento', 'Restauración de acceso'],
                ['Eliminación de cuentas no verificadas', 'Cuentas sin verificar tras 7 días se eliminan', 'Diariamente (04:00h)', 'Eliminación de datos'],
                ['Expiración de solicitudes', 'Solicitudes de matrícula pendientes expiran a las 48h', 'Cada hora', 'Rechazo automático'],
              ]}
            />

            <P>
              Ninguno de estos tratamientos automatizados constituye una <Bold>elaboración de perfiles</Bold> ni produce <Bold>decisiones individuales automatizadas</Bold> con efectos jurídicos significativos en el sentido del art. 22 del RGPD, ya que:
            </P>
            <UL items={[
              'No se evalúan aspectos personales del usuario.',
              'Son procesos operativos basados en reglas objetivas (tiempo transcurrido, estado de pago, orden de cola).',
              'El usuario puede contactar con la administración para revisar cualquier acción automatizada.',
            ]} />
          </SectionCard>
        </div>

        {/* ═══════ ANEXO II ═══════ */}
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <SectionCard>
            <SectionTitle id="anexo-2">Anexo II: Registro de Actividades de Tratamiento (Resumen — Art. 30 RGPD)</SectionTitle>

            <Table
              headers={['Actividad', 'Categorías de datos', 'Base legal', 'Destinatarios', 'Plazo conservación']}
              rows={[
                ['Gestión de cuentas de usuario', 'Identificativos, contacto, credenciales', 'Contrato (6.1.b)', 'Hetzner, Cloudflare', 'Duración + 5 años'],
                ['Gestión académica (matrículas, sesiones, asistencia)', 'Identificativos, académicos', 'Contrato (6.1.b)', 'Hetzner, Cloudflare', 'Duración + 5 años'],
                ['Facturación y pagos', 'Identificativos, financieros', 'Contrato (6.1.b), Obligación legal (6.1.c)', 'Hetzner, Cloudflare, Stripe (futuro)', '5 años'],
                ['Comunicaciones transaccionales (email)', 'Email, nombre', 'Contrato (6.1.b)', 'Google (Gmail SMTP)', 'No se conservan copias'],
                ['Seguridad de la plataforma', 'IP, User-Agent, logs', 'Interés legítimo (6.1.f)', 'Hetzner, Cloudflare', '90 días'],
                ['Analíticas web (futuro)', 'Datos de navegación', 'Consentimiento (6.1.a)', 'Por determinar', 'Máx. 26 meses'],
              ]}
            />
          </SectionCard>
        </div>

        {/* ═══════ Documento conforme a ═══════ */}
        <div className="rounded-xl bg-gray-100 p-6 sm:p-8 text-center">
          <P>
            <Bold>Documento redactado conforme a:</Bold>
          </P>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>Reglamento (UE) 2016/679 (RGPD)</span>
            <span>&middot;</span>
            <span>Ley Orgánica 3/2018 (LOPDGDD)</span>
            <span>&middot;</span>
            <span>Ley 34/2002 (LSSI-CE)</span>
            <span>&middot;</span>
            <span>Directiva 2002/58/CE (ePrivacy)</span>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>ISO/IEC 27001:2022</span>
            <span>&middot;</span>
            <span>ISO/IEC 27701:2019</span>
            <span>&middot;</span>
            <span>Guías y recomendaciones de la AEPD</span>
          </div>
          <p className="mt-6 text-sm italic text-gray-500">Fin del documento</p>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="AcaInfo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-white">AcaInfo</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">
                Inicio
              </Link>
              <Link to="/login" className="hover:text-white transition-colors">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="hover:text-white transition-colors">
                Registrarse
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} AcaInfo. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
