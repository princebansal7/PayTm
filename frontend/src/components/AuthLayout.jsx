export function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center px-4 py-10">
            {/* Hero */}
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-11 h-11 rounded-xl bg-green-500 flex items-center justify-center shadow-md">
                        <span className="text-white font-extrabold text-2xl leading-none">M</span>
                    </div>
                    <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        MoneyMate
                    </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">Send money to anyone, instantly.</p>
            </div>

            {/* Form card */}
            <div className="rounded-2xl bg-white w-full max-w-md text-center p-8 shadow-2xl shadow-stone-400">
                {children}
            </div>
        </div>
    );
}
