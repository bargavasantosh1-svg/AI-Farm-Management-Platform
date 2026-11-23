import React from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import CropRecommendation from "./pages/CropRecommendation";
import DiseaseDetection from "./pages/DiseaseDetection";
import WeatherAdvisory from "./pages/WeatherAdvisory";
import YieldPrediction from "./pages/YieldPrediction";
import MarketPrediction from "./pages/MarketPrediction";
import FertilizerRecommendation from "./pages/FertilizerRecommendation";
import SoilHealth from "./pages/SoilHealth";
import ProfitPrediction from "./pages/ProfitPrediction";
import Support from "./pages/Support";
import { LANGUAGE_TAGS, SUPPORTED_LANGUAGES, TRANSLATION_TAGS, translate } from "./i18n";

function splitTextByUtf8(text, maxBytes) {
    const encoder = new TextEncoder();
    const chunks = [];
    const sentences = text.match(/[^.!?।！？。]+[.!?।！？。]*/g) || [text];

    sentences.forEach((sentence) => {
        let chunk = "";
        for (const character of sentence.trim()) {
            if (encoder.encode(chunk + character).length > maxBytes) {
                if (chunk.trim()) chunks.push(chunk.trim());
                chunk = "";
            }
            chunk += character;
        }
        if (chunk.trim()) chunks.push(chunk.trim());
    });

    return chunks;
}

