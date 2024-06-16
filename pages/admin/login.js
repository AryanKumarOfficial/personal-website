// pages/LoginPage.js
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import Layout from '../../components/layout';
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            router.push('/admin'); // Redirect if already logged in
        }
    }, [session, router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            email: username,
            password,
        });

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Logged in successfully', { duration: 3000 });
            setTimeout(() => {
                router.push('/admin');
            }, 3000);
        }
    };

    return (
        <Layout>
            <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center justify-center"
            >
                <div className=" flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <Toaster
                        position="top-center"
                        reverseOrder={true}
                    />
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <div className=" py-8 px-4  sm:rounded-lg sm:px-10">
                            <div>
                                <h2 className="mt-6 text-center  text-3xl font-extrabold">
                                    Sign in to your account
                                </h2>
                            </div>
                            <form method="POST" className="mt-8 space-y-6" onSubmit={handleLogin}>
                                <input type="hidden" name="remember" value="true" />
                                <div className="rounded-md shadow-sm grid grid-flow-row gap-4">
                                    <div>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            autoComplete="username"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 dark:text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out bg-black dark:bg-white text-white"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="group relative w-full flex justify-center py-2 px-4 border-none text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div></motion.div>
        </Layout>
    );
};

export default LoginPage;
