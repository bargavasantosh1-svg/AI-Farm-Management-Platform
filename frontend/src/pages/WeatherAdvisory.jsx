import FarmFeaturePage from "../components/FarmFeaturePage";

export default function WeatherAdvisory(props) {
	return <FarmFeaturePage {...props} title="Weather-Based Advisory" icon="🌦️" description="Use your saved farm location to request weather guidance." fields={[{ name: "location", label: "Farm location", required: true }, { name: "crop", label: "Current crop", required: true }]} />;
}