function App() {
    const [showLogin, setShowLogin] = React.useState(false);
    const [showRegister, setShowRegister] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState("landing");
    const [isReading, setIsReading] = React.useState(false);
    const [speechMessage, setSpeechMessage] = React.useState("");
    const speechSession = React.useRef(0);
    const speechRequest = React.useRef(null);
    const speechAudio = React.useRef(null);
    const speechAudioUrl = React.useRef("");
    const [language, setLanguage] = React.useState(() => {
        const savedLanguage = localStorage.getItem("ai-farm-language");
        return SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : "English";
    });

    React.useEffect(() => {
        localStorage.setItem("ai-farm-language", language);
        document.documentElement.lang = LANGUAGE_TAGS[language] || "en";
    }, [language]);

    const t = (text) => translate(text, language);

    const pageKey = showRegister ? "register" : showLogin ? "login" : currentPage;

    const stopSpeech = React.useCallback(() => {
        speechSession.current += 1;
        speechRequest.current?.abort();
        speechRequest.current = null;
        speechAudio.current?.pause();
        speechAudio.current = null;
        if (speechAudioUrl.current) URL.revokeObjectURL(speechAudioUrl.current);
        speechAudioUrl.current = "";
        setIsReading(false);
    }, []);

    React.useEffect(() => {
        stopSpeech();
        setSpeechMessage("");
    }, [language, pageKey, stopSpeech]);

    React.useEffect(() => () => {
        speechSession.current += 1;
        speechRequest.current?.abort();
        speechAudio.current?.pause();
        if (speechAudioUrl.current) URL.revokeObjectURL(speechAudioUrl.current);
    }, []);

    const toggleReading = async () => {
        if (isReading) {
            stopSpeech();
            setSpeechMessage(t("Reading stopped."));
            return;
        }

        const pageContent = document.querySelector(".app-page-content");
        const readableContent = pageContent?.cloneNode(true);
        readableContent?.querySelectorAll("script, style, [aria-hidden='true'], [hidden]").forEach((element) => element.remove());
        const text = (readableContent?.innerText || readableContent?.textContent)?.replace(/\s+/g, " ").trim();
        if (!text) {
            setSpeechMessage(t("There is no page content to read."));
            return;
        }

        const chunks = splitTextByUtf8(text, 4500);

        const session = ++speechSession.current;
        const languageCode = LANGUAGE_TAGS[language] || LANGUAGE_TAGS.English;
        const playChunk = async (index, audioChunks = null, audioIndex = 0) => {
            if (session !== speechSession.current) return;
            if (index >= chunks.length) {
                setIsReading(false);
                setSpeechMessage(t("Finished reading the page."));
                return;
            }

            const controller = new AbortController();
            speechRequest.current = controller;
            try {
                if (!audioChunks) {
                    let speechText = chunks[index];
                    if (language !== "English") {
                        const translationResponse = await fetch("/api/tts/translate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                text: speechText,
                                target_language: TRANSLATION_TAGS[language],
                            }),
                            signal: controller.signal,
                        });
                        if (session !== speechSession.current) return;
                        if (!translationResponse.ok) {
                            const result = await translationResponse.json().catch(() => ({}));
                            throw new Error(result.detail || t("Page translation could not be completed."));
                        }
                        const result = await translationResponse.json();
                        speechText = result.translated_text;
                    }

                    speechRequest.current = null;
                    await playChunk(index, splitTextByUtf8(speechText, 4500), 0);
                    return;
                }

                if (audioIndex >= audioChunks.length) {
                    speechRequest.current = null;
                    await playChunk(index + 1);
                    return;
                }

                const response = await fetch("/api/tts/synthesize", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: audioChunks[audioIndex], language_code: languageCode }),
                    signal: controller.signal,
                });
                if (session !== speechSession.current) return;
                if (!response.ok) {
                    const result = await response.json().catch(() => ({}));
                    throw new Error(result.detail || t("Reading could not be completed. Check the speech service configuration."));
                }

                const audioBlob = await response.blob();
                if (session !== speechSession.current) return;
                speechRequest.current = null;
                speechAudioUrl.current = URL.createObjectURL(audioBlob);
                const audio = new Audio(speechAudioUrl.current);
                speechAudio.current = audio;
                audio.addEventListener("ended", () => {
                    if (speechAudioUrl.current) URL.revokeObjectURL(speechAudioUrl.current);
                    speechAudioUrl.current = "";
                    speechAudio.current = null;
                    void playChunk(index, audioChunks, audioIndex + 1);
                }, { once: true });
                audio.addEventListener("error", () => {
                    if (session !== speechSession.current) return;
                    stopSpeech();
                    setSpeechMessage(t("Reading could not be completed. Check the speech service configuration."));
                }, { once: true });
                await audio.play();
            } catch (error) {
                if (session !== speechSession.current || error.name === "AbortError") return;
                stopSpeech();
                setSpeechMessage(error.message || t("Reading could not be completed. Check the speech service configuration."));
            }
        };

        setSpeechMessage("");
        setIsReading(true);
        await playChunk(0);
    };

    const openDashboard = (name) => {
        setShowLogin(false);
        setShowRegister(false);
        setCurrentPage("dashboard");
        setSignedInName(name || "Bargav");
    };

    const [signedInName, setSignedInName] = React.useState("Bargav");

    let page;
    if (showRegister) {
        page = <Register language={language} onLanguageChange={setLanguage} onBack={() => setShowRegister(false)} onComplete={openDashboard} />;
    } else if (showLogin) {
        page = <Login
            language={language}
            onBack={() => setShowLogin(false)}
            onCreateAccount={() => {
                setShowLogin(false);
                setShowRegister(true);
            }}
            onLogin={() => openDashboard("Bargav")}
        />;
    } else if (currentPage !== "landing") {
        page = <FarmerDashboard activePage={currentPage} onNavigate={setCurrentPage} name={signedInName} language={language} />;
    } else {
        page = <Landing onGetStarted={() => setShowLogin(true)} language={language} />;
    }

    return (
        <>
            <div className="language-controls">
                <label className="language-switcher">
                    <span>{t("Select language")}</span>
                    <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t("Select language")}>
                        {SUPPORTED_LANGUAGES.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </label>
                <button
                    className={`speech-button ${isReading ? "is-reading" : ""}`}
                    type="button"
                    onClick={toggleReading}
                    aria-label={t(isReading ? "Stop reading" : "Read page aloud")}
                    aria-pressed={isReading}
                >
                    <span className="speech-icon" aria-hidden="true">{isReading ? "■" : "♫"}</span>
                    <span>{t(isReading ? "Stop reading" : "Read page aloud")}</span>
                </button>
            </div>
            {speechMessage && <p className="speech-status" role="status">{speechMessage}</p>}
            <div className="app-page-content" key={pageKey}>{page}</div>
            <style>{`
                .language-controls{position:fixed;right:18px;bottom:16px;z-index:1000;display:flex;align-items:center;gap:9px;padding:7px;border:1px solid #d8eadb;border-radius:15px;background:#fffffff2;box-shadow:0 8px 28px #123f2a20;backdrop-filter:blur(12px);animation:controls-enter .45s cubic-bezier(.2,.8,.2,1) both}
                .language-switcher{display:flex;align-items:center;gap:8px;padding:2px 5px;color:#315a42;font:600 12px Arial,sans-serif}
                .language-switcher select{max-width:145px;padding:8px 10px;border:1px solid #d8e7db;border-radius:9px;color:#123f2a;background:#fff;font:600 12px Arial,sans-serif;cursor:pointer;transition:border-color .2s,box-shadow .2s,transform .2s}
                .language-switcher select:hover,.language-switcher select:focus-visible{border-color:#208c4a;box-shadow:0 0 0 3px #208c4a19;outline:0;transform:translateY(-1px)}
                .speech-button{display:flex;align-items:center;justify-content:center;gap:8px;min-height:38px;padding:0 13px;border:0;border-radius:10px;color:#fff;background:linear-gradient(135deg,#208c4a,#146b38);box-shadow:0 4px 12px #208c4a35;font:700 12px Arial,sans-serif;cursor:pointer;transition:transform .2s,box-shadow .2s,background .2s}
                .speech-button:hover{transform:translateY(-2px);box-shadow:0 7px 17px #208c4a45}
                .speech-button:active{transform:scale(.96)}
                .speech-button:focus-visible{outline:3px solid #8cc496;outline-offset:3px}
                .speech-button.is-reading{background:linear-gradient(135deg,#b94a3b,#88372d)}
                .speech-button.is-reading .speech-icon{animation:speech-pulse .8s ease-in-out infinite alternate}
                .speech-icon{font-size:16px;line-height:1}
                .speech-status{position:fixed;right:18px;bottom:76px;z-index:1000;max-width:min(380px,calc(100vw - 36px));margin:0;padding:10px 14px;border:1px solid #d8eadb;border-radius:10px;color:#315a42;background:#fff;box-shadow:0 5px 20px #123f2a18;font:13px/1.45 Arial,sans-serif;animation:controls-enter .25s ease both}
                .app-page-content{animation:page-enter .5s cubic-bezier(.2,.75,.25,1) both}
                .landing-page .hero-content{animation:page-enter .65s .08s both}
                .landing-page .hero-visual{animation:page-enter .7s .16s both}
                .landing-page .floating-card{animation:gentle-float 4s ease-in-out infinite}
                .landing-page .ai-card{animation-delay:-2s}
                .landing-page .problem-card,.landing-page .feature-card,.landing-page .advantage,.landing-page .step{animation:card-enter .55s both}
                .landing-page .problem-card:nth-child(2),.landing-page .feature-card:nth-child(2),.landing-page .advantage:nth-child(2),.landing-page .step:nth-child(2){animation-delay:.08s}
                .landing-page .problem-card:nth-child(3),.landing-page .feature-card:nth-child(3),.landing-page .advantage:nth-child(3),.landing-page .step:nth-child(3){animation-delay:.16s}
                .landing-page .problem-card:nth-child(4),.landing-page .feature-card:nth-child(4),.landing-page .advantage:nth-child(4),.landing-page .step:nth-child(4){animation-delay:.24s}
                .dashboard-sidebar{animation:sidebar-enter .5s cubic-bezier(.2,.75,.25,1) both}
                .dashboard-topbar,.dashboard-home,.disease-shell{animation:page-enter .5s cubic-bezier(.2,.75,.25,1) both}
                .dashboard-welcome-grid>div{transition:transform .22s,box-shadow .22s,border-color .22s}
                .dashboard-welcome-grid>div:hover{transform:translateY(-4px);border-color:#a8d5af;box-shadow:0 14px 30px #245b3718}
                @keyframes controls-enter{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
                @keyframes page-enter{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
                @keyframes card-enter{from{opacity:0;transform:translateY(15px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
                @keyframes sidebar-enter{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
                @keyframes gentle-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
                @keyframes speech-pulse{from{transform:scale(1);opacity:.8}to{transform:scale(1.22);opacity:1}}
                @media(max-width:560px){.language-controls{right:8px;bottom:8px;gap:5px;padding:5px;border-radius:13px}.language-switcher{padding:2px}.language-switcher>span{display:none}.language-switcher select{max-width:105px;padding:8px 7px}.speech-button{min-height:36px;padding:0 10px;font-size:11px}.speech-status{right:8px;bottom:62px}}
                @media(prefers-reduced-motion:reduce){.language-controls,.speech-status,.app-page-content,.landing-page .hero-content,.landing-page .hero-visual,.landing-page .problem-card,.landing-page .feature-card,.landing-page .advantage,.landing-page .step,.landing-page .floating-card,.dashboard-sidebar,.dashboard-topbar,.dashboard-home,.disease-shell{animation:none!important}.speech-button.is-reading .speech-icon{animation:none}.language-switcher select,.speech-button,.dashboard-welcome-grid>div{transition:none}}
            `}</style>
        </>
    );
}

export default App;