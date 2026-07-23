export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        <p className="text-sm text-gray-600">
          © 2026 ACIST São Leopoldo. Todos os direitos reservados.
        </p>

        <div className="flex items-center gap-6 text-sm">

          <a
            href="https://www.acistsl.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#226897] transition-colors"
          >
            Sobre
          </a>

          <a
            href="https://api.whatsapp.com/send/?phone=5551999999999&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#226897] transition-colors"
          >
            Contato
          </a>

          <a
            href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#226897] transition-colors"
          >
            Privacidade
          </a>

        </div>

      </div>
    </footer>
  );
}