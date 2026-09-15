import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-5xl">🛜</p>
      <h1 className="mt-3 text-lg font-bold">بدون اینترنت</h1>
      <p className="mt-1 text-sm text-zinc-500">
        برنامه‌ها ذخیره شده‌اند ولی ویدیوها به اینترنت نیاز دارند.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white"
      >
        بازگشت به امروز
      </Link>
    </div>
  );
}