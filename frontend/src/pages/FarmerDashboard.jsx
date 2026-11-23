import CropRecommendation from "./CropRecommendation";
import DiseaseDetection from "./DiseaseDetection";
import WeatherAdvisory from "./WeatherAdvisory";
import YieldPrediction from "./YieldPrediction";
import MarketPrediction from "./MarketPrediction";
import FertilizerRecommendation from "./FertilizerRecommendation";
import SoilHealth from "./SoilHealth";
import ProfitPrediction from "./ProfitPrediction";
import Support from "./Support";
import { translate } from "../i18n";

const features = [
    ["crop", "🌱", "Crop Recommendation"],
    ["disease", "🦠", "Plant Disease Detection"],
    ["weather", "🌦️", "Weather-Based Advisory"],
    ["yield", "📈", "Crop Yield Prediction"],
    ["market", "💰", "Market Price Prediction"],
    ["fertilizer", "🌿", "Fertilizer Recommendation"],
    ["soil", "🌍", "Soil Health Analysis"],
    ["profit", "💹", "Profit Prediction"],
    ["support", "🤖", "Contact the support team"],
];

const featurePages = { crop: CropRecommendation, disease: DiseaseDetection, weather: WeatherAdvisory, yield: YieldPrediction, market: MarketPrediction, fertilizer: FertilizerRecommendation, soil: SoilHealth, profit: ProfitPrediction, support: Support };

function DashboardHome({ name, onNavigate, language }) {
    const t = (text) => translate(text, language);
    return <section className="dashboard-home"><p className="dashboard-kicker">🌱 {t("AI FARM DASHBOARD")}</p><h2>{t(`Welcome, ${name}!`)}</h2><p className="dashboard-lead">{t("Choose a feature from the left to manage your farm, upload information, and view AI-powered recommendations.")}</p><div className="dashboard-welcome-grid"><div><strong>{t("Manage farm information")}</strong><span>{t("Keep your location, land, and farm details ready for every tool.")}</span></div><div><strong>{t("View predictions and recommendations")}</strong><span>{t("Open any feature to enter information and request a result.")}</span></div><div><strong>{t("Generate reports")}</strong><span>{t("Use the Reports area when report generation is connected to the backend.")}</span></div><div><strong>{t("Raise support tickets")}</strong><span>{t("Contact the support team whenever you need help.")}</span><button type="button" onClick={() => onNavigate("support")}>{t("Contact support →")}</button></div></div></section>;
}

