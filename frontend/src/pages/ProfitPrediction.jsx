import FarmFeaturePage from "../components/FarmFeaturePage";

export default function ProfitPrediction(props) {
	return <FarmFeaturePage {...props} title="Profit Prediction" icon="💹" description="Enter expected costs and produce details for a profit estimate." fields={[{ name: "crop", label: "Crop", required: true }, { name: "revenue", label: "Expected revenue", type: "number", required: true }, { name: "cost", label: "Expected cost", type: "number", required: true }]} />;
}
