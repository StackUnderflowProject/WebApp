import { useTranslation } from 'react-i18next'

export const Footer = () => {
    const { t } = useTranslation()
    return (
        <footer className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text w-full z-50 mt-auto">
            <div className="mx-auto p-4">
                <div className="flex justify-evenly">
                    <div>
                        <h1 className="text-xl text-light-text dark:text-dark-text">Spotter</h1>
                        <p className="text-sm text-light-text dark:text-dark-text">
                            © 2024 Spotter. {t('footer.rights')}.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl text-light-text dark:text-dark-text">{t('footer.contact')}</h2>
                        <p className="text-sm text-light-text dark:text-dark-text">
                            Email: <a href="mailto:info@stack-underflow.com">info@stack-underflow.com</a>
                        </p>
                    </div>
                    <div>
                        <a href="/" className="text-xl text-light-text dark:text-dark-text">
                            {t('footer.terms')}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}