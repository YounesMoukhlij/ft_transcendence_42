
const _2fa = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-4 text-2xl font-bold">Two-Factor Authentication</h1>
        <p className="mb-8 text-center text-gray-700">
            Please enter the 6-digit code from your authenticator app to continue.
        </p>
        <form className="w-full max-w-sm">
            {/* 6 input each one contain 1 digit */}
            <div className="mb-4 flex justify-between">
                {[...Array(6)].map((_, i) => (
                    <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-12 rounded border border-gray-300 p-2 text-center text-xl focus:border-blue-500 focus:outline-none"
                    />
                ))}
            </div>
            <button
                type="submit"
                className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
            >
                Verify
            </button>
        </form>

    </div>
  )
}

export default _2fa