import FarmFeaturePage from "../components/FarmFeaturePage";

export default function FertilizerRecommendation(props) {
	return <FarmFeaturePage {...props} title="Fertilizer Recommendation" icon="🌿" description="Provide crop and soil information for fertilizer guidance." fields={[{ name: "crop", label: "Crop", required: true }, { name: "soil", label: "Soil type", required: true }, { name: "stage", label: "Growth stage", required: true }]} />;
}
