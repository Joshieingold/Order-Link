import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ProductionByPersonChart = ({ prodData }) => {
    if (!prodData) return null;

    // Step 1: Group by Name and sum Quantity
    const personTotals = {};
    prodData.forEach(item => {
        const name = item.Name || "Unknown";
        personTotals[name] = (personTotals[name] || 0) + (item.Quantity || 0);
    });

    // Step 2: Convert to chart data
    const chartData = Object.entries(personTotals).map(([name, quantity]) => ({
        name,
        quantity
    }));

    return (
        <ResponsiveContainer width={"100%"} height={"90%"}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="blue" name="Total Produced" />
            </BarChart>
        </ResponsiveContainer>
    );
};
