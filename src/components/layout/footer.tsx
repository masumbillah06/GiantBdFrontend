export default function Footer() {
  return (
    <footer className="w-full shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          © 2026 <span className="text-[#F68B1E] font-medium">GIANT BD Co. Ltd</span> All Rights Reserved.
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Developed by{" "}
          <a
            href="https://trendsbird.com/"
            target="_blank"
            rel="noopener noreferrer"
            title="House 14 (Level 4), Road 13, Sector 03, Uttara Model Town, Dhaka – 1230"
            className="hover:underline text-[#F68B1E] font-medium transition-all"
          >
            Trends Bird Limited
          </a>
        </div>
      </div>
    </footer>
  );
}
