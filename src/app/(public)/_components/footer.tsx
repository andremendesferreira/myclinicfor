export function Footer() {
  return (
      <footer className="bg-linear-to-r from-white via-blue-200 to-indigo-200 text-zinc-900 py-4 px-6 flex font-semibold text-sm justify-center items-center">
        <p>
          Todos os direitos reservados &copy; {new Date().getFullYear()} MyClinicSOL.
        </p>
      </footer>
  );
}