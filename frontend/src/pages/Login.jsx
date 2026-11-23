import { useState } from "react";
import { translate } from "../i18n";

function Login({ onBack, onCreateAccount, onLogin, language = "English" }) {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const t = (text) => translate(text, language);

    function handleSubmit(event) {
        event.preventDefault();
        const nextErrors = {};

        if (!identifier.trim()) {
            nextErrors.identifier = t("Please enter your ID or mobile number.");
        }
        if (!password.trim()) {
            nextErrors.password = t("Please enter your password.");
        }

        setErrors(nextErrors);
        const valid = Object.keys(nextErrors).length === 0;
        setIsSubmitted(valid);
        if (valid) onLogin(identifier.trim());
    }

    return (
        <main className="login-page">
            <div className="login-decoration login-decoration-one" />
            <div className="login-decoration login-decoration-two" />

            <button className="login-back-button" onClick={onBack} type="button">
                <span aria-hidden="true">←</span> {t("Back to home")}
            </button>

            <section className="login-layout">
                <div className="login-welcome">
                    <div className="login-brand">
                        <span className="login-brand-icon" aria-hidden="true">🌱</span>
                        <span>AI Farm</span>
                    </div>
                    <p className="login-eyebrow">{t("SMART FARMING PLATFORM")}</p>
                    <h1>{t("Grow smarter.")}<br /><span>{t("Farm better.")}</span></h1>
                    <p className="login-description">
                        {t("Your farm's next great decision starts here. Access practical AI insights in one simple place.")}
                    </p>
                    <div className="login-illustration" aria-hidden="true">
                        <span className="illustration-sun">☀</span>
                        <span className="illustration-hill hill-back" />
                        <span className="illustration-hill hill-front" />
                        <span className="illustration-crops">🌱　🌱　🌱</span>
                    </div>
                </div>

                <div className="login-card">
                    <div className="login-card-heading">
                        <span className="login-card-icon" aria-hidden="true">🌾</span>
                        <div>
                            <p className="login-card-kicker">{t("WELCOME BACK")}</p>
                            <h2>{t("Login to AI Farm")}</h2>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <label htmlFor="identifier">{t("Login ID / Mobile Number")}</label>
                        <input
                            id="identifier"
                            type="text"
                            value={identifier}
                            onChange={(event) => setIdentifier(event.target.value)}
                            placeholder={t("Enter your ID or mobile")}
                            className={errors.identifier ? "input-error" : ""}
                        />
                        {errors.identifier && <p className="login-error">{errors.identifier}</p>}

                        <label htmlFor="password">{t("Password")}</label>
                        <div className="password-field">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder={t("Enter your password")}
                                className={errors.password ? "input-error" : ""}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword((visible) => !visible)}
                                aria-label={t(showPassword ? "Hide password" : "Show password")}
                            >
                                {t(showPassword ? "Hide" : "Show")}
                            </button>
                        </div>
                        {errors.password && <p className="login-error">{errors.password}</p>}

                        <div className="login-options">
                            <label className="remember-option">
                                <input type="checkbox" />
                                <span>{t("Remember me")}</span>
                            </label>
                            <button type="button" className="forgot-button">{t("Forgot Password?")}</button>
                        </div>

                        <button className="login-submit" type="submit">
                            <span>{t("LOGIN")}</span><span aria-hidden="true">→</span>
                        </button>
                        {isSubmitted && <p className="login-success">{t("Details received. Connecting you to AI Farm...")}</p>}
                    </form>

                    <div className="login-divider"><span>{t("OR")}</span></div>
                    <p className="new-account">{t("New to AI Farm?")}</p>
                    <button className="create-account" type="button" onClick={onCreateAccount}>{t("Create an Account")}</button>
                </div>
            </section>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@700;800&display=swap');

                .login-page {
                    --forest: #123f2a;
                    --green: #208c4a;
                    --lime: #dff3df;
                    --ink-soft: #668073;
                    position: relative;
                    min-height: 100vh;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 72px 7vw 40px;
                    color: var(--forest);
                    background: linear-gradient(135deg, #f5fbf4 0%, #ffffff 52%, #edf8ed 100%);
                    font-family: 'DM Sans', sans-serif;
                }

                .login-page::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    opacity: .45;
                    background-image: radial-gradient(#b9dcbf 1px, transparent 1px);
                    background-size: 28px 28px;
                    mask-image: linear-gradient(to bottom right, black, transparent 55%);
                }

                .login-decoration { position: absolute; border-radius: 50%; pointer-events: none; }
                .login-decoration-one { width: 260px; height: 260px; right: -80px; top: -100px; background: #d8f0db; }
                .login-decoration-two { width: 180px; height: 180px; left: -80px; bottom: -70px; background: #e8f5d7; }
                .login-back-button {
                    position: absolute; top: 28px; left: 7vw; z-index: 2; border: 0; background: transparent;
                    color: var(--forest); font: 600 14px 'DM Sans', sans-serif; cursor: pointer; transition: transform .2s ease, color .2s ease;
                }
                .login-back-button:hover { color: var(--green); transform: translateX(-4px); }
                .login-layout { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 440px); align-items: center; gap: clamp(50px, 9vw, 150px); width: min(1050px, 100%); }
                .login-welcome { animation: login-rise .65s ease both; }
                .login-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 60px; font: 800 25px 'Manrope', sans-serif; }
                .login-brand-icon { display: grid; place-items: center; width: 43px; height: 43px; border-radius: 14px; background: var(--green); font-size: 23px; box-shadow: 0 7px 16px #208c4a33; }
                .login-eyebrow, .login-card-kicker { margin: 0 0 14px; color: var(--green); font-size: 11px; font-weight: 700; letter-spacing: 2px; }
                .login-welcome h1 { margin: 0; font: 800 clamp(42px, 5vw, 70px)/1.02 'Manrope', sans-serif; letter-spacing: -2px; }
                .login-welcome h1 span { color: var(--green); }
                .login-description { max-width: 480px; margin: 23px 0 0; color: var(--ink-soft); font-size: 17px; line-height: 1.7; }
                .login-illustration { position: relative; height: 130px; max-width: 480px; margin-top: 34px; overflow: hidden; border-radius: 24px; background: linear-gradient(#d9f1dc, #eff8dc); }
                .illustration-sun { position: absolute; top: 18px; right: 42px; color: #f2b632; font-size: 39px; animation: sun-pulse 3s ease-in-out infinite; }
                .illustration-hill { position: absolute; bottom: -50px; width: 75%; height: 100px; border-radius: 50% 50% 0 0; transform: rotate(-5deg); }
                .hill-back { left: -10%; background: #8bc47f; }
                .hill-front { right: -10%; background: #4e9b55; }
                .illustration-crops { position: absolute; bottom: 18px; left: 25px; z-index: 1; font-size: 27px; letter-spacing: 3px; }
                .login-card { animation: login-rise .65s .12s ease both; padding: 39px clamp(27px, 4vw, 45px); border: 1px solid #d8eadb; border-radius: 25px; background: rgba(255,255,255,.9); box-shadow: 0 22px 60px #245b3720; backdrop-filter: blur(10px); }
                .login-card-heading { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; }
                .login-card-icon { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 15px; background: var(--lime); font-size: 25px; }
                .login-card-kicker { margin-bottom: 4px; font-size: 10px; }
                .login-card h2 { margin: 0; font: 800 25px 'Manrope', sans-serif; }
                .login-card form > label { display: block; margin: 20px 0 9px; font-size: 13px; font-weight: 700; }
                .login-card input[type='text'], .login-card input[type='password'] { display: block; box-sizing: border-box; width: 100%; max-width: 100%; height: 49px; padding: 0 15px; border: 1px solid #d8e7db; border-radius: 10px; outline: none; color: var(--forest); background: #fbfefb; font: 14px 'DM Sans', sans-serif; transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease; }
                .login-card input:focus { border-color: var(--green); box-shadow: 0 0 0 4px #208c4a18; transform: translateY(-1px); }
                .login-card input::placeholder { color: #9aac9f; }
                .password-field { position: relative; width: 100%; min-width: 0; }
                .password-field input { padding-right: 62px !important; }
                .password-toggle { position: absolute; top: 50%; right: 12px; transform: translateY(-50%); border: 0; color: var(--green); background: transparent; font-size: 12px; font-weight: 700; cursor: pointer; }
                .login-error { margin: 6px 0 -7px; color: #c84a42; font-size: 12px; }
                .input-error { border-color: #d66b64 !important; }
                .login-options { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin: 19px 0 26px; font-size: 12px; }
                .remember-option { display: flex; align-items: center; gap: 7px; cursor: pointer; }
                .remember-option input { accent-color: var(--green); }
                .forgot-button, .create-account { border: 0; color: var(--green); background: transparent; font: 700 12px 'DM Sans', sans-serif; cursor: pointer; }
                .forgot-button:hover, .create-account:hover { text-decoration: underline; }
                .login-submit { display: flex; align-items: center; justify-content: center; gap: 13px; width: 100%; height: 50px; border: 0; border-radius: 10px; color: white; background: var(--green); box-shadow: 0 10px 18px #208c4a2e; font: 700 13px 'DM Sans', sans-serif; letter-spacing: 1px; cursor: pointer; transition: transform .2s ease, box-shadow .2s ease, background .2s ease; }
                .login-submit:hover { background: var(--forest); transform: translateY(-2px); box-shadow: 0 13px 22px #123f2a38; }
                .login-submit:active, .create-account:active { transform: scale(.97); }
                .login-success { margin: 12px 0 0; color: var(--green); font-size: 12px; text-align: center; }
                .login-divider { display: flex; align-items: center; gap: 12px; margin: 28px 0 20px; color: #9bad9f; font-size: 11px; font-weight: 700; }
                .login-divider::before, .login-divider::after { content: ''; height: 1px; flex: 1; background: #e0ebe1; }
                .new-account { margin: 0 0 11px; color: var(--ink-soft); font-size: 13px; text-align: center; }
                .create-account { display: block; width: 100%; padding: 10px; }
                @keyframes login-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes sun-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1) rotate(8deg); } }
                @media (max-width: 760px) {
                    .login-page { align-items: flex-start; padding: 86px 22px 35px; }
                    .login-layout { display: block; }
                    .login-welcome { margin-bottom: 30px; text-align: center; }
                    .login-brand { justify-content: center; margin-bottom: 35px; }
                    .login-welcome h1 { font-size: 43px; }
                    .login-description { margin-right: auto; margin-left: auto; font-size: 15px; }
                    .login-illustration { display: none; }
                    .login-card { padding: 30px 24px; }
                    .login-back-button { left: 22px; }
                }
            `}</style>
        </main>
    );
}

export default Login;
