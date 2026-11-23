import FarmFeaturePage from "../components/FarmFeaturePage";

export default function CropRecommendation(props) {
	return <FarmFeaturePage {...props} title="Crop Recommendation" icon="🌱" description="Enter farm conditions to request a crop recommendation." fields={[{ name: "soil", label: "Soil type", required: true }, { name: "season", label: "Season", required: true }, { name: "location", label: "Location", required: true }]} />;
}
