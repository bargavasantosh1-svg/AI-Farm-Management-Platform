import FarmFeaturePage from "../components/FarmFeaturePage";

export default function SoilHealth(props) {
	return <FarmFeaturePage {...props} title="Soil Health Analysis" icon="🌍" description="Upload a soil report or enter soil readings for analysis." upload fields={[{ name: "ph", label: "Soil pH" }, { name: "nitrogen", label: "Nitrogen" }, { name: "phosphorus", label: "Phosphorus" }, { name: "potassium", label: "Potassium" }]} />;
}
