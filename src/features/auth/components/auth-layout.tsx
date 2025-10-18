import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md space-y-6">
                <Link href="/" className="flex items-center justify-center mb-6 text-2xl font-bold">
                    <Image src="/logos/logo.svg" alt="Logo" width={42} height={42} /> Automa
                </Link>
                {children}
            </div>

        </div>
    );
};

export default AuthLayout;