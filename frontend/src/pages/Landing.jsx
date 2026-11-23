import React from "react";
import { translate } from "../i18n";

function Landing({ onGetStarted, language = "English" }) {
    const t = (text) => translate(text, language);
    const features = [
        {
            icon: "🌾",
            title: "Crop Recommendation",
            description:
                "Get suitable crop suggestions based on soil, location and environmental conditions.",
        },
        {
            icon: "📷",
            title: "Plant Disease Detection",
            description:
                "Upload a plant image and use AI to identify possible plant diseases.",
        },
        {
            icon: "🌦️",
            title: "Weather Advisory",
            description:
                "Receive useful farming suggestions based on weather conditions.",
        },
        {
            icon: "📈",
            title: "Crop Yield Prediction",
            description:
                "Predict expected crop yield using agricultural and environmental data.",
        },
        {
            icon: "💰",
            title: "Market Price Prediction",
            description:
                "Understand possible market price trends and plan your selling decisions.",
        },
        {
            icon: "🧪",
            title: "Fertilizer Recommendation",
            description:
                "Get AI-based fertilizer suggestions according to crop and soil conditions.",
        },
        {
            icon: "🌱",
            title: "Soil Health Analysis",
            description:
                "Analyze important soil parameters and understand the condition of your land.",
        },
        {
            icon: "💹",
            title: "Profit Prediction",
            description:
                "Estimate possible revenue, expenses and profit before making farming decisions.",
        },
    ];

    const scrollToFeatures = () => {
        document.getElementById("features")?.scrollIntoView({
            behavior: "smooth",
        });
    };

    return (
        <div className="landing-page">

            {/* ================= NAVBAR ================= */}
            <nav className="navbar">

                <div className="logo">
                    <span className="logo-icon">🌱</span>
                    <span>AI Farm</span>
                </div>

                <div className="nav-links">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        {t("Home")}
                    </button>

                    <button onClick={scrollToFeatures}>
                        {t("Features")}
                    </button>

                    <button
                        onClick={() =>
                            document.getElementById("why-us")?.scrollIntoView({
                                behavior: "smooth",
                            })
                        }
                    >
                        {t("Why Us")}
                    </button>

                    <button
                        onClick={() =>
                            document.getElementById("how-it-works")?.scrollIntoView({
                                behavior: "smooth",
                            })
                        }
                    >
                        {t("How It Works")}
                    </button>
                </div>

                <button
                    className="nav-button"
                    onClick={onGetStarted}
                >
                    {t("Get Started")}
                </button>

            </nav>


            {/* ================= HERO SECTION ================= */}
            <section className="hero">

                <div className="hero-content">

                    <div className="hero-badge">
                        🌱 {t("AI-Powered Agriculture")}
                    </div>

                    <h1>
                        {t("Smarter Farming.")}
                        <br />
                        <span>{t("Better Decisions.")}</span>
                    </h1>

                    <p>
                        {t("AI Farm Management Platform helps farmers make better farming decisions using Artificial Intelligence and Machine Learning.")}
                    </p>

                    <div className="hero-buttons">

                        <button
                            className="primary-button"
                            onClick={onGetStarted}
                        >
                            {t("Get Started")} →
                        </button>

                        <button
                            className="secondary-button"
                            onClick={scrollToFeatures}
                        >
                            {t("Explore Features")}
                        </button>

                    </div>

                    <div className="hero-stats">

                        <div>
                            <strong>8+</strong>
                            <span>{t("AI Features")}</span>
                        </div>

                        <div>
                            <strong>1</strong>
                            <span>{t("Unified Platform")}</span>
                        </div>

                        <div>
                            <strong>24/7</strong>
                            <span>{t("Access")}</span>
                        </div>

                    </div>

                </div>


                <div className="hero-visual">

                    <div className="farm-card">

                        <div className="sun">☀️</div>

                        <div className="farm-land">

                            <div className="tree tree-one">🌳</div>
                            <div className="tree tree-two">🌳</div>

                            <div className="crop-row">
                                🌱 🌱 🌱 🌱 🌱
                            </div>

                            <div className="crop-row">
                                🌱 🌱 🌱 🌱 🌱
                            </div>

                            <div className="crop-row">
                                🌱 🌱 🌱 🌱 🌱
                            </div>

                        </div>

                        <div className="floating-card weather-card">
                            🌦️
                            <div>
                                <strong>{t("Weather")}</strong>
                                <small>{t("Smart Advisory")}</small>
                            </div>
                        </div>

                        <div className="floating-card ai-card">
                            🤖
                            <div>
                                <strong>{t("AI Analysis")}</strong>
                                <small>{t("Ready to help")}</small>
                            </div>
                        </div>

                    </div>

                </div>

            </section>


            {/* ================= PROBLEM SECTION ================= */}
            <section className="section problems">

                <div className="section-heading">

                    <span className="section-label">
                        {t("THE PROBLEM")}
                    </span>

                    <h2>
                        {t("Farming decisions can be difficult.")}
                    </h2>

                    <p>
                        {t("Farmers often need to make important decisions without having all the information they need.")}
                    </p>

                </div>


                <div className="problem-grid">

                    <div className="problem-card">
                        <span>🦠</span>
                        <h3>{t("Plant Diseases")}</h3>
                        <p>
                            {t("Diseases can affect crops before they are identified.")}
                        </p>
                    </div>

                    <div className="problem-card">
                        <span>🌾</span>
                        <h3>{t("Crop Selection")}</h3>
                        <p>
                            {t("Choosing the right crop depends on many conditions.")}
                        </p>
                    </div>

                    <div className="problem-card">
                        <span>💧</span>
                        <h3>{t("Resource Usage")}</h3>
                        <p>
                            {t("Incorrect fertilizer and resource usage can increase costs.")}
                        </p>
                    </div>

                    <div className="problem-card">
                        <span>💰</span>
                        <h3>{t("Market Decisions")}</h3>
                        <p>
                            {t("Farmers may not know when or where to sell their produce.")}
                        </p>
                    </div>

                </div>

            </section>


            {/* ================= FEATURES ================= */}
            <section className="section features-section" id="features">

                <div className="section-heading">

                    <span className="section-label">
                        {t("OUR AI FEATURES")}
                    </span>

                    <h2>
                        {t("Everything a farmer needs in one platform.")}
                    </h2>

                    <p>
                        {t("Our platform combines multiple AI and ML solutions to support farmers throughout the farming process.")}
                    </p>

                </div>


                <div className="feature-grid">

                    {features.map((feature, index) => (

                        <div className="feature-card" key={index}>

                            <div className="feature-icon">
                                {feature.icon}
                            </div>

                            <h3>{t(feature.title)}</h3>

                            <p>{t(feature.description)}</p>

                            <span className="learn-more">
                                {t("Explore")} →
                            </span>

                        </div>

                    ))}

                </div>

            </section>


            {/* ================= WHY US ================= */}
            <section className="section why-section" id="why-us">

                <div className="why-content">

                    <div>

                        <span className="section-label">
                            {t("WHY OUR PLATFORM")}
                        </span>

                        <h2>{t("Technology should make farming easier.")}</h2>

                        <p>
                            {t("We are building this platform with farmers in mind. Instead of requiring farmers to use multiple complicated systems, our goal is to provide useful agricultural intelligence in one simple platform.")}
                        </p>

                    </div>


                    <div className="advantages">

                        <div className="advantage">
                            <span>✓</span>
                            <div>
                                <h3>{t("Simple to Use")}</h3>
                                <p>
                                    {t("Designed with a farmer-friendly interface.")}
                                </p>
                            </div>
                        </div>

                        <div className="advantage">
                            <span>✓</span>
                            <div>
                                <h3>{t("AI-Based Decisions")}</h3>
                                <p>
                                    {t("Machine learning helps turn data into useful recommendations.")}
                                </p>
                            </div>
                        </div>

                        <div className="advantage">
                            <span>✓</span>
                            <div>
                                <h3>{t("Multiple Tools in One Place")}</h3>
                                <p>
                                    {t("Farmers can access different agricultural tools from one dashboard.")}
                                </p>
                            </div>
                        </div>

                        <div className="advantage">
                            <span>✓</span>
                            <div>
                                <h3>{t("Personalized Results")}</h3>
                                <p>
                                    {t("Recommendations can use the farmer's location and farm information.")}
                                </p>
                            </div>
                        </div>

                    </div>

                </div>

            </section>


            {/* ================= HOW IT WORKS ================= */}
            <section className="section how-section" id="how-it-works">

                <div className="section-heading">

                    <span className="section-label">
                        {t("HOW IT WORKS")}
                    </span>

                    <h2>
                        {t("Simple steps for smarter decisions.")}
                    </h2>

                </div>


                <div className="steps">

                    <div className="step">
                        <div className="step-number">01</div>
                        <h3>{t("Create Account")}</h3>
                        <p>
                            {t("Register using your personal and basic farm details.")}
                        </p>
                    </div>

                    <div className="step">
                        <div className="step-number">02</div>
                        <h3>{t("Enter Information")}</h3>
                        <p>
                            {t("Provide the required information for the selected AI feature.")}
                        </p>
                    </div>

                    <div className="step">
                        <div className="step-number">03</div>
                        <h3>{t("AI Analysis")}</h3>
                        <p>
                            {t("Our AI/ML models analyze the provided information.")}
                        </p>
                    </div>

                    <div className="step">
                        <div className="step-number">04</div>
                        <h3>{t("Get Insights")}</h3>
                        <p>
                            {t("Receive understandable results and recommendations.")}
                        </p>
                    </div>

                </div>

            </section>


            {/* ================= SUPPORT CTA ================= */}
            <section className="support-section">

                <div>

                    <span className="support-icon">
                        🎫
                    </span>

                    <h2>
                        {t("Need help using the platform?")}
                    </h2>

                    <p>
                        {t("Farmers can raise a support ticket if they have questions or need assistance.")}
                    </p>

                    <button
                        className="support-button"
                        onClick={() =>
                            alert(t("Support system will be connected later."))
                        }
                    >
                        {t("Get Support")}
                    </button>

                </div>

            </section>


            {/* ================= FOOTER ================= */}
            <footer className="footer">

                <div className="footer-main">

                    <div className="footer-brand">

                        <div className="logo">
                            <span className="logo-icon">🌱</span>
                            <span>AI Farm</span>
                        </div>

                        <p>{t("AI-powered decision support for smarter and more informed farming.")}</p>

                    </div>


                    <div className="footer-links">

                        <div>
                            <h4>{t("Platform")}</h4>
                            <p>{t("Crop Recommendation")}</p>
                            <p>{t("Disease Detection")}</p>
                            <p>{t("Yield Prediction")}</p>
                            <p>{t("Market Prediction")}</p>
                        </div>

                        <div>
                            <h4>{t("Support")}</h4>
                            <p>{t("Farmer Support")}</p>
                            <p>{t("Reports")}</p>
                            <p>{t("Help Center")}</p>
                        </div>

                        <div>
                            <h4>{t("Account")}</h4>
                            <p>{t("Login")}</p>
                            <p>{t("Create Account")}</p>
                        </div>

                    </div>

                </div>


                <div className="footer-bottom">
                    <p>{t("© 2026 AI Farm Management Platform. All rights reserved.")}</p>

                    <p>{t("Built with AI & Machine Learning")}</p>
                </div>

            </footer>


            {/* ================= PAGE STYLES ================= */}
            <style>{`

                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                body {
                    font-family: Arial, Helvetica, sans-serif;
                    background: #f7faf7;
                    color: #183321;
                }

                button {
                    font-family: inherit;
                    cursor: pointer;
                }

                .landing-page {
                    width: 100%;
                    overflow-x: hidden;
                    background: #f7faf7;
                }

                /* NAVBAR */

                .navbar {
                    height: 76px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 7%;
                    background: rgba(255,255,255,0.96);
                    border-bottom: 1px solid #e5eee6;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    font-size: 21px;
                    font-weight: 800;
                    color: #174c2b;
                }

                .logo-icon {
                    font-size: 27px;
                }

                .nav-links {
                    display: flex;
                    gap: 32px;
                }

                .nav-links button {
                    border: none;
                    background: transparent;
                    color: #52645a;
                    font-size: 14px;
                    font-weight: 600;
                }

                .nav-links button:hover {
                    color: #238b45;
                }

                .nav-button,
                .primary-button {
                    border: none;
                    background: #238b45;
                    color: white;
                    font-weight: 700;
                    border-radius: 10px;
                    padding: 13px 22px;
                    transition: 0.2s;
                }

                .nav-button:hover,
                .primary-button:hover {
                    background: #176b33;
                    transform: translateY(-2px);
                }

                /* HERO */

                .hero {
                    min-height: 650px;
                    padding: 80px 7%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 60px;
                    background:
                        radial-gradient(circle at 10% 20%, #e6f5e9, transparent 35%),
                        linear-gradient(135deg, #f8fcf8, #edf7ef);
                }

                .hero-content {
                    max-width: 650px;
                }

                .hero-badge {
                    display: inline-block;
                    padding: 8px 14px;
                    background: #e2f3e6;
                    color: #23753d;
                    border-radius: 30px;
                    font-size: 13px;
                    font-weight: 700;
                    margin-bottom: 22px;
                }

                .hero h1 {
                    font-size: clamp(45px, 6vw, 76px);
                    line-height: 1.04;
                    letter-spacing: -3px;
                    margin-bottom: 25px;
                    color: #153a22;
                }

                .hero h1 span {
                    color: #238b45;
                }

                .hero-content > p {
                    font-size: 18px;
                    line-height: 1.7;
                    color: #637269;
                    max-width: 590px;
                    margin-bottom: 30px;
                }

                .hero-buttons {
                    display: flex;
                    gap: 14px;
                }

                .primary-button {
                    padding: 15px 25px;
                    font-size: 15px;
                }

                .secondary-button {
                    padding: 14px 24px;
                    border-radius: 10px;
                    border: 1px solid #bdd2c2;
                    background: white;
                    color: #255636;
                    font-weight: 700;
                }

                .hero-stats {
                    display: flex;
                    gap: 45px;
                    margin-top: 45px;
                }

                .hero-stats div {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .hero-stats strong {
                    font-size: 25px;
                    color: #1b6133;
                }

                .hero-stats span {
                    color: #7a877e;
                    font-size: 12px;
                }

                /* FARM VISUAL */

                .hero-visual {
                    width: 43%;
                    min-width: 390px;
                }

                .farm-card {
                    height: 440px;
                    position: relative;
                    overflow: hidden;
                    border-radius: 30px;
                    background: linear-gradient(#dff2ff 0%, #e9f7ff 48%, #8ac76b 49%, #3e8b3c 100%);
                    box-shadow: 0 25px 60px rgba(40, 91, 49, 0.18);
                }

                .sun {
                    position: absolute;
                    right: 45px;
                    top: 35px;
                    font-size: 48px;
                }

                .farm-land {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 51%;
                    padding: 65px 35px 25px;
                    background: #754f32;
                    transform: skewY(-3deg);
                }

                .tree {
                    position: absolute;
                    font-size: 75px;
                    top: -95px;
                }

                .tree-one {
                    left: 20px;
                }

                .tree-two {
                    right: 45px;
                }

                .crop-row {
                    color: #d8f5bb;
                    font-size: 29px;
                    margin: 9px 0;
                    letter-spacing: 15px;
                    transform: skewY(3deg);
                }

                .floating-card {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    background: rgba(255,255,255,0.94);
                    padding: 13px 16px;
                    border-radius: 14px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
                    font-size: 25px;
                }

                .floating-card div {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }

                .floating-card strong {
                    font-size: 13px;
                    color: #21442c;
                }

                .floating-card small {
                    font-size: 10px;
                    color: #829087;
                }

                .weather-card {
                    top: 110px;
                    left: 25px;
                }

                .ai-card {
                    bottom: 30px;
                    right: 25px;
                }

                /* COMMON SECTION */

                .section {
                    padding: 100px 7%;
                }

                .section-heading {
                    max-width: 720px;
                    margin: 0 auto 55px;
                    text-align: center;
                }

                .section-label {
                    color: #258b47;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 2px;
                }

                .section-heading h2,
                .why-content h2 {
                    margin: 13px 0 16px;
                    font-size: clamp(32px, 4vw, 48px);
                    line-height: 1.15;
                    color: #183c24;
                }

                .section-heading p,
                .why-content > div > p {
                    color: #68776d;
                    line-height: 1.7;
                    font-size: 16px;
                }

                /* PROBLEMS */

                .problems {
                    background: white;
                }

                .problem-grid {
                    max-width: 1100px;
                    margin: auto;
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                }

                .problem-card {
                    padding: 28px;
                    border: 1px solid #e4ece5;
                    border-radius: 18px;
                    background: #fbfdfb;
                }

                .problem-card > span {
                    font-size: 35px;
                }

                .problem-card h3 {
                    margin: 20px 0 10px;
                    font-size: 18px;
                }

                .problem-card p {
                    color: #748077;
                    line-height: 1.6;
                    font-size: 14px;
                }

                /* FEATURES */

                .feature-grid {
                    max-width: 1100px;
                    margin: auto;
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                }

                .feature-card {
                    background: white;
                    border: 1px solid #e3ebe4;
                    border-radius: 18px;
                    padding: 25px;
                    transition: 0.25s;
                }

                .feature-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 35px rgba(36, 91, 49, 0.1);
                    border-color: #b8d8c0;
                }

                .feature-icon {
                    width: 50px;
                    height: 50px;
                    display: grid;
                    place-items: center;
                    background: #edf7ef;
                    border-radius: 13px;
                    font-size: 25px;
                    margin-bottom: 20px;
                }

                .feature-card h3 {
                    font-size: 17px;
                    margin-bottom: 10px;
                }

                .feature-card p {
                    color: #748077;
                    font-size: 13px;
                    line-height: 1.6;
                    min-height: 65px;
                }

                .learn-more {
                    display: inline-block;
                    margin-top: 18px;
                    color: #258b47;
                    font-size: 12px;
                    font-weight: 800;
                }

                /* WHY US */

                .why-section {
                    background: #eaf5ec;
                }

                .why-content {
                    max-width: 1100px;
                    margin: auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 90px;
                    align-items: center;
                }

                .why-content > div > p {
                    max-width: 550px;
                }

                .advantages {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .advantage {
                    display: flex;
                    gap: 15px;
                    padding: 18px;
                    background: rgba(255,255,255,0.7);
                    border-radius: 14px;
                }

                .advantage > span {
                    width: 30px;
                    height: 30px;
                    display: grid;
                    place-items: center;
                    background: #2a914b;
                    color: white;
                    border-radius: 50%;
                    font-weight: bold;
                }

                .advantage h3 {
                    font-size: 15px;
                    margin-bottom: 5px;
                }

                .advantage p {
                    font-size: 13px;
                    color: #748077;
                }

                /* HOW IT WORKS */

                .steps {
                    max-width: 1100px;
                    margin: auto;
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 25px;
                }

                .step {
                    text-align: center;
                    position: relative;
                }

                .step-number {
                    width: 60px;
                    height: 60px;
                    display: grid;
                    place-items: center;
                    margin: 0 auto 20px;
                    border-radius: 50%;
                    background: #dff0e3;
                    color: #21743a;
                    font-weight: 800;
                }

                .step h3 {
                    margin-bottom: 10px;
                    font-size: 17px;
                }

                .step p {
                    color: #77847b;
                    font-size: 13px;
                    line-height: 1.6;
                }

                /* SUPPORT */

                .support-section {
                    padding: 80px 7%;
                    text-align: center;
                    background: #1b5730;
                    color: white;
                }

                .support-icon {
                    font-size: 40px;
                }

                .support-section h2 {
                    font-size: 35px;
                    margin: 15px 0 10px;
                }

                .support-section p {
                    color: #d2e5d6;
                    margin-bottom: 25px;
                }

                .support-button {
                    border: none;
                    padding: 13px 24px;
                    border-radius: 9px;
                    background: white;
                    color: #1b5730;
                    font-weight: 800;
                }

                /* FOOTER */

                .footer {
                    background: #102d1a;
                    color: white;
                    padding: 60px 7% 25px;
                }

                .footer-main {
                    max-width: 1100px;
                    margin: auto;
                    display: flex;
                    justify-content: space-between;
                    gap: 60px;
                }

                .footer-brand {
                    max-width: 300px;
                }

                .footer-brand .logo {
                    color: white;
                }

                .footer-brand p {
                    color: #9fb2a4;
                    font-size: 13px;
                    line-height: 1.7;
                    margin-top: 15px;
                }

                .footer-links {
                    display: flex;
                    gap: 70px;
                }

                .footer-links h4 {
                    margin-bottom: 15px;
                    font-size: 14px;
                }

                .footer-links p {
                    color: #9fb2a4;
                    font-size: 12px;
                    margin: 10px 0;
                }

                .footer-bottom {
                    max-width: 1100px;
                    margin: 45px auto 0;
                    padding-top: 20px;
                    border-top: 1px solid #294633;
                    display: flex;
                    justify-content: space-between;
                    color: #849b8b;
                    font-size: 11px;
                }

                /* RESPONSIVE */

                @media (max-width: 1000px) {

                    .nav-links {
                        display: none;
                    }

                    .hero {
                        flex-direction: column;
                    }

                    .hero-content {
                        max-width: 800px;
                        text-align: center;
                    }

                    .hero-content > p {
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .hero-buttons,
                    .hero-stats {
                        justify-content: center;
                    }

                    .hero-visual {
                        width: 100%;
                        max-width: 600px;
                    }

                    .problem-grid,
                    .feature-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .why-content {
                        grid-template-columns: 1fr;
                    }

                    .steps {
                        grid-template-columns: repeat(2, 1fr);
                        row-gap: 45px;
                    }

                }

                @media (max-width: 600px) {

                    .navbar {
                        padding: 0 5%;
                    }

                    .nav-button {
                        padding: 10px 13px;
                        font-size: 12px;
                    }

                    .hero {
                        padding: 60px 5%;
                    }

                    .hero h1 {
                        letter-spacing: -2px;
                    }

                    .hero-buttons {
                        flex-direction: column;
                    }

                    .hero-stats {
                        gap: 20px;
                    }

                    .hero-visual {
                        min-width: 0;
                    }

                    .farm-card {
                        height: 350px;
                    }

                    .section {
                        padding: 70px 5%;
                    }

                    .problem-grid,
                    .feature-grid,
                    .steps {
                        grid-template-columns: 1fr;
                    }

                    .footer-main {
                        flex-direction: column;
                    }

                    .footer-links {
                        flex-wrap: wrap;
                        gap: 35px;
                    }

                    .footer-bottom {
                        flex-direction: column;
                        gap: 10px;
                    }

                }

            `}</style>

        </div>
    );
}

export default Landing;