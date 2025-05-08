import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ProductionLineChart = ({ prodData }) => {
    if (!prodData) return null;

    // Group by day
    const dayTotals = {};
    prodData.forEach(item => {
        const date = new Date(item.Date);
        const day = date.getDate(); // or use date.toISOString().split('T')[0] for full date
        dayTotals[day] = (dayTotals[day] || 0) + (item.Quantity || 0);
    });

    // Turn into array for recharts
    const chartData = Object.entries(dayTotals).map(([day, value]) => ({
        day: `Day ${day}`,
        quantity: value
    })).sort((a, b) => parseInt(a.day.split(" ")[1]) - parseInt(b.day.split(" ")[1]));

    return (
        <ResponsiveContainer width={1000} height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="quantity" stroke="#8884d8" name="Produced" />
            </LineChart>
        </ResponsiveContainer>
    );
};
