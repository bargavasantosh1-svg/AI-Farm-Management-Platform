import FarmFeaturePage from "../components/FarmFeaturePage";

export default function Support(props) {
	return <FarmFeaturePage {...props} title="Contact the support team" icon="🤖" description="Raise a support ticket and tell the team how we can help." fields={[{ name: "subject", label: "Subject", required: true }, { name: "message", label: "Describe your issue", required: true }]} />;
}
