import FarmFeaturePage from "../components/FarmFeaturePage";

export default function MarketPrediction(props) {
	return <FarmFeaturePage {...props} title="Market Price Prediction" icon="💰" description="Enter produce and market information for a price prediction." fields={[{ name: "crop", label: "Produce", required: true }, { name: "market", label: "Market or location", required: true }, { name: "quantity", label: "Quantity", type: "number", required: true }]} />;
}
