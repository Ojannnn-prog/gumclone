export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between font-bold">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-2xl font-black uppercase tracking-tighter">Gumclone</p>
          <p className="text-sm mt-1">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:underline underline-offset-4 decoration-2">Twitter</a>
          <a href="#" className="hover:underline underline-offset-4 decoration-2">Instagram</a>
          <a href="#" className="hover:underline underline-offset-4 decoration-2">Github</a>
        </div>
      </div>
    </footer>
  );
}
