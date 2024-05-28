export const Footer = () => {
    return (
        <footer className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text w-full rounded-xl mt-8">
            <div className="mx-auto mt-8 mb-8 p-4">
                <div className="flex justify-evenly">
                    <div>
                        <h1 className="text-2xl">INSERT APP NAME</h1>
                        <p className="text-sm">© 2024 INSERT APP NAME. All rights reserved.</p>
                    </div>
                    <div>
                        <h2 className="text-xl">Contact</h2>
                        <p className="text-sm">
                            Email: <a href="mailto:info@stack-underflow.com">info@stack-underflow.com</a>
                        </p>
                    </div>
                    <div>
                        <a href="/" className="text-xl">
                            Terms
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}