export default function FarmerDashboard({ activePage, onNavigate, name, language = "English" }) {
    const t = (text) => translate(text, language);
    const SelectedFeature = featurePages[activePage];
    return <main className="dashboard-layout">
        <aside className="dashboard-sidebar">
            <div className="dashboard-brand"><span>🌱</span><div><strong>AI Farm</strong><small>{t("Smart Farming")}</small></div></div>
            <div className="dashboard-user"><span>{name.slice(0, 1).toUpperCase()}</span><div><strong>{name}</strong><small>{t("Farmer")}</small></div></div>
            <nav className="dashboard-nav" aria-label="Farm features">
                <button className={activePage === "dashboard" ? "selected" : ""} type="button" onClick={() => onNavigate("dashboard")}><span>⌂</span>{t("Dashboard")}</button>
                <p>{t("AI FARMING TOOLS")}</p>
                {features.map(([route, icon, title]) => <button className={activePage === route ? "selected" : ""} type="button" key={route} onClick={() => onNavigate(route)}><span>{icon}</span>{t(title)}</button>)}
            </nav>
            <button className="dashboard-logout" type="button" onClick={() => onNavigate("landing")}>↪ {t("Log out")}</button>
        </aside>
        <section className="dashboard-content"><header className="dashboard-topbar"><div><span>AI FARM / {activePage === "dashboard" ? t("DASHBOARD") : t(features.find(([route]) => route === activePage)?.[2] || "FEATURE")}</span><h1>{activePage === "dashboard" ? t(`Good morning, ${name}`) : t("Your farming workspace")}</h1></div><div className="dashboard-avatar">{name.slice(0, 1).toUpperCase()}</div></header>{SelectedFeature ? <SelectedFeature onNavigate={onNavigate} embedded language={language} /> : <DashboardHome name={name} onNavigate={onNavigate} language={language} />}</section>
        <style>{`
            .dashboard-layout{display:flex;min-height:100vh;color:#123f2a;background:#f4faf4;font-family:Arial,sans-serif}.dashboard-sidebar{position:sticky;top:0;display:flex;width:285px;height:100vh;flex-shrink:0;flex-direction:column;padding:24px 16px;border-right:1px solid #dcecdf;background:#fff}.dashboard-brand{display:flex;align-items:center;gap:11px;padding:0 10px 25px;border-bottom:1px solid #e5efe6}.dashboard-brand>span{display:grid;place-items:center;width:42px;height:42px;border-radius:13px;color:#fff;background:#208c4a;font-size:24px}.dashboard-brand strong,.dashboard-user strong{display:block;font-size:16px}.dashboard-brand small,.dashboard-user small{display:block;margin-top:4px;color:#7b9181;font-size:11px}.dashboard-user{display:flex;align-items:center;gap:10px;padding:23px 10px 18px}.dashboard-user>span,.dashboard-avatar{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;color:#fff;background:#123f2a;font-weight:700}.dashboard-nav{display:flex;flex:1;flex-direction:column;gap:3px;overflow:auto}.dashboard-nav p{margin:20px 10px 8px;color:#9aaa9d;font-size:10px;font-weight:700;letter-spacing:1.5px}.dashboard-nav button,.dashboard-logout{display:flex;align-items:center;gap:10px;width:100%;padding:11px 12px;border:0;border-radius:9px;text-align:left;color:#46634e;background:transparent;font:600 13px Arial;cursor:pointer;transition:.2s}.dashboard-nav button span{display:grid;place-items:center;width:23px;font-size:17px}.dashboard-nav button:hover{color:#123f2a;background:#edf8ee;transform:translateX(2px)}.dashboard-nav button.selected{color:#fff;background:#208c4a;box-shadow:0 7px 14px #208c4a2b}.dashboard-nav button.selected:hover{color:#fff;background:#123f2a}.dashboard-logout{border-top:1px solid #e5efe6;border-radius:0;padding:18px 12px 4px;color:#b15b50}.dashboard-content{min-width:0;flex:1;padding:32px clamp(24px,5vw,70px)}.dashboard-topbar{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;margin:0 auto 28px;max-width:1000px}.dashboard-topbar span{color:#208c4a;font-size:10px;font-weight:700;letter-spacing:1.5px}.dashboard-topbar h1{margin:8px 0 0;font-size:clamp(23px,3vw,34px)}.dashboard-avatar{width:44px;height:44px}.dashboard-home{max-width:1000px;margin:auto}.dashboard-kicker{margin:0 0 12px;color:#208c4a;font-size:11px;font-weight:700;letter-spacing:2px}.dashboard-home h2{margin:0;font-size:clamp(35px,6vw,62px);line-height:1.03}.dashboard-lead{max-width:650px;margin:18px 0 35px;color:#668073;font-size:16px;line-height:1.65}.dashboard-welcome-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.dashboard-welcome-grid>div{display:flex;min-height:145px;flex-direction:column;padding:22px;border:1px solid #d8eadb;border-radius:16px;background:#fff;box-shadow:0 10px 25px #245b3710}.dashboard-welcome-grid strong{font-size:16px}.dashboard-welcome-grid span{margin-top:9px;color:#668073;font-size:13px;line-height:1.5}.dashboard-welcome-grid button{align-self:flex-start;margin-top:auto;border:0;color:#208c4a;background:transparent;font-weight:700;cursor:pointer}.dashboard-welcome-grid button:hover{text-decoration:underline}@media(max-width:850px){.dashboard-sidebar{width:235px}.dashboard-content{padding:25px 20px}}@media(max-width:650px){.dashboard-layout{display:block}.dashboard-sidebar{position:relative;width:100%;height:auto;padding:16px}.dashboard-brand{padding-bottom:15px}.dashboard-user{padding:15px 10px}.dashboard-nav{max-height:265px;overflow:auto}.dashboard-nav p{margin-top:12px}.dashboard-logout{margin-top:12px}.dashboard-content{padding:25px 17px}.dashboard-welcome-grid{grid-template-columns:1fr}}
        `}</style>
    </main>;
}
