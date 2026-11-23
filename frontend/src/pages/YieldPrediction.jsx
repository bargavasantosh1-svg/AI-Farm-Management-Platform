import FarmFeaturePage from "../components/FarmFeaturePage";

export default function YieldPrediction(props) {
	return <FarmFeaturePage {...props} title="Crop Yield Prediction" icon="📈" description="Provide crop and farm information for a yield prediction." fields={[{ name: "crop", label: "Crop", required: true }, { name: "area", label: "Land area", type: "number", required: true }, { name: "season", label: "Season", required: true }]} />;
}
